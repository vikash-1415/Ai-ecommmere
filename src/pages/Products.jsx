import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Filter,
  Check,
  Sparkles,
  CloudRain,
  Sun,
  Snowflake,
  Cloud,
  Droplets,
  Package,
  Layers,
  ArrowDownCircle,
  TrendingUp,
} from "lucide-react";

import { products as localMockProducts } from "../data/products";
import { api } from "../services/api";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SearchAutocomplete from "../components/SearchAutocomplete";

const CATEGORIES = [
  "All",
  "Fashion",
  "Footwear",
  "Accessories",
  "Bags",
  "Lifestyle",
  "Electronics",
];

const BRANDS = [
  "All",
  "NorthPeak",
  "Solaria",
  "AquaGear",
  "AeroFit",
  "UrbanX",
  "ThermoShield",
];

const WEATHER_OPTIONS = [
  { label: "All", icon: Sparkles },
  { label: "Rain", icon: CloudRain },
  { label: "Sunny", icon: Sun },
  { label: "Cold", icon: Snowflake },
  { label: "Cloudy", icon: Cloud },
  { label: "Humid", icon: Droplets },
];

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance (Best Match)" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "popular", label: "Most Popular" },
  { value: "discount", label: "Biggest Discount" },
  { value: "newest", label: "Newest Arrivals" },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read state from URL search params as single source of truth
  const queryParam = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "All";
  const brandParam = searchParams.get("brand") || "All";
  const weatherParam = searchParams.get("weather") || "All";
  const minPriceParam = searchParams.get("minPrice") || "";
  const maxPriceParam = searchParams.get("maxPrice") || "";
  const ratingParam = searchParams.get("rating") || "All";
  const inStockParam = searchParams.get("inStock") === "true";
  const sortParam = searchParams.get("sort") || "relevance";
  const pageParam = parseInt(searchParams.get("page"), 10) || 1;
  const viewModeParam = searchParams.get("mode") || "paged"; // 'paged' or 'stream'

  // Local state for UI
  const [productsList, setProductsList] = useState([]);
  const [accumulatedProducts, setAccumulatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [mobileFilters, setMobileFilters] = useState(false);
  const [infiniteScroll, setInfiniteScroll] = useState(false);

  // Pagination info from backend
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 24,
    totalPages: 2,
    hasNext: true,
    hasPrevious: false,
  });

  const productsTopRef = useRef(null);
  const loadMoreObserverRef = useRef(null);

  // Helper to update URL params while optionally resetting page to 1
  const updateParams = useCallback(
    (newParams, shouldResetPage = true) => {
      const current = Object.fromEntries(searchParams.entries());
      const updated = { ...current, ...newParams };

      if (shouldResetPage) {
        updated.page = "1";
      }

      // Clean up empty params
      Object.keys(updated).forEach((key) => {
        if (
          updated[key] === "" ||
          updated[key] === "All" ||
          updated[key] === false ||
          (key === "page" && updated[key] === "1") ||
          (key === "sort" && updated[key] === "relevance") ||
          (key === "mode" && updated[key] === "paged")
        ) {
          delete updated[key];
        }
      });

      setSearchParams(updated);
    },
    [searchParams, setSearchParams]
  );

  // Count active filters (excluding default values)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (queryParam) count++;
    if (categoryParam !== "All") count++;
    if (brandParam !== "All") count++;
    if (weatherParam !== "All") count++;
    if (minPriceParam || maxPriceParam) count++;
    if (ratingParam !== "All") count++;
    if (inStockParam) count++;
    return count;
  }, [
    queryParam,
    categoryParam,
    brandParam,
    weatherParam,
    minPriceParam,
    maxPriceParam,
    ratingParam,
    inStockParam,
  ]);

  // Reset all filters
  const resetAllFilters = () => {
    setSearchParams({});
    setAccumulatedProducts([]);
  };

  // Fetch products based on current URL params
  useEffect(() => {
    let isCancelled = false;

    async function fetchProducts() {
      // If we are appending via load more/infinite scroll, don't wipe out the whole grid
      const isFirstPage = pageParam === 1 || viewModeParam === "paged";
      if (isFirstPage) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError("");

      const queryString = searchParams.toString();
      const endpoint = queryString ? `?${queryString}&limit=12` : "?limit=12";

      try {
        const data = await api.getProducts(endpoint);
        if (isCancelled) return;

        if (data.success && Array.isArray(data.products)) {
          setProductsList(data.products);
          setPagination({
            page: data.page || pageParam,
            limit: data.limit || 12,
            total: data.total !== undefined ? data.total : data.products.length,
            totalPages: data.totalPages || 1,
            hasNext: Boolean(data.hasNext),
            hasPrevious: Boolean(data.hasPrevious),
          });

          // Accumulate for Stream / Infinite Scroll mode with deduplication
          setAccumulatedProducts((prev) => {
            if (pageParam === 1 || viewModeParam === "paged") {
              return data.products;
            }
            const existingMap = new Map(
              prev.map((item) => [String(item._id || item.id), item])
            );
            data.products.forEach((item) => {
              existingMap.set(String(item._id || item.id), item);
            });
            return Array.from(existingMap.values());
          });
        }
      } catch (err) {
        if (isCancelled) return;
        console.warn("Products API notice, falling back to local dataset:", err.message);

        // Fallback filter locally
        let filtered = [...localMockProducts];

        if (queryParam) {
          const q = queryParam.toLowerCase();
          filtered = filtered.filter(
            (p) =>
              p.name.toLowerCase().includes(q) ||
              (p.brand && p.brand.toLowerCase().includes(q)) ||
              p.category.toLowerCase().includes(q) ||
              (p.description && p.description.toLowerCase().includes(q))
          );
        }

        if (categoryParam !== "All") {
          filtered = filtered.filter((p) => p.category === categoryParam);
        }

        if (brandParam !== "All") {
          filtered = filtered.filter(
            (p) => (p.brand || "").toLowerCase() === brandParam.toLowerCase()
          );
        }

        if (weatherParam !== "All") {
          const w = weatherParam.toLowerCase();
          filtered = filtered.filter(
            (p) =>
              (p.weather || "").toLowerCase() === w ||
              (p.weatherTags || []).some((t) => t.toLowerCase() === w)
          );
        }

        if (minPriceParam) {
          filtered = filtered.filter((p) => p.price >= Number(minPriceParam));
        }
        if (maxPriceParam) {
          filtered = filtered.filter((p) => p.price <= Number(maxPriceParam));
        }

        if (ratingParam !== "All") {
          filtered = filtered.filter((p) => p.rating >= Number(ratingParam));
        }

        if (inStockParam) {
          filtered = filtered.filter((p) => (p.stock || 0) > 0);
        }

        // Sorting
        if (sortParam === "price-low") {
          filtered.sort((a, b) => a.price - b.price);
        } else if (sortParam === "price-high") {
          filtered.sort((a, b) => b.price - a.price);
        } else if (sortParam === "rating") {
          filtered.sort((a, b) => b.rating - a.rating);
        } else if (sortParam === "popular") {
          filtered.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
        } else if (sortParam === "discount") {
          filtered.sort((a, b) => {
            const discA = ((a.oldPrice - a.price) / (a.oldPrice || 1)) * 100;
            const discB = ((b.oldPrice - b.price) / (b.oldPrice || 1)) * 100;
            return discB - discA;
          });
        }

        const limit = 12;
        const total = filtered.length;
        const totalPages = Math.ceil(total / limit) || 1;
        const skip = (pageParam - 1) * limit;
        const paged = filtered.slice(skip, skip + limit);

        setProductsList(paged);
        setPagination({
          page: pageParam,
          limit,
          total,
          totalPages,
          hasNext: pageParam < totalPages,
          hasPrevious: pageParam > 1,
        });

        setAccumulatedProducts((prev) => {
          if (pageParam === 1 || viewModeParam === "paged") {
            return paged;
          }
          const existingMap = new Map(
            prev.map((item) => [String(item._id || item.id), item])
          );
          paged.forEach((item) => {
            existingMap.set(String(item._id || item.id), item);
          });
          return Array.from(existingMap.values());
        });
      } finally {
        if (!isCancelled) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    }

    fetchProducts();
    return () => {
      isCancelled = true;
    };
  }, [searchParams, pageParam, viewModeParam, queryParam, categoryParam, brandParam, weatherParam, minPriceParam, maxPriceParam, ratingParam, inStockParam, sortParam]);

  // Infinite scroll intersection observer (Rule 19.10 & 19.11)
  useEffect(() => {
    if (viewModeParam !== "stream" || !infiniteScroll || !pagination.hasNext || loadingMore || loading) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && pagination.hasNext && !loadingMore && !loading) {
          updateParams({ page: String(pageParam + 1) }, false);
        }
      },
      { rootMargin: "350px" }
    );

    const target = loadMoreObserverRef.current;
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [viewModeParam, infiniteScroll, pagination.hasNext, loadingMore, loading, pageParam, updateParams]);

  // Scroll to top when page changes in 'paged' mode
  const handlePageChange = (newPage) => {
    updateParams({ page: String(newPage) }, false);
    if (productsTopRef.current) {
      productsTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleLoadMoreClick = () => {
    if (pagination.hasNext && !loadingMore) {
      updateParams({ page: String(pageParam + 1) }, false);
    }
  };

  // Choose products to render based on viewMode
  const displayedProducts =
    viewModeParam === "stream" ? accumulatedProducts : productsList;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-28" ref={productsTopRef}>
        {/* HEADER & AUTOCOMPLETE SEARCH */}
        <section className="border-b border-slate-200/80 bg-white px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                    Live Weather Catalog
                  </p>
                  <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">
                    Discover Weather-Ready Gear
                  </h1>
                </div>

                <div className="flex items-center gap-2">
                  <span className="hidden text-xs font-semibold text-slate-500 sm:inline">
                    Display:
                  </span>
                  <div className="flex rounded-xl bg-slate-100 p-1">
                    <button
                      type="button"
                      onClick={() => updateParams({ mode: "paged" }, false)}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                        viewModeParam === "paged"
                          ? "bg-white text-slate-950 shadow-sm"
                          : "text-slate-600 hover:text-slate-950"
                      }`}
                    >
                      <Layers size={13} />
                      Pages
                    </button>
                    <button
                      type="button"
                      onClick={() => updateParams({ mode: "stream" }, false)}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                        viewModeParam === "stream"
                          ? "bg-white text-slate-950 shadow-sm"
                          : "text-slate-600 hover:text-slate-950"
                      }`}
                    >
                      <ArrowDownCircle size={13} />
                      Load More
                    </button>
                  </div>
                </div>
              </div>

              {/* SEARCH AUTOCOMPLETE BAR */}
              <div className="mt-6 max-w-3xl">
                <SearchAutocomplete
                  initialValue={queryParam}
                  onSelect={(q) => updateParams({ q })}
                  placeholder="Search rain jacket, shoes, umbrella, brands (NorthPeak, UrbanX)..."
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ACTIVE FILTER CHIPS BAR (Step 18.10) */}
        {activeFilterCount > 0 && (
          <section className="border-b border-slate-200/60 bg-white/50 px-4 py-3 sm:px-6 lg:px-8 backdrop-blur-sm">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active Filters:
              </span>

              {queryParam && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800">
                  <Search size={12} />
                  &ldquo;{queryParam}&rdquo;
                  <button
                    onClick={() => updateParams({ q: "" })}
                    className="rounded-full hover:bg-blue-200 p-0.5"
                    aria-label="Remove search filter"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {categoryParam !== "All" && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-800 shadow-sm">
                  Category: {categoryParam}
                  <button
                    onClick={() => updateParams({ category: "All" })}
                    className="rounded-full hover:bg-slate-100 p-0.5"
                    aria-label="Remove category filter"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {brandParam !== "All" && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-800 shadow-sm">
                  Brand: {brandParam}
                  <button
                    onClick={() => updateParams({ brand: "All" })}
                    className="rounded-full hover:bg-slate-100 p-0.5"
                    aria-label="Remove brand filter"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {weatherParam !== "All" && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                  <CloudRain size={12} />
                  Weather: {weatherParam}
                  <button
                    onClick={() => updateParams({ weather: "All" })}
                    className="rounded-full hover:bg-emerald-200 p-0.5"
                    aria-label="Remove weather filter"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {(minPriceParam || maxPriceParam) && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-800 shadow-sm">
                  Price: ₹{minPriceParam || 0} - ₹{maxPriceParam || "5000+"}
                  <button
                    onClick={() => updateParams({ minPrice: "", maxPrice: "" })}
                    className="rounded-full hover:bg-slate-100 p-0.5"
                    aria-label="Remove price filter"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {ratingParam !== "All" && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">
                  {ratingParam}★ & up
                  <button
                    onClick={() => updateParams({ rating: "All" })}
                    className="rounded-full hover:bg-amber-200 p-0.5"
                    aria-label="Remove rating filter"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {inStockParam && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                  In Stock Only
                  <button
                    onClick={() => updateParams({ inStock: false })}
                    className="rounded-full hover:bg-emerald-200 p-0.5"
                    aria-label="Remove in stock filter"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              <button
                type="button"
                onClick={resetAllFilters}
                className="ml-auto flex items-center gap-1 text-xs font-bold text-red-600 transition hover:underline"
              >
                <RotateCcw size={12} />
                Clear All
              </button>
            </div>
          </section>
        )}

        {/* MAIN LAYOUT */}
        <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="mx-auto max-w-7xl">
            {/* MOBILE TOP CONTROLS */}
            <div className="mb-6 flex items-center justify-between gap-3 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileFilters(true)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 shadow-sm"
              >
                <SlidersHorizontal size={15} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-950 text-[10px] text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <SortDropdown
                sort={sortParam}
                onChange={(sort) => updateParams({ sort }, false)}
              />
            </div>

            <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
              {/* DESKTOP SIDEBAR FILTERS (Step 18.2) */}
              <aside className="hidden lg:block">
                <div className="sticky top-28">
                  <FilterSidebar
                    category={categoryParam}
                    brand={brandParam}
                    weather={weatherParam}
                    minPrice={minPriceParam}
                    maxPrice={maxPriceParam}
                    rating={ratingParam}
                    inStock={inStockParam}
                    onUpdate={updateParams}
                    onReset={resetAllFilters}
                    activeCount={activeFilterCount}
                  />
                </div>
              </aside>

              {/* PRODUCTS CATALOG SECTION */}
              <div>
                {/* DESKTOP TOP BAR (Step 18.4) */}
                <div className="mb-6 hidden items-center justify-between lg:flex">
                  <div>
                    <p className="text-sm text-slate-600">
                      Showing{" "}
                      <span className="font-extrabold text-slate-950">
                        {displayedProducts.length}
                      </span>{" "}
                      of{" "}
                      <span className="font-extrabold text-slate-950">
                        {pagination.total}
                      </span>{" "}
                      products
                    </p>
                  </div>

                  <SortDropdown
                    sort={sortParam}
                    onChange={(sort) => updateParams({ sort }, false)}
                  />
                </div>

                {/* ERROR BANNER */}
                {error && (
                  <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
                    {error}
                  </div>
                )}

                {/* SKELETON LOADING (Step 19.14) */}
                {loading ? (
                  <div className="grid grid-cols-1 gap-5 min-[380px]:grid-cols-2 sm:gap-6 xl:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="animate-pulse overflow-hidden rounded-3xl border border-slate-200 bg-white"
                      >
                        <div className="aspect-[4/4.2] bg-slate-200" />
                        <div className="space-y-3 p-5">
                          <div className="h-3 w-1/3 rounded bg-slate-200" />
                          <div className="h-4.5 w-4/5 rounded bg-slate-200" />
                          <div className="flex items-center justify-between pt-2">
                            <div className="h-5 w-24 rounded bg-slate-200" />
                            <div className="h-8 w-8 rounded-full bg-slate-200" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : displayedProducts.length > 0 ? (
                  <>
                    {/* PRODUCT GRID */}
                    <motion.div
                      layout
                      className="grid grid-cols-1 gap-5 min-[380px]:grid-cols-2 sm:gap-6 xl:grid-cols-3"
                    >
                      <AnimatePresence mode="popLayout">
                        {displayedProducts.map((product) => (
                          <motion.div
                            key={product._id || product.id}
                            layout
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.97 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ProductCard product={product} />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </motion.div>

                    {/* PAGINATION CONTROLS (Step 19) */}
                    {viewModeParam === "paged" ? (
                      <div className="mt-12">
                        <NumberedPagination
                          page={pagination.page}
                          totalPages={pagination.totalPages}
                          onPageChange={handlePageChange}
                        />
                      </div>
                    ) : (
                      <div className="mt-12 text-center">
                        {pagination.hasNext ? (
                          <div className="space-y-4">
                            <button
                              type="button"
                              onClick={handleLoadMoreClick}
                              disabled={loadingMore}
                              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-8 py-4 text-sm font-bold text-white shadow-lg transition hover:bg-slate-800 disabled:opacity-60"
                            >
                              {loadingMore ? (
                                <>
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                  Loading More Products...
                                </>
                              ) : (
                                <>
                                  <ArrowDownCircle size={17} />
                                  Load More ({pagination.total - displayedProducts.length} remaining)
                                </>
                              )}
                            </button>

                            {/* Infinite Scroll Toggle Option */}
                            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                              <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={infiniteScroll}
                                  onChange={(e) => setInfiniteScroll(e.target.checked)}
                                  className="h-4 w-4 rounded accent-slate-950"
                                />
                                <span>Auto-load on scroll (Infinite scroll)</span>
                              </label>
                            </div>

                            {/* Observer anchor for infinite scroll */}
                            <div ref={loadMoreObserverRef} className="h-4" />
                          </div>
                        ) : (
                          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6">
                            <Package size={28} className="mx-auto text-slate-400" />
                            <p className="mt-2 text-sm font-bold text-slate-800">
                              All {pagination.total} products loaded
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              You&apos;ve reached the end of the collection.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  /* NO RESULTS STATE (Step 17.13 & 18.19) */
                  <EmptyState
                    query={queryParam}
                    onReset={resetAllFilters}
                    onSuggest={(term) => updateParams({ q: term })}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* MOBILE FILTER DRAWER (Step 18.3) */}
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
              transition={{ type: "spring", stiffness: 350, damping: 35 }}
              className="fixed inset-x-0 bottom-0 z-[70] max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5 lg:hidden shadow-2xl"
            >
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200" />

              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={18} />
                  <h2 className="text-base font-extrabold text-slate-950">
                    Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
                  </h2>
                </div>

                <button
                  onClick={() => setMobileFilters(false)}
                  className="rounded-full bg-slate-100 p-2 text-slate-600 hover:text-slate-950"
                  aria-label="Close filters"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-4">
                <FilterSidebar
                  category={categoryParam}
                  brand={brandParam}
                  weather={weatherParam}
                  minPrice={minPriceParam}
                  maxPrice={maxPriceParam}
                  rating={ratingParam}
                  inStock={inStockParam}
                  onUpdate={updateParams}
                  onReset={resetAllFilters}
                  activeCount={activeFilterCount}
                />
              </div>

              <div className="sticky bottom-0 mt-6 border-t border-slate-100 bg-white pt-4">
                <button
                  type="button"
                  onClick={() => setMobileFilters(false)}
                  className="w-full rounded-2xl bg-slate-950 py-4 text-sm font-bold text-white shadow-lg"
                >
                  Apply & View {pagination.total} Products
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ----------------- FILTER SIDEBAR COMPONENT (Step 18.2) ----------------- */

function FilterSidebar({
  category,
  brand,
  weather,
  minPrice,
  maxPrice,
  rating,
  inStock,
  onUpdate,
  onReset,
  activeCount,
}) {
  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice || "5000");

  useEffect(() => {
    setLocalMin(minPrice);
  }, [minPrice]);

  useEffect(() => {
    setLocalMax(maxPrice || "5000");
  }, [maxPrice]);

  const applyPriceRange = () => {
    onUpdate({ minPrice: localMin, maxPrice: localMax });
  };

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 className="flex items-center gap-2 text-sm font-extrabold text-slate-950">
          <Filter size={15} />
          Filters {activeCount > 0 && `(${activeCount})`}
        </h2>

        {activeCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 text-xs font-bold text-blue-600 transition hover:underline"
          >
            <RotateCcw size={12} />
            Reset
          </button>
        )}
      </div>

      {/* CATEGORIES */}
      <div>
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
          Categories
        </h3>
        <div className="mt-2.5 space-y-1">
          {CATEGORIES.map((cat) => (
            <label
              key={cat}
              className={`flex cursor-pointer items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-semibold transition ${
                category === cat
                  ? "bg-slate-950 text-white"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="sidebar-category"
                  checked={category === cat}
                  onChange={() => onUpdate({ category: cat })}
                  className="hidden"
                />
                <span>{cat}</span>
              </div>
              {category === cat && <Check size={13} className="text-white" />}
            </label>
          ))}
        </div>
      </div>

      {/* WEATHER SUITABILITY */}
      <div className="border-t border-slate-100 pt-5">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
          Weather Match
        </h3>
        <div className="mt-2.5 grid grid-cols-2 gap-1.5">
          {WEATHER_OPTIONS.map(({ label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              onClick={() => onUpdate({ weather: label })}
              className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-2 text-xs font-bold transition ${
                weather === label
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <Icon size={13} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* BRANDS */}
      <div className="border-t border-slate-100 pt-5">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
          Brands
        </h3>
        <div className="mt-2.5 space-y-1">
          {BRANDS.map((b) => (
            <label
              key={b}
              className={`flex cursor-pointer items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-semibold transition ${
                brand === b
                  ? "bg-blue-50 text-blue-900 font-bold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="sidebar-brand"
                  checked={brand === b}
                  onChange={() => onUpdate({ brand: b })}
                  className="accent-slate-950"
                />
                <span>{b}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* PRICE RANGE DUAL / SLIDER */}
      <div className="border-t border-slate-100 pt-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Price Range
          </h3>
          <span className="text-xs font-extrabold text-slate-900">
            ₹{localMin || 0} - ₹{localMax}
          </span>
        </div>

        <input
          type="range"
          min="400"
          max="5000"
          step="100"
          value={Number(localMax) || 5000}
          onChange={(e) => setLocalMax(e.target.value)}
          onMouseUp={applyPriceRange}
          onTouchEnd={applyPriceRange}
          className="mt-3 w-full accent-slate-950"
        />

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-bold text-slate-400">Min (₹)</label>
            <input
              type="number"
              value={localMin}
              onChange={(e) => setLocalMin(e.target.value)}
              onBlur={applyPriceRange}
              placeholder="0"
              className="mt-0.5 w-full rounded-xl border border-slate-200 px-2 py-1.5 text-xs font-semibold outline-none focus:border-slate-900"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400">Max (₹)</label>
            <input
              type="number"
              value={localMax}
              onChange={(e) => setLocalMax(e.target.value)}
              onBlur={applyPriceRange}
              placeholder="5000"
              className="mt-0.5 w-full rounded-xl border border-slate-200 px-2 py-1.5 text-xs font-semibold outline-none focus:border-slate-900"
            />
          </div>
        </div>
      </div>

      {/* CUSTOMER RATING */}
      <div className="border-t border-slate-100 pt-5">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
          Minimum Rating
        </h3>
        <div className="mt-2.5 space-y-1.5">
          {["All", "4.5", "4", "3.5"].map((rate) => (
            <label
              key={rate}
              className={`flex cursor-pointer items-center justify-between rounded-xl px-2 py-1.5 text-xs font-semibold transition ${
                rating === rate ? "bg-amber-50 font-bold text-amber-900" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="sidebar-rating"
                  checked={rating === rate}
                  onChange={() => onUpdate({ rating: rate })}
                  className="accent-slate-950"
                />
                <span>{rate === "All" ? "All Ratings" : `${rate}★ & above`}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* IN STOCK ONLY TOGGLE */}
      <div className="border-t border-slate-100 pt-5">
        <label className="flex cursor-pointer items-center justify-between text-xs font-bold text-slate-800">
          <span>In Stock Only</span>
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => onUpdate({ inStock: e.target.checked })}
            className="h-4 w-4 rounded accent-slate-950 cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
}

/* ----------------- SORT DROPDOWN (Step 18.4) ----------------- */

function SortDropdown({ sort, onChange }) {
  return (
    <div className="relative flex items-center">
      <select
        value={sort}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3.5 pr-9 text-xs font-bold text-slate-800 shadow-sm outline-none transition focus:border-slate-900"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-3 text-slate-400"
      />
    </div>
  );
}

/* ----------------- NUMBERED PAGINATION (Step 19.4 & 19.5) ----------------- */

function NumberedPagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  // Generate page numbers with ellipses
  const getVisiblePages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (page <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    if (page >= totalPages - 3) {
      return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  const pages = getVisiblePages();

  return (
    <nav aria-label="Pagination" className="flex flex-col items-center gap-3">
      {/* Desktop view */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="flex h-10 items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:opacity-40"
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="flex items-center gap-1">
          {pages.map((item, idx) =>
            item === "..." ? (
              <span key={`dots-${idx}`} className="px-2 text-xs font-bold text-slate-400">
                ...
              </span>
            ) : (
              <button
                key={item}
                type="button"
                aria-current={item === page ? "page" : undefined}
                onClick={() => onPageChange(item)}
                className={`h-10 min-w-10 rounded-xl px-2 text-xs font-extrabold transition ${
                  item === page
                    ? "bg-slate-950 text-white shadow-md"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                {item}
              </button>
            )
          )}
        </div>

        <button
          type="button"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="flex h-10 items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:opacity-40"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={16} />
        </button>
      </div>

      <p className="text-xs font-medium text-slate-400">
        Page {page} of {totalPages}
      </p>
    </nav>
  );
}

/* ----------------- EMPTY / NO RESULTS STATE (Step 17.13 & 18.19) ----------------- */

function EmptyState({ query, onReset, onSuggest }) {
  return (
    <div className="flex min-h-[440px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 text-slate-400">
        <Search size={32} />
      </div>

      <h2 className="mt-6 text-xl font-extrabold text-slate-950">
        No products found {query ? `for "${query}"` : "matching your filters"}
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        We couldn&apos;t find matching gear with your current combination of filters.
        Try broadening your search or exploring popular suggestions.
      </p>

      {/* Smart Keyword suggestions */}
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {["Rain Jacket", "Waterproof Shoes", "UV Sunglasses", "Thermal Flask"].map(
          (kw) => (
            <button
              key={kw}
              type="button"
              onClick={() => onSuggest(kw)}
              className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-700 transition hover:border-slate-950 hover:bg-slate-950 hover:text-white"
            >
              {kw}
            </button>
          )
        )}
      </div>

      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={onReset}
          className="rounded-xl bg-slate-950 px-6 py-3 text-xs font-bold text-white shadow-md transition hover:bg-slate-800"
        >
          Clear All Filters
        </button>

        <Link
          to="/products"
          onClick={onReset}
          className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
        >
          View Full Catalog
        </Link>
      </div>
    </div>
  );
}
