import type { Page } from '@playwright/test'

export const ARTICLE = '/2025/09/09/hnfm-openai-gpt-oss-hackathon-project-hacker-news-ai-podcast-app'

export const PAGES = [
  { name: 'home', path: '/' },
  { name: 'blog list', path: '/blog/1' },
  { name: 'tags', path: '/blog/tags' },
  { name: 'contact', path: '/contact' },
  { name: 'article', path: ARTICLE }
]

export const COLOR_MODES = ['light', 'dark', 'sepia'] as const

// Everything else is blocked so that tests do not depend on other services.
const ALLOWED_HOSTS = ['localhost', '127.0.0.1']

/**
 * Open a page with third-party requests (analytics, ads, chat, comments, embeds)
 * blocked, and wait until Vue has hydrated so that click handlers are attached.
 */
export async function open(page: Page, path: string, options: { settle?: boolean } = {}) {
  await page.route(
    url => !ALLOWED_HOSTS.includes(url.hostname),
    route => route.abort()
  )
  // NO_WEBFONT=1 renders with the fallback font, which separates layout
  // changes from typeface changes when comparing two builds.
  if (process.env.NO_WEBFONT) await page.route('**/fonts/*.woff2', route => route.abort())
  const response = await page.goto(path)
  await page.waitForFunction(() => {
    const nuxt = (window as unknown as { useNuxtApp?: () => { isHydrating?: boolean } }).useNuxtApp?.()
    return nuxt?.isHydrating === false
  })
  if (options.settle) {
    // Screenshots need the fonts and the images in view.
    await page.evaluate(() => document.fonts.ready)
    await page.waitForFunction(() => Array.from(document.images)
      .filter(img => img.getBoundingClientRect().top < window.innerHeight)
      .every(img => img.complete))
  }
  return response
}

/** Set the colour mode the way a returning visitor would have it stored. */
export async function useColorMode(page: Page, mode: (typeof COLOR_MODES)[number]) {
  await page.addInitScript((value) => {
    window.localStorage.setItem('nuxt-color-mode', value)
  }, mode)
}

export type Box = { x: number, y: number, width: number, height: number }

export function overlaps(a: Box, b: Box) {
  return a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height
}
