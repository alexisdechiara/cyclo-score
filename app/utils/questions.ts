export type Score = 'A' | 'B' | 'C' | 'D' | 'E'

export interface Question {
  id: string
  text: string
  definitions?: string[]
  yes: string | Score
  no: string | Score
}

export const questions: Record<string, Question> = {
  start: {
    id: 'start',
    text: 'L\'usager est-il séparé physiquement de la circulation des véhicules motorisés ?',
    yes: 'pietons',
    no: 'voie_rapide'
  },

  // --- SEPARATED BRANCH (OUI) ---
  pietons: {
    id: 'pietons',
    text: 'Peut-il y avoir des piétons sur cet aménagement (voie verte / trottoir) ?',
    yes: 'demarcation_pietons',
    no: 'largeur_min_25_4'
  },
  demarcation_pietons: {
    id: 'demarcation_pietons',
    text: 'La démarcation avec les piétons est marquée par une différence de hauteur, une couleur de l\'enrobé ou un séparateur podotactile ?',
    definitions: ['séparateur podotactile'],
    yes: 'largeur_min_25_4',
    no: 'largeur_min_3'
  },
  largeur_min_25_4: {
    id: 'largeur_min_25_4',
    text: 'La largeur minimale de l\'aménagement est-elle de 2,5 m en sens unique et de 4 m en double sens ?',
    yes: 'continuite_claire_prioritaire', // Goes to B check
    no: 'sens_unique_175_double_3'
  },
  largeur_min_3: {
    id: 'largeur_min_3',
    text: 'La largeur minimale de l\'aménagement est-elle de 3 m ?',
    yes: 'croisez_moins_1_min_sep', // Goes to Usage Check (Middle)
    no: 'D'
  },
  sens_unique_175_double_3: {
    id: 'sens_unique_175_double_3',
    text: 'Sens unique ≥ 1,75 m, double sens ≥ 3 m ?',
    yes: 'croisez_moins_1_min_sep', // Goes to Usage Check (Middle)
    no: 'continuite_amenagement_claire' // Goes to C check
  },
  croisez_moins_1_min_sep: { // Middle Usage Check
    id: 'croisez_moins_1_min_sep',
    text: 'Vous croisez moins d\'un usager par minute ?',
    yes: 'continuite_claire_prioritaire', // Merges to B check
    no: 'milieu_urbain_sep'
  },
  milieu_urbain_sep: { // Middle Urban Check
    id: 'milieu_urbain_sep',
    text: 'Est-ce en milieu urbain ?',
    yes: 'D',
    no: 'C'
  },

  // --- NOT SEPARATED BRANCH (NON) ---
  voie_rapide: {
    id: 'voie_rapide',
    text: 'L\'aménagement est bordé par une voie rapide ≥ 50km/h ?',
    yes: 'borded_arbres',
    no: 'vitesse_limitee_50'
  },
  borded_arbres: {
    id: 'borded_arbres',
    text: 'L\'aménagement est bordé d\'arbres, d\'un séparateur sonore ?',
    yes: 'zone_tampon_3m',
    no: 'croisez_moins_1_min_sep' // Merges to Middle Usage Check
  },
  zone_tampon_3m: {
    id: 'zone_tampon_3m',
    text: 'Y a t\'il une zone tampon de 3 m ?',
    definitions: ['zone tampon'],
    yes: 'continuite_claire_dedie', // Goes to A check
    no: 'continuite_claire_prioritaire' // Goes to B check
  },
  continuite_claire_dedie: { // A Check
    id: 'continuite_claire_dedie',
    text: 'La continuité est claire, avec un passage ou un feu dédié, séparé des véhicules motorisés et sans nid de poules ?',
    yes: 'A',
    no: 'continuite_claire_prioritaire' // Fallback to B check
  },

  vitesse_limitee_50: {
    id: 'vitesse_limitee_50',
    text: 'La vitesse est limitée à 50 km/h ou moins',
    yes: 'croisez_moins_1_min_vitesse',
    no: 'E'
  },
  croisez_moins_1_min_vitesse: { // Right Usage Check
    id: 'croisez_moins_1_min_vitesse',
    text: 'Vous croisez moins d\'un usager par minute ?',
    yes: 'voie_limitee_30',
    no: 'milieu_urbain_non_sep'
  },
  voie_limitee_30: {
    id: 'voie_limitee_30',
    text: 'Cette voie est elle limitée a 30km/h en double sens cyclable ?',
    yes: 'ralentisseurs_chicanes',
    no: 'milieu_urbain_non_sep'
  },
  ralentisseurs_chicanes: {
    id: 'ralentisseurs_chicanes',
    text: 'Il y a des ralentisseurs ou des chicanes ou une bonne visibilité ou l\'absence de stationnement ?',
    definitions: ['ralentisseurs', 'chicanes'],
    yes: 'continuite_claire_prioritaire', // Merges to B check
    no: 'milieu_urbain_non_sep'
  },
  milieu_urbain_non_sep: { // Right Urban Check
    id: 'milieu_urbain_non_sep',
    text: 'Est-ce en milieu urbain ?',
    yes: 'D',
    no: 'E'
  },

  // --- COMMON CHECKS ---
  continuite_claire_prioritaire: { // B Check
    id: 'continuite_claire_prioritaire',
    text: 'La continuité est claire, les usagers sont prioritaires (mais peuvent croiser des véhicules motorisés) ?',
    yes: 'B',
    no: 'continuite_amenagement_claire'
  },
  continuite_amenagement_claire: { // C Check
    id: 'continuite_amenagement_claire',
    text: 'La continuité de l\'aménagement reste claire ?',
    yes: 'C',
    no: 'D'
  }
}

export function getBestPossibleScore(currentId: string): Score | null {
  const scores: Score[] = ['A', 'B', 'C', 'D', 'E']

  function traverse(id: string | Score): Score {
    if (scores.includes(id as Score)) {
      return id as Score
    }

    const question = questions[id as string]
    if (!question) return 'E' // Should not happen

    const scoreYes = traverse(question.yes)
    const scoreNo = traverse(question.no)

    // Return the better score (lower index in scores array)
    const indexYes = scores.indexOf(scoreYes)
    const indexNo = scores.indexOf(scoreNo)

    return indexYes < indexNo ? scoreYes : scoreNo
  }

  return traverse(currentId)
}

export function getMaxRemainingDepth(currentId: string): number {
  const scores: Score[] = ['A', 'B', 'C', 'D', 'E']

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
