import { expect, test } from '@playwright/test'
import { open } from './helpers'

// The Portrait Lab on /contact: one image at a time out of the generated set,
// with a compare slider and the prompt and model behind a disclosure.

test.describe('portrait lab', () => {
  test('opens on the first style and steps to the next one', async ({ page }) => {
    await open(page, '/contact')

    const shot = page.locator('.portrait-lab .shot').first()
    const first = await shot.getAttribute('src')
    await expect(page.locator('.counter')).toContainText('001 /')

    await page.getByRole('button', { name: 'Next style' }).click()

    await expect(shot).not.toHaveAttribute('src', first!)
    await expect(page.locator('.counter')).toContainText('002 /')
  })

  test('wraps backwards from the first style to the last', async ({ page }) => {
    await open(page, '/contact')

    const total = (await page.locator('.counter').innerText()).split('/')[1]!.trim()
    await page.getByRole('button', { name: 'Previous style' }).click()

    await expect(page.locator('.counter')).toContainText(`${total.padStart(3, '0')} / ${total}`)
  })

  test('shows no thumbnail grid, so one image loads at a time', async ({ page }) => {
    await open(page, '/contact')

    await expect(page.locator('.portrait-lab .swatch')).toHaveCount(0)
    await expect(page.locator('.portrait-lab img')).toHaveCount(1)
  })

  test('compare reveals the original behind a draggable slider', async ({ page }) => {
    await open(page, '/contact')

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

    const toggle = page.getByRole('button', { name: /Show the prompt/ })
    await expect(page.locator('.prompt')).toHaveCount(0)

    await toggle.click()

    await expect(page.locator('.prompt')).toContainText('Completely redraw this entire photograph')
    const meta = page.locator('.meta')
    await expect(meta).toContainText('flux-3-image-klein')
    await expect(meta).toContainText('steps')
    await expect(meta).toContainText('seed')
  })

  test('arrow keys move through the styles', async ({ page }) => {
    await open(page, '/contact')

    await page.locator('body').press('ArrowRight')
    await expect(page.locator('.counter')).toContainText('002 /')

    await page.locator('body').press('ArrowLeft')
    await expect(page.locator('.counter')).toContainText('001 /')
  })
})
