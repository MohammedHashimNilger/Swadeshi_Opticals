import api from "./api";

export async function fetchBanners() {
  const { data } = await api.get("/banners");
  return data;
}