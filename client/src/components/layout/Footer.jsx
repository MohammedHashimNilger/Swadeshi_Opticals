import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  IconPhone,
  IconMapPin,
  IconBrandWhatsapp,
  IconMail,
} from "@tabler/icons-react";
import { fetchSettings } from "../../services/settingsService";

const FOOTER_COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "Eyeglasses", to: "/shop/eyeglasses" },
      { label: "Sunglasses", to: "/shop/sunglasses" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Contact", to: "/contact" },
      { label: "Store Locator", to: "/store-locator" },
    ],
  },
  {
    title: "Policies",
    links: [
      { label: "Shipping Policy", to: "/policies/shipping" },
      { label: "Refund Policy", to: "/policies/refund" },
      { label: "Privacy Policy", to: "/policies/privacy" },
      { label: "Terms", to: "/policies/terms" },
    ],
  },
];

export default function Footer() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetchSettings()
      .then(setSettings)
      .catch(() => {});
  }, []);

  const whatsappLink = settings?.storeWhatsapp
    ? `https://wa.me/${settings.storeWhatsapp}`
    : null;

  return (
    <footer className="border-t border-navy-100 bg-navy-50/40 dark:border-navy-800 dark:bg-navy-900">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 px-4 py-14 text-sm sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <img
            src="/images/logo.png"
            alt="Swadeshi Opticals"
            className="h-12 w-auto"
          />
          <p className="mt-3 text-xs leading-relaxed text-navy-400">
            Premium eyewear, fitted and confirmed personally — not just shipped.
          </p>
        </div>

        {FOOTER_COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-navy-400 dark:text-navy-500">
              {col.title}
            </p>
            <ul className="flex flex-col gap-2 text-navy-600 dark:text-navy-300">
              {col.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="transition hover:text-navy-700 dark:hover:text-navy-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-navy-400 dark:text-navy-500">
            Contact
          </p>
          <ul className="flex flex-col gap-2.5 text-navy-600 dark:text-navy-300">
            <li>
              <a
                href={`tel:${settings?.storePhone}`}
                className="flex items-center gap-2 transition hover:text-navy-700 dark:hover:text-navy-300"
              >
                <IconPhone size={15} className="flex-shrink-0" />{" "}
                <span>{settings?.storePhone || "—"}</span>
              </a>
            </li>
            {whatsappLink && (
              <li>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 transition hover:text-navy-700 dark:hover:text-navy-300"
                >
                  <IconBrandWhatsapp size={15} className="flex-shrink-0" />{" "}
                  <span>WhatsApp us</span>
                </a>
              </li>
            )}
            <li>
              <a
                href={`mailto:${settings?.storeEmail}`}
                className="flex items-center gap-2 transition hover:text-navy-700 dark:hover:text-navy-300"
              >
                <IconMail size={15} className="flex-shrink-0" />{" "}
                <span className="break-all">{settings?.storeEmail || "—"}</span>
              </a>
            </li>
            <li className="flex items-start gap-2">
              <IconMapPin size={15} className="mt-0.5 flex-shrink-0" />
              <span className="text-xs leading-relaxed">
                {settings?.storeAddress || "—"}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-navy-100 px-4 py-4 text-center text-xs text-navy-400 dark:border-navy-800">
        © {new Date().getFullYear()} Swadeshi Opticals. All rights reserved.
      </div>
    </footer>
  );
}
