<template>
  <div class="mx-auto max-w-6xl">
    <div class="px-4 lg:px-32">
      <div class="sm:p-16 text-center py-4">
        <div class="p-3 rounded border border-white hero">
          <strong>{{ $t('pleaseDisableAdblock') }}</strong>
        </div>
      </div>
      <blog-list :articles="allItems" />
    </div>
  </div>
</template>

<script>
export default {
  async asyncData ({ $content, params, error }) {
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

    // console.log(allItems)

    return {
      allItems
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
