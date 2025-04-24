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
import { getDistrictForZip, getTableData } from "@/services/api";
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
    const lookupZip = async () => {
      if (!searchTerm) {
        setDistrictFromZip(null);
        return;
      }

      if (/^\d{5}$/.test(searchTerm)) {
        try {
          const district = await getDistrictForZip(searchTerm);
          setDistrictFromZip(district || null);
        } catch (err) {
          console.error("Failed to look up ZIP code:", err);
          setDistrictFromZip(null);
        }
      } else {
        setDistrictFromZip(null);
      }
    };

    lookupZip();
  }, [searchTerm]);

  const handleSort = (field: SortField) => {
    if (selectedIssue !== "all" && field === "rank") return;

    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection(field === "score" ? "desc" : "asc");
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
          width: "w-[50%]",
          sortField: "name",
          currentSort: sortField,
          direction: sortDirection,
          onSort: handleSort,
        },
        {
          name: "Party Rank",
          width: "w-[15%]",
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
          width: "w-[15%]",
          className: cn(selectedIssue !== "all" && "opacity-50"),
        },
        {
          name: "LES",
          width: "w-[20%]",
          sortField: "score",
          currentSort: sortField,
          direction: sortDirection,
          onSort: handleSort,
        },
      ]}
      TableRowComponent={({ row }) =>
        row.type === "group" ? (
          <tr>
            <td colSpan={4} className="px-4 py-2 font-bold bg-muted">
              {partyNames[row.party] ?? row.party}
            </td>
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
