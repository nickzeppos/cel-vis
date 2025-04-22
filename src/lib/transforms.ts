import type {
  VisTable,
  StateVisTable,
  CongressionalDistrict,
} from "@/services/api.types";
import type {
  GroupedFederalRow,
  GroupedStateRow,
  FederalChamber,
  SortDirection,
  SortField,
} from "@/lib/types";
import { getFederalPartyOrder, getStatePartyOrder } from "@/lib/parties";
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

export function getStateTableRows({
  legislators,
  chamber,
  searchTerm,
  sortField,
  sortDirection,
}: {
  legislators: StateVisTable[];
  chamber: "upper" | "lower";
  searchTerm: string;
  sortField: SortField;
  sortDirection: SortDirection;
}): GroupedStateRow[] {
  // Filter
  const filtered = legislators.filter((legislator) => {
    if (legislator.chamber !== chamber) return false;

    if (searchTerm) {
      return legislator.name.toLowerCase().includes(searchTerm.toLowerCase());
    }

    return true;
  });

  // Sort
  let sorted: StateVisTable[] = [];

  if (sortField === "name") {
    sorted = [...filtered].sort((a, b) =>
      sortDirection === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );
  } else if (sortField === "rank") {
    sorted =
      sortDirection === "asc"
        ? sortAscending(filtered, (l) => l.partyRank)
        : sortDescending(filtered, (l) => l.partyRank);
  } else if (sortField === "score") {
    sorted =
      sortDirection === "asc"
        ? sortAscending(filtered, (l) => l.sles)
        : sortDescending(filtered, (l) => l.sles);
  } else {
    sorted = filtered;
  }

  // Group by party if score sort
  if (sortField === "score") {
    const grouped: Record<string, StateVisTable[]> = {};
    for (const leg of sorted) {
      const p = leg.party;
      if (!grouped[p]) grouped[p] = [];
      grouped[p].push(leg);
    }

    const order = getStatePartyOrder(legislators, chamber);
    const output: GroupedStateRow[] = [];

    for (const party of order) {
      if (grouped[party]?.length) {
        output.push({ type: "group", party });
        for (const leg of grouped[party]) {
          output.push({ type: "legislator", data: leg });
        }
      }
    }

    return output;
  }

  // Flat row list
  return sorted.map((l) => ({ type: "legislator", data: l }));
}
