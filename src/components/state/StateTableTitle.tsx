import { Badge } from "@/components/ui/badge";
import { partyColors } from "@/lib/colors";
import { getStateChamberDisplayName } from "@/lib/display";
import { cn } from "@/lib/utils";
import { ArrowRight, Users } from "lucide-react";

interface SummaryStats {
  numLegislators: number;
  partyCounts: Record<string, number>;
  orderedParties: string[];
}

interface StateTableTitleProps {
  selectedState: string;
  selectedTerm: string;
  chamber: "upper" | "lower";
  summary: SummaryStats;
}

export function StateTableTitle({
  selectedState,
  selectedTerm,
  chamber,
  summary,
}: StateTableTitleProps) {
  const chamberLabel = getStateChamberDisplayName(chamber);
  const { numLegislators, partyCounts, orderedParties } = summary;
  if (selectedState === "") {
    return (
      <div className="flex flex-col gap-1 mb-4">
        <div className="text-sm text-muted-foreground">
          Select a state to view data.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 mb-4">
      {/* Breadcrumb Title */}
      <div className="text-2xl font-bold flex flex-wrap items-center gap-2">
        <span>{selectedState}</span>
        <ArrowRight className="h-5 w-5" />
        <span>{chamberLabel} Chamber</span>
        <ArrowRight className="h-5 w-5" />
        <span>{selectedTerm}</span>
      </div>

      {/* Stats Summary */}
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground items-center mt-1">
        <span className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          {numLegislators} legislators
        </span>
        <div className="flex gap-1 items-center">
          {orderedParties.map((party) =>
            partyCounts[party] ? (
              <Badge
                key={party}
                variant="outline"
                className={cn(
                  "items-center justify-center rounded",
                  partyColors[party as keyof typeof partyColors]
                )}
              >
                {party}: {partyCounts[party]}
              </Badge>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}
