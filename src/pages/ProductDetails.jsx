import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  CloudRain,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
} from "lucide-react";

import { products } from "../data/products";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { behaviorApi } from "../services/behaviorApi";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart, toggleWishlist, isWishlisted } = useCart();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  const [quantity, setQuantity] = useState(1);

  // Track product view for personalized recommendations
  useEffect(() => {
    if (product?.id) {
      // Use string id as productId for tracking
      // Backend gracefully handles missing productId in MongoDB
      behaviorApi.viewProduct(String(product.id));
    }
  }, [product?.id]);

  if (!product) {
    return <ProductNotFound />;
  }

  const liked = isWishlisted(product.id);

  const discount = Math.round(
    ((product.oldPrice - product.price) / product.oldPrice) * 100
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-24 sm:pt-28">

        {/* BREADCRUMB */}
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950"
          >
            <ArrowLeft size={16} />
            Back to Products
          </Link>
        </div>

        {/* PRODUCT */}
        <section className="px-4 pb-16 pt-4 sm:px-6 lg:px-8 lg:pb-24">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:gap-14">

            {/* IMAGE */}
            <ProductImage
              product={product}
              liked={liked}
              setLiked={() => {
                toggleWishlist(product);
                // Track wishlist action for personalized recommendations
                if (!liked) {
                  behaviorApi.wishlist(String(product.id));
                }
              }}
              discount={discount}
            />

            {/* DETAILS */}
            <ProductInfo
              product={product}
              quantity={quantity}
              setQuantity={setQuantity}
              discount={discount}
              onAddToCart={() => addToCart(product, quantity)}
            />
          </div>
        </section>

        {/* TRUST */}
        <TrustSection />

        {/* AI EXPLANATION */}
        <AIExplanation product={product} />

        {/* RELATED PRODUCTS */}
        <RelatedProducts currentId={product.id} />
      </main>

      <Footer />
    </div>
  );
}

/* ---------------- IMAGE ---------------- */

function ProductImage({
  product,
  liked,
  setLiked,
  discount,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -25 }}
      animate={{ opacity: 1, x: 0 }}
      className="lg:sticky lg:top-28 lg:self-start"
    >
      <div className="relative overflow-hidden rounded-3xl bg-slate-100">

        <img
          src={product.image}
          alt={product.name}
          className="aspect-square w-full object-cover transition duration-700 hover:scale-105"
        />

        <div className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-bold shadow-sm">
          {discount}% OFF
        </div>

        <button
          onClick={() => setLiked(!liked)}
          aria-label="Wishlist"
          className={`absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110 ${
            liked ? "text-red-500" : "text-slate-700"
          }`}
        >
          <Heart
            size={20}
            fill={liked ? "currentColor" : "none"}
          />
        </button>

        {/* WEATHER MATCH */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-slate-950/85 px-4 py-2 text-xs font-semibold text-white backdrop-blur">
          <CloudRain size={15} />
          {product.match}% Weather Match
        </div>
      </div>
    </motion.div>
  );
}

/* ---------------- PRODUCT INFO ---------------- */

function ProductInfo({
  product,
  quantity,
  setQuantity,
  discount,
  onAddToCart,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 25 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
    >
      <p className="text-sm font-semibold text-blue-600">
        {product.category}
      </p>

      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
        {product.name}
      </h1>

      {/* RATING */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700">
          <Star size={15} fill="currentColor" />
          {product.rating}
        </div>

        <span className="text-sm text-slate-500">
          {product.reviews} customer reviews
        </span>
      </div>

      {/* PRICE */}
      <div className="mt-7 flex flex-wrap items-center gap-3">
        <span className="text-3xl font-extrabold text-slate-950">
          ₹{product.price.toLocaleString("en-IN")}
        </span>

        <span className="text-lg text-slate-400 line-through">
          ₹{product.oldPrice.toLocaleString("en-IN")}
        </span>

        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
          Save {discount}%
        </span>
      </div>

      <div className="my-7 h-px bg-slate-200" />

      {/* AI MATCH */}
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Sparkles size={19} />
          </div>

          <div>
            <p className="text-sm font-bold text-blue-950">
              Why AI recommends this
            </p>

            <p className="mt-1 text-sm leading-6 text-blue-800/80">
              This product matches your current weather conditions
              and location-based shopping context.
            </p>
          </div>
        </div>
      </div>

      {/* WEATHER */}
      <div className="mt-5 rounded-2xl border border-slate-200 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
            <CloudRain size={19} />
          </div>

          <div>
            <p className="text-xs text-slate-500">
              Current conditions
            </p>

            <p className="mt-1 text-sm font-bold text-slate-950">
              {product.weather} • 24°C
            </p>
          </div>

          <span className="ml-auto text-sm font-extrabold text-blue-600">
            {product.match}%
          </span>
        </div>
      </div>

      {/* LOCATION */}
      <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
        <MapPin size={16} />
        Personalized for your current location
      </div>

      {/* QUANTITY */}
      <div className="mt-8">
        <p className="text-sm font-bold text-slate-900">
          Quantity
        </p>

        <div className="mt-3 flex w-fit items-center overflow-hidden rounded-xl border border-slate-200">
          <button
            onClick={() =>
              setQuantity((value) => Math.max(1, value - 1))
            }
            className="p-3 transition hover:bg-slate-100"
          >
            <Minus size={16} />
          </button>

          <span className="min-w-12 text-center text-sm font-bold">
            {quantity}
          </span>

          <button
            onClick={() => setQuantity((value) => value + 1)}
            className="p-3 transition hover:bg-slate-100"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="mt-7 grid gap-3 min-[430px]:grid-cols-2">
        <button
          onClick={onAddToCart}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-4 text-sm font-bold text-white transition hover:bg-slate-800 active:scale-[0.98]"
        >
          <ShoppingCart size={18} />
          Add to Cart
        </button>

        <button className="rounded-xl border border-slate-950 px-5 py-4 text-sm font-bold text-slate-950 transition hover:bg-slate-950 hover:text-white active:scale-[0.98]">
          Buy Now
        </button>
      </div>

      {/* BENEFITS */}
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Benefit
          icon={Truck}
          title="Fast Delivery"
          text="Quick shipping"
        />

        <Benefit
          icon={ShieldCheck}
          title="Secure Payment"
          text="100% protected"
        />

        <Benefit
          icon={RotateCcw}
          title="Easy Returns"
          text="Simple returns"
        />
      </div>
    </motion.div>
  );
}

/* ---------------- BENEFIT ---------------- */

function Benefit({ icon: Icon, title, text }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <Icon size={18} className="text-slate-700" />

      <p className="mt-3 text-xs font-bold text-slate-950">
        {title}
      </p>

      <p className="mt-1 text-[11px] text-slate-500">
        {text}
      </p>
    </div>
  );
}

/* ---------------- TRUST ---------------- */

function TrustSection() {
  const items = [
    ["Secure Shopping", "Protected checkout"],
    ["Quality Products", "Carefully selected"],
    ["Smart Recommendations", "AI-powered discovery"],
    ["Customer Support", "We're here to help"],
  ];

  return (
    <section className="border-y border-slate-200 bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 md:grid-cols-4">
        {items.map(([title, text]) => (
          <div key={title} className="text-center">
            <p className="text-sm font-bold text-slate-950">
              {title}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- AI EXPLANATION ---------------- */

function AIExplanation({ product }) {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl bg-slate-950 p-6 text-white sm:p-8 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">

            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold">
                <Sparkles size={14} />
                AI INSIGHT
              </div>

              <h2 className="mt-5 text-2xl font-bold sm:text-3xl lg:text-4xl">
                Why this product fits your current context
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                WeatherCart evaluates contextual signals such as
                weather, location and product attributes to create
                relevant recommendations.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <AIStat
                label="Weather Match"
                value={`${product.match}%`}
              />

              <AIStat
                label="Location Context"
                value="Relevant"
              />

              <AIStat
                label="Recommendation"
                value="Personalized"
              />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

function AIStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-lg font-bold">
        {value}
      </p>
    </div>
  );
}

/* ---------------- RELATED ---------------- */

function RelatedProducts({ currentId }) {
  const related = products
    .filter((product) => product.id !== currentId)
    .slice(0, 3);

  return (
    <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">

        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
            You May Also Like
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-950">
            Related Products
          </h2>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 min-[380px]:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {related.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- NOT FOUND ---------------- */

function ProductNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <h1 className="text-3xl font-bold">
        Product Not Found
      </h1>

      <p className="mt-3 text-sm text-slate-500">
        The product you're looking for doesn't exist.
      </p>

      <Link
        to="/products"
        className="mt-6 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white"
      >
        Back to Products
      </Link>
    </div>
  );
}
