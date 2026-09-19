import { random } from "../cognitive/engine";
import type { Item, Lang } from "../cognitive/types";
export function advancedItem(
  lang: Lang,
  domain: string,
  k: number,
): Partial<Item> & { correct?: string; others?: string[] } {
  const fr = lang === "fr",
    rng = random(73777 + k);
  if (domain === "memory" && k >= 50) {
    const sequence = Array.from(
      { length: 5 + (k % 3) },
      () => ["A", "B", "C", "D"][Math.floor(rng() * 4)],
    );
    const same = k % 2 === 0;
    sequence[sequence.length - 1] = same
      ? sequence[sequence.length - 3]
      : ["A", "B", "C", "D"].find((c) => c !== sequence[sequence.length - 3])!;
    return {
      subtype: "two-back",
      sequence,
      stimulus: undefined,
      shapeCells: undefined,
      visualOptions: undefined,
      exposureMs: sequence.length * 900,
      prompt: fr
        ? "Observe les lettres une par une. La dernière est-elle identique à celle présentée deux positions avant elle ?"
        : "Watch the letters one at a time. Is the last letter the same as the one two positions before it?",
      correct: fr ? (same ? "Oui" : "Non") : same ? "Yes" : "No",
      others: [fr ? (same ? "Non" : "Oui") : same ? "No" : "Yes"],
      explanation: sequence.join(" → "),
    };
  }
  if (domain === "spatial" && k >= 50) {
    const cubes = Array.from({ length: 4 }, () => 1 + Math.floor(rng() * 3));
    const n = cubes.reduce((a, b) => a + b);
    return {
      subtype: "solid-cube-stacks",
      cubes,
      shape: undefined,
      shapeCells: undefined,
      visualOptions: undefined,
      prompt: fr
        ? "Combien de cubes composent ces quatre colonnes pleines ? Il n’y a aucun vide sous un cube."
        : "How many cubes form these four solid columns? There are no gaps below a cube.",
      correct: String(n),
      others: [n - 2, n - 1, n + 1].map(String),
      explanation: cubes.join(" + ") + " = " + n,
    };
  }
  if (domain === "logic" && k >= 48) {
    const start = 1 + Math.floor((k-48)/4);
    const symbol=["●","◆","■","▲"][k%4];
    const matrix = Array.from({ length: 3 }, (_, r) =>
      Array.from({ length: 3 }, (_, c) =>
        r === 2 && c === 2 ? "?" : symbol.repeat(start + r + c),
      ),
    );
    const n = start + 4;
    return {
      subtype: "original-matrix",
      matrix,
      prompt: fr
        ? "Complète la matrice : quelle case poursuit la même règle dans chaque ligne et colonne ?"
        : "Complete the matrix: which cell continues the same rule in every row and column?",
      correct: symbol.repeat(n),
      others: [n - 2, n - 1, n + 1].map((v) => symbol.repeat(v)),
      explanation: fr
        ? "Chaque déplacement vers la droite ou vers le bas ajoute un point."
        : "Each step right or down adds one dot.",
    };
  }
  return {};
}
