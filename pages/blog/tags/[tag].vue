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
            {{ $route.params.tag }} 🏷️
          </span>
        </nuxt-link>
      </div>
    </div>
    <blog-list :articles="articles" />
  </div>
</template>

<script setup>
defineI18nRoute({
  locales: ['en']
});
const route = useRoute();
const tag = route.params.tag;
const { data: articles } = await useAsyncData(route.path, () =>
  queryContent("/")
    .where({ draft: { $ne: true } })
    .where({ tags: { $containsAny: [tag]}})
    .sort({'date': -1})
    .find()
)


</script>

<style scoped></style>
