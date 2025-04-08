import type { StateTableResponse, StateScoreComponents, StateChamber } from "@/services/api";

export const table_data_GA_17_18: StateTableResponse = {
  stateTerm: {
    state: "GA",
    startYear: 2017,
    endYear: 2018
  },
  data: [
    {
      slesId: 3328,
      chamber: "lower" as StateChamber,
      name: "Bentley, Patty",
      party: "D",
      district: 139,
      sles: 0.980854630470276,
      benchmark: 1.002324232,
      rank: 73,
      total: 180
    },
    {
      slesId: 3330,
      chamber: "lower" as StateChamber,
      name: "Beskin, Beth",
      party: "R",
      district: 54,
      sles: 2.74675846099854,
      benchmark: 0.2323423,
      rank: 10,
      total: 180
    }
  ]
};

export const table_data_GA_15_16: StateTableResponse = {
  stateTerm: {
    state: "GA",
    startYear: 2015,
    endYear: 2016
  },
  data: [
    {
      slesId: 33,
      chamber: "upper" as StateChamber,
      name: "McUpper, Uppster",
      party: "D",
      district: 20,
      sles: 0,
      benchmark: 0.9428323,
      rank: 57,
      total: 57,
    },
    {
      slesId: 3330,
      chamber: "lower" as StateChamber,
      name: "Beskin, Beth",
      party: "R",
      district: 54,
      sles: 1.10782051086426,
      benchmark: 1.00232423,
      rank: 45,
      total: 180
    }
  ]
};

export const scorecard_3330_15_16: StateScoreComponents = {
  slesId: 3330,
  overall: {
    c_bill: 0,
    c_aic: 0,
    c_abc: 0,
    c_pass: 0,
    c_law: 0,
    s_bill: 12,
    s_aic: 4,
    s_abc: 2,
    s_pass: 1,
    s_law: 1,
    ss_bill: 2,
    ss_aic: 1,
    ss_abc: 1,
    ss_pass: 0,
    ss_law: 0
  },
  validStateTerms: [
    {
      state: "GA",
      startYear: 2015,
      endYear: 2016,
      chamber: "lower" as StateChamber
    },
    {
      state: "GA",
      startYear: 2017,
      endYear: 2018,
      chamber: "lower" as StateChamber
    }
  ]
};

export const scorecard_3330_17_18: StateScoreComponents = {
  slesId: 3330,
  overall: {
    c_bill: 1,
    c_aic: 1,
    c_abc: 1,
    c_pass: 1,
    c_law: 0,
    s_bill: 15,
    s_aic: 8,
    s_abc: 5,
    s_pass: 3,
    s_law: 2,
    ss_bill: 3,
    ss_aic: 2,
    ss_abc: 2,
    ss_pass: 1,
    ss_law: 1
  },
  validStateTerms: [
    {
      state: "GA",
      startYear: 2015,
      endYear: 2016,
      chamber: "lower" as StateChamber
    },
    {
      state: "GA",
      startYear: 2017,
      endYear: 2018,
      chamber: "lower" as StateChamber
    }
  ]
};