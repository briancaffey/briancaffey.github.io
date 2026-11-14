import { expect, test } from '@playwright/test'
import { ARTICLE, open } from './helpers'

// The project registry (content/projects/*.yml) feeds the status block on each
// project's article and the list embedded in the working log.

test.describe('project article', () => {
  test('carries the project status above the text', async ({ page }) => {
    await open(page, ARTICLE)

    const status = page.locator('article .project-status')
    await expect(status).toHaveCount(1)
    await expect(status).toContainText('Built with (2025)')
    await expect(status).toContainText('gpt-oss-20b')
    await expect(status).toContainText('Runs on now')

    // Above the article body, inside the reading column.
    const box = await status.boundingBox()
    const body = await page.locator('.markdown').boundingBox()
    expect(box!.y + box!.height).toBeLessThanOrEqual(body!.y + 1)
    expect(box!.width).toBeLessThanOrEqual(928)
  })

  test('an article that is not about a project has no status block', async ({ page }) => {
    await open(page, '/2024/08/11/upgrading-my-github-pages-blog-to-nuxt-3')

    await expect(page.locator('.project-status')).toHaveCount(0)
  })
})

test.describe('working log', () => {
  test('is a draft, kept out of the blog list and marked noindex', async ({ page }) => {
    await open(page, '/2026/11/12/reviving-old-projects-with-ai-working-log')

    await expect(page.locator('h1')).toContainText('the working log')
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex')
    await expect(page.locator('.markdown table').first()).toBeVisible()

    await open(page, '/blog/1')
    await expect(page.getByText('the working log')).toHaveCount(0)
  })
})
