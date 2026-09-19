import type { Lang } from "../cognitive/types";
import { random } from "../cognitive/engine";
export function transformGrid(cells: number[], turns: number, mirror = false) {
  return cells
    .map((c) => {
      let x = c % 3,
        y = Math.floor(c / 3);
      if (mirror) x = 2 - x;
      for (let n = 0; n < turns; n++) [x, y] = [2 - y, x];
      return y * 3 + x;
    })
    .sort((a, b) => a - b);
}
export function spatialPattern(lang: Lang, k: number) {
  const rng = random(8137 + k);
  const shapes = [
    [0, 3, 6, 7],
    [0, 1, 4, 7],
    [0, 1, 2, 5],
    [1, 3, 4, 6],
    [0, 3, 4, 5],
    [0, 1, 3, 7],
  ];
  const cells = transformGrid(shapes[k % shapes.length], Math.floor(rng() * 4));
  const mirror = k % 2 === 0;
  const turns = 1 + (k % 3);
  const correctCells = transformGrid(cells, mirror ? 0 : turns, mirror);
  const correct = correctCells.join(",");
  const candidates = [
    ...Array.from({ length: 4 }, (_, j) => transformGrid(cells, j).join(",")),
    ...Array.from({ length: 4 }, (_, j) =>
      transformGrid(cells, j, true).join(","),
    ),
  ];
  return {
    shapeCells: cells,
    visualOptions: "grid" as const,
    correct,
    others: [...new Set(candidates)].filter((v) => v !== correct).slice(0, 3),
    subtype: mirror ? "shape-reflection" : "shape-rotation",
    prompt:
      lang === "fr"
        ? mirror
          ? "Quelle forme correspond au reflet gauche-droite du modèle ?"
          : `Quelle forme correspond au modèle tourné de ${turns * 90}° dans le sens horaire ?`
        : mirror
          ? "Which shape is the left-right mirror of the model?"
          : `Which shape matches the model rotated ${turns * 90}° clockwise?`,
    explanation:
      lang === "fr"
        ? "La forme est transformée sans déplacer les cases entre elles."
        : "The shape is transformed without changing its internal arrangement.",
  };
}
export function memoryVariant(lang: Lang, k: number) {
  const rng = random(9917 + k);
  const fr = lang === "fr";
  const length = 3 + (k % 4);
  if (k % 2 === 0) {
    const seq = Array.from(
      { length },
      (_, i) =>
        String.fromCharCode(65 + Math.floor(rng() * 8)) +
        String((i + Math.floor(rng() * 9)) % 10),
    );
    const correct = seq.join(" · ");
    return {
      subtype: "paired-symbol-memory",
      stimulus: correct,
      exposureMs: 2000 + length * 600,
      prompt: fr
        ? "Retrouve les associations lettre-chiffre dans leur ordre initial."
        : "Recall the letter-number pairs in their original order.",
      correct,
      others: [0, 1, 2].map((j) =>
        seq
          .map((v, i) => (i === j ? v[0] + String((Number(v[1]) + 1) % 10) : v))
          .join(" · "),
      ),
      explanation: correct,
    };
  }
  const positions = Array.from({ length: 9 }, (_, i) => i)
    .map((v) => ({ v, r: rng() }))
    .sort((a, b) => a.r - b.r)
    .slice(0, length)
    .map((o) => o.v)
    .sort((a, b) => a - b);
  const correct = positions.join(",");
  const others = [1, 2, 3].map((offset) =>
    positions
      .map((v) => (v + offset) % 9)
      .sort((a, b) => a - b)
      .join(","),
  );
  return {
    subtype: "position-memory",
    shapeCells: positions,
    visualOptions: "grid" as const,
    exposureMs: 2200 + length * 500,
    prompt: fr
      ? "Mémorise les cases éclairées, puis retrouve le même motif."
      : "Memorize the lit cells, then identify the same pattern.",
    correct,
    others,
    explanation: fr
      ? "Le motif conserve exactement les mêmes positions."
      : "The pattern retains exactly the same positions.",
  };
}
