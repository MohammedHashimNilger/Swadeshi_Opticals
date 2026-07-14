/**
 * Builds a wa.me deep link that opens the CUSTOMER's own WhatsApp app
 * with a pre-filled message to the SHOP's WhatsApp number — this is the
 * free approach from the SRS (no WhatsApp Business API needed).
 */
export function buildWhatsappLink({ storeWhatsapp, order }) {
  const itemLines = order.items
    .map((item) => `- ${item.name} x${item.quantity} (₹${item.price})`)
    .join("\n");

  const message = [
    `New order: ${order.orderId}`,
    `Name: ${order.customerName}`,
    `Phone: ${order.customerPhone}`,
    `Address: ${order.customerAddress.fullAddress}`,
    "",
    "Items:",
    itemLines,
    "",
    `Prescription uploaded: ${order.prescription ? "Yes" : "No"}`,
    order.specialInstructions ? `Special instructions: ${order.specialInstructions}` : null,
    `Total: ₹${order.total}`,
  ]
    .filter(Boolean)
    .join("\n");

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${storeWhatsapp}?text=${encodedMessage}`;
}
