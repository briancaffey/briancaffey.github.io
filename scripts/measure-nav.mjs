// Measure the first client-side navigation (#39): Home -> Blog listing.
// Usage: node scripts/measure-nav.mjs [baseURL]   (serve .output/public first)
// Prints the navigation time and every request made during it, so you can see
// whether the browser downloads the Nuxt Content database (dump/WASM) or only
// the prerendered payload.
import { chromium } from '@playwright/test'

const base = process.argv[2] || 'http://localhost:4173'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

// Warm the cache the way a returning visitor would, then measure a fresh tab.
await page.goto(base + '/', { waitUntil: 'networkidle' })
await page.reload({ waitUntil: 'networkidle' })

const requests = []
page.on('requestfinished', async (req) => {
  try {
    const res = await req.response()
    const size = res ? Number((await res.headerValue('content-length')) || 0) : 0
    requests.push({ url: req.url().replace(base, ''), size })
  } catch {
    // the browser closed while a late request was still being read
  }
})

const t0 = Date.now()
await page.getByRole('banner').getByRole('link', { name: /^blog$/i }).first().click()
await page.waitForURL(/\/blog\/1\/?$/, { timeout: 60_000 })
await page.locator('.article-card').first().waitFor({ timeout: 60_000 })
const ms = Date.now() - t0

const cards = await page.locator('.article-card').count()
const heading = (await page.locator('h1').first().textContent())?.trim()
console.log(JSON.stringify({ navigationMs: ms, cards, heading }))
for (const r of requests) {
  if (/wasm|dump|sql|_payload|__nuxt_content|\.json/.test(r.url)) {
    console.log(`  ${r.url}  ${r.size ? Math.round(r.size / 1024) + ' KiB' : ''}`)
  }
}
console.log(`  (${requests.length} requests total)`)
await browser.close()
