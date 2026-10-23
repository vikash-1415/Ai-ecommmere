import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { api } from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) return;

    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      const res = await api.forgotPassword(email);
      setSent(true);
      setMessage(
        res.message ||
          "If an account exists with this email, a password reset link has been sent."
      );
    } catch (err) {
      setError(err.message || "Failed to send reset link. Please try again.");
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
                Security & Recovery
              </p>
              <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
                Forgot Password?
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Enter your email address and we'll send you a secure link to reset your password.
              </p>
            </div>

            {error && (
              <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-800">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                <p>{error}</p>
              </div>
            )}

            {sent ? (
              <div className="mt-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900">Check your inbox</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  {message}
                </p>
                <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-left text-xs text-slate-500">
                  <p className="font-semibold text-slate-700">Didn't receive the email?</p>
                  <ul className="mt-1.5 list-disc space-y-1 pl-4">
                    <li>Check your spam or junk folder.</li>
                    <li>Make sure you entered the correct email address.</li>
                    <li>Links expire after 1 hour for security.</li>
                  </ul>
                </div>

                <div className="mt-6 space-y-2">
                  <button
                    onClick={() => {
                      setSent(false);
                      setMessage("");
                    }}
                    className="w-full rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    Try another email
                  </button>
                  <Link
                    to="/login"
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-950 py-3 text-xs font-bold text-white transition hover:bg-slate-800"
                  >
                    <ArrowLeft size={14} />
                    Back to Sign In
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <label className="block">
                  <span className="text-xs font-bold text-slate-800">Registered Email Address</span>
                  <div className="relative mt-2">
                    <Mail
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-slate-950 focus:ring-1 focus:ring-slate-950"
                    />
                  </div>
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-slate-950 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Sending Reset Link..." : "Send Reset Link"}
                </button>

                <div className="pt-2 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 transition hover:text-slate-950"
                  >
                    <ArrowLeft size={13} />
                    Back to Sign In
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
