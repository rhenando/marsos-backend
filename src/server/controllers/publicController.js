import { supabaseAdmin } from "../../lib/supabaseAdmin.js";

/**
 * 🔐 Get the authenticated user profile (JWT required)
 */
export async function getProfile(req, res) {
  try {
    const userId = req.user?.id; // comes from verifyJwt
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Profile not found" });

    return res.status(200).json({ profile: data });
  } catch (err) {
    console.error("❌ getProfile:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

/**
 * ✅ Check if phone exists in Supabase "profiles" table
 * Returns: {status: "new" | "pending" | "approved", role?: string}
 * Access: Public (no JWT)
 */
export async function checkPhoneController(req, res) {
  try {
    const rawPhone = req.query.phone || "";
    const phone = rawPhone.trim().replace(/^\+/, "");

    // 🔒 Validate format
    if (!phone || !/^\d{8,15}$/.test(phone)) {
      return res.status(400).json({ error: "Invalid phone number format" });
    }

    // 🔍 Query the profiles table
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("id, phone, account_status, role")
      .eq("phone", phone)
      .maybeSingle();

    if (error) throw error;

    // 🟢 Case 1: New user
    if (!data) {
      return res.status(200).json({ status: "new" });
    }

    // 🟡 Case 2: Pending approval
    if (data.account_status === "pending") {
      return res.status(200).json({ status: "pending" });
    }

    // 🟢 Case 3: Approved user
    return res.status(200).json({
      status: "approved",
      role: data.role || null,
    });
  } catch (err) {
    console.error("❌ checkPhoneController:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
