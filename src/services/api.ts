/**
 * API service for The Lawmakers API (Mock Version)
 */

import {
  G000559_118_scorecard,
  G000559_117_scorecard,
  table_data_117,
  table_data_118,
} from "@/data/legislators";
import { table_data_GA_15_16, table_data_GA_17_18, scorecard_3330_15_16, scorecard_3330_17_18 } from "@/data/stateLegislators";
import { zips } from "@/data/zip";

export type TableResponse = {
  data: Array<TableRow>;
  congress: number;
};

export type TableRow = {
  chamber: string;
  bioguide: string;
  name: string;
  party: string;
  state: string;
  district?: number;
  les: number;
  benchmark: number;
  partyRank: number;
  partyTotal: number;
  iles: {
    [issue: string]: number;
  };
};

export type CongressionalDistrict = {
  state: string;
  district: number;
};

export type ValidCongress = [number, string]; // [congress, chamber]

export type ScoreMatrix = {
  c_bill: number;
  c_aic: number;
  c_abc: number;
  c_pass: number;
  c_law: number;
  s_bill: number;
  s_aic: number;
  s_abc: number;
  s_pass: number;
  s_law: number;
  ss_bill: number;
  ss_aic: number;
  ss_abc: number;
  ss_pass: number;
  ss_law: number;
};

export type ScoreComponents = {
  overall: ScoreMatrix;
  issues: {
    [issue: string]: ScoreMatrix;
  };
  validCongresses: Array<ValidCongress>;
};

export type ScoreComponentsResponse = {
  data: ScoreComponents;
  congress: number;
  bioguide: string;
};

export type StateChamber = 'upper' | 'lower';

export type ValidStateTerm = {
  state: string;
  startYear: number;
  endYear: number;
  chamber: StateChamber;
};

export type StateTableRow = {
  slesId: number;
  chamber: StateChamber;
  name: string;
  party: string;
  district: number;
  benchmark: number;
  sles: number;
  rank: number;
  total: number;
};

export type StateTableResponse = {
  stateTerm: {
    state: string;
    startYear: number;
    endYear: number;
  };
  data: StateTableRow[];
};

export type StateScoreComponents = {
  slesId: number;
  overall: ScoreMatrix;
  validStateTerms: ValidStateTerm[];
};

export type StateScoreComponentsResponse = {
  data: StateScoreComponents;
  slesId: number;
  term: {
    state: string;
    startYear: number;
    endYear: number;
  };
};

/**
 * Returns a mock list of available Congress sessions
 * @returns Promise<Array<number>> Array of Congress numbers (e.g., [117, 118])
 */
export async function getCongressList(): Promise<Array<number>> {
  // Return mock data that matches what we saw from the real API
  const congresses = [
    93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108,
    109, 110, 111, 112, 113, 114, 115, 116, 117, 118,
  ];
  const sorted = congresses.sort((a, b) => b - a);
  return Promise.resolve(sorted);
}

/**
 * Returns mock legislator data for a specific congress
 * @param congress The congress number to fetch data for
 * @returns Promise<TableResponse> The legislator data
 */
export async function getTableData(congress: number): Promise<TableResponse> {
  if (congress === 118) {
    return Promise.resolve(table_data_118);
  }

  if (congress === 117) {
    return Promise.resolve(table_data_117);
  }
  return Promise.resolve({
    data: [],
    congress: congress,
  });
}

/**
 * Returns mock score components data for a specific congress and bioguide ID
 * @param congress The congress number to fetch data for
 * @param bioguide The bioguide ID of the legislator
 * @returns Promise<ScoreComponentsResponse> The score components data
 */
export async function getScoreComponentsData(
  congress: number,
  bioguide: string
): Promise<ScoreComponentsResponse> {
  if (bioguide === "G000559") {
    if (congress === 118) {
      return Promise.resolve(G000559_118_scorecard);
    }
    if (congress === 117) {
      return Promise.resolve(G000559_117_scorecard);
    }
  }
  
  return Promise.resolve({
    data: {
      overall: {
        c_bill: 0,
        c_aic: 0,
        c_abc: 0,
        c_pass: 0,
        c_law: 0,
        s_bill: 0,
        s_aic: 0,
        s_abc: 0,
        s_pass: 0,
        s_law: 0,
        ss_bill: 0,
        ss_aic: 0,
        ss_abc: 0,
        ss_pass: 0,
        ss_law: 0,
      },
      issues: {},
      validCongresses: [],
    },
    congress: congress,
    bioguide: bioguide,
  });
}

/**
 * Mock function for looking up congressional districts
 * @param zip The ZIP code to look up
 * @returns Promise<CongressionalDistrict | undefined> The congressional district info, or undefined if not found
 */
export async function getDistrictForZip(
  zip: string
): Promise<CongressionalDistrict | undefined> {
  const cd = zips[zip];
  if (cd) {
    return Promise.resolve(cd);
  }
  return Promise.resolve(undefined);
}

/**
 * Returns mock state legislator data for a specific state and term
 * @param state The state abbreviation
 * @param startYear The start year of the term
 * @param endYear The end year of the term
 * @returns Promise<StateTableResponse> The state legislator data
 */
export async function getStateTableData(
  state: string,
  startYear: number,
  endYear: number
): Promise<StateTableResponse> {
  if (state === "GA") {
    if (startYear === 2017 && endYear === 2018) {
      return Promise.resolve(table_data_GA_17_18);
    }
    if (startYear === 2015 && endYear === 2016) {
      return Promise.resolve(table_data_GA_15_16);
    }
  }
  
  return Promise.resolve({
    stateTerm: {
      state,
      startYear,
      endYear
    },
    data: []
  });
}

/**
 * Returns mock score components data for a specific state legislator
 * @param slesId The unique identifier for the state legislator
 * @param startYear The start year of the term
 * @param endYear The end year of the term
 * @returns Promise<StateScoreComponentsResponse> The state legislator's score components
 */
export async function getStateScoreComponentsData(
  slesId: number,
  startYear: number,
  endYear: number
): Promise<StateScoreComponentsResponse> {
  if (slesId === 3330) {
    if (startYear === 2015 && endYear === 2016) {
      return Promise.resolve({
        data: scorecard_3330_15_16,
        slesId,
        term: {
          state: "GA",
          startYear,
          endYear
        }
      });
    }
    if (startYear === 2017 && endYear === 2018) {
      return Promise.resolve({
        data: scorecard_3330_17_18,
        slesId,
        term: {
          state: "GA",
          startYear,
          endYear
        }
      });
    }
  }
  
  return Promise.resolve({
    data: {
      slesId,
      overall: {
        c_bill: 0,
        c_aic: 0,
        c_abc: 0,
        c_pass: 0,
        c_law: 0,
        s_bill: 0,
        s_aic: 0,
        s_abc: 0,
        s_pass: 0,
        s_law: 0,
        ss_bill: 0,
        ss_aic: 0,
        ss_abc: 0,
        ss_pass: 0,
        ss_law: 0,
      },
      validStateTerms: [
        {
          state: "GA",
          startYear: 2015,
          endYear: 2016,
          chamber: "lower"
        },
        {
          state: "GA",
          startYear: 2017,
          endYear: 2018,
          chamber: "lower"
        }
      ],
    },
    slesId,
    term: {
      state: "GA",
      startYear,
      endYear
    }
  });
}