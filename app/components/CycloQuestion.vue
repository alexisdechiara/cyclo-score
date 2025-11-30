<script setup lang="ts">
import type { Question } from '~/utils/questions'

const props = defineProps<{
  question: Question
}>()

const emit = defineEmits<{
  (e: 'answer', value: 'yes' | 'no'): void
}>()

// A more robust way to render text with links:
const textParts = computed(() => {
  const text = props.question.text
  const definitions = props.question.definitions || []

  if (definitions.length === 0) return [{ type: 'text', content: text }]

  // Create a regex that matches any of the definitions
  const pattern = new RegExp(`(${definitions.join('|')})`, 'gi')
  const parts = text.split(pattern)

  return parts.map(part => {
    const isDefinition = definitions.some(d => d.toLowerCase() === part.toLowerCase())
    if (isDefinition) {
      // Create a slug for the page
      const slug = part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '-')
      return { type: 'link', content: part, to: `/${slug}` }
    }
    return { type: 'text', content: part }
  })
})

const definitions = reactive<Record<string, string>>({})

watch(() => textParts.value, async (parts) => {
  const links = parts.filter(part => part.type === 'link')

  for (const link of links) {
    if (link.to && !definitions[link.to]) {
      try {
        const page = await queryCollection('docs').path(link.to).first()
        if (page) {
          definitions[link.to] = page.description
        }
      } catch (e) {
        console.error(`Failed to fetch definition for ${link.to}`, e)
      }
    }
  }
}, { immediate: true })
</script>

<template>
  <div class="flex flex-col items-center justify-center space-y-8 max-w-2xl mx-auto p-6">
    <h2 class="text-2xl md:text-3xl font-bold text-center text-pretty text-default leading-tight">
      <template v-for="(part, index) in textParts" :key="index">
        <span v-if="part.type === 'text'">{{ part.content }}</span>
        <UTooltip v-else :delay-duration="0" :content="{
          align: 'center',
          side: 'top',
          sideOffset: 8
        }" :text="definitions[part.to!] || 'Chargement...'">
          <NuxtLink :to="part.to" target="_blank"
            class="text-primary-500 hover:text-primary-600 underline decoration-dotted underline-offset-4">
            {{ part.content }}
          </NuxtLink>
        </UTooltip>
      </template>
    </h2>

    <div class="flex gap-4 w-full max-w-md">
      <UButton size="xl" block color="neutral" variant="outline" class="flex-1 cursor-pointer"
        @click="emit('answer', 'no')">
        Non
      </UButton>
      <UButton size="xl" block color="neutral" variant="outline" class="flex-1 cursor-pointer"
        @click="emit('answer', 'yes')">
        Oui
      </UButton>
    </div>
  </div>
</template>
