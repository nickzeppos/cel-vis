import { useTableState } from "@/context/TableStateContext";
import type { FederalChamber } from "@/lib/types";
import { getTableData } from "@/services/api";
import { useEffect } from "react";
import { toast } from "sonner";

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

  // Fetch initial table data if not already loaded
  useEffect(() => {
    if (tableData === null) {
      const fetchInitialData = async () => {
        try {
          const data = await getTableData(parseInt(congress));
          updateFederalState({ tableData: data });
        } catch (err) {
          console.error("Failed to fetch initial table data:", err);
          toast.error("Failed to load legislator data");
        }
      };

      fetchInitialData();
    }
  }, [congress, tableData, updateFederalState]);

  // Fetch table data when user switches Congress
  const handleCongressChange = async (newCongress: string) => {
    try {
      const data = await getTableData(parseInt(newCongress));
      updateFederalState({
        congress: newCongress,
        tableData: data,
      });
    } catch (err) {
      console.error("Failed to fetch table data:", err);
      toast.error("Failed to load legislator data");
    }
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
    tableData,
    handleCongressChange,
  };
}
