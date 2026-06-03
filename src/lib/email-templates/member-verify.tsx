import { Body, Button, Container, Head, Hr, Html, Link, Preview, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'

interface MemberVerifyProps { verifyUrl?: string; name?: string }

const MemberVerifyEmail = ({ verifyUrl = '#', name }: MemberVerifyProps) => (
  <Html lang="no" dir="ltr"><Head />
    <Preview>Bekreft e-postadressen din for å aktivere kontoen din på Rytterbakken</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={wordmark}>Rytterbakken</Text>
        <Hr style={divider} />
        <Text style={heading}>{name ? `Hei, ${name}.` : 'Hei.'}</Text>
        <Text style={text}>
          Bekreft e-postadressen din for å aktivere kontoen din på Min side.
          Lenken er gyldig i 24 timer.
        </Text>
        <Button href={verifyUrl} style={button}>Bekreft e-postadresse →</Button>
        <Text style={small}>
          Hvis knappen ikke fungerer:<br />
          <Link href={verifyUrl} style={linkStyle}>{verifyUrl}</Link>
        </Text>
        <Text style={small}>Hvis du ikke opprettet denne kontoen, kan du se bort fra e-posten.</Text>
        <Hr style={divider} />
        <Text style={signoff}>Rytterbakken<br /><span style={location}>Elverum, Norge · post@mindmatter.no</span></Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: MemberVerifyEmail,
  subject: 'Bekreft e-postadressen din',
  displayName: 'Registrering — verifisering',
  previewData: { name: 'Kari Nordmann', verifyUrl: 'https://rytterbakken.mindmatter.no/auth/callback?token=eksempel' },
} satisfies TemplateEntry

const main = { backgroundColor: '#F4EDE2', fontFamily: 'Georgia,"Times New Roman",serif' }
const container = { padding: '48px 40px 40px', maxWidth: '560px', margin: '0 auto' }
const wordmark = { fontSize: '22px', fontWeight: '500', color: '#2A2520', margin: '0 0 24px' }
const divider = { borderColor: '#D9C9AE', margin: '0 0 28px' }
const heading = { fontSize: '28px', fontWeight: '400', color: '#2A2520', lineHeight: '1.2', margin: '0 0 20px', fontStyle: 'italic' }
const text = { fontSize: '16px', color: '#5C5249', lineHeight: '1.65', margin: '0 0 28px', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }
const button = { backgroundColor: '#B5663D', borderRadius: '100px', color: '#F4EDE2', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', fontSize: '15px', fontWeight: '500', textDecoration: 'none', textAlign: 'center' as const, display: 'block', padding: '14px 28px', margin: '0 0 28px' }
const small = { fontSize: '13px', color: '#5C5249', lineHeight: '1.6', margin: '0 0 16px', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }
const linkStyle = { color: '#B5663D', wordBreak: 'break-all' as const }
const signoff = { fontSize: '15px', color: '#2A2520', lineHeight: '1.6', margin: '24px 0 0', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }
const location = { fontSize: '13px', color: '#5C5249' }
