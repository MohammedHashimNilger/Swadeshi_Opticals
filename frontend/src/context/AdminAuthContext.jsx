import { createContext, useContext, useState } from "react";
import api from "../services/api";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(
    () => !!localStorage.getItem("swadeshi-admin-token")
  );
  const [pendingToken, setPendingToken] = useState(null);

  async function loginStep1(username, password) {
    const { data } = await api.post("/admin/login", { username, password });
    setPendingToken(data.pendingToken);
    return data.totpSetupRequired; // true => show QR setup screen, false => show code entry
  }

  async function setupTotp() {
    const { data } = await api.post(
      "/admin/setup-2fa",
      {},
      { headers: { Authorization: `Bearer ${pendingToken}` } }
    );
    return data.qrCodeDataUrl;
  }

  async function verifyTotp(code) {
    const { data } = await api.post(
      "/admin/verify-2fa",
      { code },
      { headers: { Authorization: `Bearer ${pendingToken}` } }
    );
    localStorage.setItem("swadeshi-admin-token", data.token);
    setIsAdminLoggedIn(true);
    setPendingToken(null);
  }

  function logout() {
    localStorage.removeItem("swadeshi-admin-token");
    setIsAdminLoggedIn(false);
  }

  return (
    <AdminAuthContext.Provider
      value={{ isAdminLoggedIn, loginStep1, setupTotp, verifyTotp, logout }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
