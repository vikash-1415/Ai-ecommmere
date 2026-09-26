import React from "react";
import { Sparkles, MapPin, ArrowRight, ShieldCheck } from "lucide-react";
import { useWeather } from "../../context/WeatherContext";
import { useAuth } from "../../context/AuthContext";
import { productsData } from "../../data/products";
import ProductCard from "../products/ProductCard";

export default function AIRecommendationSection() {
  const { city, weatherData, calculateProductScore } = useWeather();
  const { user } = useAuth();

  // Score all products and rank top items
  const scoredProducts = [...productsData]
    .map((product) => ({
      ...product,
      computedScore: calculateProductScore(product, user?.categoryPreferences || [])
    }))
    .sort((a, b) => b.computedScore - a.computedScore)
    .slice(0, 4);

  return (
    <section id="recommendations" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-slate-50 via-blue-50/30 to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Recommendation Header Card */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 sm:p-8 lg:p-10 text-white shadow-xl mb-8 sm:mb-12">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1 text-xs font-semibold text-cyan-300 backdrop-blur-md mb-4">
                <Sparkles size={14} />
                AI Real-Time Engine • 94%+ Accuracy
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                Recommended For You Right Now
              </h2>

              <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
                “Because it's currently <span className="font-semibold text-cyan-300">{weatherData.condition}</span> ({weatherData.temp}°C) in <span className="font-semibold text-white">{city}</span>, our algorithm prioritized these protective & seasonal essentials.”
              </p>
            </div>

            {/* Live Parameter Pill */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 rounded-2xl bg-white/10 p-3 sm:p-4 backdrop-blur-md border border-white/10 self-start md:self-auto">
              <div className="flex items-center gap-1.5 text-xs text-slate-200">
                <MapPin size={14} className="text-cyan-400" />
                <span>{city}</span>
              </div>
              <span className="text-white/30">•</span>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300">
                <span>{weatherData.badge}</span>
              </div>
              <span className="text-white/30">•</span>
              <div className="text-xs font-bold text-white">
                {weatherData.temp}°C
              </div>
              <span className="text-white/30">•</span>
              <div className="text-xs text-slate-300">
                {weatherData.humidity}% Hum.
              </div>
            </div>
          </div>
        </div>

        {/* Scoring Breakdown USP Notice */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 font-medium text-slate-800">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span>Smart Hybrid Formula:</span>
            <span className="hidden sm:inline text-slate-500 font-normal">
              Weather Match (40%) + Category (25%) + Preferences (20%) + Popularity (10%) + Rating (5%)
            </span>
          </div>
          <span className="text-blue-600 font-semibold cursor-pointer hover:underline">
            Live Re-Ranked
          </span>
        </div>

        {/* Products Display:
            - Mobile: Smooth horizontal touch scroll with snap
            - Tablet/Desktop: Clean 4-column responsive grid
        */}
        <div className="relative">
          {/* Mobile swipe hint */}
          <p className="text-[11px] text-slate-400 mb-2 sm:hidden flex items-center justify-between">
            <span>Swipe for more recommendations →</span>
            <span className="font-semibold text-blue-600">Top 4 Picks</span>
          </p>

          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 snap-x snap-mandatory no-scrollbar">
            {scoredProducts.map((product) => (
              <div key={product.id} className="min-w-[240px] sm:min-w-0 snap-start flex-1">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
