import { Helmet } from "react-helmet-async";
import { SITE_URL, formatPageTitle, breadcrumbJsonLd } from "../../config/seo";

export default function ShippingPolicy() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Helmet>
        <title>{formatPageTitle("Shipping Policy")}</title>
        <meta
          name="description"
          content="Read the Shipping Policy of Swadeshi Opticals. Learn about order processing times, delivery charges, and shipping for eyewear in Chittorgarh, Rajasthan."
        />
        <link rel="canonical" href={`${SITE_URL}/policies/shipping`} />
        <meta
          property="og:title"
          content="Shipping Policy | Swadeshi Opticals"
        />
        <meta
          property="og:description"
          content="Read the Shipping Policy of Swadeshi Opticals. Learn about order processing times, delivery charges, and shipping for eyewear."
        />
        <meta property="og:url" content={`${SITE_URL}/policies/shipping`} />
        <meta
          name="twitter:title"
          content="Shipping Policy | Swadeshi Opticals"
        />
        <meta
          name="twitter:description"
          content="Read the Shipping Policy of Swadeshi Opticals. Learn about order processing times, delivery charges, and shipping for eyewear."
        />
        <script type="application/ld+json">
          {JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: "/" },
              { name: "Shipping Policy", url: "/policies/shipping" },
            ]),
          )}
        </script>
      </Helmet>

      <p className="mb-3 text-xs text-navy-400">Home / Shipping Policy</p>
      <h1 className="mb-5 text-xl font-medium text-navy-900 dark:text-navy-50">
        Shipping Policy
      </h1>
      <div className="flex flex-col gap-4 text-sm text-navy-600 dark:text-navy-300">
        <p>
          Orders are processed within 1-2 business days after confirmation. A
          flat delivery charge applies to all orders, shown at checkout.
        </p>
        <p>
          Delivery timelines vary by location and will be confirmed with you
          directly after your order is placed.
        </p>
        <p>
          For any delivery questions, please reach out to us on WhatsApp with
          your Order ID.
        </p>
      </div>
    </div>
  );
}
