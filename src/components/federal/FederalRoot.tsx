import { useEffect, useState } from "react";
import { FederalChamber, ViewLevel } from "../../lib/types";
import {
  VisTable,
  VisScorecardResponse,
  VisTableResponse,
} from "../../services/api.types";
import { getScorecardData, getTableData } from "../../services/api";
import { toast } from "sonner";
import { FederalScorecardView } from "./FederalScorecardView";
import { FederalTableView } from "./FederalTableView";
import { FederalTableGlossary } from "./FederalTableGlossary";
import { FederalControlPanel } from "./FederalControlPanel";
import { LevelToggle } from "../LevelToggle";

type FederalRootProps = {
  level: ViewLevel;
  setLevel: (level: ViewLevel) => void;
};

function FederalRoot({ level, setLevel }: FederalRootProps) {
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
  return (
    <div className="min-h-screen bg-background">
      <div className="relative flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-[1200px]">
          <div className="grid gap-x-6 gap-y-4 grid-cols-1 grid-rows-[min-content_min-content_min-content] grid-areas-mobile md:grid-cols-[1fr_2fr] md:grid-rows-[min-content_1fr] md:grid-areas-desktop">
            <div className="grid-in-a space-y-4">
              {/* Control Panel */}
              <LevelToggle level={level} onLevelChange={setLevel} />
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
            </div>

            <div className="grid-in-b space-y-4 min-h-[600px]">
              <h1 className="text-3xl font-bold">DYNAMIC TITLE</h1>

              <FederalTableView
                congress={congress}
                chamber={chamber}
                stateFilter={stateFilter}
                searchTerm={searchTerm}
                selectedIssue={selectedIssue}
                onLegislatorSelect={handleFederalLegislatorSelect}
              />
            </div>

            <div className="grid-in-c space-y-4">
              <FederalTableGlossary />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default FederalRoot;
