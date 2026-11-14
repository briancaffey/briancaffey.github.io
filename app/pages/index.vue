<template>
  <div class="content-container">
    <div class="mb-8">
      <div class="sm:py-16 text-center py-4">
        <div class="py-3 text-left text-2xl text-primary">
          {{ $t('home.welcome') }}
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <h2 class="text-4xl pb-4 text-left">
            {{ $t('home.blogPost') }}
          </h2>
          <ul>
            <blog-card v-if="articles && articles.length > 0" :article="articles[0]" />
          </ul>
          <div class="pt-8 text-right">
            <nuxt-link
              to="/blog/1"
              class="btn"
            >
              {{ $t('home.allArticles') }} →
            </nuxt-link>
          </div>
        </div>
        <div>
          <h2 class="text-4xl pb-4 text-left">
            {{ $t('home.tags') }}
          </h2>
          <tag-cloud :articles="articles || []" :limit="30" />
          <div class="mt-8 text-right">
            <nuxt-link
              to="/blog/tags/"
              class="btn"
            >
              {{ $t('home.allTags') }} →
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: articles } = await useAsyncData('all-articles', () =>
  queryCollection("blog")
    .order('date', 'DESC')
    .all()
    // Drafts are published for review but stay off the listings.
    .then(list => list.filter(article => !article.draft))
)
</script>
