<script setup lang="ts">
import type { Score } from "~/utils/questions"

defineProps<{
  score: Score
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center space-y-8 max-w-2xl mx-auto p-6 text-center">
    <ScoreBadge
      :score="score"
      size="xl"
    />
  </div>
</template>
