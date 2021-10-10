<template>
  <div class="mx-auto max-w-6xl">
    <h1 class="text-center text-3xl py-8">
      {{ $t('blog.blogPosts') }} ({{ articles.length }})
    </h1>
    <blog-list :articles="articles" />
  </div>
</template>

<script>
export default {
  async asyncData ({ $content, params }) {
    const allArticles = await $content({ deep: true })
      .only(['title'])
      .where({ draft: { $ne: true }, layout: { $eq: 'post' } })
      .sortBy('date', 'desc')
      .fetch()

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
        'external'
      ])
      .where({ draft: { $ne: true } })
      .sortBy('date', 'desc')
      .fetch()

    articles = articles.filter(x => !x.path.startsWith('/projects/'))
    return {
      articles, allArticles
    }
  },
  head () {
    return {
      title: "Brian Caffey's Blog"
    }
  }
}
</script>

<style></style>
