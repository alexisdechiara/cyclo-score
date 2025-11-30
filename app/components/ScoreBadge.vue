<script setup lang="ts">
import type { Score } from '~/utils/questions'

defineProps<{
  score: Score
  size?: 'sm' | 'md' | 'lg' | 'xl'
}>()

const colors: Record<Score, { backgroundColor: string; text: string }> = {
  'A': {
    backgroundColor: 'bg-green-500',
    text: 'Aménagement large, séparé, continu, prioritaire et confortable'
  },
  'B': {
    backgroundColor: 'bg-lime-500',
    text: 'Aménagement séparé mais sans confort maximal, ou voie secondaire bien protégée'
  },
  'C': {
    backgroundColor: 'bg-yellow-500',
    text: 'Aménagement existant mais limité en largeur, lisibilité ou confort'
  },
  'D': {
    backgroundColor: 'bg-orange-500',
    text: 'Aménagement présent mais très peu fonctionnel, discontinuités'
  },
  'E': {
    backgroundColor: 'bg-red-500',
    text: 'Aménagement dangereux ou inutilisable'
  }
}
</script>

<template>
  <div class="rounded-3xl flex flex-col items-center justify-center font-bold text-inverted p-2 max-w-sm w-full"
    :class="colors[score].backgroundColor">
    <div class="flex p-4 items-bottom leading-none align-bottom w-full cursor-default">
      <h2 class="inline-flex me-auto text-[9rem]">{{ score }}</h2>
      <Icon :name="`cyclo-score:icon-${score.toLocaleLowerCase()}`" class="text-[8rem]" />
    </div>
    <div class="flex flex-col justify-center items-center py-8 px-4 bg-default rounded-b-2xl gap-8">
      <div class="flex items-center">
        <span v-for="(color, key) in colors" :key="key"
          :class="[color.backgroundColor, score === key ? 'scale-115 shadow-xs rounded-2xl border-(--bg-default) border-4' : 'first-of-type:rounded-l-2xl last-of-type:rounded-r-2xl']"
          class="text-inverted px-3 py-1.5 text-6xl cursor-default">
          {{ key }}
        </span>
      </div>
      <p class="text-default text-xl capitalize">{{ colors[score].text }}</p>
    </div>
  </div>
</template>
