<template>
  <div>
    <div class="px-4 lg:px-32">
      <div class="sm:p-16 text-center py-4">
        <div class="p-3 rounded border border-white hero">
          Welcome to <strong>Brian Caffey</strong>'s personal website. This site
          is mostly a blog about software engineering as well as some of my
          other hobbies and interests.
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 class="text-2xl pb-4 text-center">My latest blog post</h2>
          <ul>
            <blog-card :article="articles[0]" />
          </ul>
          <div class="pt-8 text-center">
            <nuxt-link to="/blog/" class="p-4 m-4 rounded border btn"
              >All {{ articles.length }} articles</nuxt-link
            >
          </div>
        </div>
        <div>
          <h2 class="text-2xl pb-4 text-center">Popular tags</h2>
          <tag-cloud :articles="articles" :limit="40" />
          <div class="pt-8 text-center">
            <nuxt-link to="/blog/tags/" class="p-4 m-4 rounded border btn"
              >All tags</nuxt-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ $content, params }) {
    let articles = await $content({ deep: true })
      .only([
        'title',
        'description',
        'image',
        'slug',
        'author',
        'date',
        'path',
        'tags',
      ])
      .sortBy('date', 'desc')
      .fetch()

    articles = articles.filter((x) => !x.path.startsWith('/projects/'))
    return {
      articles,
    }
  },
  head() {
    return {
      title: 'Brian Caffey',
    }
  },
}
</script>

<style></style>
