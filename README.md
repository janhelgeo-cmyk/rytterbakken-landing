# Rytterbakken Landing

TanStack Start + Vite + Tailwind v4, koblet til Lovable Cloud (Supabase).

## Kom i gang lokalt

### 1. Installer avhengigheter
```bash
bun install
```

### 2. Sett opp miljøvariabler lokalt med `.env.local`

Prosjektet bruker Vite, som leser miljøvariabler fra både `.env` og `.env.local`.
**Anbefalt for lokal utvikling:** bruk `.env.local` — den er ignorert av Git og
overstyrer `.env`, så du kan ha personlige verdier uten å påvirke andre.

#### Steg-for-steg

1. **Kopier eksempelfilen:**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Hent verdiene** fra én av disse stedene:
   - **Lovable-editoren** → åpne prosjektet → Lovable Cloud / Backend-innstillinger.
     URL og publishable key vises der.
   - **Supabase-dashbordet** (hvis du har direkte tilgang) → Project Settings → API.

3. **Fyll ut `.env.local`** med disse variablene:

   | Variabel | Beskrivelse | Eksempel |
   |---|---|---|
   | `SUPABASE_URL` | Server-side URL | `https://abcd1234.supabase.co` |
   | `SUPABASE_PUBLISHABLE_KEY` | Server-side publishable / anon-nøkkel | `sb_publishable_…` |
   | `VITE_SUPABASE_URL` | Samme URL, eksponert til browseren | `https://abcd1234.supabase.co` |
   | `VITE_SUPABASE_PUBLISHABLE_KEY` | Samme key, eksponert til browseren | `sb_publishable_…` |
   | `VITE_SUPABASE_PROJECT_ID` | Project ref (delen før `.supabase.co`) | `abcd1234` |
   | `SUPABASE_SERVICE_ROLE_KEY` | **Server-only, valgfri.** Trengs kun hvis du kjører admin-server-funksjoner lokalt. **Aldri commit.** | `eyJ…` |

   Tips: `VITE_*`-variantene må ha **nøyaktig samme verdi** som de uten prefiks —
   Vite eksponerer kun `VITE_`-prefiksede variabler til klientkoden.

4. **Restart dev-serveren** etter at du har endret `.env.local` — Vite plukker
   ikke opp endringer i env-filer på fly:
   ```bash
   bun run dev
   ```

   Appen kjører på `http://localhost:5173`.

#### Verifisering

Hvis en variabel mangler, viser appen et tydelig feilpanel ved oppstart med
liste over hvilke nøkler som ikke er satt. Da er det bare å fylle inn og
restarte.


## Supabase quickstart — hent URL, publishable key og project ID

Tre verdier trengs for å koble appen mot Supabase / Lovable Cloud. Velg én kilde:

### Alternativ A: Lovable-editoren (anbefalt)
1. Åpne prosjektet i Lovable.
2. Klikk **Connectors** → **Lovable Cloud** i sidemenyen.
3. Kopier verdiene som vises:
   - **Project URL** → `SUPABASE_URL` og `VITE_SUPABASE_URL`
   - **Publishable key** (`sb_publishable_…`) → `SUPABASE_PUBLISHABLE_KEY` og `VITE_SUPABASE_PUBLISHABLE_KEY`
   - **Project ID / ref** (delen før `.supabase.co` i URLen) → `VITE_SUPABASE_PROJECT_ID`

### Alternativ B: Supabase-dashbordet (hvis du har direkte tilgang)
1. Gå til `https://supabase.com/dashboard` → velg prosjektet.
2. **Project Settings** → **API**.
3. Kopier:
   - **Project URL** → `SUPABASE_URL` / `VITE_SUPABASE_URL`
   - **Project API Keys → anon / publishable** → `SUPABASE_PUBLISHABLE_KEY` / `VITE_SUPABASE_PUBLISHABLE_KEY`
   - **Reference ID** (under General) → `VITE_SUPABASE_PROJECT_ID`

### Rask sjekk
URLen har formen `https://<project-id>.supabase.co` — `<project-id>` er den samme
verdien som `VITE_SUPABASE_PROJECT_ID`. Hvis de ikke matcher har du blandet to prosjekter.


## Viktig om hemmeligheter

- `.env` skal **aldri** committes — den er allerede i `.gitignore`.
- Bruk `.env.example` som mal for nye utviklere.
- `VITE_`-variabler bundles inn i klientkoden og er offentlige — bruk dem kun for ikke-hemmelige verdier (URL, publishable key).
- Service role key og andre hemmeligheter hører hjemme i Lovable Cloud sin secrets-mekanisme i produksjon, ikke i committed kode.

## Deploy

Publisering skjer via Lovable. Endringer i `main`-grenen på GitHub synkroniseres med Lovable hvis GitHub-koblingen er aktiv.
