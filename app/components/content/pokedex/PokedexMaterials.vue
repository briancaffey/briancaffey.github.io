<template>
  <div class="pk-materials">
    <div class="pk-tabs" role="tablist" :aria-label="`Versions of ${name}`">
      <button
        v-for="key in keys"
        :key="key"
        type="button"
        role="tab"
        class="pk-tab"
        :class="{ 'pk-tab-on': key === current }"
        :aria-selected="key === current"
        @click="current = key"
      >
        {{ POKEDEX_STYLES[key]?.name || key }}
      </button>
    </div>
    <div class="pk-pair">
      <figure class="pk-input">
        <div class="pk-input-frame">
          <img :src="pokedexImage(code, current)" :alt="`${name}, ${style.name}: the picture given to the 3D model`" loading="lazy">
          <span class="pk-tag">Picture in</span>
        </div>
      </figure>
      <pokedex-model
        :key="current"
        class="pk-output"
        :src="pokedexModel(code, current)"
        :poster="pokedexImage(code, current)"
        :alt="`${name}, ${style.name}: the generated 3D model`"
        label="Model out"
        height="100%"
      />
    </div>
    <p class="pk-prompt">
      <template v-if="style.prompt">
        <strong>Prompt:</strong> {{ style.prompt }}
      </template>
      <template v-else>
        {{ style.note }}
      </template>
    </p>
  </div>
</template>

<script setup lang="ts">
// One Pokémon in several materials: tabs choose the version; the left pane shows the picture
// that went into the 3D model and the right pane shows the model that came out.
const props = defineProps({
  code: { type: String, required: true },
  // Comma-separated style keys, in the order of the tabs.
  styles: { type: String, default: 'base,clay,glass,wood,origami,chrome,knit,bronze,bricks' },
  start: { type: String, default: '' }
})

const keys = computed(() => props.styles.split(',').map(s => s.trim()).filter(Boolean))
const current = ref(props.start || keys.value[0] || 'base')
const name = computed(() => POKEDEX_NAMES[props.code] || 'Pokémon')
const style = computed(() => POKEDEX_STYLES[current.value] || { name: current.value, prompt: '' })
</script>

<style scoped>
.pk-materials {
  margin: 1.5rem 0;
}

.pk-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 0.75rem;
}

.pk-tab {
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  border: 1px solid var(--color-primary);
  font-size: 0.875rem;
  line-height: 1.2;
  color: var(--color-primary);
  background: transparent;
  cursor: pointer;
}

.pk-tab-on {
  color: #fff;
  background: var(--color-primary);
}

.pk-tab:focus-visible {
  outline: 2px solid var(--color-secondary);
  outline-offset: 2px;
}

.pk-pair {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.pk-input {
  margin: 0;
}

.pk-input-frame {
  position: relative;
  height: 16rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  background: #fff;
  overflow: hidden;
}

.pk-input-frame img {
  width: 100%;
  height: 100%;
  margin: 0 !important;
  padding: 2rem 1rem 1rem;
  object-fit: contain;
}

.pk-tag {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 0.35rem 0.55rem;
  border-radius: 0.25rem;
  color: #1d2b36;
  background: #e6eaee;
}

.pk-output {
  margin: 0;
  height: 22rem;
}

.pk-output :deep(.pk-stage) {
  height: 100%;
}

@media (min-width: 768px) {
  .pk-pair {
    grid-template-columns: 2fr 3fr;
  }

  .pk-input-frame,
  .pk-output {
    height: 26rem;
  }
}

.pk-prompt {
  margin-top: 0.75rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--color-secondary);
  opacity: 0.85;
  min-height: 4.5em;
}
</style>
