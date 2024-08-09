
<template>
  <div class="centered">
    <div class="grid items-center justify-center">
      <ul class="flex px-4">
        <li
          v-for="color of colors"
          :key="color[0]"
          class="md:px-1 px-1 cursor-pointer"
          @click="$colorMode.preference = color[0]"
        >
          <emoji :data="emojiIndex" :emoji="color[2]" :size="32" />
        </li>
        <li class="md:px-1 px-1 cursor-pointer">
          <locale-picker />
        </li>
      </ul>
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
      colors: [
        ['system', '🖥️', 'desktop_computer'],
        ['light', '🌞', 'sun_with_face'],
        ['dark', '🌚', 'new_moon_with_face'],
        ['sepia', '☕', 'coffee']
      ]
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

.centered {
  position: absolute;
  left: 50vw;
  right: 50vw;
  margin-left: auto;
  margin-right: auto;
}
</style>
