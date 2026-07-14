// Builds a wa.me link the ADMIN uses to message the CUSTOMER directly,
// pre-filled with a friendly order-confirmation opener. Strips
// non-digit characters and assumes a 10-digit Indian number needs the
// country code prefixed if it's missing.
export function buildCustomerWhatsappLink(phone, orderId) {
  const digits = (phone || "").replace(/\D/g, "");
  const withCountryCode = digits.length === 10 ? `91${digits}` : digits;
  const message = `Hi! This is Swadeshi Opticals calling about your order ${orderId}. We'd like to confirm a few details before it ships.`;
  return `https://wa.me/${withCountryCode}?text=${encodeURIComponent(message)}`;
}
