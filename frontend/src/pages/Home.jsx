import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  IconTruck,
  IconBrandWhatsapp,
  IconCash,
  IconPrescription,
} from "@tabler/icons-react";
import { fetchCategories } from "../services/categoryService";
import { fetchProducts } from "../services/productService";
import { fetchSettings } from "../services/settingsService";
import ProductCard from "../components/product/ProductCard";
import ApertureRing from "../components/common/ApertureRing";
import { getCategoryIcon } from "../utils/categoryIcons";
import HeroCarousel from "../components/carousel/HeroCarousel";
import {
  SITE_NAME,
  SITE_URL,
  DEFAULT_DESCRIPTION,
  formatPageTitle,
  localBusinessJsonLd,
  breadcrumbJsonLd,
} from "../config/seo";

const TRUST_BADGES = [
  { icon: IconTruck, label: "Fast delivery" },
  { icon: IconBrandWhatsapp, label: "WhatsApp support" },
  { icon: IconCash, label: "Cash on delivery" },
  { icon: IconPrescription, label: "Prescription support" },
];

export default function Home() {
  const [topCategories, setTopCategories] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetchCategories()
      .then((categories) =>
        setTopCategories(
          categories.filter((c) => !c.parentCategory).slice(0, 6),
        ),
      )
      .catch((err) => console.error("Failed to load categories:", err));

    fetchProducts({ sort: "newest" })
      .then((data) => setBestSellers(data.products.slice(0, 4)))
      .catch((err) => console.error("Failed to load products:", err));

    fetchSettings()
      .then(setSettings)
      .catch(() => {});
  }, []);

  return (
    <div>
      <Helmet>
        <title>{formatPageTitle("Home")}</title>
        <meta name="description" content={DEFAULT_DESCRIPTION} />
        <link rel="canonical" href={SITE_URL} />
        <meta
          property="og:title"
          content={`${SITE_NAME} — Premium Eyewear Store in Chittorgarh, Rajasthan`}
        />
        <meta property="og:description" content={DEFAULT_DESCRIPTION} />
        <meta property="og:url" content={SITE_URL} />
        <meta
          name="twitter:title"
          content={`${SITE_NAME} — Premium Eyewear Store in Chittorgarh, Rajasthan`}
        />
        <meta name="twitter:description" content={DEFAULT_DESCRIPTION} />
        <script type="application/ld+json">
          {JSON.stringify(localBusinessJsonLd())}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbJsonLd([{ name: "Home", url: "/" }]))}
        </script>
      </Helmet>

      <div className="bg-navy-900 py-2 text-center text-xs text-navy-100">
        Free delivery on prepaid orders — call us anytime
      </div>

      <HeroCarousel />

      <section className="w-full bg-navy-50 py-6 sm:py-12 dark:bg-navy-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-lg font-bold text-navy-900 dark:text-navy-50 sm:mb-8 sm:text-2xl">
            Top Categories
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-8 lg:grid-cols-5">
            {[
              {
                name: "Eyeglasses",
                to: "/shop/eyeglasses",
                slug: "eyeglasses",
                fallback:
                  "https://res.cloudinary.com/daptgoorc/image/upload/v1783852015/TopCategories_eyeglasses_w81klq.png",
              },
              {
                name: "Sunglasses",
                to: "/shop/sunglasses",
                slug: "sunglasses",
                fallback:
                  "https://res.cloudinary.com/daptgoorc/image/upload/v1783852016/TopCategories_sunglasses_mljxme.png",
              },
              {
                name: "Accessories",
                to: "/shop/accessories",
                slug: "accessories",
                fallback:
                  "https://res.cloudinary.com/daptgoorc/image/upload/v1783852017/TopCategories_accessories_jbudvz.png",
              },
              {
                name: "Contact Lenses",
                to: "/shop/contact-lenses",
                slug: "contact-lenses",
                fallback:
                  "https://res.cloudinary.com/daptgoorc/image/upload/v1783852015/TopCategories_lense_x4lavb.png",
              },
              {
                name: "Kids Glasses",
                to: "/shop/kids",
                slug: "kids",
                fallback:
                  "https://res.cloudinary.com/daptgoorc/image/upload/v1783852016/TopCategories_kidsglasses_pyw3hi.png",
              },
            ].map((cat) => {
              const imgSrc = cat.fallback;
              return (
                <Link
                  key={cat.name}
                  to={cat.to}
                  className="group flex flex-col items-center gap-2 sm:gap-4"
                >
                  <div className="h-24 w-full overflow-hidden rounded-[2rem] bg-white shadow-md transition-all duration-300 group-hover:shadow-2xl dark:bg-navy-900 sm:h-40">
                    <img
                      src={imgSrc}
                      alt={cat.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />
                  </div>
                  <p className="text-center text-sm font-bold text-navy-800 dark:text-navy-100 sm:text-lg">
                    {cat.name}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {settings?.storeLatLng && (
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${settings.storeLatLng.lat},${settings.storeLatLng.lng}`}
          target="_blank"
          rel="noreferrer"
          className="block"
        >
          <img
            src="/images/promotional-banner.png"
            alt="Visit our store"
            className="w-full"
          />
        </a>
      )}

      <section className="w-full bg-white py-6 dark:bg-navy-900 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-lg font-bold text-navy-900 dark:text-navy-50 sm:mb-8 sm:text-2xl">
            Get the perfect shape - Eyeglasses
          </h2>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-8 lg:grid-cols-7">
            {[
              {
                name: "Rectangle",
                to: "/shop?shape=Rectangle",
                image:
                  "https://res.cloudinary.com/daptgoorc/image/upload/v1783852016/shape_rectangular_dkqcnk.png",
              },
              {
                name: "Cat-Eye",
                to: "/shop?shape=Cat-Eye",
                image:
                  "https://res.cloudinary.com/daptgoorc/image/upload/v1783852017/shape_cateye_dwkcgg.png",
              },
              {
                name: "Aviator",
                to: "/shop?shape=Aviator",
                image:
                  "https://res.cloudinary.com/daptgoorc/image/upload/v1783852017/shape_aviator_l7w3oz.png",
              },
              {
                name: "Geometric",
                to: "/shop?shape=Geometric",
                image:
                  "https://res.cloudinary.com/daptgoorc/image/upload/v1783852018/shape_geometric_fzamo3.png",
              },
              {
                name: "Round",
                to: "/shop?shape=Round",
                image:
                  "https://res.cloudinary.com/daptgoorc/image/upload/v1783852018/shape_round_m9syiy.png",
              },
              {
                name: "Clubmaster",
                to: "/shop?shape=Clubmaster",
                image:
                  "https://res.cloudinary.com/daptgoorc/image/upload/v1783852018/shape_clubmaster_zllgyn.png",
              },
              {
                name: "Square",
                to: "/shop?shape=Square",
                image:
                  "https://res.cloudinary.com/daptgoorc/image/upload/v1783852307/shape_square_yzejvx.png",
              },
            ].map((shape) => {
              return (
                <Link
                  key={shape.name}
                  to={shape.to}
                  className="group flex flex-col items-center gap-1 sm:gap-3"
                >
                  <div className="h-16 w-24 overflow-hidden rounded-[50%] bg-navy-50 transition-shadow duration-300 group-hover:shadow-xl dark:bg-navy-800 sm:h-28 sm:w-40">
                    <img
                      src={shape.image}
                      alt={shape.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <p className="text-center text-[11px] font-semibold text-navy-800 dark:text-navy-100 sm:text-sm">
                    {shape.name}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-12 sm:grid-cols-4">
        {TRUST_BADGES.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="hover-lift flex flex-col items-center gap-2 rounded-xl border border-navy-100 p-5 text-center shadow-sm dark:border-navy-700"
          >
            <Icon size={22} className="text-navy-600 dark:text-navy-300" />
            <p className="text-xs text-navy-500 dark:text-navy-300">{label}</p>
          </div>
        ))}
      </section>

      {topCategories.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-14">
          <h2 className="mb-5 font-display text-lg font-medium text-navy-900 dark:text-navy-50">
            Shop by category
          </h2>
          <div className="grid grid-cols-3 gap-5 sm:grid-cols-6">
            {topCategories.map((cat) => {
              const Icon = getCategoryIcon(cat.icon);
              return (
                <Link
                  key={cat._id}
                  to={`/shop?category=${cat._id}`}
                  className="group flex flex-col items-center gap-2"
                >
                  <div className="aperture-ring flex h-16 w-16 items-center justify-center text-navy-300 transition group-hover:text-navy-700 dark:text-navy-600">
                    <Icon
                      size={22}
                      className="text-navy-600 transition group-hover:scale-110 group-hover:text-navy-700 dark:text-navy-300"
                    />
                  </div>
                  <p className="text-center text-xs text-navy-500 dark:text-navy-300">
                    {cat.name}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {bestSellers.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-20">
          <h2 className="mb-5 font-display text-lg font-medium text-navy-900 dark:text-navy-50">
            Best sellers
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {bestSellers.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
