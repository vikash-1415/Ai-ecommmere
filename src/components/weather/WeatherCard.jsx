import React from "react";
import { CloudRain, Sun, Snowflake, Wind, Compass, Droplets, Gauge, MapPin, RefreshCw } from "lucide-react";
import { useWeather } from "../../context/WeatherContext";

export default function WeatherCard() {
  const {
    city,
    weatherData,
    weatherMode,
    switchWeatherPreset,
    fetchLiveLocationWeather,
    loading,
    isLiveGeo
  } = useWeather();

  const getWeatherIcon = (tag, size = 32) => {
    switch (tag) {
      case "sunny":
        return <Sun size={size} className="text-amber-400" />;
      case "cold":
        return <Snowflake size={size} className="text-cyan-300" />;
      case "windy":
        return <Wind size={size} className="text-teal-300" />;
      default:
        return <CloudRain size={size} className="text-cyan-300" />;
    }
  };

  return (
    <div className="w-full max-w-lg rounded-3xl border border-white/15 bg-white/10 p-5 sm:p-7 shadow-2xl backdrop-blur-xl text-white transition-all">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
            <MapPin size={13} className="text-cyan-300" />
            <span>{isLiveGeo ? "Detected Location" : "Current Location"}</span>
          </div>
          <h2 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            {city}
          </h2>
        </div>

        <div className="rounded-2xl bg-white/10 p-3 shadow-inner">
          {getWeatherIcon(weatherData.weatherTag, 28)}
        </div>
      </div>

      {/* Main Temperature & Condition Display */}
      <div className="my-6 sm:my-8 flex items-baseline gap-3">
        <span className="text-6xl sm:text-7xl font-extralight tracking-tighter">
          {weatherData.temp}°
        </span>
        <div className="pb-1 sm:pb-2">
          <p className="text-base sm:text-lg font-semibold text-white">
            {weatherData.condition}
          </p>
          <p className="text-xs sm:text-sm text-slate-300">
            Feels like {weatherData.feelsLike}°C
          </p>
        </div>
      </div>

      {/* Stats Grid: Responsive 3-column layout */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
        <div className="rounded-2xl bg-white/5 p-2.5 sm:p-3.5 border border-white/5">
          <div className="flex items-center justify-center gap-1 text-[11px] text-slate-300 mb-1">
            <Droplets size={12} className="text-cyan-300" /> Humidity
          </div>
          <p className="text-sm sm:text-base font-bold text-white">
            {weatherData.humidity}%
          </p>
        </div>

        <div className="rounded-2xl bg-white/5 p-2.5 sm:p-3.5 border border-white/5">
          <div className="flex items-center justify-center gap-1 text-[11px] text-slate-300 mb-1">
            <Gauge size={12} className="text-cyan-300" /> Wind
          </div>
          <p className="text-sm sm:text-base font-bold text-white">
            {weatherData.wind} km/h
          </p>
        </div>

        <div className="rounded-2xl bg-white/5 p-2.5 sm:p-3.5 border border-white/5">
          <div className="flex items-center justify-center gap-1 text-[11px] text-slate-300 mb-1">
            <Compass size={12} className="text-cyan-300" /> State
          </div>
          <p className="text-sm sm:text-base font-bold text-white capitalize">
            {weatherData.weatherTag}
          </p>
        </div>
      </div>

      {/* AI Insight Box */}
      <div className="mt-4 sm:mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-3 sm:p-4 text-xs sm:text-sm leading-relaxed text-slate-200">
        <span className="font-semibold text-cyan-300 block mb-0.5">
          🤖 AI Real-Time Insight:
        </span>
        {weatherData.insight}
      </div>

      {/* Interactive Weather Simulation Toggle (For College Demo & Testing) */}
      <div className="mt-5 border-t border-white/10 pt-4">
        <p className="text-[11px] font-semibold tracking-wider uppercase text-slate-400 mb-2.5 flex items-center justify-between">
          <span>Simulate Weather Condition:</span>
          <button
            onClick={fetchLiveLocationWeather}
            disabled={loading}
            className="flex items-center gap-1 text-[11px] text-cyan-300 hover:text-white transition disabled:opacity-50"
            title="Detect live GPS weather"
          >
            <RefreshCw size={11} className={loading ? "animate-spin" : ""} />
            {loading ? "Locating..." : "Use Live GPS"}
          </button>
        </p>
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
          {[
            { id: "rain", label: "Rainy", icon: "🌧️" },
            { id: "sunny", label: "Sunny", icon: "☀️" },
            { id: "cold", label: "Cold", icon: "❄️" },
            { id: "windy", label: "Windy", icon: "💨" },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => switchWeatherPreset(mode.id)}
              className={`flex items-center justify-center gap-1 rounded-xl py-2 px-2 text-xs font-semibold transition ${
                weatherMode === mode.id && !isLiveGeo
                  ? "bg-cyan-400 text-slate-950 shadow-md font-bold"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <span>{mode.icon}</span>
              <span className="hidden min-[380px]:inline">{mode.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
