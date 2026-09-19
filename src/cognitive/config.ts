import type { Domain } from "./types";
/** Engineering parameters, not calibrated population estimates. */
export const scoringConfig = {
  priorSD: 2,
  gridMin: -6,
  gridMax: 6,
  gridStep: 0.05,
  domainWeights: {
    logic: 1,
    spatial: 1,
    numeric: 1,
    memory: 1,
    verbal: 1,
    speed: 1,
  } satisfies Record<Domain, number>,
};
