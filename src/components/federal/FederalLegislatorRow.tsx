import type { VisTable } from "@/services/api.types";
import { ExpectationIcon } from "../ExpectationIcon";
import { getExpectation, getExpectationColor } from "@/lib/expectations";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FederalLegislatorRowProps {
  legislator: VisTable;
  selectedIssue?: string;
  onClick: () => void;
}

export function FederalLegislatorRow({ legislator, selectedIssue = 'all', onClick }: FederalLegislatorRowProps) {
  const locationText = legislator.chamber === 'S'
    ? legislator.state
    : `${legislator.state}-${legislator.district}`;

  const score = selectedIssue === 'all' 
    ? legislator.les 
    : (legislator.iles[selectedIssue.toLowerCase().replace(/\s+/g, '')] ?? 0);

  const isIssueSelected = selectedIssue !== 'all';
  const isZeroScore = isIssueSelected && score === 0;

  // Only show expectation icon and color for overall LES scores
  const showExpectation = !isIssueSelected;
  const expectation = showExpectation ? getExpectation(score, legislator.benchmark) : null;
  const expectationColor = expectation ? getExpectationColor(expectation) : undefined;

  const partyBgColor = {
    'R': 'bg-red-100',
    'D': 'bg-blue-100',
    'I': 'bg-gray-100'
  }[legislator.party];

  return (
    <div 
      className="hover:bg-gray-50 cursor-pointer transition-colors border-b last:border-b-0 group relative"
      onClick={onClick}
    >
      <div className="flex items-center pr-12">
        <div className="w-[400px] p-4">
          <div className="space-y-1">
            <div className="font-medium">
              {legislator.name}
            </div>
            <div className="text-sm text-muted-foreground flex gap-8 font-mono">
              <span className={cn(
                "w-6 h-6 flex items-center justify-center rounded",
                partyBgColor
              )}>
                {legislator.party}
              </span>
              <span>{locationText}</span>
            </div>
          </div>
        </div>
        <div className={cn(
          "w-[120px] p-4 flex items-center font-mono",
          isIssueSelected && "opacity-50"
        )}>
          {isIssueSelected ? (
            <span className="text-gray-500">N/A</span>
          ) : (
            <span className="whitespace-nowrap">
              {legislator.partyRank}/{legislator.partyTotal}
            </span>
          )}
        </div>
        <div className={cn(
          "w-[120px] p-4 flex items-center font-mono",
          isIssueSelected && "opacity-50"
        )}>
          {isIssueSelected ? (
            <span className="text-gray-500">N/A</span>
          ) : (
            <span>{legislator.benchmark.toFixed(3)}</span>
          )}
        </div>
        <div className="w-[120px] p-4 flex items-center">
          <span 
            className={cn(
              "font-mono text-lg",
              isZeroScore && "opacity-50"
            )}
            style={showExpectation ? { color: expectationColor } : undefined}
          >
            {score.toFixed(3)}
          </span>
          {showExpectation && expectation && (
            <ExpectationIcon 
              expectation={expectation} 
              className="h-5 w-5 ml-2"
              style={{ color: expectationColor }}
            />
          )}
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