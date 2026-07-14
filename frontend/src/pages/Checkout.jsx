import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  IconShoppingCart,
  IconMapPin,
  IconPhone,
  IconPrescription,
  IconMessage,
  IconClipboardCheck,
  IconInfoCircle,
  IconCheck,
  IconBrandWhatsapp,
} from "@tabler/icons-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { placeOrder } from "../services/orderService";
import { fetchSettings } from "../services/settingsService";
import { formatCurrency } from "../utils/formatCurrency";
import { SITE_URL, formatPageTitle, breadcrumbJsonLd } from "../config/seo";

const inputClass =
  "rounded-lg border border-navy-200 px-3.5 py-2.5 text-sm text-navy-800 outline-none transition placeholder:text-navy-300 focus:border-navy-700 focus:ring-1 focus:ring-navy-700/50 dark:border-navy-700 dark:bg-navy-800 dark:text-navy-100 dark:placeholder:text-navy-600";

// Prescription step only appears if at least one cart item needs it —
// computed dynamically per the `requiresPrescription` flag from CartContext.
function buildSteps(requiresPrescription) {
  const steps = [
    { key: "address", label: "Address", icon: IconMapPin },
    { key: "phone", label: "Phone", icon: IconPhone },
  ];
  if (requiresPrescription)
    steps.push({
      key: "prescription",
      label: "Prescription",
      icon: IconPrescription,
    });
  steps.push({ key: "notes", label: "Notes", icon: IconMessage });
  steps.push({ key: "review", label: "Review", icon: IconClipboardCheck });
  return steps;
}

export default function Checkout() {
  const { items, subtotal, requiresPrescription, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const steps = buildSteps(requiresPrescription);
  const [stepIndex, setStepIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null); // { order } after successful submit
  const [deliveryCharge, setDeliveryCharge] = useState(0);

  useEffect(() => {
    fetchSettings()
      .then((settings) => setDeliveryCharge(settings.deliveryCharge))
      .catch((err) => console.error("Failed to load settings:", err));
  }, []);

  const [form, setForm] = useState({
    fullAddress: "",
    city: "",
    state: "",
    pincode: "",
    phone: user?.phone || "",
    prescriptionMethod: "", // "" = skip, "file", "manual"
    prescriptionNote: "",
    prescriptionFile: null,
    specialInstructions: "",
  });

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const currentStepKey = steps[stepIndex]?.key;

  function goNext() {
    if (currentStepKey === "address" && !form.fullAddress) {
      setError("Please enter your delivery address.");
      return;
    }
    if (currentStepKey === "phone" && !form.phone) {
      setError("Please enter a phone number.");
      return;
    }
    setError("");
    setStepIndex((i) => i + 1);
  }

  function goBack() {
    setError("");
    setStepIndex((i) => Math.max(0, i - 1));
  }

  async function handlePlaceOrder() {
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
        fullAddress: form.fullAddress,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        phone: form.phone,
        specialInstructions: form.specialInstructions,
        prescriptionMethod: form.prescriptionMethod || undefined,
        prescriptionNote: form.prescriptionNote,
        prescriptionFile: form.prescriptionFile,
      };
      const data = await placeOrder(payload);
      clearCart();
      setResult(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong placing your order.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    if (items.length === 0 && !result) {
      navigate("/cart");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length, result]);

  if (items.length === 0 && !result) {
    return null;
  }

  if (result) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <Helmet>
          <title>{formatPageTitle("Order Placed")}</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-navy-100 dark:bg-navy-800">
          <IconCheck size={30} className="text-navy-700 dark:text-navy-300" />
        </div>
        <h1 className="font-display text-2xl font-medium text-navy-900 dark:text-navy-50">
          Order {result.order.orderId} placed!
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-navy-500 dark:text-navy-300">
          Our team has received your order and will confirm it with you shortly
          by phone or WhatsApp. Your eyewear will be on its way once confirmed.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-navy-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-800 dark:bg-navy-300 dark:text-navy-900 dark:hover:bg-navy-400"
        >
          Continue shopping
        </button>
        {result.whatsappUrl && (
          <a
            href={result.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex items-center justify-center gap-1.5 text-xs text-navy-500 underline transition hover:text-navy-800 dark:text-navy-400 dark:hover:text-navy-200"
          >
            <IconBrandWhatsapp size={14} /> Message us on WhatsApp now instead
            of waiting
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Helmet>
        <title>{formatPageTitle("Checkout")}</title>
        <meta
          name="description"
          content="Complete your eyewear order at Swadeshi Opticals. Enter your delivery address, phone number, and prescription details for Cash on Delivery."
        />
        <link rel="canonical" href={`${SITE_URL}/checkout`} />
        <meta name="robots" content="noindex, follow" />
        <script type="application/ld+json">
          {JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: "/" },
              { name: "Cart", url: "/cart" },
              { name: "Checkout", url: "/checkout" },
            ]),
          )}
        </script>
      </Helmet>

      {/* Step indicator */}
      <div className="relative mb-10 flex justify-between">
        <div className="absolute left-0 right-0 top-4 h-px bg-navy-100 dark:bg-navy-800" />
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isDone = i < stepIndex;
          const isActive = i === stepIndex;
          return (
            <div
              key={step.key}
              className="relative z-10 flex flex-col items-center gap-1.5 bg-white dark:bg-navy-900"
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                  isActive
                    ? "bg-navy-700 text-white dark:bg-navy-500"
                    : isDone
                      ? "bg-navy-800 text-white dark:bg-navy-600"
                      : "border border-dashed border-navy-200 text-navy-300 dark:border-navy-700"
                }`}
              >
                <Icon size={15} />
              </div>
              <p
                className={`text-[10px] ${isActive ? "font-semibold text-navy-900 dark:text-navy-50" : "text-navy-400"}`}
              >
                {step.label}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-navy-100 p-6 dark:border-navy-800">
          {currentStepKey === "address" && (
            <div className="flex flex-col gap-3">
              <p className="font-display text-base font-medium text-navy-900 dark:text-navy-50">
                Delivery address
              </p>
              <textarea
                placeholder="Full address"
                value={form.fullAddress}
                onChange={(e) => update("fullAddress", e.target.value)}
                className={inputClass}
                rows={3}
              />
              <div className="grid grid-cols-3 gap-2">
                <input
                  placeholder="City"
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  className={inputClass}
                />
                <input
                  placeholder="State"
                  value={form.state}
                  onChange={(e) => update("state", e.target.value)}
                  className={inputClass}
                />
                <input
                  placeholder="Pincode"
                  value={form.pincode}
                  onChange={(e) => update("pincode", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {currentStepKey === "phone" && (
            <div className="flex flex-col gap-3">
              <p className="font-display text-base font-medium text-navy-900 dark:text-navy-50">
                Phone number
              </p>
              <input
                placeholder="Phone number"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className={inputClass}
              />
            </div>
          )}

          {currentStepKey === "prescription" && (
            <div className="flex flex-col gap-3">
              <p className="font-display text-base font-medium text-navy-900 dark:text-navy-50">
                Prescription
              </p>
              <p className="-mt-1 text-xs text-navy-400">
                Optional — you can skip this and add it later.
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  { value: "", label: "Skip for now" },
                  { value: "file", label: "Upload file" },
                  { value: "manual", label: "Enter manually" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => update("prescriptionMethod", opt.value)}
                    className={`rounded-full border px-4 py-2 font-medium transition ${
                      form.prescriptionMethod === opt.value
                        ? "border-navy-700 bg-navy-50 text-navy-900 dark:bg-navy-700/20 dark:text-navy-50"
                        : "border-navy-200 text-navy-500 hover:border-navy-300 dark:border-navy-700 dark:text-navy-300"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {form.prescriptionMethod === "file" && (
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) =>
                    update("prescriptionFile", e.target.files[0])
                  }
                  className="mt-1 text-xs text-navy-500 dark:text-navy-300"
                />
              )}
              {form.prescriptionMethod === "manual" && (
                <textarea
                  placeholder="Enter your prescription details (e.g. SPH, CYL, AXIS for each eye)"
                  value={form.prescriptionNote}
                  onChange={(e) => update("prescriptionNote", e.target.value)}
                  className={inputClass}
                  rows={3}
                />
              )}
            </div>
          )}

          {currentStepKey === "notes" && (
            <div className="flex flex-col gap-3">
              <p className="font-display text-base font-medium text-navy-900 dark:text-navy-50">
                Special instructions
              </p>
              <textarea
                placeholder="Anything else the shop should know? (optional)"
                value={form.specialInstructions}
                onChange={(e) => update("specialInstructions", e.target.value)}
                className={inputClass}
                rows={3}
              />
            </div>
          )}

          {currentStepKey === "review" && (
            <div className="flex flex-col gap-4">
              <p className="font-display text-base font-medium text-navy-900 dark:text-navy-50">
                Review & place order
              </p>

              <div className="rounded-xl border border-navy-100 p-4 text-xs leading-relaxed text-navy-500 dark:border-navy-800 dark:text-navy-300">
                <p className="mb-1.5">
                  <span className="text-navy-400">Address —</span>{" "}
                  {form.fullAddress}, {form.city} {form.state} {form.pincode}
                </p>
                <p className="mb-1.5">
                  <span className="text-navy-400">Phone —</span> {form.phone}
                </p>
                <p>
                  <span className="text-navy-400">Prescription —</span>{" "}
                  {form.prescriptionMethod
                    ? form.prescriptionMethod === "file"
                      ? "File uploaded"
                      : "Entered manually"
                    : "Not provided yet"}
                </p>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl border border-dashed border-navy-300 bg-navy-50/60 p-4 text-xs leading-relaxed text-navy-600 dark:border-navy-700 dark:bg-navy-800/50 dark:text-navy-200">
                <IconInfoCircle
                  size={16}
                  className="mt-0.5 flex-shrink-0 text-navy-600"
                />
                <p>
                  This site doesn't process online payments. After you place
                  your order, our team will call or message you on WhatsApp to
                  confirm details and arrange payment — Cash on Delivery, or
                  scan the shop's QR code before delivery.
                </p>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={submitting}
                className="flex items-center justify-center gap-2 rounded-full bg-navy-900 py-3 text-sm font-semibold text-white transition hover:bg-navy-800 disabled:opacity-60 dark:bg-navy-300 dark:text-navy-900 dark:hover:bg-navy-400"
              >
                <IconClipboardCheck size={18} />
                {submitting ? "Placing order..." : "Place order"}
              </button>
            </div>
          )}

          {error && <p className="mt-3 text-xs text-red-600">{error}</p>}

          {currentStepKey !== "review" && (
            <div className="mt-6 flex justify-between">
              <button
                onClick={goBack}
                disabled={stepIndex === 0}
                className="text-xs font-medium text-navy-500 disabled:opacity-0 dark:text-navy-400"
              >
                Back
              </button>
              <button
                onClick={goNext}
                className="rounded-full bg-navy-900 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-navy-800 dark:bg-navy-300 dark:text-navy-900 dark:hover:bg-navy-400"
              >
                Continue
              </button>
            </div>
          )}
          {currentStepKey === "review" && stepIndex > 0 && (
            <button
              onClick={goBack}
              className="mt-3 text-xs font-medium text-navy-500 dark:text-navy-400"
            >
              Back
            </button>
          )}
        </div>

        <div className="h-fit rounded-2xl border border-navy-100 p-5 dark:border-navy-800">
          <p className="mb-3 flex items-center gap-2 font-display text-base font-medium text-navy-900 dark:text-navy-50">
            <IconShoppingCart size={17} className="text-navy-600" /> Order
            summary
          </p>
          <div className="flex flex-col gap-1.5">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex justify-between text-xs text-navy-500 dark:text-navy-400"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span className="text-navy-700 dark:text-navy-200">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between border-t border-navy-100 pt-3 text-xs text-navy-500 dark:border-navy-800 dark:text-navy-400">
            <span>Subtotal</span>
            <span className="text-navy-700 dark:text-navy-200">
              {formatCurrency(subtotal)}
            </span>
          </div>
          <div className="mt-2 flex justify-between text-xs text-navy-500 dark:text-navy-400">
            <span>Delivery</span>
            <span className="text-navy-700 dark:text-navy-200">
              {formatCurrency(deliveryCharge)}
            </span>
          </div>
          <div className="mt-3 flex justify-between border-t border-navy-100 pt-3 text-sm font-medium text-navy-900 dark:border-navy-800 dark:text-navy-50">
            <span>Total</span>
            <span>{formatCurrency(subtotal + deliveryCharge)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
