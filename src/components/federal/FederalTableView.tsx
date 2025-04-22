import { FederalControlPanel } from "@/components/federal/FederalControlPanel";
import { FederalTableGlossary } from "@/components/federal/FederalTableGlossary";
import { FederalTable } from "@/components/federal/FederalTable";
import { LevelToggle } from "@/components/shared/LevelToggle";
import { BaseTableView } from "@/components/shared/BaseTableView";
import { useFederalState } from "@/hooks/useFederalState";
import { ViewRoute } from "@/lib/types";

type FederalTableViewProps = {
  route: ViewRoute;
  setRoute: (route: ViewRoute) => void;
};

function FederalTableView({ setRoute }: FederalTableViewProps) {
  const federalState = useFederalState();

  return (
    <BaseTableView
      title="DYNAMIC TITLE"
      levelToggle={
        <LevelToggle
          level="federal"
          onLevelChange={(newLevel) =>
            setRoute({
              type: newLevel === "state" ? "state:table" : "federal:table",
            })
          }
        />
      }
      controlPanel={
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
      }
      table={
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
      }
      glossary={<FederalTableGlossary />}
    />
  );
}

export default FederalTableView;
