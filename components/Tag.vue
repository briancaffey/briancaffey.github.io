<template>
  <nuxt-link :key="tag" :to="localePath(`/blog/tags/${tag}/`)">
    <div
      class="
        px-2
        text-lg
        text-white
        shadow
        rounded-lg
        bg-black
        mx-1
        mt-1
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

<script>
export default {
  props: {
    tag: {
      type: String,
      default: ''
    },
    count: {
      type: Number,
      default: null
    }
  }
}
</script>

<style scoped>
.tag {
  background-color: var(--color-primary);
  transition: transform .2s;
}
.tag:hover {
  transform: scale(1.05);
}
</style>
