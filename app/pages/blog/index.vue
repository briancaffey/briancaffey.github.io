<template>
  <div class="content-container">
    <h1 class="page-title">
      {{ $t('blog.blogPosts') }} ({{ articles.length }})
    </h1>
    <blog-list :articles="articles" />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const { data: articles } = await useBlogListing()

useHead(() => ({ title: t('blog.blogPosts') }))
</script>
