<template>
  <nuxt-link :key="tag" :to="`/blog/tags/${tag}/`">
    <div
      class="
        px-2
        text-lg
        text-white
        shadow
        rounded-lg
        bg-black
        mx-1
        mb-1
        uppercase
        cursor-pointer
        tag
      "
    >
      {{ tag }} 🏷️
      <span
        v-if="count"
      >(<span class="font-bold">{{ count }}</span>)</span>
    </div>
  </nuxt-link>
</template>

<script setup lang="ts">
defineProps({
  tag: {
    type: String,
    default: ''
  },
  count: {
    type: Number,
    default: null
  }
});
</script>

<style scoped>
.tag {
  background-color: var(--color-tag);
  transition: transform .2s;
}
.tag:hover {
  transform: scale(1.05);
}
</style>
