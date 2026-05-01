export interface Template {
  id: string;
  name: string;
  slug: string;
  channel: "email" | "sms" | "push" | string; // keep extensible if more channels come
  subject: string | null;
  body: string | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface AttachmentFile {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  templateId: string;
  fileId: string;
  createdAt: string;
  file: AttachmentFile;
}