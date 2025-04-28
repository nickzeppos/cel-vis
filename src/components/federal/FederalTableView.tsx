import { FederalControlPanel } from "@/components/federal/FederalControlPanel";
import { FederalTable } from "@/components/federal/FederalTable";
import { FederalTableGlossary } from "@/components/federal/FederalTableGlossary";
import { BaseTableView } from "@/components/shared/BaseTableView";
import { LevelToggle } from "@/components/shared/LevelToggle";
import { useFederalState } from "@/hooks/useFederalState";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";

function FederalTableView() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const federalState = useFederalState();

  // Sync URL parameters with state
  useEffect(() => {
    // Get parameters from URL if they exist
    const congressParam = searchParams.get("congress");
    const chamberParam = searchParams.get("chamber");
    const stateParam = searchParams.get("state");
    const issueParam = searchParams.get("issue");
    const searchParam = searchParams.get("search");

    // Update state from URL parameters if they exist
    if (congressParam && !isNaN(Number(congressParam))) {
      federalState.handleCongressChange(congressParam);
    }
    if (chamberParam && (chamberParam === "house" || chamberParam === "senate")) {
      federalState.setChamber(chamberParam);
    }
    if (stateParam) {
      federalState.setStateFilter(stateParam);
    }
    if (issueParam) {
      federalState.setSelectedIssue(issueParam);
    }
    if (searchParam) {
      federalState.setSearchTerm(searchParam);
    }
  }, []); // Only run once on component mount

  // Update URL parameters when state changes
  useEffect(() => {
    const params = new URLSearchParams();
    
    // Only add parameters that have values
    if (federalState.congress) {
      params.set("congress", federalState.congress.toString());
    }
    if (federalState.chamber) {
      params.set("chamber", federalState.chamber);
    }
    if (federalState.stateFilter) {
      params.set("state", federalState.stateFilter);
    }
    if (federalState.selectedIssue) {
      params.set("issue", federalState.selectedIssue);
    }
    if (federalState.searchTerm) {
      params.set("search", federalState.searchTerm);
    }
    
    // Update URL without causing a navigation
    setSearchParams(params, { replace: true });
  }, [
    federalState.congress,
    federalState.chamber,
    federalState.stateFilter,
    federalState.selectedIssue,
    federalState.searchTerm,
    setSearchParams
  ]);

  return (
    <BaseTableView
      levelToggle={
        <LevelToggle
          level="federal"
          onLevelChange={(newLevel) =>
            navigate(newLevel === "state" ? "/state/table" : "/federal/table")
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
            navigate(`/federal/scorecard/${legislator.bioguide}/${federalState.congress}`)
          }
        />
      }
      glossary={<FederalTableGlossary />}
    />
  );
}

export default FederalTableView;
