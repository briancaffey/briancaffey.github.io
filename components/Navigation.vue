<template>
  <div
    class="mx-auto grid grid-cols-3 py-2 px-2 sm:px-4 items-center max-w-6xl"
  >
    <div class="justify-left">
      <nuxt-link
        to="/"
        class="text-xl"
        :class="$route.path === '/' ? 'font-bold' : ''"
        ><span class="hidden sm:inline">Brian Caffey</span
        ><span class="inline sm:hidden">JBC</span></nuxt-link
      >
    </div>
    <div class="justify-center">
      <ColorModePicker />
    </div>
    <div class="flex justify-end">
      <Menu />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Navigation',
}
</script>

<style scoped></style>
