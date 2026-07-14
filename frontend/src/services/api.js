import axios from "axios";

/**
 * Single axios instance for the whole app. In dev, Vite's proxy (see
 * vite.config.js) forwards /api requests to the local Express server,
 * so we can just use a relative baseURL and it works identically in
 * dev and in production (where Vercel routes /api/* to the function).
 */
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "/api" });

// Attach the customer JWT (if present) to every request automatically —
// but only if the caller hasn't already set an explicit Authorization
// header themselves. AdminAuthContext uses this same `api` instance
// with its own pendingToken header during the 2FA login flow; without
// this check, a customer session in the same browser would silently
// overwrite that header and break admin login.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("swadeshi-token");
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
