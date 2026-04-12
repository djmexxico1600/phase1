/**
 * @file schemas/user.schemas.ts
 * @description Zod validation schemas for user-related operations.
 */
import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

export const usernameSchema = z
  .string()
  .regex(/^[a-z0-9_]{3,30}$/, "Username must be 3–30 characters and contain only lowercase letters, numbers, and underscores");

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be at most 100 characters")
      .trim(),
    email: z.string().email("Please enter a valid email address").toLowerCase().trim(),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address").toLowerCase().trim(),
  password: z.string().min(1, "Password is required"),
});

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters")
    .trim()
    .optional(),
  username: usernameSchema.optional(),
  bio: z.string().max(500, "Bio must be at most 500 characters").trim().optional(),
  displayName: z
    .string()
    .min(1, "Display name must be at least 1 character")
    .max(60, "Display name must be at most 60 characters")
    .trim()
    .optional(),
  websiteUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  twitterHandle: z
    .string()
    .regex(/^[A-Za-z0-9_]{1,15}$/, "Twitter handle must be 1–15 characters (letters, numbers, underscores)")
    .optional()
    .or(z.literal("")),
  instagramHandle: z
    .string()
    .regex(/^[A-Za-z0-9_.]{1,30}$/, "Instagram handle must be 1–30 characters")
    .optional()
    .or(z.literal("")),
  youtubeUrl: z
    .string()
    .url("Please enter a valid YouTube URL")
    .optional()
    .or(z.literal("")),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from the current password",
    path: ["newPassword"],
  });

export const twoFactorSetupSchema = z.object({
  code: z
    .string()
    .length(6, "TOTP code must be exactly 6 digits")
    .regex(/^\d{6}$/, "TOTP code must contain only digits"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address").toLowerCase().trim(),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type TwoFactorSetupInput = z.infer<typeof twoFactorSetupSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
