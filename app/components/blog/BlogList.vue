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

<script setup>
defineProps({
  articles: {
    type: Array,
    default: () => []
  }
});
</script>

<style scoped></style>
