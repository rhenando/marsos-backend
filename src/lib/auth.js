// src/lib/auth.js
import { fail } from "../utils/response.js";

/**
 * 🧩 Role-based guard
 * Requires req.user.role to equal "admin"
 * (req.user is set by verifyJwt)
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return fail(res, 403, "Admin access only");
  }
  next();
};
