import express from "express";
import { verifyJwt } from "../../middleware/verifyJwt.js";
import {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  approveUser,
} from "../controllers/adminUsersController.js";

const router = express.Router();

// ─────────────────────────────
// 🔐 All routes require JWT
// ─────────────────────────────
router.use(verifyJwt);

// ─────────────────────────────
// 👥 List all users
// ─────────────────────────────
router.get("/", listUsers);

// ➕ Create user
router.post("/", createUser);

// ✏️ Update user
router.put("/:id", updateUser);

// 🗑 Delete user
router.delete("/:id", deleteUser);

// ✅ Approve user
router.post("/:id/approve", approveUser);

export default router;
