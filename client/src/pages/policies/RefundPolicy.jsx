import { Helmet } from "react-helmet-async";
import { SITE_URL, formatPageTitle, breadcrumbJsonLd } from "../../config/seo";

export default function RefundPolicy() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Helmet>
        <title>{formatPageTitle("Refund Policy")}</title>
        <meta
          name="description"
          content="Read the Refund Policy of Swadeshi Opticals. Learn about returns, replacements, and refunds for eyeglasses, sunglasses, and prescription lenses."
        />
        <link rel="canonical" href={`${SITE_URL}/policies/refund`} />
        <meta property="og:title" content="Refund Policy | Swadeshi Opticals" />
        <meta
          property="og:description"
          content="Read the Refund Policy of Swadeshi Opticals. Learn about returns, replacements, and refunds for eyewear."
        />
        <meta property="og:url" content={`${SITE_URL}/policies/refund`} />
        <meta
          name="twitter:title"
          content="Refund Policy | Swadeshi Opticals"
        />
        <meta
          name="twitter:description"
          content="Read the Refund Policy of Swadeshi Opticals. Learn about returns, replacements, and refunds for eyewear."
        />
        <script type="application/ld+json">
          {JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: "/" },
              { name: "Refund Policy", url: "/policies/refund" },
            ]),
          )}
        </script>
      </Helmet>

      <p className="mb-3 text-xs text-navy-400">Home / Refund Policy</p>
      <h1 className="mb-5 text-xl font-medium text-navy-900 dark:text-navy-50">
        Refund Policy
      </h1>
      <div className="flex flex-col gap-4 text-sm text-navy-600 dark:text-navy-300">
        <p>
          If an item arrives damaged or incorrect, contact us on WhatsApp within
          3 days of delivery with your Order ID and photos of the item.
        </p>
        <p>
          Approved returns are eligible for a replacement or a full refund,
          processed after the item is received back at our store.
        </p>
        <p>
          Made-to-order prescription lenses are not eligible for return unless
          there is a manufacturing defect.
        </p>
      </div>
    </div>
  );
}
