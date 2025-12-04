<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => queryCollection('landing').path('/').first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const title = page.value?.title || page.value?.seo?.title
const description = page.value?.description || page.value?.seo?.description

useSeoMeta({
  titleTemplate: '',
  title,
  description,
})

defineOgImageComponent('Docs')
</script>

<template>
  <ContentRenderer v-if="page" :value="page" :prose="false" />
</template>
