import { z } from "zod";

export const addAttachmentSchema = z.object({
  file: z.instanceof(File).nonoptional(),
});

export type AddAttachmentFormValues = z.infer<typeof addAttachmentSchema>;
