import { expect, test } from '@playwright/test'
import { PAGES, open } from './helpers'

for (const { name, path } of PAGES) {
  test.describe(name, () => {
    test('renders without script errors', async ({ page }) => {
      const errors: string[] = []
      page.on('pageerror', error => errors.push(error.message))

      const response = await open(page, path)

      expect(response?.status()).toBe(200)
      await expect(page.locator('body')).not.toBeEmpty()
      expect(errors).toEqual([])
    })

    test('does not scroll horizontally', async ({ page }) => {
      await open(page, path)

      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth
      }))

      expect(scrollWidth).toBeLessThanOrEqual(clientWidth)
    })
  })
}
