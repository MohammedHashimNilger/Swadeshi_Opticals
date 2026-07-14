import adminApi from "./adminApi";

export async function updateSettings(payload) {
  const { data } = await adminApi.put("/settings", payload);
  return data;
}
