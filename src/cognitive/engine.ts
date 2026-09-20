import { scoringConfig } from "./config";
import {
  domains,
  counts,
  type Item,
  type Answer,
  type Session,
  type Domain,
} from "./types";
export function random(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
export const logistic = (x: number) => 1 / (1 + Math.exp(-x));
export function probability(
  theta: number,
  item: Item,
  model: "1PL" | "2PL" | "3PL" = "3PL",
) {
  const c = model === "3PL" ? item.guessing : 0;
  return (
    c +
    (1 - c) *
      logistic(
        (model === "1PL" ? 1 : item.discrimination) * (theta - item.difficulty),
      )
  );
}
export function estimate(answers: Answer[], bank: Item[]) {
  const rows = answers
    .map((a) => ({ a, i: bank.find((i) => i.id === a.itemId) }))
    .filter((r) => r.i && !r.a.excluded);
  const grid = Array.from(
    {
      length:
        Math.round(
          (scoringConfig.gridMax - scoringConfig.gridMin) /
            scoringConfig.gridStep,
        ) + 1,
    },
    (_, k) => scoringConfig.gridMin + k * scoringConfig.gridStep,
  );
  const logs = grid.map(
    (t) =>
      -0.5 * (t / scoringConfig.priorSD) ** 2 +
      rows.reduce((sum, { a, i }) => {
        const p = probability(t, i!);
        return sum + Math.log(a.correct ? p : 1 - p);
      }, 0),
  );
  const max = Math.max(...logs);
  const w = logs.map((v) => Math.exp(v - max));
  const total = w.reduce((a, b) => a + b, 0);
  const theta = grid.reduce((s, t, k) => s + t * w[k], 0) / total;
  const variance =
    grid.reduce((s, t, k) => s + (t - theta) ** 2 * w[k], 0) / total;
  const quantile = (q: number) => {
    let cumulative = 0;
    for (let k = 0; k < grid.length; k++) {
      cumulative += w[k] / total;
      if (cumulative >= q) return grid[k];
    }
    return grid[grid.length - 1];
  };
  return {
    theta,
    se: Math.sqrt(variance),
    n: rows.length,
    lower: quantile(0.025),
    upper: quantile(0.975),
  };
}
export function cdf(z: number) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989422804014327 * Math.exp((-z * z) / 2);
  const p =
    1 -
    d *
      t *
      (0.31938153 +
        t *
          (-0.356563782 +
            t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return z >= 0 ? p : 1 - p;
}
export function domainAnswers(s: Session, b: Item[], d: Domain) {
  const ids = new Set(b.filter((i) => i.domain === d).map((i) => i.id));
  return s.answers.filter((a) => ids.has(a.itemId));
}
export function information(t: number, i: Item) {
  const l = logistic(i.discrimination * (t - i.difficulty));
  const p = probability(t, i);
  const dp = (1 - i.guessing) * i.discrimination * l * (1 - l);
  return (dp * dp) / (p * (1 - p));
}
export function itemFingerprint(i: Item) {
  return JSON.stringify([
    i.prompt,
    [...i.options].sort(),
    i.stimulus,
    i.shape,
    i.shapeCells,
    i.matrix,
    i.cubes,
    i.sequence,
  ]);
}
export function selectItem(s: Session, bank: Item[], previous: string[] = []) {
  const used = new Set(s.answers.map((a) => a.itemId));
  const usedContent = new Set(
    bank.filter((i) => used.has(i.id)).map(itemFingerprint),
  );
  const d = domains[s.answers.length % 6];
  const e = estimate(domainAnswers(s, bank, d), bank);
  const candidates = bank.filter(
    (i) =>
      i.enabled &&
      i.lang === s.lang &&
      i.domain === d &&
      !used.has(i.id) &&
      !usedContent.has(itemFingerprint(i)),
  );
  const modern = s.testVersion !== "1";
  const history = domainAnswers(s, bank, d);
  const families = new Map<string, number>();
  for (const a of history) {
    const family = bank.find((i) => i.id === a.itemId)?.subtype;
    if (family) families.set(family, (families.get(family) ?? 0) + 1);
  }
  const least = Math.min(
    ...candidates.map((i) => families.get(i.subtype) ?? 0),
  );
  const eligible = modern
    ? candidates.filter((i) => (families.get(i.subtype) ?? 0) === least)
    : candidates;
  const rng = random(s.seed + s.answers.length * 7919);
  return eligible
    .map((i) => ({
      i,
      v:
        (modern && history.length === 0
          ? -Math.abs(i.difficulty)
          : information(e.theta, i)) +
        rng() * 0.12 -
        (previous.includes(i.id) ? 0.4 : 0),
    }))
    .sort((a, b) => b.v - a.v)[0]?.i;
}
export function reliability(s: Session, b: Item[]) {
  const rapid = s.answers.filter(
    (a) =>
      a.duration <
      Math.min(
        1500,
        (b.find((i) => i.id === a.itemId)?.estimatedTime ?? 20) * 100,
      ),
  ).length;
  const interrupted = s.answers.filter((a) => a.interrupted).length;
  let comparablePairs = 0,
    irregularPairs = 0;
  for (const d of domains) {
    const rows = domainAnswers(s, b, d).map((a) => ({
      a,
      i: b.find((i) => i.id === a.itemId)!,
    }));
    for (const easy of rows)
      for (const hard of rows) {
        if (hard.i.difficulty - easy.i.difficulty >= 2) {
          comparablePairs++;
          if (!easy.a.correct && hard.a.correct) irregularPairs++;
        }
      }
  }

  const value = Math.max(
    0,
    Math.round(
      100 -
        (60 * rapid) / Math.max(1, s.answers.length) -
        Math.min(25, s.interruptions * 2) -
        (15 * interrupted) / Math.max(1, s.answers.length),
    ),
  );
  return {
    value,
    rapid,
    interrupted,
    comparablePairs,
    irregularPairs,
    label: value >= 85 ? "stable" : value >= 65 ? "caution" : "limited",
  };
}
export function report(s: Session, b: Item[]) {
  const rel = reliability(s, b);
  const profiles = domains.map((domain) => {
    const a = domainAnswers(s, b, domain).filter((a) => !a.excluded);
    const e = estimate(a, b);
    const inflation = 1 + (100 - rel.value) / 100;
    const interval = [
      100 +
        15 *
          (e.theta +
            ((s.testVersion !== "1" ? e.lower : e.theta - 1.96 * e.se) -
              e.theta) *
              inflation),
      100 +
        15 *
          (e.theta +
            ((s.testVersion !== "1" ? e.upper : e.theta + 1.96 * e.se) -
              e.theta) *
              inflation),
    ].map(Math.round);
    return {
      domain,
      ...e,
      limited: e.n < 12 || e.se > 0.65,
      score: Math.round(100 + 15 * e.theta),
      percentile: Math.round(cdf(e.theta) * 100),
      interval,
      correct: a.filter((x) => x.correct).length,
      meanTime: a.length ? a.reduce((v, x) => v + x.duration, 0) / a.length : 0,
      timingCV:
        a.length > 1
          ? (() => {
              const mean = a.reduce((v, x) => v + x.duration, 0) / a.length;
              return mean
                ? Math.sqrt(
                    a.reduce((v, x) => v + (x.duration - mean) ** 2, 0) /
                      a.length,
                  ) / mean
                : 0;
            })()
          : null,
      maxDifficulty: Math.max(
        -3,
        ...b
          .filter((i) => a.some((x) => x.itemId === i.id))
          .map((i) => i.difficulty),
      ),
    };
  });
  const totalWeight = domains.reduce(
    (sum, d) => sum + scoringConfig.domainWeights[d],
    0,
  );
  const theta =
    profiles.reduce(
      (v, p) => v + p.theta * scoringConfig.domainWeights[p.domain],
      0,
    ) / totalWeight;
  /* Conservative unknown cross-domain covariance: average SE, not independence. */ const se =
    (profiles.reduce(
      (v, p) => v + p.se * scoringConfig.domainWeights[p.domain],
      0,
    ) /
      totalWeight) *
    (1 + (100 - rel.value) / 100);
  return {
    limited: profiles.some((p) => p.limited),
    validCount: profiles.reduce((n, p) => n + p.n, 0),
    score: Math.round(100 + 15 * theta),
    percentile: Math.round(cdf(theta) * 100),
    interval: [
      Math.round(100 + 15 * (theta - 1.96 * se)),
      Math.round(100 + 15 * (theta + 1.96 * se)),
    ],
    profiles,
    reliability: rel,
    complete: s.answers.length === counts[s.mode],
  };
}
