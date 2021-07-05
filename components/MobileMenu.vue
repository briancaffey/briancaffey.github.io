<template>
  <div
    class="
      fixed
      inset-0
      z-10
      opacity-30
      justify-center
      mobile-menu
      items-center
      pt-16
      transition-all
      duration-150
      delay-150
    "
  >
    <nav>
      <ul class="text-center flex-wrap text-3xl">
        <li>
          <nuxt-link
            :to="localePath('index')"
            @click.native="$emit('toggle')"
            >{{ $t('nav.home') }}</nuxt-link
          >
        </li>
        <li>
          <nuxt-link :to="localePath('blog')" @click.native="$emit('toggle')">{{
            $t('nav.blog')
          }}</nuxt-link>
        </li>
        <li>
          <nuxt-link
            :to="localePath('projects')"
            @click.native="$emit('toggle')"
            >{{ $t('nav.projects') }}</nuxt-link
          >
        </li>
        <li>
          <nuxt-link
            :to="localePath('contact')"
            @click.native="$emit('toggle')"
            >{{ $t('nav.contact') }}</nuxt-link
          >
        </li>
      </ul>
    </nav>
    <button
      class="
        fixed
        top-0
        right-0
        items-center
        m-2
        px-3
        py-2
        border
        rounded
        menu-icon
      "
      @click="$emit('toggle')"
    >
      <svg
        class="fill-current h-3 w-3"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Menu</title>
        <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
      </svg>
    </button>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
ul > li {
  @apply py-1;
}
</style>
