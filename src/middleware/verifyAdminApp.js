import jwt from "jsonwebtoken";

export const verifyAdminApp = (req, res, next) => {
  try {
    const token = req.headers["x-admin-token"] || req.cookies?.admin_token;
    if (!token) {
      return res.status(401).json({ error: "Missing admin token" });
    }

    // Verify admin JWT using your backend secret
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    if (!decoded || decoded.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    // Attach admin info to request
    req.admin = decoded;
    next();
  } catch (err) {
    console.error("[verifyAdminApp] Error:", err.message);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};
