import { useState, useEffect } from "react";
import { FederalLegislatorRow } from "@/components/federal/FederalLegislatorRow";
import { ColumnHeader } from "@/components/shared/ColumnHeader";
import { cn } from "@/lib/utils";
import { getFederalPartyOrder } from "@/lib/parties";
import type { FederalChamber } from "@/lib/types";
import type { VisTable, CongressionalDistrict } from "@/services/api.types";
import { getTableData, getDistrictForZip } from "@/services/api";

type SortField = "name" | "rank" | "score";
type SortDirection = "asc" | "desc";

const partyNames: Record<string, string> = {
  D: "Democrat",
  R: "Republican",
  I: "Independent",
};

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
  const [legislatorsData, setLegislatorsData] = useState<Array<VisTable>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [districtFromZip, setDistrictFromZip] =
    useState<CongressionalDistrict | null>(null);

  // Fetch data when component mounts or congress changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getTableData(parseInt(congress));
        setLegislatorsData(response.data);
      } catch (err) {
        setError("Failed to load legislator data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [congress]);

  // Handle ZIP code search
  useEffect(() => {
    const lookupZip = async () => {
      // Reset district info and state filter if search is cleared
      if (!searchTerm) {
        setDistrictFromZip(null);
        return;
      }

      // Only process if the search term looks like a ZIP code
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

    // If same field, toggle
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      return;
    }

    // Handle other fields
    if (field === "name") {
      setSortField("name");
      setSortDirection("asc");
      return;
    }

    if (field === "rank") {
      setSortField("rank");
      setSortDirection("asc");
      return;
    }

    if (field === "score") {
      setSortField("score");
      setSortDirection("desc");
      return;
    }
  };

  const filteredLegislators = legislatorsData
    .filter((legislator) => {
      // Filter by chamber
      if (chamber === "house" && legislator.chamber !== "H") return false;
      if (chamber === "senate" && legislator.chamber !== "S") return false;

      // Filter by state
      if (stateFilter !== "all" && legislator.state !== stateFilter)
        return false;

      // Handle ZIP code search for House members
      if (districtFromZip && chamber === "house") {
        return (
          legislator.state === districtFromZip.state &&
          legislator.district === districtFromZip.district
        );
      }

      // Handle ZIP code search for Senate members
      if (districtFromZip && chamber === "senate") {
        return legislator.state === districtFromZip.state;
      }

      // Handle name search if no ZIP match and search term exists
      if (searchTerm && !districtFromZip) {
        return legislator.name.toLowerCase().includes(searchTerm.toLowerCase());
      }

      return true;
    })
    .sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1;
      switch (sortField) {
        case "name":
          return direction * a.name.localeCompare(b.name);
        case "rank": {
          if (selectedIssue !== "all") return 0;
          return direction * (a.partyRank - b.partyRank);
        }
        case "score": {
          let scoreA =
            selectedIssue === "all"
              ? a.les
              : a.iles[selectedIssue.toLowerCase().replace(/\s+/g, "")] ?? 0;
          let scoreB =
            selectedIssue === "all"
              ? b.les
              : b.iles[selectedIssue.toLowerCase().replace(/\s+/g, "")] ?? 0;
          return direction * (scoreA - scoreB);
        }
        default:
          return 0;
      }
    });

  // Only group by party when sorting by score
  const shouldGroupByParty = sortField === "score";

  let displayLegislators;
  if (shouldGroupByParty) {
    // Get party order for current congress and chamber
    const partyOrderForCongress = getFederalPartyOrder(
      parseInt(congress),
      chamber
    );

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
                {partyNames[party]}
              </div>
              {groupedLegislators[party].map((legislator) => (
                <FederalLegislatorRow
                  key={legislator.bioguide}
                  legislator={legislator}
                  selectedIssue={selectedIssue}
                  onClick={() => onLegislatorSelect(legislator)}
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
          <FederalLegislatorRow
            key={legislator.bioguide}
            legislator={legislator}
            selectedIssue={selectedIssue}
            onClick={() => onLegislatorSelect(legislator)}
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
    <div className="flex-1 flex flex-col bg-card rounded-lg border min-w-[780px] overflow-x-auto">
      <div className="sticky top-0 z-10 bg-card rounded-t-lg">
        <div className="flex border-b">
          <div className="w-[400px] p-4">
            <ColumnHeader
              type="federal"
              label="Name"
              sortField="name"
              currentSort={sortField}
              direction={sortDirection}
              onSort={handleSort}
            />
          </div>
          <div className="w-[120px] p-4">
            <ColumnHeader
              type="federal"
              label="Party Rank"
              sortField="rank"
              currentSort={sortField}
              direction={sortDirection}
              onSort={handleSort}
              disableSort={selectedIssue !== "all"}
              className={cn(
                selectedIssue !== "all" && "opacity-50 cursor-not-allowed"
              )}
            />
          </div>
          <div className="w-[120px] p-4">
            <div
              className={cn(
                "font-medium",
                selectedIssue !== "all" && "opacity-50"
              )}
            >
              Benchmark
            </div>
          </div>
          <div className="w-[140px] p-4">
            <ColumnHeader
              type="federal"
              label="LES"
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
        {filteredLegislators.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No results found
          </div>
        )}
      </div>
    </div>
  );
}
