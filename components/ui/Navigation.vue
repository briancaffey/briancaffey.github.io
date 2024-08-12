<template>
  <div>
    <div
      class="mx-auto flex py-2 px-2 sm:px-4 items-center max-w-6xl justify-center"
    >
      <div class="justify-left flex-grow flex-cols-4">
        <nuxt-link
          to="/"
          class="text-xl"
          :class="route.path === '/' ? 'selected' : ''"
        >
          <span class="hidden sm:inline text-2xl">{{ $t('common.name') }}</span><span class="inline sm:hidden">JBC</span>
        </nuxt-link>
      </div>
      <div class="flex-grow relative">
        <Menu />
      </div>
    </div>
    <div class="picker">
      <ColorModePicker />
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
</script>

<style scoped>
span.emoji-mart-emoji {
  padding: 0px;
  padding-left: 0px;
  padding-right: 0px;
}
.selected {
  text-shadow: .25px 0 0  #000;
}
.picker {
  position: absolute;
  top: 10px;
  margin-left: auto;
  margin-right: auto;
  transform: translate(50%, 50%);
}

.top {
  width: 100%;
  background-color: var(--color-primary);
  height: 3px;
}
</style>
