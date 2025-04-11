import { ArrowDownIcon, ArrowUpIcon, ArrowUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { SortField } from "@/lib/types";

interface ColumnHeaderProps {
  label: string;
  sortField: SortField;
  currentSort: SortField;
  direction: 'asc' | 'desc';
  onSort: (field: SortField) => void;
  type: 'federal' | 'state';
  className?: string;
  disableSort?: boolean;
}

export function ColumnHeader({
  label,
  sortField,
  currentSort,
  direction,
  onSort,
  type,
  className,
  disableSort = false,
}: ColumnHeaderProps) {
  const isActive = currentSort === sortField;
  const isSortable = !disableSort;

  return (
    <button
      className={cn(
        "font-medium flex items-center gap-2 w-full p-0",
        "appearance-none bg-transparent border-0",
        "hover:text-gray-900 transition-colors",
        "focus:outline-none focus-visible:outline-none",
        isActive ? "text-gray-900" : "text-gray-600",
        !isSortable && "cursor-not-allowed opacity-50",
        className
      )}
      onClick={() => isSortable && onSort(sortField)}
      disabled={!isSortable}
    >
      <span className="whitespace-nowrap">{label}</span>
      {isSortable && (
        <div className="flex-shrink-0">
          {isActive ? (
            direction === 'asc' ? (
              <ArrowUpIcon className="h-4 w-4" />
            ) : (
              <ArrowDownIcon className="h-4 w-4" />
            )
          ) : (
            <ArrowUpDownIcon className="h-4 w-4 opacity-50" />
          )}
        </div>
      )}
    </button>
  );
}