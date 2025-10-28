import express from "express";
import { verifyJwt } from "../../middleware/verifyJwt.js";
import {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/adminProductsController.js";

const router = express.Router();

// All routes are protected
router.use(verifyJwt);

router.get("/", listProducts);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
