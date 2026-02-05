import { StateVisTable } from "@/services/api.types";
import { partyOrder } from "./consts";
import { StatePartyInitial } from "./types";

export function getFederalPartyOrder(
  congress: number,
  chamber: "house" | "senate"
): string[] {
  const config = partyOrder.find(([c]) => c === congress);
  if (!config) return ["D", "R", "I"]; // Default order
  return config[1][chamber === "house" ? "H" : "S"];
}

export function getStatePartyOrder(
  table: StateVisTable[],
  chamber: "upper" | "lower"
): Array<StatePartyInitial> {
  // acquire the isMajority value for one D chamber upper row and one D chamber upper row
  const isMajorityD = table.find(
    (row) => row.party === "D" && row.chamber === chamber
  )?.isMajority;

  return isMajorityD ? ["D", "R", "I", "3rd", "N"] : ["R", "D", "I", "3rd", "N"];
}
