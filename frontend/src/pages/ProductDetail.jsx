import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  IconPrescription,
  IconTruck,
  IconPackage,
  IconShoppingCartPlus,
} from "@tabler/icons-react";
import { fetchProductBySlug } from "../services/productService";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/formatCurrency";
import {
  SITE_NAME,
  SITE_URL,
  formatPageTitle,
  productJsonLd,
  breadcrumbJsonLd,
} from "../config/seo";

export default function ProductDetail() {
  const { productSlug } = useParams();
  const { isLoggedIn } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    fetchProductBySlug(productSlug)
      .then((data) => {
        setProduct(data);
        setActiveImage(0);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [productSlug]);

  function handleAddToCart() {
    if (!isLoggedIn) {
      navigate("/login", { state: { redirectTo: `/product/${productSlug}` } });
      return;
    }
    addItem(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  }

  if (loading) {
    return (
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-8 md:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-xl bg-navy-50 dark:bg-navy-800" />
        <div className="animate-pulse space-y-3">
          <div className="h-3 w-24 rounded bg-navy-50 dark:bg-navy-800" />
          <div className="h-6 w-2/3 rounded bg-navy-50 dark:bg-navy-800" />
          <div className="h-4 w-1/3 rounded bg-navy-50 dark:bg-navy-800" />
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="py-20 text-center">
        <Helmet>
          <title>{formatPageTitle("Product Not Found")}</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <p className="text-sm text-navy-400">Product not found.</p>
        <Link
          to="/shop"
          className="mt-2 inline-block text-xs font-medium text-navy-700 underline dark:text-navy-300"
        >
          Back to shop
        </Link>
      </div>
    );
  }

  const displayPrice = product.discountPrice ?? product.price;
  const discountPercent = product.discountPrice
    ? Math.round(100 - (product.discountPrice / product.price) * 100)
    : null;
  const spec = product.specifications || {};
  const productDescription =
    product.description ||
    `Buy ${product.name} online at Swadeshi Opticals. ${spec.brand ? `${spec.brand} — ` : ""}Available in ${spec.color || "multiple colors"} with ${spec.frameMaterial || "premium"} frame. Free delivery in Chittorgarh, Rajasthan.`;
  const productUrl = `${SITE_URL}/product/${product.slug}`;
  const productImage = product.images?.[0] || "/images/logo.png";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Helmet>
        <title>{formatPageTitle(product.name)}</title>
        <meta name="description" content={productDescription} />
        <link rel="canonical" href={productUrl} />
        <meta property="og:title" content={`${product.name} | ${SITE_NAME}`} />
        <meta property="og:description" content={productDescription} />
        <meta property="og:url" content={productUrl} />
        <meta property="og:image" content={productImage} />
        <meta property="og:image:alt" content={product.name} />
        <meta property="product:price:amount" content={String(displayPrice)} />
        <meta property="product:price:currency" content="INR" />
        <meta name="twitter:title" content={`${product.name} | ${SITE_NAME}`} />
        <meta name="twitter:description" content={productDescription} />
        <meta name="twitter:image" content={productImage} />
        <script type="application/ld+json">
          {JSON.stringify(productJsonLd(product))}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: "/" },
              { name: "Shop", url: "/shop" },
              {
                name: product.categories?.[0]?.name || "Eyewear",
                url: `/shop/${product.categories?.[0]?.slug || "eyewear"}`,
              },
              { name: product.name, url: `/product/${product.slug}` },
            ]),
          )}
        </script>
      </Helmet>

      <p className="mb-6 text-xs text-navy-400">
        <Link
          to="/shop"
          className="hover:text-navy-700 dark:hover:text-navy-200"
        >
          Shop
        </Link>
        <span className="mx-1.5 text-navy-200 dark:text-navy-700">/</span>
        {product.categories?.[0]?.name || "Eyewear"}
        <span className="mx-1.5 text-navy-200 dark:text-navy-700">/</span>
        <span className="text-navy-500 dark:text-navy-300">{product.name}</span>
      </p>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div>
          <div className="relative mb-3 aspect-square overflow-hidden rounded-2xl bg-navy-50 dark:bg-navy-800">
            {product.images?.[activeImage] ? (
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-navy-200">
                No image
              </div>
            )}
            {discountPercent && (
              <span className="absolute left-3 top-3 rounded-full bg-navy-700 px-2.5 py-1 text-[11px] font-semibold text-white">
                -{discountPercent}%
              </span>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-2.5">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActiveImage(i)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 transition ${
                    i === activeImage
                      ? "border-navy-700"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {spec.brand && (
            <p className="text-[11px] font-semibold uppercase tracking-wider text-navy-400">
              {spec.brand}
            </p>
          )}
          <h1 className="mt-1 font-display text-2xl font-medium text-navy-900 dark:text-navy-50">
            {product.name}
          </h1>
          <div className="mt-3 flex items-center gap-2.5">
            <p className="text-xl font-medium text-navy-900 dark:text-navy-50">
              {formatCurrency(displayPrice)}
            </p>
            {product.discountPrice && (
              <p className="text-sm text-navy-300 line-through">
                {formatCurrency(product.price)}
              </p>
            )}
          </div>

          {product.prescriptionRequired && (
            <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-dashed border-navy-300 bg-navy-50/60 p-3.5 text-xs text-navy-600 dark:border-navy-600 dark:bg-navy-800/50 dark:text-navy-200">
              <IconPrescription
                size={17}
                className="flex-shrink-0 text-navy-600"
              />
              Prescription required — upload it or add it during checkout, or
              skip and add it later.
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-navy-900 py-3 text-sm font-semibold text-white transition hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-navy-300 dark:text-navy-900 dark:hover:bg-navy-400"
          >
            <IconShoppingCartPlus size={17} />
            {product.stock === 0
              ? "Out of stock"
              : justAdded
                ? "Added to cart"
                : "Add to cart"}
          </button>

          <div className="mt-4 flex flex-col gap-2 text-xs text-navy-500 dark:text-navy-300">
            <div className="flex items-center gap-2">
              <IconTruck size={14} className="text-navy-400" /> Delivery charge
              calculated at checkout
            </div>
            <div className="flex items-center gap-2">
              <IconPackage size={14} className="text-navy-400" />
              {product.stock > 0 ? "In stock" : "Out of stock"}
            </div>
          </div>

          {product.description && (
            <p className="mt-6 text-sm leading-relaxed text-navy-500 dark:text-navy-300">
              {product.description}
            </p>
          )}

          {(spec.frameSize ||
            spec.frameMaterial ||
            spec.lensType ||
            spec.gender ||
            spec.color ||
            spec.weight ||
            spec.dimensions) && (
            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-navy-100 pt-6 text-xs dark:border-navy-800">
              {spec.frameSize && (
                <SpecRow label="Frame size" value={spec.frameSize} />
              )}
              {spec.frameMaterial && (
                <SpecRow label="Frame material" value={spec.frameMaterial} />
              )}
              {spec.lensType && (
                <SpecRow label="Lens type" value={spec.lensType} />
              )}
              {spec.gender && <SpecRow label="Gender" value={spec.gender} />}
              {spec.color && <SpecRow label="Color" value={spec.color} />}
              {spec.weight && <SpecRow label="Weight" value={spec.weight} />}
              {spec.dimensions && (
                <SpecRow label="Dimensions" value={spec.dimensions} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SpecRow({ label, value }) {
  return (
    <p className="text-navy-400">
      {label}
      <span className="ml-1 text-navy-700 dark:text-navy-100">{value}</span>
    </p>
  );
}
