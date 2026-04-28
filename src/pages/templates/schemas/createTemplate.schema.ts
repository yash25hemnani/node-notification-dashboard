import z from "zod";

const VALID_CHANNELS = ["email", "push"] as const;

export const createTemplateFormSchema = z.object({
  name: z
    .string()
    .min(1, "Slug is required")
    .min(3, "Slug must be at least 3 characters")
    .max(100, "Slug must be at most 100 characters"),

  channel: z
    .enum(VALID_CHANNELS, {
      error: "Please select a valid channel"
    }),
});

export type CreateTemplateFormValues = z.infer<typeof createTemplateFormSchema>;