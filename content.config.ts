import { defineContentConfig, defineCollection, z } from "@nuxt/content"

export default defineContentConfig({
  collections: {
    landing: defineCollection({
      type: "page",
      source: "index.md"
    }),
    glossary: defineCollection({
      type: "page",
      source: "glossaire/*.md",
      schema: z.object({
        term: z.string(),
        definition: z.string(),
        links: z.array(z.object({
          label: z.string(),
          icon: z.string(),
          to: z.string(),
          target: z.string().optional()
        })).optional()
      })
    }),
    questions: defineCollection({
      type: "page",
      source: "questions/*.md",
      schema: z.object({
        yes: z.string(),
        no: z.string()
      })
    })
  }
})
