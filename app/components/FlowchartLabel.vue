<script setup lang="ts">
import type { Question } from "~/types/questions"

defineProps<{
  question: Question
}>()
</script>

<template>
  <div
    class="prose prose-sm prose-strong:font-bold prose-p:font-medium prose-p:leading-tight prose-p:m-0 text-center text-pretty">
    <ContentRenderer :value="question" />
  </div>
</template>
