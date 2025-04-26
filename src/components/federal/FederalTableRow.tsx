import { VisTable } from "@/services/api.types";
import { TableCell, TableRow } from "../ui/table";
import { cn } from "@/lib/utils";
import { getExpectation, getExpectationColor } from "@/lib/expectations";
import { ExpectationIcon } from "../shared/ExpectationIcon";
import { partyColors } from "@/lib/colors";
import { ChevronRight } from "lucide-react";

interface FederalTableRowProps {
  row: VisTable;
  selectedIssue: string;
  onClick: () => void;
}

export function FederalTableRow({
  row,
  selectedIssue,
  onClick,
}: FederalTableRowProps) {
  const score =
    selectedIssue === "all"
      ? row.les
      : row.iles[selectedIssue.toLowerCase().replace(/\s+/g, "")] ?? 0;

  const isIssueSelected = selectedIssue !== "all";
  const isZeroScore = isIssueSelected && score === 0;

  // Only show expectation icon and color for overall LES scores
  const showExpectation = !isIssueSelected;
  const expectation = showExpectation
    ? getExpectation(score, row.benchmark)
    : null;
  const expectationColor = expectation
    ? getExpectationColor(expectation)
    : undefined;

  return (
    <TableRow
      onClick={onClick}
      className="relative cursor-pointer group hover:bg-muted/40"
    >
      {/* Name */}
      <TableCell className="pl-4 w-[25%]">
        <div className="font-medium">{row.name}</div>
      </TableCell>

      {/* Party */}
      <TableCell className="pl-4 w-[8%]">
        <span
          className={cn(
            "w-6 h-6 flex items-center justify-center rounded",
            partyColors[row.party]
          )}
        >
          {row.party}
        </span>
      </TableCell>

      {/* State */}
      <TableCell className="pl-4 w-[8%]">{row.state}</TableCell>

      {/* District */}
      <TableCell className="pl-4 font-mono w-[8%]">
        {row.district === 0 || row.chamber === "S" ? "—" : row.district}
      </TableCell>

      {/* Party Rank */}
      <TableCell
        className={cn(
          "pl-4 font-mono w-[12%]",
          isIssueSelected && "opacity-50"
        )}
      >
        {isIssueSelected ? "—" : `${row.partyRank}/${row.partyTotal}`}
      </TableCell>

      {/* Benchmark */}
      <TableCell
        className={cn(
          "pl-4 font-mono w-[12%]",
          isIssueSelected && "opacity-50"
        )}
      >
        {isIssueSelected ? "—" : row.benchmark.toFixed(3)}
      </TableCell>

      {/* LES + Expectation */}
      <TableCell className="pl-4 font-mono w-[15%]">
        <span
          style={showExpectation ? { color: expectationColor } : undefined}
          className={cn(isZeroScore && "opacity-50")}
        >
          {score.toFixed(3)}
        </span>
        {showExpectation && expectation && (
          <ExpectationIcon
            expectation={expectation}
            className="h-5 w-5 ml-2 inline-block"
            style={{ color: expectationColor }}
          />
        )}
      </TableCell>

      {/* Chevron */}
      <TableCell className="p-0 w-[5%] relative">
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <ChevronRight
            className={cn(
              "h-5 w-5 text-gray-400",
              "transition-all duration-200",
              "group-hover:text-gray-600 group-hover:translate-x-1"
            )}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}
