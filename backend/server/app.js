import express from "express";
import cors from "cors";
import helmet from "helmet";
import { sanitizeBody } from "./middleware/sanitize.js";
import { connectDB, isDBConnected } from "./config/db.js";
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

// Connect to MongoDB lazily - don't block the initial request on cold starts.
// On Vercel serverless, the connection will be established in the background
// and subsequent requests will use the cached connection.
const dbPromise = connectDB().catch(() => {});

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json({ limit: "1mb" }));
app.use(sanitizeBody);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", db: isDBConnected() ? "connected" : "connecting" });
});

// Middleware to check DB connection for routes that need it.
// connectDB() checks mongoose's readyState internally and no-ops if already
// connected, so calling it again here is cheap once warm — but critically,
// it means a container that failed to connect once (e.g. during a brief
// Atlas whitelist propagation delay) gets to retry on the next request
// instead of being stuck rejecting every request for its entire lifetime.
const requireDB = async (req, res, next) => {
  if (!isDBConnected()) {
    await connectDB();
  }
  if (!isDBConnected()) {
    return res.status(503).json({ message: "Database connection unavailable. Please try again later." });
  }
  next();
};

app.use("/api/auth", requireDB, authRoutes);
app.use("/api/admin", requireDB, adminRoutes);
app.use("/api/categories", requireDB, categoryRoutes);
app.use("/api/products", requireDB, productRoutes);
app.use("/api/orders", requireDB, orderRoutes);
app.use("/api/admin/prescriptions", requireDB, prescriptionRoutes);
app.use("/api/settings", requireDB, settingsRoutes);
app.use("/api/banners", requireDB, bannerRoutes);
app.use("/api/admin/customers", requireDB, customerRoutes);
app.use("/api/contact", requireDB, contactRoutes);

app.use(notFound);
app.use(errorHandler);

// Deliberately NO app.listen() here — see server/index.js (local dev)
// and api/index.js (Vercel serverless) for the two ways this app runs.
export default app;
