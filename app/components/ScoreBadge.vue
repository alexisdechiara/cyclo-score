<script setup lang="ts">
import type { Score } from "~/types/questions"

withDefaults(defineProps<{
  score: Score
  variant?: "flowchart" | "calculator"
}>(), {
  variant: "calculator"
})

const colors: Record<Score, { backgroundColor: string, ringColor: string, text: string }> = {
  A: {
    backgroundColor: "bg-green-500",
    ringColor: "ring-green-500",
    text: "Aménagement large, séparé, continu, prioritaire et confortable"
  },
  B: {
    backgroundColor: "bg-lime-500",
    ringColor: "ring-lime-500",
    text: "Aménagement séparé mais sans confort maximal, ou voie secondaire bien protégée"
  },
  C: {
    backgroundColor: "bg-yellow-500",
    ringColor: "ring-yellow-500",
    text: "Aménagement existant mais limité en largeur, lisibilité ou confort"
  },
  D: {
    backgroundColor: "bg-orange-500",
    ringColor: "ring-orange-500",
    text: "Aménagement présent mais très peu fonctionnel, discontinuités"
  },
  E: {
    backgroundColor: "bg-red-500",
    ringColor: "ring-red-500",
    text: "Aménagement dangereux ou inutilisable"
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center font-bold text-inverted overflow-hidden ring-12"
    :class="[colors[score].backgroundColor, colors[score].ringColor, variant === 'calculator' ? 'max-w-sm w-full p-2 rounded-3xl' : 'w-full max-w-64 p-0 rounded-xl m-4']">
    <div class="flex p-4 items-bottom leading-none align-bottom w-full">
      <h2 class="inline-flex me-auto" :class="variant === 'calculator' ? 'text-[9rem] cursor-default' : 'text-7xl'">
        {{ score }}
      </h2>
      <Icon :name="`cyclo-score:icon-${score.toLocaleLowerCase()}`"
        :class="variant === 'calculator' ? 'text-9xl' : 'text-6xl'" />
    </div>
    <div class="flex flex-col justify-center items-center bg-default"
      :class="variant === 'calculator' ? 'w-full rounded-b-2xl py-8 px-4 gap-8' : 'w-full rounded-b-lg py-4 px-2 gap-4'">
      <div class="flex items-center">
        <span v-for="(color, key) in colors" :key="key" :class="[
          color.backgroundColor, score === key && 'scale-115 shadow-xs border-(--bg-default)',
          variant === 'calculator' ? ' cursor-default text-5xl px-3 py-1.5 first-of-type:rounded-l-2xl last-of-type:rounded-r-2xl' : 'text-3xl px-2 py-1 first-of-type:rounded-l-lg last-of-type:rounded-r-lg',
          score === key && variant === 'calculator' ? 'border-4 rounded-2xl' : score === key && variant === 'flowchart' ? 'border-2 rounded-lg' : 'border-0'
        ]" class="text-inverted">
          {{ key }}
        </span>
      </div>
      <p class="text-default text-center uppercase text-pre " :class="variant === 'calculator' ? 'text-xl' : 'text-sm'">
        {{ colors[score].text }}
      </p>
    </div>
  </div>
</template>
