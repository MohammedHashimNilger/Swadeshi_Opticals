import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

/**
 * Cart lives in localStorage, keyed generically (not per-user), since a
 * customer must already be logged in before anything can be added (see
 * ProductCard's login redirect) — so there's no meaningful "guest cart"
 * to merge later.
 */
export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem("swadeshi-cart");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("swadeshi-cart", JSON.stringify(items));
  }, [items]);

  // Clears the cart when AuthContext.logout() fires — see the comment
  // on that function for why this listens via an event instead of a
  // direct import (avoids coupling two independent context providers).
  useEffect(() => {
    function handleLogout() {
      setItems([]);
    }
    window.addEventListener("swadeshi-logout", handleLogout);
    return () => window.removeEventListener("swadeshi-logout", handleLogout);
  }, []);

  function addItem(product, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product._id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product._id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          price: product.discountPrice ?? product.price,
          image: product.images?.[0] || null,
          prescriptionRequired: product.prescriptionRequired,
          quantity,
        },
      ];
    });
  }

  function updateQuantity(productId, quantity) {
    if (quantity < 1) return removeItem(productId);
    setItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)));
  }

  function removeItem(productId) {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const requiresPrescription = items.some((i) => i.prescriptionRequired);

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, removeItem, clearCart, subtotal, requiresPrescription }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
