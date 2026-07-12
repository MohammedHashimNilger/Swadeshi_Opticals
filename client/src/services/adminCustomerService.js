import adminApi from "./adminApi";

export async function fetchCustomers(search = "") {
  const { data } = await adminApi.get("/admin/customers", { params: { search } });
  return data;
}
