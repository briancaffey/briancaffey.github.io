<template>
  <ul class="not-prose my-4 flex flex-col gap-2">
    <li v-for="p in projects" :key="p.slug" class="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-line pb-2">
      <NuxtLink :to="p.article" class="font-bold underline">{{ p.title }}</NuxtLink>
      <span class="text-sm">{{ p.year }}</span>
      <span class="rounded border border-line px-1.5 text-sm font-bold uppercase tracking-wide">{{ $t(`projects.status.${p.status}`) }}</span>
      <span v-if="p.now" class="text-sm">{{ p.now.models.join(', ') }}</span>
    </li>
  </ul>
</template>

<script setup lang="ts">
// The registry as a compact list, for use inside an article: ::project-list
const { data: projects } = await useAsyncData('project-list', async () => {
  const all = await queryCollection('projects').all()
  const rank = { running: 0, reviving: 1, archived: 2 }
  return all.sort((a, b) => rank[a.status] - rank[b.status] || b.year - a.year)
})
</script>
