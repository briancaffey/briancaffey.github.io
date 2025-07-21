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

<script setup lang="ts">
import { computed } from 'vue';

// Define a minimal interface that only requires the tags property
interface ArticleWithTags {
  tags?: string[];
}

const props = defineProps<{
  articles: ArticleWithTags[];
  limit?: number;
}>();

const counter = (list: string[]): Record<string, number> => {
  return list.reduce(
    (prev: Record<string, number>, curr: string) => ({
      ...prev,
      [curr]: 1 + (prev[curr] || 0)
    }),
    {}
  );
};

const tagCounts = computed(() => {
  // Filter articles that have tags and extract the tags
  const articlesWithTags = props.articles.filter((article: ArticleWithTags) =>
    article && article.tags && Array.isArray(article.tags) && article.tags.length > 0
  );

  // Extract all tags from articles
  const allTags = articlesWithTags.map((article: ArticleWithTags) => article.tags!).flat();

  // Count tags
  const counts = counter(allTags);

  // Convert to array and sort by count
  return Object.entries(counts).sort((a, b) => (b[1] as number) - (a[1] as number));
});
</script>