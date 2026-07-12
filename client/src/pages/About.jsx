import { Helmet } from "react-helmet-async";
import { SITE_URL, formatPageTitle, breadcrumbJsonLd } from "../config/seo";

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Helmet>
        <title>{formatPageTitle("About Us")}</title>
        <meta
          name="description"
          content="Learn about Swadeshi Opticals — a trusted local optical store in Chittorgarh, Rajasthan offering quality eyewear at honest prices with personal service."
        />
        <link rel="canonical" href={`${SITE_URL}/about`} />
        <meta property="og:title" content="About Us | Swadeshi Opticals" />
        <meta
          property="og:description"
          content="Learn about Swadeshi Opticals — a trusted local optical store in Chittorgarh, Rajasthan offering quality eyewear at honest prices with personal service."
        />
        <meta property="og:url" content={`${SITE_URL}/about`} />
        <meta name="twitter:title" content="About Us | Swadeshi Opticals" />
        <meta
          name="twitter:description"
          content="Learn about Swadeshi Opticals — a trusted local optical store in Chittorgarh, Rajasthan offering quality eyewear at honest prices with personal service."
        />
        <script type="application/ld+json">
          {JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: "/" },
              { name: "About Us", url: "/about" },
            ]),
          )}
        </script>
      </Helmet>

      <p className="mb-3 text-xs text-navy-400">Home / About Us</p>
      <h1 className="mb-5 font-display text-2xl font-medium text-navy-900 dark:text-navy-50">
        About Swadeshi Opticals
      </h1>
      <div className="flex flex-col gap-4 text-sm text-navy-600 dark:text-navy-300">
        <p>
          Swadeshi Opticals is a local optical store committed to providing
          quality eyewear at honest prices, backed by personal service you can
          trust.
        </p>
        <p>
          We stock a wide range of eyeglasses, sunglasses, contact lenses, and
          accessories for men, women, and kids, along with expert guidance on
          lenses and prescriptions.
        </p>
        <p>
          Every order placed online is reviewed by our team, and we're always a
          WhatsApp message away for questions before or after your purchase.
        </p>
      </div>
    </div>
  );
}
