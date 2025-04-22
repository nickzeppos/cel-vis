import type { VisTable, CongressionalDistrict } from "@/services/api.types";
import type { GroupedFederalRow, FederalChamber, SortDirection, SortField } from "@/lib/types";
import { getFederalPartyOrder } from "@/lib/parties";
import { sortAscending, sortDescending } from "@/services/api.utils";

export function getFederalTableRows({
  legislators,
  chamber,
  stateFilter,
  searchTerm,
  districtFromZip,
  selectedIssue,
  sortField,
  sortDirection,
  congress,
}: {
  legislators: VisTable[];
  chamber: FederalChamber;
  stateFilter: string;
  searchTerm: string;
  districtFromZip: CongressionalDistrict | null;
  selectedIssue: string;
  sortField: SortField;
  sortDirection: SortDirection;
  congress: string;
}): GroupedFederalRow[] {
  // Filter
  const filtered = legislators.filter((legislator) => {
    if (chamber === "house" && legislator.chamber !== "H") return false;
    if (chamber === "senate" && legislator.chamber !== "S") return false;
    if (stateFilter !== "all" && legislator.state !== stateFilter) return false;

    if (districtFromZip && chamber === "house") {
      return (
        legislator.state === districtFromZip.state &&
        legislator.district === districtFromZip.district
      );
    }

    if (districtFromZip && chamber === "senate") {
      return legislator.state === districtFromZip.state;
    }

    if (searchTerm && !districtFromZip) {
      return legislator.name.toLowerCase().includes(searchTerm.toLowerCase());
    }

    return true;
  });

  // Sort
  let sorted: VisTable[] = [];

  if (sortField === "name") {
    sorted = [...filtered].sort((a, b) =>
      sortDirection === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );
  } else if (sortField === "rank" && selectedIssue === "all") {
    sorted =
      sortDirection === "asc"
        ? sortAscending(filtered, (l) => l.partyRank)
        : sortDescending(filtered, (l) => l.partyRank);
  } else if (sortField === "score") {
    const getScore = (l: VisTable) =>
      selectedIssue === "all"
        ? l.les
        : l.iles[selectedIssue.toLowerCase().replace(/\s+/g, "")] ?? 0;
  
    sorted =
      sortDirection === "asc"
        ? sortAscending(filtered, getScore)
        : sortDescending(filtered, getScore);
  } else {
    sorted = filtered;
  }

  // Group (only if score sorting)
  if (sortField === "score") {
    const byParty: Record<string, VisTable[]> = {};
    for (const leg of sorted) {
      const p = leg.party;
      if (!byParty[p]) byParty[p] = [];
      byParty[p].push(leg);
    }

    const order = getFederalPartyOrder(parseInt(congress), chamber);
    const output: GroupedFederalRow[] = [];

    for (const party of order) {
      if (byParty[party]?.length) {
        output.push({ type: "group", party });
        for (const leg of byParty[party]) {
          output.push({ type: "legislator", data: leg });
        }
      }
    }

    return output;
  }

  // Otherwise: flat list
  return sorted.map((l) => ({ type: "legislator", data: l }));
}
