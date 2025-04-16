import type { StateChamber, FederalChamber } from "@/lib/types";

export const chamberLabels: {
  federal: Record<FederalChamber, string>;
  state: Record<StateChamber, string>;
} = {
  federal: {
    house: "House",
    senate: "Senate",
  },
  state: {
    lower: "Lower",
    upper: "Upper",
  },
} as const;

export const AVAILABLE_STATES = ["GA", "MT"] as const;
