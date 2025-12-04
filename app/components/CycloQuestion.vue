<script setup lang="ts">
import type { Question } from "~/types/questions"

defineProps<{
  question: Question
}>()

const emit = defineEmits<{
  (e: "answer", value: "yes" | "no"): void
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center space-y-8 max-w-2xl mx-auto">
    <div
      class="prose text-default text-2xl prose-strong:prose-a:font-bold md:text-3xl prose-strong:font-bold prose-strong:text-default prose-p:font-medium prose-p:leading-tight prose-p:m-0 text-center text-pretty">
      <ContentRenderer :value="question" />
    </div>

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
