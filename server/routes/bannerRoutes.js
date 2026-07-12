import express from "express";
import {
  getBanners,
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from "../controllers/bannerController.js";
import { adminProtect } from "../middleware/adminAuth.js";
import { uploadBannerImage } from "../middleware/upload.js";

const router = express.Router();

router.get("/", getBanners);
router.get("/admin/all", adminProtect, getAllBanners);
router.post("/admin", adminProtect, uploadBannerImage, createBanner);
router.put("/admin/:id", adminProtect, uploadBannerImage, updateBanner);
router.delete("/admin/:id", adminProtect, deleteBanner);

export default router;
