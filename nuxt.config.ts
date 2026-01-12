// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/ui",
    "@nuxt/content",
    "nuxt-og-image",
    "@nuxt/icon",
    "@vueuse/nuxt",
    "@nuxt/fonts",
    "@nuxtjs/seo",
    "nuxt-studio"
  ],

  devtools: {
    enabled: true
  },

  css: ["~/assets/css/main.css"],

  site: {
    name: "Cyclo-Score",
    description: "Un outil simple pour évaluer la sécurité et le confort des aménagements cyclables.",
    defaultLocale: "fr"
  },

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
      crawlLinks: true,
      routes: ["/", "/sitemap.xml", "/robots.txt"],
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

  studio: {
    dev: true,
    i18n: {
      defaultLocale: "fr"
    },
    repository: {
      provider: process.env.STUDIO_PROVIDER as "github" | "gitlab",
      owner: process.env.STUDIO_OWNER || "alexisdechiara",
      repo: process.env.STUDIO_REPO || "cyclo-score",
      branch: process.env.STUDIO_BRANCH
    }
  }
})