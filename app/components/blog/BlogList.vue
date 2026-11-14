<template>
  <div>
    <ul class="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
      <blog-card
        v-for="article of articles"
        :key="article.path"
        :article="article"
      />
    </ul>
  </div>
</template>

<script setup lang="ts">
// Listing items come from useBlogListing; `path` is unique per article.
interface ArticleWithSlug {
  path: string;
  [key: string]: unknown;
}

defineProps<{
  articles: ArticleWithSlug[];
}>();
</script>

<style scoped></style>
