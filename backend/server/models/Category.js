import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    icon: { type: String, default: "IconTag" }, // Tabler icon component name, used directly on the frontend
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

categorySchema.index({ parentCategory: 1 });

export default mongoose.model("Category", categorySchema);
