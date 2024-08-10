<template>
  <div class="mx-auto max-w-6xl">
    <h1 class="text-center text-3xl py-8">
      {{ $t('blog.blogPosts') }} ({{ articles.length }})
    </h1>
    <div class="mb-8">
      <pagination
        :paginated-items="paginatedItems"
        :all-items="articles"
        :page-no="pageNo"
        :next-page="paginatedItems.length === 10"
      />
    </div>
    <blog-list :articles="paginatedItems" />
    <pagination
      :paginated-items="paginatedItems"
      :all-items="articles"
      :page-no="pageNo"
      :next-page="paginatedItems.length === 10"
    />
  </div>
</template>

<script setup>
defineI18nRoute({
  locales: ['en']
});
const route = useRoute();
const pageNo = parseInt(route.params.number);

const { data: articles } = await useAsyncData('all-articles', () =>
  queryContent("/")
    .where({ draft: { $ne: true } })
    .sort({'date': -1})
    .find()
);

const { data: paginatedItems } = await useAsyncData('paginated-items', () =>
  queryContent("/")
    .where({ draft: { $ne: true } })
    .sort({'date': -1})
    .limit(10)
    .skip(9 * (pageNo - 1))
    .find()
)
</script>
