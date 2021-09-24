<template>
  <div class="pr-4 rounded">
    <a :href="data.link">
      <img
        :src="`/icons/${data.site}.png`"
        :alt="data.link"
        class="rounded"
        width="25"
      >
    </a>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => []
    }
  }
}
</script>

<style scoped></style>
