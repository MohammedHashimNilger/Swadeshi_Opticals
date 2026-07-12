import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { IconEyeglassOff } from "@tabler/icons-react";
import { formatPageTitle } from "../config/seo";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <Helmet>
        <title>{formatPageTitle("404 Page Not Found")}</title>
        <meta
          name="description"
          content="The page you are looking for does not exist at Swadeshi Opticals. Browse our eyewear collection or return to the homepage."
        />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <IconEyeglassOff size={40} className="mx-auto mb-4 text-navy-300" />
      <p className="mb-1 text-2xl font-medium text-navy-900 dark:text-navy-50">
        404
      </p>
      <p className="mb-5 text-sm text-navy-400">
        The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="inline-block rounded-lg bg-navy-800 px-5 py-2 text-sm font-medium text-white dark:bg-navy-600"
      >
        Back to home
      </Link>
    </div>
  );
}
