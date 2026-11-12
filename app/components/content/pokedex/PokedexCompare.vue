<template>
  <figure class="pk-compare">
    <div class="pk-compare-pair">
      <pokedex-model
        v-for="(side, i) in sides"
        :key="side.style"
        :ref="(el) => { panes[i] = el }"
        :src="pokedexModel(code, side.style)"
        :poster="pokedexImage(code, side.style)"
        :alt="`${name}: ${side.label}`"
        :label="side.label"
        :spin="false"
        height="22rem"
        @camera="(e: Event) => follow(i, e)"
      />
    </div>
    <figcaption>
      <slot>{{ name }}. Drag either model and the other follows.</slot>
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
// The same Pokémon from two generators, side by side, turning together.
const props = defineProps({
  code: { type: String, required: true },
  left: { type: String, default: 'legacy' },
  right: { type: String, default: 'base' },
  leftLabel: { type: String, default: '2025 · Hunyuan3D 2.1' },
  rightLabel: { type: String, default: '2026 · TRELLIS.2' }
})

const name = computed(() => POKEDEX_NAMES[props.code] || 'Pokémon')
const sides = computed(() => [
  { style: props.left, label: props.leftLabel },
  { style: props.right, label: props.rightLabel }
])
// The parts of <model-viewer> used here.
interface Viewer extends HTMLElement {
  cameraOrbit: string
  getCameraOrbit: () => { theta: number, phi: number }
}
const panes = ref<unknown[]>([])
const viewerOf = (i: number) => (panes.value[i] as { viewer?: Viewer } | null)?.viewer

// When one model is turned by hand, point the other camera the same way.
function follow (from: number, event: Event) {
  if ((event as CustomEvent).detail?.source !== 'user-interaction') { return }
  const source = viewerOf(from)
  const target = viewerOf(1 - from)
  if (!source?.getCameraOrbit || !target) { return }
  const o = source.getCameraOrbit()
  target.cameraOrbit = `${o.theta}rad ${o.phi}rad 105%`
}
</script>

<style scoped>
.pk-compare {
  margin: 1.5rem 0;
}

.pk-compare-pair {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.pk-compare-pair :deep(.pk-model) {
  margin: 0;
}

@media (min-width: 640px) {
  .pk-compare-pair {
    grid-template-columns: 1fr 1fr;
  }
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
