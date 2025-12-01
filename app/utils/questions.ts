export type Score = "A" | "B" | "C" | "D" | "E"

/**
 * Interface représentant une question dans l'arbre de décision.
 */
export interface Question {
  text: string
  definitions?: string[]
  yes: string | Score
  no: string | Score
}

/**
 * L'arbre de décision complet pour le calcul du Cyclo-Score.
 * Basé sur la méthodologie fournie.
 */
export const questions: Record<string, Question> = {
  separe_physiquement: {
    text: "L'usager est-il **séparé physiquement** de la circulation des véhicules motorisés ?",
    yes: "presence_pietons",
    no: "vitesse_limitee_50"
  },

  presence_pietons: {
    text: "Peut-il y avoir des piétons sur cet aménagement **(voie verte / trottoir)** ?",
    yes: "demarcation_pietons_marquee",
    no: "largeur_2_5m_ou_4m"
  },

  demarcation_pietons_marquee: {
    text: "La démarcation avec les piétons est marquée par une **différence de hauteur** ou une **couleur de l'enrobé** ou un **séparateur podotactile** ?",
    definitions: ["séparateur podotactile"],
    yes: "largeur_2_5m_ou_4m",
    no: "largeur_min_3m_mixte"
  },

  largeur_2_5m_ou_4m: {
    text: "La largeur minimale de l'aménagement est-elle de **2,5 m en sens unique** et de **4 m en double sens** ?",
    yes: "frequence_croisement_faible_large",
    no: "largeur_1_75m_ou_3m"
  },

  borde_voie_rapide: {
    text: "L'aménagement est-il **bordé par une voie** rapide **≥ 50 km/h** ?",
    yes: "borde_arbres_sonore",
    no: "largeur_2_5m_ou_4m"
  },

  vitesse_limitee_50: {
    text: "La vitesse est limitée à **50 km/h ou moins** ?",
    yes: "frequence_croisement_usager_limite_50",
    no: "E"
  },

  borde_arbres_sonore: {
    text: "L'aménagement est-il **bordé d'arbres** ou d'un **séparateur sonore** ?",
    yes: "zone_tampon_3m",
    no: "C"
  },

  zone_tampon_3m: {
    text: "Y a-t-il une **zone tampon de 3 m** ?",
    definitions: ["zone tampon"],
    yes: "continuite_claire_feu",
    no: "continuite_claire_prioritaire"
  },

  continuite_claire_feu: {
    text: "La continuité est **claire**, avec un **passage** ou un **feu dédié**. Séparé des véhicules motorisés et **sans nid de poules** ?",
    yes: "A",
    no: "continuite_claire_prioritaire"
  },

  frequence_croisement_faible_large: {
    text: "Vous croisez moins d'**un usager** par **minute** ?",
    yes: "borde_voie_rapide",
    no: "milieu_urbain_securise"
  },

  continuite_claire_prioritaire: {
    text: "La continuité est **claire**, les usagers sont **prioritaires** (mais peuvent croiser des véhicules **motorisés**) ?",
    yes: "B",
    no: "continuite_claire"
  },

  continuite_claire: {
    text: "La continuité de l'aménagement reste claire ?",
    yes: "C",
    no: "D"
  },

  largeur_1_75m_ou_3m: {
    text: "La largeur est-elle **≥ 1,75 m en sens unique** OU **≥ 3 m en double sens** ?",
    yes: "frequence_croisement_faible_large",
    no: "D"
  },

  milieu_urbain_securise: {
    text: "Est-ce en milieu urbain ?",
    yes: "continuite_claire_prioritaire",
    no: "zone_tampon_3m"
  },

  largeur_min_3m_mixte: {
    text: "La largeur minimale est-elle de **3 m** ?",
    yes: "frequence_croisement_mixte",
    no: "D"
  },

  frequence_croisement_mixte: {
    text: "Vous croisez moins d'**un usager** par **minute** ?",
    yes: "milieu_urbain_securise",
    no: "continuite_claire"
  },

  frequence_croisement_usager_limite_50: {
    text: "Vous croisez moins d'**un usager** par **minute** ?",
    yes: "vitesse_limitee_30_double",
    no: "E"
  },

  largeur_min_3m_vitesse: {
    text: "La largeur minimale est-elle de **3 m** ?",
    yes: "C",
    no: "D"
  },

  vitesse_limitee_30_double: {
    text: "Cette voie est-elle **limitée à 30 km/h** en **double sens cyclable** ?",
    yes: "amenagements_securises",
    no: "milieu_urbain_securise"
  },

  amenagements_securises: {
    text: "Il y a des **ralentisseurs**, des **chicanes**, une **bonne visibilité** ou l'**absence de stationnement** ?",
    definitions: ["ralentisseurs", "chicanes"],
    yes: "continuite_claire",
    no: "milieu_urbain_non_securise"
  },

  milieu_urbain_non_securise: {
    text: "Est-ce en milieu **urbain** ?",
    yes: "D",
    no: "C"
  }
}

/**
 * Calcule le meilleur score possible atteignable à partir d'une question donnée.
 * Utilisé pour prédire la couleur de l'interface.
 *
 * @param currentId L'identifiant de la question actuelle
 * @returns Le meilleur score (A étant le meilleur, E le pire) ou null si erreur
 */
export function getBestPossibleScore(currentId: string): Score | null {
  const scores: Score[] = ["A", "B", "C", "D", "E"]
  const visited = new Set<string | Score>()

  function traverse(id: string | Score): Score {
    // Si on atteint directement un score final, on le renvoie
    if (scores.includes(id as Score)) {
      return id as Score
    }

    // Protection contre les cycles dans l'arbre de décision
    if (visited.has(id)) {
      return "E"
    }
    visited.add(id)

    const question = questions[id as string]
    if (!question) return "E" // Ne devrait pas arriver

    const scoreYes = traverse(question.yes)
    const scoreNo = traverse(question.no)

    // Retourne le meilleur score (index le plus bas dans le tableau scores)
    const indexYes = scores.indexOf(scoreYes)
    const indexNo = scores.indexOf(scoreNo)

    return indexYes < indexNo ? scoreYes : scoreNo
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
export function getMaxRemainingDepth(currentId: string): number {
  const scores: Score[] = ["A", "B", "C", "D", "E"]

  function traverse(id: string | Score): number {
    if (scores.includes(id as Score)) {
      return 0
    }

    const question = questions[id as string]
    if (!question) return 0

    const depthYes = traverse(question.yes)
    const depthNo = traverse(question.no)

    return 1 + Math.max(depthYes, depthNo)
  }

  return traverse(currentId)
}
