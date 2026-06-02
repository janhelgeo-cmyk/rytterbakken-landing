# Visuelle regresjonstester

Snapshot-tester for suksesskortet i `Waitlist`-komponenten på desktop og mobil,
for både ny påmelding og bekreftelses-gjenbruk.

## Kjøre lokalt

Krever Chromium + systemavhengigheter (libglib, nss, atk, m.fl.). Ikke
tilgjengelig i Lovable-sandboxen — kjøres lokalt eller i CI.

```bash
bunx playwright install --with-deps chromium
bun run test:visual:update   # generer baselines første gang
bun run test:visual          # verifiser mot baselines
```

## Konfig

- `playwright.config.ts` – to projects: `desktop` (1280×900) og `mobile` (Pixel 5).
- `WAITLIST_E2E_URL` overstyrer URL (default: dev-preview).
- `<time>` i gjenbruks-kortet maskeres slik at snapshottet er stabilt.

## Scenarioer

| Test                        | Snapshot               |
|----------------------------|------------------------|
| Ny påmelding               | `success-new.png`      |
| Bekreftelses-gjenbruk      | `success-reuse.png`    |

Baselines lagres under `tests/visual/success-card.spec.ts-snapshots/`.
