import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Tag } from "lucide-react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/layout/Footer";
import { useCart } from "../../context/CartContext";

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, subtotal, deliveryFee, grandTotal } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === "WEATHER20") {
      const disc = Math.round(subtotal * 0.2);
      setDiscount(disc);
      setCouponMessage("🎉 Coupon Applied! You saved 20%");
    } else {
      setCouponMessage("❌ Invalid Coupon. Try: WEATHER20");
    }
  };

  const finalAmount = Math.max(0, grandTotal - discount);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 sm:pt-28 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Shopping Cart
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Review your items before proceeding to instant checkout
            </p>
          </div>

          {cartItems.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm max-w-lg mx-auto">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4">
                <ShoppingBag size={32} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Your cart is empty</h2>
              <p className="mt-1 text-xs text-slate-500 max-w-xs mx-auto">
                Explore our real-time weather-tailored recommendations and find what suits your climate best.
              </p>
              <Link
                to="/products"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-blue-600 transition"
              >
                <span>Browse Products</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items List */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-sm transition hover:border-slate-300"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-cover bg-slate-100 flex-shrink-0"
                      />
                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          {item.weatherTagLabel || "Essential"}
                        </span>
                        <h3 className="text-sm sm:text-base font-semibold text-slate-900 line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-xs font-bold text-slate-900">
                          ₹{item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-600 hover:bg-white transition"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-600 hover:bg-white transition"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Total for Item */}
                      <div className="text-right">
                        <p className="text-sm sm:text-base font-bold text-slate-900">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-slate-400 hover:text-rose-500 rounded-full hover:bg-rose-50 transition"
                        aria-label="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="flex justify-between items-center pt-2">
                  <Link
                    to="/products"
                    className="text-xs sm:text-sm font-semibold text-blue-600 hover:underline"
                  >
                    ← Continue Shopping
                  </Link>
                  <button
                    onClick={clearCart}
                    className="text-xs text-rose-500 hover:underline"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                  <h3 className="text-base font-bold text-slate-900">Order Summary</h3>

                  {/* Coupon Form */}
                  <form onSubmit={handleApplyCoupon} className="space-y-2">
                    <div className="flex gap-2">
                      <div className="relative flex-grow">
                        <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Coupon (WEATHER20)"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 uppercase focus:outline-blue-500"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition"
                      >
                        Apply
                      </button>
                    </div>
                    {couponMessage && (
                      <p className="text-[11px] font-medium text-blue-600">{couponMessage}</p>
                    )}
                  </form>

                  <div className="space-y-3 text-xs sm:text-sm border-t border-slate-100 pt-4">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal</span>
                      <span className="font-semibold text-slate-900">₹{subtotal.toLocaleString()}</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-medium">
                        <span>Discount (20%)</span>
                        <span>-₹{discount.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-slate-600">
                      <span>Estimated Shipping</span>
                      <span>
                        {deliveryFee === 0 ? (
                          <span className="text-emerald-600 font-semibold">FREE</span>
                        ) : (
                          `₹${deliveryFee}`
                        )}
                      </span>
                    </div>

                    <div className="border-t border-slate-100 pt-3 flex justify-between text-base font-bold text-slate-900">
                      <span>Grand Total</span>
                      <span className="text-lg text-blue-600">₹{finalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  <Link
                    to="/checkout"
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-blue-700 transition"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={16} />
                  </Link>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-2">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span>Secure SSL 256-Bit Checkout</span>
                  </div>
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
