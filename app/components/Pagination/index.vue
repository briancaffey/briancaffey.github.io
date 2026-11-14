<template>
  <div class="mx-auto text-center">
    <nuxt-link
      :to="prevLink"
      class="chip mx-1 px-4 py-2 text-xl"
      :class="{ 'chip-muted': pageNo === 1 }"
    >
      ←
    </nuxt-link>
    <nuxt-link
      :to="`/blog/${pageNo}`"
      class="chip mx-1 py-2 text-xl"
    >
      {{ pageNo }}
    </nuxt-link>
    <nuxt-link
      :to="nextPage ? `/blog/${pageNo + 1}` : `/blog/${pageNo}`"
      class="chip mx-1 px-4 py-2 text-xl"
      :class="{ 'chip-muted': !nextPage }"
    >
      →
    </nuxt-link>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  paginatedItems: {
    type: Array,
    default: () => []
  },
  nextPage: {
    type: Boolean,
    default: false
  },
  pageNo: {
    type: Number,
    default: 0
  },
  allItems: {
    type: Array,
    default: () => []
  }
})

const prevLink = computed(() => {
  return props.pageNo === 1 ? '/blog/1' : `/blog/${props.pageNo - 1}`
})
</script>
