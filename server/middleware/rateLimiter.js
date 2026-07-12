import rateLimit from "express-rate-limit";

/**
 * Applied to login endpoints (customer + admin) to slow down brute-force
 * attempts: max 10 attempts per 15 minutes, per IP address.
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many login attempts. Please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});
