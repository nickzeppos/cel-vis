import { z } from "zod";
import {
  federalChamberInitialValidator,
  federalPartyInitialValidator,
  stateChamberValidator,
  statePartyInitialValidator,
  stateTermValidator,
  congressionalDistrictValidator,
} from "@/lib/types";

// other
export type ScoreMatrix = z.infer<typeof scoreMatrixValidator>;
// Federal types
export type VisTable = z.infer<typeof visTableValidator>;
export type VisTableResponse = z.infer<typeof visTableResponseValidator>;
export type VisScorecard = z.infer<typeof visScorecardValidator>;
export type VisScorecardResponse = z.infer<
  typeof visScorecardResponseValidator
>;
export type CongressionalDistrict = z.infer<
  typeof congressionalDistrictValidator
>;
export type ValidCongress = z.infer<typeof validCongressValidator>;

// State types
export type StateVisTable = z.infer<typeof stateVisTableValidator>;
export type StateVisTableResponse = z.infer<
  typeof stateVisTableResponseValidator
>;
export type StateVisScorecard = z.infer<typeof stateVisScorecardValidator>;
export type StateVisScorecardResponse = z.infer<
  typeof stateVisScorecardResponseValidator
>;
export type StateTermResponse = z.infer<typeof stateTermResponseValidator>;

// State validators

export const scoreMatrixValidator = z.object({
  c_bill: z.number(),
  c_aic: z.number(),
  c_abc: z.number(),
  c_pass: z.number(),
  c_law: z.number(),
  s_bill: z.number(),
  s_aic: z.number(),
  s_abc: z.number(),
  s_pass: z.number(),
  s_law: z.number(),
  ss_bill: z.number(),
  ss_aic: z.number(),
  ss_abc: z.number(),
  ss_pass: z.number(),
  ss_law: z.number(),
});

export const validStateTermValidator = stateTermValidator.merge(
  z.object({ chamber: stateChamberValidator })
);
export const stateTermResponseValidator = z.array(stateTermValidator);
export const stateVisScorecardValidator = z.object({
  overall: scoreMatrixValidator,
});

export const stateVisScorecardResponseValidator = z.object({
  data: stateVisScorecardValidator,
  slesId: z.number(),
  term: stateTermValidator,
  validStateTerms: z.array(validStateTermValidator),
});
export const stateVisTableValidator = z.object({
  term: stateTermValidator,
  chamber: stateChamberValidator,
  state: z.string(),
  slesId: z.number(),
  name: z.string(),
  party: statePartyInitialValidator,
  district: z.number().nullable(),
  sles: z.number(),
  benchmark: z.number(),
  partyRank: z.number(),
  partyTotal: z.number(),
  isMajority: z.boolean(),
});
export const stateVisTableResponseValidator = z.object({
  data: z.array(stateVisTableValidator),
  term: stateTermValidator,
});

export const visTableValidator = z.object({
  congress: z.number(),
  chamber: federalChamberInitialValidator,
  state: z.string(),
  bioguide: z.string(),
  name: z.string(),
  party: federalPartyInitialValidator,
  district: z.number().nullable(),
  les: z.number(),
  benchmark: z.number(),
  partyRank: z.number(),
  partyTotal: z.number(),
  iles: z.record(z.number()),
});

export const visTableResponseValidator = z.object({
  congress: z.number(),
  availableIssues: z.array(z.string()),
  data: z.array(visTableValidator),
});

export const validCongressValidator = z.tuple([
  z.number(),
  federalChamberInitialValidator,
]);

export const visScorecardValidator = z.object({
  overall: scoreMatrixValidator,
  issues: z.record(scoreMatrixValidator),
  validCongresses: z.array(validCongressValidator),
});
export const visScorecardResponseValidator = z.object({
  congress: z.number(),
  bioguide: z.string(),
  data: visScorecardValidator,
});
