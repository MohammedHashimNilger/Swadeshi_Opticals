import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IconSearch } from "@tabler/icons-react";
import { fetchAllOrders } from "../../services/adminOrderService";
import { formatCurrency } from "../../utils/formatCurrency";
import StatusBadge from "../../components/admin/StatusBadge";

const STATUSES = ["", "Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchAllOrders({ status, search, page })
      .then((data) => {
        setOrders(data.orders);
        setTotalPages(data.totalPages);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [status, search, page]);

  return (
    <div>
      <p className="mb-5 text-lg font-medium text-navy-900 dark:text-navy-50">Orders</p>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded border border-navy-200 px-2 py-1.5 text-xs dark:border-navy-700">
          <IconSearch size={14} className="text-navy-400" />
          <input
            placeholder="Search order ID, name, phone"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-56 bg-transparent outline-none dark:text-navy-100"
          />
        </div>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="rounded border border-navy-200 px-2 py-1.5 text-xs dark:border-navy-700 dark:bg-navy-800"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s || "All statuses"}</option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-lg border border-navy-100 dark:border-navy-700">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-navy-100 text-navy-400 dark:border-navy-700">
              <th className="p-2.5 font-normal">Order ID</th>
              <th className="p-2.5 font-normal">Customer</th>
              <th className="p-2.5 font-normal">Status</th>
              <th className="p-2.5 font-normal">Total</th>
              <th className="p-2.5 font-normal">Placed</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b border-navy-50 last:border-0 dark:border-navy-800">
                <td className="p-2.5">
                  <Link to={`/admin/orders/${order.orderId}`} className="text-navy-700 hover:underline dark:text-navy-200">
                    {order.orderId}
                  </Link>
                </td>
                <td className="p-2.5 text-navy-500 dark:text-navy-300">{order.customerName}</td>
                <td className="p-2.5"><StatusBadge status={order.status} /></td>
                <td className="p-2.5 text-navy-500 dark:text-navy-300">{formatCurrency(order.total)}</td>
                <td className="p-2.5 text-navy-400">{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {!loading && orders.length === 0 && (
              <tr><td colSpan={5} className="p-4 text-center text-navy-400">No orders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2 text-xs">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`rounded px-2 py-1 ${page === p ? "bg-navy-600 text-white" : "text-navy-500"}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
