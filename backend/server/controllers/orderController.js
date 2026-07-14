import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Prescription from "../models/Prescription.js";
import Settings from "../models/Settings.js";
import User from "../models/User.js";
import { generateOrderId } from "../utils/generateOrderId.js";
import { buildWhatsappLink } from "../utils/buildWhatsappLink.js";
import { uploadBufferToCloudinary } from "../middleware/upload.js";
import { sendAdminNewOrderEmail, sendOrderStatusUpdateEmail } from "../utils/orderEmails.js";

// POST /api/orders — requires customer login (see routes/orderRoutes.js)
// multipart/form-data: items (JSON string), address fields, specialInstructions,
// prescriptionMethod ("file" | "manual" | omitted), prescriptionNote,
// prescriptionFile (binary, only if method === "file")
export async function createOrder(req, res, next) {
  try {
    const items = JSON.parse(req.body.items || "[]");
    if (!items.length) {
      return res.status(400).json({ message: "Cart is empty." });
    }

    const { fullAddress, city, state, pincode, phone, specialInstructions } = req.body;
    if (!fullAddress || !phone) {
      return res.status(400).json({ message: "Address and phone number are required." });
    }

    // Re-fetch products server-side rather than trusting prices sent from
    // the client — prevents a tampered request from checking out at a
    // fake price.
    const productIds = items.map((i) => i.productId);
    const products = await Product.find({ _id: { $in: productIds }, isActive: true });

    const orderItems = items.map((item) => {
      const product = products.find((p) => p._id.toString() === item.productId);
      if (!product) throw new Error(`Product ${item.productId} is no longer available.`);
      if (product.stock < item.quantity) {
        throw new Error(`Not enough stock for ${product.name}.`);
      }
      return {
        product: product._id,
        name: product.name,
        price: product.discountPrice ?? product.price,
        quantity: item.quantity,
        prescriptionRequired: product.prescriptionRequired,
      };
    });

    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const settings = await Settings.getSingleton();
    const total = subtotal + settings.deliveryCharge;

    const orderId = await generateOrderId();

    const order = await Order.create({
      orderId,
      user: req.user._id,
      customerName: req.user.name,
      customerPhone: phone,
      customerAddress: { fullAddress, city, state, pincode },
      items: orderItems,
      specialInstructions: specialInstructions || "",
      subtotal,
      deliveryCharge: settings.deliveryCharge,
      total,
    });

    // Prescription is OPTIONAL and can use either method — matches the
    // "optional at checkout, add later" decision in the SRS.
    const { prescriptionMethod, prescriptionNote } = req.body;
    if (prescriptionMethod === "file" || prescriptionMethod === "manual") {
      let fileUrl = null;
      if (prescriptionMethod === "file" && req.file) {
        fileUrl = await uploadBufferToCloudinary(req.file.buffer, "swadeshi-opticals/prescriptions");
      }
      const prescription = await Prescription.create({
        order: order._id,
        user: req.user._id,
        method: prescriptionMethod,
        fileUrl,
        note: prescriptionMethod === "manual" ? prescriptionNote : null,
      });
      order.prescription = prescription._id;
      await order.save();
    }

    const whatsappUrl = buildWhatsappLink({ storeWhatsapp: settings.storeWhatsapp, order });

    // Fire-and-forget — a slow/failed email should never block the response.
    sendAdminNewOrderEmail(settings.adminNotificationEmail, order);

    res.status(201).json({ order, whatsappUrl });
  } catch (err) {
    next(err);
  }
}

// GET /api/orders/mine — customer's own order history
export async function getMyOrders(req, res, next) {
  try {
    const orders = await Order.find({ user: req.user._id }).sort("-createdAt");
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

// GET /api/orders/:orderId — customer viewing their OWN order only
export async function getMyOrderById(req, res, next) {
  try {
    const order = await Order.findOne({
      orderId: req.params.orderId,
      user: req.user._id,
    }).populate("prescription");
    if (!order) return res.status(404).json({ message: "Order not found." });
    res.json(order);
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/orders/stats/summary — powers the Dashboard stat cards
export async function getDashboardStats(req, res, next) {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [todayOrders, revenueAgg, pendingCount, completedCount] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: startOfToday } }),
      Order.aggregate([
        { $match: { status: { $ne: "Cancelled" } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Order.countDocuments({ status: "Pending" }),
      Order.countDocuments({ status: "Delivered" }),
    ]);

    res.json({
      todayOrders,
      revenue: revenueAgg[0]?.total || 0,
      pendingOrders: pendingCount,
      completedOrders: completedCount,
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/orders?status=&search=&page=
export async function getAllOrders(req, res, next) {
  try {
    const { status, search, page = 1 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { orderId: new RegExp(search, "i") },
        { customerName: new RegExp(search, "i") },
        { customerPhone: new RegExp(search, "i") },
      ];
    }

    const PAGE_SIZE = 20;
    const skip = (Number(page) - 1) * PAGE_SIZE;

    const [orders, total] = await Promise.all([
      Order.find(filter).sort("-createdAt").skip(skip).limit(PAGE_SIZE),
      Order.countDocuments(filter),
    ]);

    res.json({ orders, total, page: Number(page), totalPages: Math.ceil(total / PAGE_SIZE) });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/orders/:orderId
export async function getOrderByIdAdmin(req, res, next) {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId }).populate("prescription");
    if (!order) return res.status(404).json({ message: "Order not found." });
    res.json(order);
  } catch (err) {
    next(err);
  }
}

// PUT /api/admin/orders/:orderId/status  { status }
// This is what fires the customer email — every status change admin
// makes on the dashboard triggers this automatically.
export async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;
    const validStatuses = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }

    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ message: "Order not found." });

    order.status = status;
    order.statusHistory.push({ status, changedAt: new Date() });
    await order.save();

    const customer = await User.findById(order.user);
    sendOrderStatusUpdateEmail(customer?.email, order);

    res.json(order);
  } catch (err) {
    next(err);
  }
}
