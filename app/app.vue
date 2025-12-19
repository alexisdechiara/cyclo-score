<script setup lang="ts">
import type { CommandPaletteGroup, ContentSearchItem } from "@nuxt/ui"

const { seo } = useAppConfig()

const { data: navigation } = await useAsyncData("navigation", () => queryCollectionNavigation("glossary"))
const { data: files } = useLazyAsyncData("search", () => queryCollectionSearchSections("glossary"), {
  server: false
})

const groups: CommandPaletteGroup<ContentSearchItem>[] = [
  {
    id: "tools",
    label: "Outils",
    items: [
      {
        label: "Calculateur",
        to: "/calculateur",
        icon: "i-lucide-gauge"
      },
      {
        label: "Logigramme",
        to: "/flowchart",
        icon: "i-lucide-git-fork"
      }
    ]
  }
]

useHead({
  meta: [
    { name: "viewport", content: "width=device-width, initial-scale=1" }
  ],
  link: [
    { rel: "icon", href: "/favicon.ico" }
  ],
  htmlAttrs: {
    lang: "fr"
  }
})

useSeoMeta({
  titleTemplate: `%s - ${seo?.siteName}`,
  ogSiteName: seo?.siteName,
})

defineOgImageComponent('NuxtSeo')

provide("navigation", navigation)
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator />

    <AppHeader />

    <UMain>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UMain>

    <AppFooter />

    <ClientOnly>
      <LazyUContentSearch placeholder="Rechercher..." :files="files" :navigation="navigation" :groups="groups"
        :color-mode="false" />
    </ClientOnly>
  </UApp>
</template>
