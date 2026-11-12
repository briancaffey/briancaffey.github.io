import { defineConfig } from '@playwright/test'

// Tests run against the statically generated site (`yarn generate`), the same
// artifact that is deployed. SITE_DIR lets CI point the tests at another build.
const siteDir = process.env.SITE_DIR || '.output/public'
const port = Number(process.env.PORT || 4173)

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : [['list']],
  // Screenshots are compared between two builds on the same machine and are
  // never committed (see `yarn test:visual` in CLAUDE.md).
  snapshotPathTemplate: 'tests/e2e/.snapshots/{testFilePath}/{arg}-{projectName}{ext}',
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.002, animations: 'disabled' }
  },
  use: {
    baseURL: `http://localhost:${port}`,
    browserName: 'chromium',
    trace: 'retain-on-failure'
  },
  projects: [
    { name: 'mobile', use: { viewport: { width: 390, height: 844 }, hasTouch: true } },
    { name: 'tablet', use: { viewport: { width: 768, height: 1024 } } },
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } }
  ],
  webServer: {
    command: `yarn serve ${siteDir} --listen ${port} --no-request-logging`,
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000
  }
})
