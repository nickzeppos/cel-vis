import { useTableState } from "@/context/TableStateContext";
import type { FederalChamber } from "@/lib/types";
import { getTableData } from "@/services/api";
import { visTableResponseValidator } from "@/services/api.types";
import { useEffect } from "react";

export function useFederalState() {
  const { federalState, updateFederalState } = useTableState();

  const {
    congress,
    chamber,
    searchTerm,
    stateFilter,
    selectedIssue,
    tableData,
  } = federalState;

  // Fetch initial data if not already present
  useEffect(() => {
    const fetchData = async () => {
      if (tableData === null) {
        // Set loading state

        try {
          const response = await getTableData(parseInt(congress));
          const safelyParsed = visTableResponseValidator.safeParse(response);
          if (!safelyParsed.success) {
            console.error(
              "Error parsing table data:",
              safelyParsed.error.format()
            );
            throw new Error("Failed to parse table data");
          }
          // Update state with fetched data
          updateFederalState({
            tableData: safelyParsed.data,
          });
        } catch (err) {
          console.error("Failed to fetch table data:", err);
        }
      }
    };

    fetchData();
  }, [congress, tableData, updateFederalState]);

  // Fetch table data when user switches Congress
  const handleCongressChange = (newCongress: string) => {
    updateFederalState({
      congress: newCongress,
    });
  };

  return {
    congress,
    setCongress: (congress: string) => updateFederalState({ congress }),
    chamber,
    setChamber: (chamber: FederalChamber) => updateFederalState({ chamber }),
    searchTerm,
    setSearchTerm: (searchTerm: string) => updateFederalState({ searchTerm }),
    stateFilter,
    setStateFilter: (stateFilter: string) =>
      updateFederalState({ stateFilter }),
    selectedIssue,
    setSelectedIssue: (selectedIssue: string) =>
      updateFederalState({ selectedIssue }),
    handleCongressChange,
    tableData,
  };
}
