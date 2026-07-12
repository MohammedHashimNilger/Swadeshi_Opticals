/**
 * Ensures the Settings singleton has the real shop contact info, even if
 * a Settings document already exists from earlier testing (schema
 * defaults only apply when a document is first CREATED, not to existing
 * documents). Safe to re-run any time — it always overwrites these
 * specific fields with the values below, leaving deliveryCharge and any
 * other admin-configured fields untouched.
 * Run with: node scripts/seedSettings.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import Settings from "../server/models/Settings.js";

const REAL_SETTINGS = {
  storePhone: "+91 94134 60346",
  storeWhatsapp: "919413460346",
  storeEmail: "id.swadeshi.opticals051@gmail.com",
  storeAddress: "51, Rana Sanga Market, Rana Sanga Bazar, Sector 1, Gandhi Nagar, Chittorgarh, Rajasthan 312001",
  adminNotificationEmail: "id.swadeshi.opticals051@gmail.com",
  // Approximate — pincode 312001 (Chittorgarh) center. Fine-tune the
  // exact pin later from Admin → Settings once you have the precise
  // coordinates for the shop itself.
  storeLatLng: { lat: 24.8887, lng: 74.6269 },
};

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);

  const settings = await Settings.getSingleton();
  Object.assign(settings, REAL_SETTINGS);
  await settings.save();

  console.log("Settings updated with real shop contact info:");
  console.log(REAL_SETTINGS);

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Failed to update settings:", err.message);
  process.exit(1);
});
