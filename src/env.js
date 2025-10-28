// src/env.js
import dotenv from "dotenv";
dotenv.config(); // ✅ load .env into process.env before validation

import { z } from "zod";

// 🧩 Schema — strict validation for all required environment variables
const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("production"),
  PORT: z.string().regex(/^\d+$/).transform(Number).default("5001"),

  // ───── JWT + Supabase ─────
  SUPABASE_URL: z
    .string()
    .url({ message: "SUPABASE_URL must be a valid URL (https://...)" }),
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(40, "Missing or invalid SUPABASE_SERVICE_ROLE_KEY"),
  SUPABASE_JWT_SECRET: z
    .string()
    .min(20, "Missing or invalid SUPABASE_JWT_SECRET"),
  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must be a long, random string (>=32 chars)"),

  // ───── Optional configuration ─────
  ALLOWED_ORIGINS: z.string().optional(),
  ADMIN_INTERNAL_TOKEN: z
    .string()
    .min(32, "Missing or invalid ADMIN_INTERNAL_TOKEN"),

  RATE_LIMIT_WINDOW_MINUTES: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .default("15"),
  RATE_LIMIT_MAX: z.string().regex(/^\d+$/).transform(Number).default("100"),

  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info"),
});

// 🧪 Parse & validate
const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid or missing environment variables:");
  console.error(parsed.error.format());
  process.exit(1);
}

// ✅ Export sanitized, typed config
export const ENV = parsed.data;
export const IS_PROD = ENV.NODE_ENV === "production";
export const IS_DEV = ENV.NODE_ENV === "development";
