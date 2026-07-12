import adminApi from "./adminApi";

export async function fetchAdminCategories() {
  const { data } = await adminApi.get("/categories");
  return data;
}

export async function createCategory(payload) {
  const { data } = await adminApi.post("/categories", payload);
  return data;
}

export async function updateCategory(id, payload) {
  const { data } = await adminApi.put(`/categories/${id}`, payload);
  return data;
}

export async function deleteCategory(id) {
  const { data } = await adminApi.delete(`/categories/${id}`);
  return data;
}
