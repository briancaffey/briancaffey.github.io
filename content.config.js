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
    })
  },
  // Add highlight configuration for code blocks
  highlight: {
    langs: [
      "py",
      "python",
      "bash",
      "cpp",
      "yaml",
      "yml",
      "powershell",
      "json",
      "sql",
      "html",
      "vue-html",
      "javascript",
      "js",
      "php",
      "dockerfile",
      "docker",
      "make",
      "makefile",
      "typescript",
      "ts",
      "terraform"
    ],
    theme: {
      default: 'github-light',
      dark: 'github-dark',
      sepia: 'monokai'
    }
  }
})
