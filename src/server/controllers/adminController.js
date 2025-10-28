// src/server/controllers/adminController.js
import { supabaseAdmin } from "../../lib/supabaseAdmin.js";
import { ok, fail } from "../../utils/response.js";

/**
 * 📊 GET /api/admin/stats
 * Returns basic system statistics.
 */
export async function getStats(req, res) {
  try {
    const { count: totalUsers, error: errTotal } = await supabaseAdmin
      .from("profiles")
      .select("*", { count: "exact", head: true });
    if (errTotal) throw errTotal;

    const { count: buyers, error: errBuyers } = await supabaseAdmin
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "buyer");
    if (errBuyers) throw errBuyers;

    const { count: suppliers, error: errSuppliers } = await supabaseAdmin
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "supplier");
    if (errSuppliers) throw errSuppliers;

    const { count: approved, error: errApproved } = await supabaseAdmin
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("status", "approved");
    if (errApproved) throw errApproved;

    const stats = { totalUsers, buyers, suppliers, approved };
    return ok(res, 200, "Admin stats retrieved", stats);
  } catch (err) {
    return fail(res, 500, "Failed to load admin stats", err.message);
  }
}

/**
 * 👥 GET /api/admin/users
 * Returns all users with basic info.
 */
export async function getAllUsers(req, res) {
  try {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("id, email, full_name, role, status, created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return ok(res, 200, "Users retrieved successfully", data);
  } catch (err) {
    return fail(res, 500, "Failed to load users", err.message);
  }
}
