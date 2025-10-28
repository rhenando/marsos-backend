// src/middleware/requireServiceRole.js
import { ENV } from "../env.js";
import safeCompare from "../utils/safeCompare.js";

export default function requireServiceRole() {
  return (req, res, next) => {
    // 1) require app-level header (not accept from browser)
    const headerToken = req.headers["x-admin-internal-token"];
    if (!headerToken)
      return res.status(401).json({ error: "Missing internal token" });

    if (!safeCompare(headerToken, ENV.ADMIN_INTERNAL_TOKEN)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Request passes. Attach supabase admin client if needed
    return next();
  };
}
