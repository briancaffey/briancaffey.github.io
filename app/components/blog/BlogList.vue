<template>
  <div class="lg:px-32 px-2 sm:px-4">
    <ul class="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
      <blog-card
        v-for="article of articles"
        :key="article.slug"
        :article="article"
      />
    </ul>
  </div>
</template>

<script setup lang="ts">
// Define a minimal interface that includes the slug property needed for the key
interface ArticleWithSlug {
  slug: string;
  [key: string]: unknown;
}

defineProps<{
  articles: ArticleWithSlug[];
}>();
</script>

<style scoped></style>
