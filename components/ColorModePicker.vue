<template>
  <div class="grid items-center justify-center">
    <ul class="flex px-4">
      <li
        v-for="color of colors"
        :key="color[0]"
        class="md:px-4 px-1 cursor-pointer"
        @click="$colorMode.preference = color[0]"
      >
        {{ color[1] }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      colors: [
        ['system', '🖥️'],
        ['light', '🌞'],
        ['dark', '🌚'],
        ['sepia', '☕'],
      ],
    }
  },
}
</script>
