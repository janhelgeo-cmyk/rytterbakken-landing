import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

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
    <Preview>Du er på listen. Vi tar kontakt når det er klart.</Preview>
    <Body style={main}>
      <Container style={container}>

        {/* Wordmark */}
        <Text style={wordmark}>Rytterbakken</Text>

        <Hr style={divider} />

        {/* Greeting */}
        <Text style={heading}>
          {name ? `Hei, ${name}.` : 'Hei.'}
        </Text>

        <Text style={text}>
          Du er på ventelisten. Vi åpner gradvis og på ordentlig — og du hører
          fra oss når det er tid for deg.
        </Text>

        {reason ? (
          <Section style={card}>
            <Text style={cardLabel}>Du skrev</Text>
            <Text style={cardBody}>{reason}</Text>
          </Section>
        ) : null}

        <Text style={text}>
          I mellomtiden: nettsiden vår har mer om hva vi jobber med og hvem vi
          er. Har du spørsmål, svar gjerne på denne e-posten.
        </Text>

        <Hr style={divider} />

        <Text style={signoff}>
          Aina og teamet på Rytterbakken
          <br />
          <span style={location}>Elverum, Norge · post@mindmatter.no</span>
        </Text>

      </Container>
    </Body>
  </Html>
)

export const template = {
  component: WaitlistConfirmationEmail,
  subject: 'Du er på listen.',
  displayName: 'Venteliste-bekreftelse',
  previewData: {
    name: 'Kari Nordmann',
    reason: 'Jeg har lenge vært nysgjerrig på sammenhengen mellom nervesystem og jord.',
  },
} satisfies TemplateEntry

// ── Styles ────────────────────────────────────────────────────────────────────

const main = {
  backgroundColor: '#F4EDE2',
  fontFamily: 'Georgia, "Times New Roman", serif',
}

const container = {
  padding: '48px 40px 40px',
  maxWidth: '560px',
  margin: '0 auto',
}

const wordmark = {
  fontSize: '22px',
  fontWeight: '500',
  color: '#2A2520',
  letterSpacing: '-0.01em',
  margin: '0 0 24px',
}

const divider = {
  borderColor: '#D9C9AE',
  margin: '0 0 28px',
}

const heading = {
  fontSize: '28px',
  fontWeight: '400',
  color: '#2A2520',
  lineHeight: '1.2',
  margin: '0 0 20px',
  fontStyle: 'italic',
}

const text = {
  fontSize: '16px',
  color: '#5C5249',
  lineHeight: '1.65',
  margin: '0 0 20px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
}

const card = {
  borderLeft: '2px solid #B5663D',
  paddingLeft: '20px',
  margin: '4px 0 24px',
}

const cardLabel = {
  fontSize: '11px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.15em',
  color: '#B5663D',
  margin: '0 0 8px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontWeight: '500',
}

const cardBody = {
  fontSize: '15px',
  color: '#2A2520',
  lineHeight: '1.6',
  margin: 0,
  fontStyle: 'italic',
  fontFamily: 'Georgia, "Times New Roman", serif',
  whiteSpace: 'pre-wrap' as const,
}

const signoff = {
  fontSize: '15px',
  color: '#2A2520',
  lineHeight: '1.6',
  margin: '24px 0 0',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
}

const location = {
  fontSize: '13px',
  color: '#5C5249',
}
