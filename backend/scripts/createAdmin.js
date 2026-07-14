/**
 * Creates (or resets the password of) the single admin account.
 * Run with: npm run create-admin -- <username> <password>
 * Example:  npm run create-admin -- admin MyStrongPassword123
 */
import "dotenv/config";
import mongoose from "mongoose";
import Admin from "../server/models/Admin.js";

const [, , username, password] = process.argv;

if (!username || !password) {
  console.log("Usage: npm run create-admin -- <username> <password>");
  process.exit(1);
}

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);

  let admin = await Admin.findOne({ username });
  if (admin) {
    admin.password = password; // pre-save hook re-hashes it
    admin.isTotpEnabled = false; // force 2FA re-setup after a manual password reset
    await admin.save();
    console.log(`Updated password for existing admin "${username}".`);
  } else {
    admin = await Admin.create({ username, password });
    console.log(`Created new admin "${username}".`);
  }

  console.log("You can now log in at /admin/login — you'll be asked to set up 2FA on first login.");
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Failed to create admin:", err.message);
  process.exit(1);
});
