import express from "express";
import {
  createOrder,
  getMyOrders,
  getMyOrderById,
  getAllOrders,
  getOrderByIdAdmin,
  updateOrderStatus,
  getDashboardStats,
} from "../controllers/orderController.js";
import { protect } from "../middleware/auth.js";
import { adminProtect } from "../middleware/adminAuth.js";
import { uploadPrescriptionFile } from "../middleware/upload.js";

const router = express.Router();

// Customer routes — require login
router.post("/", protect, uploadPrescriptionFile, createOrder);
router.get("/mine", protect, getMyOrders);
router.get("/mine/:orderId", protect, getMyOrderById);

// Admin routes
router.get("/admin/stats/summary", adminProtect, getDashboardStats);
router.get("/admin/all", adminProtect, getAllOrders);
router.get("/admin/:orderId", adminProtect, getOrderByIdAdmin);
router.put("/admin/:orderId/status", adminProtect, updateOrderStatus);

export default router;
