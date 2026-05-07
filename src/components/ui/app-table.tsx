import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface AppTableColumn<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface AppTableProps<T> {
  columns: AppTableColumn<T>[];
  rows: T[];
  emptyMessage?: string;
}

export function AppTable<T extends Record<string, any>>({
  columns,
  rows,
  emptyMessage = "No results found.",
}: AppTableProps<T>) {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50 border-none">
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3"
              >
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center text-sm text-muted-foreground py-16"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className="hover:bg-muted/30 transition-colors border-b border-border/50 last:border-0"
              >
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    className="px-4 py-3 text-sm text-foreground"
                  >
                    {col.render ? col.render(row) : (row[col.key] ?? "—")}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
