import apiClient from "@/api/apiClient";
import AppDialog from "@/components/ui/app-dialog";
import { AppTabs } from "@/components/ui/app-tabs";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { DataTable, type PaginationMeta } from "@/components/ui/data-table";
import PageContainer from "@/components/ui/page-container";
import { useDashboardStream } from "@/hooks/useDashboardStream";
import { usePaginatedTable } from "@/hooks/usePaginatedTable";
import { useAlertStore } from "@/stores/alertStore";
import { extractApiError } from "@/utils/extractApiError";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { getQueueBoardColumns } from "../dashboard/columns/getQueueBoardColumns";
import type { Job } from "../dashboard/types/dashboard.type";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const isDev = import.meta.env.MODE === "development";

const EMPTY_PAGINATION: PaginationMeta = {
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 0,
  hasNext: false,
  hasPrev: false,
};

interface JobsResponse {
  data: Job[];
  pagination: PaginationMeta;
}

// Fetch jobs for a given channel + state, with pagination
const fetchJobs = async (
  channel: string,
  state: string,
  queryParams: Record<string, string>,
): Promise<JobsResponse> => {
  const response = await apiClient.get(`/notification/queue/jobs`, {
    params: { queue: channel, state, ...queryParams },
  });
  return {
    data: response.data.data,
    pagination: response.data.pagination,
  };
};

const JobList = ({ channel, state }: { channel: string; state: string }) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const showAlert = useAlertStore((s) => s.showAlert);
  const { lastEvent } = useDashboardStream();
  const queryClient = useQueryClient();

  // Pagination state + handlers
  const { onPageChange, onLimitChange, queryParams } = usePaginatedTable({
    initialLimit: 20,
  });

  // Fetch jobs with React Query, keyed by channel + state + pagination + lastEvent (for real-time updates)
  const { data, isLoading } = useQuery({
    // Key includes channel, state, pagination params, and lastEvent to refetch on new events
    queryKey: ["queue-jobs", channel, state, queryParams, lastEvent],
    // Query function calls our fetchJobs util with current channel, state, and pagination query params
    queryFn: () => fetchJobs(channel, state, queryParams),
    // Keep previous data while fetching next page — avoids table flicker
    placeholderData: (prev) => prev,
  });

  // Handler for delete button click - opens confirmation dialog
  const handleDeleteClick = (job: Job) => {
    setSelectedJob(job);
    setDeleteDialogOpen(true);
  };

  // Handler for confirming deletion of a notification
  const handleDelete = async () => {
    if (!selectedJob) return;
    try {
      const response = await apiClient.delete(
        `/notification/${selectedJob.id}`,
      );
      if (response.status === 200) {
        showAlert("SUCCESS", "Notification deleted successfully.", "success");
        // Close dialog and clear selected job
        setDeleteDialogOpen(false);
        setSelectedJob(null);
        // Invalidate to refetch after delete
        queryClient.invalidateQueries({
          queryKey: ["queue-jobs", channel, state],
        });
      }
    } catch (error) {
      const { code, message } = extractApiError(error);
      showAlert(code.split("_").join(" "), message, "error");
    }
  };

  // Columns definition, with delete handler passed in dev mode only
  const columns = getQueueBoardColumns(isDev ? handleDeleteClick : undefined);

  return (
    <Box className="mt-4">
      {/* Job List */}
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        pagination={data?.pagination ?? EMPTY_PAGINATION}
        isLoading={isLoading}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
      />

      {/* Delete Confirmation Dialog */}
      <AppDialog
        heading="Delete Notification"
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedJob(null);
        }}
        action={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setSelectedJob(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        Are you sure you want to delete notification{" "}
        <span className="font-mono text-xs">{selectedJob?.id}</span>? This
        cannot be undone.
      </AppDialog>
    </Box>
  );
};

const AllNotifications = () => {
  const { channel = "email" } = useParams();

  const tabs = [
    {
      value: "all",
      label: "All",
      content: <JobList channel={channel} state="all" />,
    },
    {
      value: "waiting",
      label: "Waiting",
      content: <JobList channel={channel} state="waiting" />,
    },
    {
      value: "active",
      label: "Active",
      content: <JobList channel={channel} state="active" />,
    },
    {
      value: "completed",
      label: "Completed",
      content: <JobList channel={channel} state="completed" />,
    },
    {
      value: "failed",
      label: "Failed",
      content: <JobList channel={channel} state="failed" />,
    },
  ];

  return (
    <PageContainer
      heading={`${channel.charAt(0).toUpperCase() + channel.slice(1)} Queue`}
    >
      <AppTabs tabs={tabs} queryKey="state" />
    </PageContainer>
  );
};

export default AllNotifications;
