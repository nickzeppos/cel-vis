import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { container } from "@/lib/layout";

interface BaseTableViewProps {
  levelToggle: ReactNode;
  controlPanel: ReactNode;
  table: ReactNode;
  glossary: ReactNode;
  className?: string;
}

export function BaseTableView({
  levelToggle,
  controlPanel,
  table,
  glossary,
  className,
}: BaseTableViewProps) {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      <div className="relative flex flex-col items-center px-4 py-8">
        <div className={cn("w-full", `max-w-[${container.maxWidth}px]`)}>
          <div
            className={cn(
              // Base styles
              "grid gap-4 sm:gap-6",

              // Mobile layout
              "grid-cols-1 grid-rows-[min-content_1fr_min-content] grid-areas-mobile",

              // Desktop layout (md+)
              "md:grid-cols-[minmax(328px,1fr)_minmax(600px,2fr)] md:grid-rows-[min-content_1fr] md:grid-areas-desktop"
            )}
          >
            {/* Control Panel */}
            <div className="grid-in-a space-y-4">
              {levelToggle}
              <div className="md:h-[calc(100%-56px)]">{controlPanel}</div>
            </div>

            {/* Main Content - Table */}
            <div className="grid-in-b space-y-4 flex flex-col h-full md:max-h-[700px]">
              {table}
            </div>

            {/* Glossary */}
            <div className="grid-in-c space-y-4">{glossary}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
