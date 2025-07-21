<template>
  <div class="mx-auto max-w-6xl">
    <h1 class="text-center text-3xl py-8">
      {{ $t('blog.blogPosts') }} ({{ nonDraftArticles?.length || 0 }})
    </h1>
    <div class="mb-8">
      <pagination
        :paginated-items="paginatedNonDraftItems || []"
        :all-items="nonDraftArticles || []"
        :page-no="pageNo"
        :next-page="(paginatedNonDraftItems?.length || 0) === 10"
      />
    </div>
    <blog-list :articles="paginatedNonDraftItems || []" />
    <pagination
      :paginated-items="paginatedNonDraftItems || []"
      :all-items="nonDraftArticles || []"
      :page-no="pageNo"
      :next-page="(paginatedNonDraftItems?.length || 0) === 10"
    />
  </div>
</template>

<script setup lang="ts">
defineI18nRoute({
  locales: ['en']
});
const route = useRoute();
const pageNo = parseInt(route.params.number);

const { data: articles } = await useAsyncData('all-articles', () =>
  queryCollection("blog")
    .order("date", "ASC")
    .all()
);

const { data: paginatedItems } = await useAsyncData(route.path, () =>
  queryCollection("blog")
    .order("date", "DESC")
    .limit(10)
    .skip(9 * (pageNo - 1))
    .all()
)

// Filter out drafts in the template
const nonDraftArticles = computed(() => {
  return articles.value
})

const paginatedNonDraftItems = computed(() => {
  return paginatedItems.value?.filter(article => !article.draft) || []
})
</script>
