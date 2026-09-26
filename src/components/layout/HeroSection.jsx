import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Sparkles, CloudRain, ShieldCheck } from "lucide-react";
import WeatherCard from "../weather/WeatherCard";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-[90vh] overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 pt-24 sm:pt-28 pb-12 sm:pb-16 text-white flex items-center"
    >
      {/* Background Ambient Glows */}
      <div className="absolute -left-32 top-20 h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -right-32 bottom-0 h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        <div className="grid items-center gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column: Heading, Subtext, CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left"
          >
            <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3.5 py-1.5 text-xs sm:text-sm backdrop-blur">
              <Sparkles size={15} className="text-cyan-300" />
              <span>AI-Powered Smart Commerce</span>
            </div>

            <h1 className="text-3xl min-[400px]:text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.15] tracking-tight">
              Shop Smarter.
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400 mt-1 sm:mt-2">
                According to Your Weather.
              </span>
            </h1>

            <p className="mt-4 sm:mt-6 max-w-xl text-sm sm:text-base lg:text-lg leading-relaxed text-slate-300">
              Discover intelligent product recommendations dynamically personalized
              to your live coordinates, real-time climate, and shopping preferences.
            </p>

            {/* Action Buttons */}
            <div className="mt-6 sm:mt-8 flex flex-col min-[420px]:flex-row gap-3 sm:gap-4">
              <Link
                to="/products"
                className="group flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-slate-900 transition hover:bg-slate-100 hover:scale-[1.02] shadow-lg active:scale-95"
              >
                <span>Explore Products</span>
                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </Link>

              <a
                href="#recommendations"
                className="flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 sm:py-3.5 text-sm sm:text-base font-semibold backdrop-blur transition hover:bg-white/10 active:scale-95 text-white"
              >
                Get Recommendations
              </a>
            </div>

            {/* USPs Indicators */}
            <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-300 border-t border-white/10 pt-6">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-cyan-400" />
                <span>Location-Aware</span>
              </div>
              <div className="flex items-center gap-2">
                <CloudRain size={16} className="text-cyan-400" />
                <span>Real-Time Climate</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-cyan-400" />
                <span>94% AI Accuracy</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Responsive Weather Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex justify-center w-full"
          >
            <WeatherCard />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
