import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchDashboardStats, fetchAllOrders } from "../../services/adminOrderService";
import { formatCurrency } from "../../utils/formatCurrency";
import StatusBadge from "../../components/admin/StatusBadge";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchDashboardStats().then(setStats).catch((err) => console.error(err));
    fetchAllOrders({ page: 1 })
      .then((data) => setRecentOrders(data.orders.slice(0, 5)))
      .catch((err) => console.error(err));
  }, []);

  const cards = [
    { label: "Today's orders", value: stats?.todayOrders },
    { label: "Revenue", value: stats ? formatCurrency(stats.revenue) : undefined },
    { label: "Pending orders", value: stats?.pendingOrders },
    { label: "Completed orders", value: stats?.completedOrders },
  ];

  return (
    <div>
      <p className="mb-5 text-lg font-medium text-navy-900 dark:text-navy-50">Dashboard</p>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-lg bg-navy-100/60 p-4 dark:bg-navy-800">
            <p className="text-xs text-navy-500 dark:text-navy-300">{c.label}</p>
            <p className="text-lg font-medium text-navy-900 dark:text-navy-50">
              {c.value === undefined ? "..." : c.value}
            </p>
          </div>
        ))}
      </div>

      <p className="mb-2 text-sm font-medium text-navy-700 dark:text-navy-200">Recent orders</p>
      <div className="overflow-hidden rounded-lg border border-navy-100 dark:border-navy-700">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-navy-100 text-navy-400 dark:border-navy-700">
              <th className="p-2.5 font-normal">Order ID</th>
              <th className="p-2.5 font-normal">Customer</th>
              <th className="p-2.5 font-normal">Status</th>
              <th className="p-2.5 font-normal">Total</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order._id} className="border-b border-navy-50 last:border-0 dark:border-navy-800">
                <td className="p-2.5">
                  <Link to={`/admin/orders/${order.orderId}`} className="text-navy-700 hover:underline dark:text-navy-200">
                    {order.orderId}
                  </Link>
                </td>
                <td className="p-2.5 text-navy-500 dark:text-navy-300">{order.customerName}</td>
                <td className="p-2.5"><StatusBadge status={order.status} /></td>
                <td className="p-2.5 text-navy-500 dark:text-navy-300">{formatCurrency(order.total)}</td>
              </tr>
            ))}
            {recentOrders.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-navy-400">No orders yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
