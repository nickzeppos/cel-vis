import { z } from "zod";
import {
  federalChamberInitialValidator,
  federalPartyInitialValidator,
  stateChamberValidator,
  statePartyInitialValidator,
  termValidator,
  congressionalDistrictValidator,
} from "@/lib/types";

// Shared
// Validators
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
// Types
export type ScoreMatrix = z.infer<typeof scoreMatrixValidator>;

// Federal
// Types
export type CongressList = z.infer<typeof congressListValidator>;
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
// Validators
export const congressListValidator = z.array(z.number());
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

// State
// Types
export type StateVisTable = z.infer<typeof stateVisTableValidator>;
export type StateVisTableResponse = z.infer<
  typeof stateVisTableResponseValidator
>;
export type StateVisScorecard = z.infer<typeof stateVisScorecardValidator>;
export type StateVisScorecardResponse = z.infer<
  typeof stateVisScorecardResponseValidator
>;
export type ValidTerm = z.infer<typeof validTermValidator>;
export type TermResponse = z.infer<typeof termResponseValidator>;

// Validators
export const validTermValidator = termValidator.merge(
  z.object({ chamber: stateChamberValidator })
);
export const termResponseValidator = z.array(termValidator);
export const stateVisScorecardValidator = z.object({
  overall: scoreMatrixValidator,
});

export const stateVisScorecardResponseValidator = z.object({
  data: stateVisScorecardValidator,
  slesId: z.number(),
  term: termValidator,
  validStateTerms: z.array(validTermValidator),
});
export const stateVisTableValidator = z.object({
  term: termValidator,
  chamber: stateChamberValidator,
  state: z.string(),
  slesId: z.number(),
  name: z.string(),
  party: statePartyInitialValidator,
  district: z.union([z.string(), z.number()]),
  sles: z.number(),
  benchmark: z.union([z.number(), z.null()]),
  partyRank: z.number(),
  partyTotal: z.number(),
  isMajority: z.boolean(),
});
export const stateVisTableResponseValidator = z.object({
  data: z.array(stateVisTableValidator),
  term: termValidator,
});
