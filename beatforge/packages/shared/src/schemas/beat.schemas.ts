/**
 * @file schemas/beat.schemas.ts
 * @description Zod validation schemas for beat and marketplace operations.
 */
import { z } from "zod";
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MAX_TAGS_PER_BEAT } from "../constants/marketplace.constants";

const beatGenreEnum = z.enum([
  "hip_hop", "trap", "rnb", "pop", "drill", "afrobeats",
  "dancehall", "reggaeton", "electronic", "house", "techno",
  "jazz", "soul", "gospel", "country", "rock", "other",
]);

const beatMoodEnum = z.enum([
  "dark", "happy", "sad", "aggressive", "romantic", "chill",
  "epic", "motivational", "mysterious", "playful", "other",
]);

const beatKeyEnum = z.enum([
  "c_major", "c_minor", "c_sharp_major", "c_sharp_minor",
  "d_major", "d_minor", "d_sharp_major", "d_sharp_minor",
  "e_major", "e_minor",
  "f_major", "f_minor", "f_sharp_major", "f_sharp_minor",
  "g_major", "g_minor", "g_sharp_major", "g_sharp_minor",
  "a_major", "a_minor", "a_sharp_major", "a_sharp_minor",
  "b_major", "b_minor", "unknown",
]);

const licenseTypeEnum = z.enum(["basic", "premium", "trackout", "unlimited", "exclusive"]);

export const uploadBeatSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be at most 100 characters")
    .trim(),
  genre: beatGenreEnum,
  mood: beatMoodEnum.optional(),
  bpm: z
    .number()
    .int("BPM must be a whole number")
    .min(40, "BPM must be at least 40")
    .max(300, "BPM must be at most 300")
    .optional(),
  key: beatKeyEnum.optional(),
  description: z
    .string()
    .max(2000, "Description must be at most 2,000 characters")
    .trim()
    .optional(),
  tags: z
    .array(z.string().min(1).max(50).trim())
    .max(MAX_TAGS_PER_BEAT, `You can add at most ${MAX_TAGS_PER_BEAT} tags`)
    .default([]),
  isHumanMade: z.boolean().default(false),
});

export const updateBeatSchema = uploadBeatSchema.partial();

export const licenseSchema = z.object({
  type: licenseTypeEnum,
  name: z.string().min(1, "License name is required").max(80, "License name must be at most 80 characters"),
  price: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid decimal number (e.g. 29.99)")
    .refine((v) => parseFloat(v) >= 0, { message: "Price must be non-negative" }),
  includesMp3: z.boolean().default(true),
  includesWav: z.boolean().default(false),
  includesStems: z.boolean().default(false),
  distributionLimit: z.number().int().positive().nullable().default(null),
  audioStreamsLimit: z.number().int().positive().nullable().default(null),
  broadcastingRightsIncluded: z.boolean().default(false),
  isAvailable: z.boolean().default(true),
});

export const beatSlugSchema = z.string().min(1, "Beat slug is required");

export const beatFiltersSchema = z.object({
  genre: beatGenreEnum.optional(),
  mood: beatMoodEnum.optional(),
  key: beatKeyEnum.optional(),
  bpmMin: z.coerce
    .number()
    .int()
    .min(40)
    .max(300)
    .optional(),
  bpmMax: z.coerce
    .number()
    .int()
    .min(40)
    .max(300)
    .optional(),
  priceMin: z.coerce.number().min(0).optional(),
  priceMax: z.coerce.number().min(0).optional(),
  isHumanMade: z.coerce.boolean().optional(),
  tags: z.array(z.string()).optional(),
  producerId: z.string().optional(),
  search: z.string().max(200).trim().optional(),
  sortBy: z
    .enum(["trending", "newest", "popular", "price_low", "price_high"])
    .default("trending"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(MAX_PAGE_SIZE)
    .default(DEFAULT_PAGE_SIZE),
});

export type UploadBeatInput = z.infer<typeof uploadBeatSchema>;
export type UpdateBeatInput = z.infer<typeof updateBeatSchema>;
export type LicenseInput = z.infer<typeof licenseSchema>;
export type BeatFiltersInput = z.infer<typeof beatFiltersSchema>;
