<template>
  <figure class="pk-model">
    <div class="pk-stage" :style="{ height }">
      <component
        :is="'model-viewer'"
        v-if="ready"
        ref="viewer"
        class="pk-viewer"
        :src="src"
        :alt="alt"
        loading="lazy"
        reveal="auto"
        camera-controls
        disable-zoom
        disable-pan
        touch-action="pan-y"
        interaction-prompt="none"
        :auto-rotate="spin ? '' : null"
        auto-rotate-delay="0"
        rotation-per-second="20deg"
        :camera-orbit="orbit"
        tone-mapping="neutral"
        :exposure="exposure"
        shadow-intensity="0.9"
        shadow-softness="1"
        @load="loaded = true"
        @error="failed = true"
        @camera-change="$emit('camera', $event)"
      />
      <img
        v-if="poster"
        class="pk-poster"
        :class="{ 'pk-poster-hidden': loaded }"
        :src="poster"
        :alt="alt"
        loading="lazy"
      >
      <span v-if="label" class="pk-label">{{ label }}</span>
      <span v-if="failed" class="pk-status">This model could not be loaded.</span>
      <span v-else-if="!loaded" class="pk-status">Loading the model…</span>
      <span v-else class="pk-status pk-hint">Drag to turn</span>
    </div>
    <figcaption v-if="$slots.default || caption">
      <slot>{{ caption }}</slot>
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
// One generated model on a small lit stage. Until the model arrives the stage shows the
// picture it was made from, so each viewer starts as the 2D input and becomes the 3D output.
defineProps({
  src: { type: String, required: true },
  poster: { type: String, default: '' },
  alt: { type: String, default: 'A generated 3D model' },
  label: { type: String, default: '' },
  caption: { type: String, default: '' },
  height: { type: String, default: '26rem' },
  orbit: { type: String, default: '25deg 78deg 105%' },
  exposure: { type: String, default: '1' },
  spin: { type: Boolean, default: true }
})
defineEmits(['camera'])

const ready = ref(false)
const loaded = ref(false)
const failed = ref(false)
const viewer = ref<HTMLElement | null>(null)
defineExpose({ viewer })

onMounted(async () => {
  try {
    await loadPokedexViewer()
    ready.value = true
  } catch {
    failed.value = true
  }
})
</script>

<style scoped>
.pk-model {
  margin: 1.5rem 0;
}

/* The stage stays light in every colour mode: the input pictures have white backgrounds. */
.pk-stage {
  position: relative;
  overflow: hidden;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  background: radial-gradient(ellipse at 50% 38%, #ffffff 0%, #f1f3f5 55%, #dfe3e8 100%);
}

.pk-viewer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  --poster-color: transparent;
  --progress-bar-color: #158876;
}

.pk-poster {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0 !important;
  padding: 2.25rem 1.5rem 2.5rem;
  object-fit: contain;
  mix-blend-mode: multiply;
  pointer-events: none;
  transition: opacity 0.6s ease;
}

.pk-poster-hidden {
  opacity: 0;
}

.pk-label,
.pk-status {
  position: absolute;
  left: 0.75rem;
  font-size: 0.75rem;
  line-height: 1;
  padding: 0.35rem 0.55rem;
  border-radius: 0.25rem;
  pointer-events: none;
}

.pk-label {
  top: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #fff;
  background: #1d2b36;
}

.pk-status {
  bottom: 0.75rem;
  color: #3d4b57;
  background: rgba(255, 255, 255, 0.82);
}

.pk-hint {
  opacity: 0.75;
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
