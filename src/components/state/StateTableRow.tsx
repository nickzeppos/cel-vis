import { ExpectationIcon } from "@/components/shared/ExpectationIcon";
import { TableCell, TableRow } from "@/components/ui/table";
import { partyColors } from "@/lib/colors";
import { getExpectation, getExpectationColor } from "@/lib/expectations";
import { cn } from "@/lib/utils";
import { StateVisTable } from "@/services/api.types";
import { ChevronRight } from "lucide-react";

interface StateTableRowProps {
  row: StateVisTable;
  onClick: () => void;
}

export function StateTableRow({ row, onClick }: StateTableRowProps) {
  // const locationText = getStateLocationText(row.district);
  const expectation = getExpectation(row.sles, row.benchmark);
  const expectationColor = getExpectationColor(expectation);

  return (
    <TableRow
      onClick={onClick}
      className="relative cursor-pointer group hover:bg-muted/40"
    >
      {/* Name */}
      <TableCell className="w-[35%] pl-4 sticky left-0 bg-card/95 z-10 border-r border-border/80 after:absolute after:right-0 after:top-0 after:h-full after:w-[1px] after:shadow-[0_0_8px_rgba(0,0,0,0.1)]">
        <div className="font-medium">{row.name}</div>
      </TableCell>

      {/* Party */}
      <TableCell className="w-[8%] pl-4">
        <span
          className={cn(
            "w-6 h-6 flex items-center justify-center rounded",
            partyColors[row.party]
          )}
        >
          {row.party}
        </span>
      </TableCell>

      {/* District */}
      <TableCell className="w-[12%] pl-4 font-mono">{row.district}</TableCell>

      {/* Party Rank */}
      <TableCell className="w-[15%] pl-4 font-mono">
        {row.partyRank}/{row.partyTotal}
      </TableCell>

      {/* Benchmark */}
      <TableCell className="w-[10%] pl-4 font-mono">
        {row.benchmark.toFixed(3)}
      </TableCell>

      {/* SLES + Expectation */}
      <TableCell className="w-[15%] pl-4 font-mono">
        <div className="flex items-center whitespace-nowrap">
          <span style={{ color: expectationColor }}>{row.sles.toFixed(3)}</span>
          <ExpectationIcon
            expectation={expectation}
            className="h-4 w-4 ml-2 flex-shrink-0"
            style={{ color: expectationColor }}
          />
        </div>
      </TableCell>

      {/* Chevron */}
      <TableCell className="w-[5%] p-0 relative">
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
