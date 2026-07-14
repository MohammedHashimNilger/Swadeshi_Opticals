import adminApi from "./adminApi";

export async function fetchDashboardStats() {
  const { data } = await adminApi.get("/orders/admin/stats/summary");
  return data;
}

export async function fetchAllOrders(params = {}) {
  const { data } = await adminApi.get("/orders/admin/all", { params });
  return data;
}

export async function fetchOrderByIdAdmin(orderId) {
  const { data } = await adminApi.get(`/orders/admin/${orderId}`);
  return data;
}

export async function updateOrderStatus(orderId, status) {
  const { data } = await adminApi.put(`/orders/admin/${orderId}/status`, { status });
  return data;
}
