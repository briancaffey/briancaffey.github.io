<template>
  <div class="flex flex-wrap justify-left">
    <tag
      v-for="tag in tagCounts.slice(0, limit)"
      :key="tag[0]"
      :tag="tag[0]"
      :count="tag[1]"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  articles: {
    type: Array,
    default: () => []
  },
  limit: {
    type: Number,
    default: Infinity
  }
});

const counter = (list) => {
  return list.reduce(
    (prev, curr) => ({
      ...prev,
      [curr]: 1 + (prev[curr] || 0)
    }),
    {}
  );
};

const tagCounts = computed(() => {
  // Filter articles that have tags and extract the tags
  const articlesWithTags = props.articles.filter(article =>
    article && article.tags && Array.isArray(article.tags) && article.tags.length > 0
  );

  // Extract all tags from articles
  const allTags = articlesWithTags.map(article => article.tags).flat();

  // Count tags
  const counts = counter(allTags);

  // Convert to array and sort by count
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
});
</script>

<style scoped></style>
