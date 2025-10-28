// src/server/controllers/internalController.js
import { supabaseAdmin } from "../../lib/supabaseAdmin.js";
import { logger } from "../../logger.js";

// 🧩 Example admin-only job
export async function runAdminJob(req, res) {
  try {
    // Simple demo job: count users, clean expired sessions, etc.
    const { count, error } = await supabaseAdmin
      .from("profiles")
      .select("*", { count: "exact", head: true });

    if (error) throw error;

    logger.info(`Admin job executed successfully. User count: ${count}`);

    return res.status(200).json({
      message: "Admin job executed successfully",
      userCount: count,
    });
  } catch (err) {
    logger.error({ err }, "Admin job failed");
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
