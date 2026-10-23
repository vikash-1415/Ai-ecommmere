import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  Truck,
  ShieldCheck,
} from "lucide-react";
import { useCart } from "../context/CartContext";

export default function CartDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { cart, subtotal, shipping, total, updateQuantity, removeFromCart } = useCart();

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const freeShippingThreshold = 999;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity"
          />

          {/* DRAWER PANEL */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 32 }}
            className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl z-10"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white">
                  <ShoppingBag size={18} />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-950">Your Cart</h2>
                  <p className="text-[11px] text-slate-500">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)} items in bag
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
                aria-label="Close cart drawer"
              >
                <X size={18} />
              </button>
            </div>

            {/* FREE SHIPPING PROGRESS BAR */}
            <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <Truck size={14} className="text-blue-600" />
                  {remainingForFreeShipping === 0 ? (
                    <span className="text-emerald-700 font-extrabold">🎉 You unlocked FREE delivery!</span>
                  ) : (
                    <span>Add ₹{remainingForFreeShipping} more for FREE Delivery</span>
                  )}
                </span>
                <span className="text-[11px] text-slate-500">{freeShippingPercent}%</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-slate-950 transition-all duration-300"
                  style={{ width: `${freeShippingPercent}%` }}
                />
              </div>
            </div>

            {/* CART ITEMS LIST */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-400">
                    <ShoppingBag size={28} />
                  </div>
                  <h3 className="mt-4 text-base font-extrabold text-slate-900">Your bag is empty</h3>
                  <p className="mt-1 text-xs text-slate-500 max-w-[220px]">
                    Looks like you haven&apos;t added any weather-ready items yet.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate("/products");
                    }}
                    className="mt-5 rounded-xl bg-slate-950 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-slate-800"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id || item._id}
                    className="flex gap-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 p-3 transition hover:border-slate-200 hover:bg-white"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 shrink-0 rounded-xl object-cover bg-slate-200"
                    />

                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            to={`/products/${item.id || item._id}`}
                            onClick={onClose}
                            className="text-xs font-extrabold text-slate-900 line-clamp-1 hover:text-blue-600"
                          >
                            {item.name}
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id || item._id)}
                            className="rounded-lg p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                            aria-label="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-500">{item.category}</p>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center rounded-lg border border-slate-200 bg-white shadow-2xs">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id || item._id, item.quantity - 1)}
                            className="p-1.5 text-slate-600 transition hover:bg-slate-100"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="min-w-6 text-center text-xs font-bold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id || item._id, item.quantity + 1)}
                            className="p-1.5 text-slate-600 transition hover:bg-slate-100"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <span className="text-sm font-extrabold text-slate-950">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* FOOTER ACTIONS */}
            {cart.length > 0 && (
              <div className="border-t border-slate-100 bg-white p-5 space-y-4">
                <div className="space-y-1.5 text-xs font-semibold text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-900">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span className="font-bold text-slate-900">
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="border-t border-slate-100 pt-2 flex justify-between text-sm">
                    <span className="font-extrabold text-slate-950">Estimated Total</span>
                    <span className="text-base font-black text-slate-950">
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="grid gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate("/checkout");
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 py-3.5 text-xs font-extrabold text-white shadow-lg transition hover:bg-slate-800"
                  >
                    Proceed to Checkout
                    <ArrowRight size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate("/cart");
                    }}
                    className="flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    View Full Cart
                  </button>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
                  <ShieldCheck size={12} className="text-emerald-600" />
                  <span>WeatherCart Safe & Secure Checkout</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
