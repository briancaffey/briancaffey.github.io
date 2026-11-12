<template>
  <div ref="root" class="relative flex">
    <button
      ref="trigger"
      type="button"
      class="picker-button"
      aria-controls="locale-menu"
      aria-haspopup="true"
      :aria-expanded="open"
      :aria-label="$t('nav.language')"
      @click="open = !open"
    >
      <img
        :src="`/icons/emoji/${current?.emoji ?? 'flag-us'}.svg`"
        alt=""
        width="32"
        height="32"
      >
    </button>

    <ul
      v-if="open"
      id="locale-menu"
      class="locale-menu"
    >
      <li v-for="option in locales" :key="option.code">
        <button
          type="button"
          class="locale-menu__option"
          :lang="option.language"
          :aria-current="option.code === locale ? 'true' : undefined"
          @click="choose(option.code)"
        >
          <img
            :src="`/icons/emoji/${option.emoji}.svg`"
            alt=""
            width="16"
            height="16"
          >
          {{ option.name }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside, onKeyStroke } from '@vueuse/core'

const { locale, locales, setLocale } = useI18n()

const current = computed(() => locales.value.find(option => option.code === locale.value))

const open = ref(false)
const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLButtonElement | null>(null)

async function choose(code: typeof locale.value) {
  // Close first: loading a locale's messages can take a moment.
  open.value = false
  trigger.value?.focus()
  await setLocale(code)
}

onClickOutside(root, () => { open.value = false })
onKeyStroke('Escape', () => {
  if (!open.value) return
  open.value = false
  trigger.value?.focus()
})
</script>

<style scoped>
.locale-menu {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: var(--z-popover);
  margin-top: 0.5rem;
  padding: 0.25rem;
  min-width: 9rem;
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  background-color: var(--bg);
  box-shadow: 0 12px 24px -8px rgb(0 0 0 / 0.35);
}

.locale-menu__option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  color: var(--color-primary);
  text-align: left;
  white-space: nowrap;
}

.locale-menu__option:hover,
.locale-menu__option:focus-visible {
  background-color: var(--bg-secondary);
}

.locale-menu__option[aria-current='true'] {
  font-weight: 600;
}
</style>
