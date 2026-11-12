<template>
  <figure class="pk-pictures">
    <div class="pk-pictures-grid">
      <div v-for="item in entries" :key="item.code + item.style" class="pk-picture">
        <img :src="pokedexImage(item.code, item.style)" :alt="`${item.name}, ${item.styleName}`" loading="lazy">
        <span>{{ item.name }} · {{ item.styleName }}</span>
      </div>
    </div>
    <figcaption v-if="caption">
      {{ caption }}
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
// A grid of flat pictures. `items` is a comma-separated list of <code>-<style>.
const props = defineProps({
  items: { type: String, required: true },
  caption: { type: String, default: '' }
})

const entries = computed(() => props.items.split(',').map(s => s.trim()).filter(Boolean).map((pair) => {
  const [code = '', style = 'base'] = pair.split('-')
  return { code, style, name: POKEDEX_NAMES[code] || code, styleName: POKEDEX_STYLES[style]?.name || style }
}))
</script>

<style scoped>
.pk-pictures {
  margin: 1.5rem 0;
}

.pk-pictures-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

@media (min-width: 640px) {
  .pk-pictures-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.pk-picture {
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  background: #fff;
  overflow: hidden;
}

.pk-picture img {
  width: 100%;
  aspect-ratio: 1;
  margin: 0 !important;
  padding: 0.5rem;
  object-fit: contain;
}

.pk-picture span {
  display: block;
  padding: 0.4rem 0.5rem 0.55rem;
  font-size: 0.75rem;
  line-height: 1.2;
  text-align: center;
  color: #1d2b36;
  background: #eef1f4;
}

figcaption {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.45;
  text-align: center;
  color: var(--color-secondary);
  opacity: 0.85;
}
</style>
