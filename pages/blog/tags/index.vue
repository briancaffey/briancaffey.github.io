<template>
  <div>
    <div class="text-xl text-center py-4">
      All tags
      <div class="mx-auto w-full md:w-1/2 mt-4 p-4">
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
