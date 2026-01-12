<script setup lang="ts">
import type { Score } from "~/types/questions"

defineProps<{
  score: Score
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center overflow-hidden size-full">
    <ScoreBadge :score="score" size="xl" />
  </div>
</template>
