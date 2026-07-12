import api from "./api";

/**
 * `payload` is a plain object; prescriptionFile (if present) is a File
 * object from an <input type="file">. We build FormData here so the
 * calling component doesn't need to know this endpoint expects
 * multipart/form-data (required because of the file upload).
 */
export async function placeOrder(payload) {
  const formData = new FormData();
  formData.append("items", JSON.stringify(payload.items));
  formData.append("fullAddress", payload.fullAddress);
  formData.append("city", payload.city || "");
  formData.append("state", payload.state || "");
  formData.append("pincode", payload.pincode || "");
  formData.append("phone", payload.phone);
  formData.append("specialInstructions", payload.specialInstructions || "");

  if (payload.prescriptionMethod) {
    formData.append("prescriptionMethod", payload.prescriptionMethod);
    if (payload.prescriptionMethod === "manual") {
      formData.append("prescriptionNote", payload.prescriptionNote || "");
    } else if (payload.prescriptionMethod === "file" && payload.prescriptionFile) {
      formData.append("prescriptionFile", payload.prescriptionFile);
    }
  }

  const { data } = await api.post("/orders", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data; // { order, whatsappUrl }
}

export async function fetchMyOrders() {
  const { data } = await api.get("/orders/mine");
  return data;
}

export async function fetchMyOrderById(orderId) {
  const { data } = await api.get(`/orders/mine/${orderId}`);
  return data;
}
