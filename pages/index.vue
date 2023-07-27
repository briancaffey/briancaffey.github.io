<template>
  <div class="mx-auto max-w-6xl">
    <div class="px-4 lg:px-32 mb-8">
      <div class="sm:py-16 text-center py-4">
        <div class="py-3 rounded hero text-left text-2xl">
          {{ $t('home.welcome') }}
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <h2 class="text-4xl pb-4 text-left">
            {{ $t('home.blogPost') }}
          </h2>
          <ul>
            <blog-card :article="articles[0]" />
          </ul>
          <div class="pt-8 text-right">
            <nuxt-link
              :to="localePath('/blog/1')"
              class="px-16 py-4 rounded border btn"
            >
              {{ $t('home.allArticles') }} →
            </nuxt-link>
          </div>
        </div>
        <div>
          <h2 class="text-4xl pb-4 text-left">
            {{ $t('home.tags') }}
          </h2>
          <tag-cloud :articles="articles" :limit="30" />
          <div class="mt-8 text-right">
            <nuxt-link
              :to="localePath('/blog/tags/')"
              class="px-16 p-4 rounded border btn"
            >
              {{ $t('home.allTags') }} →
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData ({ $content, params }) {
    let articles = await $content({ deep: true })
      .only([
        'title',
        'description',
        'image',
        'slug',
        'author',
        'date',
        'path',
        'tags',
        'external'
      ])
      .where({ draft: { $ne: true } })
      .sortBy('date', 'desc')
      .fetch()

    articles = articles.filter(x => !x.path.startsWith('/projects/'))
    return {
      articles
    }
  },
  head () {
    return {
      title: 'Brian Caffey'
    }
  },
  transition: 'page'
}
</script>

<style></style>
