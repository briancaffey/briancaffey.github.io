<template>
  <nuxt-link :key="tag" :to="localePath(`/blog/tags/${tag}/`)">
    <div
      class="px-2 text-sm shadow rounded-lg bg-white mx-1 mt-1 uppercase cursor-pointer"
    >
      {{ tag }} 🏷️
      <span v-if="count"
        >(<span class="font-bold">{{ count }}</span
        >)</span
      >
    </div>
  </nuxt-link>
</template>

<script>
export default {
  props: {
    tag: {
      type: String,
      default: '',
    },
    count: {
      type: Number,
      default: null,
    },
  },
}
</script>

<style scoped></style>
