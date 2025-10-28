// src/middleware/verifyJwt.js
import jwt from "jsonwebtoken";
import { ENV } from "../env.js";
import { fail } from "../utils/response.js";

/**
 * ✅ Verify Supabase-issued JWTs.
 * Frontend users log in via Supabase Auth,
 * so tokens must be verified with SUPABASE_JWT_SECRET.
 */
export const verifyJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return fail(res, 401, "Missing or invalid token");
  }

  const token = authHeader.split(" ")[1];

  try {
    // 🧩 Important: Use SUPABASE_JWT_SECRET instead of JWT_SECRET
    const decoded = jwt.verify(token, ENV.SUPABASE_JWT_SECRET);
    req.user = decoded;

    // Optional — log authenticated user for debugging
    // console.log("✅ Authenticated:", decoded.email || decoded.sub);

    next();
  } catch (err) {
    return fail(res, 401, "Invalid or expired token", err.message);
  }
};
