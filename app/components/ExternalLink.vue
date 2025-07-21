<template>
  <div class="pr-4 rounded">
    <a :href="data.link">
      <nuxt-img
        :src="`/icons/${data.site}.png`"
        :alt="data.link"
        class="rounded"
        width="25"
        format="webp"
        sizes="25px"
      />
    </a>
  </div>
</template>

<script setup lang="ts">
defineProps({
  data: {
    type: Object,
    default: () => {}
  }
})
</script>

