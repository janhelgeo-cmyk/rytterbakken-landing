import { test, expect, type Page } from '@playwright/test'

/**
 * Visuelle regresjonstester for suksesskortet i ventelisten.
 *
 * Dekker to scenarier × to viewports (desktop/mobile, satt via projects
 * i playwright.config.ts):
 *   - Ny påmelding (unik e-post)
 *   - Bekreftelses-gjenbruk (samme e-post submittet to ganger)
 *
 * Baselines lagres i tests/visual/<file>-snapshots/. Første kjøring:
 *   bunx playwright test --update-snapshots
 * Påfølgende kjøringer feiler hvis kortet endrer seg visuelt.
 */

function uniqueEmail(tag: string) {
  const stamp = Date.now().toString(36)
  const rand = Math.random().toString(36).slice(2, 8)
  return `e2e+visual-${tag}-${stamp}-${rand}@mindmatter.test`
}

async function gotoWaitlist(page: Page) {
  await page.goto('/#venteliste', { waitUntil: 'networkidle' })
  // Sørg for at reveal-animasjoner har kjørt
  await page.waitForSelector('section#venteliste')
  await page.evaluate(() =>
    document
      .querySelectorAll('.reveal')
      .forEach((el) => el.classList.add('is-visible')),
  )
}

async function submitForm(
  page: Page,
  data: { email: string; name: string; reason: string },
) {
  await page.getByLabel('Navn').fill(data.name)
  await page.getByLabel('E-postadresse').fill(data.email)
  await page
    .getByLabel('Hvorfor synes du dette er interessant?')
    .fill(data.reason)
  await page.getByRole('button', { name: /meld interesse/i }).click()
  // Vent på suksesskortet
  await page.waitForSelector('[role="status"]', { timeout: 30_000 })
}

async function snapshotSuccessCard(page: Page, name: string) {
  const card = page.locator('section#venteliste [role="status"]')
  await expect(card).toBeVisible()
  // Maskér variabel tidstekst slik at gjenbruk-snapshottet er stabilt
  await expect(card).toHaveScreenshot(name, {
    mask: [card.locator('time')],
  })
}

test.describe('Suksesskort – visuell regresjon', () => {
  test('Ny påmelding', async ({ page }) => {
    await gotoWaitlist(page)
    await submitForm(page, {
      email: uniqueEmail('new'),
      name: 'Visual Test',
      reason: 'Snapshot for ny påmelding',
    })
    await snapshotSuccessCard(page, 'success-new.png')
  })

  test('Bekreftelses-gjenbruk', async ({ page }) => {
    const email = uniqueEmail('reuse')

    // Første submit
    await gotoWaitlist(page)
    await submitForm(page, {
      email,
      name: 'Visual Test',
      reason: 'Snapshot for gjenbruk – første',
    })

    // Andre submit på samme e-post → "Bekreftelsen er allerede sendt"
    await gotoWaitlist(page)
    await submitForm(page, {
      email,
      name: 'Visual Test',
      reason: 'Snapshot for gjenbruk – andre',
    })

    const heading = page.locator(
      'section#venteliste [role="status"] h3',
    )
    await expect(heading).toHaveText(/Bekreftelsen er allerede sendt/)

    await snapshotSuccessCard(page, 'success-reuse.png')
  })
})
