import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, select: false },

    totpSecret: { type: String, select: false }, // base32 secret for TOTP, set during 2FA setup
    isTotpEnabled: { type: Boolean, default: false },

    lastLoginAt: Date,
    failedLoginAttempts: { type: Number, default: 0 },
    lockedUntil: Date, // if set and in the future, login is blocked
  },
  { timestamps: true }
);

adminSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

adminSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

adminSchema.methods.isLocked = function isLocked() {
  return !!(this.lockedUntil && this.lockedUntil > Date.now());
};

export default mongoose.model("Admin", adminSchema);
