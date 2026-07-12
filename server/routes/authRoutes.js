import express from "express";
import {
  register,
  login,
  googleLogin,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { loginLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", loginLimiter, login);
router.post("/google", googleLogin);
router.post("/forgot-password", loginLimiter, forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
