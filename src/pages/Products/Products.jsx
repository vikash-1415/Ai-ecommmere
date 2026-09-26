import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, ArrowUpDown, Sparkles, Filter, X } from "lucide-react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/layout/Footer";
import ProductGrid from "../../components/products/ProductGrid";
import { productsData, categoriesData } from "../../data/products";
import { useWeather } from "../../context/WeatherContext";
import { useAuth } from "../../context/AuthContext";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedWeather, setSelectedWeather] = useState("all");
  const [sortBy, setSortBy] = useState("aiMatch");
  const [priceRange, setPriceRange] = useState(7000);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const { calculateProductScore, weatherData } = useWeather();
  const { user } = useAuth();

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return productsData
      .filter((p) => {
        // Search query
        if (
          searchQuery &&
          !p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !p.description.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          return false;
        }

        // Category filter
        if (selectedCategory !== "all" && p.category !== selectedCategory) {
          return false;
        }

        // Weather tag filter
        if (selectedWeather !== "all" && !p.weatherTags.includes(selectedWeather)) {
          return false;
        }

        // Max price
        if (p.price > priceRange) {
          return false;
        }

        return true;
      })
      .map((p) => ({
        ...p,
        computedScore: calculateProductScore(p, user?.categoryPreferences || [])
      }))
      .sort((a, b) => {
        if (sortBy === "aiMatch") return b.computedScore - a.computedScore;
        if (sortBy === "priceLow") return a.price - b.price;
        if (sortBy === "priceHigh") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return 0;
      });
  }, [searchQuery, selectedCategory, selectedWeather, priceRange, sortBy, calculateProductScore, user]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 sm:pt-28 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Full Catalog
            </span>
            <h1 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
              Explore All Products
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Smart weather recommendations dynamically prioritized for {weatherData.condition} ({weatherData.temp}°C)
            </p>
          </div>

          {/* Search, Filter & Sort Bar */}
          <div className="mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
            {/* Search Input */}
            <div className="relative flex-grow max-w-md">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search jackets, umbrellas, sunglasses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl bg-slate-50 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-800 placeholder-slate-400 border border-slate-200 focus:bg-white focus:border-blue-500 focus:outline-none transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filter Buttons & Sort */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setIsFilterModalOpen(!isFilterModalOpen)}
                className="flex items-center gap-1.5 rounded-2xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition lg:hidden"
              >
                <SlidersHorizontal size={14} />
                <span>Filters</span>
              </button>

              {/* Weather Filter Pill */}
              <select
                value={selectedWeather}
                onChange={(e) => setSelectedWeather(e.target.value)}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-white focus:outline-blue-500"
              >
                <option value="all">🌤️ All Weathers</option>
                <option value="rain">🌧️ Rain Gear</option>
                <option value="sunny">☀️ Summer Sun</option>
                <option value="cold">❄️ Winter Cold</option>
                <option value="wind">💨 Wind Protection</option>
              </select>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700">
                <ArrowUpDown size={14} className="text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="aiMatch">✨ AI Recommendation</option>
                  <option value="priceLow">Price: Low to High</option>
                  <option value="priceHigh">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Content Layout with Sidebar for Laptop/Desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block lg:col-span-1 space-y-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-fit">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
                  <span>Categories</span>
                  {selectedCategory !== "all" && (
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className="text-xs text-blue-600 font-medium"
                    >
                      Reset
                    </button>
                  )}
                </h3>
                <div className="space-y-1">
                  {categoriesData.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition ${
                        selectedCategory === cat.id
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className={`text-[10px] ${selectedCategory === cat.id ? "text-blue-100" : "text-slate-400"}`}>
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="border-t border-slate-100 pt-5">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-900 mb-2">
                  <span>Max Price</span>
                  <span className="text-blue-600 font-bold">₹{priceRange.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="7000"
                  step="200"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>₹500</span>
                  <span>₹7,000</span>
                </div>
              </div>

              {/* Weather Tags */}
              <div className="border-t border-slate-100 pt-5">
                <h3 className="text-xs font-bold text-slate-900 mb-2">Weather Suitability</h3>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: "all", label: "All" },
                    { id: "rain", label: "🌧️ Rain" },
                    { id: "sunny", label: "☀️ Sunny" },
                    { id: "cold", label: "❄️ Cold" },
                    { id: "wind", label: "💨 Wind" }
                  ].map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => setSelectedWeather(tag.id)}
                      className={`rounded-full px-3 py-1 text-[11px] font-medium transition ${
                        selectedWeather === tag.id
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Mobile Filter Drawer / Modal */}
            {isFilterModalOpen && (
              <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm lg:hidden p-4">
                <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                    <h3 className="text-base font-bold text-slate-900">Filter Products</h3>
                    <button
                      onClick={() => setIsFilterModalOpen(false)}
                      className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Categories */}
                  <div className="mb-5">
                    <p className="text-xs font-bold text-slate-700 mb-2">Category</p>
                    <div className="grid grid-cols-2 gap-2">
                      {categoriesData.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`rounded-xl p-2.5 text-xs text-left font-medium transition ${
                            selectedCategory === cat.id
                              ? "bg-blue-600 text-white"
                              : "bg-slate-50 text-slate-700"
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Weather Tag */}
                  <div className="mb-5">
                    <p className="text-xs font-bold text-slate-700 mb-2">Weather Condition</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: "all", label: "All" },
                        { id: "rain", label: "🌧️ Rain" },
                        { id: "sunny", label: "☀️ Sunny" },
                        { id: "cold", label: "❄️ Cold" },
                        { id: "wind", label: "💨 Wind" }
                      ].map((tag) => (
                        <button
                          key={tag.id}
                          onClick={() => setSelectedWeather(tag.id)}
                          className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                            selectedWeather === tag.id
                              ? "bg-slate-900 text-white"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {tag.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setIsFilterModalOpen(false)}
                    className="w-full py-3 bg-blue-600 text-white rounded-2xl font-semibold text-sm hover:bg-blue-700 transition"
                  >
                    Apply Filters ({filteredProducts.length} Results)
                  </button>
                </div>
              </div>
            )}

            {/* Product Grid Area */}
            <div className="lg:col-span-3">
              <div className="mb-4 flex items-center justify-between text-xs text-slate-500">
                <span>Showing <strong className="text-slate-900">{filteredProducts.length}</strong> items</span>
                {selectedCategory !== "all" && (
                  <span className="bg-slate-200 px-2 py-0.5 rounded-full text-slate-700">
                    Category: {selectedCategory}
                  </span>
                )}
              </div>

              <ProductGrid products={filteredProducts} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
