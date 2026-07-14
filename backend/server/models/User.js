import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const addressSchema = new mongoose.Schema(
  {
    label: { type: String, default: "Home" },
    fullAddress: { type: String, required: true },
    city: String,
    state: String,
    pincode: String,
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      unique: true,
      sparse: true, // allows multiple null emails (shouldn't happen, but safe)
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      // Not required at the schema level — a Google-only signup has no password.
      // Controllers enforce that EITHER password OR googleId is present.
      select: false, // never return password hash in queries by default
    },
    googleId: { type: String, sparse: true },
    phone: { type: String, trim: true },
    addresses: [addressSchema],

    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

// Hash the password automatically whenever it's set/changed.
userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password") || !this.password) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model("User", userSchema);
