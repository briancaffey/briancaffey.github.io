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

const mergeArrays = (arr) => {
  return [].concat.apply([], arr);
};

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
  return Object.entries(
    counter(mergeArrays(props.articles.map(x => x.tags)))
  ).sort((a, b) => b[1] - a[1]);
});
</script>

<style scoped></style>
