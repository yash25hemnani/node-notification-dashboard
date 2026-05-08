import { Box } from "@/components/ui/box";
import type { BullMQJob } from "../types/job.types";
import { SideRow } from "./SideRow";

export const JobDetailsSection = ({ job }: { job: BullMQJob }) => {
  
  const duration =
    job.finishedOn && job.processedOn
      ? ((job.finishedOn - job.processedOn) / 1000).toFixed(2) + "s"
      : null;

  return (
    <Box className="p-3.5 bg-card rounded-xl">
      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-2.5">
        Job Details
      </p>
      <Box className="flex flex-col gap-2">
        <SideRow label="Job ID" value={`#${job.id}`} />
        <SideRow label="Queue" value={job.queueQualifiedName.replace("bull:", "")} />
        <SideRow label="Attempts" value={`${job.attemptsMade} / ${job.opts.attempts}`} />
        {duration && <SideRow label="Duration" value={duration} />}
        {job.processedOn && (
          <SideRow
            label="Processed"
            value={new Date(job.processedOn).toLocaleString()}
          />
        )}
        {job.finishedOn && (
          <SideRow
            label="Finished"
            value={new Date(job.finishedOn).toLocaleString()}
          />
        )}
      </Box>
    </Box>
  );
};