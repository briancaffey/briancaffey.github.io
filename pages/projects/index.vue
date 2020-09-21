<template>
  <div>
    <h1 class="text-center text-xl py-8">Projects ({{ projects.length }})</h1>
    <div class="lg:px-32 px-4">
      <ul class="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
        <li
          v-for="project of projects"
          :key="project.slug"
          class="rounded article-card"
        >
          <nuxt-link
            :to="{ name: 'projects-slug', params: { slug: project.slug } }"
          >
            <img
              v-if="project.image"
              :src="project.image"
              class="h-32 w-full object-cover rounded-t"
            />
            <div class="p-8">
              <h2 class="text-2xl">{{ project.title }}</h2>
              <p>{{ project.description }}</p>
              <p class="text-gray-500 mb-4">
                Last updated: {{ formatDate(project.date) }}
              </p>
            </div>
          </nuxt-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ $content, params }) {
    const projects = await $content('projects', params.slug)
      .only([
        'layout',
        'title',
        'comments',
        'permalink',
        'github',
        'image',
        'link',
        'date',
        'slug',
      ])
      .sortBy('date', 'desc')
      .fetch()

    return {
      projects,
    }
  },
  methods: {
    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(date).toLocaleDateString('en', options)
    },
  },
  head() {
    return {
      title: 'Projects',
    }
  },
}
</script>
