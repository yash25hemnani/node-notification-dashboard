import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import type { Job } from "../types/dashboard.type";
import { Box } from "@/components/ui/box";

export const getQueueBoardColumns = (
  onDelete?: (job: Job) => void,
): ColumnDef<Job>[] => {
  const isDev = import.meta.env.VITE_ENV === "development";

  return [
    {
      accessorKey: "displayId",
      header: "ID",
      cell: ({ row }) => (
        <a
          href={`/notifications/${row.original.channel}/${row.original.displayId}/${row.original.id}`}
          className="font-mono text-xs underline"
        >
          {row.original.displayId ?? "—"}
        </a>
      ),
    },
    {
      accessorKey: "templateSlug",
      header: "Template",
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.original.templateSlug ?? "—"}</span>
      ),
    },
    {
      accessorKey: "customerEmail",
      header: "Sent To",
      cell: ({ row }) => (
        <span className="text-xs">{row.original.customerEmail ?? "—"}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`text-xs font-medium capitalize ${
            row.original.status === "completed"
              ? "text-green-500"
              : row.original.status === "failed"
                ? "text-red-500"
                : row.original.status === "active"
                  ? "text-blue-500"
                  : "text-yellow-500"
          }`}
        >
          {row.original.status}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Queued At",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {new Date(row.original.createdAt).toLocaleString()}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Box>
          {isDev && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete?.(row.original)}
              className="h-8 w-8 text-red-500 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </Box>
      ),
    },
  ];
};