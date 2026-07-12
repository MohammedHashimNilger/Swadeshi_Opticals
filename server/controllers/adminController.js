import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { generateToken } from "../utils/generateToken.js";
import { generateTotpSecret, verifyTotpCode } from "../utils/totp.js";

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

// Short-lived token issued after password check, before 2FA is confirmed.
// It can ONLY be used against the 2FA endpoints below — adminAuth.js
// rejects it for every other route since its role is "admin-pending".
function generatePendingToken(adminId) {
  return jwt.sign({ id: adminId, role: "admin-pending" }, process.env.JWT_SECRET, {
    expiresIn: "5m",
  });
}

function verifyPendingToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return null;
  try {
    const decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
    return decoded.role === "admin-pending" ? decoded.id : null;
  } catch {
    return null;
  }
}

// STEP 1 — POST /api/admin/login  { username, password }
export async function adminLogin(req, res, next) {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username }).select("+password");

    if (!admin) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    if (admin.isLocked()) {
      return res.status(423).json({
        message: "Account temporarily locked due to repeated failed logins. Try again later.",
      });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      admin.failedLoginAttempts += 1;
      if (admin.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        admin.lockedUntil = Date.now() + LOCK_DURATION_MS;
        admin.failedLoginAttempts = 0;
      }
      await admin.save();
      return res.status(401).json({ message: "Invalid username or password." });
    }

    // Correct password — reset failure counter, move on to the 2FA step.
    admin.failedLoginAttempts = 0;
    await admin.save();

    res.json({
      pendingToken: generatePendingToken(admin._id),
      totpSetupRequired: !admin.isTotpEnabled, // frontend branches to setup vs. verify screen
    });
  } catch (err) {
    next(err);
  }
}

// STEP 2a (first time only) — POST /api/admin/setup-2fa
// Requires the pendingToken from step 1. Returns a QR code to scan.
export async function setupTotp(req, res, next) {
  try {
    const adminId = verifyPendingToken(req);
    if (!adminId) return res.status(401).json({ message: "Please log in again." });

    const admin = await Admin.findById(adminId);
    if (admin.isTotpEnabled) {
      return res.status(400).json({ message: "2FA is already set up for this account." });
    }

    const { base32Secret, qrCodeDataUrl } = await generateTotpSecret(admin.username);
    admin.totpSecret = base32Secret; // saved but isTotpEnabled stays false until verified below
    await admin.save();

    res.json({ qrCodeDataUrl });
  } catch (err) {
    next(err);
  }
}

// STEP 2b — POST /api/admin/verify-2fa  { code }
// Used both to CONFIRM setup (first time) and for every login after that.
export async function verifyTotp(req, res, next) {
  try {
    const adminId = verifyPendingToken(req);
    if (!adminId) return res.status(401).json({ message: "Please log in again." });

    const { code } = req.body;
    const admin = await Admin.findById(adminId).select("+totpSecret");

    if (!admin.totpSecret) {
      return res.status(400).json({ message: "2FA has not been set up yet." });
    }

    const isValid = verifyTotpCode(admin.totpSecret, code);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid or expired 2FA code." });
    }

    if (!admin.isTotpEnabled) {
      admin.isTotpEnabled = true; // first successful code confirms setup
    }
    admin.lastLoginAt = new Date();
    await admin.save();

    res.json({ token: generateToken({ id: admin._id, role: "admin" }) });
  } catch (err) {
    next(err);
  }
}

// POST /api/admin/reset-2fa  (requires full admin auth)
// Clears the TOTP secret and disables 2FA so the admin can re-setup with a new QR code.
export async function resetTotp(req, res, next) {
  try {
    const admin = await Admin.findById(req.admin._id).select("+totpSecret");
    admin.totpSecret = undefined;
    admin.isTotpEnabled = false;
    await admin.save();
    res.json({ message: "2FA has been reset. The QR code will appear on your next login." });
  } catch (err) {
    next(err);
  }
}

// POST /api/admin/change-password  (requires full admin auth, see adminAuth.js)
export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin._id).select("+password");

    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect." });
    }

    admin.password = newPassword;
    await admin.save();

    res.json({ message: "Password updated successfully." });
  } catch (err) {
    next(err);
  }
}
