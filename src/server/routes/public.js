import express from "express";
import { verifyJwt } from "../../middleware/verifyJwt.js";
import {
  getProfile,
  checkPhoneController,
} from "../controllers/publicController.js";

const router = express.Router();

// ─────────────────────────────
// 🌍 Public endpoints (no auth)
// ─────────────────────────────
router.get("/public-info", (req, res) => {
  res.json({ version: "1.0", status: "ok" });
});

/**
 * @route GET /api/check-phone?phone=+9665XXXXXXX
 * @desc Check if phone exists in Supabase "profiles" table
 * @access Public (rate-limited)
 */
router.get("/check-phone", checkPhoneController);

// ─────────────────────────────
// 🔐 Protected endpoint (JWT required)
// ─────────────────────────────
router.get("/me", verifyJwt, getProfile);

export default router;
