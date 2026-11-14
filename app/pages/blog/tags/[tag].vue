<template>
  <div class="content-container">
    <div class="text-xl text-center py-4">
      <div class="mb-4">
        <nuxt-link to="/blog/tags/">
          <span class="chip-outline">
            🏷️ {{ $t('home.allTags') }} 🏷️
          </span>
        </nuxt-link>
      </div>
      <div class="mb-4">
        <nuxt-link :to="`/blog/tags/${$route.params.tag}/`">
          <span class="chip-outline uppercase">
            {{ $route.params.tag }} 🏷️ ({{  filteredArticles.length }})
          </span>
        </nuxt-link>
      </div>
    </div>
    <blog-list :articles="filteredArticles || []" />
  </div>
</template>

<script setup lang="ts">
defineI18nRoute({
  locales: ['en']
});
const route = useRoute();
const tag = String(route.params.tag);
const { data: articles } = await useBlogListing()

// Filter articles that contain the specified tag
const filteredArticles = computed(() => {
  return articles.value?.filter(article =>
    article.tags && Array.isArray(article.tags) && article.tags.includes(tag)
  ) || []
})

useHead(() => ({ title: `${tag} · ${filteredArticles.value.length}` }))
</script>

<style scoped></style>
