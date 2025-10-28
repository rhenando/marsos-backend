import { supabaseAdmin } from "../../lib/supabaseAdmin.js";
import { ok, fail } from "../../utils/response.js";

// ─────────────── GET /api/admin/products ───────────────
export async function listProducts(req, res) {
  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select(
        `
        id,
        productname_en,
        productname_ar,
        status,
        mainimageurl,
        priceranges,
        created_at,
        suppliername,
        suppliernumber
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[Supabase Error: listProducts]", error.message);
      throw error;
    }

    return ok(res, 200, "Products fetched successfully", data);
  } catch (err) {
    console.error("[Backend Error: listProducts]", err.message);
    return fail(res, 500, err.message || "Failed to fetch products");
  }
}

// ─────────────── POST /api/admin/products ───────────────
export async function createProduct(req, res) {
  const body = req.body;
  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .insert([body])
      .select()
      .single();

    if (error) throw error;
    return ok(res, 201, "Product created successfully", data);
  } catch (err) {
    console.error("[Backend Error: createProduct]", err.message);
    return fail(res, 500, err.message || "Failed to create product");
  }
}

// ─────────────── PUT /api/admin/products/:id ───────────────
export async function updateProduct(req, res) {
  const { id } = req.params;
  const body = req.body;
  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return ok(res, 200, "Product updated successfully", data);
  } catch (err) {
    console.error("[Backend Error: updateProduct]", err.message);
    return fail(res, 500, err.message || "Failed to update product");
  }
}

// ─────────────── DELETE /api/admin/products/:id ───────────────
export async function deleteProduct(req, res) {
  const { id } = req.params;
  try {
    const { error } = await supabaseAdmin
      .from("products")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return ok(res, 200, "Product deleted successfully");
  } catch (err) {
    console.error("[Backend Error: deleteProduct]", err.message);
    return fail(res, 500, err.message || "Failed to delete product");
  }
}
