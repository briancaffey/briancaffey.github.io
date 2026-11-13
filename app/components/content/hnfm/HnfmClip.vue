<template>
  <figure class="hn-clip" :class="{ 'hn-clip-audio': isAudio }">
    <div v-if="isAudio" class="hn-clip-card">
      <img v-if="poster" :src="poster" :alt="title" loading="lazy">
      <div class="hn-clip-body">
        <strong>{{ title }}</strong>
        <span v-if="meta">{{ meta }}</span>
        <audio controls preload="none" :src="src" />
      </div>
    </div>
    <video
      v-else
      controls
      playsinline
      preload="none"
      :poster="poster || undefined"
      :src="src"
    />
    <figcaption v-if="caption || (!isAudio && title)">
      <template v-if="!isAudio && title">
        <strong>{{ title }}</strong><template v-if="meta">
          · {{ meta }}
        </template><br v-if="caption">
      </template>
      {{ caption }}
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
// One piece of hn.fm output: a video, or an audio clip shown as a card
// with its cover. Nothing is fetched until the reader presses play.
const props = defineProps({
  src: { type: String, required: true },
  poster: { type: String, default: '' },
  title: { type: String, default: '' },
  meta: { type: String, default: '' },
  caption: { type: String, default: '' }
})

const isAudio = computed(() => /\.(mp3|m4a|ogg)$/.test(props.src))
</script>

<style scoped>
.hn-clip {
  margin: 1.5rem 0;
}

.hn-clip video {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  background: #000;
}

.hn-clip-card {
  display: flex;
  gap: 0.9rem;
  align-items: center;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
}

.hn-clip-card img {
  flex: none;
  width: 5.5rem;
  height: 5.5rem;
  margin: 0 !important;
  border-radius: 0.375rem;
  object-fit: cover;
}

.hn-clip-body {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 0.2rem;
}

.hn-clip-body strong {
  line-height: 1.25;
}

.hn-clip-body span {
  font-size: 0.8125rem;
  color: var(--color-secondary);
  opacity: 0.85;
}

.hn-clip-body audio {
  width: 100%;
  height: 2.25rem;
  margin-top: 0.3rem;
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
