export const domains = [
  "logic",
  "spatial",
  "numeric",
  "memory",
  "verbal",
  "speed",
] as const;
export type Domain = (typeof domains)[number];
export type Lang = "fr" | "en";
export type Mode = "quick" | "standard" | "deep";
export const counts: Record<Mode, number> = {
  quick: 36,
  standard: 72,
  deep: 120,
};
export interface Item {
  id: string;
  domain: Domain;
  subtype: string;
  difficulty: number;
  discrimination: number;
  guessing: number;
  estimatedTime: number;
  prompt: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  tags: string[];
  version: string;
  sampleSize: number;
  successRate: number | null;
  averageResponseTime: number | null;
  pointBiserialCorrelation: number | null;
  enabled: boolean;
  lang: Lang;
  stimulus?: string;
  sequence?: string[];
  matrix?: string[][];
  cubes?: number[];
  exposureMs?: number;
  shape?: number[];
  rotation?: number;
  shapeCells?: number[];
  visualOptions?: "grid";
}
export interface Answer {
  itemId: string;
  correct: boolean;
  choice: number;
  duration: number;
  firstInteraction: number | null;
  changes: number;
  interrupted: boolean;
  theta: number;
}
export interface Session {
  id: string;
  seed: number;
  mode: Mode;
  lang: Lang;
  age: string;
  device: string;
  recent: boolean;
  consent: boolean;
  created: string;
  answers: Answer[];
  currentId?: string;
  interruptions: number;
  status: "active" | "complete";
  testVersion: string;
  calibrationStatus: "experimental" | "provisional" | "validated";
}
