import { FederalTableRow } from "@/components/federal/FederalTableRow";
import { BaseTable } from "@/components/shared/BaseTable";
import { partyNames } from "@/lib/consts";
import { getFederalTableRows } from "@/lib/transforms";
import type {
  FederalChamber,
  GroupedFederalRow,
  SortDirection,
  SortField,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import { getTableData } from "@/services/api";
import type { CongressionalDistrict, VisTable } from "@/services/api.types";
import { useEffect, useMemo, useState } from "react";
import { FederalTableTitle } from "./FederalTableTitle";

interface FederalTableProps {
  congress: string;
  chamber: FederalChamber;
  stateFilter: string;
  searchTerm: string;
  selectedIssue: string;
  onLegislatorSelect: (legislator: VisTable) => void;
}

export function FederalTable({
  congress,
  chamber,
  stateFilter,
  searchTerm,
  selectedIssue,
  onLegislatorSelect,
}: FederalTableProps) {
  const [currentCongress, setCurrentCongress] = useState<string>(congress);
  const [sortField, setSortField] = useState<SortField>("score");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [legislators, setLegislators] = useState<Array<VisTable>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [districtFromZip, setDistrictFromZip] =
    useState<CongressionalDistrict | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // When congress changes, set loading state and clear error state
      if (congress !== currentCongress) {
        setIsLoading(true);
        setError(null);
      }
      try {
        // Being fetching data for congress
        const response = await getTableData(parseInt(congress));
        setLegislators(response.data);
        // Set the current congress to the one fetched
        setCurrentCongress(congress);
      } catch (err) {
        setError("Failed to load legislator data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    // fetch
    fetchData();
  }, [congress]);

  useEffect(() => {
    // Zip code search functionality has been disabled
    // Always set districtFromZip to null regardless of search term
    setDistrictFromZip(null);
  }, [searchTerm]);

  const handleSort = (field: SortField) => {
    if (
      (selectedIssue !== "all" && field === "rank") ||
      (chamber !== "house" && field === "district")
    )
      return;

    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      // Default sort direction for each field
      const defaultDir = field === "score" ? "desc" : "asc";
      setSortDirection(defaultDir);
    }
  };

  const { tableRows, summaryStats } = useMemo(() => {
    const tableRows = getFederalTableRows({
      legislators,
      chamber,
      stateFilter,
      searchTerm,
      districtFromZip,
      selectedIssue,
      sortField,
      sortDirection,
      congress: currentCongress,
    });

    const flatRows = tableRows
      .filter(
        (r): r is { type: "legislator"; data: VisTable } =>
          r.type === "legislator"
      )
      .map((r) => r.data)
      .filter((leg) => {
        const score =
          selectedIssue === "all"
            ? leg.les
            : leg.iles[selectedIssue.toLowerCase().replace(/\s+/g, "")] ?? 0;
        return score !== 0;
      });

    const numLegislators = flatRows.length;

    const partyCounts = flatRows.reduce((acc, leg) => {
      acc[leg.party] = (acc[leg.party] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const summaryStats = {
      numLegislators,
      partyCounts,
    };

    return { tableRows, summaryStats };
  }, [
    legislators,
    chamber,
    stateFilter,
    searchTerm,
    districtFromZip,
    selectedIssue,
    sortField,
    sortDirection,
    currentCongress,
  ]);

  return (
    <BaseTable<GroupedFederalRow>
      TableTitleComponent={
        <FederalTableTitle
          congress={congress}
          chamber={chamber}
          state={stateFilter}
          selectedIssue={selectedIssue}
          summary={summaryStats}
        />
      }
      type="federal"
      minWidth="900px"
      data={tableRows}
      emptyState={isLoading ? "Loading data..." : error ?? "No data available."}
      headers={[
        {
          name: "Name",
          width: "w-[25%]",
          sortField: "name",
          currentSort: sortField,
          direction: sortDirection,
          onSort: handleSort,
          className: "sticky left-0 bg-card/95 z-10 border-r border-border/80 after:absolute after:right-0 after:top-0 after:h-full after:w-[1px] after:shadow-[0_0_8px_rgba(0,0,0,0.1)]",
        },
        {
          name: "Party", // Party is not sortable now
          width: "w-[8%]",
          // Removed sortField, currentSort, direction, onSort
        },
        {
          name: "State",
          width: "w-[8%]",
          sortField: "state",
          currentSort: sortField,
          direction: sortDirection,
          onSort: handleSort,
        },
        {
          name: "District",
          width: "w-[8%]",
          sortField: "district",
          currentSort: sortField,
          direction: sortDirection,
          onSort: handleSort,
          disabled: chamber !== "house",
          className: cn(chamber !== "house" && "opacity-50 cursor-not-allowed"),
        },
        {
          name: "Party Rank",
          width: "w-[12%]",
          sortField: "rank",
          currentSort: sortField,
          direction: sortDirection,
          onSort: handleSort,
          disabled: selectedIssue !== "all",
          className: cn(
            selectedIssue !== "all" && "opacity-50 cursor-not-allowed"
          ),
        },
        {
          name: "Benchmark",
          width: "w-[12%]",
          className: cn(selectedIssue !== "all" && "opacity-50"),
        },
        {
          name: "LES",
          width: "w-[15%]",
          sortField: "score",
          currentSort: sortField,
          direction: sortDirection,
          onSort: handleSort,
        },
        {
          name: "", // For chevron
          width: "w-[5%]",
        },
      ]}
      TableRowComponent={({ row }) =>
        row.type === "group" ? (
          <tr className="group-row">
            <td className="px-4 py-2 font-bold bg-muted sticky left-0 z-10 border-r border-border/80 after:absolute after:right-0 after:top-0 after:h-full after:w-[1px] after:shadow-[0_0_8px_rgba(0,0,0,0.1)]">
              {partyNames[row.party] ?? row.party}
            </td>
            <td colSpan={7} className="p-0 bg-muted"></td>
          </tr>
        ) : (
          <FederalTableRow
            row={row.data}
            selectedIssue={selectedIssue}
            onClick={() => onLegislatorSelect(row.data)}
          />
        )
      }
    />
  );
}
