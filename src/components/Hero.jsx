import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Sparkles, CloudRain } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-[100svh] overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 pt-24 text-white sm:pt-28 flex items-center"
    >
      {/* Background Glow */}
      <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24 w-full">
        {/* Left Column */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm backdrop-blur">
            <Sparkles size={16} className="text-cyan-300" />
            <span>AI-Powered Smart Shopping</span>
          </div>

          <h1 className="max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl">
            Shop Smarter.
            <span className="block text-cyan-300">
              Shop According to Your Weather.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:mt-6 sm:text-lg sm:leading-8">
            Discover intelligent product recommendations personalized
            according to your location, real-time weather and shopping
            preferences.
          </p>

          <div className="mt-7 flex flex-col gap-3 min-[420px]:flex-row sm:mt-8">
            <Link
              to="/products"
              className="group flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-slate-900 transition hover:scale-105 active:scale-95"
            >
              <span>Explore Products</span>
              <ArrowRight
                size={18}
                className="transition group-hover:translate-x-1"
              />
            </Link>

            <a
              href="#recommendations"
              className="flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3.5 font-semibold backdrop-blur transition hover:bg-white/10 active:scale-95 text-white"
            >
              Get Recommendations
            </a>
          </div>

          <div className="mt-8 flex items-center gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span>Location Aware</span>
            </div>

            <div className="flex items-center gap-2">
              <CloudRain size={16} />
              <span>Real-Time Weather</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Weather Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="flex justify-center"
        >
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur-xl sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Your Location</p>
                <h2 className="mt-1 text-2xl font-semibold">Ahmedabad</h2>
              </div>

              <div className="rounded-2xl bg-white/10 p-3">
                <CloudRain size={32} className="text-cyan-300" />
              </div>
            </div>

            <div className="my-8 flex items-end gap-3">
              <span className="text-6xl font-light sm:text-7xl">24°</span>

              <div className="pb-3">
                <p className="font-medium">Light Rain</p>
                <p className="text-sm text-slate-400">Feels like 25°</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="rounded-xl bg-white/5 p-3 sm:rounded-2xl sm:p-4 text-center">
                <p className="text-xs text-slate-400">Humidity</p>
                <p className="mt-1 font-semibold">82%</p>
              </div>

              <div className="rounded-xl bg-white/5 p-3 sm:rounded-2xl sm:p-4 text-center">
                <p className="text-xs text-slate-400">Wind</p>
                <p className="mt-1 font-semibold">12 km/h</p>
              </div>

              <div className="rounded-xl bg-white/5 p-3 sm:rounded-2xl sm:p-4 text-center">
                <p className="text-xs text-slate-400">Weather</p>
                <p className="mt-1 font-semibold">Rain</p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-cyan-300/10 bg-cyan-300/5 p-4">
              <p className="text-sm text-slate-400">AI Insight</p>
              <p className="mt-1 font-medium">
                Rainy weather detected. We've prepared recommendations for you.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
