<template>
  <div class="mx-auto max-w-6xl">
    <h1 class="text-center text-3xl py-8">
      {{ $t('blog.blogPosts') }} ({{ articles.length }})
    </h1>
    <blog-list :articles="articles" />
  </div>
</template>

<script setup>

// Fetching articles with specific fields excluding drafts
const { data: articles } = await useAsyncData('all-articles', () =>
  queryContent("/")
    .where({ draft: { $ne: true } })
    .sort({'date': -1})
    .find()
)

// TODO: fix
// head () {
//   return {
//     title: "Brian Caffey's Blog"
//   }
// }

</script>

<style></style>
