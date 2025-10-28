// ─────────────────────────────────────────────
//  Marsos Backend — Secure Express App (ESM)
// ─────────────────────────────────────────────

import express from "express";
import cors from "cors";
import { ENV } from "../env.js";

// ───── Middlewares ─────
import helmetMiddleware from "../middleware/helmetCsp.js";
import createRateLimiter from "../middleware/rateLimiter.js";
import requestLogger from "../middleware/requestLogger.js";
import { verifyJwt } from "../middleware/verifyJwt.js";
import requireServiceRole from "../middleware/requireServiceRole.js";

// ───── Routes ─────
import publicRoutes from "./routes/public.js";
import internalRoutes from "./routes/internal.js";
import adminRoutes from "./routes/adminRoutes.js";
import adminUsersRoutes from "./routes/adminUsers.js";
import adminStatsRoutes from "./routes/adminStats.js";

import adminProductsRoutes from "./routes/adminProductsRoutes.js";

// ───── Express App ─────
const app = express();

// Disable Express signature for security
app.disable("x-powered-by");

// JSON & URL-encoded parsers with strict limits
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false, limit: "10kb" }));

// ─────────────────────────────────────────────
// 🔍 Request Logger
// ─────────────────────────────────────────────
app.use(requestLogger);

// ─────────────────────────────────────────────
// 🌍 CORS — Only allow whitelisted origins
// ─────────────────────────────────────────────
const origins = ENV.ALLOWED_ORIGINS?.split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true); // allow Postman/cURL
      if (origins.includes(origin)) return cb(null, true);
      return cb(new Error("CORS not allowed"));
    },
    credentials: true,
  })
);

// ─────────────────────────────────────────────
// 🛡 Helmet + CSP (content-security-policy)
// ─────────────────────────────────────────────
const securityMiddlewares = helmetMiddleware();
securityMiddlewares.forEach((m) => app.use(m));

// ─────────────────────────────────────────────
// 🚦 Rate Limiting
// ─────────────────────────────────────────────
app.use(createRateLimiter());

// ─────────────────────────────────────────────
// 💓 Healthcheck — no auth
// ─────────────────────────────────────────────
app.get("/healthz", (req, res) => res.status(200).json({ status: "ok" }));

// ─────────────────────────────────────────────
// 📦 Public Routes (user endpoints)
// ─────────────────────────────────────────────
app.use("/api", publicRoutes);

// ─────────────────────────────────────────────
// 🔐 Internal Routes — require service role
// ─────────────────────────────────────────────
app.use("/internal", requireServiceRole(), internalRoutes);

// ─────────────────────────────────────────────
// 🧑‍💼 Admin Routes (JWT-authenticated users with admin role)
// ─────────────────────────────────────────────
app.use("/api/admin/users", adminUsersRoutes);
app.use("/api/admin/stats", adminStatsRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api/admin/products", adminProductsRoutes);

// ─────────────────────────────────────────────
// ⚠ Global Error Handler
// ─────────────────────────────────────────────
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const msg =
    process.env.NODE_ENV === "production"
      ? "Internal Server Error"
      : err.message;

  // Optional logging here (if you have pino/winston)
  console.error(`[Error ${status}] ${err.message}`);

  res.status(status).json({ error: msg });
});

// ─────────────────────────────────────────────
// ✅ Export for use in index.js
// ─────────────────────────────────────────────
export default app;
