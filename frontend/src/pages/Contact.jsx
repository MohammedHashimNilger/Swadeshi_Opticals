import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  IconPhone,
  IconBrandWhatsapp,
  IconMail,
  IconMapPin,
  IconClock,
} from "@tabler/icons-react";
import { fetchSettings } from "../services/settingsService";
import { sendContactMessage } from "../services/contactService";
import {
  SITE_URL,
  SITE_NAME,
  formatPageTitle,
  breadcrumbJsonLd,
} from "../config/seo";

export default function Contact() {
  const [settings, setSettings] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  useEffect(() => {
    fetchSettings()
      .then(setSettings)
      .catch(() => {});
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      await sendContactMessage(form);
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("error");
    }
  }

  const whatsappLink = settings?.storeWhatsapp
    ? `https://wa.me/${settings.storeWhatsapp}`
    : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Helmet>
        <title>{formatPageTitle("Contact Us")}</title>
        <meta
          name="description"
          content={`Get in touch with ${SITE_NAME} in Chittorgarh, Rajasthan. Call us, send a message, or visit our store for premium eyewear, eyeglasses, and sunglasses.`}
        />
        <link rel="canonical" href={`${SITE_URL}/contact`} />
        <meta property="og:title" content="Contact Us | Swadeshi Opticals" />
        <meta
          property="og:description"
          content={`Get in touch with ${SITE_NAME} in Chittorgarh, Rajasthan. Call us, send a message, or visit our store for premium eyewear.`}
        />
        <meta property="og:url" content={`${SITE_URL}/contact`} />
        <meta name="twitter:title" content="Contact Us | Swadeshi Opticals" />
        <meta
          name="twitter:description"
          content={`Get in touch with ${SITE_NAME} in Chittorgarh, Rajasthan. Call us, send a message, or visit our store for premium eyewear.`}
        />
        <script type="application/ld+json">
          {JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: "/" },
              { name: "Contact Us", url: "/contact" },
            ]),
          )}
        </script>
      </Helmet>

      <h1 className="mb-6 font-display text-2xl font-medium text-navy-900 dark:text-navy-50">
        Contact us
      </h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-3 text-sm text-navy-600 dark:text-navy-300">
          <a
            href={`tel:${settings?.storePhone}`}
            className="flex items-center gap-2 hover:text-navy-900 dark:hover:text-white"
          >
            <IconPhone size={16} /> {settings?.storePhone || "-"}
          </a>
          {whatsappLink ? (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:text-navy-900 dark:hover:text-white"
            >
              <IconBrandWhatsapp size={16} /> Message us on WhatsApp
            </a>
          ) : (
            <p className="flex items-center gap-2">
              <IconBrandWhatsapp size={16} /> -
            </p>
          )}
          <a
            href={`mailto:${settings?.storeEmail}`}
            className="flex items-center gap-2 hover:text-navy-900 dark:hover:text-white"
          >
            <IconMail size={16} /> {settings?.storeEmail || "-"}
          </a>
          <p className="flex items-start gap-2">
            <IconMapPin size={16} className="mt-0.5 flex-shrink-0" />{" "}
            {settings?.storeAddress || "-"}
          </p>
          <p className="flex items-center gap-2">
            <IconClock size={16} /> {settings?.storeHours || "-"}
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-navy-100 p-5 dark:border-navy-800"
        >
          <p className="mb-3 text-sm font-medium text-navy-800 dark:text-navy-50">
            Send a message
          </p>
          <input
            required
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            className="mb-2.5 w-full rounded-lg border border-navy-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-navy-700 focus:ring-1 focus:ring-navy-700/50 dark:border-navy-700 dark:bg-navy-800"
          />
          <input
            required
            type="email"
            placeholder="Your email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            className="mb-2.5 w-full rounded-lg border border-navy-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-navy-700 focus:ring-1 focus:ring-navy-700/50 dark:border-navy-700 dark:bg-navy-800"
          />
          <textarea
            required
            placeholder="Message"
            rows={4}
            value={form.message}
            onChange={(e) =>
              setForm((p) => ({ ...p, message: e.target.value }))
            }
            className="mb-3.5 w-full rounded-lg border border-navy-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-navy-700 focus:ring-1 focus:ring-navy-700/50 dark:border-navy-700 dark:bg-navy-800"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full rounded-full bg-navy-900 py-3 text-sm font-semibold text-white transition hover:bg-navy-800 disabled:opacity-60 dark:bg-navy-300 dark:text-navy-900 dark:hover:bg-navy-400"
          >
            {status === "sending"
              ? "Sending..."
              : status === "sent"
                ? "Message sent"
                : "Send message"}
          </button>
          {status === "error" && (
            <p className="mt-2 text-xs text-red-600">
              Something went wrong. Please try again or reach us on WhatsApp.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
