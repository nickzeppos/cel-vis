import { LevelToggle } from "@/components/shared/LevelToggle";
import { StateControlPanel } from "@/components/state/StateControlPanel";
import { StateTableGlossary } from "@/components/state/StateTableGlossary";
import { StateTable } from "@/components/state/StateTable";
import { BaseTableView } from "@/components/shared/BaseTableView";
import { useStateState } from "@/hooks/useStateState";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";

function StateTableView() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const stateState = useStateState();

  // Sync URL parameters with state
  useEffect(() => {
    // Get parameters from URL if they exist
    const stateParam = searchParams.get("state");
    const termParam = searchParams.get("term");
    const chamberParam = searchParams.get("chamber");
    const searchParam = searchParams.get("search");

    // Update state from URL parameters if they exist
    if (stateParam) {
      stateState.setSelectedState(stateParam);
    }
    if (termParam) {
      stateState.setSelectedTerm(termParam);
    }
    if (chamberParam && (chamberParam === "upper" || chamberParam === "lower")) {
      stateState.setStateChamber(chamberParam);
    }
    if (searchParam) {
      stateState.setStateSearchTerm(searchParam);
    }
  }, []); // Only run once on component mount

  // Update URL parameters when state changes
  useEffect(() => {
    const params = new URLSearchParams();
    
    // Only add parameters if a state is selected
    if (stateState.selectedState) {
      // Add the state parameter
      params.set("state", stateState.selectedState);
      
      // Only add other parameters when a state is selected
      if (stateState.selectedTerm) {
        params.set("term", stateState.selectedTerm);
      }
      if (stateState.stateChamber) {
        params.set("chamber", stateState.stateChamber);
      }
      if (stateState.stateSearchTerm) {
        params.set("search", stateState.stateSearchTerm);
      }
    }
    
    // Update URL without causing a navigation
    setSearchParams(params, { replace: true });
  }, [
    stateState.selectedState,
    stateState.selectedTerm,
    stateState.stateChamber,
    stateState.stateSearchTerm,
    setSearchParams
  ]);

  return (
    <BaseTableView
      levelToggle={
        <LevelToggle
          level="state"
          onLevelChange={(newLevel) =>
            navigate(newLevel === "federal" ? "/federal/table" : "/state/table")
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
          onLegislatorSelect={(legislator) => {
            // Build the URL with query parameters
            const url = new URL(`/state/scorecard/${stateState.selectedState}/${legislator.slesId}`, window.location.origin);
            
            // Add term parameter
            if (stateState.selectedTerm) {
              url.searchParams.set('term', stateState.selectedTerm);
            }
            
            navigate(url.pathname + url.search);
          }}
          
        />
      }
      glossary={<StateTableGlossary />}
    />
  );
}

export default StateTableView;
