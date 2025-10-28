// src/server/routes/adminRoutes.js
import express from "express";
import { verifyJwt } from "../../middleware/verifyJwt.js";

import { getAllUsers, getStats } from "../controllers/adminController.js";

const router = express.Router();

// 🔐 All admin routes protected
router.use(verifyJwt);

// GET /api/admin/users
router.get("/users", getAllUsers);

// GET /api/admin/stats
router.get("/stats", getStats);

export default router;
