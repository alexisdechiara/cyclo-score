<script setup lang="ts">
const {
  currentQuestionId,
  currentQuestion,
  history,
  score,
  progress,
  handleAnswer,
  handleBack,
  handleRestart
} = useCycloCalculator()
</script>

<template>
  <div class="size-full flex flex-col items-center justify-between overflow-hidden">
    <UProgress
      v-model="progress"
      size="sm"
      :max="100"
    />

    <div class="flex-1 w-full max-w-4xl flex flex-col justify-center items-center overflow-y-auto min-h-0 p-4">
      <Transition
        mode="out-in"
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform translate-y-4 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform translate-y-4 opacity-0"
      >
        <CycloResult
          v-if="score"
          :score="score"
          @restart="handleRestart"
        />
        <CycloQuestion
          v-else-if="currentQuestion"
          :key="currentQuestionId"
          :question="currentQuestion"
          @answer="handleAnswer"
        />
        <div
          v-else
          class="text-center text-error"
        >
          Erreur: Question introuvable ({{ currentQuestionId }})
        </div>
      </Transition>
    </div>

    <div class="mb-6 px-6 flex gap-6 items-center w-full shrink-0">
      <UButton
        v-if="history.length > 0"
        variant="ghost"
        class="me-auto"
        color="neutral"
        icon="lucide:arrow-left"
        @click="handleBack"
      >
        Retour
      </UButton>
      <UButton
        v-if="score"
        color="neutral"
        variant="ghost"
        icon="lucide:refresh-cw"
        @click="handleRestart"
      >
        Recommencer
      </UButton>
    </div>
  </div>
</template>
