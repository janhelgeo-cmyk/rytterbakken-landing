import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface WaitlistVerifyProps {
  name?: string
  verifyUrl?: string
}

const WaitlistVerifyEmail = ({
  name,
  verifyUrl = 'https://rytterbakken.mindmatter.no',
}: WaitlistVerifyProps) => (
  <Html lang="no" dir="ltr">
    <Head />
    <Preview>Bekreft påmeldingen din til Rytterbakken</Preview>
    <Body style={main}>
      <Container style={container}>

        <Text style={wordmark}>Rytterbakken</Text>

        <Hr style={divider} />

        <Text style={heading}>
          {name ? `Hei, ${name}.` : 'Hei.'}
        </Text>

        <Text style={text}>
          Vi mottok en påmelding til ventelisten vår. Klikk for å bekrefte
          at det var deg.
        </Text>

        <Button href={verifyUrl} style={button}>
          Bekreft påmelding
        </Button>

        <Text style={small}>
          Lenken er gyldig i 24 timer. Hvis du ikke meldte deg på, kan du
          se bort fra denne e-posten.
        </Text>

        <Hr style={divider} />

        <Text style={signoff}>
          Rytterbakken
          <br />
          <span style={location}>Elverum, Norge · post@mindmatter.no</span>
        </Text>

      </Container>
    </Body>
  </Html>
)

export const template = {
  component: WaitlistVerifyEmail,
  subject: 'Bekreft påmeldingen din',
  displayName: 'Venteliste-verifisering',
  previewData: {
    name: 'Kari Nordmann',
    verifyUrl: 'https://rytterbakken.mindmatter.no/api/public/waitlist/verify?token=abc123',
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
  margin: '0 0 28px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
}

const button = {
  backgroundColor: '#B5663D',
  borderRadius: '100px',
  color: '#F4EDE2',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontSize: '15px',
  fontWeight: '500',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '14px 28px',
  margin: '0 0 28px',
}

const small = {
  fontSize: '13px',
  color: '#5C5249',
  lineHeight: '1.6',
  margin: '0 0 28px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
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
