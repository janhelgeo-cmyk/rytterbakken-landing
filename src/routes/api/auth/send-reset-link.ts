import { createFileRoute } from '@tanstack/react-router'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { render } from '@react-email/components'
import * as React from 'react'
import { z } from 'zod'
import { TEMPLATES } from '@/lib/email-templates/registry'

const bodySchema = z.object({
  email: z.string().trim().email().max(320),
})

const SITE_NAME = 'Rytterbakken'
const FROM_DOMAIN = 'mindmatter.no'
const SITE_URL = process.env.VITE_SITE_URL || 'https://rytterbakken.mindmatter.no'

export const Route = createFileRoute('/api/auth/send-reset-link')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const supabaseUrl = process.env.SUPABASE_URL
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
        const resendApiKey = process.env.RESEND_API_KEY

        if (!supabaseUrl || !supabaseServiceKey || !resendApiKey) {
          return Response.json({ error: 'Server configuration error' }, { status: 500 })
        }

        let email: string
        try {
          email = bodySchema.parse(await request.json()).email
        } catch {
          return Response.json({ error: 'Ugyldig e-postadresse' }, { status: 400 })
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey, {
          auth: { autoRefreshToken: false, persistSession: false },
        })

        // Generate password reset link — silent if email not found (security)
        const { data, error } = await supabase.auth.admin.generateLink({
          type: 'recovery',
          email,
          options: { redirectTo: `${SITE_URL}/sett-passord` },
        })

        // Always return success to avoid email enumeration
        if (error || !data?.properties?.action_link) {
          console.warn('reset link: no user or error', error?.message)
          return Response.json({ success: true })
        }

        const resetUrl = data.properties.action_link
        const template = TEMPLATES['member-reset']
        const templateProps = { resetUrl }
        const html = await render(React.createElement(template.component, templateProps))
        const text = await render(React.createElement(template.component, templateProps), { plainText: true })

        try {
          const resend = new Resend(resendApiKey)
          await resend.emails.send({
            from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
            reply_to: `post@${FROM_DOMAIN}`,
            to: [email],
            subject: template.subject as string,
            html,
            text: text ?? undefined,
          })
        } catch (err) {
          console.error('Failed to send reset email', err)
        }

        return Response.json({ success: true })
      },
    },
  },
})
