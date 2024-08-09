<template>
  <div class="mx-auto max-w-6xl">
    <h1 class="text-center text-3xl py-8">
      {{ $t('blog.drafts') }} ({{ articles.length }})
    </h1>
    <blog-list :articles="articles" />
  </div>
</template>

<script setup>
const { data: articles } = await useAsyncData('drafts', () =>
  queryContent("/")
    .where({ draft: { $eq: true } })
    .sort({'date': -1})
    .find()
)
  // head () {
  //   return {
  //     title: "Brian Caffey's Blog",
  //     meta: [
  //       {
  //         name: 'robots',
  //         content: 'noindex'
  //       }
  //     ]
  //   }
  // }

</script>

<style></style>
