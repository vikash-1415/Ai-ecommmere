import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const {
    cart,
    subtotal,
    shipping,
    total,
    updateQuantity,
    removeFromCart,
  } = useCart();

  if (cart.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-950"
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>

          <div className="mt-6">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
              Shopping Cart
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">
              Your Cart
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {cart.length} unique product
              {cart.length !== 1 ? "s" : ""} in your cart.
            </p>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">

            {/* ITEMS */}
            <div className="space-y-4">
              {cart.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.05,
                  }}
                  className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"
                >
                  <div className="flex gap-4">

                    <Link
                      to={`/products/${item.id}`}
                      className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-32 sm:w-32"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                      />
                    </Link>

                    <div className="min-w-0 flex-1">

                      <div className="flex justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold text-blue-600">
                            {item.category}
                          </p>

                          <Link
                            to={`/products/${item.id}`}
                            className="mt-1 block line-clamp-2 text-sm font-bold text-slate-950 sm:text-base"
                          >
                            {item.name}
                          </Link>
                        </div>

                        <button
                          onClick={() =>
                            removeFromCart(item.id)
                          }
                          className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                          aria-label="Remove item"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">

                        <div className="flex items-center overflow-hidden rounded-lg border border-slate-200">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.quantity - 1
                              )
                            }
                            className="p-2.5 transition hover:bg-slate-100"
                          >
                            <Minus size={14} />
                          </button>

                          <span className="min-w-9 text-center text-sm font-bold">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.quantity + 1
                              )
                            }
                            className="p-2.5 transition hover:bg-slate-100"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <p className="text-lg font-extrabold text-slate-950">
                          ₹
                          {(
                            item.price * item.quantity
                          ).toLocaleString("en-IN")}
                        </p>

                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* SUMMARY */}
            <OrderSummary
              subtotal={subtotal}
              shipping={shipping}
              total={total}
            />

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

/* SUMMARY */

function OrderSummary({
  subtotal,
  shipping,
  total,
}) {
  return (
    <div className="lg:sticky lg:top-28 lg:self-start">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">

        <h2 className="text-lg font-bold">
          Order Summary
        </h2>

        <div className="mt-6 space-y-4 text-sm">

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
              {shipping === 0
                ? "FREE"
                : `₹${shipping}`}
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

        {shipping > 0 && (
          <div className="mt-5 flex gap-2 rounded-xl bg-blue-50 p-3 text-xs font-medium text-blue-800">
            <Truck size={15} className="shrink-0" />
            Add ₹
            {(999 - subtotal).toLocaleString("en-IN")}
            {" "}more for free shipping.
          </div>
        )}

        <Link
          to="/checkout"
          className="mt-6 flex w-full items-center justify-center rounded-xl bg-slate-950 py-4 text-sm font-bold text-white transition hover:bg-slate-800"
        >
          Proceed to Checkout
        </Link>

        <p className="mt-4 text-center text-[11px] text-slate-400">
          Secure checkout • Protected payment
        </p>
      </div>
    </div>
  );
}

/* EMPTY */

function EmptyCart() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex min-h-[75vh] items-center justify-center px-5 pt-20">
        <div className="max-w-md text-center">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-sm">
            <ShoppingBag
              size={32}
              className="text-slate-400"
            />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-950">
            Your cart is empty
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Discover products personalized for your
            weather and shopping context.
          </p>

          <Link
            to="/products"
            className="mt-7 inline-flex rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-bold text-white"
          >
            Start Shopping
          </Link>

        </div>
      </main>

      <Footer />
    </div>
  );
}
