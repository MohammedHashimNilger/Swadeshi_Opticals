import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import api from "../services/api";
import { SITE_URL, formatPageTitle } from "../config/seo";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-4 px-4 py-16">
      <Helmet>
        <title>{formatPageTitle("Forgot Password")}</title>
        <meta
          name="description"
          content="Reset your password for Swadeshi Opticals account. Enter your email to receive a password reset link."
        />
        <link rel="canonical" href={`${SITE_URL}/forgot-password`} />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <p className="text-lg font-medium text-navy-900 dark:text-navy-50">
        Forgot password
      </p>
      {sent ? (
        <p className="text-sm text-navy-500 dark:text-navy-300">
          If that email is registered, a reset link has been sent.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            required
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded border border-navy-200 px-3 py-2 text-sm dark:border-navy-700 dark:bg-navy-800"
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-navy-800 py-2.5 text-sm font-medium text-white disabled:opacity-60 dark:bg-navy-600"
          >
            {submitting ? "Sending..." : "Send reset link"}
          </button>
        </form>
      )}
      <Link
        to="/login"
        className="text-xs text-navy-500 underline dark:text-navy-300"
      >
        Back to login
      </Link>
    </div>
  );
}
