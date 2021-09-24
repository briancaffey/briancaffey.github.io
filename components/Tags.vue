<template>
  <div class="flex flex-wrap -ml-1 py-2">
    <tag v-for="tag in tags" :key="tag" :tag="tag" />
  </div>
</template>

<script>
export default {
  props: {
    tags: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style scoped></style>
