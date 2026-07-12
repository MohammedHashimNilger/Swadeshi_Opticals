import { useEffect, useState } from "react";
import { fetchSettings } from "../../services/settingsService";
import { updateSettings } from "../../services/adminSettingsService";
import adminApi from "../../services/adminApi";

const FIELDS = [
  { key: "storeName", label: "Store name" },
  { key: "storePhone", label: "Store phone" },
  {
    key: "storeWhatsapp",
    label: "WhatsApp number (digits only, e.g. 91XXXXXXXXXX)",
  },
  { key: "storeEmail", label: "Store email" },
  { key: "storeAddress", label: "Store address" },
  { key: "storeHours", label: "Store hours" },
  { key: "deliveryCharge", label: "Flat delivery charge (₹)", type: "number" },
  { key: "deliveryAreaNote", label: "Delivery area note" },
  { key: "adminNotificationEmail", label: "Admin notification email" },
];

export default function Settings() {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwSubmitting, setPwSubmitting] = useState(false);
  const [pwMessage, setPwMessage] = useState("");

  const [resetting2fa, setResetting2fa] = useState(false);
  const [reset2faMessage, setReset2faMessage] = useState("");

  useEffect(() => {
    fetchSettings()
      .then(setForm)
      .catch((err) => console.error(err));
  }, []);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }
  function updateLatLng(axis, value) {
    setForm((prev) => ({
      ...prev,
      storeLatLng: {
        ...prev.storeLatLng,
        [axis]: value === "" ? null : Number(value),
      },
    }));
    setSaved(false);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateSettings(form);
      setForm(updated);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setPwMessage("");
    setPwSubmitting(true);
    try {
      const { data } = await adminApi.post("/admin/change-password", {
        currentPassword,
        newPassword,
      });
      setPwMessage(data.message);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setPwMessage(err.response?.data?.message || "Failed to update password.");
    } finally {
      setPwSubmitting(false);
    }
  }

  if (!form)
    return <p className="text-sm text-navy-400">Loading settings...</p>;

  return (
    <div className="flex flex-col gap-10">
      <div>
        <p className="mb-5 text-lg font-medium text-navy-900 dark:text-navy-50">
          Store settings
        </p>

        <form onSubmit={handleSave} className="flex max-w-md flex-col gap-3">
          {FIELDS.map((f) => (
            <div key={f.key}>
              <label className="mb-1 block text-xs text-navy-500 dark:text-navy-300">
                {f.label}
              </label>
              <input
                type={f.type || "text"}
                value={form[f.key] ?? ""}
                onChange={(e) => updateField(f.key, e.target.value)}
                className="w-full rounded border border-navy-200 px-3 py-2 text-sm dark:border-navy-700 dark:bg-navy-800"
              />
            </div>
          ))}

          <div>
            <label className="mb-1 block text-xs text-navy-500 dark:text-navy-300">
              Store location (latitude, longitude — used for the Store Locator
              map)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="any"
                placeholder="Latitude"
                value={form.storeLatLng?.lat ?? ""}
                onChange={(e) => updateLatLng("lat", e.target.value)}
                className="w-full rounded border border-navy-200 px-3 py-2 text-sm dark:border-navy-700 dark:bg-navy-800"
              />
              <input
                type="number"
                step="any"
                placeholder="Longitude"
                value={form.storeLatLng?.lng ?? ""}
                onChange={(e) => updateLatLng("lng", e.target.value)}
                className="w-full rounded border border-navy-200 px-3 py-2 text-sm dark:border-navy-700 dark:bg-navy-800"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-2 rounded-lg bg-navy-800 py-2.5 text-sm font-medium text-white disabled:opacity-60 dark:bg-navy-600"
          >
            {saving ? "Saving..." : "Save settings"}
          </button>
          {saved && <p className="text-xs text-green-600">Saved.</p>}
        </form>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-navy-800 dark:text-navy-50">
          Two-factor authentication
        </p>
        <p className="mb-3 text-xs text-navy-400">
          If you lose access to your authenticator app, reset 2FA here. The QR
          code will appear on your next login.
        </p>
        <button
          onClick={async () => {
            if (
              !window.confirm(
                "Reset 2FA? You'll need to scan a new QR code on your next login.",
              )
            )
              return;
            setResetting2fa(true);
            setReset2faMessage("");
            try {
              const { data } = await adminApi.post("/admin/reset-2fa");
              setReset2faMessage(data.message);
            } catch (err) {
              setReset2faMessage(
                err.response?.data?.message || "Failed to reset 2FA.",
              );
            } finally {
              setResetting2fa(false);
            }
          }}
          disabled={resetting2fa}
          className="rounded-lg bg-red-600 px-4 py-2 text-xs font-medium text-white disabled:opacity-60"
        >
          {resetting2fa ? "Resetting..." : "Reset 2FA"}
        </button>
        {reset2faMessage && (
          <p className="mt-2 text-xs text-navy-500 dark:text-navy-300">
            {reset2faMessage}
          </p>
        )}
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-navy-800 dark:text-navy-50">
          Change admin password
        </p>
        <form
          onSubmit={handleChangePassword}
          className="flex max-w-md flex-col gap-3"
        >
          <input
            required
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full rounded border border-navy-200 px-3 py-2 text-sm dark:border-navy-700 dark:bg-navy-800"
          />
          <input
            required
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded border border-navy-200 px-3 py-2 text-sm dark:border-navy-700 dark:bg-navy-800"
          />
          <button
            type="submit"
            disabled={pwSubmitting}
            className="rounded-lg bg-navy-800 py-2.5 text-sm font-medium text-white disabled:opacity-60 dark:bg-navy-600"
          >
            {pwSubmitting ? "Updating..." : "Update password"}
          </button>
          {pwMessage && (
            <p className="text-xs text-navy-500 dark:text-navy-300">
              {pwMessage}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
