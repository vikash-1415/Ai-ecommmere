import React from "react";
import { Link } from "react-router-dom";
import { Heart, Star, ShoppingBag, Check } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useWeather } from "../../context/WeatherContext";
import { useAuth } from "../../context/AuthContext";

export default function ProductCard({ product }) {
  const { addToCart, cartItems } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { calculateProductScore, weatherData } = useWeather();
  const { user } = useAuth();

  const isFavorited = isInWishlist(product.id);
  const isInCart = cartItems.some((item) => item.id === product.id);

  // Compute real-time AI match score based on current active weather & user prefs
  const aiScore = calculateProductScore(product, user?.categoryPreferences || []);
  const isHighMatch = aiScore >= 85;

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-white p-3 sm:p-4 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-blue-200">
      <div>
        {/* Product Image Container */}
        <div className="relative aspect-[4/4] sm:aspect-[4/4.2] w-full overflow-hidden rounded-xl sm:rounded-2xl bg-slate-100">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 md:group-hover:scale-105"
          />

          {/* Heart / Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product);
            }}
            aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
            className={`absolute top-2.5 right-2.5 sm:top-3 sm:right-3 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full backdrop-blur-md transition ${
              isFavorited
                ? "bg-rose-50 text-rose-500 shadow-md"
                : "bg-white/80 text-slate-600 hover:bg-white hover:text-rose-500"
            }`}
          >
            <Heart size={16} className={isFavorited ? "fill-rose-500" : ""} />
          </button>

          {/* AI Match Badge */}
          <div
            className={`absolute bottom-2 left-2 sm:bottom-3 sm:left-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] sm:text-xs font-bold backdrop-blur-md shadow-sm ${
              isHighMatch
                ? "bg-slate-950/85 text-cyan-300 border border-cyan-400/30"
                : "bg-slate-900/75 text-slate-200"
            }`}
          >
            <span>{product.weatherTagLabel?.split(" ")[0] || "✨"}</span>
            <span>{aiScore}% Match</span>
          </div>

          {/* Rating Badge */}
          <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] sm:text-xs font-bold text-slate-800 backdrop-blur-md">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span>{product.rating}</span>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-3 sm:mt-4 space-y-1 sm:space-y-1.5">
          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-slate-400">
            <span className="font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
              {product.category}
            </span>
            <span>•</span>
            <span className="capitalize">{product.season}</span>
          </div>

          <Link to={`/products`}>
            <h3 className="text-xs sm:text-sm font-semibold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition">
              {product.name}
            </h3>
          </Link>

          <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-1 hidden sm:block">
            {product.description}
          </p>
        </div>
      </div>

      {/* Pricing & Add to Cart Action */}
      <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div>
          <span className="text-sm sm:text-base font-bold text-slate-900">
            ₹{product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="ml-1.5 text-[10px] sm:text-xs text-slate-400 line-through hidden min-[360px]:inline">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        <button
          onClick={() => addToCart(product)}
          className={`flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold transition active:scale-95 ${
            isInCart
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "bg-slate-900 text-white hover:bg-blue-600"
          }`}
        >
          {isInCart ? (
            <>
              <Check size={14} />
              <span className="hidden min-[420px]:inline">Added</span>
            </>
          ) : (
            <>
              <ShoppingBag size={14} />
              <span>Add</span>
              <span className="hidden min-[440px]:inline">to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
