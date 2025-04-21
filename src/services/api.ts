/**
 * API service for The Lawmakers API
 */
import { congressionalDistrictValidator } from "@/lib/types";
import {
  type CongressionalDistrict,
  CongressList,
  congressListValidator,
  type StateVisScorecardResponse,
  stateVisScorecardResponseValidator,
  type StateVisTableResponse,
  stateVisTableResponseValidator,
  TermResponse,
  termResponseValidator,
  type VisScorecardResponse,
  visScorecardResponseValidator,
  type VisTableResponse,
  visTableResponseValidator,
} from "@/services/api.types";
import { sortDescending } from "./api.utils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getCongressList(): Promise<CongressList> {
  const response = await fetch(`${API_BASE_URL}/vis/congress`);

  if (!response.ok) {
    throw new Error("Failed to fetch Congress list");
  }
  const data = await response.json();
  const safelyParsed = congressListValidator.safeParse(data);

  if (!safelyParsed.success) {
    console.error("Error parsing Congress list:", safelyParsed.error.format());
    throw new Error("Failed to parse Congress list");
  }

  // sort stage
  const sorted = sortDescending(safelyParsed.data, (congress) => congress);
  return sorted;
}

export async function getTermList(state: string): Promise<TermResponse> {
  const url = `${API_BASE_URL}/vis/stateTerms`;
  const queryParams = new URLSearchParams({
    state: state,
  });
  const response = await fetch(`${url}?${queryParams}`);
  if (!response.ok) {
    throw new Error("Failed to fetch term list");
  }
  const data = await response.json();
  const safelyParsed = termResponseValidator.safeParse(data);
  if (!safelyParsed.success) {
    console.error("Error parsing term list:", safelyParsed.error.format());
    throw new Error("Failed to parse term list");
  }

  // sort stage
  const sorted = sortDescending(safelyParsed.data, (term) => term.startYear);
  return sorted;
}

export async function getTableData(
  congress: number
): Promise<VisTableResponse> {
  const baseUrl = `${API_BASE_URL}/vis/table`;
  const queryParams = new URLSearchParams({
    congress: congress.toString(),
  });
  const url = `${baseUrl}?${queryParams}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch legislator data");
  }
  const visTableResponse = await response.json();
  const safelyParsed = visTableResponseValidator.safeParse(visTableResponse);
  if (!safelyParsed.success) {
    console.error(
      "Error parsing legislator data:",
      safelyParsed.error.format()
    );
    throw new Error("Failed to parse legislator data");
  }
  // sort stage

  // This is a bit bloated because iles is a record and scorecard component expects it as such
  // Not a big deal, just flagging it as a not very beautiful use of the generic sort util.
  safelyParsed.data.data.forEach((legislator) => {
    const iles = sortDescending(
      Object.entries(legislator.iles),
      ([_, score]) => score
    );
    legislator.iles = Object.fromEntries(iles);
  });

  return safelyParsed.data;
}

export async function getScorecardData(
  congress: number,
  bioguide: string
): Promise<VisScorecardResponse> {
  const baseUrl = `${API_BASE_URL}/vis/scorecard`;
  const queryParams = new URLSearchParams({
    congress: congress.toString(),
    bioguide: bioguide,
  });
  const url = `${baseUrl}?${queryParams}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch scorecard data");
  }
  const visScorecardResponse = await response.json();
  const safelyParsed =
    visScorecardResponseValidator.safeParse(visScorecardResponse);
  if (!safelyParsed.success) {
    throw new Error("Failed to parse scorecard data");
  }

  // sort stage
  safelyParsed.data.data.validCongresses = sortDescending(
    safelyParsed.data.data.validCongresses,
    ([congress]) => congress
  );

  return safelyParsed.data;
}

export async function getDistrictForZip(
  zip: string
): Promise<CongressionalDistrict | undefined> {
  const baseUrl = `${API_BASE_URL}/vis/district`;
  const queryParams = new URLSearchParams({
    zip: zip,
  });
  const url = `${baseUrl}?${queryParams}`;
  const response = await fetch(url);
  if (!response.ok) {
    if (response.status === 404) {
      return undefined;
    }
    throw new Error("Failed to look up district");
  }
  const data = await response.json();
  const safelyParsed = congressionalDistrictValidator.safeParse(data);
  if (!safelyParsed.success) {
    throw new Error("Failed to parse district response");
  }
  return safelyParsed.data;
}

export async function getStateTableData(
  state: string,
  startYear: number,
  endYear: number
): Promise<StateVisTableResponse> {
  const baseUrl = `${API_BASE_URL}/vis/stateTable`;
  const queryParams = new URLSearchParams({
    state: state,
    termStartYear: startYear.toString(),
    termEndYear: endYear.toString(),
  });
  const url = `${baseUrl}?${queryParams}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch state legislator data");
  }

  const stateVisTableResponse = await response.json();
  const safelyParsed = stateVisTableResponseValidator.safeParse(
    stateVisTableResponse
  );

  if (!safelyParsed.success) {
    throw new Error("Failed to parse state legislator data");
  }

  return safelyParsed.data;
}

export async function getStateScorecardData(
  slesId: number,
  startYear: number,
  endYear: number
): Promise<StateVisScorecardResponse> {
  const baseUrl = `${API_BASE_URL}/vis/stateScorecard`;
  const queryParams = new URLSearchParams({
    slesId: slesId.toString(),
    termStartYear: startYear.toString(),
    termEndYear: endYear.toString(),
  });
  const url = `${baseUrl}?${queryParams}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch state scorecard data");
  }

  const stateVisScorecardResponse = await response.json();
  const safelyParsed = stateVisScorecardResponseValidator.safeParse(
    stateVisScorecardResponse
  );

  if (!safelyParsed.success) {
    throw new Error("Failed to parse state scorecard data");
  }
  // sort stage
  safelyParsed.data.validTerms = sortDescending(
    safelyParsed.data.validTerms,
    (term) => term.startYear
  );

  return safelyParsed.data;
}
