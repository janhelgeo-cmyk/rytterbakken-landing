import { createFileRoute } from '@tanstack/react-router'
import { createClient } from '@supabase/supabase-js'
import { render } from '@react-email/components'
import * as React from 'react'
import { z } from 'zod'
import { TEMPLATES } from '@/lib/email-templates/registry'

const SITE_NAME = 'Mindmatter'
const SENDER_DOMAIN = 'notify.mindmatter.no'
const FROM_DOMAIN = 'notify.mindmatter.no'

const bodySchema = z.object({
  email: z.string().trim().email().max(320),
  name: z.string().trim().min(1).max(120).optional().or(z.literal('')),
  reason: z.string().trim().max(2000).optional().or(z.literal('')),
})

function generateToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export const Route = createFileRoute('/api/public/waitlist')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const supabaseUrl = process.env.SUPABASE_URL
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
        if (!supabaseUrl || !supabaseServiceKey) {
          return Response.json({ error: 'Server configuration error' }, { status: 500 })
        }

        let parsed
        try {
          const json = await request.json()
          parsed = bodySchema.safeParse(json)
        } catch {
          return Response.json({ error: 'Invalid JSON' }, { status: 400 })
        }
        if (!parsed.success) {
          return Response.json({ error: 'Invalid input' }, { status: 400 })
        }

        const email = parsed.data.email.toLowerCase()
        const name = parsed.data.name?.trim() || null
        const reason = parsed.data.reason?.trim() || null

        const supabase = createClient(supabaseUrl, supabaseServiceKey)

        const { error: insertError } = await supabase
          .from('waitlist')
          .insert({ email, name, reason, source: 'landing' })

        let alreadyOnList = false
        if (insertError) {
          if ((insertError as any).code === '23505') {
            alreadyOnList = true
          } else {
            console.error('Waitlist insert failed', insertError)
            return Response.json({ error: 'Could not join waitlist' }, { status: 500 })
          }
        }

        // Send confirmation email. Idempotent: if a non-failed send already
        // exists for this recipient + template, reuse that result instead
        // of enqueueing another email.
        let emailSent = true
        let emailReused = false
        let emailSentAt: string | null = null
        let emailSource: string | null = null
        try {
          const result = await enqueueConfirmation({ supabase, email, name, reason })
          emailReused = result.reused
          emailSentAt = result.sentAt
          emailSource = result.source
        } catch (err) {
          console.error('Failed to enqueue waitlist confirmation', err)
          emailSent = false
        }

        return Response.json({
          success: true,
          alreadyOnList,
          emailSent,
          emailReused,
          emailSentAt,
          emailSource,
        })




      },
    },
  },
})

const WAITLIST_SOURCE = 'landing'

async function enqueueConfirmation(args: {
  supabase: any
  email: string
  name: string | null
  reason: string | null
}): Promise<{ reused: boolean; sentAt: string | null; source: string | null }> {

  const { supabase, email, name, reason } = args
  const templateName = 'waitlist-confirmation'
  const template = TEMPLATES[templateName]
  if (!template) throw new Error('Template not registered')

  // Idempotency: if we've already logged a non-failed send for this
  // recipient + template, reuse the prior result.
  const { data: priorSend } = await supabase
    .from('email_send_log')
    .select('id, status, created_at, metadata')
    .eq('recipient_email', email)
    .eq('template_name', templateName)
    .neq('status', 'failed')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()
  if (priorSend) {
    const priorSource =
      (priorSend.metadata && typeof priorSend.metadata === 'object'
        ? (priorSend.metadata as Record<string, unknown>).source
        : null) ?? null
    return {
      reused: true,
      sentAt: priorSend.created_at ?? null,
      source: typeof priorSource === 'string' ? priorSource : null,
    }
  }

  // Suppression check
  const { data: suppressed } = await supabase
    .from('suppressed_emails')
    .select('id')
    .eq('email', email)
    .maybeSingle()
  if (suppressed) return { reused: true, sentAt: null, source: null }




  // Unsubscribe token (one per email)
  let unsubscribeToken: string
  const { data: existing } = await supabase
    .from('email_unsubscribe_tokens')
    .select('token, used_at')
    .eq('email', email)
    .maybeSingle()

  if (existing && !existing.used_at) {
    unsubscribeToken = existing.token as string
  } else if (!existing) {
    unsubscribeToken = generateToken()
    await supabase
      .from('email_unsubscribe_tokens')
      .upsert(
        { token: unsubscribeToken, email },
        { onConflict: 'email', ignoreDuplicates: true },
      )
    const { data: stored } = await supabase
      .from('email_unsubscribe_tokens')
      .select('token')
      .eq('email', email)
      .maybeSingle()
    if (stored?.token) unsubscribeToken = stored.token as string
  } else {
    // Token used → user previously unsubscribed; skip send
    return { reused: true, sentAt: null, source: null }
  }

  const templateProps = { name: name ?? undefined, reason: reason ?? undefined }
  const html = await render(React.createElement(template.component, templateProps))
  const text = await render(React.createElement(template.component, templateProps), { plainText: true })
  const subject =
    typeof template.subject === 'function'
      ? template.subject({ name, reason })
      : template.subject

  const messageId = crypto.randomUUID()
  await supabase.from('email_send_log').insert({
    message_id: messageId,
    template_name: templateName,
    recipient_email: email,
    status: 'pending',
    metadata: { source: WAITLIST_SOURCE },
  })


  const { error: enqueueError } = await supabase.rpc('enqueue_email', {
    queue_name: 'transactional_emails',
    payload: {
      message_id: messageId,
      to: email,
      from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
      sender_domain: SENDER_DOMAIN,
      subject,
      html,
      text,
      purpose: 'transactional',
      label: templateName,
      idempotency_key: `waitlist-${email}`,
      unsubscribe_token: unsubscribeToken!,
      queued_at: new Date().toISOString(),
    },
  })

  if (enqueueError) {
    await supabase.from('email_send_log').insert({
      message_id: messageId,
      template_name: templateName,
      recipient_email: email,
      status: 'failed',
      error_message: 'Failed to enqueue email',
    })
    throw enqueueError
  }

  return { reused: false, sentAt: null, source: WAITLIST_SOURCE }
}

