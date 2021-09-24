<template>
  <div class="py-8 px-4 text-center text-red-400">
    This page does not exist.
  </div>
</template>

<script>
export default {
  layout ({ redirect, route }) {
    if (route.path === '/abc') { redirect(301, '/contact') }
    return 'default'
  }
}
</script>

<style scoped></style>
