<template>
  <div>
    <img
      class="h-64 object-cover mx-auto"
      src="/static/JBC_PA.jpg"
      alt="Brian Caffey at the Libery Bell in Philadelphia"
    />
    <ul class="px-4 md:px-64">
      <li><img src="~/assets/icons/github.svg" alt="GitHub" /></li>
      <li>GitLab</li>
    </ul>
    <div></div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
.github li:before {
  content: '';
  display: inline-block;
  height: 1em;
  width: 1em;
  background-image: url('~assets/icons/github.svg');
  padding-left: 2em;
  background-size: contain;
  background-repeat: no-repeat;
  list-style-position: inside;
}
</style>
