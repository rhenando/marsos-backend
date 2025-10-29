import dotenv from "dotenv";
dotenv.config(); // ✅ Load .env before anything else
import { z } from "zod";

// 🧩 Define schema (with some vars optional for serverless safety)
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

  // You can still require JWT_SECRET locally, but not crash in Vercel
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be >=32 chars").optional(),

  // ───── Optional configuration ─────
  ALLOWED_ORIGINS: z.string().optional(),
  ADMIN_INTERNAL_TOKEN: z.string().min(32).optional(),

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

// 🧪 Validate but do NOT exit on Vercel
const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("⚠️ Invalid or missing environment variables detected:");
  console.error(parsed.error.format());

  if (process.env.VERCEL !== "1") {
    // Fail fast locally
    process.exit(1);
  } else {
    // On Vercel, continue with partial ENV to prevent crash
    console.warn("🟡 Continuing startup on Vercel with missing env vars...");
  }
}

// ✅ Export sanitized, typed config
export const ENV = parsed.success ? parsed.data : {}; // empty fallback if invalid on Vercel

export const IS_PROD = ENV.NODE_ENV === "production";
export const IS_DEV = ENV.NODE_ENV === "development";
