<template>
  <div class="flex flex-wrap justify-center">
    <tag
      v-for="tag in tagCounts().slice(0, limit)"
      :key="tag[0]"
      :tag="tag[0]"
      :count="tag[1]"
    />
  </div>
</template>

<script>
export default {
  props: {
    articles: {
      type: Array,
      default: () => [],
    },
    limit: {
      type: Number,
      default: Infinity,
    },
  },
  methods: {
    mergeArrays(arr) {
      return [].concat.apply([], arr)
    },
    counter(list) {
      return list.reduce(
        (prev, curr) => ({
          ...prev,
          [curr]: 1 + (prev[curr] || 0),
        }),
        {}
      )
    },
    tagCounts() {
      return Object.entries(
        this.counter(this.mergeArrays(this.articles.map((x) => x.tags)))
      ).sort((a, b) => b[1] - a[1])
    },
  },
}
</script>

<style scoped></style>
