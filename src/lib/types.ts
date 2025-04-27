import { StateVisTable, VisTable } from "@/services/api.types";
import { z } from "zod";

export type FederalChamber = z.infer<typeof federalChamberValidator>;
export type FederalChamberInitial = z.infer<
  typeof federalChamberInitialValidator
>;
export type StateChamber = z.infer<typeof stateChamberValidator>;
export type Chamber = z.infer<typeof chamberValidator>;
export type ViewLevel = z.infer<typeof viewLevelValidator>;
export type FederalPartyInitial = z.infer<typeof federalPartyInitialValidator>;
export type StatePartyInitial = z.infer<typeof statePartyInitialValidator>;
export type Term = z.infer<typeof termValidator>;
export type CongressionalDistrict = z.infer<
  typeof congressionalDistrictValidator
>;

export const federalChamberValidator = z.union([
  z.literal("house"),
  z.literal("senate"),
]);
export const federalChamberInitialValidator = z.union([
  z.literal("H"),
  z.literal("S"),
]);
export const stateChamberValidator = z.union([
  z.literal("upper"),
  z.literal("lower"),
]);
export const chamberValidator = z.union([
  federalChamberValidator,
  stateChamberValidator,
]);
export const viewLevelValidator = z.union([
  z.literal("federal"),
  z.literal("state"),
]);
export const majorPartyInitialValidator = z.union([
  z.literal("D"),
  z.literal("R"),
]);
export const federalPartyInitialValidator = z.union([
  majorPartyInitialValidator,
  z.literal("I"),
]);
export const statePartyInitialValidator = z.union([
  majorPartyInitialValidator,
  z.literal("3rd"),
]);
export const termValidator = z.object({
  startYear: z.number(),
  endYear: z.number(),
});
export const congressionalDistrictValidator = z.object({
  state: z.string(),
  district: z.number(),
});

export type SortField =
  | "name"
  | "rank"
  | "score"
  | "state"
  | "party"
  | "district";
export type SortDirection = "asc" | "desc";

export type ChamberParties = {
  H: string[];
  S: string[];
};

export type PartyOrderConfig = [number, ChamberParties][];

export type ViewRoute =
  | { type: "federal:table" }
  | { type: "federal:scorecard"; legislator: VisTable }
  | { type: "state:table" }
  | { type: "state:scorecard"; legislator: StateVisTable; term: string }
  | { type: "perf"; bioguideID: string; congress: number };

export type GroupedFederalRow =
  | { type: "group"; party: string }
  | { type: "legislator"; data: VisTable };

export type GroupedStateRow =
  | { type: "group"; party: string }
  | { type: "legislator"; data: StateVisTable };
