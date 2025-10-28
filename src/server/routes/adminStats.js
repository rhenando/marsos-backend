// src/server/routes/adminStats.js
import express from "express";
import { verifyJwt } from "../../middleware/verifyJwt.js";
import { getStats } from "../controllers/adminController.js";

const router = express.Router();

// 🔐 Protect all routes under /api/admin/stats
router.use(verifyJwt);

// 📊 GET /api/admin/stats
router.get("/", getStats);

export default router;
