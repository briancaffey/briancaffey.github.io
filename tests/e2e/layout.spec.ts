import { expect, test } from '@playwright/test'
import { ARTICLE, open } from './helpers'

// These guard the shared stylesheet. If it stops being applied, pages still
// render and nothing overflows, so the smoke tests alone would not notice.

const READING_WIDTH = 928 // max-w-content: 58rem

for (const path of ['/', '/blog/1', '/blog/tags', ARTICLE]) {
  test(`reading column is capped and centred on ${path}`, async ({ page }) => {
    await open(page, path)

    const box = await page.locator('main .content-container').first().boundingBox()
    const viewport = page.viewportSize()!

    expect(box).not.toBeNull()
    expect(box!.width).toBe(Math.min(READING_WIDTH, viewport.width))
    expect(Math.abs(box!.x + box!.width / 2 - viewport.width / 2)).toBeLessThanOrEqual(1)
  })
}

test('header and reading column share the same gutter on narrow screens', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'gutters only align when both containers fill the screen')
  await open(page, '/')

  const left = (selector: string) => page.locator(selector).first().evaluate((el) => {
    const style = getComputedStyle(el)
    return el.getBoundingClientRect().left + Number.parseFloat(style.paddingLeft)
  })

  expect(await left('header .site-container')).toBe(await left('main .content-container'))
})

test('tags, buttons and fields take their colours from the theme', async ({ page }) => {
  await open(page, '/')
  const colour = (selector: string, property: string) =>
    page.locator(selector).first().evaluate((el, prop) => getComputedStyle(el).getPropertyValue(prop), property)
  const token = (name: string) =>
    page.evaluate((variable) => {
      const probe = document.createElement('div')
      probe.style.color = `var(${variable})`
      document.body.append(probe)
      const value = getComputedStyle(probe).color
      probe.remove()
      return value
    }, name)

  expect(await colour('.chip', 'background-color')).toBe(await token('--color-tag'))
  expect(await colour('.btn', 'border-top-color')).toBe(await token('--color-primary'))
  expect(await colour('.btn-solid', 'background-color')).toBe(await token('--color-secondary'))
  expect(await colour('.field', 'border-top-color')).toBe(await token('--color-primary'))
})
