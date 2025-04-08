import { cn } from "@/lib/utils";
import { ExpectationIcon } from "./ExpectationIcon";
import { Expectation } from "@/lib/expectations";
import { forwardRef } from "react";

export interface ScoreButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  score: number;
  isSelected: boolean;
  expectation?: Expectation;
  color?: string;
  onClick: () => void;
}

export const ScoreButton = forwardRef<HTMLButtonElement, ScoreButtonProps>(({
  title,
  score,
  isSelected,
  expectation,
  color,
  onClick,
  ...props
}, ref) => {
  const isZeroScore = score === 0;

  return (
    <button
      ref={ref}
      onClick={onClick}
      className={cn(
        "w-full text-left px-4 py-3 relative rounded-md",
        "outline-none focus:outline-none focus-visible:outline-none",
        "border transition-colors",
        "before:absolute before:left-0 before:top-0 before:bottom-0",
        "before:border-l-[1px] before:transition-all before:ease-in-out before:duration-200",
        isSelected 
          ? [
              "bg-gray-200 hover:bg-gray-200",
              "border-accent hover:border-accent focus:border-accent",
              "before:border-l-[16px] before:border-l-accent"
            ]
          : [
              "bg-gray-100 hover:bg-gray-200",
              "border-border hover:border-accent focus:border-accent",
              "before:border-l-transparent"
            ]
      )}
      style={{ WebkitTapHighlightColor: 'transparent' }}
      {...props}
    >
      <div className="flex items-center justify-between h-full">
        <div className={cn(
          "transition-transform ease-in-out duration-200",
          isSelected ? "translate-x-4" : "translate-x-0"
        )}>
          <span className={cn(
            "font-medium",
            !isSelected && "text-gray-600",
            isSelected && "text-foreground",
            isZeroScore && "opacity-50"
          )}>
            {title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className={cn(
            "font-mono text-lg min-w-[72px] text-right",
            !isSelected && "text-gray-600",
            isSelected && "text-foreground",
            isZeroScore && "opacity-50"
          )} style={isSelected && color ? { color } : undefined}>
            {score.toFixed(3)}
          </span>
          {expectation && (
            <ExpectationIcon 
              expectation={expectation} 
              className={cn(
                "h-5 w-5",
                !isSelected && "text-gray-600",
                isZeroScore && "opacity-50"
              )}
              style={isSelected && color ? { color } : undefined}
            />
          )}
        </div>
      </div>
    </button>
  );
});

ScoreButton.displayName = "ScoreButton";