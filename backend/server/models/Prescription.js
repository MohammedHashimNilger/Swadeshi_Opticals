import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    method: { type: String, enum: ["file", "manual"], required: true },
    fileUrl: { type: String, default: null }, // set when method === "file"
    note: { type: String, default: null }, // set when method === "manual"

    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    reviewedAt: Date,
    reviewNote: String, // admin's reason if rejected
  },
  { timestamps: true }
);

export default mongoose.model("Prescription", prescriptionSchema);
