import { useState, useEffect } from "react";
import { StateTableRow } from "@/components/state/StateTableRow";
import { getStateTableData } from "@/services/api";
import { StateVisTable } from "@/services/api.types";
import { BaseTable } from "@/components/shared/BaseTable";
import { getStateTableRows } from "@/lib/transforms";
import { SortField, SortDirection, GroupedStateRow } from "@/lib/types";

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
      if (!selectedState || !selectedTerm) return;

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

  const tableRows: GroupedStateRow[] = getStateTableRows({
    legislators: legislatorsData,
    chamber,
    searchTerm,
    sortField,
    sortDirection,
  });

  return (
    <BaseTable<GroupedStateRow>
      type="state"
      minWidth="900px"
      data={tableRows}
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
      emptyState={
        isLoading ? (
          <div className="py-8 text-muted-foreground text-center text-sm">
            Loading legislator data...
          </div>
        ) : error ? (
          <div className="py-8 text-red-500 text-center text-sm">{error}</div>
        ) : !selectedState ? (
          <div className="py-8 text-muted-foreground text-center text-sm">
            Select a state to view legislators
          </div>
        ) : (
          <div className="py-8 text-muted-foreground text-center text-sm">
            No results found
          </div>
        )
      }
    />
  );
}
