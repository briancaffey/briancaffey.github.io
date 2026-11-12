<template>
  <div
    class="flex items-center"
    role="group"
    :aria-label="$t('nav.theme')"
  >
    <button
      v-for="mode in modes"
      :key="mode.value"
      type="button"
      class="picker-button"
      :aria-label="$t(`theme.${mode.value}`)"
      :aria-pressed="mounted && $colorMode.preference === mode.value"
      @click="$colorMode.preference = mode.value"
    >
      <img
        :src="`/icons/emoji/${mode.icon}.svg`"
        alt=""
        width="32"
        height="32"
      >
    </button>
  </div>
</template>

<script setup lang="ts">
const modes = [
  { value: 'system', icon: 'desktop' },
  { value: 'light', icon: 'sun' },
  { value: 'dark', icon: 'moon' },
  { value: 'sepia', icon: 'coffee' }
]

// The stored preference is only known in the browser; rendering it before
// mount would not match the server-rendered markup.
const mounted = ref(false)
onMounted(() => { mounted.value = true })
</script>
