import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, ShoppingCart, Trash2, ArrowLeft,
  Star, CloudRain, Package, ArrowRight,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

export default function Wishlist() {
  const { wishlist, removeFromWishlist, addToCart, cart } = useCart();

  const inCart = (id) => cart.some((c) => (c._id || c.id) === id);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 sm:pt-28 pb-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="mb-8">
            <Link to="/products" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition mb-4">
              <ArrowLeft size={16} /> Continue Shopping
            </Link>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-rose-50 flex items-center justify-center">
                <Heart size={22} className="text-rose-500" fill="currentColor" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">My Wishlist</h1>
                <p className="text-sm text-slate-500">
                  {wishlist.length === 0 ? "No items saved yet" : `${wishlist.length} item${wishlist.length > 1 ? "s" : ""} saved`}
                </p>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {wishlist.length === 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center">
              <div className="h-24 w-24 rounded-full bg-rose-50 flex items-center justify-center mb-6">
                <Heart size={40} className="text-rose-300" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Your wishlist is empty</h2>
              <p className="text-slate-500 mb-6 max-w-sm">
                Save products you love and come back to them later — or buy them when the weather is right!
              </p>
              <Link to="/products"
                className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-2xl hover:bg-blue-700 transition">
                Browse Products <ArrowRight size={16} />
              </Link>
            </motion.div>
          )}

          {/* Wishlist Grid */}
          {wishlist.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence>
                {wishlist.map((product) => {
                  const id = product._id || product.id;
                  const discount = product.oldPrice > product.price
                    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
                    : null;
                  const alreadyInCart = inCart(id);

                  return (
                    <motion.div key={id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, x: -20 }}
                      transition={{ duration: 0.25 }}
                      className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                      {/* Image */}
                      <div className="relative overflow-hidden">
                        <Link to={`/products/${id}`}>
                          <img src={product.image} alt={product.name}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={e => { e.target.src = "https://placehold.co/400x300"; }} />
                        </Link>
                        {discount && (
                          <span className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            -{discount}%
                          </span>
                        )}
                        {(product.weatherTags?.[0] || product.weather) && (
                          <span className="absolute top-3 right-3 bg-blue-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm">
                            <CloudRain size={10} /> {product.weatherTags?.[0] || product.weather}
                          </span>
                        )}
                        <button onClick={() => removeFromWishlist(id)}
                          className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-white/90 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition shadow-md">
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{product.category}</span>
                        <Link to={`/products/${id}`}>
                          <h3 className="font-bold text-slate-900 mt-0.5 line-clamp-2 hover:text-blue-600 transition">{product.name}</h3>
                        </Link>

                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="flex items-center gap-0.5 text-amber-400 text-xs font-semibold">
                            <Star size={11} fill="currentColor" /> {product.rating || "4.5"}
                          </span>
                          {product.reviews && <span className="text-[10px] text-slate-400">({product.reviews})</span>}
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-lg font-extrabold text-slate-900">₹{product.price?.toLocaleString()}</span>
                          {product.oldPrice > product.price && (
                            <span className="text-xs text-slate-400 line-through">₹{product.oldPrice?.toLocaleString()}</span>
                          )}
                        </div>

                        {product.stock === 0 ? (
                          <div className="mt-3 flex items-center gap-2 text-xs text-rose-600 font-semibold">
                            <Package size={13} /> Out of Stock
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart({ ...product, id })}
                            className={`mt-3 w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition
                              ${alreadyInCart
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default"
                                : "bg-blue-600 text-white hover:bg-blue-700"}`}
                            disabled={alreadyInCart}>
                            <ShoppingCart size={15} />
                            {alreadyInCart ? "Already in Cart" : "Add to Cart"}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* Move all to cart */}
          {wishlist.length > 1 && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => wishlist.forEach(p => !inCart(p._id || p.id) && addToCart(p))}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 text-white font-semibold text-sm hover:bg-blue-600 transition">
                <ShoppingCart size={16} /> Add All to Cart
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
