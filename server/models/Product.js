import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: "" },

    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],

    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: null, min: 0 },

    images: [{ type: String }], // Cloudinary URLs

    specifications: {
      frameSize: String,
      frameMaterial: String,
      lensType: String,
      gender: { type: String, enum: ["Men", "Women", "Kids", "Unisex"], default: "Unisex" },
      brand: String,
      color: String,
      weight: String,
      dimensions: String,
      shape: String,
      lensColor: { type: String, default: "" },
    },

    stock: { type: Number, required: true, default: 0, min: 0 },
    prescriptionRequired: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.index({ categories: 1, isActive: 1 });
productSchema.index({ name: "text", description: "text" }); // powers the search bar

export default mongoose.model("Product", productSchema);
