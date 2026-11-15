<template>
  <section class="portrait-lab">
    <h1 class="text-3xl sm:text-4xl font-bold">
      {{ $t('portrait.title') }}
    </h1>
    <p class="blurb mx-auto max-w-xl pt-2 pb-6">
      {{ $t('portrait.blurb', { count: portraitStyles.length }) }}
    </p>

    <figure class="frame mx-auto">
      <div class="stage">
        <img
          :key="current.slug"
          class="shot"
          :src="`${BASE}/${current.slug}.webp`"
          :alt="isOriginal
            ? 'Brian Caffey at the Liberty Bell in Philadelphia'
            : `Brian Caffey at the Liberty Bell in Philadelphia, restyled as ${current.name}`"
          width="1024"
          height="768"
          fetchpriority="high"
        >

        <template v-if="compare">
          <img
            class="shot shot-original"
            :src="`${BASE}/original.webp`"
            :alt="$t('portrait.original')"
            width="1024"
            height="768"
            :style="{ clipPath: `inset(0 ${100 - split}% 0 0)` }"
          >
          <div class="divider" :style="{ left: `${split}%` }" aria-hidden="true">
            <span class="knob" />
          </div>
          <span class="edge-label edge-left" aria-hidden="true">{{ $t('portrait.original') }}</span>
          <span class="edge-label edge-right" aria-hidden="true">{{ current.name }}</span>
          <input
            v-model.number="split"
            class="range"
            type="range"
            min="0"
            max="100"
            step="1"
            :aria-label="$t('portrait.compare')"
          >
        </template>
      </div>

      <figcaption class="caption">
        <div class="caption-head">
          <span class="caption-name">{{ current.name }}</span>
          <span class="caption-category">{{ current.category }}</span>
        </div>
        <p class="caption-desc">{{ sentence }}</p>

        <button
          v-if="!isOriginal"
          class="disclosure"
          :aria-expanded="showPrompt"
          @click="showPrompt = !showPrompt"
        >
          {{ showPrompt ? $t('portrait.hidePrompt') : $t('portrait.showPrompt') }}
        </button>

        <div v-if="showPrompt && !isOriginal" class="details">
          <p class="prompt">{{ current.prompt }}</p>
          <dl class="meta">
            <div>
              <dt>{{ $t('portrait.model') }}</dt>
              <dd>{{ current.model }}</dd>
            </div>
            <div>
              <dt>{{ $t('portrait.served') }}</dt>
              <dd>{{ current.engine }}</dd>
            </div>
            <div>
              <dt>{{ $t('portrait.node') }}</dt>
              <dd>{{ current.node }} · {{ current.precision }}</dd>
            </div>
            <div>
              <dt>{{ $t('portrait.sampling') }}</dt>
              <dd>{{ current.steps }} steps · seed {{ current.seed }} · {{ current.seconds }}s</dd>
            </div>
          </dl>
        </div>
      </figcaption>
    </figure>

    <div class="controls">
      <button class="ctrl" :aria-label="$t('portrait.previous')" @click="step(-1)">
        ‹
      </button>
      <button class="ctrl ctrl-random" @click="randomize">
        🎲 {{ $t('portrait.random') }}
      </button>
      <button class="ctrl" :aria-label="$t('portrait.next')" @click="step(1)">
        ›
      </button>
      <button
        v-if="!isOriginal"
        class="ctrl ctrl-toggle"
        :class="{ 'ctrl-on': compare }"
        :aria-pressed="compare"
        @click="compare = !compare"
      >
        {{ $t('portrait.compare') }}
      </button>
      <span class="counter">{{ String(index + 1).padStart(3, '0') }} / {{ styles.length }}</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { portraitStyles } from '~/data/portrait/styles'

const BASE = '/static/contact/portrait'
const { t } = useI18n()

// The photo as it came off the phone leads the set, so the page opens on him
// rather than on a restyle. It has no prompt and no model behind it, which is
// what `prompt: null` signals to the template.
const styles = computed(() => [
  {
    slug: 'original',
    name: t('portrait.original'),
    category: t('portrait.photograph'),
    description: t('portrait.originalDesc'),
    prompt: null as string | null
  },
  ...portraitStyles
])

const index = ref(0)
const compare = ref(false)
const split = ref(50)
const showPrompt = ref(false)

const current = computed(() => styles.value[index.value]!)
const sentence = computed(() => {
  const d = current.value.description
  return d.charAt(0).toUpperCase() + d.slice(1) + '.'
})
const isOriginal = computed(() => current.value.prompt === null)

function go(next: number) {
  index.value = (next + styles.value.length) % styles.value.length
  showPrompt.value = false
  // comparing the photo with itself shows nothing
  if (isOriginal.value) compare.value = false
}

function step(delta: number) {
  go(index.value + delta)
  preload(index.value + delta)
}

function randomize() {
  // never lands back on the photo: the dice are for the restyles
  go(1 + Math.floor(Math.random() * (styles.value.length - 1)))
}

// Warm the neighbours so stepping through feels instant.
const preloaded = new Set<string>()
function preload(at: number) {
  if (import.meta.server) return
  const slug = styles.value[(at + styles.value.length) % styles.value.length]?.slug
  if (!slug || preloaded.has(slug)) return
  preloaded.add(slug)
  const img = new Image()
  img.src = `${BASE}/${slug}.webp`
}

function onKey(e: KeyboardEvent) {
  const el = e.target as HTMLElement | null
  if (el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return
  if (e.key === 'ArrowLeft') step(-1)
  else if (e.key === 'ArrowRight') step(1)
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
  preload(1)
  preload(-1)
})
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<style scoped>
.portrait-lab {
  text-align: center;
}

.blurb {
  color: var(--color-secondary);
  opacity: 0.85;
}

.frame {
  max-width: 720px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  background-color: var(--bg-secondary);
  box-shadow: 0 10px 30px -12px rgb(0 0 0 / 0.45);
}

.stage {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
}

.shot {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: fade-in 0.3s ease;
}

.shot-original {
  position: absolute;
  inset: 0;
  animation: none;
}

@keyframes fade-in {
  from { opacity: 0.3; }
  to { opacity: 1; }
}

.divider {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  margin-left: -1px;
  background-color: #fff;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 0.35);
  pointer-events: none;
}

.knob {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 30px;
  height: 30px;
  transform: translate(-50%, -50%);
  border: 2px solid #fff;
  border-radius: 9999px;
  background-color: rgb(0 0 0 / 0.35);
  box-shadow: 0 0 0 1px rgb(0 0 0 / 0.35);
}

.edge-label {
  position: absolute;
  bottom: 8px;
  padding: 2px 8px;
  border-radius: 9999px;
  background-color: rgb(0 0 0 / 0.55);
  color: #fff;
  font-size: 0.6875rem;
  letter-spacing: 0.02em;
  pointer-events: none;
}

.edge-left { left: 8px; }
.edge-right { right: 8px; }

/* A transparent range input laid over the stage: drag anywhere, and keyboard
   and screen-reader support come for free. */
.range {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: ew-resize;
  appearance: none;
  background: transparent;
}

.caption {
  padding: 12px 16px 14px;
  text-align: left;
  border-top: 1px solid var(--border-color);
}

.caption-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.caption-name {
  font-weight: 700;
  color: var(--color-title);
}

.caption-category {
  flex-shrink: 0;
  padding: 1px 8px;
  border: 1px solid var(--border-color);
  border-radius: 9999px;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  opacity: 0.7;
}

.caption-desc {
  padding-top: 4px;
  font-size: 0.875rem;
  color: var(--color-secondary);
  opacity: 0.85;
}

.disclosure {
  margin-top: 8px;
  padding: 0;
  border: 0;
  background: none;
  color: var(--color-primary);
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
}

.details {
  margin-top: 8px;
  padding-top: 10px;
  border-top: 1px dashed var(--border-color);
}

.prompt {
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--color-secondary);
  opacity: 0.9;
}

.meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px 16px;
  padding-top: 10px;
  font-size: 0.75rem;
}

.meta > div {
  min-width: 0;
}

.meta dt {
  opacity: 0.55;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-size: 0.625rem;
}

.meta dd {
  overflow-wrap: anywhere;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 18px 0 4px;
}

.ctrl {
  min-width: 44px;
  padding: 8px 14px;
  border: 1px solid var(--border-color);
  border-radius: 9999px;
  background-color: var(--bg-secondary);
  color: var(--color);
  font-size: 0.9375rem;
  line-height: 1.2;
  cursor: pointer;
  transition: border-color 0.15s, transform 0.15s, box-shadow 0.15s;
}

.ctrl:hover {
  border-color: var(--color-primary);
  transform: translateY(-1px);
  box-shadow: 0 4px 14px -6px var(--color-primary);
}

.ctrl-random,
.ctrl-toggle {
  font-weight: 600;
}

.ctrl-on {
  border-color: var(--color-primary);
  background-color: var(--color-primary);
  color: var(--bg-secondary);
}

.counter {
  font-variant-numeric: tabular-nums;
  font-size: 0.8125rem;
  opacity: 0.6;
  margin-left: 4px;
}

@media (min-width: 640px) {
  .meta { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}

@media (prefers-reduced-motion: reduce) {
  .shot { animation: none; }
  .ctrl:hover { transform: none; }
}
</style>
