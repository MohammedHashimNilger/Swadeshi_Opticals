import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  IconUser,
  IconPhone,
  IconMapPin,
  IconPrescription,
  IconBrandWhatsapp,
} from "@tabler/icons-react";
import { buildCustomerWhatsappLink } from "../../utils/buildCustomerWhatsappLink";
import {
  fetchOrderByIdAdmin,
  updateOrderStatus,
} from "../../services/adminOrderService";
import {
  approvePrescription,
  rejectPrescription,
} from "../../services/adminPrescriptionService";
import { formatCurrency } from "../../utils/formatCurrency";
import StatusBadge from "../../components/admin/StatusBadge";

const STATUS_FLOW = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export default function OrderDetail() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    fetchOrderByIdAdmin(orderId)
      .then(setOrder)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  async function handleStatusChange(newStatus) {
    await updateOrderStatus(orderId, newStatus);
    load();
  }

  async function handleApprove() {
    await approvePrescription(order.prescription._id);
    load();
  }

  async function handleReject() {
    const reviewNote =
      window.prompt("Reason for rejection (shown to help you track it):") || "";
    await rejectPrescription(order.prescription._id, reviewNote);
    load();
  }

  if (loading) return <p className="text-sm text-navy-400">Loading order...</p>;
  if (!order) return <p className="text-sm text-navy-400">Order not found.</p>;

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-lg font-medium text-navy-900 dark:text-navy-50">
            Order {order.orderId}
          </p>
          <p className="text-xs text-navy-400">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <select
          value={order.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="rounded border border-navy-300 px-3 py-1.5 text-xs dark:border-navy-600 dark:bg-navy-800"
        >
          {STATUS_FLOW.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.3fr_1fr]">
        <div className="rounded-lg border border-navy-100 p-4 dark:border-navy-700">
          <p className="mb-3 text-sm font-medium text-navy-800 dark:text-navy-50">
            Items
          </p>
          {order.items.map((item, i) => (
            <div
              key={i}
              className="mb-2 flex items-center justify-between text-xs"
            >
              <p className="text-navy-500 dark:text-navy-300">
                {item.name} × {item.quantity}
              </p>
              <p className="text-navy-700 dark:text-navy-100">
                {formatCurrency(item.price * item.quantity)}
              </p>
            </div>
          ))}
          <div className="mt-3 flex justify-between border-t border-navy-100 pt-3 text-sm font-medium dark:border-navy-700">
            <span>Total</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-lg border border-navy-100 p-4 text-xs dark:border-navy-700">
            <p className="mb-2 text-sm font-medium text-navy-800 dark:text-navy-50">
              Customer
            </p>
            <p className="mb-1 flex items-center gap-2 text-navy-500 dark:text-navy-300">
              <IconUser size={14} /> {order.customerName}
            </p>
            <p className="mb-1 flex items-center gap-2 text-navy-500 dark:text-navy-300">
              <IconPhone size={14} /> {order.customerPhone}
            </p>
            <p className="mb-1 flex items-start gap-2 text-navy-500 dark:text-navy-300">
              <IconMapPin size={14} className="mt-0.5 shrink-0" />{" "}
              {order.customerAddress?.fullAddress}
            </p>
            <p className="mb-1 ml-6 text-navy-400">
              {[
                order.customerAddress?.city,
                order.customerAddress?.state,
                order.customerAddress?.pincode,
              ]
                .filter(Boolean)
                .join(", ")}
            </p>
            <a
              href={buildCustomerWhatsappLink(
                order.customerPhone,
                order.orderId,
              )}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-green-600 px-2.5 py-1.5 text-[11px] font-medium text-green-700 dark:border-green-500 dark:text-green-400"
            >
              <IconBrandWhatsapp size={14} /> Message customer on WhatsApp
            </a>
          </div>

          {order.prescription && (
            <div className="rounded-lg border border-dashed border-navy-300 bg-navy-50/50 p-4 text-xs dark:border-navy-600 dark:bg-navy-800/50">
              <p className="mb-2 flex items-center gap-2 text-sm font-medium text-navy-800 dark:text-navy-50">
                <IconPrescription size={16} /> Prescription
              </p>
              <p className="mb-2 text-navy-500 dark:text-navy-300">
                Status:{" "}
                <StatusBadge
                  status={
                    order.prescription.status === "pending"
                      ? "Pending"
                      : order.prescription.status === "approved"
                        ? "Confirmed"
                        : "Cancelled"
                  }
                />
              </p>
              {order.prescription.method === "file" ? (
                <a
                  href={order.prescription.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-navy-600 underline dark:text-navy-300"
                >
                  View uploaded file
                </a>
              ) : (
                <p className="text-navy-500 dark:text-navy-300">
                  Note: {order.prescription.note}
                </p>
              )}
              {order.prescription.status === "pending" && (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={handleApprove}
                    className="rounded border border-navy-400 px-3 py-1"
                  >
                    Approve
                  </button>
                  <button
                    onClick={handleReject}
                    className="rounded border border-navy-400 px-3 py-1"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {order.specialInstructions && (
        <div className="mt-4 rounded-lg border border-dashed border-navy-200 p-4 text-xs dark:border-navy-700">
          <p className="mb-1 text-sm font-medium text-navy-800 dark:text-navy-50">
            Special instructions
          </p>
          <p className="text-navy-500 dark:text-navy-300">
            {order.specialInstructions}
          </p>
        </div>
      )}
    </div>
  );
}
