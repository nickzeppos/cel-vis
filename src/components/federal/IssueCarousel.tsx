import { getIssueDisplayName } from "@/lib/display";
import { cn } from "@/lib/utils";

interface IssueCarouselProps {
  issues: Record<string, number>;
  selectedIssue: string;
  onIssueSelect: (issue: string) => void;
}

export function IssueCarousel({
  issues,
  selectedIssue,
  onIssueSelect,
}: IssueCarouselProps) {
  return (
    <div className="overflow-x-auto">
      <div className="flex space-x-2 py-2 pb-4 w-max">
        {Object.entries(issues).map(([issue, score]) => (
          <button
            key={issue}
            onClick={() => onIssueSelect(issue)}
            data-issue={issue}
            className={cn(
              "flex-none flex flex-col justify-between relative",
              "w-[120px] h-[120px] p-3 border rounded-md",
              "outline-none focus:outline-none focus-visible:outline-none",
              "before:absolute before:left-0 before:right-0 before:top-0",
              "before:border-t-[1px] before:transition-all before:ease-in-out before:duration-200",
              selectedIssue === issue
                ? [
                    "bg-gray-200 hover:bg-gray-200",
                    "border-accent hover:border-accent focus:border-accent",
                    "before:border-t-[16px] before:border-t-accent",
                  ]
                : [
                    "bg-gray-100 hover:bg-gray-200",
                    "border-border hover:border-accent focus:border-accent",
                    "before:border-t-transparent",
                  ]
            )}
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            <div className="flex-1 flex items-center justify-center">
              <span
                className={cn(
                  "text-sm font-medium text-center",
                  selectedIssue !== issue && "text-gray-600",
                  selectedIssue === issue && "text-foreground",
                  score === 0 && "opacity-50"
                )}
              >
                {getIssueDisplayName(issue)}
              </span>
            </div>
            <div className="flex items-center justify-center">
              <span
                className={cn(
                  "font-mono text-sm",
                  selectedIssue !== issue && "text-gray-600",
                  selectedIssue === issue && "text-foreground",
                  score === 0 && "opacity-50"
                )}
              >
                {score.toFixed(3)}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
