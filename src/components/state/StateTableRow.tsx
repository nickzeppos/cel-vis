import { TableRow, TableCell } from "@/components/ui/table";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExpectationIcon } from "@/components/shared/ExpectationIcon";
import { getExpectation, getExpectationColor } from "@/lib/expectations";
import { StateVisTable } from "@/services/api.types";
import { partyColors } from "@/lib/colors";
import { getStateLocationText } from "@/lib/display";

interface StateTableRowProps {
  row: StateVisTable;
  onClick: () => void;
}

export function StateTableRow({ row, onClick }: StateTableRowProps) {
  const locationText = getStateLocationText(row.district);

  const expectation = getExpectation(row.sles, row.benchmark);
  const expectationColor = getExpectationColor(expectation);

  return (
    <TableRow
      onClick={onClick}
      className="relative cursor-pointer group hover:bg-muted/40"
    >
      {/* Name + Party + Location */}
      <TableCell className="w-[50%] p-4">
        <div className="font-medium">{row.name}</div>
        <div className="text-sm text-muted-foreground flex gap-8 font-mono">
          <span
            className={cn(
              "w-6 h-6 flex items-center justify-center rounded",
              partyColors[row.party]
            )}
          >
            {row.party}
          </span>
          <span>{locationText}</span>
        </div>
      </TableCell>

      {/* Party Rank */}
      <TableCell className="w-[15%] p-4 font-mono">
        {row.partyRank}/{row.partyTotal}
      </TableCell>

      {/* Benchmark */}
      <TableCell className="w-[15%] p-4 font-mono">
        {row.benchmark.toFixed(3)}
      </TableCell>

      {/* SLES + Expectation */}
      <TableCell className="w-[20%] p-4 font-mono">
        <span style={{ color: expectationColor }}>{row.sles.toFixed(3)}</span>
        <ExpectationIcon
          expectation={expectation}
          className="h-5 w-5 ml-2 inline-block"
          style={{ color: expectationColor }}
        />
      </TableCell>

      {/* Chevron */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <ChevronRight
          className={cn(
            "h-5 w-5 text-gray-400",
            "transition-all duration-200",
            "group-hover:text-gray-600 group-hover:translate-x-1"
          )}
        />
      </div>
    </TableRow>
  );
}
