import { useState, useEffect } from "react";
import { FederalControlPanel } from "@/components/federal/FederalControlPanel";
import { StateControlPanel } from "@/components/state/StateControlPanel";
import { FederalTableView } from "@/components/federal/FederalTableView";
import { StateTableView } from "@/components/state/StateTableView";
import { FederalScorecardView } from "@/components/federal/FederalScorecardView";
import { StateScorecardView } from "@/components/state/StateScorecardView";
import { LevelToggle } from "@/components/LevelToggle";
import type { ViewLevel, FederalChamber, StateChamber } from "@/lib/types";
import {
  getScorecardData,
  getStateScorecardData,
  getTableData,
} from "@/services/api";
import type {
  VisScorecardResponse,
  VisTable,
  StateVisTable,
  StateVisScorecardResponse,
  VisTableResponse,
} from "@/services/api.types";
import { toast } from "sonner";

function App() {
  const [level, setLevel] = useState<ViewLevel>("federal");

  // Federal state
  const [congress, setCongress] = useState("118");
  const [chamber, setChamber] = useState<FederalChamber>("house");
  const [searchTerm, setSearchTerm] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const [selectedIssue, setSelectedIssue] = useState("all");
  const [selectedLegislator, setSelectedLegislator] = useState<VisTable | null>(
    null
  );
  const [selectedLegislatorScorecard, setSelectedLegislatorScorecard] =
    useState<VisScorecardResponse | null>(null);
  const [tableData, setTableData] = useState<VisTableResponse | null>(null);

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

  // Fetch initial table data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const data = await getTableData(parseInt(congress));
        setTableData(data);
      } catch (err) {
        console.error("Failed to fetch initial table data:", err);
        toast.error("Failed to load legislator data");
      }
    };

    fetchInitialData();
  }, []); // Only run on mount

  const handleLevelChange = (newLevel: ViewLevel) => {
    setLevel(newLevel);
    // Reset state when switching levels
    if (newLevel === "state") {
      setSelectedLegislator(null);
      setSelectedLegislatorScorecard(null);
      setSelectedState("");
      setSelectedTerm("");
      setStateChamber("lower");
      setStateSearchTerm("");
    } else {
      setSelectedStateLegislator(null);
      setSelectedStateScorecard(null);
      setStateFilter("all");
      setSearchTerm("");
    }
  };

  const handleFederalLegislatorSelect = async (legislator: VisTable) => {
    try {
      const scorecard = await getScorecardData(
        parseInt(congress),
        legislator.bioguide
      );
      setSelectedLegislatorScorecard(scorecard);
      setSelectedLegislator(legislator);
    } catch (err) {
      console.error("Failed to fetch scorecard data:", err);
      toast.error("Failed to load scorecard data");
      setSelectedLegislator(legislator);
    }
  };

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

  // Fetch table data when congress changes
  const handleCongressChange = async (newCongress: string) => {
    try {
      const data = await getTableData(parseInt(newCongress));
      setTableData(data);
      setCongress(newCongress);
    } catch (err) {
      console.error("Failed to fetch table data:", err);
      toast.error("Failed to load legislator data");
    }
  };

  // Show federal scorecard
  if (selectedLegislator) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-[1400px]">
          <FederalScorecardView
            legislator={selectedLegislator}
            scorecard={selectedLegislatorScorecard}
            onBack={() => {
              setSelectedLegislator(null);
              setSelectedLegislatorScorecard(null);
            }}
          />
        </div>
      </div>
    );
  }

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
      <div className="container mx-auto px-4 py-8 max-w-[1400px]">
        <div className="flex gap-4">
          <div className="w-80 flex-shrink-0 space-y-4">
            <LevelToggle level={level} onLevelChange={handleLevelChange} />

            {/* Control Panel */}
            {level === "federal" ? (
              <FederalControlPanel
                congress={congress}
                chamber={chamber}
                selectedState={stateFilter}
                selectedIssue={selectedIssue}
                onCongressChange={handleCongressChange}
                onChamberChange={setChamber}
                onFilterChange={setStateFilter}
                onSearchChange={setSearchTerm}
                onIssueChange={setSelectedIssue}
                availableIssues={tableData?.availableIssues}
              />
            ) : (
              <StateControlPanel
                selectedState={selectedState}
                selectedTerm={selectedTerm}
                selectedChamber={stateChamber}
                onStateSelect={setSelectedState}
                onTermChange={setSelectedTerm}
                onChamberChange={setStateChamber}
                onSearchChange={setStateSearchTerm}
              />
            )}
          </div>

          <div className="flex-1 min-w-0 space-y-4">
            <h1 className="text-3xl font-bold">
              Dynamic title area, work in progres
            </h1>

            {level === "federal" ? (
              <FederalTableView
                congress={congress}
                chamber={chamber}
                stateFilter={stateFilter}
                searchTerm={searchTerm}
                selectedIssue={selectedIssue}
                onLegislatorSelect={handleFederalLegislatorSelect}
              />
            ) : (
              <StateTableView
                selectedState={selectedState}
                selectedTerm={selectedTerm}
                chamber={stateChamber}
                searchTerm={stateSearchTerm}
                onLegislatorSelect={handleStateLegislatorSelect}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
