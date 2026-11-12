import { expect, test } from '@playwright/test'
import { ARTICLE, open } from './helpers'

// The project registry (content/projects/*.yml) feeds the projects page and
// the status block on each project's article.

test.describe('projects page', () => {
  test('lists every project in the registry, running ones first', async ({ page }) => {
    await open(page, '/projects')

    const cards = page.locator('.project-status')
    await expect(cards).toHaveCount(6)
    await expect(cards.first()).toContainText('hn.fm')
    await expect(cards.first().locator('.status')).toHaveAttribute('data-status', 'running')
  })

  test('each project links to its article and its source', async ({ page }) => {
    await open(page, '/projects')

    const card = page.locator('.project-status', { hasText: 'RedLM' })
    await expect(card.getByRole('link', { name: 'RedLM' })).toHaveAttribute('href', /^\/2024\/10\/09\/redlm/)
    await expect(card.getByRole('link', { name: 'Source code' })).toHaveAttribute('href', 'https://github.com/briancaffey/RedLM')
  })

  test('is reachable from the header and marked as the current section', async ({ page, viewport }) => {
    await open(page, '/')

    if ((viewport?.width ?? 0) < 768) await page.getByRole('button', { name: 'Menu' }).click()
    const link = page.getByRole('link', { name: 'Projects' }).locator('visible=true').first()
    await link.click()
    await expect(page).toHaveURL(/\/projects\/?$/, { timeout: 30_000 })
    // The menu closes on navigation; open it again to read the link's state.
    if ((viewport?.width ?? 0) < 768) await page.getByRole('button', { name: 'Menu' }).click()
    await expect(page.getByRole('link', { name: 'Projects' }).locator('visible=true').first())
      .toHaveAttribute('aria-current', 'page')
  })
})

test.describe('project article', () => {
  test('carries the project status above the text', async ({ page }) => {
    await open(page, ARTICLE)

    const status = page.locator('article .project-status')
    await expect(status).toHaveCount(1)
    await expect(status).toContainText('Built with (2025)')
    await expect(status).toContainText('gpt-oss-20b')
    await expect(status).toContainText('Runs on now')
    await expect(status.getByRole('link', { name: 'All projects' })).toHaveAttribute('href', '/projects')

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
