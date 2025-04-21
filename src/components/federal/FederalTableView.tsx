import { FederalControlPanel } from "@/components/federal/FederalControlPanel";
import { FederalTableGlossary } from "@/components/federal/FederalTableGlossary";
import { FederalTable } from "@/components/federal/FederalTable";
import { LevelToggle } from "@/components/shared/LevelToggle";
import { useFederalState } from "@/hooks/useFederalState";
import { ViewRoute } from "@/lib/types";

type FederalTableViewProps = {
  route: ViewRoute;
  setRoute: (route: ViewRoute) => void;
};

function FederalTableView({ setRoute }: FederalTableViewProps) {
  const federalState = useFederalState();

  return (
    <div className="min-h-screen bg-background">
      <div className="relative flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-[1200px]">
          <div className="grid gap-x-6 gap-y-4 grid-cols-1 grid-rows-[min-content_min-content_min-content] grid-areas-mobile md:grid-cols-[1fr_2fr] md:grid-rows-[min-content_1fr] md:grid-areas-desktop">
            <div className="grid-in-a space-y-4">
              <LevelToggle
                level={"federal"}
                onLevelChange={(newLevel) =>
                  setRoute({
                    type:
                      newLevel === "state" ? "state:table" : "federal:table",
                  })
                }
              />
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
              <FederalTable
                congress={federalState.congress}
                chamber={federalState.chamber}
                stateFilter={federalState.stateFilter}
                searchTerm={federalState.searchTerm}
                selectedIssue={federalState.selectedIssue}
                onLegislatorSelect={(legislator) =>
                  setRoute({ type: "federal:scorecard", legislator })
                }
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
export default FederalTableView;
