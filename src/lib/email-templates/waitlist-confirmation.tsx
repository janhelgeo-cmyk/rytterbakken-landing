import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

const SITE_NAME = 'Mindmatter'

interface WaitlistConfirmationProps {
  name?: string
  reason?: string
}

const WaitlistConfirmationEmail = ({
  name,
  reason,
}: WaitlistConfirmationProps) => (
  <Html lang="no" dir="ltr">
    <Head />
    <Preview>Takk for at du meldte deg på ventelisten til {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>
          {name ? `Takk, ${name}!` : 'Takk for din interesse!'}
        </Heading>
        <Text style={text}>
          Vi har registrert deg på ventelisten til {SITE_NAME}. Vi tar
          kontakt så snart en plass åpner seg.
        </Text>

        {reason ? (
          <Section style={card}>
            <Text style={cardLabel}>Din begrunnelse</Text>
            <Text style={cardBody}>{reason}</Text>
          </Section>
        ) : null}

        <Text style={text}>
          Har du spørsmål i mellomtiden, er det bare å svare på denne
          e-posten.
        </Text>

        <Text style={footer}>Vennlig hilsen,<br />{SITE_NAME}</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: WaitlistConfirmationEmail,
  subject: 'Takk for at du meldte deg på ventelisten',
  displayName: 'Venteliste-bekreftelse',
  previewData: {
    name: 'Kari Nordmann',
    reason: 'Jeg ønsker å lære mer om hvordan dette kan hjelpe meg.',
  },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}
const container = { padding: '32px 28px', maxWidth: '560px' }
const h1 = {
  fontSize: '24px',
  fontWeight: 600,
  color: '#1a1a1a',
  margin: '0 0 20px',
}
const text = {
  fontSize: '15px',
  color: '#3f3f46',
  lineHeight: '1.6',
  margin: '0 0 18px',
}
const card = {
  backgroundColor: '#f6f3ee',
  borderRadius: '12px',
  padding: '18px 20px',
  margin: '8px 0 22px',
}
const cardLabel = {
  fontSize: '12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.08em',
  color: '#71717a',
  margin: '0 0 6px',
}
const cardBody = {
  fontSize: '15px',
  color: '#1a1a1a',
  lineHeight: '1.55',
  margin: 0,
  whiteSpace: 'pre-wrap' as const,
}
const footer = {
  fontSize: '13px',
  color: '#71717a',
  margin: '28px 0 0',
}
