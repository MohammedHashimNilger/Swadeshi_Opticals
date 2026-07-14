import axios from "axios";

const adminApi = axios.create({ baseURL: import.meta.env.VITE_API_URL || "/api" });

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("swadeshi-admin-token");
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("swadeshi-admin-token");
    }
    return Promise.reject(err);
  }
);

export default adminApi;
