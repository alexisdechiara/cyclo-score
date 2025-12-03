import type { QuestionsMap, Score } from "~/types/questions"

export function getBestPossibleScore(currentId: string, questions: QuestionsMap): Score | null {
  const scores: Score[] = ["A", "B", "C", "D", "E"]
  const visited = new Set<string | Score>()
  const memo = new Map<string | Score, Score>()

  function traverse(id: string | Score): Score {
    // Si on atteint directement un score final, on le renvoie
    if (scores.includes(id as Score)) {
      return id as Score
    }

    // Si on a déjà calculé le résultat pour ce nœud, on le renvoie
    if (memo.has(id)) {
      return memo.get(id)!
    }

    // Protection contre les cycles dans l'arbre de décision (nœud en cours de visite)
    if (visited.has(id)) {
      return "E"
    }
    visited.add(id)

    const question = questions[id as string]
    if (!question) {
      visited.delete(id)
      return "E" // Ne devrait pas arriver
    }

    const scoreYes = traverse(question.yes)
    const scoreNo = traverse(question.no)

    visited.delete(id)

    // Retourne le meilleur score (index le plus bas dans le tableau scores)
    const indexYes = scores.indexOf(scoreYes)
    const indexNo = scores.indexOf(scoreNo)

    const result = indexYes < indexNo ? scoreYes : scoreNo
    memo.set(id, result)
    return result
  }

  return traverse(currentId)
}

/**
 * Calcule la profondeur maximale restante (nombre de questions) à partir d'une question donnée.
 * Utilisé pour la barre de progression.
 *
 * @param currentId L'identifiant de la question actuelle
 * @returns Le nombre maximum de questions restantes
 */
export function getMaxRemainingDepth(currentId: string, questions: QuestionsMap): number {
  const scores: Score[] = ["A", "B", "C", "D", "E"]
  const visited = new Set<string | Score>()
  const memo = new Map<string | Score, number>()

  function traverse(id: string | Score): number {
    if (scores.includes(id as Score)) {
      return 0
    }

    if (memo.has(id)) {
      return memo.get(id)!
    }

    if (visited.has(id)) {
      return 0 // Cycle détecté, on arrête de compter
    }
    visited.add(id)

    const question = questions[id as string]
    if (!question) {
      visited.delete(id)
      return 0
    }

    const depthYes = traverse(question.yes)
    const depthNo = traverse(question.no)

    visited.delete(id)

    const result = 1 + Math.max(depthYes, depthNo)
    memo.set(id, result)
    return result
  }

  return traverse(currentId)
}
