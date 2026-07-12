import { sendEmail } from "../config/email.js";

export async function sendAdminNewOrderEmail(adminEmail, order) {
  if (!adminEmail) return; // settings not configured yet — skip silently
  await sendEmail({
    to: adminEmail,
    subject: `New order received — ${order.orderId}`,
    html: `
      <p>A new order has been placed.</p>
      <p><strong>Order ID:</strong> ${order.orderId}</p>
      <p><strong>Customer:</strong> ${order.customerName} (${order.customerPhone})</p>
      <p><strong>Total:</strong> ₹${order.total}</p>
      <p>View it in the admin dashboard for full details.</p>
    `,
  });
}

export async function sendOrderStatusUpdateEmail(customerEmail, order) {
  if (!customerEmail) return;
  await sendEmail({
    to: customerEmail,
    subject: `Your order ${order.orderId} is now ${order.status}`,
    html: `
      <p>Hi ${order.customerName},</p>
      <p>Your order <strong>${order.orderId}</strong> status has been updated to:</p>
      <p style="font-size: 18px; font-weight: bold;">${order.status}</p>
      <p>Thank you for shopping with Swadeshi Opticals.</p>
    `,
  });
}
