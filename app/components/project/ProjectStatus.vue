<template>
  <aside class="project-status rounded-lg border border-line bg-surface-raised p-4 text-primary" :aria-label="project.title">
    <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
      <component :is="headingTag" class="text-lg font-bold leading-tight">
        <NuxtLink v-if="link" :to="project.article" class="hover:underline">{{ project.title }}</NuxtLink>
        <template v-else>{{ project.title }}</template>
      </component>
      <span class="status" :data-status="project.status">{{ $t(`projects.status.${project.status}`) }}</span>
      <span v-if="project.updated" class="text-sm text-secondary">{{ $t('projects.updated') }} {{ formatted }}</span>
    </div>
    <p v-if="summary" class="mt-2">{{ project.summary }}</p>
    <dl class="mt-3 grid gap-4 sm:grid-cols-2">
      <div>
        <dt class="label">{{ $t('projects.then') }} ({{ project.year }})</dt>
        <dd>
          <ul class="chips">
            <li v-for="m in project.then.models" :key="m" class="model">{{ m }}</li>
            <li v-for="s in project.then.stack" :key="s">{{ s }}</li>
          </ul>
        </dd>
      </div>
      <div v-if="project.now">
        <dt class="label">{{ $t('projects.now') }}</dt>
        <dd>
          <ul class="chips">
            <li v-for="m in project.now.models" :key="m" class="model">{{ m }}</li>
            <li v-for="s in project.now.stack" :key="s">{{ s }}</li>
          </ul>
        </dd>
      </div>
    </dl>
    <p v-if="project.now?.notes" class="mt-3 text-sm">{{ project.now.notes }}</p>
    <p class="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
      <a v-if="project.repo" :href="project.repo" class="underline">{{ $t('projects.source') }}</a>
      <a v-if="project.video" :href="project.video" class="underline">{{ $t('projects.video') }}</a>
      <NuxtLink v-if="!link" to="/projects" class="underline">{{ $t('projects.all') }}</NuxtLink>
      <span v-if="project.event" class="text-secondary">{{ project.event }}</span>
    </p>
  </aside>
</template>

<script setup lang="ts">
// A project's entry from the registry (content/projects/*.yml): what it was
// built with, what it runs on now. Shown at the top of the project's article
// and, with `summary` and `link`, as a row on /projects.
const props = withDefaults(defineProps<{
  project: {
    title: string, year: number, summary: string, article: string, repo?: string, event?: string,
    status: 'archived' | 'reviving' | 'running', updated?: string, video?: string,
    then: { stack: string[], models: string[] },
    now?: { stack: string[], models: string[], notes?: string }
  }
  summary?: boolean
  link?: boolean
  headingTag?: string
}>(), { summary: false, link: false, headingTag: 'p' })

const { locale } = useI18n()
const formatted = computed(() => props.project.updated
  ? new Date(`${props.project.updated}T12:00:00`).toLocaleDateString(locale.value, { year: 'numeric', month: 'long', day: 'numeric' })
  : '')
</script>

<style scoped>
.label {
  @apply mb-1 text-sm font-bold uppercase tracking-wide text-secondary;
}

.chips {
  @apply flex flex-wrap gap-1.5 text-sm;
}

.chips li {
  @apply rounded border border-line px-1.5 py-0.5;
}

.chips li.model {
  @apply border-primary font-semibold;
}

.status {
  @apply rounded-lg border border-line px-2 py-0.5 text-sm font-bold uppercase tracking-wide;
}

.status[data-status="running"] {
  @apply border-primary;
}

.status[data-status="running"]::before {
  content: "● ";
}
</style>
