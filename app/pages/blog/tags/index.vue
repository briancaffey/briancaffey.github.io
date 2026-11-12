<template>
  <div class="mx-auto max-w-6xl">
    <div class="text-3xl text-center py-8">
      🏷️ {{ $t('tags.allTags') }} 🏷️
      <div class="mt-4 p-4">
        <tag-cloud :articles="articles || []" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: articles } = await useAsyncData('all-articles', () =>
  queryCollection("blog")
    .order('date', 'DESC')
    .all()
    // Drafts are published for review but stay off the listings.
    .then(list => list.filter(article => !article.draft))
)
</script>

<style scoped></style>
