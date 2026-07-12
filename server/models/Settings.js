import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  storeName: { type: String, default: "Swadeshi Opticals" },
  storePhone: { type: String, default: "+91 94134 60346" },
  storeWhatsapp: { type: String, default: "919413460346" }, // digits only, e.g. "919876543210" — used to build wa.me links
  storeEmail: { type: String, default: "id.swadeshi.opticals051@gmail.com" },
  storeAddress: {
    type: String,
    default: "51, Rana Sanga Market, Rana Sanga Bazar, Sector 1, Gandhi Nagar, Chittorgarh, Rajasthan 312001",
  },
  storeLatLng: {
    lat: { type: Number, default: 24.8886761 },
    lng: { type: Number, default: 74.6340543 },
  },
  storeHours: { type: String, default: "" },
  deliveryCharge: { type: Number, default: 0 },
  deliveryAreaNote: { type: String, default: "Delivery area to be confirmed on order." },
  adminNotificationEmail: { type: String, default: "id.swadeshi.opticals051@gmail.com" },
});

// Enforces a true singleton: always fetch/create the one settings doc,
// never worry about accidentally creating a second one.
settingsSchema.statics.getSingleton = async function getSingleton() {
  let settings = await this.findOne();
  if (!settings) settings = await this.create({});
  return settings;
};

export default mongoose.model("Settings", settingsSchema);
