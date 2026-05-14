import { type AppTableColumn } from "@/components/ui/app-table";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { Subscription } from "../types/subscription.types";

interface Payload extends Subscription {
  count: number;
}

export const getSubscriptionColumns = (
  onDelete?: (subscription: Payload) => void,
): AppTableColumn<Payload>[] => {
  return [
    {
      key: "customerEmail",
      label: "Email",
      render: (row) => (
        <a
          href={`/subscriptions/${row.customerEmail}`}
          className="text-xs underline"
        >
          {row.customerEmail ?? "—"}
        </a>
      ),
    },
    {
      key: "customerId",
      label: "Customer ID",
      render: (row) => (
        <span className="font-mono text-xs">{row.customerId ?? "—"}</span>
      ),
    },
    {
      key: "count",
      label: "Subscriptions",
      render: (row) => <span className="text-xs font-medium">{row.count}</span>,
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <Box>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete?.(row)}
            className="h-8 w-8 text-red-500 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </Box>
      ),
    },
  ];
};
