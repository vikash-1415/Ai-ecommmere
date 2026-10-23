import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  CreditCard,
  Lock,
  MapPin,
  Truck,
  Tag,
  ShieldCheck,
  AlertCircle,
  Zap,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PaymentGatewayModal from "../components/PaymentGatewayModal";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { analytics } from "../services/analyticsTracker";

const PRESET_COUPONS = [
  { code: "WEATHER10", discountPercent: 10, label: "10% OFF", desc: "All WeatherCart items" },
  { code: "MONSOON20", discountPercent: 20, minOrder: 999, label: "20% OFF", desc: "Orders ₹999+" },
  { code: "FIRST100", flatDiscount: 100, minOrder: 500, label: "₹100 OFF", desc: "Orders ₹500+" },
  { code: "SUPER500", flatDiscount: 500, minOrder: 2000, label: "₹500 OFF", desc: "Orders ₹2000+" },
];

export default function Checkout() {
  const navigate = useNavigate();
  const { user, isAuthenticated, resendVerificationEmail } = useAuth();
  const { cart, subtotal, clearCart } = useCart();

  // Address State
  const [address, setAddress] = useState(() => {
    try {
      const saved = localStorage.getItem("weathercart-saved-address");
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      name: user?.name || "Vikash Sharma",
      phone: "9876543210",
      address: "Flat 402, Sunshine Heights, Ring Road",
      city: "Ahmedabad",
      state: "Gujarat",
      pincode: "380015",
    };
  });

  // Shipping Method: 'standard' | 'express'
  const [shippingMethod, setShippingMethod] = useState("standard");

  // Payment Method: 'cod' | 'online'
  const [payment, setPayment] = useState("cod");

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // Online gateway modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [verificationNotice, setVerificationNotice] = useState("");

  const emailVerificationRequired =
    user?.emailVerificationRequired && !user?.emailVerified;

  const handleResendVerification = async () => {
    try {
      const result = await resendVerificationEmail(user.email);
      setVerificationNotice(result.message);
    } catch (requestError) {
      setVerificationNotice(requestError.message);
    }
  };

  // Save address on change
  useEffect(() => {
    try {
      localStorage.setItem("weathercart-saved-address", JSON.stringify(address));
    } catch {}
  }, [address]);

  // Track checkout funnel step
  useEffect(() => {
    if (cart.length > 0) {
      analytics.trackCheckoutStart(subtotal, cart.length, "all-weather", address.city || "Default City");
    }
  }, []);

  if (cart.length === 0) {
    return <EmptyCheckout />;
  }

  // Calculate Shipping fee
  let shippingFee = subtotal >= 999 ? 0 : 79;
  if (shippingMethod === "express") {
    shippingFee += 99;
  }

  // Calculate Discount
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discountAmount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.flatDiscount) {
      discountAmount = appliedCoupon.flatDiscount;
    }
    discountAmount = Math.min(discountAmount, subtotal);
  }

  const grandTotal = Math.max(0, subtotal + shippingFee - discountAmount);

  const updateField = (field, value) => {
    setAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Coupon validation
  const handleApplyCoupon = async (codeToApply = couponCode) => {
    if (!codeToApply || !codeToApply.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    const clean = codeToApply.trim().toUpperCase();
    setValidatingCoupon(true);
    setCouponError("");

    try {
      // Try backend validation first
      const res = await api.validateCoupon(clean, subtotal);
      if (res.success && res.coupon) {
        setAppliedCoupon(res.coupon);
        setCouponCode(clean);
      }
    } catch (err) {
      // Fallback local match
      const matched = PRESET_COUPONS.find((c) => c.code === clean);
      if (!matched) {
        setCouponError("Invalid coupon code");
        return;
      }
      if (matched.minOrder && subtotal < matched.minOrder) {
        setCouponError(`Minimum order amount for ${clean} is ₹${matched.minOrder}`);
        return;
      }

      setAppliedCoupon(matched);
      setCouponCode(clean);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  // Validate form fields
  const validateForm = () => {
    if (!address.name.trim()) return "Full name is required";
    if (!address.phone.trim() || address.phone.replace(/\D/g, "").length < 10)
      return "Valid 10-digit phone number is required";
    if (!address.address.trim()) return "Delivery address is required";
    if (!address.city.trim()) return "City is required";
    if (!address.state.trim()) return "State is required";
    if (!address.pincode.trim() || address.pincode.replace(/\D/g, "").length < 6)
      return "Valid 6-digit PIN code is required";
    return "";
  };

  // Submit order handling
  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    if (emailVerificationRequired) {
      setError("Verify your email before placing an order.");
      return;
    }

    const validationMsg = validateForm();
    if (validationMsg) {
      setError(validationMsg);
      return;
    }

    if (payment === "online") {
      setShowPaymentModal(true);
    } else {
      processOrder({ paymentMethod: "cod" });
    }
  };

  // Process order to backend
  const processOrder = async ({
    paymentMethod = "cod",
    transactionId = "",
    paymentType = "cod",
    details = {},
  }) => {
    try {
      setSubmitting(true);
      setError("");

      const orderData = {
        items: cart.map((item) => ({
          productId: item._id || item.id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: address.name,
          phone: address.phone,
          addressLine: address.address,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
        },
        shippingMethod,
        paymentMethod,
        couponCode: appliedCoupon?.code || "",
        discount: discountAmount,
        transactionId: transactionId || (paymentMethod === "online" ? `TXN_${Date.now()}` : ""),
        paymentDetails: {
          ...details,
          method: paymentType,
        },
      };

      const res = await api.createOrder(orderData);
      const createdOrder = res.order;

      // Save order snapshot locally for confirmation page and fast recovery
      localStorage.setItem("weathercart-last-order", JSON.stringify(createdOrder));
      clearCart();

      const targetId = createdOrder.orderNumber || createdOrder._id;
      navigate(`/order-success/${targetId}`);
    } catch (err) {
      console.error("Order placement failed:", err);
      setError(err.message || "Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
      setShowPaymentModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* HEADER */}
          <div>
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-slate-950"
            >
              <ArrowLeft size={15} />
              Return to Cart
            </Link>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                  Checkout & Payment
                </h1>
                <p className="mt-1 text-xs text-slate-500">
                  Step 20 • Complete your delivery address and choose a payment method.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-800 border border-emerald-200">
                <ShieldCheck size={16} />
                <span>256-Bit SSL Secured</span>
              </div>
            </div>
          </div>

          {/* AUTH WARNING IF NOT LOGGED IN */}
          {!isAuthenticated && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-blue-200 bg-blue-50 p-4 sm:p-5 text-blue-900 shadow-sm">
              <div>
                <p className="font-bold text-sm">Account Required for Delivery Tracking</p>
                <p className="text-xs text-blue-700 mt-0.5">
                  Sign in or register to link your purchase to your account and track delivery progress.
                </p>
              </div>
              <Link
                to="/login"
                state={{ from: "/checkout" }}
                className="shrink-0 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700 shadow-sm"
              >
                Sign In to Continue
              </Link>
            </div>
          )}

          {emailVerificationRequired && (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
              <p className="font-bold">Verify your email before checkout</p>
              <p className="mt-1 text-xs">
                Check {user.email} for a verification link.
              </p>
              <button
                type="button"
                onClick={handleResendVerification}
                className="mt-3 text-xs font-bold underline"
              >
                Resend verification email
              </button>
              {verificationNotice && (
                <p className="mt-2 text-xs">{verificationNotice}</p>
              )}
            </div>
          )}

          {/* ERROR ALERT */}
          {error && (
            <div className="mt-6 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* MAIN CHECKOUT FORM */}
          <form
            id="checkout-form"
            onSubmit={handleFormSubmit}
            className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]"
          >
            {/* LEFT COLUMN: ADDRESS, SHIPPING, PAYMENT METHOD */}
            <div className="space-y-6">
              {/* 1. DELIVERY ADDRESS */}
              <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-950">1. Delivery Address</h2>
                    <p className="text-xs text-slate-500">Where should we deliver your order?</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-bold text-slate-700">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={address.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      placeholder="e.g. Vikash Sharma"
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700">10-Digit Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      value={address.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      placeholder="e.g. 9876543210"
                      maxLength={10}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-slate-900"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700">House / Flat No., Street, Area *</label>
                    <input
                      type="text"
                      required
                      value={address.address}
                      onChange={(e) => updateField("address", e.target.value)}
                      placeholder="e.g. 402, Sunshine Heights, Near City Mall"
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700">City *</label>
                    <input
                      type="text"
                      required
                      value={address.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      placeholder="Ahmedabad"
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700">State *</label>
                    <input
                      type="text"
                      required
                      value={address.state}
                      onChange={(e) => updateField("state", e.target.value)}
                      placeholder="Gujarat"
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700">6-Digit PIN Code *</label>
                    <input
                      type="text"
                      required
                      value={address.pincode}
                      onChange={(e) => updateField("pincode", e.target.value)}
                      placeholder="380015"
                      maxLength={6}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-slate-900"
                    />
                  </div>
                </div>
              </section>

              {/* 2. SHIPPING / DELIVERY METHOD */}
              <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white">
                    <Truck size={18} />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-950">2. Shipping Method</h2>
                    <p className="text-xs text-slate-500">Choose your preferred courier delivery speed.</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <label
                    className={`flex cursor-pointer flex-col justify-between rounded-2xl border-2 p-4 transition ${
                      shippingMethod === "standard"
                        ? "border-slate-950 bg-slate-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="shippingMethod"
                          checked={shippingMethod === "standard"}
                          onChange={() => setShippingMethod("standard")}
                          className="accent-slate-950"
                        />
                        <span className="text-sm font-extrabold text-slate-900">Standard Delivery</span>
                      </div>
                      <span className="text-xs font-extrabold text-emerald-700">
                        {subtotal >= 999 ? "FREE" : "₹79"}
                      </span>
                    </div>
                    <p className="mt-3 text-xs text-slate-500">
                      Delivered in 3–5 business days. FREE on orders over ₹999.
                    </p>
                  </label>

                  <label
                    className={`flex cursor-pointer flex-col justify-between rounded-2xl border-2 p-4 transition ${
                      shippingMethod === "express"
                        ? "border-blue-600 bg-blue-50/50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="shippingMethod"
                          checked={shippingMethod === "express"}
                          onChange={() => setShippingMethod("express")}
                          className="accent-blue-600"
                        />
                        <span className="text-sm font-extrabold text-slate-900">Express Priority</span>
                      </div>
                      <span className="text-xs font-extrabold text-blue-700">+₹99</span>
                    </div>
                    <p className="mt-3 text-xs text-slate-500">
                      Delivered in 1–2 days with weather-sealed priority packaging.
                    </p>
                  </label>
                </div>
              </section>

              {/* 3. PAYMENT METHOD SELECTION */}
              <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white">
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-950">3. Payment Option</h2>
                    <p className="text-xs text-slate-500">Pay online via UPI/Card or choose Pay on Delivery.</p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {/* COD OPTION */}
                  <label
                    className={`flex cursor-pointer items-start gap-4 rounded-2xl border-2 p-4 transition ${
                      payment === "cod"
                        ? "border-slate-950 bg-slate-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={payment === "cod"}
                      onChange={() => setPayment("cod")}
                      className="mt-1 accent-slate-950"
                    />
                    <div>
                      <p className="text-sm font-extrabold text-slate-900">Cash on Delivery (COD)</p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Pay in cash or UPI to the delivery courier when your order arrives.
                      </p>
                    </div>
                  </label>

                  {/* ONLINE PAYMENT OPTION */}
                  <label
                    className={`flex cursor-pointer items-start gap-4 rounded-2xl border-2 p-4 transition ${
                      payment === "online"
                        ? "border-blue-600 bg-blue-50/40"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={payment === "online"}
                      onChange={() => setPayment("online")}
                      className="mt-1 accent-blue-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-extrabold text-slate-900">
                          Online Payment (Instant Gateway)
                        </p>
                        <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-extrabold text-blue-800">
                          RECOMMENDED
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500">
                        UPI (GPay, PhonePe, Paytm, QR Code), Debit/Credit Cards & Net Banking.
                      </p>
                    </div>
                  </label>
                </div>
              </section>
            </div>

            {/* RIGHT COLUMN: COUPON & ORDER SUMMARY */}
            <div className="space-y-6">
              {/* COUPON CARD */}
              <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  <Tag size={14} /> Apply Discount Coupon
                </div>

                {appliedCoupon ? (
                  <div className="mt-3 flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5">
                    <div>
                      <span className="text-xs font-extrabold text-emerald-900">
                        {appliedCoupon.code} Applied!
                      </span>
                      <p className="text-[11px] text-emerald-700">
                        You saved ₹{discountAmount} on this order
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-red-600 shadow-xs hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="mt-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value.toUpperCase());
                          setCouponError("");
                        }}
                        placeholder="ENTER COUPON CODE"
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold uppercase outline-none focus:border-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon(couponCode)}
                        disabled={validatingCoupon}
                        className="rounded-xl bg-slate-950 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
                      >
                        {validatingCoupon ? "Checking..." : "Apply"}
                      </button>
                    </div>

                    {couponError && (
                      <p className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-red-600">
                        <AlertCircle size={12} /> {couponError}
                      </p>
                    )}

                    {/* PRESET COUPON CHIPS */}
                    <div className="mt-3.5 border-t border-slate-100 pt-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Available Offers:
                      </span>
                      <div className="mt-1.5 space-y-1.5">
                        {PRESET_COUPONS.map((cp) => (
                          <div
                            key={cp.code}
                            className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-1.5 text-xs"
                          >
                            <div>
                              <span className="font-extrabold text-slate-900">{cp.code}</span>
                              <span className="ml-1.5 text-[10px] text-slate-500">({cp.desc})</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleApplyCoupon(cp.code)}
                              className="font-bold text-blue-600 hover:underline"
                            >
                              Apply
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ORDER SUMMARY */}
              <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
                <h3 className="text-base font-extrabold text-slate-950">Order Summary</h3>

                {/* ITEM PREVIEW */}
                <div className="mt-4 max-h-48 overflow-y-auto space-y-2.5 border-b border-slate-100 pb-4">
                  {cart.map((item) => (
                    <div key={item.id || item._id} className="flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-10 w-10 shrink-0 rounded-lg object-cover bg-slate-100"
                        />
                        <div className="truncate">
                          <p className="font-bold text-slate-900 truncate">{item.name}</p>
                          <p className="text-[10px] text-slate-400">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-extrabold text-slate-900">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>

                {/* TOTALS BREAKDOWN */}
                <div className="mt-4 space-y-2.5 text-xs font-semibold text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-900">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Delivery Fee ({shippingMethod === "express" ? "Express" : "Standard"})</span>
                    <span className="font-bold text-slate-900">
                      {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Coupon Discount</span>
                      <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-sm">
                    <span className="font-extrabold text-slate-950">Grand Total</span>
                    <span className="text-lg font-black text-slate-950">
                      ₹{grandTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* PLACE ORDER BUTTON */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 py-4 text-sm font-extrabold text-white shadow-xl transition hover:bg-slate-800 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Placing Order...
                    </>
                  ) : payment === "online" ? (
                    <>
                      <Lock size={15} />
                      Proceed to Pay ₹{grandTotal.toLocaleString("en-IN")}
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      Confirm Order (₹{grandTotal.toLocaleString("en-IN")} COD)
                    </>
                  )}
                </button>

                <p className="mt-3 text-center text-[10px] text-slate-400">
                  Encrypted checkout • 100% weather warranty
                </p>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />

      {/* PAYMENT GATEWAY INTERACTIVE MODAL */}
      <PaymentGatewayModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={grandTotal}
        onPaymentSuccess={processOrder}
      />
    </div>
  );
}

function EmptyCheckout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex min-h-[75vh] items-center justify-center px-4 pt-24">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-sm">
            <ShoppingBag size={32} className="text-slate-400" />
          </div>
          <h2 className="mt-5 text-xl font-extrabold text-slate-950">Your Cart is Empty</h2>
          <p className="mt-1 text-xs text-slate-500">
            Please add items to your cart before proceeding to checkout.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-block rounded-2xl bg-slate-950 px-6 py-3.5 text-xs font-bold text-white shadow-md transition hover:bg-slate-800"
          >
            Explore Catalog
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
