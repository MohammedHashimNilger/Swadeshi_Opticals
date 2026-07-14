import adminApi from "./adminApi";

export async function fetchAdminProducts(params = {}) {
  const { data } = await adminApi.get("/products", { params });
  return data;
}

export async function fetchAdminProductBySlug(slug) {
  const { data } = await adminApi.get(`/products/${slug}`);
  return data;
}

export async function createProduct(formData) {
  const { data } = await adminApi.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function updateProduct(id, formData) {
  const { data } = await adminApi.put(`/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function deleteProduct(id) {
  const { data } = await adminApi.delete(`/products/${id}`);
  return data;
}
