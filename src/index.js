// ─────────────────────────────────────────────
// Marsos Backend — Vercel & Local Compatible Entry Point
// ─────────────────────────────────────────────

// 🔥 Catch any unhandled runtime errors (shows clearly in Vercel logs)
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
});
process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Rejection:", reason);
});

// ─────────────────────────────────────────────
// 🌍 Imports
// ─────────────────────────────────────────────
import "./env.js"; // Load environment variables first
import app from "./server/app.js"; // Import configured Express app
import { ENV } from "./env.js";
import { logger } from "./logger.js";

// ─────────────────────────────────────────────
// 🚀 Start server locally only
// (Vercel serverless automatically handles requests)
// ─────────────────────────────────────────────
if (process.env.VERCEL !== "1") {
  const port = ENV.PORT || 5001;
  app.listen(port, () => {
    logger.info(`🚀 Server running on port ${port} [${ENV.NODE_ENV}]`);
  });
}

// ─────────────────────────────────────────────
// ✅ Export app for Vercel
// ─────────────────────────────────────────────
export default app;
