import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  CreditCard,
  Lock,
  MapPin,
  Plus,
  Truck,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

export default function Checkout() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const {
    cart,
    subtotal,
    shipping,
    total,
    clearCart,
  } = useCart();

  const [payment, setPayment] = useState("cod");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [address, setAddress] = useState({
    name: user?.name || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  if (cart.length === 0) {
    return <EmptyCheckout />;
  }

  const updateField = (field, value) => {
    setAddress((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const placeOrder = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    if (
      !address.name ||
      !address.phone ||
      !address.address ||
      !address.city ||
      !address.state ||
      !address.pincode
    ) {
      setError("Please fill all delivery details.");
      return;
    }

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
        paymentMethod: payment,
      };

      const res = await api.createOrder(orderData);
      const createdOrder = res.order;

      localStorage.setItem(
        "weathercart-last-order",
        JSON.stringify(createdOrder)
      );

      clearCart();

      const targetId = createdOrder.orderNumber || createdOrder._id;
      navigate(`/order-success/${targetId}`);
    } catch (err) {
      setError(err.message || "Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
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
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-950"
            >
              <ArrowLeft size={16} />
              Back to Cart
            </Link>

            <h1 className="mt-5 text-3xl font-bold text-slate-950 sm:text-4xl">
              Checkout
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Complete your delivery and payment details.
            </p>
          </div>

          {/* STEPS */}
          <CheckoutSteps />

          {!isAuthenticated && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-blue-200 bg-blue-50 p-4 sm:p-5 text-blue-900">
              <div>
                <p className="font-bold text-sm">Account Required for Checkout</p>
                <p className="text-xs text-blue-700 mt-0.5">Please sign in to save your order to your account and track delivery status.</p>
              </div>
              <Link
                to="/login"
                state={{ from: "/checkout" }}
                className="shrink-0 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700"
              >
                Sign In to Continue
              </Link>
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700">
              {error}
            </div>
          )}

          <form
            id="checkout-form"
            onSubmit={placeOrder}
            className="mt-8 grid gap-8 lg:grid-cols-[1fr_390px]"
          >
            {/* LEFT */}
            <div className="space-y-6">

              {/* DELIVERY */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">

                <SectionHeading
                  icon={MapPin}
                  title="Delivery Address"
                  subtitle="Where should we deliver your order?"
                />

                <div className="mt-6 grid gap-4 sm:grid-cols-2">

                  <Input
                    label="Full Name"
                    value={address.name}
                    onChange={(value) =>
                      updateField("name", value)
                    }
                    placeholder="Enter your name"
                  />

                  <Input
                    label="Phone Number"
                    value={address.phone}
                    onChange={(value) =>
                      updateField("phone", value)
                    }
                    placeholder="10-digit mobile number"
                    type="tel"
                  />

                  <div className="sm:col-span-2">
                    <Input
                      label="Address"
                      value={address.address}
                      onChange={(value) =>
                        updateField("address", value)
                      }
                      placeholder="House no., street, area"
                    />
                  </div>

                  <Input
                    label="City"
                    value={address.city}
                    onChange={(value) =>
                      updateField("city", value)
                    }
                    placeholder="Ahmedabad"
                  />

                  <Input
                    label="State"
                    value={address.state}
                    onChange={(value) =>
                      updateField("state", value)
                    }
                    placeholder="Gujarat"
                  />

                  <Input
                    label="PIN Code"
                    value={address.pincode}
                    onChange={(value) =>
                      updateField("pincode", value)
                    }
                    placeholder="380001"
                    type="text"
                  />

                </div>
              </section>

              {/* DELIVERY OPTION */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">

                <SectionHeading
                  icon={Truck}
                  title="Delivery Method"
                  subtitle="Choose how you'd like to receive your order."
                />

                <div className="mt-6 rounded-xl border-2 border-slate-950 bg-slate-50 p-4">
                  <div className="flex items-center gap-4">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white">
                      <Truck size={19} />
                    </div>

                    <div>
                      <p className="text-sm font-bold">
                        Standard Delivery
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Estimated delivery in 3–5 business days
                      </p>
                    </div>

                    <div className="ml-auto text-sm font-bold">
                      {shipping === 0
                        ? "FREE"
                        : `₹${shipping}`}
                    </div>
                  </div>
                </div>
              </section>

              {/* PAYMENT */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">

                <SectionHeading
                  icon={CreditCard}
                  title="Payment Method"
                  subtitle="Select your preferred payment method."
                />

                <div className="mt-6 space-y-3">

                  <PaymentOption
                    value="cod"
                    selected={payment}
                    onChange={setPayment}
                    title="Cash on Delivery"
                    description="Pay when your order arrives."
                  />

                  <PaymentOption
                    value="online"
                    selected={payment}
                    onChange={setPayment}
                    title="Online Payment"
                    description="UPI, cards and net banking."
                  />

                </div>

                {payment === "online" && (
                  <div className="mt-4 rounded-xl bg-blue-50 p-4 text-xs leading-6 text-blue-800">
                    Payment gateway will be connected in the backend
                    integration stage.
                  </div>
                )}

              </section>
            </div>

            {/* RIGHT */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <OrderSummary
                cart={cart}
                subtotal={subtotal}
                shipping={shipping}
                total={total}
                payment={payment}
                submitting={submitting}
              />

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
                <Lock size={13} />
                Your checkout is secure
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

/* CHECKOUT STEPS */

function CheckoutSteps() {
  return (
    <div className="mt-8 hidden items-center sm:flex">
      <Step number="1" title="Cart" done />
      <Line />
      <Step number="2" title="Checkout" active />
      <Line />
      <Step number="3" title="Confirmation" />
    </div>
  );
}

function Step({ number, title, done, active }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
          done
            ? "bg-emerald-500 text-white"
            : active
            ? "bg-slate-950 text-white"
            : "bg-slate-200 text-slate-500"
        }`}
      >
        {done ? <Check size={14} /> : number}
      </div>

      <span
        className={`text-xs font-bold ${
          active || done
            ? "text-slate-950"
            : "text-slate-400"
        }`}
      >
        {title}
      </span>
    </div>
  );
}

function Line() {
  return (
    <div className="mx-4 h-px w-16 bg-slate-200" />
  );
}

/* SECTION HEADING */

function SectionHeading({
  icon: Icon,
  title,
  subtitle,
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
        <Icon size={18} />
      </div>

      <div>
        <h2 className="text-base font-bold text-slate-950">
          {title}
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

/* INPUT */

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-slate-700">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/5"
      />
    </label>
  );
}

/* PAYMENT */

function PaymentOption({
  value,
  selected,
  onChange,
  title,
  description,
}) {
  const active = selected === value;

  return (
    <label
      className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition ${
        active
          ? "border-slate-950 bg-slate-50"
          : "border-slate-200 hover:border-slate-300"
      }`}
    >
      <input
        type="radio"
        name="payment"
        checked={active}
        onChange={() => onChange(value)}
        className="accent-slate-950"
      />

      <div>
        <p className="text-sm font-bold">
          {title}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>
      </div>
    </label>
  );
}

/* SUMMARY */

function OrderSummary({
  cart,
  subtotal,
  shipping,
  total,
  payment,
  submitting,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">

      <h2 className="text-lg font-bold">
        Order Summary
      </h2>

      <div className="mt-5 max-h-64 space-y-4 overflow-y-auto pr-1">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex gap-3"
          >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover"
              />

              <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-950 px-1 text-[10px] font-bold text-white">
                {item.quantity}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-xs font-bold">
                {item.name}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                ₹{item.price.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="my-5 h-px bg-slate-200" />

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500">
            Subtotal
          </span>

          <span className="font-semibold">
            ₹{subtotal.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">
            Shipping
          </span>

          <span className="font-semibold">
            {shipping === 0 ? "FREE" : `₹${shipping}`}
          </span>
        </div>

        <div className="h-px bg-slate-200" />

        <div className="flex justify-between">
          <span className="font-bold">
            Total
          </span>

          <span className="text-xl font-extrabold">
            ₹{total.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      <button
        type="submit"
        form="checkout-form"
        disabled={submitting}
        className="mt-6 w-full rounded-xl bg-slate-950 py-4 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Placing Order..." : "Place Order"}
      </button>

      <p className="mt-3 text-center text-[11px] text-slate-400">
        Payment:{" "}
        {payment === "cod"
          ? "Cash on Delivery"
          : "Online Payment"}
      </p>
    </div>
  );
}

/* EMPTY */

function EmptyCheckout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex min-h-[70vh] items-center justify-center px-5 pt-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Your cart is empty
          </h1>

          <Link
            to="/products"
            className="mt-6 inline-flex rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white"
          >
            Browse Products
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
