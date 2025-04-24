import { useState, useEffect, useMemo } from "react";
import { StateTableRow } from "@/components/state/StateTableRow";
import { getStateTableData } from "@/services/api";
import { StateVisTable } from "@/services/api.types";
import { BaseTable } from "@/components/shared/BaseTable";
import { getStateTableRows } from "@/lib/transforms";
import { SortField, SortDirection, GroupedStateRow } from "@/lib/types";
import { getStatePartyOrder } from "@/lib/parties";
import { StateTableTitle } from "./StateTableTitle";

const partyNames: Record<string, string> = {
  D: "Democrat",
  R: "Republican",
  I: "Independent",
};

interface StateTableProps {
  selectedState: string;
  selectedTerm: string;
  chamber: "upper" | "lower";
  searchTerm?: string;
  onLegislatorSelect: (legislator: StateVisTable, term: string) => void;
}

export function StateTable({
  selectedState,
  selectedTerm,
  chamber,
  searchTerm = "",
  onLegislatorSelect,
}: StateTableProps) {
  const [sortField, setSortField] = useState<SortField>("score");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [legislatorsData, setLegislatorsData] = useState<StateVisTable[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedState === "" || selectedTerm === "") {
        setIsLoading(false);
        setLegislatorsData([]);
        setError(null);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const [startYear, endYear] = selectedTerm.split("-").map(Number);
        const response = await getStateTableData(
          selectedState,
          startYear,
          endYear
        );
        setLegislatorsData(response.data);
      } catch (err) {
        setError("Failed to load legislator data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedState, selectedTerm, chamber]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection(field === "score" ? "desc" : "asc");
    }
  };

  const { tableRows, summary } = useMemo(() => {
    const tableRows = getStateTableRows({
      legislators: legislatorsData,
      chamber,
      searchTerm,
      sortField,
      sortDirection,
    });

    const flatRows = tableRows
      .filter(
        (r): r is { type: "legislator"; data: StateVisTable } =>
          r.type === "legislator"
      )
      .map((r) => r.data)
      .filter((leg) => leg.sles !== 0);

    const numLegislators = flatRows.length;

    const partyCounts = flatRows.reduce((acc, leg) => {
      acc[leg.party] = (acc[leg.party] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const partyOrder = getStatePartyOrder(flatRows, chamber);

    return {
      tableRows,
      summary: { numLegislators, partyCounts, orderedParties: partyOrder },
    };
  }, [legislatorsData, chamber, searchTerm, sortField, sortDirection]);

  return (
    <BaseTable<GroupedStateRow>
      TableTitleComponent={
        <StateTableTitle
          chamber={chamber}
          selectedState={selectedState}
          selectedTerm={selectedTerm}
          summary={summary}
        />
      }
      type="state"
      minWidth="900px"
      data={tableRows}
      emptyState={
        isLoading
          ? "Loading data..."
          : selectedState
          ? "Select a state to view data."
          : error ?? "No data available."
      }
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
        },
        {
          name: "Benchmark",
          width: "w-[15%]",
        },
        {
          name: "SLES",
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
          <StateTableRow
            row={row.data}
            onClick={() => onLegislatorSelect(row.data, selectedTerm)}
          />
        )
      }
    />
  );
}
