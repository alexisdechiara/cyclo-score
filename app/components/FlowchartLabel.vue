<script setup lang="ts">
import type { Question } from "~/types/questions"

defineProps<{
  question: Question
}>()
</script>

<template>
  <div
    class="prose prose-sm text-default prose-strong:font-bold prose-strong:text-default prose-p:font-medium prose-p:leading-tight prose-p:m-0 text-center text-pretty">
    <ContentRenderer :value="question" />
  </div>
</template>
