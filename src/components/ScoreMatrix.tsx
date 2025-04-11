import type { ScoreMatrix } from "@/services/api.types";
import { Fragment } from "react/jsx-runtime";

export interface ScoreMatrixProps {
  matrix: ScoreMatrix;
}

export function ScoreMatrix({ matrix }: ScoreMatrixProps) {
  const rows = ["BILL", "AIC", "ABC", "PASS", "LAW"];
  const cols = ["C", "S", "SS"];

  const getValue = (row: string, col: string): number => {
    const prefix = col.toLowerCase();
    const suffix = row.toLowerCase();
    const key = `${prefix}_${suffix}` as keyof ScoreMatrix;
    return matrix[key];
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-[auto,1fr,1fr,1fr] gap-1 bg-white">
        <div className="bg-background p-4" /> {/* Empty corner cell */}
        {cols.map((col) => (
          <div
            key={col}
            className="bg-background p-4 text-center text-muted-foreground font-medium"
          >
            {col}
          </div>
        ))}
        {rows.map((row) => (
          <Fragment key={row}>
            <div
              key={`${row}-label`}
              className="bg-background p-4 text-left text-muted-foreground font-medium"
            >
              {row}
            </div>
            {cols.map((col) => (
              <div
                key={`${row}-${col}`}
                className="bg-gray-50 py-6 px-4 text-center text-foreground font-mono text-2xl"
              >
                {getValue(row, col)}
              </div>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
