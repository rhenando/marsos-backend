// src/middleware/rateLimiter.js
import rateLimit from "express-rate-limit";
import { ENV } from "../env.js";

export default function createRateLimiter() {
  return rateLimit({
    windowMs: ENV.RATE_LIMIT_WINDOW_MINUTES * 60 * 1000,
    max: ENV.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests. Try again later." },
  });
}
