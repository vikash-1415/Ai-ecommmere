import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  QrCode,
  Building2,
  Lock,
  ShieldCheck,
  CheckCircle2,
  X,
  AlertCircle,
  Smartphone,
  Sparkles,
} from "lucide-react";

export default function PaymentGatewayModal({
  isOpen,
  onClose,
  amount,
  onPaymentSuccess,
}) {
  const [tab, setTab] = useState("upi"); // 'upi' | 'card' | 'netbanking'
  const [processing, setProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(1);
  const [upiId, setUpiId] = useState("");
  const [upiError, setUpiError] = useState("");

  // Card details state
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardError, setCardError] = useState("");

  // Bank selection state
  const [selectedBank, setSelectedBank] = useState("HDFC");

  // UPI countdown timer (5:00)
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    if (!isOpen) {
      setProcessing(false);
      setProcessStep(1);
      setTimeLeft(300);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})/g, "$1 ").trim();
  };

  const formatExpiry = (value) => {
    const clean = value.replace(/\D/g, "").slice(0, 4);
    if (clean.length >= 3) {
      return `${clean.slice(0, 2)}/${clean.slice(2, 4)}`;
    }
    return clean;
  };

  const handleSimulatePayment = (paymentType = tab) => {
    // Validation
    if (paymentType === "upi" && !upiId && tab === "upi") {
      setUpiError("Please enter your UPI ID or scan the QR code");
      return;
    }
    if (paymentType === "card") {
      const rawNumber = cardNumber.replace(/\s/g, "");
      if (rawNumber.length < 16) {
        setCardError("Please enter a valid 16-digit card number");
        return;
      }
      if (!cardHolder.trim()) {
        setCardError("Cardholder name is required");
        return;
      }
      if (cardExpiry.length < 5) {
        setCardError("Expiry must be in MM/YY format");
        return;
      }
      if (cardCvv.length < 3) {
        setCardError("Please enter a valid 3-digit CVV");
        return;
      }
    }

    setProcessing(true);
    setProcessStep(1);

    setTimeout(() => {
      setProcessStep(2);
      setTimeout(() => {
        setProcessStep(3);
        setTimeout(() => {
          const generatedTxnId = `TXN_${paymentType.toUpperCase()}_${Date.now().toString().slice(-8)}`;
          onPaymentSuccess({
            transactionId: generatedTxnId,
            paymentMethod: "online",
            paymentType,
            details: {
              gateway: "WeatherCart Secure Gateway",
              bank: selectedBank,
              timestamp: new Date().toISOString(),
            },
          });
        }, 800);
      }, 1000);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={processing ? undefined : onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
      />

      {/* Gateway Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl z-10"
      >
        {/* TOP BRANDING BAR */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-900 px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500 font-extrabold text-white shadow-md">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">WeatherCart Pay</p>
              <p className="text-sm font-extrabold tracking-wide">Secure Checkout</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Due</span>
              <span className="text-base font-extrabold text-white">₹{amount?.toLocaleString("en-IN")}</span>
            </div>
            {!processing && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-slate-800 p-1.5 text-slate-300 transition hover:bg-slate-700 hover:text-white"
                aria-label="Close payment modal"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* PROCESSING SCREEN */}
        {processing ? (
          <div className="p-8 text-center space-y-6">
            <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-slate-100 border-t-blue-600" />
              {processStep === 3 ? (
                <CheckCircle2 size={42} className="text-emerald-500 animate-pulse" />
              ) : (
                <Lock size={36} className="text-blue-600" />
              )}
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900">
                {processStep === 1 && "Connecting to Secure Bank Gateway..."}
                {processStep === 2 && "Authenticating Transaction..."}
                {processStep === 3 && "Payment Verified Successfully!"}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Please do not refresh or close this window.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-600">
              <ShieldCheck size={16} className="text-emerald-600" />
              <span>256-Bit SSL Encrypted • PCI-DSS Certified</span>
            </div>
          </div>
        ) : (
          <div>
            {/* TABS */}
            <div className="grid grid-cols-3 border-b border-slate-100 bg-slate-50 text-xs font-bold text-slate-600">
              <button
                type="button"
                onClick={() => setTab("upi")}
                className={`flex items-center justify-center gap-2 py-3.5 transition border-b-2 ${
                  tab === "upi"
                    ? "border-blue-600 bg-white text-blue-600"
                    : "border-transparent hover:text-slate-900"
                }`}
              >
                <QrCode size={15} />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setTab("card")}
                className={`flex items-center justify-center gap-2 py-3.5 transition border-b-2 ${
                  tab === "card"
                    ? "border-blue-600 bg-white text-blue-600"
                    : "border-transparent hover:text-slate-900"
                }`}
              >
                <CreditCard size={15} />
                <span>Cards</span>
              </button>

              <button
                type="button"
                onClick={() => setTab("netbanking")}
                className={`flex items-center justify-center gap-2 py-3.5 transition border-b-2 ${
                  tab === "netbanking"
                    ? "border-blue-600 bg-white text-blue-600"
                    : "border-transparent hover:text-slate-900"
                }`}
              >
                <Building2 size={15} />
                <span>Net Banking</span>
              </button>
            </div>

            {/* TAB CONTENTS */}
            <div className="p-6">
              {/* TAB 1: UPI */}
              {tab === "upi" && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row items-center gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    {/* Simulated QR Code */}
                    <div className="relative flex h-36 w-36 shrink-0 flex-col items-center justify-center rounded-xl border border-slate-300 bg-white p-2 shadow-sm">
                      <div className="grid grid-cols-6 gap-1 p-1">
                        {Array.from({ length: 36 }).map((_, i) => (
                          <div
                            key={i}
                            className={`h-3 w-3 rounded-xs ${
                              (i % 2 === 0 && i % 3 === 0) || i === 0 || i === 5 || i === 30 || i === 35
                                ? "bg-slate-950"
                                : "bg-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-[0.5px]">
                        <span className="rounded-md bg-slate-950 px-1.5 py-0.5 text-[8px] font-extrabold text-white">
                          SCAN & PAY
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-slate-800">
                        <Smartphone size={15} className="text-blue-600" />
                        <span>Scan with any UPI App</span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-500">
                        Google Pay, PhonePe, Paytm, BHIM, Cred
                      </p>

                      <div className="mt-3 inline-block rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-extrabold text-amber-800 border border-amber-200">
                        Expires in: {formatTimer(timeLeft)}
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1.5 justify-center sm:justify-start">
                        {["GPay", "PhonePe", "Paytm", "BHIM"].map((app) => (
                          <button
                            key={app}
                            type="button"
                            onClick={() => handleSimulatePayment("upi")}
                            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:border-slate-400 hover:bg-slate-100"
                          >
                            Pay with {app}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="relative text-center">
                    <span className="bg-white px-2 text-xs font-bold text-slate-400">OR ENTER UPI ID</span>
                    <div className="absolute inset-x-0 top-1/2 -z-10 h-px bg-slate-200" />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700">UPI ID / VPA</label>
                    <div className="mt-1 flex gap-2">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => {
                          setUpiId(e.target.value);
                          setUpiError("");
                        }}
                        placeholder="username@okhdfcbank"
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => handleSimulatePayment("upi")}
                        className="shrink-0 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700 shadow-sm"
                      >
                        Verify & Pay
                      </button>
                    </div>
                    {upiError && (
                      <p className="mt-1.5 flex items-center gap-1 text-[11px] text-red-600 font-semibold">
                        <AlertCircle size={12} /> {upiError}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: CREDIT / DEBIT CARDS */}
              {tab === "card" && (
                <div className="space-y-5">
                  {/* Visual Card Preview */}
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-tr from-slate-950 via-slate-900 to-blue-900 p-5 text-white shadow-xl">
                    <div className="flex items-center justify-between">
                      <div className="h-6 w-9 rounded-md bg-amber-400/80 shadow-inner" />
                      <span className="text-xs font-extrabold tracking-widest text-slate-300">
                        WEATHERPAY
                      </span>
                    </div>

                    <p className="mt-6 text-base sm:text-lg font-mono font-bold tracking-widest text-slate-100">
                      {cardNumber || "•••• •••• •••• ••••"}
                    </p>

                    <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
                      <div>
                        <span className="block text-[9px] uppercase">Cardholder</span>
                        <span className="font-bold text-white uppercase truncate max-w-[150px] block">
                          {cardHolder || "YOUR NAME"}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[9px] uppercase">Expires</span>
                        <span className="font-bold text-white">{cardExpiry || "MM/YY"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => {
                          setCardNumber(formatCardNumber(e.target.value));
                          setCardError("");
                        }}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700">Name on Card</label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => {
                          setCardHolder(e.target.value);
                          setCardError("");
                        }}
                        placeholder="VIKASH SHARMA"
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-slate-900"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => {
                            setCardExpiry(formatExpiry(e.target.value));
                            setCardError("");
                          }}
                          placeholder="12/28"
                          maxLength={5}
                          className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-slate-900"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700">CVV / CVC</label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => {
                            setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4));
                            setCardError("");
                          }}
                          placeholder="•••"
                          maxLength={4}
                          className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-slate-900"
                        />
                      </div>
                    </div>

                    {cardError && (
                      <p className="flex items-center gap-1 text-[11px] text-red-600 font-semibold">
                        <AlertCircle size={12} /> {cardError}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSimulatePayment("card")}
                    className="w-full rounded-2xl bg-slate-950 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-slate-800"
                  >
                    Pay ₹{amount?.toLocaleString("en-IN")} Securely
                  </button>
                </div>
              )}

              {/* TAB 3: NET BANKING */}
              {tab === "netbanking" && (
                <div className="space-y-4">
                  <p className="text-xs font-bold text-slate-700">Select Your Bank</p>

                  <div className="grid grid-cols-3 gap-2">
                    {["HDFC", "ICICI", "SBI", "Axis", "Kotak", "PNB"].map((bank) => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`rounded-xl border p-3 text-center transition ${
                          selectedBank === bank
                            ? "border-blue-600 bg-blue-50 text-blue-900 font-extrabold shadow-sm"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-400 font-semibold"
                        }`}
                      >
                        <Building2 size={20} className="mx-auto text-slate-600 mb-1" />
                        <span className="text-xs">{bank} Bank</span>
                      </button>
                    ))}
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
                    You will be redirected to {selectedBank} Bank&apos;s highly secured net banking gateway to complete the payment.
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSimulatePayment("netbanking")}
                    className="w-full rounded-2xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-blue-700"
                  >
                    Proceed with {selectedBank} Bank
                  </button>
                </div>
              )}
            </div>

            {/* FOOTER BADGES */}
            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5 font-semibold">
                <Lock size={12} className="text-emerald-600" />
                RBI & PCI-DSS Compliant
              </span>
              <span>100% Refund Guarantee</span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
