<script setup lang="ts">
import type { Score } from "~/types/questions"

defineProps<{
  score: Score
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <ScoreBadge :score="score" size="xl" />
  </div>
</template>
