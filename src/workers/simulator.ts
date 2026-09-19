import { makeBank } from "../exercises/bank";
import { probability, random, selectItem, report } from "../cognitive/engine";
import type { Session } from "../cognitive/types";
self.onmessage = (event: MessageEvent<{ theta: number; n: number }>) => {
  const theta = Math.max(-3, Math.min(3, event.data.theta)),
    n = Math.max(1, Math.min(5000, event.data.n));
  const bank = makeBank("fr"),
    scores: number[] = [];
  for (let k = 0; k < n; k++) {
    const rng = random(k + 829);
    const s: Session = {
      id: String(k),
      seed: k + 113,
      mode: "quick",
      lang: "fr",
      age: "25–44",
      device: "simulated",
      recent: false,
      consent: false,
      created: "",
      answers: [],
      interruptions: 0,
      status: "complete",
      testVersion: "1.1",
      calibrationStatus: "experimental",
    };
    for (let j = 0; j < 36; j++) {
      const item = selectItem(s, bank)!;
      s.answers.push({
        itemId: item.id,
        choice: 0,
        correct: rng() < probability(theta, item),
        duration: 10000,
        firstInteraction: 1000,
        changes: 0,
        interrupted: false,
        theta: 0,
      });
    }
    scores.push((report(s, bank).score - 100) / 15);
    if (k % 50 === 0) self.postMessage({ progress: k / n });
  }
  self.postMessage({
    progress: 1,
    mean: scores.reduce((a, b) => a + b) / n,
    rmse: Math.sqrt(scores.reduce((a, b) => a + (b - theta) ** 2, 0) / n),
    histogram: Array.from({ length: 12 }, (_, i) => ({
      from: -3 + i * 0.5,
      n: scores.filter((s) => s >= -3 + i * 0.5 && s < -3 + (i + 1) * 0.5)
        .length,
    })),
    n,
  });
};
