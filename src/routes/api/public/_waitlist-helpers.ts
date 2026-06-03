import { render } from '@react-email/components'
import * as React from 'react'
import { TEMPLATES } from '@/lib/email-templates/registry'

const SITE_NAME = 'Rytterbakken'
const FROM_DOMAIN = 'mindmatter.no'
const WAITLIST_SOURCE = 'landing'

function generateToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function enqueueConfirmation(args: {
  supabase: any
  email: string
  name: string | null
  reason: string | null
}): Promise<void> {
  const { supabase, email, name, reason } = args
  const templateName = 'waitlist-confirmation'
  const template = TEMPLATES[templateName]
  if (!template) throw new Error('Template not registered')

  // Idempotency check
  const { data: priorSend } = await supabase
    .from('email_send_log')
    .select('id')
    .eq('recipient_email', email)
    .eq('template_name', templateName)
    .neq('status', 'failed')
    .maybeSingle()
  if (priorSend) return

  // Suppression check
  const { data: suppressed } = await supabase
    .from('suppressed_emails')
    .select('id')
    .eq('email', email)
    .maybeSingle()
  if (suppressed) return

  // Unsubscribe token
  let unsubscribeToken: string
  const { data: existingToken } = await supabase
    .from('email_unsubscribe_tokens')
    .select('token, used_at')
    .eq('email', email)
    .maybeSingle()

  if (existingToken && !existingToken.used_at) {
    unsubscribeToken = existingToken.token
  } else if (!existingToken) {
    unsubscribeToken = generateToken()
    await supabase
      .from('email_unsubscribe_tokens')
      .upsert({ token: unsubscribeToken, email }, { onConflict: 'email', ignoreDuplicates: true })
    const { data: stored } = await supabase
      .from('email_unsubscribe_tokens')
      .select('token')
      .eq('email', email)
      .maybeSingle()
    if (stored?.token) unsubscribeToken = stored.token
  } else {
    return // Previously unsubscribed
  }

  const templateProps = { name: name ?? undefined, reason: reason ?? undefined }
  const html = await render(React.createElement(template.component, templateProps))
  const text = await render(React.createElement(template.component, templateProps), { plainText: true })
  const subject = typeof template.subject === 'function'
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
      subject,
      html,
      text,
      purpose: 'transactional',
      label: templateName,
      idempotency_key: `waitlist-confirm-${email}`,
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
}
