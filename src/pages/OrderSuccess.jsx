import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Check,
  PackageCheck,
  ShoppingBag,
  CreditCard,
  MapPin,
  Clock,
  Truck,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Receipt,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { analytics } from "../services/analyticsTracker";

export default function OrderSuccess() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("weathercart-last-order");
      if (saved) {
        const parsed = JSON.parse(saved);
        setOrder(parsed);
        analytics.trackPurchase(
          parsed.orderNumber || orderId,
          parsed.totalAmount || parsed.pricing?.total || 0,
          parsed.items || [],
          "all-weather",
          parsed.shippingAddress?.city || "Customer City"
        );
      }
    } catch (e) {
      console.warn("Could not load last order", e);
    }
  }, [orderId]);

  const isOnline = order?.paymentMethod === "online" || order?.paymentStatus === "paid";

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* SUCCESS BANNER */}
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-100 shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-sm">
                <Check size={28} strokeWidth={3} />
              </div>
            </div>

            <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.25em] text-emerald-600">
              Payment & Order Confirmed
            </p>

            <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Thank You for Shopping with WeatherCart!
            </h1>

            <p className="mx-auto mt-2 max-w-lg text-xs leading-6 text-slate-500 sm:text-sm">
              Your order has been verified and registered. We&apos;ve reserved your weather-adaptive items
              and initiated priority courier dispatch.
            </p>
          </div>

          {/* ORDER DETAILS CARD */}
          <div className="mt-8 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8 space-y-6">
            {/* TOP BAR: ORDER NUMBER & PAYMENT STATUS */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Order Number
                </span>
                <p className="text-lg font-black tracking-wide text-slate-950">
                  {order?.orderNumber || orderId}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {isOnline ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
                    <ShieldCheck size={14} />
                    Paid Online • {order?.transactionId || "Verified"}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3.5 py-1 text-xs font-bold text-amber-800 border border-amber-200">
                    <Clock size={14} />
                    Cash on Delivery (Pending Payment)
                  </span>
                )}
              </div>
            </div>

            {/* LIVE TRACKING TIMELINE */}
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-4">
                Estimated Delivery Timeline
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3.5 text-center">
                  <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">
                    ✓
                  </div>
                  <p className="mt-2 text-xs font-extrabold text-slate-900">Order Confirmed</p>
                  <p className="text-[10px] text-slate-500">Just Now</p>
                </div>

                <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-3.5 text-center">
                  <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
                    2
                  </div>
                  <p className="mt-2 text-xs font-extrabold text-slate-900">Weather Packing</p>
                  <p className="text-[10px] text-slate-500">In Progress</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-center opacity-70">
                  <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600 text-xs font-bold">
                    3
                  </div>
                  <p className="mt-2 text-xs font-extrabold text-slate-900">Courier Dispatch</p>
                  <p className="text-[10px] text-slate-500">Tomorrow</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-center opacity-70">
                  <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600 text-xs font-bold">
                    4
                  </div>
                  <p className="mt-2 text-xs font-extrabold text-slate-900">Delivered</p>
                  <p className="text-[10px] text-slate-500">In 2–3 Days</p>
                </div>
              </div>
            </div>

            {/* ORDER ITEMS LIST */}
            {order?.items && order.items.length > 0 && (
              <div className="border-t border-slate-100 pt-5">
                <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                  Purchased Items ({order.items.length})
                </p>

                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-12 w-12 rounded-xl object-cover bg-slate-200"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-200 text-slate-400">
                            <ShoppingBag size={18} />
                          </div>
                        )}
                        <div className="truncate">
                          <p className="text-xs font-extrabold text-slate-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-slate-500">Qty: {item.quantity}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-extrabold text-slate-900">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SHIPPING ADDRESS & PAYMENT METHOD SUMMARY */}
            <div className="grid gap-4 sm:grid-cols-2 border-t border-slate-100 pt-5">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900">
                  <MapPin size={15} className="text-blue-600" />
                  <span>Delivery Address</span>
                </div>
                <div className="mt-2 text-xs text-slate-600 space-y-0.5">
                  <p className="font-bold text-slate-800">{order?.shippingAddress?.fullName}</p>
                  <p>{order?.shippingAddress?.addressLine}</p>
                  <p>
                    {order?.shippingAddress?.city}, {order?.shippingAddress?.state} -{" "}
                    {order?.shippingAddress?.pincode}
                  </p>
                  <p className="text-[11px] text-slate-500">Phone: {order?.shippingAddress?.phone}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900">
                  <CreditCard size={15} className="text-blue-600" />
                  <span>Payment Summary</span>
                </div>
                <div className="mt-2 text-xs text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-bold text-slate-800">
                      ₹{order?.subtotal?.toLocaleString("en-IN") || "—"}
                    </span>
                  </div>
                  {order?.discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Discount ({order.couponCode || "Coupon"}):</span>
                      <span>-₹{order.discount.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery:</span>
                    <span className="font-bold text-slate-800">
                      {order?.shippingFee === 0 ? "FREE" : `₹${order?.shippingFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-1 text-sm font-extrabold text-slate-950">
                    <span>Total Paid:</span>
                    <span>₹{order?.total?.toLocaleString("en-IN") || "—"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/orders"
              className="flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-7 py-4 text-xs font-extrabold text-white shadow-lg transition hover:bg-slate-800"
            >
              <Receipt size={15} />
              View All Orders
            </Link>

            <Link
              to="/products"
              className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-7 py-4 text-xs font-extrabold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Continue Shopping
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
