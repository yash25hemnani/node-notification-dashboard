import apiClient from "@/api/apiClient";
import { AppTable } from "@/components/ui/app-table";
import { AppTabs } from "@/components/ui/app-tabs";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import PageContainer from "@/components/ui/page-container";
import { useDashboardStream } from "@/hooks/useDashboardStream";
import { useAlertStore } from "@/stores/alertStore";
import { extractApiError } from "@/utils/extractApiError";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQueueBoardColumns } from "../dashboard/columns/getQueueBoardColumns";
import type { Job } from "../dashboard/types/dashboard.type";
import AppDialog from "@/components/ui/app-dialog";

const isDev = import.meta.env.MODE === "development";

const JobList = ({ channel, state }: { channel: string; state: string }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const showAlert = useAlertStore((s) => s.showAlert);
  const { lastEvent } = useDashboardStream();

  const fetchJobs = async () => {
    try {
      const response = await apiClient.get(
        `/notification/queue/jobs?queue=${channel}&state=${state}`,
      );
      if (response.status === 200) {
        setJobs(response.data.data.jobs);
      }
    } catch (error) {
      const { code, message } = extractApiError(error);
      showAlert(code.split("_").join(" "), message, "error");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [channel, state, lastEvent]);

  const handleDeleteClick = (job: Job) => {
    setSelectedJob(job);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedJob) return;

    try {
      const response = await apiClient.delete(
        `/notification/${selectedJob.id}`,
      );

      if (response.status === 200) {
        showAlert("SUCCESS", "Notification deleted successfully.", "success");
        setDeleteDialogOpen(false);
        setSelectedJob(null);
        fetchJobs();
      }
    } catch (error) {
      const { code, message } = extractApiError(error);
      showAlert(code.split("_").join(" "), message, "error");
    }
  };

  const columns = getQueueBoardColumns(
    isDev ? handleDeleteClick : undefined, 
  );

  return (
    <Box className="mt-4">
      <AppTable columns={columns} rows={jobs} emptyMessage="No jobs found." />

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