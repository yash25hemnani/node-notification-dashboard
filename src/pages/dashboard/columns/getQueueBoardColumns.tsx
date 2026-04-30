import { type AppTableColumn } from "@/components/ui/app-table";
import type { Job } from "../types/dashboard.type";

export const getQueueBoardColumns = (): AppTableColumn<Job>[] => {
  return [
    {
      key: "displayId",
      label: "ID",
      render: (row) => (
        <span className="font-mono text-xs">{row.displayId ?? "—"}</span>
      ),
    },
    {
      key: "templateSlug",
      label: "Template",
      render: (row) => (
        <span className="font-mono text-xs">{row.templateSlug ?? "—"}</span>
      ),
    },
    {
      key: "customerEmail",
      label: "Sent To",
      render: (row) => (
        <span className="text-xs">{row.customerEmail ?? "—"}</span>
      ),
    },
    {  
      key: "status",
      label: "Status",
      render: (row) => (
        <span className={`text-xs font-medium capitalize ${
          row.status === "completed"       ? "text-green-500"  :
          row.status === "failed"     ? "text-red-500"    :
          row.status === "active" ? "text-blue-500"   :
          "text-yellow-500"
        }`}>
          {row.status}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Queued At",
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {new Date(row.createdAt).toLocaleString()}
        </span>
      ),
    },
  ];
};