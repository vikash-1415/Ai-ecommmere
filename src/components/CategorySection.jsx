import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shirt,
  Smartphone,
  Home,
  Dumbbell,
  Sparkles,
  Footprints,
  ShoppingBag,
  CloudRain,
  Sun,
  Snowflake,
  Cloud,
  Droplets,
  IndianRupee,
  Star,
  TrendingUp,
  ArrowRight,
  Check,
} from "lucide-react";

/* ── Category data ─────────────────────────────── */
const CATEGORIES = [
  {
    name: "All",
    icon: ShoppingBag,
    description: "Browse everything",
    color: "from-slate-600 to-slate-800",
    bg: "bg-slate-50",
    accent: "text-slate-700",
    border: "border-slate-200",
    hoverBorder: "hover:border-slate-400",
  },
  {
    name: "Fashion",
    icon: Shirt,
    description: "Style for every season",
    color: "from-pink-500 to-rose-600",
    bg: "bg-pink-50",
    accent: "text-pink-700",
    border: "border-pink-100",
    hoverBorder: "hover:border-pink-300",
  },
  {
    name: "Electronics",
    icon: Smartphone,
    description: "Smart tech essentials",
    color: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50",
    accent: "text-blue-700",
    border: "border-blue-100",
    hoverBorder: "hover:border-blue-300",
  },
  {
    name: "Accessories",
    icon: Sparkles,
    description: "Complete your look",
    color: "from-amber-400 to-orange-500",
    bg: "bg-amber-50",
    accent: "text-amber-700",
    border: "border-amber-100",
    hoverBorder: "hover:border-amber-300",
  },
  {
    name: "Bags",
    icon: ShoppingBag,
    description: "Carry in style",
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50",
    accent: "text-emerald-700",
    border: "border-emerald-100",
    hoverBorder: "hover:border-emerald-300",
  },
  {
    name: "Footwear",
    icon: Footprints,
    description: "Walk in comfort",
    color: "from-violet-500 to-purple-600",
    bg: "bg-violet-50",
    accent: "text-violet-700",
    border: "border-violet-100",
    hoverBorder: "hover:border-violet-300",
  },
  {
    name: "Lifestyle",
    icon: Home,
    description: "Everyday essentials",
    color: "from-cyan-500 to-sky-600",
    bg: "bg-cyan-50",
    accent: "text-cyan-700",
    border: "border-cyan-100",
    hoverBorder: "hover:border-cyan-300",
  },
];

/* ── Weather filter data ────────────────────────── */
const WEATHER_FILTERS = [
  { label: "All Weather", value: "All", icon: Sparkles, color: "bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-400" },
  { label: "Rain", value: "Rain", icon: CloudRain, color: "bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-400" },
  { label: "Sunny", value: "Sunny", icon: Sun, color: "bg-amber-50 text-amber-700 border-amber-200 hover:border-amber-400" },
  { label: "Cold", value: "Cold", icon: Snowflake, color: "bg-cyan-50 text-cyan-700 border-cyan-200 hover:border-cyan-400" },
  { label: "Cloudy", value: "Cloudy", icon: Cloud, color: "bg-slate-100 text-slate-600 border-slate-200 hover:border-slate-400" },
  { label: "Humid", value: "Humid", icon: Droplets, color: "bg-teal-50 text-teal-700 border-teal-200 hover:border-teal-400" },
];

/* ── Price range quick filters ──────────────────── */
const PRICE_FILTERS = [
  { label: "Under ₹500", min: "", max: "500" },
  { label: "₹500 – ₹1000", min: "500", max: "1000" },
  { label: "₹1000 – ₹2500", min: "1000", max: "2500" },
  { label: "₹2500+", min: "2500", max: "" },
];

/* ── Sort quick links ───────────────────────────── */
const SORT_QUICK = [
  { label: "Top Rated", value: "rating", icon: Star },
  { label: "Trending", value: "popular", icon: TrendingUp },
  { label: "Best Deals", value: "discount", icon: IndianRupee },
];

export default function CategorySection() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeWeather, setActiveWeather] = useState("All");
  const [activePrice, setActivePrice] = useState(null);
  const [activeSort, setActiveSort] = useState(null);

  /* Build URL params and navigate to /products */
  const applyFilters = ({
    category = activeCategory,
    weather = activeWeather,
    price = activePrice,
    sort = activeSort,
  } = {}) => {
    const params = new URLSearchParams();
    if (category && category !== "All") params.set("category", category);
    if (weather && weather !== "All") params.set("weather", weather);
    if (price?.min) params.set("minPrice", price.min);
    if (price?.max) params.set("maxPrice", price.max);
    if (sort) params.set("sort", sort);
    navigate(`/products${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleCategory = (cat) => {
    setActiveCategory(cat);
    applyFilters({ category: cat });
  };

  const handleWeather = (w) => {
    setActiveWeather(w);
    applyFilters({ weather: w });
  };

  const handlePrice = (p) => {
    setActivePrice(p);
    applyFilters({ price: p });
  };

  const handleSort = (s) => {
    setActiveSort(s);
    applyFilters({ sort: s });
  };

  return (
    <section id="categories" className="bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
            Explore
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Shop by Category
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Discover products across categories, intelligently personalized
            for your lifestyle and environment.
          </p>
        </motion.div>

        {/* ── Category Cards ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:mt-14 lg:grid-cols-7"
        >
          {CATEGORIES.map((category, index) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.name;

            return (
              <motion.button
                key={category.name}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleCategory(category.name)}
                className={`group relative rounded-2xl border-2 p-4 text-left transition-all duration-300 sm:p-5
                  ${isActive
                    ? `${category.bg} ${category.border} shadow-lg shadow-slate-900/10`
                    : `bg-slate-50 border-slate-200 hover:bg-white hover:shadow-xl hover:shadow-slate-900/5 ${category.hoverBorder}`
                  }`}
                aria-pressed={isActive}
              >
                {/* Active indicator dot */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-slate-950"
                    >
                      <Check size={11} className="text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Icon */}
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-sm transition-all duration-300
                    ${isActive
                      ? `bg-gradient-to-br ${category.color} text-white shadow-md`
                      : "bg-white text-slate-700 group-hover:bg-slate-950 group-hover:text-white"
                    }`}
                >
                  <Icon size={19} />
                </div>

                <h3 className={`mt-4 text-xs font-bold sm:text-sm ${isActive ? category.accent : "text-slate-950"}`}>
                  {category.name}
                </h3>
                <p className="mt-0.5 text-[10px] leading-4 text-slate-500 sm:text-xs">
                  {category.description}
                </p>
              </motion.button>
            );
          })}
        </motion.div>

        {/* ── Divider ── */}
        <div className="my-10 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        {/* ── Weather Filter ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
            <CloudRain size={13} />
            Filter by Weather
          </p>
          <div className="flex flex-wrap gap-2.5">
            {WEATHER_FILTERS.map((w) => {
              const Icon = w.icon;
              const isActive = activeWeather === w.value;
              return (
                <motion.button
                  key={w.value}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleWeather(w.value)}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition-all duration-200
                    ${isActive
                      ? "border-slate-950 bg-slate-950 text-white shadow-lg"
                      : `${w.color} border`
                    }`}
                >
                  <Icon size={13} />
                  {w.label}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* ── Price + Sort Quick Filters ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-10"
        >
          {/* Price Ranges */}
          <div>
            <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
              <IndianRupee size={13} />
              Price Range
            </p>
            <div className="flex flex-wrap gap-2">
              {PRICE_FILTERS.map((p) => {
                const isActive =
                  activePrice?.min === p.min && activePrice?.max === p.max;
                return (
                  <motion.button
                    key={p.label}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handlePrice(p)}
                    className={`rounded-xl border px-3.5 py-2 text-xs font-bold transition-all duration-200
                      ${isActive
                        ? "border-slate-950 bg-slate-950 text-white shadow-md"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-400 hover:bg-white"
                      }`}
                  >
                    {p.label}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Sort Quick Links */}
          <div>
            <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
              <TrendingUp size={13} />
              Sort By
            </p>
            <div className="flex flex-wrap gap-2">
              {SORT_QUICK.map((s) => {
                const Icon = s.icon;
                const isActive = activeSort === s.value;
                return (
                  <motion.button
                    key={s.value}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSort(s.value)}
                    className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all duration-200
                      ${isActive
                        ? "border-slate-950 bg-slate-950 text-white shadow-md"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-400 hover:bg-white"
                      }`}
                  >
                    <Icon size={12} />
                    {s.label}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* ── Explore CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="mt-10 flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => applyFilters()}
            className="group flex items-center gap-2.5 rounded-2xl bg-slate-950 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-900/25 transition hover:bg-slate-800"
          >
            Explore All Products
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </motion.button>
        </motion.div>

      </div>
    </section>
  );
}
