import { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("swadeshi-user");
    return stored ? JSON.parse(stored) : null;
  });

  function persistSession({ token, user }) {
    localStorage.setItem("swadeshi-token", token);
    localStorage.setItem("swadeshi-user", JSON.stringify(user));
    setUser(user);
  }

  async function login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    persistSession(data);
  }

  async function register(name, email, password, phone) {
    const { data } = await api.post("/auth/register", { name, email, password, phone });
    persistSession(data);
  }

  async function loginWithGoogle(idToken) {
    const { data } = await api.post("/auth/google", { idToken });
    persistSession(data);
  }

  function logout() {
    localStorage.removeItem("swadeshi-token");
    localStorage.removeItem("swadeshi-user");
    setUser(null);
    // CartContext listens for this to clear the cart — prevents the next
    // person on a shared device from seeing the previous user's cart.
    window.dispatchEvent(new Event("swadeshi-logout"));
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn: !!user, login, register, loginWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
