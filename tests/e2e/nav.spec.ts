import { expect, test } from '@playwright/test'
import { COLOR_MODES, open, overlaps } from './helpers'
import type { Box } from './helpers'

const isMobile = (name: string) => name === 'mobile'

// The first in-app navigation loads the content database in the browser and
// takes several seconds (#39). Drop this once that issue is closed.
const navigation = { timeout: 30_000 }

test.describe('header', () => {
  test('home link, pickers and menu do not overlap', async ({ page }) => {
    await open(page, '/')

    const regions = {
      home: page.locator('a[href="/"]').first(),
      pickers: page.locator('.emoji-mart-emoji').first().locator('xpath=ancestor::ul[1]'),
      // The links on wide screens, the menu button on narrow ones.
      menu: page.locator('nav').first().locator('ul:visible, button:visible').first()
    }
    const boxes: Record<string, Box> = {}
    for (const [name, locator] of Object.entries(regions)) {
      const box = await locator.boundingBox()
      expect(box, `${name} should be rendered`).not.toBeNull()
      boxes[name] = box!
    }

    expect(overlaps(boxes.home!, boxes.pickers!), 'home link overlaps pickers').toBe(false)
    expect(overlaps(boxes.pickers!, boxes.menu!), 'pickers overlap menu').toBe(false)
  })

  test('links navigate on wide screens', async ({ page }, testInfo) => {
    test.skip(isMobile(testInfo.project.name), 'links are behind the menu button on mobile')
    await open(page, '/')

    await page.getByRole('link', { name: 'Blog', exact: true }).click()
    await expect(page).toHaveURL(/\/blog\/1\/?$/, navigation)

    await page.getByRole('link', { name: 'Contact', exact: true }).click()
    await expect(page).toHaveURL(/\/contact\/?$/, navigation)
  })

  test('menu button opens the menu and a link closes it on mobile', async ({ page }, testInfo) => {
    test.skip(!isMobile(testInfo.project.name), 'menu button only exists on mobile')
    await open(page, '/')

    const blog = page.getByRole('link', { name: 'Blog', exact: true })
    await expect(blog).toBeHidden()

    await page.getByRole('button', { name: 'Menu' }).first().click()
    await expect(blog).toBeVisible()
    await expect(page.getByRole('link', { name: 'Home', exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Contact', exact: true })).toBeVisible()

    await blog.click()
    await expect(page).toHaveURL(/\/blog\/1\/?$/, navigation)
    await expect(blog).toBeHidden()
  })

  for (const mode of COLOR_MODES) {
    test(`colour picker switches to ${mode}`, async ({ page }) => {
      await open(page, '/')
      const emoji = { light: 'sun_with_face', dark: 'new_moon_with_face', sepia: 'coffee' }[mode]

      await page.locator(`.emoji-mart-emoji[aria-label*="${emoji}"], .emoji-mart-emoji[title="${emoji}"]`).first().click()

      await expect(page.locator('html')).toHaveClass(new RegExp(`\\b${mode}-mode\\b`))
    })
  }

  // The items below are known gaps in the current header. They are tracked in
  // the linked issues and become real tests when those issues are closed.
  test.fixme('Escape closes the mobile menu and returns focus to the button (#28)', () => {})
  test.fixme('colour and locale pickers are reachable and operable by keyboard (#28)', () => {})
  test.fixme('Montserrat is actually loaded (#29)', () => {})
})
