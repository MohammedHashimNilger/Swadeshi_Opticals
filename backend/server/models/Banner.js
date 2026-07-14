import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    title: { type: String, default: "" },
    linkUrl: { type: String, default: "" },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
  },
  { timestamps: true }
);

// Compound index for the common active-banner query used by the homepage
bannerSchema.index({ isActive: 1, startDate: 1, endDate: 1, displayOrder: 1 });

export default mongoose.model("Banner", bannerSchema);
