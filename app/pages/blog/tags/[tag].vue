<template>
  <div class="mx-auto max-w-6xl">
    <div class="text-xl text-center py-4">
      <div class="mb-4">
        <nuxt-link to="/blog/tags/">
          <span
            class="inline-block bg-white rounded-lg text-small px-2 py-1 shadow"
          >
            🏷️ {{ $t('home.allTags') }} 🏷️
          </span>
        </nuxt-link>
      </div>
      <div class="mb-4">
        <nuxt-link :to="`/blog/tags/${$route.params.tag}/`">
          <span
            class="
              inline-block
              bg-white
              rounded-lg
              text-small
              px-2
              py-1
              uppercase
              shadow
            "
          >
            {{ $route.params.tag }} 🏷️ ({{  filteredArticles.length }})
          </span>
        </nuxt-link>
      </div>
    </div>
    <blog-list :articles="filteredArticles || []" />
  </div>
</template>

<script setup>
defineI18nRoute({
  locales: ['en']
});
const route = useRoute();
const tag = route.params.tag;
const { data: articles } = await useAsyncData(route.path, () =>
  queryCollection("blog")
    .order('date', 'DESC')
    .all()
)

// Filter articles that contain the specified tag
const filteredArticles = computed(() => {
  return articles.value?.filter(article =>
    article.tags && Array.isArray(article.tags) && article.tags.includes(tag)
  ) || []
})
</script>

<style scoped></style>
