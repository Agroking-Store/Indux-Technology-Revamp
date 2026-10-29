import { Router } from "express";
import {
  createProduct,
  getProducts,
  getProductBySlugOrId,
  updateProduct,
  deleteProduct,
  updateProductStatus,
} from "../controllers/product.controller";
import { protect } from "../middlewares/auth";
import { uploadProductImage } from "../middlewares/upload";

const router = Router();

// ---- Public routes ----
router.get("/", getProducts);
router.get("/:identifier", getProductBySlugOrId);

// ---- Protected routes (admin only) ----
router.use(protect);

router.post("/", uploadProductImage, createProduct);
router.put("/:id", uploadProductImage, updateProduct);
router.delete("/:id", deleteProduct);
router.patch("/:id/status", updateProductStatus);

export default router;
