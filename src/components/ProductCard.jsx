import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart,
  ShoppingCart,
  Star,
  CloudRain,
  Sun,
  Check,
} from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const [added, setAdded] = useState(false);

  const productId = product._id || product.id;
  const isWishlisted = wishlist?.some((item) => (item._id || item.id) === productId);

  const handleAdd = (e) => {
    e.preventDefault();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const discountPercent =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.4 }}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-slate-900/10 flex flex-col justify-between"
    >
      {/* Image */}
      <div>
        <Link
          to={`/products/${productId}`}
          className="block"
        >
          <div className="relative aspect-[4/4.2] overflow-hidden bg-slate-100">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />

            {/* Discount */}
            {discountPercent && (
              <div className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-900 shadow-sm">
                {discountPercent}% OFF
              </div>
            )}

            {/* Wishlist */}
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleWishlist(product);
              }}
              aria-label={`Toggle wishlist for ${product.name}`}
              className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:scale-110 hover:bg-white ${
                isWishlisted ? "text-red-500 fill-red-500" : "text-slate-700"
              }`}
            >
              <Heart size={17} fill={isWishlisted ? "currentColor" : "none"} />
            </button>

            {/* Weather Match */}
            {product.match && (
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-slate-950/85 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
                {product.weather === "Rain" ? (
                  <CloudRain size={13} />
                ) : (
                  <Sun size={13} />
                )}
                {product.match}% match
              </div>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="p-4 sm:p-5">
          <p className="text-xs font-medium text-slate-500">
            {product.category}
          </p>

          <Link
            to={`/products/${productId}`}
            className="mt-1 block line-clamp-2 min-h-10 text-sm font-bold text-slate-950 hover:underline sm:text-base"
          >
            {product.name}
          </Link>

          {/* Rating */}
          <div className="mt-3 flex items-center gap-1.5">
            <div className="flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">
              <Star size={12} fill="currentColor" />
              {product.rating}
            </div>

            <span className="text-xs text-slate-400">
              ({product.reviews || 0})
            </span>
          </div>

          {/* Price */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-lg font-extrabold text-slate-950">
              ₹{product.price.toLocaleString("en-IN")}
            </span>

            {product.oldPrice && (
              <span className="text-xs text-slate-400 line-through">
                ₹{product.oldPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 pt-0 sm:p-5 sm:pt-0">
        {/* Add Cart */}
        <button
          onClick={handleAdd}
          className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition active:scale-[0.98] ${
            added
              ? "bg-emerald-600 text-white"
              : "bg-slate-950 text-white hover:bg-slate-800"
          }`}
        >
          {added ? (
            <>
              <Check size={17} /> Added to Cart
            </>
          ) : (
            <>
              <ShoppingCart size={17} /> Add to Cart
            </>
          )}
        </button>
      </div>
    </motion.article>
  );
}
