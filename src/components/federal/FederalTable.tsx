import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { partyNames } from "@/lib/consts";
import type { GroupedFederalRow, SortField, SortDirection } from "@/lib/types";
import type { FederalChamber } from "@/lib/types";
import type { VisTable, CongressionalDistrict } from "@/services/api.types";
import { getTableData, getDistrictForZip } from "@/services/api";
import { BaseTable } from "@/components/shared/BaseTable";
import { FederalTableRow } from "@/components/federal/FederalTableRow";
import { getFederalTableRows } from "@/lib/transforms";

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
  const [sortField, setSortField] = useState<SortField>("score");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [legislators, setLegislators] = useState<Array<VisTable>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [districtFromZip, setDistrictFromZip] =
    useState<CongressionalDistrict | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getTableData(parseInt(congress));
        setLegislators(response.data);
      } catch (err) {
        setError("Failed to load legislator data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

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

  const tableRows: GroupedFederalRow[] = getFederalTableRows({
    legislators,
    chamber,
    stateFilter,
    searchTerm,
    districtFromZip,
    selectedIssue,
    sortField,
    sortDirection,
    congress,
  });


  return (
    <BaseTable<GroupedFederalRow>
      type="federal"
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
          disabled: selectedIssue !== "all",
          className: cn(selectedIssue !== "all" && "opacity-50 cursor-not-allowed"),
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
