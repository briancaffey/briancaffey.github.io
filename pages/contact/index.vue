<template>
  <div class="text-center pt-8 mb-4">
    <img
      class="h-64 object-cover mx-auto rounded"
      src="/static/JBC_PA.jpg"
      alt="Brian Caffey at the Libery Bell in Philadelphia"
    >
    <div class="flex mx-auto justify-center py-4 pt-8">
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
    <div>
      <div class="flex mx-auto justify-center py-4">
        <div class="grid grid-cols-5 items-center gap-4 px-4">
          <a href="https://dev.to/briancaffey">
            <img class="follow" src="/icons/dev.png">
          </a>
          <a href="https://briancaffey.substack.com">
            <img class="follow" src="/icons/substack.png">
          </a>
          <a href="https://briancaffey.hashnode.dev/">
            <img class="follow" src="/icons/hashnode.png">
          </a>
          <a href="https://medium.com/@briancaffey">
            <img class="follow" src="/icons/medium.png">
          </a>
          <a href="https://hackernoon.com/u/briancaffey">
            <img class="follow" src="/icons/hackernoon.png">
          </a>
        </div>
      </div>
    </div>
    <div>
      <div class="text-2xl font-bold text-center py-4 pt-8">
        {{ $t('contactForm.contactMe') }}
      </div>
      <contact-form />
    </div>
  </div>
</template>

<script>
export default {
  head () {
    return {
      title: 'Contact Brian Caffey'
    }
  }
}
</script>

<style scoped>
.follow {
  max-height: 50px;
  border-radius: 10px;
}
</style>
