import { ValidTerm } from "@/services/api.types";
import { Term } from "./types";

export function findMatchingTerm(
  selectedTerm: Term,
  validTerms?: ValidTerm[]
): ValidTerm | undefined {
  if (!validTerms) return undefined;

  return validTerms.find(
    (term) =>
      term.startYear === selectedTerm.startYear &&
      term.endYear === selectedTerm.endYear
  );
}
