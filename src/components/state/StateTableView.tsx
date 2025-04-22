import { LevelToggle } from "@/components/shared/LevelToggle";
import { StateControlPanel } from "@/components/state/StateControlPanel";
import { StateTableGlossary } from "@/components/state/StateTableGlossary";
import { StateTable } from "@/components/state/StateTable";
import { BaseTableView } from "@/components/shared/BaseTableView";
import { useStateState } from "@/hooks/useStateState";
import { ViewRoute } from "@/lib/types";

type StateTableViewProps = {
  route: ViewRoute;
  setRoute: (route: ViewRoute) => void;
};

function StateTableView({ setRoute }: StateTableViewProps) {
  const stateState = useStateState();

  return (
    <BaseTableView
      title="DYNAMIC TITLE"
      levelToggle={
        <LevelToggle
          level="state"
          onLevelChange={(newLevel) =>
            setRoute({
              type: newLevel === "federal" ? "federal:table" : "state:table",
            })
          }
        />
      }
      controlPanel={
        <StateControlPanel
          selectedState={stateState.selectedState}
          selectedTerm={stateState.selectedTerm}
          selectedChamber={stateState.stateChamber}
          onStateSelect={stateState.setSelectedState}
          onTermChange={stateState.setSelectedTerm}
          onChamberChange={stateState.setStateChamber}
          onSearchChange={stateState.setStateSearchTerm}
        />
      }
      table={
        <StateTable
          selectedState={stateState.selectedState}
          selectedTerm={stateState.selectedTerm}
          chamber={stateState.stateChamber}
          searchTerm={stateState.stateSearchTerm}
          onLegislatorSelect={(legislator) =>
            setRoute({
              type: "state:scorecard",
              legislator,
              term: stateState.selectedTerm,
            })
          }
        />
      }
      glossary={<StateTableGlossary />}
    />
  );
}

export default StateTableView;
