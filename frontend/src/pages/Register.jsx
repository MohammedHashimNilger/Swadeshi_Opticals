import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { SITE_URL, formatPageTitle } from "../config/seo";

export default function Register() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 text-center">
      <Helmet>
        <title>{formatPageTitle("Register")}</title>
        <meta
          name="description"
          content="Create an account at Swadeshi Opticals to shop for eyeglasses, sunglasses, and contact lenses online in Chittorgarh, Rajasthan."
        />
        <link rel="canonical" href={`${SITE_URL}/register`} />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <h1 className="text-xl font-medium text-navy-800 dark:text-navy-50">
        Register
      </h1>
      <p className="mt-2 text-sm text-navy-400">
        This page will be built in a later module.
      </p>
    </div>
  );
}
