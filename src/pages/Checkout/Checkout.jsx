import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ShieldCheck, CreditCard, Banknote, Truck, ArrowRight, Package } from "lucide-react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/layout/Footer";
import { useCart } from "../../context/CartContext";

export default function Checkout() {
  const { cartItems, grandTotal, subtotal, deliveryFee, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isOrdered, setIsOrdered] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const [formData, setFormData] = useState({
    name: "Vikas Pal",
    email: "vikas@example.com",
    phone: "+91 98765 43210",
    address: "B-402, Titanium City Centre, Prahlad Nagar",
    city: "Ahmedabad",
    state: "Gujarat",
    pincode: "380015"
  });

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const newId = "#ORD-" + Math.floor(1000 + Math.random() * 9000);
    setOrderId(newId);
    setIsOrdered(true);
    clearCart();
  };

  if (isOrdered) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-grow pt-28 pb-16 flex items-center justify-center px-4">
          <div className="max-w-lg w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-5">
              <CheckCircle2 size={40} />
            </div>

            <h1 className="text-2xl font-bold text-slate-900">Order Confirmed!</h1>
            <p className="mt-1 text-xs text-slate-500">
              Thank you for shopping with WeatherCart. Your weather-tailored essentials are being prepared.
            </p>

            <div className="my-6 rounded-2xl bg-slate-50 p-4 text-xs space-y-2 border border-slate-200">
              <div className="flex justify-between font-medium">
                <span className="text-slate-500">Order ID:</span>
                <span className="font-bold text-slate-900">{orderId}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-500">Payment:</span>
                <span className="uppercase text-slate-900 font-bold">{paymentMethod}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-500">Estimated Delivery:</span>
                <span className="text-emerald-600 font-semibold">2 - 3 Days</span>
              </div>
            </div>

            {/* Order Progress Timeline */}
            <div className="my-6 text-left">
              <p className="text-xs font-bold text-slate-900 mb-3">Live Order Tracking:</p>
              <div className="space-y-4">
                {[
                  { title: "Order Placed", time: "Just now", done: true },
                  { title: "Packed at Regional Hub", time: "Processing", done: true },
                  { title: "Shipped with Weather-Proof Seal", time: "Pending", done: false },
                  { title: "Out for Delivery", time: "Pending", done: false },
                ].map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs">
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                      step.done ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-500"
                    }`}>
                      {step.done ? "✓" : idx + 1}
                    </div>
                    <div className="flex-grow flex justify-between">
                      <span className={step.done ? "font-semibold text-slate-900" : "text-slate-400"}>
                        {step.title}
                      </span>
                      <span className="text-[11px] text-slate-400">{step.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link
              to="/products"
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3 text-xs font-semibold text-white hover:bg-blue-600 transition"
            >
              <span>Continue Shopping</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 sm:pt-28 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Checkout & Delivery
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Complete your shipping address and select payment mode
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Shipping Details Form */}
            <div className="lg:col-span-2 space-y-6">
              <form onSubmit={handlePlaceOrder} id="checkout-form" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Truck size={18} className="text-blue-600" />
                  <span>1. Shipping Address</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm focus:outline-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Contact Phone</label>
                    <input
                      type="text"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm focus:outline-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm focus:outline-blue-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs sm:text-sm focus:outline-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">State</label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs sm:text-sm focus:outline-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Pincode</label>
                    <input
                      type="text"
                      required
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs sm:text-sm focus:outline-blue-500"
                    />
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="pt-6 border-t border-slate-100">
                  <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <CreditCard size={18} className="text-blue-600" />
                    <span>2. Payment Option</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label
                      onClick={() => setPaymentMethod("cod")}
                      className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition ${
                        paymentMethod === "cod"
                          ? "border-blue-600 bg-blue-50/50"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="accent-blue-600"
                      />
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                          <Banknote size={16} className="text-emerald-600" />
                          <span>Cash on Delivery</span>
                        </p>
                        <p className="text-[10px] text-slate-500">Pay when delivered at doorstep</p>
                      </div>
                    </label>

                    <label
                      onClick={() => setPaymentMethod("online")}
                      className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition ${
                        paymentMethod === "online"
                          ? "border-blue-600 bg-blue-50/50"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "online"}
                        onChange={() => setPaymentMethod("online")}
                        className="accent-blue-600"
                      />
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                          <CreditCard size={16} className="text-blue-600" />
                          <span>Demo Online / UPI</span>
                        </p>
                        <p className="text-[10px] text-slate-500">UPI, Cards, NetBanking (Instant Demo)</p>
                      </div>
                    </label>
                  </div>
                </div>
              </form>
            </div>

            {/* Checkout Summary */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900">Order Items ({cartItems.length})</h3>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <img src={item.image} alt={item.name} className="h-10 w-10 rounded-xl object-cover" />
                        <div>
                          <p className="font-semibold text-slate-800 line-clamp-1 max-w-[150px]">{item.name}</p>
                          <p className="text-slate-400">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Delivery</span>
                    <span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-slate-100">
                    <span>Total Payable</span>
                    <span className="text-blue-600 text-base">₹{grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  form="checkout-form"
                  className="w-full py-3.5 bg-blue-600 text-white rounded-2xl text-xs sm:text-sm font-bold hover:bg-blue-700 transition shadow-lg"
                >
                  Place Order • ₹{grandTotal.toLocaleString()}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
