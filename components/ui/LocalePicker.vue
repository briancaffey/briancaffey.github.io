<template>
  <div>
    <div v-if="showOptions" class="modal" @click="showOptions = false" />
    <ul>
      <li
        class="md:px-1 px-1 cursor-pointer"
        @click="showOptions = !showOptions"
      >
        <emoji :data="emojiIndex" :emoji="availableLocales.find((x) => x['code'] === $i18n.locale).emoji" :size="32" />
      </li>
    </ul>
    <div class="rounded-md z-10 picker">
      <div
        v-show="getShowOptions"
        class="
          bg-white
          shadow-md
          rounded
          px-4
          py-2
          w-32
          text
        "
      >
        <nuxt-link
          v-for="locale in availableLocales"
          :key="`${locale.code}-option`"
          @click="switchLocale(locale.code)"
        >
          <emoji :data="emojiIndex" :emoji="locale.emoji" :size="16" /> {{ locale.name }} <br>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import data from "emoji-mart-vue-fast/data/twitter.json";
import "emoji-mart-vue-fast/css/emoji-mart.css";
import { EmojiIndex, Emoji } from "emoji-mart-vue-fast/src";

const emojiIndex = new EmojiIndex(data)
export default {
  components: { Emoji },
  data () {
    return {
      emojiIndex,
      showOptions: false
    }
  },
  computed: {
    availableLocales () {
      return this.$i18n.locales
    },
    getShowOptions () {
      return this.showOptions
    }
  },
  methods: {
    switchLocale(locale) {
      this.$i18n.setLocale(locale);
      this.toggleShowOptions();
    },
    toggleShowOptions () {
      this.showOptions = !this.showOptions
    }
  }
}
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
.modal {
  z-index: 100000000;
  position: absolute;
  top: 0;
  left: 0;
  backdrop-filter: blur(0.4px);
  background-color: rgba(0, 0, 0, 0.2);
}
.picker {
  z-index: 10000000000;
  position: absolute;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
}
</style>
