import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  MapPin,
  CloudRain,
  Sun,
  Snowflake,
  Wind,
  ArrowRight,
  TrendingUp,
  User,
} from "lucide-react";
import { useWeather } from "../context/WeatherContext";
import {
  fetchPersonalizedRecommendations,
} from "../services/weatherApi";
import { behaviorApi } from "../services/behaviorApi";
import ProductCard from "./ProductCard";

// ─────────────────────────────────────────────
// Reason badge config
// ─────────────────────────────────────────────
const REASON_STYLES = {
  weather:    { bg: "bg-sky-500/90",    label: "Weather Match" },
  wishlist:   { bg: "bg-rose-500/90",   label: "Your Wishlist" },
  viewed:     { bg: "bg-violet-500/90", label: "Recently Viewed" },
  preference: { bg: "bg-amber-500/90",  label: "Your Interests" },
  popular:    { bg: "bg-orange-500/90", label: "Top Rated" },
  general:    { bg: "bg-slate-600/90",  label: "Recommended" },
};

function ReasonBadge({ reason }) {
  if (!reason) return null;
  const style = REASON_STYLES[reason.type] || REASON_STYLES.general;
  return (
    <span
      className={`absolute left-3 top-3 z-20 flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold text-white shadow-md backdrop-blur-md ${style.bg}`}
    >
      <span>{reason.icon}</span>
      {style.label}
    </span>
  );
}

// ─────────────────────────────────────────────
// Match % badge (top-right)
// ─────────────────────────────────────────────
function MatchBadge({ match }) {
  return (
    <div className="absolute right-3 top-3 z-20 flex items-center gap-1 rounded-full bg-slate-950/85 px-2.5 py-1 text-[11px] font-extrabold text-white shadow-md backdrop-blur-md">
      <Sparkles size={11} className="text-amber-400" />
      {match || 90}% Match
    </div>
  );
}

function renderConditionIcon(condition) {
  const normalized = (condition || "").toLowerCase();
  if (normalized.includes("rain") || normalized.includes("drizzle")) {
    return <CloudRain size={16} className="text-amber-400" />;
  }
  if (normalized.includes("snow") || normalized.includes("cold")) {
    return <Snowflake size={16} className="text-amber-400" />;
  }
  if (normalized.includes("wind")) {
    return <Wind size={16} className="text-amber-400" />;
  }
  return <Sun size={16} className="text-amber-400" />;
}

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────
export default function RecommendationSection() {
  const {
    weather,
    loading: weatherLoading,
    selectedCityName,
    isSimulated,
  } = useWeather();

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [normalizedWeather, setNormalizedWeather] = useState(null);
  const [isPersonalized, setIsPersonalized] = useState(false);
  const [algorithmVersion, setAlgorithmVersion] = useState("");

  useEffect(() => {
    if (weatherLoading) return;

    let isMounted = true;

    async function getRecs() {
      try {
        setLoading(true);
        setLoadError("");
        const currentWeather = weather || {
          temperature: 27,
          humidity: 65,
          condition: "Clear",
        };
        const data = await fetchPersonalizedRecommendations(currentWeather);
        if (isMounted) {
          setRecommendations(data.recommendations || []);
          setNormalizedWeather(data.weather || null);
          setIsPersonalized(!!data.personalized);
          setAlgorithmVersion(data.algorithmVersion || "");
        }
      } catch (err) {
        console.error("Failed to load recommendations:", err);
        if (isMounted) {
          setLoadError(err.message || "Recommendations are temporarily unavailable.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    getRecs();

    return () => {
      isMounted = false;
    };
  }, [weather, weatherLoading]);

  const cityName =
    selectedCityName || weather?.location?.name || "Your City";
  const temp = weather?.temperature
    ? Math.round(weather.temperature)
    : 26;
  const condition = weather?.condition || "Clear";

  // AI insight narrative
  const getAiInsightText = () => {
    const tags = normalizedWeather?.tags || [];
    if (tags.includes("rain")) {
      return `Wet & humid weather in ${cityName} (${temp}°C). Prioritized waterproof gear and moisture-resistant fabrics${isPersonalized ? " based on your interests" : ""}.`;
    }
    if (tags.includes("hot") || tags.includes("sunny")) {
      return `High solar exposure in ${cityName} (${temp}°C). Prioritized UV eyewear, breathable apparel, and hydration accessories${isPersonalized ? " for your style" : ""}.`;
    }
    if (tags.includes("cold") || tags.includes("winter")) {
      return `Cool conditions in ${cityName} (${temp}°C). Recommended thermal layers and winter essentials${isPersonalized ? " matching your preferences" : ""}.`;
    }
    return `Balanced weather in ${cityName} (${temp}°C). Ranked lifestyle and all-weather essentials${isPersonalized ? " tailored to you" : ""}.`;
  };

  return (
    <section
      id="recommendations"
      className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
              <Sparkles size={14} />
              {isPersonalized ? "PERSONALIZED AI RECOMMENDATIONS" : "AI RECOMMENDATION ENGINE"}
            </div>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              {isPersonalized ? (
                <>Picked For You in {cityName}</>
              ) : (
                <>Recommended for {cityName}</>
              )}
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              {isPersonalized
                ? "AI engine combined real-time weather with your browsing, wishlist, and shopping interests."
                : "Real-time climate analysis matched with product suitability tags and customer reviews."}
            </p>

            {/* Personalized indicator */}
            {isPersonalized && (
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                <User size={12} />
                Personalized for your account
              </div>
            )}
          </div>

          <Link
            to="/products"
            className="group flex items-center gap-2 self-start rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-950 hover:text-white lg:self-auto"
          >
            Explore Catalog
            <ArrowRight
              size={16}
              className="transition group-hover:translate-x-1"
            />
          </Link>
        </motion.div>

        {/* ── Live Weather Banner ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-8 rounded-3xl bg-slate-950 p-6 text-white shadow-xl"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Live Climate Parameters{" "}
                {isSimulated && "• (Simulated Mode)"}
              </p>

              <div className="mt-2.5 flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5 text-sm font-bold text-white">
                  <MapPin size={16} className="text-blue-400" />
                  {cityName}
                </span>

                <span className="h-1 w-1 rounded-full bg-slate-600" />

                <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-200">
                  {renderConditionIcon(condition)}
                  {weather?.description || condition}
                </span>

                <span className="h-1 w-1 rounded-full bg-slate-600" />

                <span className="text-sm font-extrabold text-blue-400">
                  {temp}°C
                </span>

                <span className="h-1 w-1 rounded-full bg-slate-600" />

                <span className="text-xs text-slate-400">
                  Humidity: {weather?.humidity || 65}%
                </span>
              </div>
            </div>

            <div className="max-w-md rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="flex items-center gap-1.5 text-xs font-bold text-blue-400">
                <TrendingUp size={13} />
                {isPersonalized ? "Personalized AI Match" : "AI Weather Match"}
              </p>
              <p className="mt-1.5 text-xs leading-5 text-slate-300">
                {getAiInsightText()}
              </p>
              {algorithmVersion && (
                <p className="mt-2 text-[10px] text-slate-500">
                  Recommendation model: {algorithmVersion}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Loading Skeletons ── */}
        {loading && (
          <div className="mt-8 grid grid-cols-1 gap-4 min-[380px]:grid-cols-2 animate-pulse sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-80 rounded-3xl bg-slate-200/80 p-4"
              />
            ))}
          </div>
        )}

        {/* ── Ranked Product Grid ── */}
        {loadError && (
          <p className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800" role="status">
            {loadError}
          </p>
        )}

        {!loading && recommendations.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-4 min-[380px]:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {recommendations.slice(0, 4).map((item, idx) => (
              <motion.div
                key={item.product._id || item.product.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ y: -5 }}
                className="relative"
              >
                {/* Reason badge (left, coloured) */}
                <ReasonBadge reason={item.reason} />

                {/* Match % badge (right, dark) */}
                <MatchBadge match={item.match} />

                <ProductCard
                  product={item.product}
                  onProductClick={() =>
                    behaviorApi.recommendationClick(
                      item.product._id || item.product.id,
                      algorithmVersion
                    )
                  }
                />

                {/* Reason text below card */}
                {item.reason?.text && (
                  <p className="mt-2 px-1 text-center text-[11px] font-medium text-slate-500">
                    {item.reason.icon} {item.reason.text}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && recommendations.length === 0 && (
          <div className="mt-12 py-20 text-center text-slate-400">
            <Sparkles size={40} className="mx-auto mb-4 opacity-40" />
            <p className="text-sm">No recommendations available right now.</p>
          </div>
        )}
      </div>
    </section>
  );
}
