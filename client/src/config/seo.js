/**
 * Central SEO configuration for Swadeshi Opticals.
 * All business info, default meta tags, and structured data templates
 * live here so they can be reused across every page.
 */

export const SITE_NAME = "Swadeshi Opticals";
export const SITE_URL = "https://swadeshiopticals.com";
export const DEFAULT_DESCRIPTION =
  "Swadeshi Opticals — premium eyeglasses, sunglasses, contact lenses and accessories in Chittorgarh, Rajasthan. Order online with Cash on Delivery or WhatsApp payment.";
export const DEFAULT_OG_IMAGE = "/images/og-image.png";
export const DEFAULT_OG_IMAGE_ALT = "Swadeshi Opticals — Premium Eyewear Store";
export const TWITTER_HANDLE = "@swadeshiopticals";

export const BUSINESS_INFO = {
  name: "Swadeshi Opticals",
  description:
    "Premium eyewear store in Chittorgarh, Rajasthan. We offer eyeglasses, sunglasses, contact lenses, and accessories with personal service and Cash on Delivery.",
  address: {
    street: "51, Rana Sanga Market, Rana Sanga Bazar, Sector 1, Gandhi Nagar",
    city: "Chittorgarh",
    state: "Rajasthan",
    zip: "312001",
    country: "IN",
  },
  coordinates: {
    latitude: 24.8886761,
    longitude: 74.6340543,
  },
  phone: "+91 94134 60346",
  email: "id.swadeshi.opticals051@gmail.com",
  openingHours: "Mo-Su 10:00-20:00",
  priceRange: "₹₹",
  image: "/images/logo.png",
  url: SITE_URL,
};

/**
 * Generate a page-specific title with the site name suffix.
 */
export function formatPageTitle(title) {
  return title ? `${title} | ${SITE_NAME}` : SITE_NAME;
}

/**
 * Generate breadcrumb structured data (JSON-LD).
 * @param {Array<{name: string, url: string}>} items - Breadcrumb items in order.
 */
export function breadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * Generate LocalBusiness structured data (JSON-LD) for the homepage.
 */
export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#business`,
    name: BUSINESS_INFO.name,
    description: BUSINESS_INFO.description,
    url: BUSINESS_INFO.url,
    telephone: BUSINESS_INFO.phone,
    email: BUSINESS_INFO.email,
    image: `${SITE_URL}${BUSINESS_INFO.image}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS_INFO.address.street,
      addressLocality: BUSINESS_INFO.address.city,
      addressRegion: BUSINESS_INFO.address.state,
      postalCode: BUSINESS_INFO.address.zip,
      addressCountry: BUSINESS_INFO.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS_INFO.coordinates.latitude,
      longitude: BUSINESS_INFO.coordinates.longitude,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "10:00",
      closes: "20:00",
    },
    priceRange: BUSINESS_INFO.priceRange,
    sameAs: [
      `https://wa.me/919413460346`,
      `mailto:${BUSINESS_INFO.email}`,
    ],
  };
}

/**
 * Generate Product structured data (JSON-LD) for product detail pages.
 * @param {Object} product - The product object from the API.
 */
export function productJsonLd(product) {
  const displayPrice = product.discountPrice ?? product.price;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${SITE_URL}/product/${product.slug}#product`,
    name: product.name,
    description: product.description || `${product.name} — available at Swadeshi Opticals.`,
    image: product.images?.length ? product.images.map((img) => `${img}`) : [`${SITE_URL}/images/logo.png`],
    sku: product._id,
    mpn: product._id,
    brand: {
      "@type": "Brand",
      name: product.specifications?.brand || "Swadeshi Opticals",
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/product/${product.slug}`,
      priceCurrency: "INR",
      price: displayPrice,
      priceValidUntil: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      ).toISOString().split("T")[0],
      itemCondition: "https://schema.org/NewCondition",
      availability: product.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: BUSINESS_INFO.name,
      },
    },
    ...(product.specifications?.color && {
      color: product.specifications.color,
    }),
    ...(product.specifications?.gender && {
      audience: {
        "@type": "Audience",
        audienceType: product.specifications.gender === "Unisex" ? "Everyone" : product.specifications.gender,
      },
    }),
  };
}

/**
 * Generate FAQ structured data (JSON-LD).
 * @param {Array<{question: string, answer: string}>} faqs
 */
export function faqJsonLd(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}