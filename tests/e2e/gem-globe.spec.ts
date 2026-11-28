import { expect, test } from '@playwright/test'
import { DEFAULT_LAYOUT, generateLayout, verifyLayout } from '../../app/utils/gemGlobe/layout'
import { open } from './helpers'

const GEM_GLOBE = '/2026/11/28/a-globe-made-of-gems'

test('the gem globe article shows its stage without widening the page', async ({ page }) => {
  await open(page, GEM_GLOBE)

  const stage = page.locator('.gg-stage')
  await expect(stage).toBeVisible()
  await expect(stage.locator('.gg-poster')).toBeVisible()

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  expect(overflow).toBeLessThanOrEqual(0)
})

// The promise the article makes: stones touch their neighbours and never cut into them or
// into the ball. This runs the layout code directly, so it does not need a graphics card.
for (const options of [
  DEFAULT_LAYOUT,
  { ...DEFAULT_LAYOUT, count: 400, seed: 3, variety: 1, gap: 0, irregularity: 1, height: 1.4 },
  { ...DEFAULT_LAYOUT, count: 3000, seed: 11, variety: 0, palette: 'rubies' }
]) {
  // Playwright requires the first argument to be written as a destructuring pattern.
  // eslint-disable-next-line no-empty-pattern
  test(`${options.count} stones (seed ${options.seed}) fit without overlapping`, ({}, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'the layout does not depend on the screen')
    const report = verifyLayout(generateLayout(options, null))

    expect(report.gems).toBeGreaterThan(options.count * 0.7)
    expect(report.pairsChecked).toBeGreaterThan(report.gems)
    // With no spacing, neighbours share a wall exactly, give or take rounding in the last digit.
    expect(report.worstOverlap).toBeLessThanOrEqual(1e-9)
    expect(report.worstSink).toBeLessThanOrEqual(1e-9)
    expect(report.minClearance).toBeGreaterThanOrEqual(-1e-9)
    expect(report.tallest).toBeLessThan(1)
  })
}

test('the gem globe starts and reports its own check', async ({ page }) => {
  // Software rendering on a CI runner takes minutes per frame of this shader.
  test.skip(!!process.env.CI, 'needs a real graphics card')
  test.setTimeout(180_000)
  await open(page, GEM_GLOBE)
  const webgl = await page.evaluate(() => !!document.createElement('canvas').getContext('webgl2'))
  test.skip(!webgl, 'this browser has no WebGL 2')

  const stage = page.locator('.gg-stage')
  await stage.scrollIntoViewIfNeeded()
  await expect(stage.locator('canvas')).toBeVisible({ timeout: 90_000 })
  await stage.getByRole('button', { name: 'Controls' }).click()

  // The panel reports the check that runs every time the stones are cut.
  await expect(stage.locator('.gg-report').first()).toContainText('deepest overlap 0.000000')
  const box = await stage.locator('.gg-panel').boundingBox()
  const outer = await stage.boundingBox()
  expect(box!.x).toBeGreaterThanOrEqual(outer!.x)
  expect(box!.x + box!.width).toBeLessThanOrEqual(outer!.x + outer!.width + 1)
})
