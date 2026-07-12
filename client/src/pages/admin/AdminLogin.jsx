import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconLock, IconShieldLock } from "@tabler/icons-react";
import { useAdminAuth } from "../../context/AdminAuthContext";

export default function AdminLogin() {
  const { loginStep1, setupTotp, verifyTotp } = useAdminAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState("credentials"); // credentials | setup2fa | verify2fa
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleCredentialsSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const totpSetupRequired = await loginStep1(username, password);
      if (totpSetupRequired) {
        const qr = await setupTotp();
        setQrCodeDataUrl(qr);
        setStep("setup2fa");
      } else {
        setStep("verify2fa");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCodeSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await verifyTotp(code);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid code.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-50/30 px-4 dark:bg-navy-900">
      <div className="w-full max-w-xs rounded-xl border border-navy-100 p-6 dark:border-navy-700">
        {step === "credentials" && (
          <form onSubmit={handleCredentialsSubmit} className="flex flex-col gap-3">
            <div className="mb-2 flex flex-col items-center gap-1">
              <IconLock size={22} className="text-navy-500" />
              <p className="text-sm font-medium text-navy-800 dark:text-navy-50">Admin login</p>
            </div>
            <input
              required
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded border border-navy-200 px-3 py-2 text-sm dark:border-navy-700 dark:bg-navy-800"
            />
            <input
              required
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded border border-navy-200 px-3 py-2 text-sm dark:border-navy-700 dark:bg-navy-800"
            />
            {error && <p className="text-xs text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-navy-800 py-2.5 text-sm font-medium text-white disabled:opacity-60 dark:bg-navy-600"
            >
              {submitting ? "Checking..." : "Continue"}
            </button>
          </form>
        )}

        {step === "setup2fa" && (
          <div className="flex flex-col items-center gap-3">
            <IconShieldLock size={22} className="text-navy-500" />
            <p className="text-center text-sm font-medium text-navy-800 dark:text-navy-50">
              Scan this QR code with Google Authenticator
            </p>
            {qrCodeDataUrl && <img src={qrCodeDataUrl} alt="2FA QR code" className="h-40 w-40" />}
            <form onSubmit={handleCodeSubmit} className="flex w-full flex-col gap-3">
              <input
                required
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="rounded border border-navy-200 px-3 py-2 text-center text-sm tracking-widest dark:border-navy-700 dark:bg-navy-800"
              />
              {error && <p className="text-xs text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-navy-800 py-2.5 text-sm font-medium text-white disabled:opacity-60 dark:bg-navy-600"
              >
                {submitting ? "Verifying..." : "Verify and log in"}
              </button>
            </form>
          </div>
        )}

        {step === "verify2fa" && (
          <form onSubmit={handleCodeSubmit} className="flex flex-col items-center gap-3">
            <IconShieldLock size={22} className="text-navy-500" />
            <p className="text-sm font-medium text-navy-800 dark:text-navy-50">Enter your 2FA code</p>
            <input
              required
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full rounded border border-navy-200 px-3 py-2 text-center text-sm tracking-widest dark:border-navy-700 dark:bg-navy-800"
            />
            {error && <p className="text-xs text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-navy-800 py-2.5 text-sm font-medium text-white disabled:opacity-60 dark:bg-navy-600"
            >
              {submitting ? "Verifying..." : "Verify and log in"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
