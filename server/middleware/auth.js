import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Protects customer routes (add to cart, place order, etc.).
 * Expects "Authorization: Bearer <token>". Attaches req.user if valid.
 */
export async function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Please log in to continue." });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "customer") {
      return res.status(403).json({ message: "Not authorized." });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Account no longer exists." });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Session expired, please log in again." });
  }
}
