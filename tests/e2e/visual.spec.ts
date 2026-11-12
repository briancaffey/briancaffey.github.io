import { expect, test } from '@playwright/test'
import { ARTICLE, COLOR_MODES, open, useColorMode } from './helpers'

// Opt-in: `yarn test:visual`. Baselines are recorded from one build and compared
// against another on the same machine; nothing here is committed to the repo.
test.skip(!process.env.VISUAL, 'visual comparison runs only via `yarn test:visual`')

for (const mode of COLOR_MODES) {
  test.describe(`${mode} mode`, () => {
    test.beforeEach(async ({ page }) => {
      await useColorMode(page, mode)
    })

    test('home, above the fold', async ({ page }) => {
      await open(page, '/', { settle: true })
      await expect(page).toHaveScreenshot(`home-${mode}.png`)
    })

    test('blog list, above the fold', async ({ page }) => {
      await open(page, '/blog/1', { settle: true })
      await expect(page).toHaveScreenshot(`blog-${mode}.png`)
    })

    test('article, above the fold', async ({ page }) => {
      await open(page, ARTICLE, { settle: true })
      await expect(page).toHaveScreenshot(`article-${mode}.png`)
    })
  })
}

test('mobile menu, open', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'menu button only exists on mobile')
  await open(page, '/', { settle: true })
  await page.getByRole('button', { name: 'Menu' }).click()
  await expect(page).toHaveScreenshot('mobile-menu-open.png')
})
