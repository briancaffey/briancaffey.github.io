<template>
  <div
    class="fixed bg-red-300 right-0 bottom-0 rounded-full p-4 m-4"
    @click="speak"
  >
    🗣
  </div>
</template>

<script>
export default {
  props: {
    utterance: {
      type: Object,
      default: () => {
        return 'Hello'
      },
    },
  },
  methods: {
    speak() {
      const utterance = new SpeechSynthesisUtterance(this.utterance)
      speechSynthesis.speak(utterance)
    },
  },
}
</script>

<style scoped></style>
