import { useState } from "react";
import {
  MapPin,
  ChevronDown,
  CloudRain,
  Sun,
  Snowflake,
  Wind,
  Compass,
  Check,
  Sparkles,
} from "lucide-react";
import { useWeather } from "../context/WeatherContext";

export default function WeatherBadge() {
  const {
    weather,
    loading,
    selectedCityName,
    cities,
    changeCity,
    simulateWeather,
    isSimulated,
    resetToLiveLocation,
  } = useWeather();

  const [isOpen, setIsOpen] = useState(false);

  const cityName =
    selectedCityName || weather?.location?.name || "Ahmedabad";
  const temp = weather?.temperature ? Math.round(weather.temperature) : "--";
  const condition = weather?.condition || "Clear";

  const getEmoji = (cond) => {
    const c = (cond || "").toLowerCase();
    if (c.includes("rain") || c.includes("drizzle")) return "🌧️";
    if (c.includes("cloud")) return "⛅";
    if (c.includes("snow") || c.includes("cold")) return "❄️";
    if (c.includes("thunder")) return "⛈️";
    return "☀️";
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Location and Weather Selector"
        className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50/90 px-3 py-1.5 text-xs font-semibold text-slate-800 transition hover:bg-slate-100 hover:border-slate-300 shadow-sm"
      >
        <span className="text-sm leading-none">{getEmoji(condition)}</span>
        <span className="flex items-center gap-1 font-bold text-slate-900">
          <MapPin size={13} className="text-blue-600" />
          <span className="max-w-[85px] sm:max-w-[110px] truncate">{cityName}</span>
        </span>
        <span className="text-slate-400 font-normal">|</span>
        <span className="font-extrabold text-blue-600">{temp}°C</span>
        {isSimulated && (
          <span className="hidden min-[400px]:inline-block rounded-md bg-amber-100 px-1 py-0.5 text-[9px] font-bold text-amber-800">
            SIM
          </span>
        )}
        <ChevronDown size={13} className="text-slate-400" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-50 w-72 rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl">
            {/* Current Weather Card */}
            <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-3.5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                    <MapPin size={11} /> {cityName}
                  </p>
                  <p className="text-2xl font-extrabold mt-0.5">{temp}°C</p>
                </div>
                <div className="text-3xl">{getEmoji(condition)}</div>
              </div>
              <p className="mt-2 text-xs font-medium text-slate-300 capitalize">
                {weather?.description || condition} • {weather?.humidity || 60}% Humidity
              </p>
            </div>

            {/* Live GPS button */}
            <div className="mt-3">
              <button
                onClick={() => {
                  resetToLiveLocation();
                  setIsOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-blue-600 transition hover:bg-blue-50"
              >
                <span className="flex items-center gap-2">
                  <Compass size={14} /> Detect Live Location
                </span>
                {!selectedCityName && !isSimulated && <Check size={14} />}
              </button>
            </div>

            {/* City Selection */}
            <div className="mt-2">
              <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Choose City
              </p>
              <div className="grid grid-cols-2 gap-1 mt-1">
                {cities.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      changeCity(c.name);
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs text-left transition ${
                      selectedCityName === c.name
                        ? "bg-slate-950 font-bold text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className="truncate">{c.name}</span>
                    {selectedCityName === c.name && <Check size={12} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Climate Simulator Presets */}
            <div className="mt-3 border-t border-slate-100 pt-3">
              <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Sparkles size={11} className="text-blue-500" /> Climate Simulation
              </p>
              <div className="grid grid-cols-4 gap-1.5 mt-1 text-center">
                <button
                  onClick={() => {
                    simulateWeather("rain");
                    setIsOpen(false);
                  }}
                  className="rounded-xl border border-blue-200 bg-blue-50 py-1.5 text-[11px] font-bold text-blue-800 transition hover:bg-blue-100"
                >
                  🌧️ Rain
                </button>
                <button
                  onClick={() => {
                    simulateWeather("sunny");
                    setIsOpen(false);
                  }}
                  className="rounded-xl border border-amber-200 bg-amber-50 py-1.5 text-[11px] font-bold text-amber-800 transition hover:bg-amber-100"
                >
                  ☀️ Sun
                </button>
                <button
                  onClick={() => {
                    simulateWeather("cold");
                    setIsOpen(false);
                  }}
                  className="rounded-xl border border-cyan-200 bg-cyan-50 py-1.5 text-[11px] font-bold text-cyan-800 transition hover:bg-cyan-100"
                >
                  ❄️ Cold
                </button>
                <button
                  onClick={() => {
                    simulateWeather("humid");
                    setIsOpen(false);
                  }}
                  className="rounded-xl border border-emerald-200 bg-emerald-50 py-1.5 text-[11px] font-bold text-emerald-800 transition hover:bg-emerald-100"
                >
                  🌴 Humid
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
