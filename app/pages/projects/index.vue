<template>
  <div class="content-container">
    <h1 class="page-title">
      {{ $t('projects.projects') }} ({{ projects?.length || 0 }})
    </h1>
    <p class="mb-6 text-primary">{{ $t('projects.intro') }}</p>
    <ul class="flex flex-col gap-4 pb-8">
      <li v-for="p in projects" :key="p.slug">
        <ProjectStatus :project="p" summary link heading-tag="h2" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
// Every project in the registry, newest first, running ones on top.
const { data: projects } = await useAsyncData('projects', async () => {
  const all = await queryCollection('projects').all()
  const rank = { running: 0, reviving: 1, archived: 2 }
  return all.sort((a, b) => rank[a.status] - rank[b.status] || b.year - a.year || a.title.localeCompare(b.title))
})
const { t } = useI18n()
useHead(() => ({ title: t('projects.projects') }))
</script>
