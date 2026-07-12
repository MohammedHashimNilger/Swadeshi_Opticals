import express from "express";
import {
  adminLogin,
  setupTotp,
  verifyTotp,
  resetTotp,
  changePassword,
} from "../controllers/adminController.js";
import { loginLimiter } from "../middleware/rateLimiter.js";
import { adminProtect } from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/login", loginLimiter, adminLogin);
router.post("/setup-2fa", setupTotp);
router.post("/verify-2fa", loginLimiter, verifyTotp);
router.post("/reset-2fa", adminProtect, resetTotp);
router.post("/change-password", adminProtect, changePassword);

export default router;
