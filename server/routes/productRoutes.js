import express from "express";
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getDistinctColors,
  getDistinctLensColors,
} from "../controllers/productController.js";
import { adminProtect } from "../middleware/adminAuth.js";
import { uploadProductImages } from "../middleware/upload.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/meta/colors", getDistinctColors);
router.get("/meta/lens-colors", getDistinctLensColors);
router.get("/:slug", getProductBySlug);
router.post("/", adminProtect, uploadProductImages, createProduct);
router.put("/:id", adminProtect, uploadProductImages, updateProduct);
router.delete("/:id", adminProtect, deleteProduct);

export default router;
