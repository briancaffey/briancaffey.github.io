<template>
  <div class="flex py-2">
    <external-link v-for="(l, i) in external" :key="i" :data="l">
      {{ l.link }}
    </external-link>
  </div>
</template>

<script setup lang="ts">
interface ExternalLinkData {
  link: string;
  site: string;
}

interface ExternalProps {
  external: ExternalLinkData[];
}

defineProps<ExternalProps>();
</script>
