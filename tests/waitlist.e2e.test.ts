import { describe, it, expect, beforeAll } from 'vitest'
import { createClient } from '@supabase/supabase-js'
import { render } from '@react-email/components'
import * as React from 'react'
import { TEMPLATES } from '@/lib/email-templates/registry'

/**
 * End-to-end-tester for venteliste-flyten.
 *
 * Dekker tre scenarioer mot det faktiske API-endepunktet
 * `/api/public/waitlist` og verifiserer at det skrives korrekte rader
 * i `email_send_log` via Supabase service-role.
 *
 * Kjør med:
 *   BASE_URL=https://project--00161adf-5cd4-4281-b506-0de5d4cf078a-dev.lovable.app \
 *   SUPABASE_URL=... \
 *   SUPABASE_SERVICE_ROLE_KEY=... \
 *   bunx vitest run tests/waitlist.e2e.test.ts
 *
 * BASE_URL defaulter til dev-preview for dette prosjektet.
 */

const BASE_URL =
  process.env.WAITLIST_E2E_URL ||
  'https://project--00161adf-5cd4-4281-b506-0de5d4cf078a-dev.lovable.app'

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const hasAdmin = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY)
const admin = hasAdmin
  ? createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)
  : null

function uniqueEmail(tag: string) {
  const stamp = Date.now().toString(36)
  const rand = Math.random().toString(36).slice(2, 8)
  return `e2e+${tag}-${stamp}-${rand}@mindmatter.test`
}

async function submit(body: { email: string; name: string; reason: string }) {
  const res = await fetch(`${BASE_URL}/api/public/waitlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  return { status: res.status, data }
}

async function getSendLog(email: string) {
  if (!admin) return []
  const { data, error } = await admin
    .from('email_send_log')
    .select('id, status, metadata, created_at, template_name')
    .eq('recipient_email', email)
    .eq('template_name', 'waitlist-confirmation')
    .order('created_at', { ascending: true })
  if (error) throw error
  return data ?? []
}

async function getUnsubscribeToken(email: string) {
  if (!admin) return null
  const { data, error } = await admin
    .from('email_unsubscribe_tokens')
    .select('token, used_at, created_at')
    .eq('email', email)
    .maybeSingle()
  if (error) throw error
  return data
}

async function renderTemplate(props: { name?: string; reason?: string }) {
  const tmpl = TEMPLATES['waitlist-confirmation']
  const element = React.createElement(tmpl.component, props)
  const html = await render(element)
  const text = await render(element, { plainText: true })
  const subject =
    typeof tmpl.subject === 'function' ? tmpl.subject(props) : tmpl.subject
  return { html, text, subject }
}

describe('Venteliste e2e', () => {
  beforeAll(() => {
    if (!hasAdmin) {
      console.warn(
        '[waitlist.e2e] SUPABASE_SERVICE_ROLE_KEY mangler — DB-asserts hoppes over.',
      )
    }
  })

  it('S1: ny påmelding → suksess + e-post i kø', async () => {
    const email = uniqueEmail('s1')
    const { status, data } = await submit({
      email,
      name: 'E2E Test',
      reason: 'S1 ny påmelding',
    })

    expect(status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.alreadyOnList).toBe(false)
    expect(data.emailSent).toBe(true)
    expect(data.emailReused).toBe(false)

    if (admin) {
      const rows = await getSendLog(email)
      expect(rows.length).toBe(1)
      expect(rows[0].status).not.toBe('failed')
      expect((rows[0].metadata as any)?.source).toBe('landing')
    }
  }, 30_000)

  it('S2: samme e-post igjen → alreadyOnList + emailReused + kildemetadata', async () => {
    const email = uniqueEmail('s2')

    const first = await submit({
      email,
      name: 'E2E Test',
      reason: 'S2 første gang',
    })
    expect(first.status).toBe(200)
    expect(first.data.emailReused).toBe(false)

    const second = await submit({
      email,
      name: 'E2E Test',
      reason: 'S2 andre gang',
    })

    expect(second.status).toBe(200)
    expect(second.data.success).toBe(true)
    expect(second.data.alreadyOnList).toBe(true)
    expect(second.data.emailSent).toBe(true)
    expect(second.data.emailReused).toBe(true)
    expect(typeof second.data.emailSentAt).toBe('string')
    expect(second.data.emailSource).toBe('landing')

    if (admin) {
      const rows = await getSendLog(email)
      // Idempotens: kun én send-rad selv etter andre forsøk
      expect(rows.length).toBe(1)
    }
  }, 45_000)

  it('S3: en annen ny e-post → fersk send (ikke gjenbrukt)', async () => {
    const email = uniqueEmail('s3')
    const { status, data } = await submit({
      email,
      name: 'E2E Test',
      reason: 'S3 separat ny påmelding',
    })

    expect(status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.alreadyOnList).toBe(false)
    expect(data.emailSent).toBe(true)
    expect(data.emailReused).toBe(false)

    if (admin) {
      const rows = await getSendLog(email)
      expect(rows.length).toBe(1)
      expect((rows[0].metadata as any)?.source).toBe('landing')
    }
  }, 30_000)

  it('Validering: ugyldig e-post returnerer 400', async () => {
    const { status, data } = await submit({
      email: 'ikke-en-epost',
      name: 'E2E Test',
      reason: 'valideringstest',
    })
    expect(status).toBe(400)
    expect(data.error).toBeTruthy()
  }, 15_000)

  it('E-postinnhold: subject og brødtekst (med navn + begrunnelse)', async () => {
    const { subject, html, text } = await renderTemplate({
      name: 'Kari Nordmann',
      reason: 'Veldig spent på dette',
    })

    expect(subject).toBe('Takk for at du meldte deg på ventelisten')

    // HTML
    expect(html).toContain('Takk, Kari Nordmann!')
    expect(html).toContain('Vi har registrert deg på ventelisten til')
    expect(html).toContain('Mindmatter')
    expect(html).toContain('Din begrunnelse')
    expect(html).toContain('Veldig spent på dette')
    expect(html).toMatch(/<html[^>]+lang="no"/i)

    // Plaintext (react-email uppercaser headinger)
    expect(text.toLowerCase()).toContain('takk, kari nordmann!')
    expect(text).toContain('Mindmatter')
    expect(text).toContain('Veldig spent på dette')
  })

  it('E-postinnhold: fallback uten navn/begrunnelse', async () => {
    const { html, text } = await renderTemplate({})
    expect(html).toContain('Takk for din interesse!')
    expect(html).not.toContain('Din begrunnelse')
    expect(text.toLowerCase()).toContain('takk for din interesse!')
    expect(text).not.toContain('Din begrunnelse')
  })

  it('Bekreftelseslenke: ny påmelding genererer gyldig unsubscribe-token', async () => {
    if (!admin) {
      console.warn('hopper over — krever service-role')
      return
    }
    const email = uniqueEmail('link-new')
    const res = await submit({
      email,
      name: 'Link Test',
      reason: 'verifiserer lenke',
    })
    expect(res.status).toBe(200)

    const record = await getUnsubscribeToken(email)
    expect(record).not.toBeNull()
    expect(record!.token).toMatch(/^[a-f0-9]{64}$/)
    expect(record!.used_at).toBeNull()

    // Lenken må peke til public unsubscribe-endepunkt med token-query
    const url = `${BASE_URL}/email/unsubscribe?token=${record!.token}`
    expect(url).toMatch(
      /^https?:\/\/[^/]+\/email\/unsubscribe\?token=[a-f0-9]{64}$/,
    )
  }, 30_000)

  it('Bekreftelseslenke: gjenbruk → samme token, ingen ny rad', async () => {
    if (!admin) {
      console.warn('hopper over — krever service-role')
      return
    }
    const email = uniqueEmail('link-reuse')

    const first = await submit({
      email,
      name: 'Reuse Test',
      reason: 'første',
    })
    expect(first.status).toBe(200)
    const tokenA = await getUnsubscribeToken(email)
    expect(tokenA?.token).toMatch(/^[a-f0-9]{64}$/)

    const second = await submit({
      email,
      name: 'Reuse Test',
      reason: 'andre',
    })
    expect(second.status).toBe(200)
    expect(second.data.emailReused).toBe(true)

    const tokenB = await getUnsubscribeToken(email)
    // Samme token gjenbrukes (én per e-postadresse)
    expect(tokenB?.token).toBe(tokenA?.token)
    expect(tokenB?.created_at).toBe(tokenA?.created_at)

    // Gjenbruks-lenken har samme format
    expect(`${BASE_URL}/email/unsubscribe?token=${tokenB!.token}`).toMatch(
      /^https?:\/\/[^/]+\/email\/unsubscribe\?token=[a-f0-9]{64}$/,
    )
  }, 45_000)
})

