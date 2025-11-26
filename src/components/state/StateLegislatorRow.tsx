import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExpectationIcon } from "@/components/shared/ExpectationIcon";
import { getExpectation, getExpectationColor } from "@/lib/expectations";
import { StateVisTable } from "@/services/api.types";
import { partyColors } from "@/lib/colors";
import { getStateLocationText } from "@/lib/display";

interface StateLegislatorRowProps {
  legislator: StateVisTable;
  onClick: () => void;
}

export function StateLegislatorRow({
  legislator,
  onClick,
}: StateLegislatorRowProps) {
  const locationText = getStateLocationText(legislator.district);

  const expectation = getExpectation(legislator.sles, legislator.benchmark);
  const expectationColor = getExpectationColor(expectation);

  return (
    <div
      className="hover:bg-gray-50 cursor-pointer transition-colors border-b last:border-b-0 group relative"
      onClick={onClick}
    >
      <div className="flex items-center pr-12">
        <div className="w-[400px] pl-4">
          <div className="space-y-1">
            <div className="font-medium">{legislator.name}</div>
            <div className="text-sm text-muted-foreground flex gap-8 font-mono">
              <span
                className={cn(
                  "w-6 h-6 flex items-center justify-center rounded",
                  partyColors[legislator.party]
                )}
              >
                {legislator.party}
              </span>
              <span>{locationText}</span>
            </div>
          </div>
        </div>
        <div className="w-[140px] pl-4 flex items-center font-mono">
          <span className="whitespace-nowrap">
            {legislator.partyRank}/{legislator.partyTotal}
          </span>
        </div>
        <div className="w-[120px] pl-4 flex items-center font-mono">
          <span>
            {legislator.benchmark === null
              ? "—"
              : legislator.benchmark.toFixed(3)}
          </span>
        </div>
        <div className="w-[120px] pl-4 flex items-center">
          <span
            className="font-mono text-lg"
            style={{ color: expectationColor }}
          >
            {legislator.sles.toFixed(3)}
          </span>
          <ExpectationIcon
            expectation={expectation}
            className="h-5 w-5 ml-2"
            style={{ color: expectationColor }}
          />
        </div>
      </div>

      {/* Chevron positioned absolutely on the right */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <ChevronRight
          className={cn(
            "h-5 w-5 text-gray-400",
            "transition-all duration-200",
            "group-hover:text-gray-600 group-hover:translate-x-1"
          )}
        />
      </div>
    </div>
  );
}
