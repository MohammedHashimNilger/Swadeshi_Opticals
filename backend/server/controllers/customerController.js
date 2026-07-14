import User from "../models/User.js";
import Order from "../models/Order.js";

// GET /api/admin/customers?search=
export async function getCustomers(req, res, next) {
  try {
    const { search } = req.query;
    const filter = {};
    if (search) {
      filter.$or = [
        { name: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { phone: new RegExp(search, "i") },
      ];
    }

    const users = await User.find(filter).sort("-createdAt").lean();

    // Order count per customer — a single aggregation is far cheaper than
    // N queries (one per customer) as the customer list grows.
    const orderCounts = await Order.aggregate([
      { $group: { _id: "$user", count: { $sum: 1 } } },
    ]);
    const countMap = new Map(orderCounts.map((o) => [o._id.toString(), o.count]));

    const customers = users.map((u) => ({
      ...u,
      orderCount: countMap.get(u._id.toString()) || 0,
    }));

    res.json(customers);
  } catch (err) {
    next(err);
  }
}
