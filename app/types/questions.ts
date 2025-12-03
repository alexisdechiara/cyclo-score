export const SCORE_IDS = ["A", "B", "C", "D", "E"] as const

export type Score = typeof SCORE_IDS[number]

export interface Question {
  yes: string | Score
  no: string | Score
  definitions?: string[]
}

export type QuestionsMap = Record<string, Question>

export function isScore(value: string | Score | null | undefined): value is Score {
  if (!value) {
    return false
  }
  return SCORE_IDS.includes(value as Score)
}
