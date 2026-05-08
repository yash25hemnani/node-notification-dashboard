import apiClient from "@/api/apiClient";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import PageContainer from "@/components/ui/page-container";
import { useAlertStore } from "@/stores/alertStore";
import { extractApiError } from "@/utils/extractApiError";
import { renderTemplate } from "@/utils/renderTemplate";
import { Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SentAttachmentList from "./components/SentAttachmentsList";
import { SideRow } from "./components/SideRow";
import type { BullMQJob } from "./types/job.types";
import type { Notification } from "./types/notification.types";
import { JobDetailsSection } from "./components/JobDetailsSection";

const STATUS_STYLES: Record<string, string> = {
  completed: "bg-green-50 border-green-200 text-green-700",
  failed: "bg-red-50 border-red-200 text-red-700",
  active: "bg-blue-50 border-blue-200 text-blue-700",
  waiting: "bg-yellow-50 border-yellow-200 text-yellow-700",
};

const ViewSingleNotification = () => {
  const { displayId, id } = useParams();
  const showAlert = useAlertStore((s) => s.showAlert);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [jobData, setJobData] = useState<BullMQJob | null>(null)

  const fetchNotificationData = async () => {
    try {
      const response = await apiClient.get(`/notification/${id}`);
      if (response.status === 200)
        setNotification(response.data.data.notification);
    } catch (error) {
      const { code, message } = extractApiError(error);
      showAlert(code.split("_").join(" "), message, "error");
    }
  };

  const fetchJobData = async (channel: string, jobId: string) => {

    try {
      const response = await apiClient.get(`/jobs/${channel}/${jobId}`);
      if (response.status === 200)
        setJobData(response.data.data.job);
    } catch (error) {
      const { code, message } = extractApiError(error);
      showAlert(code.split("_").join(" "), message, "error");
    }
  };

  useEffect(() => {
    fetchNotificationData();
  }, [id]);

  useEffect(() => {
    if (!notification) return
    fetchJobData(notification.channel, notification.jobId)
  }, [notification])
  
  if (!notification) return null;

  const data = notification.data ?? {};
  const snapshot = notification.templateSnapshot ?? {};
  const { emailDetail } = notification;
  const isEmail = notification.channel === "email";

  const renderedSubject = snapshot.subject
    ? renderTemplate(snapshot.subject, data)
    : null;
  const renderedBody = snapshot.body
    ? renderTemplate(snapshot.body, data)
    : null;

  return (
    <PageContainer
      heading={
        <Box className="flex items-center gap-2.5">
          <span>{displayId}</span>
          <Badge
            variant="default"
            className="text-xs capitalize rounded-md px-2"
          >
            {notification.channel}
          </Badge>
          <Badge
            variant="outline"
            className={`text-xs capitalize rounded-md px-2 border ${STATUS_STYLES[notification.status] ?? ""}`}
          >
            {notification.status}
          </Badge>
        </Box>
      }
    >
      <Box className="flex gap-5 items-start">
        <Box className="space-y-2">
          <Box className="w-90 shrink-0 rounded-xl border bg-card overflow-hidden">
            <Box className="p-3.5 border-b">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-2.5">
                General
              </p>
              <Box className="flex flex-col gap-2">
                <SideRow label="Template" value={notification.templateSlug} />
                <SideRow label="Customer" value={notification.customerEmail} />
                <SideRow label="Recipient" value={notification.recipient} />
                <SideRow
                  label="Sent"
                  value={new Date(notification.createdAt).toLocaleString()}
                />
                <SideRow
                  label="Attempts"
                  value={String(notification.attemptsMade ?? 0)}
                />
                {notification.failedReason && (
                  <SideRow
                    label="Failed"
                    value={notification.failedReason}
                    valueClassName="text-red-600"
                  />
                )}
              </Box>
            </Box>

            {isEmail && emailDetail && (
              <Box className="p-3.5 border-b">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-2.5">
                  Recipients
                </p>
                <Box className="flex flex-col gap-2">
                  {emailDetail.to?.length > 0 && (
                    <SideRow label="To" value={emailDetail.to.join(", ")} />
                  )}
                  {emailDetail.cc?.length > 0 && (
                    <SideRow label="CC" value={emailDetail.cc.join(", ")} />
                  )}
                  {emailDetail.bcc?.length > 0 && (
                    <SideRow label="BCC" value={emailDetail.bcc.join(", ")} />
                  )}
                  {emailDetail.replyTo && (
                    <SideRow label="Reply To" value={emailDetail.replyTo} />
                  )}
                </Box>
              </Box>
            )}

            {Object.keys(data).length > 0 && (
              <Box className="p-3.5">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-2.5">
                  Injected Data
                </p>
                <Box className="flex flex-col gap-2">
                  {Object.entries(data).map(([key, val]) => (
                    <Box
                      key={key}
                      className="flex items-center justify-between gap-2"
                    >
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {key}
                      </span>
                      <span className="text-[11px] font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">
                        {String(val)}
                      </span>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
           
           {jobData && <JobDetailsSection job={jobData}/>}
        </Box>

        {/* ── Right: Preview ───── */}
        <Box className="flex-1 min-w-0">
          {isEmail ? (
            <Box className="border rounded-xl overflow-hidden bg-card">
              <Box className="flex items-center gap-2 px-4 py-2.5 border-b bg-muted/40">
                <Box className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" />
                </Box>
                <span className="text-xs text-muted-foreground flex-1 text-center">
                  Email Preview
                </span>
              </Box>
              <Box className="border rounded-xl overflow-hidden bg-background">
                {/* ── Header Fields ─────────────────────────────── */}
                <Box className="divide-y border-b">
                  <Box className="border-none flex items-center gap-3 px-5 py-3">
                    <span className="text-sm text-muted-foreground w-10 shrink-0">
                      From
                    </span>
                    <span className="text-sm text-foreground">
                      no-reply@yourapp.com
                    </span>
                  </Box>

                  {emailDetail?.to?.length > 0 && (
                    <Box className="border-none flex items-center gap-3 px-5 py-3">
                      <span className="text-sm text-muted-foreground w-10 shrink-0">
                        To
                      </span>
                      <span className="text-sm text-foreground">
                        {emailDetail.to.join(", ")}
                      </span>
                    </Box>
                  )}

                  {emailDetail?.cc?.length > 0 && (
                    <Box className="border-none flex items-center gap-3 px-5 py-3">
                      <span className="text-sm text-muted-foreground w-10 shrink-0">
                        Cc
                      </span>
                      <span className="text-sm text-foreground">
                        {emailDetail.cc.join(", ")}
                      </span>
                    </Box>
                  )}

                  {emailDetail?.bcc?.length > 0 && (
                    <Box className="flex items-center gap-3 px-5 py-3">
                      <span className="text-sm text-muted-foreground w-10 shrink-0">
                        Bcc
                      </span>
                      <span className="text-sm text-foreground">
                        {emailDetail.bcc.join(", ")}
                      </span>
                    </Box>
                  )}

                  {renderedSubject && (
                    <Box className="flex items-center gap-3 px-5 py-3">
                      <span className="text-sm font-medium text-foreground">
                        {renderedSubject}
                      </span>
                    </Box>
                  )}
                </Box>

                {/* ── Email Body ─────────────────────────────────── */}
                <Box className="px-5 py-5">
                  {renderedBody ? (
                    <Box
                      className="prose prose-sm max-w-none text-foreground"
                      dangerouslySetInnerHTML={{ __html: renderedBody }}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No body content.
                    </p>
                  )}
                </Box>
              </Box>
              {/* Attachments sent with the mail */}
              {(snapshot.attachments?.length > 0 ||
                notification.files?.length > 0) && (
                <Box className="p-3.5 border-b">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-2.5">
                    Attachments
                  </p>
                  <SentAttachmentList
                    templateAttachments={snapshot.attachments}
                    files={notification.files}
                  />
                </Box>
              )}
            </Box>
          ) : (
            <Box className="w-full border-2 border-dashed border-border rounded-xl bg-muted/30 min-h-80 flex items-center justify-center">
              <Box className="border rounded-xl bg-card p-5 w-80 space-y-2 shadow-sm cursor-pointer transition-all duration-150 active:-translate-y-1">
                <Box className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  Your App &bull; now
                </Box>
                {renderedSubject && (
                  <p className="font-semibold text-sm">{renderedSubject}</p>
                )}
                {renderedBody && (
                  <p className="text-sm text-muted-foreground">
                    {renderedBody}
                  </p>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </PageContainer>
  );
};

export default ViewSingleNotification;
