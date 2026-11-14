<template>
  <div class="content-container">
    <h1 class="page-title">
      {{ $t('blog.blogPosts') }} ({{ articles.length }})
    </h1>
    <div class="mb-8">
      <pagination :page-no="pageNo" :page-count="pageCount" />
    </div>
    <blog-list :articles="pageItems" />
    <pagination :page-no="pageNo" :page-count="pageCount" />
  </div>
</template>

<script setup lang="ts">
defineI18nRoute({
  locales: ['en']
});
const { t } = useI18n()
const route = useRoute()
const pageNo = Number(route.params.number)

const { data: articles } = await useBlogListing()
const pageCount = computed(() => blogPageCount(articles.value.length))

// /blog/0, /blog/abc and pages past the end are not pages.
if (!Number.isInteger(pageNo) || pageNo < 1 || pageNo > pageCount.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const pageItems = computed(() =>
  articles.value.slice((pageNo - 1) * BLOG_PAGE_SIZE, pageNo * BLOG_PAGE_SIZE)
)

useHead(() => ({
  title: pageNo === 1
    ? t('blog.blogPosts')
    : `${t('blog.blogPosts')} · ${pageNo} / ${pageCount.value}`
}))
</script>
