import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  AlertCircle,
  ChevronRight,
  ArrowLeft,
  RotateCcw,
  ShoppingBag,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

const statusConfig = {
  pending: {
    label: "Order Placed",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock,
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: CheckCircle2,
  },
  processing: {
    label: "Processing",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    icon: Package,
  },
  shipped: {
    label: "Shipped",
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-50 text-red-700 border-red-200",
    icon: XCircle,
  },
};

export default function Orders() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
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
    if (isAuthenticated) {
      loadOrders();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [isAuthenticated, authLoading]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      setCancellingId(orderId);
      await api.cancelOrder(orderId);
      // Reload orders to reflect updated status and stock
      await loadOrders();
    } catch (err) {
      alert(err.message || "Failed to cancel order");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Link
                to="/products"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-950 mb-2"
              >
                <ArrowLeft size={14} /> Back to Shopping
              </Link>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                My Orders
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Track current deliveries and view your order history.
              </p>
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

          {/* Unauthenticated State */}
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

          {/* Loading State */}
          {loading && isAuthenticated && (
            <div className="mt-8 space-y-4">
              {[1, 2].map((n) => (
                <div key={n} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6">
                  <div className="flex justify-between border-b border-slate-100 pb-4">
                    <div className="h-5 w-40 rounded bg-slate-200" />
                    <div className="h-5 w-24 rounded bg-slate-200" />
                  </div>
                  <div className="mt-4 h-16 rounded bg-slate-100" />
                </div>
              ))}
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="mt-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Empty Orders State */}
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

          {/* Orders List */}
          {!loading && isAuthenticated && orders.length > 0 && (
            <div className="mt-8 space-y-6">
              {orders.map((order) => {
                const conf = statusConfig[order.status] || statusConfig.pending;
                const StatusIcon = conf.icon;
                const canCancel = ["pending", "confirmed"].includes(order.status);
                const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });

                return (
                  <div
                    key={order._id}
                    className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm transition hover:shadow-md"
                  >
                    {/* Order Top Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="font-extrabold text-sm sm:text-base text-slate-900">
                            #{order.orderNumber}
                          </span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-500">{orderDate}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 capitalize">
                          Payment: {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"} ({order.paymentStatus})
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${conf.color}`}
                        >
                          <StatusIcon size={13} />
                          {conf.label}
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="divide-y divide-slate-100 px-5 sm:px-6">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 py-4">
                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-slate-400">
                                <Package size={20} />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3 className="truncate text-sm font-bold text-slate-900">
                              {item.name}
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                              Qty: {item.quantity} × ₹{item.price?.toLocaleString("en-IN")}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-sm font-extrabold text-slate-900">
                              ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-slate-100 bg-white px-5 py-4 sm:px-6">
                      <div className="text-xs text-slate-500">
                        Deliver to: <span className="font-semibold text-slate-800">{order.shippingAddress?.fullName}</span>, {order.shippingAddress?.city}, {order.shippingAddress?.state} ({order.shippingAddress?.pincode})
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <div>
                          <span className="text-xs text-slate-400 mr-2">Total Amount:</span>
                          <span className="text-base font-extrabold text-slate-950">
                            ₹{order.total?.toLocaleString("en-IN")}
                          </span>
                        </div>

                        {canCancel && (
                          <button
                            onClick={() => handleCancelOrder(order._id)}
                            disabled={cancellingId === order._id}
                            className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                          >
                            {cancellingId === order._id ? "Cancelling..." : "Cancel Order"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
