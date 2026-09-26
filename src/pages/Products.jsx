import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  RotateCcw,
} from "lucide-react";

import { products as localProducts } from "../data/products";
import { api } from "../services/api";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const categories = [
  "All",
  "Fashion",
  "Accessories",
  "Footwear",
  "Electronics",
  "Home",
  "Sports",
];

const weatherOptions = [
  "All",
  "Rain",
  "Sunny",
  "Cold",
  "Cloudy",
];

export default function Products() {
  const [productsList, setProductsList] = useState(localProducts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [weather, setWeather] = useState("All");
  const [rating, setRating] = useState("All");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sort, setSort] = useState("featured");
  const [mobileFilters, setMobileFilters] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const data = await api.getProducts();

        if (data.products && data.products.length > 0) {
          setProductsList(data.products);
        }
      } catch (err) {
        console.warn("Backend API notice:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...productsList];

    // Search
    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      );
    }

    // Category
    if (category !== "All") {
      result = result.filter(
        (product) => product.category === category
      );
    }

    // Weather
    if (weather !== "All") {
      result = result.filter(
        (product) => product.weather === weather
      );
    }

    // Rating
    if (rating !== "All") {
      result = result.filter(
        (product) => product.rating >= Number(rating)
      );
    }

    // Price
    result = result.filter(
      (product) => product.price <= maxPrice
    );

    // Sorting
    if (sort === "price-low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sort === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    if (sort === "discount") {
      result.sort((a, b) => {
        const discountA =
          ((a.oldPrice - a.price) / a.oldPrice) * 100;

        const discountB =
          ((b.oldPrice - b.price) / b.oldPrice) * 100;

        return discountB - discountA;
      });
    }

    return result;
  }, [
    search,
    category,
    weather,
    rating,
    maxPrice,
    sort,
  ]);

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setWeather("All");
    setRating("All");
    setMaxPrice(5000);
    setSort("featured");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-28">

        {/* HEADER */}
        <section className="border-b border-slate-200 bg-white px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                Explore Store
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                All Products
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                Find products personalized to your preferences,
                budget and current weather.
              </p>
            </motion.div>

            {/* SEARCH */}
            <div className="mt-8 max-w-3xl">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-slate-400 focus-within:bg-white">
                <Search
                  size={19}
                  className="shrink-0 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products, categories..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />

                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="rounded-full p-1 hover:bg-slate-200"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* CONTENT */}
        <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="mx-auto max-w-7xl">

            {/* MOBILE FILTER BUTTON */}
            <div className="mb-5 flex items-center justify-between lg:hidden">

              <button
                onClick={() => setMobileFilters(true)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold shadow-sm"
              >
                <SlidersHorizontal size={17} />
                Filters
              </button>

              <SortSelect
                sort={sort}
                setSort={setSort}
              />

            </div>

            <div className="grid gap-8 lg:grid-cols-[240px_1fr]">

              {/* DESKTOP FILTERS */}
              <aside className="hidden lg:block">
                <FilterPanel
                  category={category}
                  setCategory={setCategory}
                  weather={weather}
                  setWeather={setWeather}
                  rating={rating}
                  setRating={setRating}
                  maxPrice={maxPrice}
                  setMaxPrice={setMaxPrice}
                  resetFilters={resetFilters}
                />
              </aside>

              {/* PRODUCTS */}
              <div>

                {/* TOP BAR */}
                <div className="mb-6 hidden items-center justify-between lg:flex">

                  <p className="text-sm text-slate-500">
                    Showing{" "}
                    <span className="font-bold text-slate-900">
                      {filteredProducts.length}
                    </span>{" "}
                    products
                  </p>

                  <SortSelect
                    sort={sort}
                    setSort={setSort}
                  />

                </div>

                {/* ERROR BANNER */}
                {error && (
                  <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-xs text-red-700">
                    {error}
                  </div>
                )}

                {/* GRID */}
                {loading ? (
                  <div className="grid grid-cols-1 gap-4 min-[380px]:grid-cols-2 sm:gap-5 xl:grid-cols-3">
                    {[1, 2, 3, 4].map((item) => (
                      <div
                        key={item}
                        className="animate-pulse overflow-hidden rounded-2xl bg-white border border-slate-200"
                      >
                        <div className="aspect-[4/4.2] bg-slate-200" />
                        <div className="space-y-3 p-4">
                          <div className="h-3 w-20 rounded bg-slate-200" />
                          <div className="h-4 w-3/4 rounded bg-slate-200" />
                          <div className="h-5 w-1/3 rounded bg-slate-200" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredProducts.length > 0 ? (
                  <motion.div
                    layout
                    className="grid grid-cols-1 gap-4 min-[380px]:grid-cols-2 sm:gap-5 xl:grid-cols-3"
                  >
                    <AnimatePresence mode="popLayout">
                      {filteredProducts.map((product) => (
                        <motion.div
                          key={product.id || product._id}
                          layout
                          initial={{
                            opacity: 0,
                            scale: 0.96,
                          }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                          }}
                          exit={{
                            opacity: 0,
                            scale: 0.96,
                          }}
                        >
                          <ProductCard product={product} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <EmptyState
                    resetFilters={resetFilters}
                  />
                )}

              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* MOBILE FILTER DRAWER */}
      <AnimatePresence>
        {mobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilters(false)}
              className="fixed inset-0 z-[60] bg-slate-950/40 backdrop-blur-sm lg:hidden"
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 35,
              }}
              className="fixed inset-x-0 bottom-0 z-[70] max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5 lg:hidden"
            >
              <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-slate-200" />

              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">
                  Filters
                </h2>

                <button
                  onClick={() => setMobileFilters(false)}
                  className="rounded-full bg-slate-100 p-2"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-6">
                <FilterPanel
                  category={category}
                  setCategory={setCategory}
                  weather={weather}
                  setWeather={setWeather}
                  rating={rating}
                  setRating={setRating}
                  maxPrice={maxPrice}
                  setMaxPrice={setMaxPrice}
                  resetFilters={resetFilters}
                />
              </div>

              <button
                onClick={() => setMobileFilters(false)}
                className="mt-6 w-full rounded-xl bg-slate-950 py-3.5 text-sm font-bold text-white"
              >
                Show {filteredProducts.length} Products
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- FILTER PANEL ---------------- */

function FilterPanel({
  category,
  setCategory,
  weather,
  setWeather,
  rating,
  setRating,
  maxPrice,
  setMaxPrice,
  resetFilters,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">

      <div className="flex items-center justify-between">
        <h2 className="font-bold text-slate-950">
          Filters
        </h2>

        <button
          onClick={resetFilters}
          className="flex items-center gap-1 text-xs font-semibold text-blue-600"
        >
          <RotateCcw size={13} />
          Reset
        </button>
      </div>

      {/* CATEGORY */}
      <div className="mt-7">
        <h3 className="text-sm font-bold">
          Category
        </h3>

        <div className="mt-3 space-y-1">
          {categories.map((item) => (
            <label
              key={item}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm hover:bg-slate-50"
            >
              <input
                type="radio"
                name="category"
                checked={category === item}
                onChange={() => setCategory(item)}
                className="accent-slate-950"
              />

              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>

      {/* WEATHER */}
      <div className="mt-7 border-t border-slate-100 pt-6">
        <h3 className="text-sm font-bold">
          Weather
        </h3>

        <div className="mt-3 flex flex-wrap gap-2">
          {weatherOptions.map((item) => (
            <button
              key={item}
              onClick={() => setWeather(item)}
              className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                weather === item
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* PRICE */}
      <div className="mt-7 border-t border-slate-100 pt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold">
            Maximum Price
          </h3>

          <span className="text-xs font-bold text-slate-500">
            ₹{maxPrice.toLocaleString("en-IN")}
          </span>
        </div>

        <input
          type="range"
          min="500"
          max="5000"
          step="100"
          value={maxPrice}
          onChange={(e) =>
            setMaxPrice(Number(e.target.value))
          }
          className="mt-4 w-full accent-slate-950"
        />

        <div className="mt-2 flex justify-between text-[11px] text-slate-400">
          <span>₹500</span>
          <span>₹5,000</span>
        </div>
      </div>

      {/* RATING */}
      <div className="mt-7 border-t border-slate-100 pt-6">
        <h3 className="text-sm font-bold">
          Minimum Rating
        </h3>

        <div className="mt-3 space-y-2">
          {["All", "4.5", "4", "3.5"].map((item) => (
            <label
              key={item}
              className="flex cursor-pointer items-center gap-3 text-sm"
            >
              <input
                type="radio"
                name="rating"
                checked={rating === item}
                onChange={() => setRating(item)}
                className="accent-slate-950"
              />

              <span>
                {item === "All"
                  ? "All Ratings"
                  : `${item} ★ & above`}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- SORT ---------------- */

function SortSelect({ sort, setSort }) {
  return (
    <div className="relative flex items-center">
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm font-medium outline-none focus:border-slate-400"
      >
        <option value="featured">
          Featured
        </option>

        <option value="price-low">
          Price: Low to High
        </option>

        <option value="price-high">
          Price: High to Low
        </option>

        <option value="rating">
          Highest Rated
        </option>

        <option value="discount">
          Best Discount
        </option>
      </select>

      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 text-slate-400"
      />
    </div>
  );
}

/* ---------------- EMPTY STATE ---------------- */

function EmptyState({ resetFilters }) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
        <Search size={25} className="text-slate-400" />
      </div>

      <h2 className="mt-5 text-lg font-bold">
        No products found
      </h2>

      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
        Try changing your search or filters to find
        something else.
      </p>

      <button
        onClick={resetFilters}
        className="mt-6 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white"
      >
        Reset Filters
      </button>
    </div>
  );
}
