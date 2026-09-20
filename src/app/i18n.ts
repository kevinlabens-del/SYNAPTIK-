import type { Lang, Domain, Mode } from "../cognitive/types";
export const names: Record<Lang, Record<Domain, string>> = {
  fr: {
    logic: "Logique",
    spatial: "Spatial",
    numeric: "Numérique",
    memory: "Mémoire",
    verbal: "Verbal",
    speed: "Vitesse",
  },
  en: {
    logic: "Logic",
    spatial: "Spatial",
    numeric: "Numeric",
    memory: "Memory",
    verbal: "Verbal",
    speed: "Speed",
  },
};

export const modeNames: Record<Lang, Record<Mode, string>> = {
  fr: { quick: "Rapide", standard: "Standard", deep: "Approfondi" },
  en: { quick: "Quick", standard: "Standard", deep: "Deep" },
};

export const deviceNames: Record<Lang, Record<string, string>> = {
  fr: { smartphone: "Smartphone", tablet: "Tablette", computer: "Ordinateur" },
  en: { smartphone: "Smartphone", tablet: "Tablet", computer: "Computer" },
};

export const domainActions: Record<Lang, string[]> = {
  fr: ["DÉDUIRE", "TOURNER", "RÉSOUDRE", "MÉMORISER", "RELIER", "TRAITER"],
  en: ["DEDUCE", "ROTATE", "RESOLVE", "RECALL", "CONNECT", "PROCESS"],
};

const subtypeNamesFR: Record<string, string> = {
  progression: "progression",
  proportion: "proportion",
  alternating: "alternance",
  conditional: "logique conditionnelle",
  "symbol-rule": "règle symbolique",
  order: "ordre",
  reflection: "réflexion",
  rotation: "rotation",
  "reverse-digits": "chiffres inversés",
  "digit-sequence": "séquence de chiffres",
  analogy: "analogie",
  relation: "relation",
  completion: "complétion",
  "symbol-match": "comparaison de symboles",
  "visual-search": "recherche visuelle",
  "two-back": "mémoire à 2 positions",
  "solid-cube-stacks": "empilements de cubes",
  "original-matrix": "matrice originale",
  categorization: "catégorisation",
  "contextual-meaning": "sens contextuel",
  "paired-symbol-memory": "mémoire de symboles appariés",
  "position-memory": "mémoire de positions",
};

export function subtypeName(lang: Lang, subtype: string) {
  if (lang === "fr") return subtypeNamesFR[subtype] ?? subtype.replaceAll("-", " ");
  return subtype.replaceAll("-", " ");
}

export const labels = {
  fr: {
    home: "Exploration",
    history: "Mes résultats",
    practice: "Entraînement",
    method: "Méthodologie",
    start: "COMMENCER L’ANALYSE",
    local: "DONNÉES LOCALES · AUCUNE TRANSMISSION",
    next: "Valider ma réponse",
    resume: "Reprendre mon évaluation",
    experimental: "ÉDITION EXPÉRIMENTALE / 01",
    back: "Retour",
    result: "Votre empreinte cognitive",
    print: "Exporter mon rapport / PDF",
  },
  en: {
    home: "Explore",
    history: "My results",
    practice: "Practice",
    method: "Methodology",
    start: "BEGIN ANALYSIS",
    local: "LOCAL FIRST · NO TRANSMISSION",
    next: "Confirm answer",
    resume: "Resume cognitive assessment",
    experimental: "EXPERIMENTAL EDITION / 01",
    back: "Back",
    result: "Your cognitive fingerprint",
    print: "Export report / PDF",
  },
};
