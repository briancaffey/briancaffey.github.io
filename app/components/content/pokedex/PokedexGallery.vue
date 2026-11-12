<template>
  <div class="pk-gallery">
    <pokedex-model
      v-for="item in entries"
      :key="item.code + item.style"
      :src="pokedexModel(item.code, item.style)"
      :poster="pokedexImage(item.code, item.style)"
      :alt="`${item.name}, ${item.styleName}: a generated 3D model`"
      :label="item.name"
      :caption="showStyle ? item.styleName : ''"
      height="17rem"
    />
  </div>
</template>

<script setup lang="ts">
// A grid of models. `items` is a comma-separated list of <code>-<style>, e.g. "059-legacy,149-legacy".
const props = defineProps({
  items: { type: String, required: true },
  showStyle: { type: Boolean, default: false }
})

const entries = computed(() => props.items.split(',').map(s => s.trim()).filter(Boolean).map((pair) => {
  const [code = '', style = 'legacy'] = pair.split('-')
  return { code, style, name: POKEDEX_NAMES[code] || code, styleName: POKEDEX_STYLES[style]?.name || style }
}))
</script>

<style scoped>
.pk-gallery {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  margin: 1.5rem 0;
}

.pk-gallery :deep(.pk-model) {
  margin: 0;
}

@media (min-width: 520px) {
  .pk-gallery {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 900px) {
  .pk-gallery {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
</style>
