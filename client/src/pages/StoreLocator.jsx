import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { IconMapPin, IconClock, IconPhone } from "@tabler/icons-react";
import { fetchSettings } from "../services/settingsService";
import {
  SITE_URL,
  SITE_NAME,
  formatPageTitle,
  breadcrumbJsonLd,
} from "../config/seo";

export default function StoreLocator() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetchSettings()
      .then(setSettings)
      .catch(() => {});
  }, []);

  const lat = settings?.storeLatLng?.lat;
  const lng = settings?.storeLatLng?.lng;
  const mapSrc =
    lat && lng
      ? `https://www.google.com/maps?q=${lat},${lng}&output=embed`
      : null;
  const directionsUrl =
    lat && lng
      ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
      : "#";

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Helmet>
        <title>{formatPageTitle("Store Locator")}</title>
        <meta
          name="description"
          content={`Visit ${SITE_NAME} at our store in Chittorgarh, Rajasthan. Get directions, find our address, hours, and contact info for premium eyewear.`}
        />
        <link rel="canonical" href={`${SITE_URL}/store-locator`} />
        <meta property="og:title" content="Store Locator | Swadeshi Opticals" />
        <meta
          property="og:description"
          content={`Visit ${SITE_NAME} at our store in Chittorgarh, Rajasthan. Get directions, find our address, hours, and contact info.`}
        />
        <meta property="og:url" content={`${SITE_URL}/store-locator`} />
        <meta
          name="twitter:title"
          content="Store Locator | Swadeshi Opticals"
        />
        <meta
          name="twitter:description"
          content={`Visit ${SITE_NAME} at our store in Chittorgarh, Rajasthan. Get directions, find our address, hours, and contact info.`}
        />
        <script type="application/ld+json">
          {JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: "/" },
              { name: "Store Locator", url: "/store-locator" },
            ]),
          )}
        </script>
      </Helmet>

      <h1 className="mb-6 font-display text-2xl font-medium text-navy-900 dark:text-navy-50">
        Visit our store
      </h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1.4fr_1fr]">
        <div className="aspect-video overflow-hidden rounded-xl bg-navy-50 dark:bg-navy-800">
          {mapSrc ? (
            <iframe
              title="Store location"
              src={mapSrc}
              className="h-full w-full border-0"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-navy-300">
              Map unavailable
            </div>
          )}
        </div>
        <div className="rounded-2xl border border-navy-100 p-5 text-sm dark:border-navy-800">
          <p className="mb-3 font-display font-medium text-navy-800 dark:text-navy-50">
            Swadeshi Opticals
          </p>
          <p className="mb-2 flex items-start gap-2 text-navy-500 dark:text-navy-300">
            <IconMapPin size={16} /> {settings?.storeAddress || "-"}
          </p>
          <p className="mb-2 flex items-center gap-2 text-navy-500 dark:text-navy-300">
            <IconClock size={16} /> {settings?.storeHours || "-"}
          </p>
          <p className="mb-4 flex items-center gap-2 text-navy-500 dark:text-navy-300">
            <IconPhone size={16} /> {settings?.storePhone || "-"}
          </p>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noreferrer"
            className="block rounded-full bg-navy-900 py-2.5 text-center text-xs font-semibold text-white transition hover:bg-navy-800 dark:bg-navy-300 dark:text-navy-900 dark:hover:bg-navy-400"
          >
            Get directions
          </a>
        </div>
      </div>
    </div>
  );
}
