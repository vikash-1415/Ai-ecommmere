import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  AlertCircle,
  ArrowLeft,
  RotateCcw,
  ShoppingBag,
  ChevronDown,
  MapPin,
  CreditCard,
  Mail,
  Phone,
  MessageCircle,
  HeadphonesIcon,
  Star,
  AlertTriangle,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

/* ─── Status pipeline ──────────────────────────────────────────── */
const STEPS = [
  { key: "pending",    label: "Order Placed",   icon: Clock,          desc: "Your order has been received" },
  { key: "confirmed",  label: "Confirmed",      icon: CheckCircle2,   desc: "Seller confirmed your order" },
  { key: "processing", label: "Processing",     icon: Package,        desc: "Your items are being packed" },
  { key: "shipped",    label: "Shipped",        icon: Truck,          desc: "On its way to you" },
  { key: "delivered",  label: "Delivered",      icon: Star,           desc: "Delivered successfully" },
];

const STATUS_IDX = { pending: 0, confirmed: 1, processing: 2, shipped: 3, delivered: 4 };

const statusBadge = {
  pending:    "bg-amber-50  text-amber-700  border-amber-200",
  confirmed:  "bg-blue-50   text-blue-700   border-blue-200",
  processing: "bg-violet-50 text-violet-700 border-violet-200",
  shipped:    "bg-cyan-50   text-cyan-700   border-cyan-200",
  delivered:  "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled:  "bg-rose-50   text-rose-700   border-rose-200",
};

const CANCEL_REASONS = [
  "Changed my mind",
  "Found a better price elsewhere",
  "Ordered by mistake",
  "Delivery time is too long",
  "Product no longer needed",
  "Other",
];

/* ─── Cancel Confirmation Modal ───────────────────────────────── */
function CancelModal({ order, onConfirm, onClose, loading }) {
  const [reason, setReason] = useState("");
  const [custom, setCustom] = useState("");
  const finalReason = reason === "Other" ? custom.trim() : reason;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={onClose}
        />
        {/* modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 20 }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* header */}
          <div className="px-6 pt-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-rose-50 flex items-center justify-center shrink-0">
                <AlertTriangle size={20} className="text-rose-500" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Cancel Order</h3>
                <p className="text-xs text-slate-500 mt-0.5">#{order?.orderNumber}</p>
              </div>
            </div>
          </div>

          {/* body */}
          <div className="px-6 py-5 space-y-4">
            <p className="text-sm text-slate-600">
              Are you sure you want to cancel this order? Please let us know why:
            </p>

            {/* reason chips */}
            <div className="flex flex-wrap gap-2">
              {CANCEL_REASONS.map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReason(r)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                    reason === r
                      ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:border-rose-300 hover:text-rose-600"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* custom reason textarea */}
            {reason === "Other" && (
              <textarea
                rows={3}
                value={custom}
                onChange={e => setCustom(e.target.value)}
                placeholder="Please describe your reason…"
                className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
              />
            )}

            {/* selected reason preview */}
            {reason && reason !== "Other" && (
              <div className="rounded-xl bg-rose-50 border border-rose-100 px-4 py-2.5">
                <p className="text-xs text-rose-600 font-medium">Reason: <span className="font-bold">{reason}</span></p>
              </div>
            )}
          </div>

          {/* footer */}
          <div className="px-6 pb-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50 transition"
            >
              Keep Order
            </button>
            <button
              type="button"
              disabled={!finalReason || loading}
              onClick={() => onConfirm(finalReason)}
              className="flex-1 py-3 rounded-2xl bg-rose-600 text-white text-sm font-bold hover:bg-rose-700 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><RotateCcw size={15} className="animate-spin" /> Cancelling…</>
              ) : (
                <><XCircle size={15} /> Confirm Cancel</>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}


/* ─── Step-wise timeline ──────────────────────────────────────── */
function OrderTimeline({ status }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-rose-50 border border-rose-200 px-4 py-3 mt-4">
        <XCircle size={20} className="text-rose-500 shrink-0" />
        <div>
          <p className="text-sm font-bold text-rose-700">Order Cancelled</p>
          <p className="text-xs text-rose-500 mt-0.5">This order was cancelled. Refund (if applicable) will be processed in 5-7 days.</p>
        </div>
      </div>
    );
  }

  const currentIdx = STATUS_IDX[status] ?? 0;

  return (
    <div className="mt-5 px-1">
      <div className="flex items-start gap-0">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const done = i < currentIdx;
          const active = i === currentIdx;
          const upcoming = i > currentIdx;
          const isLast = i === STEPS.length - 1;
          return (
            <div key={step.key} className="flex flex-col items-center flex-1">
              {/* connector + dot row */}
              <div className="flex items-center w-full">
                {/* left line */}
                {i > 0 && (
                  <div className={`flex-1 h-0.5 ${done || active ? "bg-blue-500" : "bg-slate-200"}`} />
                )}
                {/* circle */}
                <div
                  className={`shrink-0 flex items-center justify-center rounded-full transition-all duration-500
                    ${active ? "h-9 w-9 bg-blue-600 shadow-lg shadow-blue-200 ring-4 ring-blue-100"
                    : done  ? "h-7 w-7 bg-blue-500"
                    : "h-7 w-7 bg-slate-200"}`}
                >
                  <Icon
                    size={active ? 17 : 13}
                    className={active ? "text-white" : done ? "text-white" : "text-slate-400"}
                  />
                </div>
                {/* right line */}
                {!isLast && (
                  <div className={`flex-1 h-0.5 ${done ? "bg-blue-500" : "bg-slate-200"}`} />
                )}
              </div>
              {/* label */}
              <div className="mt-2 text-center px-0.5">
                <p className={`text-[10px] font-bold leading-tight ${active ? "text-blue-700" : done ? "text-slate-700" : "text-slate-400"}`}>
                  {step.label}
                </p>
                {active && (
                  <p className="text-[9px] text-blue-500 mt-0.5 leading-tight hidden sm:block">{step.desc}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Order Card ──────────────────────────────────────────────── */
function OrderCard({ order, onCancel, cancellingId }) {
  const [open, setOpen] = useState(false);
  const canCancel = ["pending", "confirmed"].includes(order.status);
  const badge = statusBadge[order.status] || "bg-slate-50 text-slate-700 border-slate-200";

  const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
  const total = order.total ?? order.totalAmount ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      {/* ── top bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/60 px-5 py-4 sm:px-6">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2.5">
            <span className="font-extrabold text-sm text-slate-900">#{order.orderNumber}</span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500">{orderDate}</span>
          </div>
          <p className="text-[11px] text-slate-400">
            {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
            {" "}
            <span className={`font-semibold ${order.paymentStatus === "paid" ? "text-emerald-600" : "text-amber-600"}`}>
              ({order.paymentStatus})
            </span>
          </p>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-bold ${badge}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>

      {/* ── status timeline ── */}
      <div className="px-5 sm:px-6 pt-4 pb-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Order Status</p>
        <OrderTimeline status={order.status} />
      </div>

      {/* ── items summary (first 2 always visible) ── */}
      <div className="divide-y divide-slate-100 px-5 sm:px-6 mt-2">
        {order.items?.slice(0, open ? order.items.length : 2).map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 py-3.5">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
              {item.image
                ? <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                : <div className="flex h-full w-full items-center justify-center text-slate-400"><Package size={18} /></div>
              }
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-bold text-slate-900">{item.name}</h3>
              <p className="mt-0.5 text-xs text-slate-500">Qty: {item.quantity} × ₹{item.price?.toLocaleString("en-IN")}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-extrabold text-slate-900">
                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        ))}
      </div>

      {order.items?.length > 2 && (
        <button
          onClick={() => setOpen(o => !o)}
          className="w-full flex items-center justify-center gap-1 py-2 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50/60 hover:bg-blue-50 transition"
        >
          {open ? "Show less" : `+${order.items.length - 2} more item${order.items.length - 2 > 1 ? "s" : ""}`}
          <ChevronDown size={13} className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      )}

      {/* ── expanded details ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 sm:px-6 py-4 border-t border-slate-100 bg-slate-50/40 space-y-4">

              {/* Shipping address */}
              <div className="rounded-2xl bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={14} className="text-blue-600" />
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">Delivery Address</p>
                </div>
                <p className="text-sm font-semibold text-slate-900">{order.shippingAddress?.fullName}</p>
                <p className="text-xs text-slate-500 mt-0.5">{order.shippingAddress?.address}</p>
                <p className="text-xs text-slate-500">{order.shippingAddress?.city}, {order.shippingAddress?.state} – {order.shippingAddress?.pincode}</p>
                {order.shippingAddress?.phone && (
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <Phone size={11} /> {order.shippingAddress.phone}
                  </p>
                )}
              </div>

              {/* Price breakdown */}
              <div className="rounded-2xl bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard size={14} className="text-emerald-600" />
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">Price Breakdown</p>
                </div>
                <div className="space-y-1.5">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex justify-between text-xs text-slate-600">
                      <span className="truncate mr-4">{item.name} × {item.quantity}</span>
                      <span className="font-semibold shrink-0">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between">
                  <span className="text-xs font-bold text-slate-700">Shipping</span>
                  <span className="text-xs font-bold text-emerald-600">FREE</span>
                </div>
                <div className="mt-1.5 flex justify-between">
                  <span className="text-sm font-extrabold text-slate-900">Total</span>
                  <span className="text-sm font-extrabold text-slate-900">₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Support email box */}
              <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-4 text-white">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 shrink-0 rounded-xl bg-white/20 flex items-center justify-center">
                    <HeadphonesIcon size={17} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-blue-100 uppercase tracking-wide mb-0.5">Need Help?</p>
                    <p className="text-sm font-bold">WeatherCart Support</p>
                    <div className="mt-2 space-y-1">
                      <a
                        href="mailto:support@weathercart.com"
                        className="flex items-center gap-1.5 text-xs text-blue-100 hover:text-white transition"
                      >
                        <Mail size={12} /> support@weathercart.com
                      </a>
                      <a
                        href="tel:+918000000000"
                        className="flex items-center gap-1.5 text-xs text-blue-100 hover:text-white transition"
                      >
                        <Phone size={12} /> +91 80000 00000
                      </a>
                    </div>
                    <p className="text-[10px] text-blue-200 mt-2">Mon – Sat, 9 AM – 6 PM IST</p>
                    <a
                      href={`mailto:support@weathercart.com?subject=Help with Order ${order.orderNumber}&body=Hi, I need help with order ${order.orderNumber}.`}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-50 transition"
                    >
                      <MessageCircle size={13} /> Email Support
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── footer: total + cancel ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:px-6">
        <div className="text-xs text-slate-500 truncate">
          Ship to:{" "}
          <span className="font-semibold text-slate-800">
            {order.shippingAddress?.fullName}
          </span>
          {order.shippingAddress?.city && `, ${order.shippingAddress.city}`}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4">
          <div>
            <span className="text-xs text-slate-400 mr-1.5">Total:</span>
            <span className="text-base font-extrabold text-slate-950">
              ₹{total.toLocaleString("en-IN")}
            </span>
          </div>

          <button
            onClick={() => setOpen(o => !o)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 underline underline-offset-2 transition"
          >
            {open ? "Hide details" : "View details"}
          </button>

          {canCancel && (
            <button
              onClick={() => onCancel(order)}
              disabled={cancellingId === order._id}
              className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-1.5 text-xs font-bold text-rose-600 transition hover:bg-rose-100 active:scale-95 disabled:opacity-50"
            >
              {cancellingId === order._id ? "Cancelling…" : "Cancel Order"}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Orders page ─────────────────────────────────────────── */
export default function Orders() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelModal, setCancelModal] = useState(null); // order object
  const [cancelLoading, setCancelLoading] = useState(false);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.getMyOrders();
      setOrders(res.orders || []);
    } catch (err) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) loadOrders();
    else if (!authLoading) setLoading(false);
  }, [isAuthenticated, authLoading]);

  const handleCancelOrder = async (reason) => {
    if (!cancelModal) return;
    const orderId = cancelModal._id;
    try {
      setCancelLoading(true);
      setCancellingId(orderId);
      await api.cancelOrder(orderId, reason);
      await loadOrders();
      setCancelModal(null);
    } catch (err) {
      alert(err.message || "Failed to cancel order");
    } finally {
      setCancelLoading(false);
      setCancellingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Cancel Modal */}
      {cancelModal && (
        <CancelModal
          order={cancelModal}
          onConfirm={handleCancelOrder}
          onClose={() => setCancelModal(null)}
          loading={cancelLoading}
        />
      )}

      <main className="px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">

          {/* ── page header ── */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <Link
                to="/products"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-2"
              >
                <ArrowLeft size={14} /> Back to Shopping
              </Link>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">My Orders</h1>
              <p className="mt-1 text-sm text-slate-500">Track deliveries and manage your order history.</p>
            </div>

            {orders.length > 0 && (
              <button
                onClick={loadOrders}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <RotateCcw size={14} className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
            )}
          </div>

          {/* ── unauthenticated ── */}
          {!isAuthenticated && !authLoading && (
            <div className="mt-12 rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-800">
                <Package size={28} />
              </div>
              <h2 className="mt-4 text-xl font-bold text-slate-900">Sign in to view orders</h2>
              <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
                You need to be logged into your WeatherCart account to view and manage your orders.
              </p>
              <Link
                to="/login"
                state={{ from: "/orders" }}
                className="mt-6 inline-flex rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                Sign In
              </Link>
            </div>
          )}

          {/* ── loading skeleton ── */}
          {loading && isAuthenticated && (
            <div className="space-y-4">
              {[1, 2].map(n => (
                <div key={n} className="animate-pulse rounded-3xl border border-slate-200 bg-white p-6">
                  <div className="flex justify-between border-b border-slate-100 pb-4">
                    <div className="h-5 w-40 rounded bg-slate-200" />
                    <div className="h-5 w-24 rounded bg-slate-200" />
                  </div>
                  <div className="mt-4 h-16 rounded bg-slate-100" />
                </div>
              ))}
            </div>
          )}

          {/* ── error ── */}
          {error && (
            <div className="mt-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {/* ── empty ── */}
          {!loading && isAuthenticated && orders.length === 0 && (
            <div className="mt-12 rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <ShoppingBag size={28} />
              </div>
              <h2 className="mt-4 text-xl font-bold text-slate-900">No orders yet</h2>
              <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
                You haven't placed any weather-smart orders yet. Browse our curated catalog to get started.
              </p>
              <Link
                to="/products"
                className="mt-6 inline-flex rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                Browse Products
              </Link>
            </div>
          )}

          {/* ── orders list ── */}
          {!loading && isAuthenticated && orders.length > 0 && (
            <div className="space-y-6">
              {orders.map(order => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onCancel={setCancelModal}
                  cancellingId={cancellingId}
                />
              ))}

              {/* ── bottom support banner ── */}
              <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white">
                  <HeadphonesIcon size={22} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">Need help with your orders?</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Our support team is available Mon–Sat, 9 AM–6 PM IST
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                  <a
                    href="mailto:support@weathercart.com"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition"
                  >
                    <Mail size={13} /> Email Support
                  </a>
                  <a
                    href="tel:+918000000000"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                  >
                    <Phone size={13} /> Call Us
                  </a>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
