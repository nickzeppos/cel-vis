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
  } else if (sortField === "state") {
    sorted = [...filtered].sort((a, b) => {
      // First compare by state based on the selected sort direction
      const stateComparison =
        sortDirection === "asc"
          ? a.state.localeCompare(b.state)
          : b.state.localeCompare(a.state);

      // If states are the same, always sort by district in ascending order
      if (stateComparison === 0 && chamber === "house") {
        // Convert district to number for comparison
        const districtA = a.district ? parseInt(a.district.toString()) : 0;
        const districtB = b.district ? parseInt(b.district.toString()) : 0;
        return districtA - districtB; // Always ascending
      }

      return stateComparison;
    });
  } else if (sortField === "district" && chamber === "house") {
    sorted = [...filtered].sort((a, b) => {
      const districtA = a.district ? a.district : 0;
      const districtB = b.district ? b.district : 0;

      return sortDirection === "asc"
        ? districtA - districtB
        : districtB - districtA;
    });
  } else if (sortField === "rank" && selectedIssue === "all") {
    sorted = [...filtered].sort((a, b) => {
      // Check if either row corresponds to independent
      const aHasRank = a.party !== "I";
      const bHasRank = b.party !== "I";

      // If one has rank and the other doesn't always anchor I rows to bottom
      if (aHasRank && !bHasRank) return -1;
      if (!aHasRank && bHasRank) return 1;

      // if both have no rank (i.e., both I), sort by score
      if (!aHasRank && !bHasRank) {
        return sortDirection === "asc" ? a.les - b.les : b.les - a.les;
      }

      // if both have ranks, normal ranked sort
      return sortDirection === "asc"
        ? a.partyRank - b.partyRank
        : b.partyRank - a.partyRank;
    });
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

  // sort on name, alpha
  if (sortField === "name") {
    sorted = [...filtered].sort((a, b) =>
      sortDirection === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );
    // sort on rank, numeric
  } else if (sortField === "rank") {
    // sorted =
    //   sortDirection === "asc"
    //     ? sortAscending(filtered, (l) => l.partyRank)
    //     : sortDescending(filtered, (l) => l.partyRank);
    sorted = [...filtered].sort((a, b) => {
      // check if either row corresponds to independent, 3rd party, or not affiliated
      const aHasRank = a.party !== "I" && a.party !== "3rd" && a.party !== "N";
      const bHasRank = b.party !== "I" && b.party !== "3rd" && b.party !== "N";

      // anchor non major parties to bottom
      if (aHasRank && !bHasRank) return -1;
      if (!aHasRank && bHasRank) return 1;

      // if both have no rank (i.e., both I or 3rd), sort by score
      if (!aHasRank && !bHasRank) {
        return sortDirection === "asc" ? a.sles - b.sles : b.sles - a.sles;
      }
      // if both have ranks, normal ranked sort
      return sortDirection === "asc"
        ? a.partyRank - b.partyRank
        : b.partyRank - a.partyRank;
    });

    // sort on score, numeric
  } else if (sortField === "score") {
    sorted =
      sortDirection === "asc"
        ? sortAscending(filtered, (l) => l.sles)
        : sortDescending(filtered, (l) => l.sles);
    // sort on district, numeric unless county format, then alpha + fixed numeric
  } else if (sortField === "district") {
    sorted = [...filtered].sort((a, b) => {
      const distA = parseDistrict(a.district);
      const distB = parseDistrict(b.district);

      // Handle alphanumeric districts (e.g., "1A", "1B", "2A")
      if (distA.isAlphanumeric || distB.isAlphanumeric) {
        // First compare by number
        const numberComparison =
          sortDirection === "asc"
            ? distA.number - distB.number
            : distB.number - distA.number;

        if (numberComparison !== 0) {
          return numberComparison;
        }

        // If numbers are the same, compare by letter
        const letterComparison =
          sortDirection === "asc"
            ? distA.letter.localeCompare(distB.letter)
            : distB.letter.localeCompare(distA.letter);

        if (letterComparison !== 0) {
          return letterComparison;
        }

        // If district values are identical, use name as tiebreaker
        return sortDirection === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }

      // Handle suffix format districts (e.g., "01-HAM", "02-HAM", "01-NOR")
      // Sort: suffix alpha → number within suffix → name tiebreaker
      if (distA.isSuffixFormat || distB.isSuffixFormat) {
        const suffixComparison =
          sortDirection === "asc"
            ? distA.county.localeCompare(distB.county)
            : distB.county.localeCompare(distA.county);

        if (suffixComparison !== 0) return suffixComparison;

        const numberComparison =
          sortDirection === "asc"
            ? distA.number - distB.number
            : distB.number - distA.number;

        if (numberComparison !== 0) return numberComparison;

        return sortDirection === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }

      // Handle county format districts (e.g., "Clark-1", "Capital")
      if (distA.isCountyFormat || distB.isCountyFormat) {
        const countyComparison =
          sortDirection === "asc"
            ? distA.county.localeCompare(distB.county)
            : distB.county.localeCompare(distA.county);

        if (countyComparison === 0) {
          return sortDirection === "asc"
            ? distA.number - distB.number
            : distB.number - distA.number;
        }

        return countyComparison;
      }

      // Handle simple numeric districts
      return sortDirection === "asc"
        ? distA.number - distB.number
        : distB.number - distA.number;
    });
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

export function flattenGroupedRows(rows: GroupedFederalRow[]): VisTable[] {
  return rows
    .filter(
      (r): r is { type: "legislator"; data: VisTable } =>
        r.type === "legislator"
    )
    .map((r) => r.data);
}

// Helper fn for state district sort behavior
// Districts are most often just numbers, but in some cases they require specific handling
// E.g., In NV upper, districts are "Clark-1", "Clark-2", "Capital", etc.
// E.g., In MD lower, districts can be alphanumeric like "1A", "1B", "2A", etc.
// E.g., In MA, districts are "01-HAM", "02-HAM", "01-NOR" — sort by suffix alpha, then number within.

// Currently this just parse based. But you can easily imagine a config based approach, e.g., (state) => { ...rules... }
// Since this is the first instance of special handling, I'm sticking with parsing + ifs. But, if this grows, revisit.
const parseDistrict = (district: string | number) => {
  const distStr = district.toString();
  let isCountyFormat = false;
  let isAlphanumeric = false;

  // One of three ways it's special format:
  // (1) contains a hyphen — two sub-cases:
  //   (a) "NUMBER-TEXT" (e.g., "01-HAM"): sort by suffix alpha, then number — MA style
  //   (b) "TEXT-NUMBER" (e.g., "Clark-1"): sort by county name, then number — NV style
  if (distStr.includes("-")) {
    const [left, right] = distStr.split("-");
    const leftNum = parseInt(left);
    if (!isNaN(leftNum)) {
      // NUMBER-TEXT format (MA style)
      return {
        county: right.toUpperCase(),
        number: leftNum,
        letter: "",
        isCountyFormat: true,
        isAlphanumeric: false,
        isSuffixFormat: true,
      };
    }
    isCountyFormat = true;
    const number = parseInt(right);
    return {
      county: left,
      number,
      letter: "",
      isCountyFormat,
      isAlphanumeric,
      isSuffixFormat: false,
    };
  }

  // (2) is alphanumeric (e.g., "1A", "23B")
  const alphanumericMatch = distStr.match(/^(\d+)([A-Za-z])$/);
  if (alphanumericMatch) {
    isAlphanumeric = true;
    const number = parseInt(alphanumericMatch[1]);
    const letter = alphanumericMatch[2].toUpperCase();
    return {
      county: "",
      number,
      letter,
      isCountyFormat,
      isAlphanumeric,
      isSuffixFormat: false,
    };
  }

  // (3) is purely non-numeric (e.g., "Capital")
  if (isNaN(parseInt(distStr))) {
    isCountyFormat = true;
    return {
      county: distStr,
      number: 0,
      letter: "",
      isCountyFormat,
      isAlphanumeric,
      isSuffixFormat: false,
    };
  }

  // Otherwise, it's a simple numeric district
  return {
    county: "",
    number: parseInt(distStr),
    letter: "",
    isCountyFormat: false,
    isAlphanumeric: false,
    isSuffixFormat: false,
  };
};
