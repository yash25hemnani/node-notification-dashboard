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