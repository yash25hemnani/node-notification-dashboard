import apiClient from "@/api/apiClient";
import { AppTable } from "@/components/ui/app-table";
import { AppTabs } from "@/components/ui/app-tabs";
import PageContainer from "@/components/ui/page-container";
import { useDashboardStream } from "@/hooks/useDashboardStream";
import { useAlertStore } from "@/stores/alertStore";
import { extractApiError } from "@/utils/extractApiError";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQueueBoardColumns } from "./columns/getQueueBoardColumns";
import type { Job } from "./types/dashboard.type";
import { Box } from "@/components/ui/box";

const JobList = ({ channel, state }: { channel: string; state: string }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const showAlert = useAlertStore((s) => s.showAlert);
  const { lastEvent } = useDashboardStream();

  const fetchJobs = async () => {
    try {
      const response = await apiClient.get(
        `/dashboard/queue/jobs?queue=${channel}&state=${state}`,
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

  const columns = getQueueBoardColumns();

  return (
    <Box className="mt-4">
      <AppTable columns={columns} rows={jobs} emptyMessage="No jobs found." />;
    </Box>
  );
};

const QueueBoard = () => {
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

export default QueueBoard;
