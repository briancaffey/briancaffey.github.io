<template>
  <div class="flex py-2">
    <external-link v-for="(l, i) in external" :key="i" :data="l">{{
      l
    }}</external-link>
  </div>
</template>

<script>
export default {
  props: {
    external: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style scoped></style>
