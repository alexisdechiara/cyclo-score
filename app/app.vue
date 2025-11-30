<script setup lang="ts">
const { seo } = useAppConfig()

const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('docs'))
const { data: files } = useLazyAsyncData('search', () => queryCollectionSearchSections('docs'), {
  server: false
})

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  titleTemplate: `%s - ${seo?.siteName}`,
  ogSiteName: seo?.siteName,
  twitterCard: 'summary_large_image'
})

provide('navigation', navigation)
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator />

    <div class="flex flex-col max-h-screen fixed inset-0 overflow-hidden justify-between">
      <AppHeader />

      <UMain class="flex-1 min-h-0">
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </UMain>

      <AppFooter />
    </div>

    <ClientOnly>
      <LazyUContentSearch :files="files" :navigation="navigation" :color-mode="false" />
    </ClientOnly>
  </UApp>
</template>
