import type { ComponentType } from 'react'

export interface TemplateEntry {
  component: ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  displayName?: string
  previewData?: Record<string, any>
  /** Fixed recipient — overrides caller-provided recipientEmail when set. */
  to?: string
}

import { template as waitlistConfirmation } from './waitlist-confirmation'
import { template as waitlistVerify } from './waitlist-verify'
import { template as memberLogin } from './member-login'
import { template as memberVerify } from './member-verify'
import { template as memberReset } from './member-reset'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'waitlist-confirmation': waitlistConfirmation,
  'waitlist-verify': waitlistVerify,
  'member-login': memberLogin,
  'member-verify': memberVerify,
  'member-reset': memberReset,
}
