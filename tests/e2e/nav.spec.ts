import { expect, test } from '@playwright/test'
import { COLOR_MODES, open, overlaps } from './helpers'
import type { Box } from './helpers'

const isMobile = (name: string) => name === 'mobile'

// The first in-app navigation loads the content database in the browser and
// takes several seconds (#39), and switching language fetches its messages.
// Drop this once that issue is closed.
const navigation = { timeout: 30_000 }

test.describe('header', () => {
  test('home link, pickers and menu sit side by side, pickers centred', async ({ page }) => {
    await open(page, '/')

    const header = page.getByRole('banner')
    const regions = {
      home: header.getByRole('link', { name: 'Brian Caffey' }),
      pickers: header.getByRole('group', { name: 'Color theme' }).locator('..'),
      // The links on wide screens, the menu button on narrow ones.
      menu: header.locator('nav:visible, button[aria-controls="site-menu"]:visible').first()
    }
    const boxes: Record<string, Box> = {}
    for (const [name, locator] of Object.entries(regions)) {
      const box = await locator.boundingBox()
      expect(box, `${name} should be rendered`).not.toBeNull()
      boxes[name] = box!
    }

    expect(overlaps(boxes.home!, boxes.pickers!), 'home link overlaps pickers').toBe(false)
    expect(overlaps(boxes.pickers!, boxes.menu!), 'pickers overlap menu').toBe(false)

    const viewport = page.viewportSize()!
    const centre = boxes.pickers!.x + boxes.pickers!.width / 2
    expect(Math.abs(centre - viewport.width / 2)).toBeLessThanOrEqual(1)
  })

  test('links navigate and mark the current section on wide screens', async ({ page }, testInfo) => {
    test.skip(isMobile(testInfo.project.name), 'links are behind the menu button on mobile')
    test.slow() // two in-app navigations, see #39
    await open(page, '/')

    const blog = page.getByRole('link', { name: 'Blog', exact: true })
    await blog.click()
    await expect(page).toHaveURL(/\/blog\/1\/?$/, navigation)
    await expect(blog).toHaveAttribute('aria-current', 'page')

    const contact = page.getByRole('link', { name: 'Contact', exact: true })
    await contact.click()
    await expect(page).toHaveURL(/\/contact\/?$/, navigation)
    await expect(contact).toHaveAttribute('aria-current', 'page')
    await expect(blog).not.toHaveAttribute('aria-current', 'page')
  })

  test.describe('mobile menu', () => {
    test.beforeEach(async ({ page }, testInfo) => {
      test.skip(!isMobile(testInfo.project.name), 'menu button only exists on mobile')
      await open(page, '/')
    })

    test('opens, lists every destination, and closes after navigating', async ({ page }) => {
      const button = page.getByRole('button', { name: 'Menu' })
      const blog = page.getByRole('link', { name: 'Blog', exact: true })
      await expect(blog).toBeHidden()
      await expect(button).toHaveAttribute('aria-expanded', 'false')

      await button.click()
      await expect(button).toHaveAttribute('aria-expanded', 'true')
      await expect(page.getByRole('link', { name: 'Home', exact: true })).toBeVisible()
      await expect(page.getByRole('link', { name: 'Contact', exact: true })).toBeVisible()
      // The pickers stay available while the menu is open.
      await expect(page.getByRole('button', { name: 'Dark' })).toBeVisible()

      await blog.click()
      await expect(page).toHaveURL(/\/blog\/1\/?$/, navigation)
      await expect(blog).toBeHidden()
    })

    test('Escape closes it and returns focus to the button', async ({ page }) => {
      const button = page.getByRole('button', { name: 'Menu' })
      await button.click()
      await page.keyboard.press('Tab')
      await expect(page.getByRole('link', { name: 'Home', exact: true })).toBeFocused()

      await page.keyboard.press('Escape')

      await expect(page.getByRole('link', { name: 'Home', exact: true })).toBeHidden()
      await expect(button).toBeFocused()
    })

    test('a click elsewhere closes it', async ({ page }) => {
      await page.getByRole('button', { name: 'Menu' }).click()
      await page.getByRole('heading', { name: 'Popular tags' }).click()

      await expect(page.getByRole('link', { name: 'Home', exact: true })).toBeHidden()
    })
  })

  for (const mode of COLOR_MODES) {
    test(`colour picker switches to ${mode}`, async ({ page }) => {
      await open(page, '/')
      const button = page.getByRole('button', { name: mode, exact: false }).first()

      await button.click()

      await expect(page.locator('html')).toHaveClass(new RegExp(`\\b${mode}-mode\\b`))
      await expect(button).toHaveAttribute('aria-pressed', 'true')
    })
  }

  test('pickers work from the keyboard', async ({ page }) => {
    await open(page, '/')

    await page.getByRole('button', { name: 'Sepia' }).focus()
    await page.keyboard.press('Enter')
    await expect(page.locator('html')).toHaveClass(/\bsepia-mode\b/)

    const language = page.getByRole('button', { name: 'Language' })
    await language.focus()
    await page.keyboard.press('Enter')
    await expect(language).toHaveAttribute('aria-expanded', 'true')
    await page.keyboard.press('Tab')
    await expect(page.getByRole('button', { name: 'English' })).toBeFocused()

    await page.keyboard.press('Escape')
    await expect(page.getByRole('button', { name: 'English' })).toBeHidden()
    await expect(language).toBeFocused()
  })

  test('language picker translates the interface', async ({ page }) => {
    await open(page, '/')

    await page.getByRole('button', { name: 'Language' }).click()
    await page.getByRole('button', { name: 'Français' }).click()

    await expect(page.getByRole('button', { name: 'Français' })).toBeHidden()
    await expect(page.getByRole('button', { name: 'Langue' })).toBeVisible(navigation)
  })

  test('picker icons are served by the site itself', async ({ page }) => {
    await open(page, '/')

    const sources = await page.getByRole('banner').locator('img').evaluateAll(
      images => images.map(img => ({ src: new URL((img as HTMLImageElement).src).pathname, loaded: (img as HTMLImageElement).naturalWidth > 0 }))
    )

    expect(sources).toHaveLength(5)
    for (const { src, loaded } of sources) {
      expect(src).toMatch(/^\/icons\/emoji\/[a-z-]+\.svg$/)
      expect(loaded, `${src} should load`).toBe(true)
    }
  })

  // Known gap, tracked in the linked issue. It becomes a real test when the
  // issue is closed.
  test.fixme('Montserrat is actually loaded (#29)', () => {})
})
