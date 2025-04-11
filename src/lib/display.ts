import type { StateChamber } from "@/lib/types";

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

export const getChamberDisplayName = (chamber: string): string => {
  return chamber === "S" ? "Senate" : "House";
};

export const getStateChamberDisplayName = (chamber: StateChamber): string => {
  return chamber === "upper" ? "Upper" : "Lower";
};

export interface TermDisplayInfo {
  startYear: number;
  endYear: number;
  chamber: StateChamber;
}

export const getTermDisplayName = (term: TermDisplayInfo): string => {
  const chamberName = getStateChamberDisplayName(term.chamber);
  return `${term.startYear}-${term.endYear} ${chamberName}`;
};

export const getTermValue = (term: {
  startYear: number;
  endYear: number;
}): string => {
  return `${term.startYear}-${term.endYear}`;
};
