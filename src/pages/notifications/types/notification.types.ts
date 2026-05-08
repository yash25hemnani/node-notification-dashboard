export interface NotificationResponse {
  notification: Notification;
}

export interface Notification {
  id: string;
  displayId: string;
  jobId: string;
  channel: "email" | string;
  customerId: string;
  customerEmail: string;
  recipient: string;
  templateId: string;
  templateSlug: string;
  templateSnapshot: TemplateSnapshot;
  data: Record<string, any>;
  createdBy: string;
  status: "pending" | "processing" | "completed" | "failed" | string;
  attemptsMade: number;
  failedReason: string | null;
  idempotencyKey: string | null;
  createdAt: string;
  updatedAt: string;
  emailDetail: EmailDetail;
  files: FileAttachment[];
}

export interface TemplateSnapshot {
  body: string;
  subject: string;
  attachments: SnapshotAttachment[]
}

export interface SnapshotAttachment {
  id: string;
  file: {
    path: string;
    originalName: string;
  };
  source: "upload" | "local";
  mimeType: string;
}


export interface FileAttachment {
  id: string;
  originalName: string;
  path: string;
  mimeType: string;
  source: "upload" | "local";
  size?: number;
}

export interface EmailDetail {
  id: string;
  notificationId: string;
  to: string[];
  cc: string[];
  bcc: string[];
  replyTo: string | null;
  createdAt: string;
  updatedAt: string;
}
