import type {
  StateChamber,
  FederalChamber,
  PartyOrderConfig,
} from "@/lib/types";

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

// Avail state config
// Keep alphabetical or sort in component usage
export const AVAILABLE_STATES = [
  // "AK",
  "AL",
  "AR",
  "AZ",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "IA",
  "ID",
  "IL",
  "IN",
  "KS",
  "KY",
  "LA",
  "MA",
  "MD",
  "ME",
  "MI",
  "MN",
  "MO",
  "MS",
  "MT",
  "NC",
  "ND",
  "NE",
  "NM",
  "NH",
  // "NJ",
  "NV",
  "NY",
  "OH",
  "OK",
  // "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  // "VA",
  "VT",
  // "WA",
  "WI",
  "WV",
] as const;

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

export const partyNames: Record<string, string> = {
  D: "Democrat",
  R: "Republican",
  I: "Independent",
  N: "Not Affiliated",
};
