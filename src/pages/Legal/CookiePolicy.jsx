import { useState, useEffect } from "react";
import { Cookie, Settings, CheckCircle2 } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { updateMeta } from "../../utils/seo";

export default function CookiePolicy() {
  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem("weathercart_cookie_consent");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return { essential: true, analytics: true, preferences: true, marketing: false };
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    updateMeta({
      title: "Cookie Policy & Privacy Preferences | WeatherCart",
      description: "Manage how WeatherCart stores essential session tokens, telemetry, and personalized recommendations cookies.",
      canonical: `${window.location.origin}/cookies`,
    });
  }, []);

  const handleSave = () => {
    localStorage.setItem("weathercart_cookie_consent", JSON.stringify(preferences));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-12 shadow-sm">
          
          <div className="border-b border-slate-100 pb-6 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold mb-3">
              <Cookie size={14} /> Tracking & Preferences
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Cookie Policy
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-500">
              Control and customize how data is stored in your browser.
            </p>
          </div>

          {/* Interactive Cookie Preference Center */}
          <div className="mb-10 p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <Settings size={18} className="text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">Your Privacy Consent Manager</h2>
            </div>

            <div className="space-y-4">
              {/* Essential */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200">
                <div>
                  <div className="text-xs font-bold text-slate-900">Strictly Necessary Cookies</div>
                  <div className="text-[11px] text-slate-500">Required for cart persistence, checkout, and security. Cannot be switched off.</div>
                </div>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">Always Active</span>
              </div>

              {/* Preferences */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200">
                <div>
                  <div className="text-xs font-bold text-slate-900">Personalization & Weather Context</div>
                  <div className="text-[11px] text-slate-500">Remembers your selected city and custom weather filter selections.</div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.preferences}
                  onChange={(e) => setPreferences({ ...preferences, preferences: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                />
              </div>

              {/* Analytics */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200">
                <div>
                  <div className="text-xs font-bold text-slate-900">Analytics & Performance</div>
                  <div className="text-[11px] text-slate-500">Aggregated anonymized traffic metrics to improve platform speed and uptime.</div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                />
              </div>

              {/* Marketing */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200">
                <div>
                  <div className="text-xs font-bold text-slate-900">Marketing & Promotional Dispatches</div>
                  <div className="text-[11px] text-slate-500">Personalized seasonal discount alerts and tailored product updates.</div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <button
                onClick={handleSave}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition shadow-sm"
              >
                Save Preferences
              </button>

              {savedSuccess && (
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5 animate-fadeIn">
                  <CheckCircle2 size={15} /> Preferences saved successfully!
                </span>
              )}
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed space-y-4">
            <h2 className="text-base font-bold text-slate-900">What are cookies?</h2>
            <p>
              Cookies and local browser storage are small text fragments preserved on your client device to provide fluid navigation, remember your cart items during navigation, and remember your authentication sessions.
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
