import { useEffect, useState } from "react";
import { getScorecardData, getTableData } from "@/services/api";
import type {
  VisTable,
  VisScorecardResponse,
  VisTableResponse,
} from "@/services/api.types";
import type { FederalChamber } from "@/lib/types";
import { toast } from "sonner";

export function useFederalState() {
  const [congress, setCongress] = useState("118");
  const [chamber, setChamber] = useState<FederalChamber>("house");
  const [searchTerm, setSearchTerm] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const [selectedIssue, setSelectedIssue] = useState("all");

  const [selectedLegislator, setSelectedLegislator] = useState<VisTable | null>(
    null
  );
  const [selectedLegislatorScorecard, setSelectedLegislatorScorecard] =
    useState<VisScorecardResponse | null>(null);

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

  // Fetch scorecard when a legislator is selected
  const handleFederalLegislatorSelect = async (legislator: VisTable) => {
    try {
      const scorecard = await getScorecardData(
        parseInt(congress),
        legislator.bioguide
      );
      setSelectedLegislatorScorecard(scorecard);
      setSelectedLegislator(legislator);
    } catch (err) {
      console.error("Failed to fetch scorecard data:", err);
      toast.error("Failed to load scorecard data");
      setSelectedLegislator(legislator); // Still allow showing fallback view
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
    selectedLegislator,
    setSelectedLegislator,
    selectedLegislatorScorecard,
    setSelectedLegislatorScorecard,
    tableData,
    handleCongressChange,
    handleFederalLegislatorSelect,
  };
}
