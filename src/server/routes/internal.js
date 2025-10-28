// src/server/routes/internal.js
import express from "express";
import { runAdminJob } from "../controllers/internalController.js";

const router = express.Router();

router.post("/run-backfill", runAdminJob);

export default router;
