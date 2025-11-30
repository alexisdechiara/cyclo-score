<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => queryCollection('landing').path('/').first())
const { data: firstDoc } = await useAsyncData('firstDoc', () => queryCollection('docs').first())

useSeoMeta({
  title: page.value?.seo?.title || 'CYCLO-SCORE',
  description: page.value?.seo?.description || 'Évaluez la qualité des aménagements cyclables.',
})

const cards = [
  {
    title: 'Standardisé',
    description: 'Basé sur une méthodologie rigoureuse prenant en compte la séparation, la vitesse et la continuité.',
    icon: 'lucide:badge-check'
  },
  {
    title: 'Pédagogique',
    description: 'Apprenez les termes techniques grâce à notre glossaire intégré et nos définitions claires.',
    icon: 'lucide:graduation-cap'
  },
  {
    title: 'Rapide',
    description: 'Obtenez un score de A à E en moins de 2 minutes en répondant à quelques questions simples.',
    icon: 'lucide:bar-chart-3'
  }
]
</script>

<template>
  <div class="h-full flex items-center justify-center overflow-hidden">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto px-4 w-full items-center">
      <!-- Left Column: Text and CTAs -->
      <div class="text-left space-y-8">
        <h1 class="text-5xl font-bold tracking-tight text-highlighted sm:text-7xl">
          <span>Cyclo-</span><span class="text-primary">Score</span>
        </h1>
        <p class="text-xl text-muted max-w-lg">
          Un outil simple pour évaluer la sécurité et le confort des aménagements cyclables selon une méthodologie
          standardisée.
        </p>

        <div class="flex gap-4">
          <UButton to="/calculateur" size="xl" color="primary" variant="solid" icon="lucide:play">
            Commencer le test
          </UButton>
          <UButton :to="firstDoc?.path || '/docs'" size="xl" color="neutral" variant="outline" icon="lucide:book-open">
            Glossaire
          </UButton>
        </div>
      </div>

      <!-- Right Column: Cards -->
      <div class="grid gap-6">
        <UPageCard v-for="(card, index) in cards" :key="index" v-bind="card" />
      </div>
    </div>
  </div>
</template>
