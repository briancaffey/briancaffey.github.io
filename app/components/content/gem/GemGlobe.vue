<template>
  <figure class="gg">
    <div
      ref="stage"
      class="gg-stage"
      :class="{ 'gg-fill': filled, 'gg-open': panel }"
      :style="filled ? undefined : { height }"
    >
      <div ref="mount" class="gg-canvas" />
      <img
        v-if="poster"
        class="gg-poster"
        :class="{ 'gg-hidden': ready }"
        :src="poster"
        alt="A globe covered in cut gemstones, sitting on a wooden table"
        loading="lazy"
      >

      <div v-if="!ready" class="gg-status">
        <button v-if="!started" type="button" class="gg-start" @click="begin">
          Load the globe
        </button>
        <span v-else-if="failed">{{ failed }}</span>
        <span v-else>{{ progress }}…</span>
      </div>

      <template v-if="ready">
        <div class="gg-bar">
          <button type="button" class="gg-btn" :aria-pressed="panel" @click="panel = !panel">
            {{ panel ? 'Hide controls' : 'Controls' }}
          </button>
          <button type="button" class="gg-btn" @click="toggleFullscreen">
            {{ filled ? 'Exit full screen' : 'Full screen' }}
          </button>
        </div>
        <p class="gg-hint">
          {{ filled ? 'Drag to turn, scroll or pinch to zoom' : 'Drag to turn' }}
          <span v-if="report"> · {{ report.gems.toLocaleString('en') }} stones</span>
        </p>

        <div v-if="panel" class="gg-panel">
          <section>
            <h4>Looks</h4>
            <div class="gg-chips">
              <button
                v-for="(look, key) in LOOKS"
                :key="key"
                type="button"
                class="gg-chip"
                @click="applyLook(key)"
              >
                {{ look.name }}
              </button>
            </div>
          </section>

          <section>
            <h4>The orb inside</h4>
            <div class="gg-chips">
              <button
                v-for="(preset, key) in ORBS"
                :key="key"
                type="button"
                class="gg-chip"
                :class="{ 'gg-on': params.orb === key }"
                @click="update({ orb: key })"
              >
                {{ preset.name }}
              </button>
            </div>
            <label class="gg-row">
              <span>Colour</span>
              <input type="color" :value="params.orbColor" @input="update({ orbColor: value($event) })">
            </label>
            <label class="gg-row">
              <span>Glow</span>
              <input type="range" min="0" max="5" step="0.05" :value="params.glow" @input="update({ glow: number($event) })">
              <output>{{ params.glow.toFixed(1) }}</output>
            </label>
          </section>

          <section>
            <h4>Light in the stones</h4>
            <label v-for="s in GEM_SLIDERS" :key="s.key" class="gg-row" :title="s.title">
              <span>{{ s.label }}</span>
              <input
                type="range"
                :min="s.min"
                :max="s.max"
                :step="s.step"
                :value="params[s.key]"
                @input="update({ [s.key]: number($event) })"
              >
              <output>{{ Number(params[s.key]).toFixed(s.digits) }}</output>
            </label>
            <label class="gg-row">
              <span>Renderer</span>
              <select :value="params.mode" @change="update({ mode: value($event) as 'traced' | 'standard' })">
                <option value="traced">Traced facets (custom shader)</option>
                <option value="standard">three.js physical material</option>
              </select>
            </label>
          </section>

          <section>
            <h4>The stones</h4>
            <label class="gg-row">
              <span>Palette</span>
              <select :value="params.palette" @change="update({ palette: value($event) })">
                <option v-for="(p, key) in PALETTES" :key="key" :value="key">
                  {{ p.name }}
                </option>
              </select>
            </label>
            <label v-for="s in LAYOUT_SLIDERS" :key="s.key" class="gg-row" :title="s.title">
              <span>{{ s.label }}</span>
              <input
                type="range"
                :min="s.min"
                :max="s.max"
                :step="s.step"
                :value="params[s.key]"
                @change="update({ [s.key]: number($event) })"
              >
              <output>{{ Number(params[s.key]).toFixed(s.digits) }}</output>
            </label>
            <div class="gg-row">
              <span>Arrangement</span>
              <button type="button" class="gg-chip" @click="update({ seed: params.seed + 1 })">
                Shuffle
              </button>
            </div>
            <p v-if="report" class="gg-report">
              {{ report.gems.toLocaleString('en') }} stones cut in {{ Math.round(buildMs) }} ms.
              {{ report.pairsChecked.toLocaleString('en') }} neighbouring pairs checked:
              deepest overlap {{ report.worstOverlap.toFixed(6) }},
              tightest space {{ (report.minClearance * 1000).toFixed(2) }} thousandths of the globe's radius.
            </p>
          </section>

          <section>
            <h4>The room</h4>
            <label class="gg-row">
              <span>Place</span>
              <select :value="params.environment" @change="update({ environment: value($event) })">
                <option v-for="(e, key) in ENVIRONMENTS" :key="key" :value="key">
                  {{ e.name }}
                </option>
              </select>
            </label>
            <label v-for="s in ROOM_SLIDERS" :key="s.key" class="gg-row" :title="s.title">
              <span>{{ s.label }}</span>
              <input
                type="range"
                :min="s.min"
                :max="s.max"
                :step="s.step"
                :value="params[s.key]"
                @input="update({ [s.key]: number($event) })"
              >
              <output>{{ Number(params[s.key]).toFixed(s.digits) }}</output>
            </label>
            <label class="gg-row">
              <span>Table</span>
              <input type="checkbox" :checked="params.table" @change="update({ table: checked($event) })">
            </label>
          </section>

          <section>
            <h4>Take it with you</h4>
            <div class="gg-chips">
              <button type="button" class="gg-chip" @click="savePicture">
                Save picture
              </button>
              <button type="button" class="gg-chip" :disabled="exporting" @click="saveModel">
                {{ exporting ? 'Exporting…' : 'Download .glb' }}
              </button>
            </div>
            <p class="gg-report">
              {{ fps ? `${Math.round(fps)} frames a second at ${pixelRatio.toFixed(2)}× resolution.` : '' }}
            </p>
          </section>
        </div>
      </template>
    </div>
    <figcaption v-if="$slots.default">
      <slot />
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
// The interactive gem globe. three.js and the scene code are fetched when the figure
// comes near the viewport; until then the stage shows a still picture.
import { PALETTES } from '~/utils/gemGlobe/layout'
import type { LayoutReport } from '~/utils/gemGlobe/layout'
import { DEFAULT_PARAMS, ENVIRONMENTS, ORBS } from '~/utils/gemGlobe/params'
import type { GemGlobeParams } from '~/utils/gemGlobe/params'
import type { GemGlobeScene } from '~/utils/gemGlobe/scene'

const props = defineProps({
  height: { type: String, default: 'min(78vh, 46rem)' },
  poster: { type: String, default: '/static/gem-globe/poster.jpg' },
  // Start as soon as the figure is near the viewport. Otherwise wait for a click.
  auto: { type: Boolean, default: true },
  orb: { type: String, default: DEFAULT_PARAMS.orb },
  palette: { type: String, default: DEFAULT_PARAMS.palette },
  count: { type: Number, default: DEFAULT_PARAMS.count }
})

type SliderKey = { [K in keyof GemGlobeParams]: GemGlobeParams[K] extends number ? K : never }[keyof GemGlobeParams]
interface Slider { key: SliderKey, label: string, min: number, max: number, step: number, digits: number, title: string }

const GEM_SLIDERS: Slider[] = [
  { key: 'bounces', label: 'Brilliance', min: 1, max: 9, step: 1, digits: 0, title: 'How many times light is followed as it bounces around inside each stone' },
  { key: 'refraction', label: 'Refraction', min: 0.3, max: 1.6, step: 0.01, digits: 2, title: 'Scales how strongly every stone bends light. 1 is the real value for each gem' },
  { key: 'fire', label: 'Fire', min: 0, max: 6, step: 0.05, digits: 1, title: 'How far the colours of white light are spread apart. 1 is the real value' },
  { key: 'saturation', label: 'Colour depth', min: 0, max: 3, step: 0.02, digits: 2, title: 'How much colour a stone takes out of light passing through it' },
  { key: 'sparkle', label: 'Sparkle', min: 0, max: 4, step: 0.05, digits: 1, title: 'Brightness of the three small lamps the stones catch' }
]
const LAYOUT_SLIDERS: Slider[] = [
  { key: 'count', label: 'How many', min: 150, max: 4000, step: 50, digits: 0, title: 'Roughly how many stones cover the globe' },
  { key: 'variety', label: 'Size mix', min: 0, max: 1, step: 0.01, digits: 2, title: 'From all about the same size to a wide mix of large and small' },
  { key: 'gap', label: 'Spacing', min: 0, max: 0.4, step: 0.01, digits: 2, title: 'Space between neighbouring stones' },
  { key: 'height', label: 'Height', min: 0.3, max: 1.4, step: 0.01, digits: 2, title: 'How tall the stones stand' },
  { key: 'irregularity', label: 'Roughness', min: 0, max: 1, step: 0.01, digits: 2, title: 'From crisp machine cuts to uneven hand-cut stones' }
]
const ROOM_SLIDERS: Slider[] = [
  { key: 'backgroundBlur', label: 'Background blur', min: 0, max: 1, step: 0.01, digits: 2, title: 'How out of focus the room is' },
  { key: 'exposure', label: 'Exposure', min: 0.3, max: 2.5, step: 0.01, digits: 2, title: 'Overall brightness' },
  { key: 'bloom', label: 'Glints', min: 0, max: 1.5, step: 0.01, digits: 2, title: 'Glow around the brightest flashes' },
  { key: 'spin', label: 'Spin', min: 0, max: 1, step: 0.01, digits: 2, title: 'How fast the globe turns' }
]

// A few starting points that show different sides of the scene.
const LOOKS: Record<string, { name: string, patch: Partial<GemGlobeParams> }> = {
  jeweller: { name: 'Gold and gems', patch: { ...DEFAULT_PARAMS } },
  hollow: { name: 'Hollow shell', patch: { ...DEFAULT_PARAMS, orb: 'hollow', gap: 0.06, bounces: 6 } },
  lantern: { name: 'Lantern', patch: { ...DEFAULT_PARAMS, orb: 'lantern', exposure: 0.7, sparkle: 0.6, saturation: 1.8 } },
  rubies: { name: 'Rubies and pearls', patch: { ...DEFAULT_PARAMS, palette: 'rubies', orb: 'platinum', count: 1200 } },
  ice: { name: 'Ice', patch: { ...DEFAULT_PARAMS, palette: 'ice', orb: 'glass', environment: 'loft', fire: 2.5 } },
  rough: { name: 'Rough treasure', patch: { ...DEFAULT_PARAMS, palette: 'treasure', orb: 'gold', count: 700, irregularity: 1, variety: 1, height: 1.1, gap: 0.08 } }
}

const stage = ref<HTMLElement | null>(null)
const mount = ref<HTMLElement | null>(null)
const params = reactive<GemGlobeParams>({ ...DEFAULT_PARAMS, orb: props.orb, orbColor: (ORBS[props.orb] || ORBS.gold!).color, glow: (ORBS[props.orb] || ORBS.gold!).glow, palette: props.palette, count: props.count })
const started = ref(false)
const ready = ref(false)
const failed = ref('')
const progress = ref('Loading')
const panel = ref(false)
const filled = ref(false)
const report = ref<LayoutReport | null>(null)
const buildMs = ref(0)
const fps = ref(0)
const pixelRatio = ref(1)
const exporting = ref(false)

let scene: GemGlobeScene | null = null
let watcher: IntersectionObserver | null = null
let visible = false

const value = (e: Event) => (e.target as HTMLInputElement).value
const number = (e: Event) => Number((e.target as HTMLInputElement).value)
const checked = (e: Event) => (e.target as HTMLInputElement).checked

async function begin () {
  if (started.value || !mount.value) { return }
  started.value = true
  try {
    const probe = document.createElement('canvas')
    if (!probe.getContext('webgl2')) { throw new Error('This browser does not offer WebGL 2, which the globe needs.') }
    const { GemGlobeScene } = await import('~/utils/gemGlobe/scene')
    scene = new GemGlobeScene(mount.value, { ...params }, {
      onProgress: (message) => { progress.value = message },
      onReport: (r, ms) => { report.value = r; buildMs.value = ms },
      onFps: (f, ratio) => { fps.value = f; pixelRatio.value = ratio; if (import.meta.dev) { Object.assign(window, { __ggFps: [f, ratio] }) } }
    })
    if (import.meta.dev) { Object.assign(window, { __gg: scene }) }
    await scene.init()
    Object.assign(params, scene.params)
    ready.value = true
    if (visible || filled.value) { scene.start() }
  } catch (error) {
    failed.value = error instanceof Error ? error.message : 'The globe could not be started.'
  }
}

async function update (patch: Partial<GemGlobeParams>) {
  if (!scene) { return }
  await scene.set(patch)
  Object.assign(params, scene.params)
}

function applyLook (key: string) {
  update({ ...LOOKS[key]!.patch, seed: params.seed, spin: params.spin })
}

function onFullscreenChange () {
  const on = document.fullscreenElement === stage.value
  if (!on && filled.value && document.fullscreenElement === null && usedNative) { setFilled(false) }
  if (on) { setFilled(true) }
}

let usedNative = false
function setFilled (on: boolean) {
  filled.value = on
  scene?.setImmersive(on)
  document.documentElement.classList.toggle('gg-locked', on && !usedNative)
  nextTick(() => {
    scene?.resize()
    if (on || visible) { scene?.start() }
  })
}

async function toggleFullscreen () {
  if (!stage.value) { return }
  if (filled.value) {
    if (document.fullscreenElement) { await document.exitFullscreen() }
    usedNative = false
    setFilled(false)
    return
  }
  // Phones mostly cannot put an element full screen, so fall back to covering the window.
  usedNative = false
  if (stage.value.requestFullscreen) {
    try {
      await stage.value.requestFullscreen()
      usedNative = true
    } catch { /* fall through */ }
  }
  setFilled(true)
}

function onKey (e: KeyboardEvent) {
  if (e.key === 'Escape' && filled.value && !usedNative) { setFilled(false) }
}

function download (blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = name
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}

async function savePicture () {
  const blob = await scene?.screenshot()
  if (blob) { download(blob, 'gem-globe.png') }
}

async function saveModel () {
  if (!scene) { return }
  exporting.value = true
  try {
    download(await scene.exportGLB(), 'gem-globe.glb')
  } finally {
    exporting.value = false
  }
}

onMounted(() => {
  document.addEventListener('fullscreenchange', onFullscreenChange)
  document.addEventListener('keydown', onKey)
  if (!stage.value) { return }
  watcher = new IntersectionObserver((entries) => {
    visible = entries.some(e => e.isIntersecting)
    if (visible && props.auto) { begin() }
    if (visible) { scene?.start() } else if (!filled.value) { scene?.stop() }
  }, { rootMargin: '200px' })
  watcher.observe(stage.value)
})

onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', onFullscreenChange)
  document.removeEventListener('keydown', onKey)
  document.documentElement.classList.remove('gg-locked')
  watcher?.disconnect()
  scene?.dispose()
  scene = null
})
</script>

<style scoped>
.gg {
  margin: 2rem 0;
}

/* The stage is dark in every colour mode: it is a window into a lit room. */
.gg-stage {
  position: relative;
  overflow: hidden;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  background: #17120e;
  color: #f4efe6;
  font-size: 0.8125rem;
  line-height: 1.35;
}

.gg-fill {
  position: fixed;
  inset: 0;
  z-index: 1000;
  height: 100dvh;
  border: 0;
  border-radius: 0;
}

.gg-canvas,
.gg-poster {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.gg-canvas {
  cursor: grab;
}

.gg-canvas:active {
  cursor: grabbing;
}

.gg-poster {
  margin: 0 !important;
  object-fit: cover;
  pointer-events: none;
  transition: opacity 0.9s ease;
}

.gg-hidden {
  opacity: 0;
}

.gg-status {
  position: absolute;
  left: 50%;
  bottom: 1rem;
  transform: translateX(-50%);
  padding: 0.45rem 0.8rem;
  border-radius: 999px;
  background: rgba(15, 12, 9, 0.72);
  backdrop-filter: blur(6px);
  white-space: nowrap;
}

.gg-start,
.gg-btn,
.gg-chip {
  font: inherit;
  color: inherit;
  cursor: pointer;
}

.gg-bar {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  gap: 0.5rem;
  z-index: 3;
}

.gg-btn {
  padding: 0.4rem 0.75rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: rgba(15, 12, 9, 0.6);
  backdrop-filter: blur(6px);
}

.gg-btn:hover,
.gg-chip:hover {
  border-color: rgba(255, 255, 255, 0.6);
}

.gg-hint {
  position: absolute;
  left: 0.75rem;
  bottom: 0.6rem;
  margin: 0;
  padding: 0.3rem 0.6rem;
  border-radius: 999px;
  background: rgba(15, 12, 9, 0.5);
  font-size: 0.75rem;
  opacity: 0.85;
  pointer-events: none;
}

.gg-panel {
  position: absolute;
  top: 3.25rem;
  right: 0.75rem;
  bottom: 0.75rem;
  width: min(20.5rem, calc(100% - 1.5rem));
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 0.25rem 0.9rem 0.75rem;
  border-radius: 0.6rem;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(15, 12, 9, 0.74);
  backdrop-filter: blur(10px);
  z-index: 2;
}

/* On a phone the controls take the lower half, so the globe stays in view above them. */
@media (max-width: 640px) {
  .gg-panel {
    top: auto;
    left: 0.5rem;
    right: 0.5rem;
    bottom: 0.5rem;
    width: auto;
    height: 52%;
  }

  .gg-open .gg-hint {
    display: none;
  }
}

.gg-panel section {
  padding: 0.6rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.gg-panel section:last-child {
  border-bottom: 0;
}

.gg-panel h4 {
  margin: 0 0 0.45rem;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #e9c98a;
}

.gg-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-bottom: 0.4rem;
}

.gg-chip {
  padding: 0.28rem 0.6rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
}

.gg-chip:disabled {
  opacity: 0.5;
  cursor: default;
}

.gg-on {
  border-color: #e9c98a;
  background: rgba(233, 201, 138, 0.2);
}

.gg-row {
  display: grid;
  grid-template-columns: 6.6rem 1fr 2.4rem;
  align-items: center;
  gap: 0.5rem;
  min-height: 1.75rem;
}

.gg-row output {
  text-align: right;
  font-variant-numeric: tabular-nums;
  opacity: 0.8;
}

.gg-row input[type='range'] {
  width: 100%;
  accent-color: #e9c98a;
}

.gg-row input[type='checkbox'] {
  justify-self: start;
  accent-color: #e9c98a;
}

.gg-row input[type='color'] {
  width: 2.5rem;
  height: 1.5rem;
  padding: 0;
  border: 0;
  background: none;
}

.gg-row select {
  grid-column: 2 / 4;
  width: 100%;
  padding: 0.2rem 0.3rem;
  border-radius: 0.3rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: #241c15;
  color: inherit;
  font: inherit;
}

.gg-row .gg-chip {
  grid-column: 2 / 4;
  justify-self: start;
}

.gg-report {
  margin: 0.4rem 0 0;
  font-size: 0.71875rem;
  opacity: 0.7;
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

<style>
/* While the globe covers the window, the page behind it does not scroll. */
html.gg-locked {
  overflow: hidden;
}
</style>
