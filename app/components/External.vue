<template>
  <div class="flex py-2">
    <external-link v-for="(l, i) in external" :key="i" :data="l">
      {{ l }}
    </external-link>
  </div>
</template>

<script setup>
defineProps({
  external: {
    type: Array,
    default: () => []
  }
});
</script>
