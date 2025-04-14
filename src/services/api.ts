/**
 * API service for The Lawmakers API
 */
import { congressionalDistrictValidator } from "@/lib/types";
import {
  type CongressionalDistrict,
  StateTermResponse,
  stateTermResponseValidator,
  type StateVisScorecardResponse,
  stateVisScorecardResponseValidator,
  type StateVisTableResponse,
  stateVisTableResponseValidator,
  type VisScorecardResponse,
  visScorecardResponseValidator,
  type VisTableResponse,
  visTableResponseValidator,
} from "@/services/api.types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const API_BASE_URL = `http://localhost:3000`;

/**
 * Returns a list of available Congress sessions
 * @returns Promise<Array<number>> Array of Congress numbers (e.g., [117, 118])
 */
export async function getCongressList(): Promise<Array<number>> {
  const response = await fetch(`${API_BASE_URL}/vis/congress`);

  if (!response.ok) {
    throw new Error("Failed to fetch Congress list");
  }
  const data = await response.json();
  return data;
}

/**
 * Returns a list of available terms for the state
 * @param state The state abbreviation (e.g., 'GA')
 */
export async function getTermList(state: string): Promise<StateTermResponse> {
  const url = `${API_BASE_URL}/vis/stateTerms`;
  const queryParams = new URLSearchParams({
    state: state,
  });
  const response = await fetch(`${url}?${queryParams}`);
  if (!response.ok) {
    throw new Error("Failed to fetch term list");
  }
  const data = await response.json();
  const safelyParsed = stateTermResponseValidator.safeParse(data);
  if (!safelyParsed.success) {
    console.error("Error parsing term list:", safelyParsed.error.format());
    throw new Error("Failed to parse term list");
  }
  return safelyParsed.data;
}
/**
 * Returns legislator data for a specific congress
 * @param congress The congress number to fetch data for
 * @returns Promise<VisTableResponse> The legislator data
 */
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
  return safelyParsed.data;
}

/**
 * Returns score components data for a specific congress and bioguide ID
 * @param congress The congress number to fetch data for
 * @param bioguide The bioguide ID of the legislator
 * @returns Promise<VisScorecardResponse> The score components data
 */
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
  return safelyParsed.data;
}

/**
 * Function for looking up congressional districts by ZIP code
 * @param zip The ZIP code to look up
 * @returns Promise<CongressionalDistrict | undefined> The congressional district info, or undefined if not found
 */
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

/**
 * Returns state legislator data for a specific state and term
 * @param state The state abbreviation
 * @param startYear The start year of the term
 * @param endYear The end year of the term
 * @returns Promise<StateVisTableResponse> The state legislator data
 */
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

/**
 * Returns score components data for a specific state legislator
 * @param slesId The unique identifier for the state legislator
 * @param startYear The start year of the term
 * @param endYear The end year of the term
 * @returns Promise<StateVisScorecardResponse> The state legislator's score components
 */
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

  return safelyParsed.data;
}
