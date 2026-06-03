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
  chamber: "upper" | "lower",
  state?: string
): Array<StatePartyInitial> {
  if (state === "AK") {
    const majorityCounts = table.reduce(
      (counts, row) => {
        if (row.chamber === chamber && row.isMajority) {
          if (row.party === "D") counts.D += 1;
          if (row.party === "R") counts.R += 1;
        }

        return counts;
      },
      { D: 0, R: 0 }
    );

    return majorityCounts.D > majorityCounts.R
      ? ["D", "R", "I", "3rd", "N"]
      : ["R", "D", "I", "3rd", "N"];
  }

  // For non-Alaska states, a single Democratic row identifies the chamber majority.
  const isMajorityD = table.find(
    (row) => row.party === "D" && row.chamber === chamber
  )?.isMajority;

  return isMajorityD ? ["D", "R", "I", "3rd", "N"] : ["R", "D", "I", "3rd", "N"];
}
