import { useState } from "react";
import type { StateChamber } from "@/lib/types";
import type {
  StateVisScorecardResponse,
  StateVisTable,
} from "@/services/api.types";
import { getStateScorecardData } from "@/services/api";
import { toast } from "sonner";

export function useStateState() {
  const [selectedState, setSelectedState] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [stateChamber, setStateChamber] = useState<StateChamber>("lower");
  const [stateSearchTerm, setStateSearchTerm] = useState("");
  const [selectedStateLegislator, setSelectedStateLegislator] =
    useState<StateVisTable | null>(null);
  const [selectedStateScorecard, setSelectedStateScorecard] =
    useState<StateVisScorecardResponse | null>(null);
  const [selectedStateTerm, setSelectedStateTerm] = useState("");

  const handleStateLegislatorSelect = async (
    legislator: StateVisTable,
    term: string
  ) => {
    try {
      const [startYear, endYear] = term.split("-").map(Number);
      const scorecard = await getStateScorecardData(
        legislator.slesId,
        startYear,
        endYear
      );
      setSelectedStateScorecard(scorecard);
      setSelectedStateLegislator(legislator);
      setSelectedStateTerm(term);
    } catch (err) {
      console.error("Failed to fetch state scorecard data:", err);
      toast.error("Failed to load scorecard data");
      setSelectedStateLegislator(legislator);
    }
  };

  return {
    selectedState,
    setSelectedState,
    selectedTerm,
    setSelectedTerm,
    stateChamber,
    setStateChamber,
    stateSearchTerm,
    setStateSearchTerm,
    selectedStateLegislator,
    setSelectedStateLegislator,
    selectedStateScorecard,
    setSelectedStateScorecard,
    selectedStateTerm,
    handleStateLegislatorSelect,
  };
}
