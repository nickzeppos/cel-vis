import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MapProps {
  selectedState: string;
  onStateSelect: (state: string) => void;
  isAvailable?: (stateCode: string) => boolean;
}

export interface TileMap {
  [state: string]: [number, number] // [col, row]
}

export const states: TileMap = {
  AK: [0, 0],
  ME: [11, 0],
  WI: [6, 1],
  VT: [10, 1],
  NH: [11, 1],
  WA: [1, 2],
  ID: [2, 2],
  MT: [3, 2],
  ND: [4, 2],
  MN: [5, 2],
  IL: [6, 2],
  MI: [7, 2],
  NY: [9, 2],
  MA: [10, 2],
  RI: [11, 2],
  OR: [1, 3],
  NV: [2, 3],
  WY: [3, 3],
  SD: [4, 3],
  IA: [5, 3],
  IN: [6, 3],
  OH: [7, 3],
  PA: [8, 3],
  NJ: [9, 3],
  CT: [10, 3],
  CA: [1, 4],
  UT: [2, 4],
  CO: [3, 4],
  NE: [4, 4],
  MO: [5, 4],
  KY: [6, 4],
  WV: [7, 4],
  VA: [8, 4],
  MD: [9, 4],
  DE: [10, 4],
  AZ: [2, 5],
  NM: [3, 5],
  KS: [4, 5],
  AR: [5, 5],
  TN: [6, 5],
  NC: [7, 5],
  SC: [8, 5],
  OK: [4, 6],
  LA: [5, 6],
  MS: [6, 6],
  AL: [7, 6],
  GA: [8, 6],
  HI: [0, 7],
  TX: [4, 7],
  FL: [9, 7],
};

// Create a grid based on the coordinates
const maxRows = Math.max(...Object.values(states).map(([_, row]) => row)) + 1;
const maxCols = Math.max(...Object.values(states).map(([col, _]) => col)) + 1;

const stateGrid = Array.from({ length: maxRows }, () => 
  Array.from({ length: maxCols }, () => null)
);

// Fill the grid with states
Object.entries(states).forEach(([stateCode, [col, row]]) => {
  stateGrid[row][col] = { id: stateCode };
});

export function Map({ selectedState, onStateSelect, isAvailable }: MapProps) {
  return (
    <div className="w-full flex justify-center">
      <div className="inline-grid gap-0.5" style={{
        gridTemplateColumns: `repeat(${maxCols}, 20px)`,
        gridTemplateRows: `repeat(${maxRows}, 20px)`
      }}>
        {stateGrid.map((row, rowIndex) => (
          row.map((state, colIndex) => (
            state ? (
              <TooltipProvider key={`${rowIndex}-${colIndex}`}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => {
                        if (!isAvailable || isAvailable(state.id)) {
                          onStateSelect(state.id === selectedState ? 'all' : state.id);
                        }
                      }}
                      className={cn(
                        "w-5 h-5 text-[9px] font-medium transition-colors",
                        "rounded flex items-center justify-center",
                        "focus:outline-none focus-visible:outline-none",
                        "border-none appearance-none",
                        selectedState === state.id
                          ? "bg-accent text-accent-foreground hover:bg-accent/90"
                          : isAvailable
                            ? isAvailable(state.id)
                              ? "bg-gray-100 text-gray-600 hover:bg-accent/20 hover:text-gray-800"
                              : [
                                  "bg-gray-100/25 text-gray-400/25 cursor-not-allowed",
                                  "hover:bg-gray-100/25 hover:text-gray-400/25"
                                ]
                            : "bg-gray-100 text-gray-600 hover:bg-accent/20 hover:text-gray-800"
                      )}
                      style={{
                        gridRow: rowIndex + 1,
                        gridColumn: colIndex + 1
                      }}
                      disabled={isAvailable && !isAvailable(state.id)}
                    >
                      {state.id}
                    </button>
                  </TooltipTrigger>
                  {isAvailable && !isAvailable(state.id) && (
                    <TooltipContent>
                      <p>Scores coming soon!</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            ) : (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="w-5 h-5"
                style={{
                  gridRow: rowIndex + 1,
                  gridColumn: colIndex + 1
                }}
              />
            )
          ))
        ))}
      </div>
    </div>
  );
}