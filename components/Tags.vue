<template>
  <div class="flex flex-wrap -ml-1 py-2">
    <nuxt-link v-for="tag in tags" :key="tag" :to="`/blog/tags/${tag}/`">
      <div
        class="px-2 text-sm shadow rounded-lg bg-white mx-1 mt-1 uppercase cursor-pointer"
      >
        {{ tag }} 🏷️
      </div>
    </nuxt-link>
  </div>
</template>

<script>
export default {
  props: {
    tags: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style scoped></style>
