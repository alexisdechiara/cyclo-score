// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/ui",
    "@nuxt/content",
    "nuxt-og-image",
    "nuxt-llms",
    "@nuxt/icon",
    "@vueuse/nuxt"
  ],

  devtools: {
    enabled: true
  },

  css: ["~/assets/css/main.css"],

  content: {
    build: {
      markdown: {
        toc: {
          searchDepth: 1
        }
      }
    }
  },

  compatibilityDate: "2024-07-11",

  nitro: {
    prerender: {
      routes: [
        "/"
      ],
      crawlLinks: true,
      autoSubfolderIndex: false
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: "never",
        braceStyle: "1tbs",
        quotes: "double"
      }
    }
  },

  icon: {
    provider: "iconify",
    customCollections: [
      {
        prefix: "cyclo-score",
        dir: "./app/assets/css/icons/cyclo-score"
      }
    ]
  },

  llms: {
    domain: "https://cyclo-score.nuxt.dev/",
    title: "Cyclo-Score",
    description: "Documentation et glossaire pour le calculateur Cyclo-Score.",
    full: {
      title: "Cyclo-Score - Glossaire",
      description: "Toutes les définitions du Cyclo-Score."
    },
    sections: [
      {
        title: "Glossaire",
        contentCollection: "glossary",
        contentFilters: [
          { field: "path", operator: "LIKE", value: "/%" }
        ]
      }
    ]
  }
})