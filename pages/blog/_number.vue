<template>
  <div class="mx-auto max-w-6xl">
    <h1 class="text-center text-3xl py-8">
      {{ $t('blog.blogPosts') }} ({{ allItems.length }})
    </h1>
    <div class="mb-8">
      <pagination
        :paginated-items="paginatedItems"
        :all-items="allItems"
        :page-no="pageNo"
        :next-page="nextPage"
      />
    </div>
    <blog-list :articles="paginatedItems" />
    <pagination
      :paginated-items="paginatedItems"
      :all-items="allItems"
      :page-no="pageNo"
      :next-page="nextPage"
    />
  </div>
</template>

<script>
export default {
  async asyncData ({ $content, params, error }) {
    const pageNo = parseInt(params.number)

    const allItems = await $content({ deep: true })
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
      .where({ layout: { $ne: 'project' }, draft: { $ne: true } })
      .sortBy('date', 'desc')
      .fetch()

    const paginatedItems = await $content({ deep: true })
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
      .where({ draft: { $ne: true }, layout: { $ne: 'project' } })
      .sortBy('date', 'desc')
      .limit(10)
      .skip(9 * (pageNo - 1))
      .fetch()

    if (!paginatedItems.length) {
      return error({ statusCode: 404, message: 'No posts found!' })
    }

    const nextPage = paginatedItems.length === 10
    return {
      paginatedItems, nextPage, pageNo, allItems
    }
  }
}
</script>

<style scoped>

</style>
