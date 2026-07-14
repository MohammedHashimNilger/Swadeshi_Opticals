import adminApi from "./adminApi";

export async function fetchAllBanners() {
  const { data } = await adminApi.get("/banners/admin/all");
  return data;
}

export async function createBanner(formData) {
  const { data } = await adminApi.post("/banners/admin", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function updateBanner(id, formData) {
  const { data } = await adminApi.put(`/banners/admin/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function deleteBanner(id) {
  const { data } = await adminApi.delete(`/banners/admin/${id}`);
  return data;
}
