<template>
  <nav class="">
    <ul class="items-right justify-end hidden md:flex">
      <li class="px-4">
        <nuxt-link to="/blog">Blog</nuxt-link>
      </li>
      <li class="px-4">
        <nuxt-link to="/projects">Projects</nuxt-link>
      </li>
      <li class="px-4">
        <nuxt-link to="/contact">Contact</nuxt-link>
      </li>
    </ul>
    <div class="flex justify-end md:hidden z-1000" @click="show = !show">
      <button class="flex items-center px-3 py-2 border rounded menu-icon">
        <svg
          class="fill-current h-3 w-3"
          :class="$route.path === '/' ? 'text-white' : 'text-co-blue'"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
        </svg>
      </button>
    </div>
    <MobileMenu v-if="show" @toggle="show = false" />
    <!-- <div class="block md:hidden text-right cursor-pointer">Menu</div> -->
  </nav>
</template>

<script>
export default {
  data() {
    return {
      show: false,
    }
  },
}
</script>

<style scoped></style>
