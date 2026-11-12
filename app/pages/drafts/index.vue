<template>
  <div class="content-container">
    <h1 class="page-title">
      {{ $t('blog.drafts') }} ({{ articles?.length || 0 }})
    </h1>
    <blog-list :articles="articles || []" />
  </div>
</template>

<script setup lang="ts">
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
