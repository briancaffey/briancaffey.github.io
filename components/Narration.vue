<template>
  <div
    class="
      fixed
      bg-white
      shadow
      left-0
      bottom-0
      rounded-full
      p-4
      m-4
      cursor-pointer
      h-4
      w-4
    "
    @click="speak"
  >
    <span class="text-black"> 🗣 </span>
  </div>
</template>

<script>
export default {
  props: {
    utterance: {
      type: String,
      default: 'hello',
    },
  },
  methods: {
    speak() {
      const synth = window.speechSynthesis
      const voices = synth.getVoices()
      const speaking = synth.speaking
      if (speaking) {
        synth.cancel()
        return
      }
      const utterance = new SpeechSynthesisUtterance(this.utterance)
      utterance.voice = voices[8]
      speechSynthesis.speak(utterance)
    },
  },
}
</script>

<style scoped>
span {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  top: 2px;
}
</style>
