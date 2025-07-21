<template>
  <div class="mx-auto max-w-6xl">
    <h1 class="text-center text-3xl py-8">
      {{ $t('blog.blogPosts') }} ({{ articles?.length || 0 }})
    </h1>
    <blog-list :articles="articles || []" />
  </div>
</template>

<script setup lang="ts">

// Fetching articles with specific fields excluding drafts
const { data: articles } = await useAsyncData('all-articles', () =>
  queryCollection("blog")
    .where('draft', '<>', true)
    .order('date', 'DESC')
    .all()
)

// TODO: fix
// head () {
//   return {
//     title: "Brian Caffey's Blog"
//   }
// }

</script>

<style></style>
