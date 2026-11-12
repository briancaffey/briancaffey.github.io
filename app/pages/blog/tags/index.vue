<template>
  <div class="content-container">
    <h1 class="page-title">
      🏷️ {{ $t('tags.allTags') }} 🏷️
    </h1>
    <tag-cloud class="justify-center pb-8 text-3xl" :articles="articles || []" />
  </div>
</template>

<script setup lang="ts">
const { data: articles } = await useAsyncData('all-articles', () =>
  queryCollection("blog")
    .order('date', 'DESC')
    .all()
)
</script>

<style scoped></style>
