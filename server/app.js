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

app.set("trust proxy", 1);

connectDB().catch(() => {});

// ===== DEBUG LOGGER =====
app.use((req, res, next) => {
  console.log("====================================");
  console.log("Incoming:", req.method, req.originalUrl);

  res.on("finish", () => {
    console.log(
      "Finished:",
      req.method,
      req.originalUrl,
      "Status:",
      res.statusCode
    );
  });

  next();
});
// ========================

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json({ limit: "1mb" }));
app.use(sanitizeBody);

app.use((req, res, next) => {
  console.log({
    url: req.url,
    originalUrl: req.originalUrl,
    path: req.path,
  });

  next();
});


app.get("/api/health", (req, res) => {
  console.log("Health endpoint reached");
  res.json({ status: "ok" });
});

const REQUEST_DB_WAIT_MS = 3000;

const requireDB = async (req, res, next) => {
  console.log("requireDB START");

  if (!isDBConnected()) {
    console.log("Database not connected. Waiting...");

    await Promise.race([
      connectDB(),
      new Promise((resolve) =>
        setTimeout(resolve, REQUEST_DB_WAIT_MS)
      ),
    ]);
  }

  console.log("Database connected?", isDBConnected());

  if (!isDBConnected()) {
    console.log("Returning 503");
    return res.status(503).json({
      message: "Database connection unavailable. Please try again later.",
    });
  }

  console.log("requireDB END -> next()");
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

export default app;
