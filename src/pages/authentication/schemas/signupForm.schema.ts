import * as z from "zod";

/**
 * Signup Schema
 */
export const signupFormSchema = z
  .object({
    username: z
      .string()
      .min(2, "Username must be at least 2 characters")
      .max(50, "Username must be at most 50 characters"),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Enter a valid email address"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),

    confirmPassword: z
      .string()
      .min(6, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

/**
 * Inferred Types
 */
export type SignupFormValues = z.infer<typeof signupFormSchema>;