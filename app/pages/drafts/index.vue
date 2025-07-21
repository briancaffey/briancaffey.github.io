<template>
  <div class="mx-auto max-w-6xl">
    <h1 class="text-center text-3xl py-8">
      {{ $t('blog.drafts') }} ({{ articles?.length || 0 }})
    </h1>
    <blog-list :articles="articles || []" />
  </div>
</template>

<script setup>
const { data: articles } = await useAsyncData('drafts', () =>
  queryCollection("blog")
    .where('draft', '=', true)
    .order('date', 'DESC')
    .all()
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
