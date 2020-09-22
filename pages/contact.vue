<template>
  <div class="text-center pt-8">
    <img
      class="h-64 object-cover mx-auto rounded"
      src="/static/JBC_PA.jpg"
      alt="Brian Caffey at the Libery Bell in Philadelphia"
    />
    <div class="flex mx-auto justify-center py-4">
      <div class="grid grid-cols-5 items-center gap-4 px-4">
        <a href="https://github.com/briancaffey">
          <GitHubIcon />
        </a>
        <a href="https://gitlab.com/briancaffey">
          <GitLabIcon />
        </a>
        <a href="https://stackoverflow.com/users/6084948/briancaffey">
          <StackOverflowIcon />
        </a>
        <a href="https://linkedin.com/in/brian-caffey-06b22a18">
          <LinkedInIcon />
        </a>
        <a href="https://twitter.com/briancaffey">
          <TwitterIcon />
        </a>
      </div>
    </div>
    <div></div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: 'Contact',
    }
  },
}
</script>

<style scoped></style>
