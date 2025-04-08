import { ArrowDownIcon, ArrowUpIcon, ArrowUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ColumnHeaderProps {
  label: string;
  sortField: string;
  currentSort: string;
  direction: 'asc' | 'desc';
  onSort: (field: any) => void;
  disabled?: boolean;
  className?: string;
}

export function ColumnHeader({
  label,
  sortField,
  currentSort,
  direction,
  onSort,
  disabled = false,
  className,
}: ColumnHeaderProps) {
  const isActive = currentSort === sortField;

  return (
    <button
      className={cn(
        "font-medium flex items-center gap-2 w-full p-0",
        "appearance-none bg-transparent border-0",
        "hover:text-gray-900 transition-colors",
        "focus:outline-none focus-visible:outline-none",
        isActive ? "text-gray-900" : "text-gray-600",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      onClick={() => !disabled && onSort(sortField)}
      disabled={disabled}
    >
      <span className="whitespace-nowrap">{label}</span>
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
    </button>
  );
}