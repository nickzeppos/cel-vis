import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ColumnHeader } from "./ColumnHeader";
import { SortDirection, SortField } from "@/lib/types";


interface BaseTableProps<T> {
  className?: string;
  minWidth?: string;
  type?: "federal" | "state";
  headers: Array<{
    name: string;
    width: string;
    sortField?: SortField;
    currentSort?: SortField;
    direction?: SortDirection;
    onSort?: (field: SortField) => void;
    disabled?: boolean;
    className?: string;
  }>;
  data?: Array<any>;
  TableRowComponent: React.ComponentType<{ key: string, row: T }>;
  emptyState?: React.ReactNode;
}

export function BaseTable<T>({
  className,
  minWidth = "800px",
  data,
  headers,
  emptyState,
  TableRowComponent,
  type = "federal",
}: BaseTableProps<T>) {
  return (
    <div className={cn("rounded-lg border bg-card min-h-[500px] overflow-hidden flex flex-col", className)}>
      <div className={cn("w-full", minWidth && `min-w-[${minWidth}]`)}>
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
  <TableHead 
  key={header.name}
  className={cn(header.width, header.className)}
>
  <div className="px-2 py-3">
    {header.sortField && header.onSort ? (
      <ColumnHeader
        label={header.name}
        sortField={header.sortField}
        currentSort={header.currentSort!}
        direction={header.direction!}
        onSort={header.onSort}
        type={type}
        className={header.className}
        disableSort={header.disabled}
      />
    ) : (
      <div className="font-medium">{header.name}</div>
    )}
  </div>
</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(data) && data.length > 0 ? data.map((row, index) => (
              <TableRowComponent key={index.toString()} row={row} />
            )) : (
              <TableRow>
                <TableCell colSpan={headers.length} className="h-[400px]">
                  <div className="flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      {emptyState || "No data available"}
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
