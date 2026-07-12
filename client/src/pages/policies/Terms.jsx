import { Helmet } from "react-helmet-async";
import { SITE_URL, formatPageTitle, breadcrumbJsonLd } from "../../config/seo";

export default function Terms() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Helmet>
        <title>{formatPageTitle("Terms & Conditions")}</title>
        <meta
          name="description"
          content="Read the Terms & Conditions of Swadeshi Opticals. Understand the terms of placing an order for eyewear, payment, and order fulfillment."
        />
        <link rel="canonical" href={`${SITE_URL}/policies/terms`} />
        <meta
          property="og:title"
          content="Terms & Conditions | Swadeshi Opticals"
        />
        <meta
          property="og:description"
          content="Read the Terms & Conditions of Swadeshi Opticals for ordering eyewear online."
        />
        <meta property="og:url" content={`${SITE_URL}/policies/terms`} />
        <meta
          name="twitter:title"
          content="Terms & Conditions | Swadeshi Opticals"
        />
        <meta
          name="twitter:description"
          content="Read the Terms & Conditions of Swadeshi Opticals for ordering eyewear online."
        />
        <script type="application/ld+json">
          {JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: "/" },
              { name: "Terms & Conditions", url: "/policies/terms" },
            ]),
          )}
        </script>
      </Helmet>

      <p className="mb-3 text-xs text-navy-400">Home / Terms & Conditions</p>
      <h1 className="mb-5 text-xl font-medium text-navy-900 dark:text-navy-50">
        Terms & Conditions
      </h1>
      <div className="flex flex-col gap-4 text-sm text-navy-600 dark:text-navy-300">
        <p>
          By placing an order on this website, you agree to provide accurate
          information and confirm that any prescription details submitted are
          correct.
        </p>
        <p>
          Payment is accepted only via Cash on Delivery or by scanning our
          shop's QR code, coordinated over WhatsApp after checkout.
        </p>
        <p>
          We reserve the right to cancel any order that cannot be fulfilled or
          verified.
        </p>
      </div>
    </div>
  );
}
