import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

/**
 * Protects /admin/* API routes. The token is only issued AFTER the
 * admin has passed both password AND 2FA checks (see adminController),
 * so a valid token here already implies 2FA was satisfied at login time.
 */
export async function adminProtect(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Admin login required." });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Not authorized." });
    }

    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ message: "Admin account no longer exists." });
    }

    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Session expired, please log in again." });
  }
}
