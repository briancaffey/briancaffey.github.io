<template>
  <nav class="mx-auto text-center" :aria-label="`${$t('blog.blogPosts')} · ${pageNo} / ${pageCount}`">
    <nuxt-link
      v-if="pageNo > 1"
      :to="`/blog/${pageNo - 1}`"
      class="chip mx-1 px-4 py-2 text-xl"
      aria-label="Previous page"
      rel="prev"
    >
      ←
    </nuxt-link>
    <!-- At either end the arrow is not a link (it used to link to the current page). -->
    <span
      v-else
      class="chip chip-muted mx-1 px-4 py-2 text-xl"
      aria-disabled="true"
    >←</span>
    <span class="chip mx-1 py-2 text-xl" aria-current="page">
      {{ pageNo }} / {{ pageCount }}
    </span>
    <nuxt-link
      v-if="pageNo < pageCount"
      :to="`/blog/${pageNo + 1}`"
      class="chip mx-1 px-4 py-2 text-xl"
      aria-label="Next page"
      rel="next"
    >
      →
    </nuxt-link>
    <span
      v-else
      class="chip chip-muted mx-1 px-4 py-2 text-xl"
      aria-disabled="true"
    >→</span>
  </nav>
</template>

<script setup lang="ts">
defineProps<{
  pageNo: number
  pageCount: number
}>()
</script>
