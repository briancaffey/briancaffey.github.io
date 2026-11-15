import { expect, test } from '@playwright/test'
import { open } from './helpers'

// The Portrait Lab on /contact: the untouched photo first, then one generated
// restyle at a time, with a compare slider and the prompt behind a disclosure.

test.describe('portrait lab', () => {
  test('opens on the untouched photograph, not a restyle', async ({ page }) => {
    await open(page, '/contact')

    await expect(page.locator('.portrait-lab .shot').first())
      .toHaveAttribute('src', /\/original\.webp$/)
    await expect(page.locator('.caption-name')).toHaveText('Original')
    await expect(page.locator('.counter')).toContainText('001 /')
  })

  test('the photograph offers no prompt and nothing to compare against', async ({ page }) => {
    await open(page, '/contact')

    await expect(page.getByRole('button', { name: /Show the prompt/ })).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Compare' })).toHaveCount(0)

    await page.getByRole('button', { name: 'Next style' }).click()

    await expect(page.getByRole('button', { name: /Show the prompt/ })).toHaveCount(1)
    await expect(page.getByRole('button', { name: 'Compare' })).toHaveCount(1)
  })

  test('steps forward into the restyles and wraps backwards to the last', async ({ page }) => {
    await open(page, '/contact')

    const shot = page.locator('.portrait-lab .shot').first()
    await page.getByRole('button', { name: 'Next style' }).click()
    await expect(shot).not.toHaveAttribute('src', /\/original\.webp$/)
    await expect(page.locator('.counter')).toContainText('002 /')

    const total = (await page.locator('.counter').innerText()).split('/')[1]!.trim()
    await page.getByRole('button', { name: 'Previous style' }).click()
    await page.getByRole('button', { name: 'Previous style' }).click()
    await expect(page.locator('.counter')).toContainText(`${total} / ${total}`)
  })

  test('shows no thumbnail grid, so one image loads at a time', async ({ page }) => {
    await open(page, '/contact')

    await expect(page.locator('.portrait-lab .swatch')).toHaveCount(0)
    await expect(page.locator('.portrait-lab img')).toHaveCount(1)
  })

  test('compare reveals the original behind a draggable slider', async ({ page }) => {
    await open(page, '/contact')
    await page.getByRole('button', { name: 'Next style' }).click()

    await expect(page.locator('.shot-original')).toHaveCount(0)
    await page.getByRole('button', { name: 'Compare' }).click()

    const original = page.locator('.shot-original')
    await expect(original).toHaveCount(1)
    await expect(original).toHaveAttribute('src', /original\.webp$/)

    const slider = page.getByRole('slider', { name: 'Compare' })
    await slider.focus()
    await slider.press('ArrowRight')
    await expect(original).toHaveAttribute('style', /inset\(0(px)? 49%/)
  })

  test('the disclosure reveals the prompt and which model made the image', async ({ page }) => {
    await open(page, '/contact')
    await page.getByRole('button', { name: 'Next style' }).click()

    await expect(page.locator('.prompt')).toHaveCount(0)
    await page.getByRole('button', { name: /Show the prompt/ }).click()

    await expect(page.locator('.prompt')).toContainText('Completely redraw this entire photograph')
    const meta = page.locator('.meta')
    await expect(meta).toContainText('flux-3-image-klein')
    await expect(meta).toContainText('steps')
    await expect(meta).toContainText('seed')
  })

  test('arrow keys move through the set', async ({ page }) => {
    await open(page, '/contact')

    await page.locator('body').press('ArrowRight')
    await expect(page.locator('.counter')).toContainText('002 /')

    await page.locator('body').press('ArrowLeft')
    await expect(page.locator('.counter')).toContainText('001 /')
  })
})
