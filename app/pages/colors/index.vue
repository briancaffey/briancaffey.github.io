<template>
  <div class="content-container">
    <h1 class="page-title">
      Design tokens
    </h1>
    <ul class="grid grid-cols-2 gap-4 pb-8 sm:grid-cols-3">
      <li v-for="token in tokens" :key="token.name" class="rounded border border-line p-3">
        <div class="h-16 rounded border border-line" :style="{ backgroundColor: `var(${token.variable})` }" />
        <p class="pt-2 font-semibold">
          {{ token.name }}
        </p>
        <p class="text-sm">
          <code>{{ token.variable }}</code>
        </p>
      </li>
    </ul>
    <div class="flex flex-wrap items-center gap-4 pb-8">
      <a class="btn" href="#">btn</a>
      <button class="btn-solid" type="button">
        btn-solid
      </button>
      <span class="chip">chip</span>
      <span class="chip chip-muted">chip-muted</span>
      <span class="chip-outline">chip-outline</span>
      <input class="field max-w-xs" placeholder="field">
    </div>
  </div>
</template>

<script setup lang="ts">
// A living reference for the names defined in tailwind.config.ts and the
// component classes in app/assets/css/tailwind.css.
const tokens = [
  { name: 'ink', variable: '--color' },
  { name: 'primary', variable: '--color-primary' },
  { name: 'secondary', variable: '--color-secondary' },
  { name: 'title', variable: '--color-title' },
  { name: 'tag', variable: '--color-tag' },
  { name: 'surface', variable: '--bg' },
  { name: 'surface-raised', variable: '--bg-secondary' },
  { name: 'code', variable: '--bg-code' },
  { name: 'line', variable: '--border-color' }
]

useHead({ meta: [{ name: 'robots', content: 'noindex' }] })
</script>
