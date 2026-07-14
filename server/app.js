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

// Vercel (and most PaaS platforms) sit in front of the app as a reverse
// proxy and always set X-Forwarded-For. Without telling Express to trust
// that proxy, express-rate-limit (used below via requireDB's siblings —
// see routes/authRoutes.js, adminRoutes.js, contactRoutes.js) throws a
// validation error on every request that carries that header, which in
// practice means every request in production. This is a no-op locally.
app.set("trust proxy", 1);

// Kick off the MongoDB connection immediately so it's already warm by
// the time the first request's requireDB middleware awaits it below.
// We still don't block server startup on it - routes handle absence of
// a connection gracefully via requireDB.
connectDB().catch(() => {
  // Error already logged inside connectDB(); nothing further needed here.
});

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json({ limit: "1mb" }));
app.use(sanitizeBody);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Middleware to check DB connection for routes that need it.
// On a cold start, requests can arrive before the connection (kicked off
// above) has finished, so this waits briefly for it - but only up to
// REQUEST_DB_WAIT_MS. That's enough for the common case (Atlas usually
// connects in well under a second), without holding a request open for
// the full ~8-10s connection timeout if the database is genuinely down;
// in that case we fail fast with a 503 and let a later request (after
// db.js's retry cooldown) pick up a fresh attempt.
const REQUEST_DB_WAIT_MS = 3000;

const requireDB = async (req, res, next) => {
  if (!isDBConnected()) {
    await Promise.race([
      connectDB(),
      new Promise((resolve) => setTimeout(resolve, REQUEST_DB_WAIT_MS)),
    ]);
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
