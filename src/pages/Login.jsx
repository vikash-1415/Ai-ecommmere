import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LockKeyhole, Mail } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login, resendVerificationEmail } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [notice, setNotice] = useState(location.state?.message || "");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setNotice("");
      setVerificationMessage("");
      setEmailNotVerified(false);

      const data = await login(email, password);

      const isAdmin = data?.user?.role === "admin" || data?.user?.role === "superadmin";
      const redirect = location.state?.from || (isAdmin ? "/admin" : "/");

      navigate(redirect);
    } catch (error) {
      setError(error.message);
      setEmailNotVerified(error.code === "EMAIL_NOT_VERIFIED");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResendVerification() {
    try {
      setVerificationMessage("");
      const result = await resendVerificationEmail(email);
      setVerificationMessage(result.message);
    } catch (error) {
      setVerificationMessage(error.message);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex min-h-[80vh] items-center justify-center px-5 pb-16 pt-28">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                Welcome Back
              </p>

              <h1 className="mt-2 text-3xl font-bold">
                Sign in
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Access your WeatherCart account.
              </p>
            </div>

            {error && (
              <div className="mt-6 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}
            {notice && (
              <div className="mt-6 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
                {notice}
              </div>
            )}
            {emailNotVerified && (
              <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                <button
                  type="button"
                  onClick={handleResendVerification}
                  className="font-bold underline"
                >
                  Resend verification email
                </button>
                {verificationMessage && (
                  <p className="mt-2">{verificationMessage}</p>
                )}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-7 space-y-4"
            >
              <label className="block">
                <span className="text-xs font-bold">
                  Email
                </span>

                <div className="relative mt-2">
                  <Mail
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-slate-950"
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-xs font-bold">
                  Password
                </span>

                <div className="relative mt-2">
                  <LockKeyhole
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-slate-950"
                  />
                </div>
              </label>

              <div className="flex items-center justify-end -mt-1">
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-blue-600 transition hover:text-blue-700 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                disabled={submitting}
                className="w-full rounded-xl bg-slate-950 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Signing in..."
                  : "Sign In"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-bold text-slate-950 hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
