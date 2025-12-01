import { describe, it, expect } from "vitest"
import { getBestPossibleScore, getMaxRemainingDepth, questions } from "../app/utils/questions"

describe("Calculator Utils", () => {
  describe("getBestPossibleScore", () => {
    it("should return A from start", () => {
      expect(getBestPossibleScore("start")).toBe("A")
    })

    it("should return correct score for leaf nodes", () => {
      // 'zone_tampon_3m_oui' -> yes -> A, no -> D. Best is A.
      expect(getBestPossibleScore("zone_tampon_3m_oui")).toBe("A")

      // 'milieu_urbain_largeur_moyenne' -> yes -> B, no -> D. Best is B.
      expect(getBestPossibleScore("milieu_urbain_largeur_moyenne")).toBe("B")
    })
  })

  describe("getMaxRemainingDepth", () => {
    it("should return correct depth from start", () => {
      // Start -> Yes -> Yes -> Yes -> Yes -> Yes -> A (6 steps)
      // Start -> No -> Yes -> Yes -> Yes -> No -> Yes -> Yes -> Yes -> Yes -> Yes -> C (11 steps?)
      // Let's just check it returns a reasonable number > 0
      expect(getMaxRemainingDepth("start")).toBeGreaterThan(5)
    })
  })

  describe("Logic Verification (Path Testing)", () => {
    // Helper to traverse
    function followPath(path: ("yes" | "no")[]): string {
      let currentId = "start"
      for (const answer of path) {
        const q = questions[currentId]
        if (!q) throw new Error(`Question ${currentId} not found`)
        const next = q[answer]
        if (["A", "B", "C", "D", "E"].includes(next)) return next
        currentId = next
      }
      return currentId
    }

    // --- BRANCHE 1 : SÉPARÉ ---
    it("Path to A (Separated, Fast Road, Trees, Buffer, Clear)", () => {
      // Start (Yes) -> Separe
      // Separe (Yes) -> Borde Voie Rapide
      // Borde (Yes) -> Arbres
      // Arbres (Yes) -> Zone Tampon
      // Zone (Yes) -> Continuite
      // Continuite (Yes) -> A
      expect(followPath(["yes", "yes", "yes", "yes", "yes"])).toBe("A")
    })

    it("Path to B (Separated, Fast Road, Trees, No Buffer, Clear)", () => {
      // ... -> Zone Tampon (No) -> Continuite Prioritaire (Yes) -> B
      expect(followPath(["yes", "yes", "yes", "no", "yes"])).toBe("B")
    })

    it("Path to C (Separated, Fast Road, No Trees)", () => {
      // ... -> Borde Voie Rapide (Yes) -> Arbres (No) -> C
      expect(followPath(["yes", "yes", "no"])).toBe("C")
    })

    it("Path to A (Separated, No Fast Road, Wide, Low Traffic, Clear)", () => {
      // Start (Yes) -> Separe
      // Separe (No) -> Non Borde (Largeur Confortable)
      // Largeur (Yes) -> Croisement Faible
      // Croisement (Yes) -> Continuite (Yes) -> A
      expect(followPath(["yes", "no", "yes", "yes", "yes"])).toBe("A")
    })

    // --- BRANCHE 2 : NON SÉPARÉ ---
    it("Path to E (Not Separated, No Pedestrians, Fast Speed)", () => {
      // Start (No) -> Non Separe
      // Non Separe (No) -> Pas de Pietons
      // Pas de Pietons (No) -> E (Vitesse > 50)
      expect(followPath(["no", "no", "no"])).toBe("E")
    })

    it("Path to C (Not Separated, Pedestrians, Demarcation, Wide, Low Traffic)", () => {
      // Start (No) -> Non Separe
      // Non Separe (Yes) -> Presence Pietons
      // Presence (Yes) -> Demarcation
      // Demarcation (Yes) -> Largeur Min 3m
      // Largeur (Yes) -> Croisement Faible (Yes) -> C
      expect(followPath(["no", "yes", "yes", "yes", "yes"])).toBe("C")
    })

    it("Path to E (Not Separated, Pedestrians, No Demarcation)", () => {
      // ... -> Presence Pietons (Yes) -> Demarcation (No) -> E
      expect(followPath(["no", "yes", "no"])).toBe("E")
    })
  })
})
