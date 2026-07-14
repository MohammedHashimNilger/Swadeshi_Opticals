import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { IconShoppingBag } from "@tabler/icons-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { fetchSettings } from "../services/settingsService";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import { SITE_URL, formatPageTitle, breadcrumbJsonLd } from "../config/seo";

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [deliveryCharge, setDeliveryCharge] = useState(0);

  useEffect(() => {
    fetchSettings()
      .then((settings) => setDeliveryCharge(settings.deliveryCharge))
      .catch((err) => console.error("Failed to load settings:", err));
  }, []);

  function handleCheckout() {
    if (!isLoggedIn) {
      navigate("/login", { state: { redirectTo: "/checkout" } });
      return;
    }
    navigate("/checkout");
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-24 text-center">
        <Helmet>
          <title>{formatPageTitle("Cart")}</title>
          <meta
            name="description"
            content="Your shopping cart at Swadeshi Opticals is empty. Browse our collection of eyeglasses, sunglasses, and contact lenses."
          />
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <IconShoppingBag
          size={32}
          className="text-navy-200 dark:text-navy-700"
        />
        <p className="text-sm text-navy-400">Your cart is empty.</p>
        <Link
          to="/shop"
          className="mt-1 rounded-full bg-navy-900 px-5 py-2 text-xs font-semibold text-white transition hover:bg-navy-800 dark:bg-navy-300 dark:text-navy-900 dark:hover:bg-navy-400"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Helmet>
        <title>{formatPageTitle("Cart")}</title>
        <meta
          name="description"
          content={`Review your cart with ${items.length} item(s) at Swadeshi Opticals. Proceed to checkout for eyewear delivery in Chittorgarh, Rajasthan.`}
        />
        <link rel="canonical" href={`${SITE_URL}/cart`} />
        <meta name="robots" content="noindex, follow" />
        <script type="application/ld+json">
          {JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: "/" },
              { name: "Cart", url: "/cart" },
            ]),
          )}
        </script>
      </Helmet>

      <h1 className="mb-6 font-display text-2xl font-medium text-navy-900 dark:text-navy-50">
        Your cart
      </h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <CartItem
              key={item.productId}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          ))}
        </div>

        <CartSummary
          subtotal={subtotal}
          deliveryCharge={deliveryCharge}
          onCheckout={handleCheckout}
        />
      </div>
    </div>
  );
}
