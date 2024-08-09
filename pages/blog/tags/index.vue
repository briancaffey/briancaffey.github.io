<template>
  <div class="mx-auto max-w-6xl">
    <div class="text-3xl text-center py-8">
      🏷️ {{ $t('tags.allTags') }} 🏷️
      <div class="mt-4 p-4">
        <tag-cloud :articles="articles" />
      </div>
    </div>
  </div>
</template>

<script setup>
// todo(migration): fix undefined tags
const { data: articles } = await useAsyncData('all-articles', () =>
  queryContent("/")
    .where({ draft: { $ne: true } })
    .sort({'date': -1})
    .find()
)
</script>

<style scoped></style>
