import { Helmet } from "react-helmet-async";
import { SITE_URL, formatPageTitle, breadcrumbJsonLd } from "../../config/seo";

export default function PrivacyPolicy() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Helmet>
        <title>{formatPageTitle("Privacy Policy")}</title>
        <meta
          name="description"
          content="Read the Privacy Policy of Swadeshi Opticals. Learn how we collect, use, and protect your personal information when you order eyewear online."
        />
        <link rel="canonical" href={`${SITE_URL}/policies/privacy`} />
        <meta
          property="og:title"
          content="Privacy Policy | Swadeshi Opticals"
        />
        <meta
          property="og:description"
          content="Read the Privacy Policy of Swadeshi Opticals. Learn how we collect, use, and protect your personal information."
        />
        <meta property="og:url" content={`${SITE_URL}/policies/privacy`} />
        <meta
          name="twitter:title"
          content="Privacy Policy | Swadeshi Opticals"
        />
        <meta
          name="twitter:description"
          content="Read the Privacy Policy of Swadeshi Opticals. Learn how we collect, use, and protect your personal information."
        />
        <script type="application/ld+json">
          {JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: "/" },
              { name: "Privacy Policy", url: "/policies/privacy" },
            ]),
          )}
        </script>
      </Helmet>

      <p className="mb-3 text-xs text-navy-400">Home / Privacy Policy</p>
      <h1 className="mb-5 text-xl font-medium text-navy-900 dark:text-navy-50">
        Privacy Policy
      </h1>
      <div className="flex flex-col gap-4 text-sm text-navy-600 dark:text-navy-300">
        <p>
          We collect only the information needed to process your orders: your
          name, phone number, address, and any prescription details you choose
          to share.
        </p>
        <p>
          Your information is never sold to third parties. It is used solely to
          fulfill your orders and communicate with you about them.
        </p>
        <p>
          Uploaded prescription files are stored securely and are only
          accessible to our team for order verification purposes.
        </p>
      </div>
    </div>
  );
}
