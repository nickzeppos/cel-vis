import { LevelToggle } from "@/components/shared/LevelToggle";
import { StateControlPanel } from "@/components/state/StateControlPanel";
import { StateTableGlossary } from "@/components/state/StateTableGlossary";
import { StateTable } from "@/components/state/StateTable";
import { useStateState as useStateRootState } from "@/hooks/useStateState";
import { ViewRoute } from "@/lib/types";

type StateRootProps = {
  route: ViewRoute;
  setRoute: (route: ViewRoute) => void;
};
function StateTableView({ route, setRoute }: StateRootProps) {
  const stateState = useStateRootState();

  return (
    <div className="min-h-screen bg-background">
      <div className="relative flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-[1200px]">
          <div className="grid gap-x-6 gap-y-4 grid-cols-1 grid-rows-[min-content_min-content_min-content] grid-areas-mobile md:grid-cols-[1fr_2fr] md:grid-rows-[min-content_1fr] md:grid-areas-desktop">
            <div className="grid-in-a space-y-4">
              <LevelToggle
                level={"state"}
                onLevelChange={(newLevel) =>
                  setRoute({
                    type:
                      newLevel === "federal" ? "federal:table" : "state:table",
                  })
                }
              />
              <StateControlPanel
                selectedState={stateState.selectedState}
                selectedTerm={stateState.selectedTerm}
                selectedChamber={stateState.stateChamber}
                onStateSelect={stateState.setSelectedState}
                onTermChange={stateState.setSelectedTerm}
                onChamberChange={stateState.setStateChamber}
                onSearchChange={stateState.setStateSearchTerm}
              />
            </div>
            <div className="grid-in-b space-y-4 min-h-[600px]">
              <h1 className="text-3xl font-bold">DYNAMIC TITLE</h1>
              <StateTable
                selectedState={stateState.selectedState}
                selectedTerm={stateState.selectedTerm}
                chamber={stateState.stateChamber}
                searchTerm={stateState.stateSearchTerm}
                onLegislatorSelect={(legislator) => {
                  setRoute({
                    type: "state:scorecard",
                    legislator,
                    term: stateState.selectedTerm,
                  });
                }}
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

export default StateTableView;
