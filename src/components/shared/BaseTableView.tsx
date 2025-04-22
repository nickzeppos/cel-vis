import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { container } from "@/lib/layout";

interface BaseTableViewProps {
  title: string;
  levelToggle: ReactNode;
  controlPanel: ReactNode;
  table: ReactNode;
  glossary: ReactNode;
  className?: string;
}

export function BaseTableView({
  title,
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
          <div className={cn(
            // Base styles
            "grid gap-4 sm:gap-6",
            
            // Mobile layout
            "grid-cols-1 grid-rows-[min-content_min-content_min-content] grid-areas-mobile",
            
            // Desktop layout (md+)
            "md:grid-cols-[minmax(328px,1fr)_minmax(600px,2fr)] md:grid-rows-[min-content_1fr] md:grid-areas-desktop"
          )}>
            {/* Control Panel */}
            <div className="grid-in-a space-y-4">
              {levelToggle}
              <div className="min-h-[400px]">
                {controlPanel}
              </div>
            </div>

            {/* Main Content */}
            <div className="grid-in-b space-y-4 min-h-[600px]">
              <h1 className="text-3xl font-bold">{title}</h1>
              {table}
            </div>

            {/* Glossary */}
            <div className="grid-in-c space-y-4">
              {glossary}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
