import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import type { Subscription } from "../types/subscription.types";

interface Payload extends Subscription {
  count: number;
}

export const getSubscriptionColumns = (
  onDelete?: (subscription: Payload) => void,
): ColumnDef<Payload>[] => {
  return [
    {
      accessorKey: "customerEmail",
      header: "Email",
      cell: ({ row }) => (
        <a
          href={`/subscriptions/${row.original.customerEmail}`}
          className="text-xs underline"
        >
          {row.original.customerEmail ?? "—"}
        </a>
      ),
    },
    {
      accessorKey: "customerId",
      header: "Customer ID",
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.original.customerId ?? "—"}</span>
      ),
    },
    {
      accessorKey: "count",
      header: "Subscriptions",
      cell: ({ row }) => (
        <span className="text-xs font-medium">{row.original.count}</span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Box>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete?.(row.original)}
            className="h-8 w-8 text-red-500 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </Box>
      ),
    },
  ];
};