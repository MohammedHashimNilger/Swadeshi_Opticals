import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { IconEyeglass } from "@tabler/icons-react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import ApertureRing from "../components/common/ApertureRing";
import { SITE_URL, formatPageTitle } from "../config/seo";

const inputClass =
  "rounded-lg border border-navy-200 px-3.5 py-2.5 text-sm text-navy-800 outline-none transition placeholder:text-navy-300 focus:border-navy-700 focus:ring-1 focus:ring-navy-700/50 dark:border-navy-700 dark:bg-navy-800 dark:text-navy-100 dark:placeholder:text-navy-600";

export default function Login() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login, register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.redirectTo || "/";

  async function handleGoogleSuccess(credentialResponse) {
    setError("");
    try {
      await loginWithGoogle(credentialResponse.credential);
      navigate(redirectTo);
    } catch (err) {
      setError(err.response?.data?.message || "Google login failed.");
    }
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password, form.phone);
      }
      navigate(redirectTo);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-4xl justify-center px-4 py-14">
      <Helmet>
        <title>
          {formatPageTitle(mode === "login" ? "Login" : "Register")}
        </title>
        <meta
          name="description"
          content={
            mode === "login"
              ? "Log in to your Swadeshi Opticals account to manage orders, track deliveries, and shop for eyewear online."
              : "Create an account at Swadeshi Opticals to shop for eyeglasses, sunglasses, and contact lenses online in Chittorgarh, Rajasthan."
          }
        />
        <link rel="canonical" href={`${SITE_URL}/login`} />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="grid w-full grid-cols-1 overflow-hidden rounded-2xl border border-navy-100 dark:border-navy-800 md:grid-cols-2">
        <div className="relative hidden flex-col items-center justify-center gap-3 overflow-hidden bg-navy-900 p-8 text-white md:flex">
          <ApertureRing className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 text-navy-600" />
          <IconEyeglass size={34} className="relative text-navy-600" />
          <p className="relative font-display text-lg">Swadeshi Opticals</p>
          <p className="relative max-w-[200px] text-center text-xs text-navy-300">
            Premium eyewear, fitted and confirmed personally.
          </p>
        </div>

        <div className="p-7 sm:p-9">
          <div className="mb-6 flex gap-6 border-b border-navy-100 text-sm dark:border-navy-800">
            <button
              onClick={() => setMode("login")}
              className={`border-b-2 pb-2.5 transition ${
                mode === "login"
                  ? "border-navy-700 font-semibold text-navy-900 dark:text-navy-50"
                  : "border-transparent text-navy-400"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode("register")}
              className={`border-b-2 pb-2.5 transition ${
                mode === "register"
                  ? "border-navy-700 font-semibold text-navy-900 dark:text-navy-50"
                  : "border-transparent text-navy-400"
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {mode === "register" && (
              <input
                required
                placeholder="Full name"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                className={inputClass}
              />
            )}
            <input
              required
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className={inputClass}
            />
            {mode === "register" && (
              <input
                placeholder="Phone number"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className={inputClass}
              />
            )}
            <input
              required
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
              className={inputClass}
            />

            {mode === "login" && (
              <Link
                to="/forgot-password"
                className="-mt-1 text-right text-xs text-navy-500 transition hover:text-navy-700 dark:text-navy-400 dark:hover:text-navy-300"
              >
                Forgot password?
              </Link>
            )}

            {error && <p className="text-xs text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="mt-1 rounded-full bg-navy-900 py-3 text-sm font-semibold text-white transition hover:bg-navy-800 disabled:opacity-60 dark:bg-navy-300 dark:text-navy-900 dark:hover:bg-navy-400"
            >
              {submitting
                ? "Please wait..."
                : mode === "login"
                  ? "Log in"
                  : "Create account"}
            </button>
          </form>

          <div className="my-4 flex items-center gap-3 text-[10px] uppercase tracking-wider text-navy-300 dark:text-navy-600">
            <div className="h-px flex-1 bg-navy-100 dark:bg-navy-800" />
            or
            <div className="h-px flex-1 bg-navy-100 dark:bg-navy-800" />
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google login failed.")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
