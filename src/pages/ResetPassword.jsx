import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { LockKeyhole, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { api } from "../services/api";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const emailParam = searchParams.get("email") || "";
  const tokenParam = searchParams.get("token") || "";

  const [email, setEmail] = useState(emailParam);
  const [token, setToken] = useState(tokenParam);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !token || !password) {
      setError("Email, token, and new password are required.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await api.resetPassword(email, token, password);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to reset password. Link may be invalid or expired.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-5 pb-16 pt-28">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                New Credentials
              </p>
              <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
                Reset Password
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Choose a strong new password for your WeatherCart account.
              </p>
            </div>

            {error && (
              <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-800">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                <div className="flex-1">
                  <p>{error}</p>
                  <Link
                    to="/forgot-password"
                    className="mt-1.5 inline-block font-bold text-red-700 underline"
                  >
                    Request a new reset link
                  </Link>
                </div>
              </div>
            )}

            {success ? (
              <div className="mt-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-sm">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  Password Reset Complete!
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  Your password has been successfully updated. You can now log in using your new credentials.
                </p>

                <div className="mt-6">
                  <button
                    onClick={() => navigate("/login")}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800"
                  >
                    <span>Proceed to Sign In</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {!emailParam && (
                  <label className="block">
                    <span className="text-xs font-bold text-slate-800">Email Address</span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-950 focus:ring-1 focus:ring-slate-950"
                    />
                  </label>
                )}

                {!tokenParam && (
                  <label className="block">
                    <span className="text-xs font-bold text-slate-800">Reset Token</span>
                    <input
                      type="text"
                      required
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="Paste your 64-character token"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 font-mono text-xs outline-none transition focus:border-slate-950 focus:ring-1 focus:ring-slate-950"
                    />
                  </label>
                )}

                <label className="block">
                  <span className="text-xs font-bold text-slate-800">New Password</span>
                  <div className="relative mt-1.5">
                    <LockKeyhole
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-11 text-sm outline-none transition focus:border-slate-950 focus:ring-1 focus:ring-slate-950"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </label>

                <label className="block">
                  <span className="text-xs font-bold text-slate-800">Confirm New Password</span>
                  <div className="relative mt-1.5">
                    <LockKeyhole
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-slate-950 focus:ring-1 focus:ring-slate-950"
                    />
                  </div>
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-slate-950 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Updating Password..." : "Update Password"}
                </button>

                <div className="pt-2 text-center">
                  <Link
                    to="/login"
                    className="text-xs font-semibold text-slate-600 transition hover:text-slate-950"
                  >
                    Cancel and Return to Sign In
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
