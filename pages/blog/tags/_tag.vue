<template>
  <div>
    <div class="text-xl text-center py-4">
      Blog posts tagged with
      <nuxt-link :to="`/blog/tags/${$route.params.tag}/`">
        <span class="bg-white rounded-lg text-small px-2 py-1 uppercase shadow">
          {{ $route.params.tag }} 🏷️
        </span>
      </nuxt-link>
    </div>
    <blog-list :articles="articles" />
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
      .where({ tags: { $containsAny: [params.tag] } })
      .sortBy('date', 'desc')
      .fetch()

    articles = articles.filter((x) => !x.path.startsWith('/projects/'))
    return {
      articles,
    }
  },
}
</script>

<style scoped></style>
