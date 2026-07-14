import api from "./api";

export async function fetchSettings() {
  const { data } = await api.get("/settings");
  return data;
}
