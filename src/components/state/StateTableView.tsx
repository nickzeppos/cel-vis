import { useState, useEffect } from "react";
import { StateLegislatorRow } from "./StateLegislatorRow";
import { ColumnHeader } from "../ColumnHeader";
import { getStateTableData } from "@/services/api";
import { StateVisTable } from "@/services/api.types";
import { getStatePartyOrder } from "@/lib/parties";
import { SortDirection, SortField } from "@/lib/types";

interface StateTableViewProps {
  selectedState: string;
  selectedTerm: string;
  chamber: "upper" | "lower";
  searchTerm?: string;
  onLegislatorSelect: (legislator: StateVisTable, term: string) => void;
}

export function StateTableView({
  selectedState,
  selectedTerm,
  chamber,
  searchTerm = "",
  onLegislatorSelect,
}: StateTableViewProps) {
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
        setLegislatorsData(response.data.filter((l) => l.chamber === chamber));
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
      setSortDirection("desc");
    }
  };

  const filteredLegislators = legislatorsData
    .filter((legislator) => {
      if (!searchTerm) return true;
      return legislator.name.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1;
      switch (sortField) {
        case "name":
          return direction * a.name.localeCompare(b.name);
        case "rank":
          return direction * (a.partyRank - b.partyRank);
        case "score":
          return direction * (a.sles - b.sles);
        default:
          return 0;
      }
    });

  // Only group by party when sorting by score
  const shouldGroupByParty = sortField === "score";

  let displayLegislators;
  if (shouldGroupByParty) {
    // Get party order for current congress and chamber
    const partyOrderForCongress = getStatePartyOrder(legislatorsData, chamber);

    // Group legislators by party
    const groupedLegislators = filteredLegislators.reduce(
      (groups, legislator) => {
        const party = legislator.party;
        if (!groups[party]) {
          groups[party] = [];
        }
        groups[party].push(legislator);
        return groups;
      },
      {} as Record<string, typeof filteredLegislators>
    );

    // Sort parties according to congress-specific order
    displayLegislators = (
      <>
        {partyOrderForCongress
          .filter((party) => groupedLegislators[party]?.length > 0)
          .map((party) => (
            <div key={party} className="border-b last:border-b-0">
              <div className="py-2 px-4 font-bold bg-muted">
                {party === "D"
                  ? "Democrat"
                  : party === "R"
                  ? "Republican"
                  : "Independent"}
              </div>
              {groupedLegislators[party].map((legislator) => (
                <StateLegislatorRow
                  key={legislator.slesId}
                  legislator={legislator}
                  onClick={() => onLegislatorSelect(legislator, selectedTerm)}
                />
              ))}
            </div>
          ))}
      </>
    );
  } else {
    // When not sorting by score, display as a flat list
    displayLegislators = (
      <div className="border-b last:border-b-0">
        {filteredLegislators.map((legislator) => (
          <StateLegislatorRow
            key={legislator.slesId}
            legislator={legislator}
            onClick={() => onLegislatorSelect(legislator, selectedTerm)}
          />
        ))}
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return <div className="text-xl">Loading legislator data...</div>;
  }

  // Show error state
  if (error) {
    return <div className="text-xl text-red-500">{error}</div>;
  }

  return (
    <div className="flex-1 min-w-0 flex flex-col bg-card rounded-lg border">
      <div className="sticky top-0 z-10 bg-card rounded-t-lg">
        <div className="flex border-b">
          <div className="w-[400px] p-4">
            <ColumnHeader
              type="state"
              label="Name"
              sortField="name"
              currentSort={sortField}
              direction={sortDirection}
              onSort={handleSort}
            />
          </div>
          <div className="w-[140px] p-4">
            <ColumnHeader
              type="state"
              label="Party Rank"
              sortField="rank"
              currentSort={sortField}
              direction={sortDirection}
              onSort={handleSort}
            />
          </div>
          <div className="w-[120px] p-4">
            <div className="font-medium">Benchmark</div>
          </div>
          <div className="w-[120px] p-4">
            <ColumnHeader
              type="state"
              label="SLES"
              sortField="score"
              currentSort={sortField}
              direction={sortDirection}
              onSort={handleSort}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {displayLegislators}
        {!selectedState && (
          <div className="text-center text-muted-foreground py-8">
            Select a state to view legislators
          </div>
        )}
        {selectedState && filteredLegislators.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No results found
          </div>
        )}
      </div>
    </div>
  );
}
