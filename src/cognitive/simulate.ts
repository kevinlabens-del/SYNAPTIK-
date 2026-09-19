import { makeBank } from "../exercises/bank";
import { random, selectItem, probability, report } from "./engine";
import { counts, type Session } from "./types";
const bank = makeBank("fr");
const rows = [];
for (let ability = -3; ability <= 3; ability++) {
  const estimates = [];
  let covered = 0;
  for (let k = 0; k < 400; k++) {
    const rng = random(339 + k + 1000 * (ability + 3));
    const s: Session = {
      id: String(k),
      seed: k + 100,
      mode: "quick",
      lang: "fr",
      age: "25–44",
      device: "simulation",
      recent: false,
      consent: false,
      created: "",
      answers: [],
      interruptions: 0,
      status: "active",
      testVersion: "1",
      calibrationStatus: "experimental",
    };
    for (let n = 0; n < counts.quick; n++) {
      const i = selectItem(s, bank)!;
      s.answers.push({
        itemId: i.id,
        correct: rng() < probability(ability, i),
        choice: 0,
        duration: 15000,
        firstInteraction: 1000,
        changes: 0,
        interrupted: false,
        theta: 0,
      });
    }
    const r = report(s, bank);
    estimates.push((r.score - 100) / 15);
    if (
      r.interval[0] <= 100 + 15 * ability &&
      r.interval[1] >= 100 + 15 * ability
    )
      covered++;
  }
  rows.push({
    ability,
    n: estimates.length,
    mean: estimates.reduce((a, b) => a + b) / estimates.length,
    rmse: Math.sqrt(
      estimates.reduce((a, b) => a + (b - ability) ** 2, 0) / estimates.length,
    ),
    coverage: covered / estimates.length,
  });
}
console.log(
  JSON.stringify(
    {
      warning:
        "Synthetic model recovery only, NOT human validation. Strong prior shrinkage expected at extremes with Quick.",
      sessions: 2800,
      rows,
    },
    null,
    2,
  ),
);
