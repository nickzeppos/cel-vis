import { cn } from "@/lib/utils";
import type { ViewLevel } from "@/lib/types";

interface LevelToggleProps {
  level: ViewLevel;
  onLevelChange: (level: ViewLevel) => void;
}

export function LevelToggle({ level, onLevelChange }: LevelToggleProps) {
  return (
    <div className="p-1 bg-secondary rounded-lg">
      <div className="w-full grid grid-cols-2 gap-2 h-14 bg-secondary rounded-lg relative">
        {/* Sliding background */}
        <div
          className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-accent rounded-md transition-transform duration-200 ease-in-out"
          style={{
            transform: `translateX(${
              level === "state" ? "calc(100% + 8px)" : "0"
            })`,
          }}
        />

        {/* Toggle buttons */}
        <button
          onClick={() => onLevelChange("federal")}
          className={cn(
            "relative z-10 rounded-md transition-colors duration-200 font-medium bg-transparent",
            level === "federal"
              ? "text-white"
              : "text-gray-600 hover:text-gray-800"
          )}
        >
          Federal
        </button>
        <button
          onClick={() => onLevelChange("state")}
          className={cn(
            "relative z-10 rounded-md transition-colors duration-200 font-medium bg-transparent",
            level === "state"
              ? "text-white"
              : "text-gray-600 hover:text-gray-800"
          )}
        >
          State
        </button>
      </div>
    </div>
  );
}
