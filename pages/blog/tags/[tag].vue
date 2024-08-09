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
const { data: articles } = await useAsyncData('all-articles', () =>
  queryContent("/")
    .where({ draft: { $ne: true } })
    .sort({'date': -1})
    .find()
)

  // async asyncData ({ $content, params }) {
  //   let articles = await $content({ deep: true })
  //     .only([
  //       'title',
  //       'description',
  //       'image',
  //       'slug',
  //       'author',
  //       'date',
  //       'path',
  //       'tags'
  //     ])
  //     .where({ draft: { $ne: true } })
  //     .where({ tags: { $containsAny: [params.tag] } })
  //     .sortBy('date', 'desc')
  //     .fetch()

  //   articles = articles.filter(x => !x.path.startsWith('/projects/'))
  //   return {
  //     articles
  //   }
  // }

</script>

<style scoped></style>
