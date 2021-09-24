<template>
  <div class="mx-auto max-w-6xl">
    <h1 class="text-center text-3xl py-8">
      {{ $t('blog.drafts') }} ({{ articles.length }})
    </h1>
    <blog-list :articles="articles" />
  </div>
</template>

<script>
export default {
  async asyncData ({ $content, params }) {
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
      .where({ draft: { $eq: true } })
      .sortBy('date', 'desc')
      .fetch()

    articles = articles.filter(x => !x.path.startsWith('/projects/'))
    return {
      articles
    }
  },
  head () {
    return {
      title: "Brian Caffey's Blog",
      meta: [
        {
          name: 'robots',
          content: 'noindex'
        }
      ]
    }
  }
}
</script>

<style></style>
