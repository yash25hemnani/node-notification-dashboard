// hooks/useQueueStream.ts
import { useAuthStore } from "@/stores/authStore";
import { useEffect, useState } from "react";

interface QueueStats {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
}

interface QueueState {
  email: QueueStats;
  push: QueueStats;
  lastEvent: { type: string; queue: string; jobId: string } | null;
}

const defaultStats: QueueStats = {
  waiting: 0,
  active: 0,
  completed: 0,
  failed: 0,
};

export function useDashboardStream() {
  const [state, setState] = useState<QueueState>({
    email: defaultStats,
    push: defaultStats,
    lastEvent: null,
  });
  const [connected, setConnected] = useState(false);
  const token = useAuthStore((s) => s.accessToken);

  useEffect(() => {
      // Create a new SSE Source
    const es = new EventSource(
      `${import.meta.env.VITE_API_BASE_URL}/dashboard/stream?token=${token}`,
    );

    es.onopen = () => setConnected(true);

    // On each message, update the stats 
    es.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "QUEUE_STATS") {
        setState((prev) => ({
          ...prev,
          email: data.email,
          push: data.push,
        }));
      }

      if (["JOB_COMPLETED", "JOB_FAILED", "JOB_ACTIVE"].includes(data.type)) {
        setState((prev) => ({
          ...prev,
          lastEvent: {
            type: data.type,
            queue: data.queue,
            jobId: data.jobId,
          },
        }));
      }
    };

    es.onerror = () => {
      setConnected(false);
      es.close();
    };

    return () => {
      es.close();
    };
  }, []);

  return { ...state, connected };
}
