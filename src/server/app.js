// // ─────────────────────────────────────────────
// //  Marsos Backend — Secure Express App (ESM)
// // ─────────────────────────────────────────────

// import express from "express";
// import cors from "cors";
// import { ENV } from "../env.js";

// // ───── Middlewares ─────
// import helmetMiddleware from "../middleware/helmetCsp.js";
// import createRateLimiter from "../middleware/rateLimiter.js";
// import requestLogger from "../middleware/requestLogger.js";
// import { verifyJwt } from "../middleware/verifyJwt.js";
// import requireServiceRole from "../middleware/requireServiceRole.js";

// // ───── Routes ─────
// import publicRoutes from "./routes/public.js";
// import internalRoutes from "./routes/internal.js";
// import adminRoutes from "./routes/adminRoutes.js";
// import adminUsersRoutes from "./routes/adminUsers.js";
// import adminStatsRoutes from "./routes/adminStats.js";
// import adminProductsRoutes from "./routes/adminProductsRoutes.js";

// // ───── Express App ─────
// const app = express();

// // Disable Express signature for security
// app.disable("x-powered-by");

// // JSON & URL-encoded parsers with strict limits
// app.use(express.json({ limit: "10kb" }));
// app.use(express.urlencoded({ extended: false, limit: "10kb" }));

// // ─────────────────────────────────────────────
// // 🔍 Request Logger
// // ─────────────────────────────────────────────
// app.use(requestLogger);

// // ─────────────────────────────────────────────
// // 🌍 CORS — Allow whitelisted origins (from .env)
// // ─────────────────────────────────────────────
// const allowedOrigins = ENV.ALLOWED_ORIGINS
//   ? ENV.ALLOWED_ORIGINS.split(",").map((s) => s.trim().replace(/\/$/, ""))
//   : ["https://marsos-frontend.vercel.app", "http://localhost:5173"];

// // 🧠 Debug: Show which origins are actually loaded
// console.log("🟢 Loaded allowed origins:", allowedOrigins);

// app.use(
//   cors({
//     origin(origin, cb) {
//       if (!origin) return cb(null, true); // allow Postman, curl, etc.
//       const normalized = origin.replace(/\/$/, "");

//       // ✅ Explicitly allow listed origins
//       if (allowedOrigins.includes(normalized)) return cb(null, true);

//       // ✅ Allow all vercel preview branches (e.g. marsos-frontend-git-dev.vercel.app)
//       if (/^https:\/\/marsos-frontend.*\.vercel\.app$/.test(normalized)) {
//         return cb(null, true);
//       }

//       console.warn(`❌ Blocked by CORS: ${origin}`);
//       return cb(new Error("CORS not allowed"));
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// // Handle preflight OPTIONS requests globally
// app.options("*", cors());

// // ─────────────────────────────────────────────
// // 🛡 Helmet + CSP (Content Security Policy)
// // ─────────────────────────────────────────────
// const securityMiddlewares = helmetMiddleware();
// securityMiddlewares.forEach((m) => app.use(m));

// // ─────────────────────────────────────────────
// // 🚦 Rate Limiting
// // ─────────────────────────────────────────────
// app.use(createRateLimiter());

// // ─────────────────────────────────────────────
// // 💓 Healthcheck (no auth)
// // ─────────────────────────────────────────────
// app.get("/healthz", (_, res) => res.status(200).json({ status: "ok" }));

// // ─────────────────────────────────────────────
// // 📦 Public Routes (user endpoints)
// // Includes: /api/check-phone
// // ─────────────────────────────────────────────
// app.use("/api", publicRoutes);

// // ─────────────────────────────────────────────
// // 🔐 Internal Routes — require service role
// // ─────────────────────────────────────────────
// app.use("/internal", requireServiceRole(), internalRoutes);

// // ─────────────────────────────────────────────
// // 🧑‍💼 Admin Routes (JWT-authenticated users)
// // ─────────────────────────────────────────────
// app.use("/api/admin/users", adminUsersRoutes);
// app.use("/api/admin/stats", adminStatsRoutes);
// app.use("/api/admin/products", adminProductsRoutes);
// app.use("/api/admin", adminRoutes);

// // ─────────────────────────────────────────────
// // ⚠ Global Error Handler
// // ─────────────────────────────────────────────
// app.use((err, req, res, next) => {
//   const status = err.status || 500;
//   const msg =
//     process.env.NODE_ENV === "production"
//       ? "Internal Server Error"
//       : err.message;

//   console.error(`[Error ${status}] ${err.message}`);
//   res.status(status).json({ error: msg });
// });

// // ─────────────────────────────────────────────
// // ✅ Export for use in index.js
// // ─────────────────────────────────────────────
// export default app;

// server/app.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { ENV } from "../env.js";
import publicRoutes from "./routes/public.js";

const app = express();

// basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// enable CORS
app.use(
  cors({
    origin: ["https://marsos-frontend.vercel.app", "http://localhost:5173"],
    credentials: true,
  })
);

// security headers
app.use(helmet());

// health check
app.get("/healthz", (_, res) => res.json({ status: "ok" }));

// your actual API routes
app.use("/api", publicRoutes);

// friendly root
app.get("/", (_, res) => {
  res.json({ ok: true, message: "Marsos Backend is running 🚀" });
});

export default app;
