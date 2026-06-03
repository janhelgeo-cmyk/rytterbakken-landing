import { createFileRoute } from '@tanstack/react-router'
import { createClient } from '@supabase/supabase-js'

export const Route = createFileRoute('/api/public/waitlist/verify')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const supabaseUrl = process.env.SUPABASE_URL
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
        const siteUrl = process.env.VITE_SITE_URL || 'https://rytterbakken.mindmatter.no'

        if (!supabaseUrl || !supabaseServiceKey) {
          return Response.redirect(`${siteUrl}/?verified=error`, 302)
        }

        const url = new URL(request.url)
        const token = url.searchParams.get('token')

        if (!token) {
          return Response.redirect(`${siteUrl}/?verified=invalid`, 302)
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey)

        // Look up pending entry
        const { data: pending, error } = await supabase
          .from('waitlist_pending')
          .select('*')
          .eq('token', token)
          .maybeSingle()

        if (error || !pending) {
          return Response.redirect(`${siteUrl}/?verified=invalid`, 302)
        }

        // Check expiry
        if (new Date(pending.expires_at) < new Date()) {
          await supabase.from('waitlist_pending').delete().eq('token', token)
          return Response.redirect(`${siteUrl}/?verified=expired`, 302)
        }

        // Move to confirmed waitlist with timestamp
        const confirmedAt = new Date().toISOString()
        const { error: insertError } = await supabase
          .from('waitlist')
          .upsert(
            {
              email: pending.email,
              name: pending.name,
              reason: pending.reason,
              source: pending.source,
              confirmed_at: confirmedAt,
            },
            { onConflict: 'email' }
          )

        if (insertError) {
          console.error('Failed to confirm waitlist entry', insertError)
          return Response.redirect(`${siteUrl}/?verified=error`, 302)
        }

        // Clean up pending entry
        await supabase.from('waitlist_pending').delete().eq('token', token)

        // Queue confirmation email
        try {
          const { enqueueConfirmation } = await import('../_waitlist-helpers')
          await enqueueConfirmation({ supabase, email: pending.email, name: pending.name, reason: pending.reason })
        } catch (err) {
          console.error('Failed to enqueue confirmation email', err)
          // Non-fatal — user is confirmed, just no confirmation email
        }

        return Response.redirect(`${siteUrl}/?verified=true`, 302)
      },
    },
  },
})
