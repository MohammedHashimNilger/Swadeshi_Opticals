import express from "express";
import cors from "cors";
import helmet from "helmet";
import { sanitizeBody } from "./middleware/sanitize.js";
import { connectDB } from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

const app = express();

// Connect to MongoDB. Doesn't block server startup — Mongoose queues
// operations until the connection is ready. The .catch here is
// important: without it, a failed connection becomes an unhandled
// promise rejection, which crashes the whole Node process on modern
// Node versions instead of just logging the error.
connectDB().catch(() => {
  // Error already logged inside connectDB(); nothing further needed here.
});

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json({ limit: "1mb" }));
app.use(sanitizeBody);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin/prescriptions", prescriptionRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/admin/customers", customerRoutes);
app.use("/api/contact", contactRoutes);

app.use(notFound);
app.use(errorHandler);

// Deliberately NO app.listen() here — see server/index.js (local dev)
// and api/index.js (Vercel serverless) for the two ways this app runs.
export default app;
