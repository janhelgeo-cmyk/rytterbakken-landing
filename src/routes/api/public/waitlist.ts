import { createFileRoute } from '@tanstack/react-router'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { render } from '@react-email/components'
import * as React from 'react'
import { z } from 'zod'
import { TEMPLATES } from '@/lib/email-templates/registry'

const SITE_NAME = 'Rytterbakken'
const FROM_DOMAIN = 'mindmatter.no'
const SITE_URL = process.env.VITE_SITE_URL || 'https://rytterbakken.mindmatter.no'

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
        const resendApiKey = process.env.RESEND_API_KEY
        if (!supabaseUrl || !supabaseServiceKey || !resendApiKey) {
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

        // Check suppression list
        const { data: suppressed } = await supabase
          .from('suppressed_emails')
          .select('id')
          .eq('email', email)
          .maybeSingle()
        if (suppressed) {
          return Response.json({ success: true, status: 'suppressed' })
        }

        // Already confirmed on waitlist?
        const { data: existing } = await supabase
          .from('waitlist')
          .select('id')
          .eq('email', email)
          .maybeSingle()
        if (existing) {
          return Response.json({ success: true, status: 'already_confirmed' })
        }

        // Upsert into pending (replace existing pending entry for same email)
        const token = generateToken()
        const { error: pendingError } = await supabase
          .from('waitlist_pending')
          .upsert(
            {
              email,
              name,
              reason,
              source: 'landing',
              token,
              expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            },
            { onConflict: 'email' }
          )
        if (pendingError) {
          console.error('Failed to insert pending waitlist entry', pendingError)
          return Response.json({ error: 'Could not process signup' }, { status: 500 })
        }

        // Re-read to get the actual stored token (upsert may have kept existing)
        const { data: pendingRow } = await supabase
          .from('waitlist_pending')
          .select('token')
          .eq('email', email)
          .maybeSingle()

        const verifyToken = pendingRow?.token ?? token
        const verifyUrl = `${SITE_URL}/api/public/waitlist/verify?token=${verifyToken}`

        // Send verification email directly via Resend (no queue — needs to go out immediately)
        const template = TEMPLATES['waitlist-verify']
        if (!template) {
          return Response.json({ error: 'Template not found' }, { status: 500 })
        }

        const templateProps = { name: name ?? undefined, verifyUrl }
        const html = await render(React.createElement(template.component, templateProps))
        const text = await render(React.createElement(template.component, templateProps), { plainText: true })
        const subject = typeof template.subject === 'function'
          ? template.subject(templateProps)
          : template.subject

        try {
          const resend = new Resend(resendApiKey)
          await resend.emails.send({
            from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
            to: [email],
            subject,
            html,
            text: text ?? undefined,
          })
        } catch (err) {
          console.error('Failed to send verification email', err)
          return Response.json({ error: 'Could not send verification email' }, { status: 500 })
        }

        return Response.json({ success: true, status: 'verification_sent' })
      },
    },
  },
})
