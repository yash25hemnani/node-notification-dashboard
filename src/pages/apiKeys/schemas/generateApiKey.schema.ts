import z from "zod";

export const generateApiKeySchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export type GenerateApiKeyFormValues = z.infer<typeof generateApiKeySchema>;