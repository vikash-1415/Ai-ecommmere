import { createContext, useCallback, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, AlertTriangle, Info, ShoppingCart,
  Heart, Package, Bell, X,
} from "lucide-react";

const ToastContext = createContext(null);

const ICONS = {
  success: Check,
  error: AlertTriangle,
  info: Info,
  cart: ShoppingCart,
  wishlist: Heart,
  order: Package,
  alert: Bell,
};

const COLORS = {
  success: "bg-emerald-600",
  error: "bg-rose-600",
  info: "bg-blue-600",
  cart: "bg-indigo-600",
  wishlist: "bg-rose-500",
  order: "bg-violet-600",
  alert: "bg-amber-500",
};

// ── Individual Toast ──
function ToastItem({ id, message, type, onDismiss }) {
  const Icon = ICONS[type] || Info;
  const bg = COLORS[type] || "bg-slate-800";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-white shadow-2xl min-w-[220px] max-w-xs ${bg}`}
    >
      <div className="h-7 w-7 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
        <Icon size={15} />
      </div>
      <span className="text-sm font-semibold flex-1">{message}</span>
      <button onClick={() => onDismiss(id)} className="opacity-70 hover:opacity-100 transition">
        <X size={14} />
      </button>
    </motion.div>
  );
}

// ── Provider ──
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = "success", duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev.slice(-4), { id, message, type }]);
    setTimeout(() => dismiss(id), duration);
    return id;
  }, [dismiss]);

  // Convenience methods
  const success = useCallback((msg) => addToast(msg, "success"), [addToast]);
  const error = useCallback((msg) => addToast(msg, "error"), [addToast]);
  const info = useCallback((msg) => addToast(msg, "info"), [addToast]);
  const cart = useCallback((msg) => addToast(msg, "cart"), [addToast]);
  const wishlist = useCallback((msg) => addToast(msg, "wishlist"), [addToast]);
  const order = useCallback((msg) => addToast(msg, "order"), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, success, error, info, cart, wishlist, order, dismiss }}>
      {children}

      {/* Toast Container */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map(t => (
            <div key={t.id} className="pointer-events-auto">
              <ToastItem {...t} onDismiss={dismiss} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

// ── Hook ──
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
