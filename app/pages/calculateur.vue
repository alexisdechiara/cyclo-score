<script setup lang="ts">
import { questions, type Score, getBestPossibleScore, getMaxRemainingDepth } from '~/utils/questions'

const currentQuestionId = ref('start')
const history = ref<string[]>([])
const score = ref<Score | null>(null)

// Calculate progress
const progress = computed(() => {
  if (score.value) return 100

  const currentDepth = history.value.length
  const remainingDepth = getMaxRemainingDepth(currentQuestionId.value)
  const totalDepth = currentDepth + remainingDepth

  // Avoid division by zero
  if (totalDepth === 0) return 100

  return (currentDepth / totalDepth) * 100
})

const appConfig = useAppConfig()

// Update primary color based on score (actual or predicted)
const updatePrimaryColor = () => {
  let targetScore: Score | null = score.value

  if (!targetScore) {
    targetScore = getBestPossibleScore(currentQuestionId.value)
  }

  if (!targetScore) {
    appConfig.ui.colors.primary = 'indigo'
    return
  }

  switch (targetScore) {
    case 'A':
      appConfig.ui.colors.primary = 'green'
      break
    case 'B':
      appConfig.ui.colors.primary = 'lime'
      break
    case 'C':
      appConfig.ui.colors.primary = 'yellow'
      break
    case 'D':
      appConfig.ui.colors.primary = 'orange'
      break
    case 'E':
      appConfig.ui.colors.primary = 'red'
      break
    default:
      appConfig.ui.colors.primary = 'indigo'
  }
}

// Watch for changes in score or current question to update color
watch([score, currentQuestionId], () => {
  updatePrimaryColor()
}, { immediate: true })

// Reset color on unmount
onUnmounted(() => {
  appConfig.ui.colors.primary = 'indigo'
})


const currentQuestion = computed(() => questions[currentQuestionId.value])

function handleAnswer(answer: 'yes' | 'no') {
  if (!currentQuestion.value) return

  const next = currentQuestion.value[answer]

  history.value.push(currentQuestionId.value)

  if (isScore(next)) {
    score.value = next
  } else {
    currentQuestionId.value = next
  }
}

function handleBack() {
  if (history.value.length === 0) return

  const prev = history.value.pop()
  if (prev) {
    currentQuestionId.value = prev
    score.value = null
  }
}

function handleRestart() {
  currentQuestionId.value = 'start'
  history.value = []
  score.value = null
}

function isScore(val: string): val is Score {
  return ['A', 'B', 'C', 'D', 'E'].includes(val)
}
</script>

<template>
  <div class="size-full flex flex-col items-center justify-between overflow-hidden">
    <UProgress v-model="progress" size="sm" :max="100" />

    <div class="flex-1 w-full max-w-4xl flex flex-col justify-center items-center overflow-y-auto min-h-0 p-4">
      <Transition mode="out-in" enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform translate-y-4 opacity-0" enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in" leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform translate-y-4 opacity-0">
        <CycloResult v-if="score" :score="score" @restart="handleRestart" />
        <CycloQuestion v-else-if="currentQuestion" :key="currentQuestionId" :question="currentQuestion"
          @answer="handleAnswer" />
        <div v-else class="text-center text-error">
          Erreur: Question introuvable ({{ currentQuestionId }})
        </div>
      </Transition>
    </div>

    <div class="mb-6 px-6 flex gap-6 items-center w-full shrink-0">
      <UButton v-if="history.length > 0" variant="ghost" class="me-auto" color="neutral" icon="lucide:arrow-left"
        @click="handleBack">
        Retour
      </UButton>
      <UButton v-if="score" color="neutral" variant="ghost" icon="lucide:refresh-cw" @click="handleRestart">
        Recommencer
      </UButton>
    </div>
  </div>
</template>
