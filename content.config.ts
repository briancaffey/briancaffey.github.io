import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      // Load all markdown files in the content directory and subdirectories
      source: '**/*.md',
      // Specify the type of content in this collection
      type: 'page',
      // Define custom schema for blog collection
      schema: z.object({
        title: z.string(),
        date: z.string(),
        description: z.string(),
        image: z.string().optional(),
        tags: z.array(z.string()).optional(),
        draft: z.boolean().optional(),
        comments: z.boolean().optional(),
        external: z.array(z.object({
          link: z.string(),
          site: z.string()
        })).optional()
      })
    }),
    // Define a separate collection for todo docs that won't be prerendered as routes
    todo: defineCollection({
      source: 'todo/**/*.md',
      type: 'data',  // Data collections don't create pages/routes
      schema: z.object({
        title: z.string(),
        date: z.string().optional(),
        description: z.string().optional()
      })
    })
  },
})
