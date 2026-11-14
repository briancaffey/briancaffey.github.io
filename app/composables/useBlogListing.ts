// The one query every listing page uses: home, /blog, /blog/<n> and the tag pages.
//
// - It selects only what a card, the tag cloud and the pager need. Article
//   bodies stay out, which keeps each listing page's prerendered payload small
//   (it was ~3.5 MB with every article's body in it — #39).
// - Drafts are dropped here, before anything is counted or paged (#43). Drafts
//   are still published at their own URL for review; they just aren't listed.
// - It has its own useAsyncData key. Listing pages used to share the key
//   `all-articles` while running different queries, so whichever page loaded
//   first decided what the others showed (#43).
export const BLOG_PAGE_SIZE = 10

const LISTING_FIELDS = [
  'path',
  'title',
  'description',
  'image',
  'tags',
  'date',
  'draft',
  'external'
] as const

export function useBlogListing() {
  return useAsyncData(
    'blog-listing',
    async () => {
      const articles = await queryCollection('blog')
        .select(...LISTING_FIELDS)
        .order('date', 'DESC')
        .all()
      return articles.filter(article => !article.draft)
    },
    { default: () => [] }
  )
}

// Number of /blog/<n> pages for a given number of listed articles (at least 1).
export function blogPageCount(articleCount: number) {
  return Math.max(1, Math.ceil(articleCount / BLOG_PAGE_SIZE))
}
