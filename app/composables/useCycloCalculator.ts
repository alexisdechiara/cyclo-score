import { getBestPossibleScore, getMaxRemainingDepth } from "~/utils/questions"
import type { Score } from "~/types/questions"

export function useCycloCalculator() {
  const { questions, startId, pending } = useQuestions()

  const currentQuestionId = ref(startId.value || "separe_physiquement")
  const history = ref<string[]>([])
  const score = ref<Score | null>(null)
  const appConfig = useAppConfig()

  // Question actuelle basée sur l'ID
  const currentQuestion = computed(() => questions.value[currentQuestionId.value])

  // Calcul de la progression
  const progress = computed(() => {
    if (pending.value) return 0
    if (score.value) return 100

    const currentDepth = history.value.length
    const remainingDepth = getMaxRemainingDepth(currentQuestionId.value, questions.value)
    const totalDepth = currentDepth + remainingDepth

    // Éviter la division par zéro
    if (totalDepth === 0) return 100

    return (currentDepth / totalDepth) * 100
  })

  // Score cible (pour la couleur)
  const targetScore = computed(() => {
    if (score.value) return score.value
    return getBestPossibleScore(currentQuestionId.value, questions.value)
  })

  // Mise à jour de la couleur primaire
  watch(targetScore, (newScore) => {
    if (!newScore) {
      appConfig.ui.colors.primary = "indigo"
      return
    }

    switch (newScore) {
      case "A":
        appConfig.ui.colors.primary = "green"
        break
      case "B":
        appConfig.ui.colors.primary = "lime"
        break
      case "C":
        appConfig.ui.colors.primary = "yellow"
        break
      case "D":
        appConfig.ui.colors.primary = "orange"
        break
      case "E":
        appConfig.ui.colors.primary = "red"
        break
      default:
        appConfig.ui.colors.primary = "indigo"
    }
  }, { immediate: true })

  // Réinitialiser la couleur au démontage
  onUnmounted(() => {
    appConfig.ui.colors.primary = "indigo"
  })

  function isScore(val: string): val is Score {
    return ["A", "B", "C", "D", "E"].includes(val)
  }

  function handleAnswer(answer: "yes" | "no") {
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
    currentQuestionId.value = startId.value || "separe_physiquement"
    history.value = []
    score.value = null
  }

  return {
    currentQuestionId,
    currentQuestion,
    history,
    score,
    progress,
    handleAnswer,
    handleBack,
    handleRestart,
    pending
  }
}
