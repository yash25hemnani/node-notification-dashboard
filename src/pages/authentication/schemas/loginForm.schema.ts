import * as z from "zod";

/**
 * Login Schema
 */
export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

/**
 * Inferred Types
 */
export type LoginFormValues = z.infer<typeof loginFormSchema>;