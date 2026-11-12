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
    // One file per project in content/projects: what it was built with, what
    // it runs on now, and where it lives. Articles and the /projects page
    // read from here, so a project's status is edited in one place.
    projects: defineCollection({
      type: 'data',
      source: 'projects/*.yml',
      schema: z.object({
        slug: z.string(),
        title: z.string(),
        year: z.number(),
        summary: z.string(),
        // Path of the article about it, as in the URL.
        article: z.string(),
        repo: z.string().optional(),
        event: z.string().optional(),
        // archived: as the article left it. reviving: being rebuilt.
        // running: rebuilt and in use.
        status: z.enum(['archived', 'reviving', 'running']),
        updated: z.string().optional(),
        then: z.object({
          stack: z.array(z.string()),
          models: z.array(z.string())
        }),
        now: z.object({
          stack: z.array(z.string()),
          models: z.array(z.string()),
          notes: z.string().optional()
        }).optional(),
        video: z.string().optional()
      })
    })
  },
})
