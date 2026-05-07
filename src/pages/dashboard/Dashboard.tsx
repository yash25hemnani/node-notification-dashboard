// pages/QueueDashboard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Box } from "@/components/ui/box";
import PageContainer from "@/components/ui/page-container";
import { Badge } from "@/components/ui/badge";
import { useDashboardStream } from "@/hooks/useDashboardStream";
import { useNavigate } from "react-router-dom";

const StatCard = ({
  label,
  value,
  color,
  channel,
}: {
  label: string;
  value: number;
  color: string;
  channel: string;
}) => {
  const navigate = useNavigate();

  return (
    <Card
      className="flex-1 hover:cursor-pointer"
      onClick={() =>
        navigate(`/notifications/${channel}/?state=${label.toLowerCase()}`)
      }
    >
      <CardContent className="py-4 px-5">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className={`text-2xl font-semibold ${color}`}>{value}</p>
      </CardContent>
    </Card>
  );
};

const QueueSection = ({
  title,
  stats,
  channel,
}: {
  title: string;
  stats: any;
  channel: string;
}) => {
  const navigate = useNavigate();
  return (
    <Box className="flex flex-col gap-3">
      <h3
        className="text-sm font-medium text-foreground capitalize hover:cursor-pointer"
        onClick={() => navigate(`/notifications/${channel}`)}
      >
        {title} Queue
      </h3>
      <Box className="flex gap-3">
        <StatCard
          label="Waiting"
          value={stats.waiting}
          color="text-yellow-500"
          channel={channel}
        />
        <StatCard
          label="Active"
          value={stats.active}
          color="text-blue-500"
          channel={channel}
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          color="text-green-500"
          channel={channel}
        />
        <StatCard
          label="Failed"
          value={stats.failed}
          color="text-red-500"
          channel={channel}
        />
      </Box>
    </Box>
  );
};

const Dashboard = () => {
  const { email, push, connected, lastEvent } = useDashboardStream();

  return (
    <PageContainer
      heading={
        <Box className="flex items-center gap-2">
          Queue Dashboard
          <Badge variant={connected ? "default" : "destructive"}>
            {connected ? "Live" : "Disconnected"}
          </Badge>
        </Box>
      }
    >
      <Box className="flex flex-col gap-8">
        <QueueSection title="Email" stats={email} channel={"email"} />
        <QueueSection title="Push" stats={push} channel={"push"} />

        {lastEvent && (
          <p className="text-xs text-muted-foreground">
            Last event: <span className="font-medium">{lastEvent.type}</span> on{" "}
            <span className="font-medium">{lastEvent.queue}</span> queue — job{" "}
            <span className="font-mono">{lastEvent.jobId}</span>
          </p>
        )}
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
