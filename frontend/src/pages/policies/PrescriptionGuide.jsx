import { Helmet } from "react-helmet-async";
import { SITE_URL, formatPageTitle, breadcrumbJsonLd } from "../../config/seo";

export default function PrescriptionGuide() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Helmet>
        <title>{formatPageTitle("Prescription Guide")}</title>
        <meta
          name="description"
          content="Learn how to submit your prescription when ordering eyeglasses online at Swadeshi Opticals. Upload a file or enter details manually during checkout."
        />
        <link
          rel="canonical"
          href={`${SITE_URL}/policies/prescription-guide`}
        />
        <meta
          property="og:title"
          content="Prescription Guide | Swadeshi Opticals"
        />
        <meta
          property="og:description"
          content="Learn how to submit your prescription when ordering eyeglasses online at Swadeshi Opticals."
        />
        <meta
          property="og:url"
          content={`${SITE_URL}/policies/prescription-guide`}
        />
        <meta
          name="twitter:title"
          content="Prescription Guide | Swadeshi Opticals"
        />
        <meta
          name="twitter:description"
          content="Learn how to submit your prescription when ordering eyeglasses online at Swadeshi Opticals."
        />
        <script type="application/ld+json">
          {JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: "/" },
              {
                name: "Prescription Guide",
                url: "/policies/prescription-guide",
              },
            ]),
          )}
        </script>
      </Helmet>

      <p className="mb-3 text-xs text-navy-400">Home / Prescription Guide</p>
      <h1 className="mb-5 text-xl font-medium text-navy-900 dark:text-navy-50">
        Prescription Guide
      </h1>
      <div className="flex flex-col gap-4 text-sm text-navy-600 dark:text-navy-300">
        <p>
          For prescription lenses, you can either upload a clear photo or PDF of
          your prescription, or enter the details manually as a note during
          checkout.
        </p>
        <p>
          You can also skip this step at checkout and add your prescription
          later — our team will follow up with you before your order ships.
        </p>
        <p>
          Every prescription is reviewed by our team before the order is
          processed, to make sure your lenses are made correctly.
        </p>
      </div>
    </div>
  );
}
