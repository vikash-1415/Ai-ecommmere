import React, { useState } from "react";
import { User, MapPin, Mail, Settings, Shield, Sparkles, Check } from "lucide-react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/layout/Footer";
import { useAuth } from "../../context/AuthContext";
import { useWeather } from "../../context/WeatherContext";

export default function Profile() {
  const { user, updatePreferences } = useAuth();
  const { city } = useWeather();

  const [selectedCats, setSelectedCats] = useState(user?.categoryPreferences || ["Fashion", "Accessories"]);
  const [selectedWeathers, setSelectedWeathers] = useState(user?.weatherPreferences || ["rain", "winter"]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const categories = ["Fashion", "Accessories", "Footwear", "Home & Electronics", "Personal Care"];
  const weatherOptions = [
    { id: "rain", label: "Rainy & Monsoon 🌧️" },
    { id: "sunny", label: "Sunny & Summer ☀️" },
    { id: "winter", label: "Cold & Winter ❄️" },
    { id: "wind", label: "Windy & Storm 💨" }
  ];

  const handleToggleCat = (cat) => {
    setSelectedCats((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleToggleWeather = (w) => {
    setSelectedWeathers((prev) =>
      prev.includes(w) ? prev.filter((item) => item !== w) : [...prev, w]
    );
  };

  const handleSave = (e) => {
    e.preventDefault();
    updatePreferences(selectedCats, selectedWeathers);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 sm:pt-28 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              User Profile & AI Preferences
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Customize your shopping persona to calibrate our recommendation engine
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* User ID Card */}
            <div className="md:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center space-y-4 h-fit">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-2xl font-bold text-white shadow-md">
                {user?.name?.charAt(0) || "U"}
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">{user?.name || "Guest User"}</h3>
                <p className="text-xs text-slate-500 flex items-center justify-center gap-1 mt-0.5">
                  <Mail size={12} /> {user?.email || "guest@example.com"}
                </p>
                <p className="text-xs text-blue-600 font-medium flex items-center justify-center gap-1 mt-1">
                  <MapPin size={12} /> {city}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
                  <Shield size={12} /> Verified Shopper
                </span>
              </div>
            </div>

            {/* Preferences Form */}
            <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                    <Sparkles size={16} className="text-blue-600" />
                    <span>Preferred Shopping Categories</span>
                  </h3>
                  <p className="text-xs text-slate-500 mb-3">
                    These categories receive priority weight (+20%) in your AI recommendation calculation.
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => handleToggleCat(cat)}
                        className={`rounded-2xl px-3.5 py-2 text-xs font-semibold transition ${
                          selectedCats.includes(cat)
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {selectedCats.includes(cat) ? "✓ " : "+ "}
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-5">
                  <h3 className="text-sm font-bold text-slate-900 mb-1">
                    Weather Priorities
                  </h3>
                  <p className="text-xs text-slate-500 mb-3">
                    Select the weather conditions you frequently need gear for.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {weatherOptions.map((opt) => (
                      <label
                        key={opt.id}
                        className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition ${
                          selectedWeathers.includes(opt.id)
                            ? "border-blue-600 bg-blue-50/50"
                            : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedWeathers.includes(opt.id)}
                          onChange={() => handleToggleWeather(opt.id)}
                          className="accent-blue-600"
                        />
                        <span className="text-xs font-semibold text-slate-800">
                          {opt.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-5 flex items-center justify-between">
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-blue-600 transition"
                  >
                    <span>Save AI Preferences</span>
                    <Check size={16} />
                  </button>

                  {savedSuccess && (
                    <span className="text-xs font-bold text-emerald-600">
                      ✓ Preferences updated successfully!
                    </span>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
