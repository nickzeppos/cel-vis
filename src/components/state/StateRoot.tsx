import { StateControlPanel } from "@/components/state/StateControlPanel";
import { StateScorecardView } from "@/components/state/StateScorecardView";
import { StateTableView } from "@/components/state/StateTableView";
import type { StateChamber, ViewLevel } from "@/lib/types";
import { getStateScorecardData } from "@/services/api";
import type {
  StateVisScorecardResponse,
  StateVisTable,
} from "@/services/api.types";
import { useState } from "react";
import { toast } from "sonner";
import { StateTableGlossary } from "./StateTableGlossary";
import { LevelToggle } from "../LevelToggle";

type StateRootProps = {
  level: ViewLevel;
  setLevel: (level: ViewLevel) => void;
};
function StateRoot({ level, setLevel }: StateRootProps) {
  // State level state
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

  // Show state scorecard
  if (selectedStateLegislator) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-[1400px]">
          <StateScorecardView
            legislator={selectedStateLegislator}
            scorecard={selectedStateScorecard}
            initialTerm={selectedStateTerm}
            onBack={() => {
              setSelectedStateLegislator(null);
              setSelectedStateScorecard(null);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-[1200px]">
          <div className="grid gap-x-6 gap-y-4 grid-cols-1 grid-rows-[min-content_min-content_min-content] grid-areas-mobile md:grid-cols-[1fr_2fr] md:grid-rows-[min-content_1fr] md:grid-areas-desktop">
            <div className="grid-in-a space-y-4">
              <LevelToggle level={level} onLevelChange={setLevel} />
              <StateControlPanel
                selectedState={selectedState}
                selectedTerm={selectedTerm}
                selectedChamber={stateChamber}
                onStateSelect={setSelectedState}
                onTermChange={setSelectedTerm}
                onChamberChange={setStateChamber}
                onSearchChange={setStateSearchTerm}
              />
            </div>
            <div className="grid-in-b space-y-4 min-h-[600px]">
              <h1 className="text-3xl font-bold">DYNAMIC TITLE</h1>
              <StateTableView
                selectedState={selectedState}
                selectedTerm={selectedTerm}
                chamber={stateChamber}
                searchTerm={stateSearchTerm}
                onLegislatorSelect={handleStateLegislatorSelect}
              />
            </div>
            <div className="grid-in-c space-y-4">
              <StateTableGlossary />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StateRoot;
