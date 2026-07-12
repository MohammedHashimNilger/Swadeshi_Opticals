import express from "express";
import { sendContactMessage } from "../controllers/contactController.js";
import { loginLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Reuses the login rate limiter (10 requests / 15 min per IP) — a
// generic enough throttle to stop the contact form from being spammed.
router.post("/", loginLimiter, sendContactMessage);

export default router;
