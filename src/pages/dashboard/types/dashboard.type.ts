// types/dashboard.type.ts
export interface Job {
  id: string;
  displayId: string;
  channel: string;
  status: string;
  customerId: string;
  customerEmail: string;
  templateSlug: string;
  attemptsMade: number;
  failedReason: string | null;
  createdAt: string;
}