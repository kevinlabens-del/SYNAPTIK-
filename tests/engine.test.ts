import { describe, it, expect } from "vitest";
import "fake-indexeddb/auto";
import { makeBank } from "../src/exercises/bank";
import {
  cdf,
  estimate,
  selectItem,
  report,
  probability,
  random,
} from "../src/cognitive/engine";
import type { Session, Answer } from "../src/cognitive/types";
import { save, list, remove, clear } from "../src/storage/store";
const bank = makeBank("fr");
const fresh = (): Session => ({
  id: "test",
  seed: 10,
  mode: "quick",
  lang: "fr",
  age: "25–44",
  device: "computer",
  recent: false,
  consent: false,
  created: new Date().toISOString(),
  answers: [],
  interruptions: 0,
  status: "active",
  testVersion: "1",
  calibrationStatus: "experimental",
});
function response(id: string, correct: boolean): Answer {
  return {
    itemId: id,
    correct,
    choice: 0,
    duration: 10000,
    firstInteraction: 1000,
    changes: 0,
    interrupted: false,
    theta: 0,
  };
}
describe("psychometric engine", () => {
  it("normal CDF is symmetric, monotonic and has known quantiles", () => {
    expect(cdf(0)).toBeCloseTo(0.5, 6);
    expect(cdf(1.96)).toBeCloseTo(0.975, 3);
    expect(cdf(-1)).toBeCloseTo(1 - cdf(1), 6);
    expect(cdf(3)).toBeGreaterThan(cdf(2));
  });
  it("has 360 enabled reproducible valid items per language", () => {
    for (const lang of ["fr", "en"] as const) {
      const b = makeBank(lang);
      expect(b).toHaveLength(360);
      expect(new Set(b.map((i) => i.id)).size).toBe(360);
      expect(b).toEqual(makeBank(lang));
      for (const i of b) {
        expect(i.options.length).toBeGreaterThanOrEqual(2);
        expect(i.correctAnswer).toBeGreaterThanOrEqual(0);
        expect(i.correctAnswer).toBeLessThan(i.options.length);
        expect(new Set(i.options).size).toBe(i.options.length);
      }
    }
  });
  it("all correct raises capacity, all wrong lowers it", () => {
    const b = bank.filter((i) => i.domain === "numeric").slice(0, 20);
    expect(
      estimate(
        b.map((i) => response(i.id, true)),
        bank,
      ).theta,
    ).toBeGreaterThan(1);
    expect(
      estimate(
        b.map((i) => response(i.id, false)),
        bank,
      ).theta,
    ).toBeLessThan(-1);
  });
  it("narrows posterior uncertainty with observations", () => {
    const a = bank.slice(0, 24).map((i, k) => response(i.id, k % 3 !== 0));
    expect(estimate(a, bank).se).toBeLessThan(estimate([], bank).se);
  });
  it("reproducible selection never repeats within a session and balances domains", () => {
    const s = fresh();
    const counts: Record<string, number> = {};
    for (let n = 0; n < 36; n++) {
      const i = selectItem(s, bank)!;
      expect(i).toEqual(selectItem(s, bank));
      expect(s.answers.some((a) => a.itemId === i.id)).toBe(false);
      counts[i.domain] = (counts[i.domain] ?? 0) + 1;
      s.answers.push(response(i.id, true));
    }
    expect(Object.values(counts)).toEqual([6, 6, 6, 6, 6, 6]);
  });
  it("selects more difficult items after success", () => {
    const s = fresh();
    s.answers = bank
      .filter((i) => i.domain === "logic")
      .slice(0, 24)
      .map((i) => response(i.id, true));
    const high = selectItem(s, bank)!;
    s.answers = s.answers.map((a) => ({ ...a, correct: false }));
    const low = selectItem(s, bank)!;
    expect(high.difficulty).toBeGreaterThan(low.difficulty);
  });
  it("supports 1PL, 2PL and 3PL", () => {
    const i = bank[0];
    expect(probability(i.difficulty, i, "1PL")).toBe(0.5);
    expect(probability(i.difficulty, i, "2PL")).toBe(0.5);
    expect(probability(i.difficulty, i, "3PL")).toBeGreaterThan(0.5);
  });
  it("rapid errors never increase score; interruptions widen interval", () => {
    const s = fresh();
    s.answers = bank.slice(0, 36).map((i) => response(i.id, false));
    const a = report(s, bank);
    s.answers = s.answers.map((a) => ({ ...a, duration: 100 }));
    s.interruptions = 10;
    const b = report(s, bank);
    expect(b.score).toBe(a.score);
    expect(b.reliability.value).toBeLessThan(a.reliability.value);
    expect(b.interval[1] - b.interval[0]).toBeGreaterThan(
      a.interval[1] - a.interval[0],
    );
  });
  it("has deterministic seeded randomness", () => {
    const a = random(1),
      b = random(1);
    expect(Array.from({ length: 20 }, () => a())).toEqual(
      Array.from({ length: 20 }, () => b()),
    );
  });
});
describe("persistence", () => {
  it("saves, restores interrupted session and deletes data", async () => {
    await clear();
    const s = fresh();
    s.currentId = bank[0].id;
    s.interruptions = 3;
    s.answers = [response(bank[3].id, true)];
    await save(s);
    expect(await list()).toEqual([s]);
    await remove(s.id);
    expect(await list()).toEqual([]);
    await save(s);
    await clear();
    expect(await list()).toEqual([]);
  });
});

import { transformGrid } from "../src/exercises/visual";
describe("visual geometry", () => {
  it("four rotations and two reflections restore the shape", () => {
    for (const cells of [
      [0, 3, 6, 7],
      [1, 2, 4],
      [0, 1, 8],
    ]) {
      expect(transformGrid(cells, 4)).toEqual([...cells].sort((a, b) => a - b));
      expect(transformGrid(transformGrid(cells, 0, true), 0, true)).toEqual(
        [...cells].sort((a, b) => a - b),
      );
    }
  });
});

import { itemFingerprint } from "../src/cognitive/engine";
describe("item exposure integrity", () => {
  it("provides at least 300 distinct exercises and no identical content in Deep", () => {
    expect(new Set(bank.map(itemFingerprint)).size).toBeGreaterThanOrEqual(300);
    const s = fresh();
    s.mode = "deep";
    const seen = new Set<string>();
    for (let n = 0; n < 120; n++) {
      const i = selectItem(s, bank);
      expect(i).toBeDefined();
      const signature = itemFingerprint(i!);
      expect(seen.has(signature)).toBe(false);
      seen.add(signature);
      s.answers.push(response(i!.id, n % 3 !== 0));
    }
  });
});

describe("version 1.1 measurement integrity", () => {
  it("excluded interrupted answers contribute neither information nor success", () => {
    const item = bank[0];
    const excluded = {
      ...response(item.id, true),
      interrupted: true,
      excluded: true,
    };
    expect(estimate([excluded], bank)).toEqual(estimate([], bank));
    const s = fresh();
    s.testVersion = "1.1";
    s.answers = [excluded];
    expect(report(s, bank).validCount).toBe(0);
    expect(report(s, bank).profiles[0].correct).toBe(0);
  });
  it("posterior quantiles enclose the estimate and capture asymmetry", () => {
    const e = estimate(
      bank
        .filter((i) => i.domain === "logic")
        .slice(0, 6)
        .map((i) => response(i.id, true)),
      bank,
    );
    expect(e.lower).toBeLessThan(e.theta);
    expect(e.upper).toBeGreaterThan(e.theta);
    expect(Math.abs(e.upper - e.theta - (e.theta - e.lower))).toBeGreaterThan(
      0.001,
    );
  });
  it("starts at medium difficulty and covers all available families before repeating", () => {
    const s = fresh();
    s.testVersion = "1.1";
    const families = new Map<string, Set<string>>();
    for (let n = 0; n < 36; n++) {
      const item = selectItem(s, bank)!;
      if (n < 6) expect(item.difficulty).toBe(0);
      const seen = families.get(item.domain) ?? new Set<string>();
      const available = new Set(
        bank.filter((i) => i.domain === item.domain).map((i) => i.subtype),
      );
      if (seen.size < available.size)
        expect(seen.has(item.subtype)).toBe(false);
      seen.add(item.subtype);
      families.set(item.domain, seen);
      s.answers.push(response(item.id, true));
    }
    expect(report(s, bank).limited).toBe(true);
  });
  it("retains legacy symmetric domain intervals", () => {
    const s = fresh();
    s.answers = bank.slice(0, 6).map((i) => response(i.id, true));
    const p = report(s, bank).profiles[0];
    expect(p.interval).toEqual([
      Math.round(100 + 15 * (p.theta - 1.96 * p.se)),
      Math.round(100 + 15 * (p.theta + 1.96 * p.se)),
    ]);
  });
});
