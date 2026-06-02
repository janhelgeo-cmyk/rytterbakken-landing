import { defineConfig, devices } from '@playwright/test'

const BASE_URL =
  process.env.WAITLIST_E2E_URL ||
  'https://project--00161adf-5cd4-4281-b506-0de5d4cf078a-dev.lovable.app'

export default defineConfig({
  testDir: './tests/visual',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: 'list',
  timeout: 60_000,
  expect: {
    // Tolerer små anti-alias/font-render forskjeller på tvers av miljøer
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02,
      animations: 'disabled',
      scale: 'css',
    },
  },
  use: {
    baseURL: BASE_URL,
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } },
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 5'] },
    },
  ],
})
