import type { FederalChamberInitial, StateChamber } from "@/lib/types";
import { ValidCongress, ValidTerm } from "@/services/api.types";

export const getCongressDisplayName = (congress: number): string => {
  const j = congress % 10;
  const k = congress % 100;
  let suffix = "th";
  if (j === 1 && k !== 11) suffix = "st";
  else if (j === 2 && k !== 12) suffix = "nd";
  else if (j === 3 && k !== 13) suffix = "rd";
  return `${congress}${suffix}`;
};

export const getValidCongressDisplayName = ([
  congress,
  chamber,
]: ValidCongress): string => {
  const chamberName = getFederalChamberDisplayName(chamber);
  return `${getCongressDisplayName(congress)} ${chamberName}`;
};

export const getStateLocationText = (
  district: number | string | null
): string => `District ${district}`;
export const getFederalLocationText = (
  chamber: FederalChamberInitial,
  state: string,
  district: number | null
): string => (chamber === "S" ? state : `${state}-${district}`);

export const issueDisplayNames: { [issue: string]: string } = {
  agriculture: "Agriculture",
  civilrights: "Civil Rights and Liberties",
  commerce: "Banking and Commerce",
  defense: "Defense",
  education: "Education",
  energy: "Energy",
  environment: "Environment",
  governmentops: "Goverment Operations",
  health: "Health",
  immigration: "Immigration",
  internationalaffairs: "International Affairs",
  labor: "Labor and Employment",
  lawcrime: "Law, Crime, and Family",
  macro: "Macroeconomics and Budget",
  nativeamericans: "Native Americans",
  publiclands: "Public Lands",
  technology: "Science and Technology",
  trade: "Foreign Trade",
  transportation: "Transportation",
  welfare: "Social Welfare",
  housing: "Housing",
};

export const getIssueDisplayName = (issue: string): string => {
  return issueDisplayNames[issue] !== undefined
    ? issueDisplayNames[issue]
    : issue;
};

export const getFederalChamberDisplayName = (chamber: string): string => {
  if (chamber === "S" || chamber === "senate") return "Senate";
  else return "House";

  // return chamber === "S" ? "Senate" : "House";
};

export const getStateChamberDisplayName = (chamber: StateChamber): string => {
  return chamber === "upper" ? "Upper" : "Lower";
};

export const getValidTermDisplayName = (term: ValidTerm): string => {
  const chamberName = getStateChamberDisplayName(term.chamber);
  return `${term.startYear}-${term.endYear} ${chamberName}`;
};

export const getTermDisplayName = (term: {
  startYear: number;
  endYear: number;
}): string => {
  return `${term.startYear}-${term.endYear}`;
};
