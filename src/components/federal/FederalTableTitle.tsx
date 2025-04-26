import { ArrowRight, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  getIssueDisplayName,
  getCongressDisplayName,
  getChamberDisplayName,
} from "@/lib/display";
import { getFederalPartyOrder } from "@/lib/parties";
import { cn } from "@/lib/utils";
import { partyColors } from "@/lib/colors";

interface SummaryStats {
  numLegislators: number;
  partyCounts: Record<string, number>;
}

interface FederalTableTitleProps {
  congress: string;
  chamber: "house" | "senate";
  state: string;
  selectedIssue: string;
  summary: SummaryStats;
}

export function FederalTableTitle({
  congress,
  chamber,
  state,
  selectedIssue,
  summary,
}: FederalTableTitleProps) {
  const isAllStates = state === "all";
  const chamberLabel = getChamberDisplayName(chamber);
  const congressLabel = `${getCongressDisplayName(
    parseInt(congress)
  )} Congress`;
  const issueLabel =
    selectedIssue === "all" ? "All Issues" : getIssueDisplayName(selectedIssue);

  const { numLegislators, partyCounts } = summary;
  const orderedParties = getFederalPartyOrder(parseInt(congress), chamber);

  return (
    <div className="flex flex-col gap-1 mb-1">
      {/* Breadcrumb Title */}
      <div className="text-2xl font-bold flex flex-wrap items-center gap-2">
        <span>{congressLabel}</span>
        <ArrowRight className="h-5 w-5" />
        {!isAllStates && <span>{state}</span>}
        {!isAllStates && <ArrowRight className="h-5 w-5" />}
        <span>{chamberLabel}</span>
        <ArrowRight className="h-5 w-5" />
        <span>{issueLabel}</span>
      </div>

      {/* Stats Summary */}
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground items-center mt-1">
        <span className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          {numLegislators} {chamber === "house" ? "Members" : "Senators"}
        </span>
        <div className="flex gap-1 items-center">
          {orderedParties.map((party) =>
            partyCounts[party] ? (
              <Badge
                key={party}
                variant={"outline"}
                className={cn(
                  "items-center justify-center rounded",
                  // Ugly b/c I was lazy with types in constructing config
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
