import { expect, test } from '@playwright/test'
import { open } from './helpers'

// The blog listing (#43): pages of ten, no article repeated or skipped across
// pages, drafts not counted, a real last page, and arrows that are only links
// when there is somewhere to go. Content-independent: it reads the count from
// the heading and checks the pages agree with it.

const PAGE_SIZE = 10

// A content check: one viewport is enough.
const desktopOnly = (info: import('@playwright/test').TestInfo) =>
  test.skip(info.project.name !== 'desktop', 'content check, one viewport is enough')

async function listedCount(page: import('@playwright/test').Page) {
  const heading = await page.getByRole('heading', { level: 1 }).textContent()
  const match = heading?.match(/\((\d+)\)/)
  expect(match, `count in heading "${heading}"`).toBeTruthy()
  return Number(match![1])
}

async function cardLinks(page: import('@playwright/test').Page) {
  return page.locator('.article-card > a').evaluateAll(links =>
    links.map(link => (link as HTMLAnchorElement).pathname.replace(/\/$/, ''))
  )
}

test.describe('blog listing', () => {
  test('every listed article appears exactly once across the pages', async ({ page }, testInfo) => {
    desktopOnly(testInfo)
    await open(page, '/blog/1')
    const total = await listedCount(page)
    const pages = Math.ceil(total / PAGE_SIZE)

    const seen: string[] = []
    for (let n = 1; n <= pages; n++) {
      if (n > 1) await open(page, `/blog/${n}`)
      const links = await cardLinks(page)
      const expected = n < pages ? PAGE_SIZE : total - PAGE_SIZE * (pages - 1)
      expect(links, `cards on /blog/${n}`).toHaveLength(expected)
      seen.push(...links)
    }
    expect(new Set(seen).size, 'no article repeated across pages').toBe(total)
  })

  test('the count matches the /blog page and excludes drafts', async ({ page }, testInfo) => {
    desktopOnly(testInfo)
    await open(page, '/blog/1')
    const total = await listedCount(page)
    await open(page, '/blog')
    expect(await listedCount(page)).toBe(total)
    expect(await cardLinks(page)).toHaveLength(total)

    // Drafts are listed on /drafts only.
    await open(page, '/drafts')
    const drafts = await cardLinks(page)
    await open(page, '/blog')
    const listed = new Set(await cardLinks(page))
    for (const draft of drafts) expect(listed.has(draft), `${draft} is a draft`).toBe(false)
  })

  test('arrows link only where there is a page to go to', async ({ page }, testInfo) => {
    desktopOnly(testInfo)
    await open(page, '/blog/1')
    const pages = Math.ceil((await listedCount(page)) / PAGE_SIZE)
    const pager = page.getByRole('navigation', { name: /\d+ \/ \d+$/ }).first()

    await expect(pager.getByRole('link', { name: 'Previous page' })).toHaveCount(0)
    if (pages > 1) {
      await pager.getByRole('link', { name: 'Next page' }).click()
      await expect(page).toHaveURL(/\/blog\/2\/?$/)
      await expect(page.getByRole('navigation', { name: /2 \/ \d+$/ }).first()).toBeVisible()
    }

    await open(page, `/blog/${pages}`)
    const last = page.getByRole('navigation', { name: /\d+ \/ \d+$/ }).first()
    await expect(last.getByRole('link', { name: 'Next page' })).toHaveCount(0)
  })

  test('a page past the end is a 404', async ({ page }, testInfo) => {
    desktopOnly(testInfo)
    await open(page, '/blog/1')
    const pages = Math.ceil((await listedCount(page)) / PAGE_SIZE)
    const response = await page.goto(`/blog/${pages + 1}`)
    expect(response?.status()).toBe(404)
  })

  test('listing pages have their own titles', async ({ page }, testInfo) => {
    desktopOnly(testInfo)
    await open(page, '/blog/1')
    await expect(page).toHaveTitle(/Blog/i)
    await open(page, '/blog/tags/')
    await expect(page).not.toHaveTitle(/^Brian Caffey$/)
  })
})
