// RSS 2.0 feed, built from the content collection when the site is generated
// (#32). It replaces a hand-maintained public/feed.xml whose newest item was
// from October 2024. Prerendered to /feed.xml via nitro.prerender.routes.
// queryCollection is auto-imported in Nitro by @nuxt/content.

const SITE = 'https://briancaffey.github.io'

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;')

export default defineEventHandler(async (event) => {
  const articles = (await queryCollection(event, 'blog')
    .select('path', 'title', 'description', 'date', 'draft', 'tags')
    .order('date', 'DESC')
    .all())
    .filter(article => !article.draft)

  const items = articles.map((article) => {
    const url = `${SITE}${article.path}`
    const categories = (article.tags ?? []).map(tag => `      <category>${escape(tag)}</category>`).join('\n')
    return [
      '    <item>',
      `      <title>${escape(article.title)}</title>`,
      `      <link>${url}</link>`,
      `      <guid isPermaLink="true">${url}</guid>`,
      `      <pubDate>${new Date(article.date).toUTCString()}</pubDate>`,
      `      <description>${escape(article.description)}</description>`,
      categories,
      '    </item>'
    ].filter(Boolean).join('\n')
  })

  const lastBuildDate = articles[0] ? new Date(articles[0].date).toUTCString() : new Date(0).toUTCString()

  setHeader(event, 'content-type', 'application/rss+xml; charset=utf-8')
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    '    <title>Brian Caffey</title>',
    `    <link>${SITE}</link>`,
    `    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml" />`,
    '    <description>Brian Caffey writes about software engineering, AI and other fun things.</description>',
    '    <language>en</language>',
    `    <lastBuildDate>${lastBuildDate}</lastBuildDate>`,
    ...items,
    '  </channel>',
    '</rss>',
    ''
  ].join('\n')
})
