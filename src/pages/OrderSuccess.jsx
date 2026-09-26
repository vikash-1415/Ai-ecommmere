import { Link, useParams } from "react-router-dom";
import {
  Check,
  PackageCheck,
  ShoppingBag,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function OrderSuccess() {
  const { orderId } = useParams();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex min-h-[75vh] items-center justify-center px-5 pb-16 pt-28">
        <div className="w-full max-w-xl text-center">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white">
              <Check size={25} strokeWidth={3} />
            </div>
          </div>

          <p className="mt-7 text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
            Order Confirmed
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">
            Thank you for your order!
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-500">
            Your order has been successfully placed.
            We'll keep you updated about its delivery.
          </p>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-xs text-slate-500">
              Order ID
            </p>

            <p className="mt-1 text-xl font-extrabold tracking-wide">
              {orderId}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <PackageCheck
                  size={20}
                  className="mx-auto text-slate-700"
                />

                <p className="mt-2 text-xs font-bold">
                  Order Processing
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <ShoppingBag
                  size={20}
                  className="mx-auto text-slate-700"
                />

                <p className="mt-2 text-xs font-bold">
                  Items Reserved
                </p>
              </div>
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/products"
              className="rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Continue Shopping
            </Link>

            <Link
              to="/"
              className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
            >
              Back to Home
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
