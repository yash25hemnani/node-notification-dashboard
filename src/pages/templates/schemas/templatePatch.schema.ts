import { z } from "zod";

export const templatePatchSchema = z.object({
  subject: z
    .string()
    .min(1, "Subject is required")
    .max(100, "Subject must be under 100 characters"),

  body: z
    .string()
    .refine(
      (val) => val !== "<p></p>" && val !== "",
      { message: "Body is required" }
    ),
});

export type TemplatePatchFormValues = z.infer<typeof templatePatchSchema>;