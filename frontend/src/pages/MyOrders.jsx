import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { IconPackage } from "@tabler/icons-react";
import { fetchMyOrders } from "../services/orderService";
import { useAuth } from "../context/AuthContext";
import { formatCurrency } from "../utils/formatCurrency";
import { SITE_URL, formatPageTitle, breadcrumbJsonLd } from "../config/seo";

const STATUS_COLORS = {
  Pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  Confirmed: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Shipped: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  Delivered:
    "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  Cancelled: "bg-navy-100 text-navy-500 dark:bg-navy-800 dark:text-navy-400",
};

export default function MyOrders() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { state: { redirectTo: "/my-orders" } });
      return;
    }
    fetchMyOrders()
      .then(setOrders)
      .catch(() => setError("Couldn't load your orders. Please try again."));
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Helmet>
        <title>{formatPageTitle("My Orders")}</title>
        <meta
          name="description"
          content="View your order history at Swadeshi Opticals. Track eyeglasses, sunglasses, and contact lens orders placed online."
        />
        <link rel="canonical" href={`${SITE_URL}/my-orders`} />
        <meta name="robots" content="noindex, follow" />
        <script type="application/ld+json">
          {JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: "/" },
              { name: "My Orders", url: "/my-orders" },
            ]),
          )}
        </script>
      </Helmet>

      <h1 className="mb-7 font-display text-2xl font-medium text-navy-900 dark:text-navy-50">
        My orders
      </h1>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {orders === null && !error && (
        <p className="text-sm text-navy-400">Loading your orders...</p>
      )}

      {orders?.length === 0 && (
        <div className="rounded-xl border border-dashed border-navy-200 p-10 text-center dark:border-navy-700">
          <IconPackage size={28} className="mx-auto mb-2 text-navy-300" />
          <p className="mb-3 text-sm text-navy-400">
            You haven't placed any orders yet.
          </p>
          <Link
            to="/shop"
            className="text-sm font-medium text-navy-700 underline dark:text-navy-200"
          >
            Start shopping
          </Link>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {orders?.map((order) => (
          <div
            key={order._id}
            className="rounded-2xl border border-navy-100 p-5 transition hover:border-navy-200 dark:border-navy-800 dark:hover:border-navy-700"
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="font-display text-sm font-medium text-navy-900 dark:text-navy-50">
                {order.orderId}
              </p>
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                  STATUS_COLORS[order.status] || STATUS_COLORS.Cancelled
                }`}
              >
                {order.status}
              </span>
            </div>
            <p className="mb-1 text-xs text-navy-400">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
            <div className="flex flex-col gap-0.5">
              {order.items.map((item, i) => (
                <p key={i} className="text-xs text-navy-500 dark:text-navy-300">
                  {item.name} × {item.quantity}
                </p>
              ))}
            </div>
            <div className="mt-2 flex justify-between border-t border-navy-100 pt-2 text-sm font-medium text-navy-900 dark:border-navy-700 dark:text-navy-50">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
