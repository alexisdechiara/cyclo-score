<script setup lang="ts">
import type { Question } from '~/utils/questions'

const props = defineProps<{
  question: Question
}>()

const emit = defineEmits<{
  (e: 'answer', value: 'yes' | 'no'): void
}>()

// Helper to wrap definitions in links
const formattedText = computed(() => {
  let text = props.question.text
  if (!props.question.definitions) return text

  props.question.definitions.forEach(def => {
    // Create a regex to match the definition case-insensitively
    const regex = new RegExp(`(${def})`, 'gi')
    // Replace with a link. We use a special marker to parse it in template if needed,
    // or just use v-html with NuxtLink (but v-html doesn't compile components).
    // Better approach: Split text by definitions and render parts.
    // For simplicity and robustness with Nuxt UI, let's try a split approach.
  })
  return text
})

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
      const slug = part.toLowerCase().replace(/\s+/g, '-')
      return { type: 'link', content: part, to: `/${slug}` }
    }
    return { type: 'text', content: part }
  })
})
</script>

<template>
  <div class="flex flex-col items-center justify-center space-y-8 max-w-2xl mx-auto p-6">
    <h2 class="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white leading-tight">
      <template v-for="(part, index) in textParts" :key="index">
        <span v-if="part.type === 'text'">{{ part.content }}</span>
        <NuxtLink v-else :to="part.to" target="_blank"
          class="text-primary-500 hover:text-primary-600 underline decoration-dotted underline-offset-4"
          title="Voir la définition">
          {{ part.content }}
        </NuxtLink>
      </template>
    </h2>

    <div class="flex gap-4 w-full max-w-md">
      <UButton size="xl" block color="neutral" variant="outline" class="flex-1" @click="emit('answer', 'no')">
        Non
      </UButton>
      <UButton size="xl" block color="neutral" variant="solid" class="flex-1" @click="emit('answer', 'yes')">
        Oui
      </UButton>
    </div>
  </div>
</template>
