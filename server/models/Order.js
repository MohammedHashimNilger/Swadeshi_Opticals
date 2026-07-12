import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true }, // snapshot
    price: { type: Number, required: true }, // snapshot
    quantity: { type: Number, required: true, min: 1 },
    prescriptionRequired: { type: Boolean, default: false }, // snapshot
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true }, // e.g. "SWO-00001"
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Snapshot fields — captured at order time so history stays accurate
    // even if the customer edits their profile/address later.
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerAddress: {
      fullAddress: { type: String, required: true },
      city: String,
      state: String,
      pincode: String,
    },

    items: { type: [orderItemSchema], required: true },

    prescription: { type: mongoose.Schema.Types.ObjectId, ref: "Prescription", default: null },
    specialInstructions: { type: String, default: "" },

    subtotal: { type: Number, required: true },
    deliveryCharge: { type: Number, required: true },
    total: { type: Number, required: true },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    statusHistory: {
      type: [{ status: String, changedAt: { type: Date, default: Date.now } }],
      default: () => [{ status: "Pending", changedAt: new Date() }],
    },

    whatsappMessageSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
