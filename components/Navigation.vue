<template>
  <div class="grid grid-cols-3 py-2 px-4 items-center">
    <div class="justify-left">
      <nuxt-link to="/" class="text-xl font-bold"
        ><span class="hidden sm:inline">Brian </span>Caffey</nuxt-link
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
