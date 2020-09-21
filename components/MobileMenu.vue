<template>
  <div
    class="fixed inset-0 z-10 bg-gray-200 opacity-30 justify-center"
    @click="$emit('toggle')"
  >
    <nav>
      <Navigation />
      <ul class="text-center">
        <li>
          <nuxt-link to="/">Home</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/blog">Blog</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/contact">Contact</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/projects">Projects</nuxt-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {}
</script>

<style scoped></style>
