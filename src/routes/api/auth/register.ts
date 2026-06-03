import { createFileRoute } from '@tanstack/react-router'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { render } from '@react-email/components'
import * as React from 'react'
import { z } from 'zod'
import { TEMPLATES } from '@/lib/email-templates/registry'

const bodySchema = z.object({
  email: z.string().trim().email().max(320),
  password: z.string().min(8, 'Passord må være minst 8 tegn').max(128),
  name: z.string().trim().min(1).max(120).optional(),
})

const SITE_NAME = 'Rytterbakken'
const FROM_DOMAIN = 'mindmatter.no'
const SITE_URL = process.env.VITE_SITE_URL || 'https://rytterbakken.mindmatter.no'

export const Route = createFileRoute('/api/auth/register')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const supabaseUrl = process.env.SUPABASE_URL
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
        const resendApiKey = process.env.RESEND_API_KEY

        if (!supabaseUrl || !supabaseServiceKey || !resendApiKey) {
          return Response.json({ error: 'Server configuration error' }, { status: 500 })
        }

        let email: string, password: string, name: string | undefined
        try {
          const json = await request.json()
          const parsed = bodySchema.parse(json)
          email = parsed.email
          password = parsed.password
          name = parsed.name
        } catch (err: any) {
          const msg = err?.issues?.[0]?.message ?? 'Ugyldig input'
          return Response.json({ error: msg }, { status: 400 })
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey, {
          auth: { autoRefreshToken: false, persistSession: false },
        })

        // Create user without confirming email
        const { data: userData, error: createError } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: false,
          user_metadata: { name: name ?? null },
        })

        if (createError) {
          if (createError.message.includes('already')) {
            return Response.json({ error: 'already_exists' }, { status: 409 })
          }
          console.error('createUser error', createError)
          return Response.json({ error: 'Kunne ikke opprette konto' }, { status: 500 })
        }

        // Generate email verification link
        const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
          type: 'signup',
          email,
          options: { redirectTo: `${SITE_URL}/auth/callback` },
        })

        if (linkError || !linkData?.properties?.action_link) {
          console.error('generateLink error', linkError)
          return Response.json({ error: 'Kunne ikke generere bekreftelseslenke' }, { status: 500 })
        }

        const verifyUrl = linkData.properties.action_link
        const template = TEMPLATES['member-verify']
        const templateProps = { name, verifyUrl }
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
          console.error('Failed to send verification email', err)
          return Response.json({ error: 'Konto opprettet, men bekreftelses-e-posten feilet' }, { status: 500 })
        }

        return Response.json({ success: true, status: 'verification_sent' })
      },
    },
  },
})
