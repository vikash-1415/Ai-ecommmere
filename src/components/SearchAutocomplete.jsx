import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  History,
  CloudRain,
  Sun,
  Snowflake,
  Cloud,
  Tag,
  ArrowRight,
  TrendingUp,
  Package,
} from "lucide-react";
import { useDebounce } from "../hooks/useDebounce";
import { useRecentSearches } from "../hooks/useRecentSearches";
import { api } from "../services/api";
import { products as fallbackProducts } from "../data/products";

export default function SearchAutocomplete({
  placeholder = "Search products, brands, weather...",
  onSelect,
  className = "",
  initialValue = "",
  autoFocus = false,
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialValue);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState({
    products: [],
    categories: [],
    brands: [],
    weather: [],
  });
  const [activeIndex, setActiveIndex] = useState(-1);

  const debouncedQuery = useDebounce(query, 300);
  const { recentSearches, addSearch, removeSearch, clearAll } = useRecentSearches();
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Sync initialValue if provided
  useEffect(() => {
    if (initialValue) {
      setQuery(initialValue);
    }
  }, [initialValue]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch suggestions when debounced query changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSuggestions({ products: [], categories: [], brands: [], weather: [] });
      setLoading(false);
      return;
    }

    let isMounted = true;
    async function fetchSuggestions() {
      setLoading(true);
      try {
        const data = await api.getSuggestions(debouncedQuery);
        if (isMounted && data.suggestions) {
          const prods = data.suggestions.filter((s) => s.type === "product");
          const cats = data.suggestions.filter((s) => s.type === "category");
          const brs = data.suggestions.filter((s) => s.type === "brand");
          const wths = data.suggestions.filter((s) => s.type === "weather");

          setSuggestions({
            products: prods,
            categories: cats,
            brands: brs,
            weather: wths,
          });
        }
      } catch (err) {
        // Fallback local search
        const q = debouncedQuery.toLowerCase();
        const matchedProds = fallbackProducts
          .filter(
            (p) =>
              p.name.toLowerCase().includes(q) ||
              (p.brand && p.brand.toLowerCase().includes(q)) ||
              p.category.toLowerCase().includes(q)
          )
          .slice(0, 4)
          .map((p) => ({
            type: "product",
            id: p._id || p.id,
            label: p.name,
            brand: p.brand || "WeatherCart",
            category: p.category,
            price: p.price,
            image: p.image,
          }));

        const categories = ["Fashion", "Footwear", "Accessories", "Bags", "Lifestyle", "Electronics"];
        const matchedCats = categories
          .filter((c) => c.toLowerCase().includes(q))
          .map((c) => ({ type: "category", label: c }));

        const brands = ["NorthPeak", "Solaria", "AquaGear", "AeroFit", "UrbanX", "ThermoShield"];
        const matchedBrands = brands
          .filter((b) => b.toLowerCase().includes(q))
          .map((b) => ({ type: "brand", label: b }));

        const weatherList = ["Rain", "Sunny", "Cold", "Cloudy"];
        const matchedWeather = weatherList
          .filter((w) => w.toLowerCase().includes(q))
          .map((w) => ({ type: "weather", label: `${w} Essentials`, weather: w }));

        if (isMounted) {
          setSuggestions({
            products: matchedProds,
            categories: matchedCats,
            brands: matchedBrands,
            weather: matchedWeather,
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchSuggestions();
    return () => {
      isMounted = false;
    };
  }, [debouncedQuery]);

  // Unified list for keyboard navigation
  const allNavItems = [
    ...(query.trim() ? [{ type: "query", label: query.trim() }] : []),
    ...suggestions.products.map((p) => ({ ...p, navType: "product" })),
    ...suggestions.categories.map((c) => ({ ...c, navType: "category" })),
    ...suggestions.brands.map((b) => ({ ...b, navType: "brand" })),
    ...suggestions.weather.map((w) => ({ ...w, navType: "weather" })),
    ...(!query.trim()
      ? recentSearches.map((r) => ({ type: "recent", label: r, navType: "recent" }))
      : []),
  ];

  const handleSelectQuery = (searchTerm) => {
    if (!searchTerm) return;
    addSearch(searchTerm);
    setIsOpen(false);
    if (onSelect) {
      onSelect(searchTerm);
    } else {
      navigate(`/products?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleSelectProduct = (productId) => {
    addSearch(query.trim() || "product");
    setIsOpen(false);
    navigate(`/products/${productId}`);
  };

  const handleSelectCategory = (cat) => {
    addSearch(cat);
    setIsOpen(false);
    navigate(`/products?category=${encodeURIComponent(cat)}`);
  };

  const handleSelectBrand = (brand) => {
    addSearch(brand);
    setIsOpen(false);
    navigate(`/products?brand=${encodeURIComponent(brand)}`);
  };

  const handleSelectWeather = (weatherName) => {
    addSearch(`${weatherName} weather`);
    setIsOpen(false);
    navigate(`/products?weather=${encodeURIComponent(weatherName)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIsOpen(true);
      setActiveIndex((prev) => (prev < allNavItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : allNavItems.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < allNavItems.length) {
        const item = allNavItems[activeIndex];
        if (item.navType === "product") {
          handleSelectProduct(item.id);
        } else if (item.navType === "category") {
          handleSelectCategory(item.label);
        } else if (item.navType === "brand") {
          handleSelectBrand(item.label);
        } else if (item.navType === "weather") {
          handleSelectWeather(item.weather || item.label.split(" ")[0]);
        } else {
          handleSelectQuery(item.label || query);
        }
      } else if (query.trim()) {
        handleSelectQuery(query.trim());
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
      inputRef.current?.blur();
    }
  };

  const hasSuggestions =
    suggestions.products.length > 0 ||
    suggestions.categories.length > 0 ||
    suggestions.brands.length > 0 ||
    suggestions.weather.length > 0;

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* INPUT FIELD */}
      <div
        className={`flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 shadow-sm transition-all duration-200 ${
          isOpen
            ? "border-slate-900 ring-2 ring-slate-900/10 shadow-md"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <Search
          size={18}
          className={`shrink-0 transition-colors ${
            isOpen ? "text-slate-900" : "text-slate-400"
          }`}
        />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          role="combobox"
          aria-expanded={isOpen}
          aria-label="Search products, brands and categories"
          className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
        />

        {loading && (
          <div className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
        )}

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSuggestions({ products: [], categories: [], brands: [], weather: [] });
              setActiveIndex(-1);
              inputRef.current?.focus();
            }}
            aria-label="Clear search query"
            className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={15} />
          </button>
        )}

        <kbd className="hidden rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-400 md:inline-block">
          ESC
        </kbd>
      </div>

      {/* AUTOCOMPLETE POPUP PANEL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.99 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 right-0 top-full z-[100] mt-2 max-h-[480px] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl backdrop-blur-lg"
          >
            {/* 1. DIRECT QUERY SUBMIT PROMPT */}
            {query.trim() && (
              <button
                type="button"
                onClick={() => handleSelectQuery(query.trim())}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-bold text-slate-900 transition hover:bg-slate-50"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Search size={14} />
                  </div>
                  <span className="truncate">
                    Search for &ldquo;<span className="text-blue-600">{query.trim()}</span>&rdquo;
                  </span>
                </div>
                <ArrowRight size={14} className="text-slate-400" />
              </button>
            )}

            {/* 2. MATCHING PRODUCTS */}
            {suggestions.products.length > 0 && (
              <div className="mt-3 border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Package size={12} /> Products
                  </span>
                  <span>{suggestions.products.length} found</span>
                </div>

                <div className="space-y-1">
                  {suggestions.products.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleSelectProduct(p.id)}
                      className="group flex cursor-pointer items-center justify-between gap-3 rounded-xl p-2 transition hover:bg-slate-50"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.label}
                          className="h-11 w-11 shrink-0 rounded-lg object-cover bg-slate-100"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-slate-900 group-hover:text-blue-600">
                            {p.label}
                          </p>
                          <p className="flex items-center gap-2 text-[11px] text-slate-500">
                            <span className="font-semibold text-slate-700">{p.brand}</span>
                            <span>•</span>
                            <span>{p.category}</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xs font-extrabold text-slate-900">₹{p.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. CATEGORIES & BRANDS */}
            {(suggestions.categories.length > 0 || suggestions.brands.length > 0) && (
              <div className="mt-3 border-t border-slate-100 pt-3">
                <p className="px-3 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Categories & Brands
                </p>

                <div className="flex flex-wrap gap-1.5 px-2">
                  {suggestions.categories.map((c, idx) => (
                    <button
                      key={`cat-${idx}`}
                      type="button"
                      onClick={() => handleSelectCategory(c.label)}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-900 hover:bg-slate-900 hover:text-white"
                    >
                      <Tag size={12} />
                      {c.label}
                    </button>
                  ))}

                  {suggestions.brands.map((b, idx) => (
                    <button
                      key={`brand-${idx}`}
                      type="button"
                      onClick={() => handleSelectBrand(b.label)}
                      className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-800 transition hover:bg-blue-600 hover:text-white"
                    >
                      <TrendingUp size={12} />
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 4. WEATHER TAGS */}
            {suggestions.weather.length > 0 && (
              <div className="mt-3 border-t border-slate-100 pt-3">
                <p className="px-3 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Weather Collections
                </p>

                <div className="flex flex-wrap gap-1.5 px-2">
                  {suggestions.weather.map((w, idx) => (
                    <button
                      key={`weather-${idx}`}
                      type="button"
                      onClick={() => handleSelectWeather(w.weather || w.label.split(" ")[0])}
                      className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 transition hover:bg-emerald-600 hover:text-white"
                    >
                      <CloudRain size={13} />
                      {w.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 5. RECENT SEARCHES (shown when query is empty or as footer) */}
            {!query.trim() && recentSearches.length > 0 && (
              <div className="p-2">
                <div className="flex items-center justify-between px-2 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <History size={13} /> Recent Searches
                  </span>
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-[10px] font-semibold text-slate-500 hover:text-red-500 hover:underline"
                  >
                    Clear All
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {recentSearches.map((term, index) => (
                    <div
                      key={index}
                      className="group flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
                    >
                      <button
                        type="button"
                        onClick={() => handleSelectQuery(term)}
                        className="truncate text-left"
                      >
                        {term}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSearch(term);
                        }}
                        className="rounded-full p-0.5 text-slate-400 hover:text-red-500"
                        aria-label={`Remove ${term}`}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Popular suggestions quick tags */}
                <div className="mt-4 border-t border-slate-100 pt-3">
                  <p className="px-2 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Trending Right Now
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {["Rain Jacket", "Waterproof Shoes", "UV Sunglasses", "Puffer Coat"].map(
                      (item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => handleSelectQuery(item)}
                          className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-900 hover:text-white"
                        >
                          {item}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 6. NO RESULTS SMART STATE */}
            {query.trim() && !loading && !hasSuggestions && (
              <div className="p-6 text-center">
                <Search size={24} className="mx-auto text-slate-300" />
                <p className="mt-2 text-sm font-bold text-slate-800">
                  No direct suggestions for &ldquo;{query}&rdquo;
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Press Enter to search catalog or try keywords like:
                </p>
                <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                  {["Rain", "Shoes", "Jacket", "Sunglasses"].map((kw) => (
                    <button
                      key={kw}
                      type="button"
                      onClick={() => handleSelectQuery(kw)}
                      className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      {kw}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
