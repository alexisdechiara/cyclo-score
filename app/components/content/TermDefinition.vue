<script setup lang="ts">
const props = defineProps<{
  term: string
  label?: string
}>()

const definition = ref<string | null>(null)
const slug = computed(() => props.term.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, "-"))

const { data } = await useAsyncData(`definition-${props.term}`, () => {
  return queryCollection("glossary").path(`/glossaire/${slug.value}`).first()
})

if (data.value) {
  definition.value = data.value.definition
}
</script>

<template>
  <UTooltip :text="definition || 'Chargement...'" :content="{ align: 'center', side: 'top', sideOffset: 8 }"
    class="max-w-md">
    <NuxtLink :to="`/glossaire/${slug}`" target="_blank"
      class="text-primary-500 hover:text-primary-600 underline decoration-dotted underline-offset-4">
      <ContentSlot :default="label || term" unwrap="p" />
    </NuxtLink>
  </UTooltip>
</template>
