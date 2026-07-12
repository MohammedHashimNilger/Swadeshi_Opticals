import { Link, useNavigate } from "react-router-dom";
import { IconShoppingCartPlus } from "@tabler/icons-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { formatCurrency } from "../../utils/formatCurrency";

export default function ProductCard({ product }) {
  const { isLoggedIn } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();

  function handleAddToCart(e) {
    e.preventDefault(); // don't follow the card's <Link> to the product page
    if (!isLoggedIn) {
      navigate("/login", { state: { redirectTo: `/product/${product.slug}` } });
      return;
    }
    addItem(product);
  }

  const displayPrice = product.discountPrice ?? product.price;
  const discountPercent = product.discountPrice
    ? Math.round(100 - (product.discountPrice / product.price) * 100)
    : null;

  return (
    <Link
      to={`/product/${product.slug}`}
      className="hover-lift group relative block rounded-xl border border-navy-100 bg-white p-2.5 shadow-sm transition hover:shadow-md dark:border-navy-700 dark:bg-navy-900"
    >
      <div className="relative mb-2 aspect-square overflow-hidden rounded-lg bg-navy-50 ring-1 ring-transparent transition group-hover:ring-navy-300/70 dark:bg-navy-800">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-navy-200">
            No image
          </div>
        )}
        {discountPercent && (
          <span className="absolute left-2 top-2 rounded-full bg-navy-700 px-2 py-0.5 text-[10px] font-semibold text-white">
            -{discountPercent}%
          </span>
        )}
        <button
          aria-label="Add to cart"
          onClick={handleAddToCart}
          className="absolute right-2 top-2 rounded-full bg-white/95 p-1.5 text-navy-500 shadow transition hover:text-navy-900 dark:bg-navy-900/90 dark:text-navy-300"
        >
          <IconShoppingCartPlus size={16} />
        </button>
      </div>

      <p className="truncate text-xs text-navy-500 dark:text-navy-300">
        {product.name}
      </p>
      <div className="flex items-center gap-2">
        <p className="text-sm font-semibold text-navy-900 dark:text-navy-50">
          {formatCurrency(displayPrice)}
        </p>
        {product.discountPrice && (
          <p className="text-[10px] text-navy-300 line-through">
            {formatCurrency(product.price)}
          </p>
        )}
      </div>
    </Link>
  );
}
