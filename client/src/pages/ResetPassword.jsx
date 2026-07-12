import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import api from "../services/api";
import { SITE_URL, formatPageTitle } from "../config/seo";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      setDone(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Reset link is invalid or has expired.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-4 px-4 py-16">
      <Helmet>
        <title>{formatPageTitle("Reset Password")}</title>
        <meta
          name="description"
          content="Reset your Swadeshi Opticals account password. Enter your new password to regain access to your account."
        />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <p className="text-lg font-medium text-navy-900 dark:text-navy-50">
        Reset password
      </p>
      {done ? (
        <p className="text-sm text-navy-500 dark:text-navy-300">
          Password updated. Redirecting to login...
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            required
            type="password"
            placeholder="New password"
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
            {submitting ? "Updating..." : "Update password"}
          </button>
        </form>
      )}
    </div>
  );
}
