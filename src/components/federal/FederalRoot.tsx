import { useFederalState } from "@/hooks/useFederalState";
import { ViewLevel } from "@/lib/types";
import { LevelToggle } from "@/components/shared/LevelToggle";
import { FederalControlPanel } from "@/components/federal/FederalControlPanel";
import { FederalScorecardView } from "@/components/federal/FederalScorecardView";
import { FederalTableGlossary } from "@/components/federal/FederalTableGlossary";
import { FederalTableView } from "@/components/federal/FederalTableView";

type FederalRootProps = {
  level: ViewLevel;
  setLevel: (level: ViewLevel) => void;
};

function FederalRoot({ level, setLevel }: FederalRootProps) {
  const federalState = useFederalState();

  // Show federal scorecard
  if (federalState.selectedLegislator) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-[1400px]">
          <FederalScorecardView
            legislator={federalState.selectedLegislator}
            scorecard={federalState.selectedLegislatorScorecard}
            onBack={() => {
              federalState.setSelectedLegislator(null);
              federalState.setSelectedLegislatorScorecard(null);
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
              <FederalControlPanel
                congress={federalState.congress}
                chamber={federalState.chamber}
                selectedState={federalState.stateFilter}
                selectedIssue={federalState.selectedIssue}
                onCongressChange={federalState.handleCongressChange}
                onChamberChange={federalState.setChamber}
                onFilterChange={federalState.setStateFilter}
                onSearchChange={federalState.setSearchTerm}
                onIssueChange={federalState.setSelectedIssue}
                availableIssues={federalState.tableData?.availableIssues}
              />
            </div>

            <div className="grid-in-b space-y-4 min-h-[600px]">
              <h1 className="text-3xl font-bold">DYNAMIC TITLE</h1>

              <FederalTableView
                congress={federalState.congress}
                chamber={federalState.chamber}
                stateFilter={federalState.stateFilter}
                searchTerm={federalState.searchTerm}
                selectedIssue={federalState.selectedIssue}
                onLegislatorSelect={federalState.handleFederalLegislatorSelect}
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
