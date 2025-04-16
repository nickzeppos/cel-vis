import type { FederalChamber } from "@/lib/types";
import { getTableData } from "@/services/api";
import type { VisTableResponse } from "@/services/api.types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useFederalState() {
  const [congress, setCongress] = useState("118");
  const [chamber, setChamber] = useState<FederalChamber>("house");
  const [searchTerm, setSearchTerm] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const [selectedIssue, setSelectedIssue] = useState("all");

  const [tableData, setTableData] = useState<VisTableResponse | null>(null);

  // Fetch initial table data on mount
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
  }, []);

  // Fetch table data when user switches Congress
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

  return {
    congress,
    setCongress,
    chamber,
    setChamber,
    searchTerm,
    setSearchTerm,
    stateFilter,
    setStateFilter,
    selectedIssue,
    setSelectedIssue,
    tableData,
    handleCongressChange,
  };
}
