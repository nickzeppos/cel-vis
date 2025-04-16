import { StateVisTable } from "@/services/api.types";
import { PartyOrderConfig, StatePartyInitial } from "./types";

export const partyOrder: PartyOrderConfig = [
  [93, { H: ["D", "R"], S: ["D", "R", "I"] }],
  [94, { H: ["D", "R"], S: ["D", "R", "I"] }],
  [95, { H: ["D", "R"], S: ["D", "R", "I"] }],
  [96, { H: ["D", "R"], S: ["D", "R", "I"] }],
  [97, { H: ["D", "R"], S: ["R", "D", "I"] }],
  [98, { H: ["D", "R"], S: ["R", "D", "I"] }],
  [99, { H: ["D", "R"], S: ["R", "D"] }],
  [100, { H: ["D", "R"], S: ["D", "R"] }],
  [101, { H: ["D", "R", "I"], S: ["D", "R"] }],
  [102, { H: ["D", "R", "I"], S: ["D", "R"] }],
  [103, { H: ["D", "R", "I"], S: ["D", "R"] }],
  [104, { H: ["R", "D", "I"], S: ["R", "D"] }],
  [105, { H: ["R", "D", "I"], S: ["R", "D"] }],
  [106, { H: ["R", "D", "I"], S: ["R", "D"] }],
  [107, { H: ["R", "D", "I"], S: ["D", "R", "I"] }],
  [108, { H: ["R", "D", "I"], S: ["R", "D", "I"] }],
  [109, { H: ["R", "D", "I"], S: ["R", "D", "I"] }],
  [110, { H: ["D", "R"], S: ["D", "R", "I"] }],
  [111, { H: ["D", "R"], S: ["D", "R", "I"] }],
  [112, { H: ["R", "D"], S: ["D", "R", "I"] }],
  [113, { H: ["R", "D"], S: ["D", "R", "I"] }],
  [114, { H: ["R", "D"], S: ["R", "D", "I"] }],
  [115, { H: ["R", "D"], S: ["R", "D", "I"] }],
  [116, { H: ["D", "R"], S: ["R", "D", "I"] }],
  [117, { H: ["D", "R"], S: ["D", "R", "I"] }],
  [118, { H: ["R", "D"], S: ["D", "R", "I"] }],
];

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

  return isMajorityD ? ["D", "R", "3rd"] : ["R", "D", "3rd"];
}
