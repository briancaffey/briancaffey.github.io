<template>
  <div
    class="mx-auto grid grid-cols-3 py-2 px-2 sm:px-4 items-center max-w-6xl"
  >
    <div class="justify-left">
      <nuxt-link
        :to="localePath('/')"
        class="text-xl"
        :class="$route.name.startsWith('index') ? 'font-bold' : ''"
        ><span class="hidden sm:inline">{{ $t('common.name') }}</span
        ><span class="inline sm:hidden">JBC</span></nuxt-link
      >
    </div>
    <div class="justify-center flex">
      <ColorModePicker />
    </div>
    <div class="flex justify-end relative">
      <locale-picker /> &nbsp;
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
