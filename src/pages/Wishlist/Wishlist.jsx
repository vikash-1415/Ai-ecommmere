import React from "react";
import { Link } from "react-router-dom";
import { Heart, ArrowRight, ShoppingBag } from "lucide-react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/layout/Footer";
import ProductCard from "../../components/products/ProductCard";
import { useWishlist } from "../../context/WishlistContext";

export default function Wishlist() {
  const { wishlist } = useWishlist();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 sm:pt-28 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Heart className="fill-rose-500 text-rose-500" size={28} />
              <span>My Wishlist ({wishlist.length})</span>
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Saved items tailored to your favorite weather conditions
            </p>
          </div>

          {wishlist.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm max-w-lg mx-auto">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 mb-4">
                <Heart size={32} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Your wishlist is empty</h2>
              <p className="mt-1 text-xs text-slate-500 max-w-xs mx-auto">
                Tap the heart icon on any product to save items for future weather forecasts.
              </p>
              <Link
                to="/products"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-blue-600 transition"
              >
                <span>Discover Products</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 min-[380px]:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {wishlist.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
