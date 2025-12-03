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
        no: z.string(),
        positions: z.array(z.number()).max(2).optional()
      })
    })
  }
})
