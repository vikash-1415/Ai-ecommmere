import { useEffect, useState } from "react";
import { Link, useSearchParams, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  ArrowLeft,
  ShieldCheck,
  Inbox,
  Send,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

import Navbar from "../components/Navbar";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

/* ─── tiny animated envelope ─── */
function EnvelopeIcon({ pulse = false }) {
  return (
    <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
      {/* outer glow rings */}
      {pulse && (
        <>
          <span className="absolute inset-0 animate-ping rounded-full bg-blue-400/20" />
          <span className="absolute inset-2 animate-ping rounded-full bg-blue-400/15 delay-150" />
        </>
      )}
      <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-2xl shadow-blue-500/40">
        <Mail size={36} className="text-white" strokeWidth={1.6} />
        {/* small sparkle dot */}
        <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 shadow-lg">
          <Sparkles size={12} className="text-white" />
        </span>
      </div>
    </div>
  );
}

/* ─── step dots ─── */
function Steps({ current }) {
  const steps = [
    { id: 1, label: "Register" },
    { id: 2, label: "Verify Email" },
    { id: 3, label: "Sign In" },
  ];
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((step, i) => (
        <div key={step.id} className="flex items-center gap-2">
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
              step.id < current
                ? "bg-emerald-500 text-white"
                : step.id === current
                ? "bg-slate-950 text-white ring-4 ring-slate-950/10"
                : "bg-slate-200 text-slate-500"
            }`}
          >
            {step.id < current ? <CheckCircle2 size={14} /> : step.id}
          </div>
          <span
            className={`text-xs font-semibold hidden sm:inline ${
              step.id === current ? "text-slate-950" : "text-slate-400"
            }`}
          >
            {step.label}
          </span>
          {i < steps.length - 1 && (
            <div
              className={`h-px w-8 sm:w-12 transition-all ${
                step.id < current ? "bg-emerald-400" : "bg-slate-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── MAIN COMPONENT ─── */
export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { resendVerificationEmail } = useAuth();

  /* from URL (email link) */
  const emailParam = searchParams.get("email");
  const token = searchParams.get("token");

  /* from router state (post-register redirect) */
  const stateEmail = location.state?.email || "";
  const stateMessage = location.state?.message || "";
  const emailSendFailed = location.state?.emailSendFailed || false;

  /* local state */
  const [verifyStatus, setVerifyStatus] = useState("idle"); // idle | verifying | success | error
  const [verifyMessage, setVerifyMessage] = useState("");
  const [resendEmail, setResendEmail] = useState(stateEmail || emailParam || "");
  const [resendStatus, setResendStatus] = useState("idle"); // idle | sending | sent | error
  const [countdown, setCountdown] = useState(0); // cooldown timer

  /* ── Auto-verify via URL token ── */
  useEffect(() => {
    if (!emailParam || !token) return;
    setVerifyStatus("verifying");
    let cancelled = false;

    api
      .verifyEmail(emailParam, token)
      .then((res) => {
        if (!cancelled) {
          setVerifyStatus("success");
          setVerifyMessage(res.message || "Email verified successfully!");
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setVerifyStatus("error");
          setVerifyMessage(err.message || "Verification link is invalid or expired.");
        }
      });

    return () => { cancelled = true; };
  }, [emailParam, token]);

  /* ── Countdown timer for resend cooldown ── */
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  /* ── Resend handler ── */
  async function handleResend() {
    const email = resendEmail.trim();
    if (!email || countdown > 0) return;
    try {
      setResendStatus("sending");
      await resendVerificationEmail(email);
      setResendStatus("sent");
      setCountdown(60); // 60s cooldown
    } catch {
      setResendStatus("error");
    }
  }

  /* ───────────────────────────────────
     SCREEN A — Verifying via email link
  ─────────────────────────────────── */
  if (emailParam && token) {
    return (
      <PageShell>
        <AnimatePresence mode="wait">
          {verifyStatus === "verifying" && (
            <motion.div
              key="verifying"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <Loader2 size={52} className="mx-auto animate-spin text-blue-500" />
              <h1 className="mt-5 text-2xl font-extrabold text-slate-950">
                Verifying your email…
              </h1>
              <p className="mt-2 text-sm text-slate-500">Just a moment, please wait.</p>
            </motion.div>
          )}

          {verifyStatus === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/20" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 shadow-2xl shadow-emerald-500/40">
                  <CheckCircle2 size={38} className="text-white" />
                </div>
              </div>
              <h1 className="mt-6 text-2xl font-extrabold text-slate-950">
                Email Verified! 🎉
              </h1>
              <p className="mt-2 text-sm text-slate-500">{verifyMessage}</p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/login", { state: { message: "Email verified. You can now sign in." } })}
                className="mt-8 inline-flex items-center gap-2.5 rounded-2xl bg-slate-950 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-900/25 transition hover:bg-slate-800"
              >
                <ShieldCheck size={17} />
                Continue to Sign In
              </motion.button>
            </motion.div>
          )}

          {verifyStatus === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-400 to-rose-600 shadow-2xl shadow-red-500/40">
                  <XCircle size={38} className="text-white" />
                </div>
              </div>
              <h1 className="mt-6 text-2xl font-extrabold text-slate-950">
                Link Expired
              </h1>
              <p className="mt-2 text-sm text-slate-500">{verifyMessage}</p>

              {/* Resend inline */}
              <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                  Request a new link
                </p>
                <ResendForm
                  email={resendEmail}
                  setEmail={setResendEmail}
                  onResend={handleResend}
                  status={resendStatus}
                  countdown={countdown}
                />
              </div>

              <Link to="/login" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-950">
                <ArrowLeft size={14} /> Back to Sign In
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </PageShell>
    );
  }

  /* ───────────────────────────────────
     SCREEN B — Post-register check inbox
  ─────────────────────────────────── */
  return (
    <PageShell>
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* progress steps */}
        <Steps current={2} />

        {/* card */}
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-900/8">

          {/* top gradient strip */}
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />

          <div className="px-7 pb-8 pt-7">
            {/* icon */}
            <EnvelopeIcon pulse={!emailSendFailed} />

            {/* heading */}
            <div className="mt-6 text-center">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
                {emailSendFailed ? "Almost There!" : "Check Your Inbox"}
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {emailSendFailed
                  ? "Your account is ready. Request a verification email below to activate it."
                  : stateMessage ||
                    "We've sent a verification link to your email. Click it to activate your account."}
              </p>
              {stateEmail && !emailSendFailed && (
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                  <Mail size={12} />
                  {stateEmail}
                </div>
              )}
            </div>

            {/* warning banner if email failed */}
            {emailSendFailed && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5"
              >
                <AlertTriangle size={17} className="mt-0.5 shrink-0 text-amber-500" />
                <p className="text-xs leading-5 text-amber-800">
                  The verification email couldn't be sent automatically (SMTP issue). Use the form below to request one now.
                </p>
              </motion.div>
            )}

            {/* divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-100" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                {emailSendFailed ? "Send Verification Email" : "Resend Email"}
              </span>
              <div className="h-px flex-1 bg-slate-100" />
            </div>

            {/* Resend form */}
            <ResendForm
              email={resendEmail}
              setEmail={setResendEmail}
              onResend={handleResend}
              status={resendStatus}
              countdown={countdown}
            />

            {/* tips */}
            {!emailSendFailed && resendStatus !== "sent" && (
              <div className="mt-5 space-y-2">
                {[
                  { icon: Inbox, text: "Check your spam / junk folder" },
                  { icon: RefreshCw, text: "Allow up to 2 minutes for delivery" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5 text-xs text-slate-500">
                    <Icon size={13} className="shrink-0 text-slate-400" />
                    {text}
                  </div>
                ))}
              </div>
            )}

            {/* footer link */}
            <div className="mt-7 border-t border-slate-100 pt-5 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-slate-950"
              >
                <ArrowLeft size={14} />
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* bottom helper */}
        <p className="mt-5 text-center text-xs text-slate-400">
          Wrong email?{" "}
          <Link to="/register" className="font-bold text-slate-600 hover:underline">
            Create a new account
          </Link>
        </p>
      </motion.div>
    </PageShell>
  );
}

/* ─── Resend form sub-component ─── */
function ResendForm({ email, setEmail, onResend, status, countdown }) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <Mail
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-slate-950 focus:bg-white"
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="button"
        onClick={onResend}
        disabled={status === "sending" || !email.trim() || countdown > 0}
        className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60"
      >
        {status === "sending" ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Sending…
          </>
        ) : countdown > 0 ? (
          <>
            <RefreshCw size={16} />
            Resend in {countdown}s
          </>
        ) : (
          <>
            <Send size={16} />
            {status === "sent" ? "Resend Email" : "Send Verification Email"}
          </>
        )}
      </motion.button>

      <AnimatePresence>
        {status === "sent" && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3"
          >
            <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
            <p className="text-xs font-semibold text-emerald-800">
              Email sent! Check your inbox and spam folder.
            </p>
          </motion.div>
        )}
        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
          >
            <XCircle size={16} className="shrink-0 text-red-500" />
            <p className="text-xs font-semibold text-red-700">
              Failed to send. Please check the email and try again.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── page layout wrapper ─── */
function PageShell({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <Navbar />
      <main className="flex min-h-[85vh] items-center justify-center px-5 py-28">
        {children}
      </main>
    </div>
  );
}
