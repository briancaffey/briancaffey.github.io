<template>
  <div class="mx-auto max-w-6xl">
    <div class="text-3xl text-center py-8">
      {{ $t('tags.allTags') }}
      <div class="mt-4 p-4">
        <tag-cloud :articles="articles" />
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
}
</script>

<style scoped></style>
