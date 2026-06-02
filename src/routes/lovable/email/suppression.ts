import { createClient } from '@supabase/supabase-js'
import { Webhook } from 'svix'
import { createFileRoute } from '@tanstack/react-router'

interface ResendWebhookEvent {
  type: string
  created_at?: string
  data: {
    email_id?: string
    from?: string
    to?: string[]
    subject?: string
    [key: string]: unknown
  }
}

function mapEventToReason(type: string): 'bounce' | 'complaint' | null {
  switch (type) {
    case 'email.bounced': return 'bounce'
    case 'email.complained': return 'complaint'
    default: return null
  }
}

function mapReasonToStatus(reason: string): 'bounced' | 'complained' | 'suppressed' {
  switch (reason) {
    case 'bounce': return 'bounced'
    case 'complaint': return 'complained'
    default: return 'suppressed'
  }
}

function mapReasonToMessage(reason: string): string {
  switch (reason) {
    case 'bounce': return 'Permanent bounce — email address is invalid or rejected'
    case 'complaint': return 'Spam complaint — recipient marked email as spam'
    default: return 'Email suppressed'
  }
}

export const Route = createFileRoute("/lovable/email/suppression")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const webhookSecret = process.env.RESEND_WEBHOOK_SECRET
        const supabaseUrl = process.env.SUPABASE_URL
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (!webhookSecret || !supabaseUrl || !supabaseServiceKey) {
          console.error('Missing required environment variables')
          return Response.json({ error: 'Server configuration error' }, { status: 500 })
        }

        // Verify Resend webhook signature (Svix)
        const svixId = request.headers.get('svix-id')
        const svixTimestamp = request.headers.get('svix-timestamp')
        const svixSignature = request.headers.get('svix-signature')

        if (!svixId || !svixTimestamp || !svixSignature) {
          return Response.json({ error: 'Missing webhook signature headers' }, { status: 401 })
        }

        const body = await request.text()
        let event: ResendWebhookEvent
        try {
          const wh = new Webhook(webhookSecret)
          event = wh.verify(body, {
            'svix-id': svixId,
            'svix-timestamp': svixTimestamp,
            'svix-signature': svixSignature,
          }) as ResendWebhookEvent
        } catch (error) {
          const msg = error instanceof Error ? error.message : String(error)
          console.error('Webhook verification failed', { error: msg })
          return Response.json({ error: 'Invalid webhook signature' }, { status: 401 })
        }

        const reason = mapEventToReason(event.type)
        if (!reason) {
          // Unhandled event type — acknowledge without processing
          return Response.json({ success: true, skipped: true })
        }

        const recipients = event.data.to ?? []
        if (recipients.length === 0) {
          console.warn('Suppression event has no recipients', { type: event.type })
          return Response.json({ success: true, skipped: true })
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey)

        for (const email of recipients) {
          const normalizedEmail = email.toLowerCase()

          const { error: suppressError } = await supabase
            .from('suppressed_emails')
            .upsert(
              { email: normalizedEmail, reason, metadata: { event_type: event.type, email_id: event.data.email_id ?? null } },
              { onConflict: 'email' },
            )

          if (suppressError) {
            console.error('Failed to upsert suppressed email', {
              error: suppressError,
              email_redacted: normalizedEmail[0] + '***@' + normalizedEmail.split('@')[1],
            })
            return Response.json({ error: 'Failed to write suppression' }, { status: 500 })
          }

          await supabase.from('email_send_log').insert({
            message_id: event.data.email_id ?? null,
            template_name: 'system',
            recipient_email: normalizedEmail,
            status: mapReasonToStatus(reason),
            error_message: mapReasonToMessage(reason),
            metadata: { event_type: event.type },
          })

          console.log('Suppression processed', {
            type: event.type,
            email_redacted: normalizedEmail[0] + '***@' + normalizedEmail.split('@')[1],
          })
        }

        return Response.json({ success: true })
      },
    },
  },
})
