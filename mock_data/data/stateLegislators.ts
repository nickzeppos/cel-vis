import type { StateVisTableResponse, StateVisScorecardResponse } from '@/services/api.types'

export const table_data_GA_17_18: StateVisTableResponse = {
  term: {
    startYear: 2017,
    endYear: 2018
  },
  data: [
    {
      slesId: 3328,
      chamber: "lower",
      state: "GA",
      name: "Bentley, Patty",
      party: "D",
      district: 139,
      sles: 0.980854630470276,
      benchmark: 1.002324232,
      partyRank: 73,
      partyTotal: 85,
      isMajority: false,
      term: {
        startYear: 2017,
        endYear: 2018
      }
    },
    {
      slesId: 3330,
      chamber: "lower",
      state: "GA",
      name: "Beskin, Beth",
      party: "R",
      district: 54,
      sles: 2.74675846099854,
      benchmark: 0.2323423,
      partyRank: 10,
      partyTotal: 123,
      isMajority: true,
      term: {
        startYear: 2017,
        endYear: 2018
      }
    }
  ]
};

export const table_data_GA_15_16: StateVisTableResponse = {
  term: {  
    startYear: 2015,
    endYear: 2016
  },
  data: [
    {
      slesId: 33,
      chamber: "upper",
      state: "GA",
      name: "McUpper, Uppster",
      party: "D",
      district: 20,
      sles: 0,
      benchmark: 0.9428323,
      partyRank: 56,
      partyTotal: 57,
      isMajority: false,
      term: {
        startYear: 2015,
        endYear: 2016
      }
    },
    {
      slesId: 3330,
      chamber: "lower",
      state: "GA",
      name: "Beskin, Beth",
      party: "R",
      district: 54,
      sles: 1.10782051086426,
      benchmark: 1.00232423,
      partyRank: 45,
      partyTotal: 58,
      isMajority: true,
      term: {
        startYear: 2015,
        endYear: 2016
      }
    }
  ]
};

export const scorecard_3330_15_16: StateVisScorecardResponse = {
  slesId: 3330,
  term: {
    startYear: 2015,
    endYear: 2016
  },
  validStateTerms: [
    {   
      startYear: 2015,
      endYear: 2016,
      chamber: "lower"
    },
    {
      startYear: 2017,
      endYear: 2018,
      chamber: "lower"
    }
  ],
  data: {
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
    }
  }
};

export const scorecard_3330_17_18: StateVisScorecardResponse = {
  slesId: 3330,
  term: {
    startYear: 2017,
    endYear: 2018
  },
  validStateTerms: [
    {
      startYear: 2015,
      endYear: 2016,
      chamber: "lower"
    },
    {    
      startYear: 2017,
      endYear: 2018,
      chamber: "lower"
    }
  ],
  data: {
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
    }
  }
};