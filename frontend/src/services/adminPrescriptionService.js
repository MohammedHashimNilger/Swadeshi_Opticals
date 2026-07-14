import adminApi from "./adminApi";

export async function fetchPrescriptions(params = {}) {
  const { data } = await adminApi.get("/admin/prescriptions", { params });
  return data;
}

export async function approvePrescription(id) {
  const { data } = await adminApi.put(`/admin/prescriptions/${id}/approve`);
  return data;
}

export async function rejectPrescription(id, reviewNote) {
  const { data } = await adminApi.put(`/admin/prescriptions/${id}/reject`, { reviewNote });
  return data;
}
