<template>
  <div>
    <ul>
      <li
        class="md:px-1 px-1 cursor-pointer"
        @click="showOptions = !showOptions"
      >
        <emoji :data="emojiIndex" :emoji="availableLocales.value.find((x: any) => x['code'] === $i18n.locale)?.emoji" :size="32" />
      </li>
    </ul>
    <div class="rounded-md z-10 picker">
      <div
        v-if="showOptions"
        v-on-click-outside="closeModal"
        class="
          localepicker
          shadow-xl
          rounded
          px-4
          py-2
          w-32
          text
        "
      >
        <div
          v-for="locale in availableLocales.value"
          :key="`${locale.code}-option`"
          class="localeText"
          @click="switchLocale(locale.code)"
        >
          <emoji :data="emojiIndex" :emoji="locale.emoji" :size="16" /> {{ locale.name }} <br>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import data from 'emoji-mart-vue-fast/data/twitter.json';
import 'emoji-mart-vue-fast/css/emoji-mart.css';
// @ts-expect-error - emoji-mart-vue-fast has incomplete TypeScript definitions
import { EmojiIndex, Emoji } from 'emoji-mart-vue-fast/src';
import { useI18n } from '#imports';
import { vOnClickOutside } from '@vueuse/components'

const emojiIndex = new EmojiIndex(data);
const showOptions = ref(false);

const { locales, setLocale } = useI18n();

const availableLocales = computed(() => locales);

const toggleShowOptions = () => {
  showOptions.value = !showOptions.value;
};

const closeModal = () => {
  showOptions.value = false;
}

const switchLocale = (locale: "fr" | "ru" | "in" | "ja" | "en" | "zh") => {
  setLocale(locale);
  toggleShowOptions();
};
</script>

<style scoped>
span.emoji-mart-emoji {
  padding: 0px;
  padding-left: 0px;
  padding-right: 0px;
  transition: transform .2s;
}

span.emoji-mart-emoji:hover {
  transform: scale(1.3);
}

.picker {
  z-index: 10000000000;
  position: absolute;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
}

.localepicker {
  background-color: var(--bg);
}

.localeText {
  color: var(--color-primary);
}
</style>
