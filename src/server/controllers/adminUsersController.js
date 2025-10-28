import { supabaseAdmin } from "../../lib/supabaseAdmin.js";
import { ok, fail } from "../../utils/response.js";

/**
 * ────────────────────────────────────────────────
 * 👥 Admin User Management Controller
 * For /api/admin/users endpoints
 * ────────────────────────────────────────────────
 */

// ─────────────── GET /api/admin/users ───────────────
export async function listUsers(req, res) {
  try {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select(
        `
        id,
        full_name,
        avatar_url,
        role,
        company_name,
        phone,
        city,
        country,
        account_status,
        is_verified,
        personal_email,
        buyer_email,
        created_at
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return ok(res, 200, "Users fetched successfully", data);
  } catch (err) {
    return fail(res, 500, err.message || "Failed to fetch users");
  }
}

// ─────────────── POST /api/admin/users ───────────────
export async function createUser(req, res) {
  const {
    full_name,
    role,
    company_name,
    phone,
    city,
    personal_email,
    buyer_email,
    account_status,
  } = req.body;

  try {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .insert([
        {
          full_name,
          role: role || "buyer",
          company_name,
          phone,
          city,
          personal_email,
          buyer_email,
          account_status: account_status || "pending_approval",
          is_verified: false,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return ok(res, 201, "User created successfully", data);
  } catch (err) {
    return fail(res, 500, err.message || "Failed to create user");
  }
}

// ─────────────── PUT /api/admin/users/:id ───────────────
export async function updateUser(req, res) {
  const { id } = req.params;
  const {
    full_name,
    role,
    company_name,
    phone,
    city,
    personal_email,
    buyer_email,
    account_status,
    is_verified,
  } = req.body;

  try {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .update({
        full_name,
        role,
        company_name,
        phone,
        city,
        personal_email,
        buyer_email,
        account_status,
        is_verified,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return ok(res, 200, "User updated successfully", data);
  } catch (err) {
    return fail(res, 500, err.message || "Failed to update user");
  }
}

// ─────────────── DELETE /api/admin/users/:id ───────────────
export async function deleteUser(req, res) {
  const { id } = req.params;
  try {
    const { error } = await supabaseAdmin
      .from("profiles")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return ok(res, 200, "User deleted successfully");
  } catch (err) {
    return fail(res, 500, err.message || "Failed to delete user");
  }
}

// ─────────────── POST /api/admin/users/:id/approve ───────────────
export async function approveUser(req, res) {
  const { id } = req.params;
  try {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .update({
        account_status: "approved",
        is_verified: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return ok(res, 200, "User approved successfully", data);
  } catch (err) {
    return fail(res, 500, err.message || "Failed to approve user");
  }
}
