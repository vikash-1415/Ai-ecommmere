import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Cookie, Shield, X } from "lucide-react";

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("weathercart_cookie_consent");
    if (!consent) {
      // Delay slightly for smooth non-intrusive entrance
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(
      "weathercart_cookie_consent",
      JSON.stringify({ essential: true, analytics: true, preferences: true, marketing: true, timestamp: Date.now() })
    );
    setIsVisible(false);
  };

  const handleRejectNonEssential = () => {
    localStorage.setItem(
      "weathercart_cookie_consent",
      JSON.stringify({ essential: true, analytics: false, preferences: false, marketing: false, timestamp: Date.now() })
    );
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-slideUp">
      <div className="bg-slate-950/95 backdrop-blur-md text-white border border-white/10 rounded-3xl p-5 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
            <Cookie size={18} />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white">We Respect Your Privacy</h3>
              <button
                onClick={() => setIsVisible(false)}
                className="text-slate-400 hover:text-white transition p-1"
                aria-label="Dismiss banner"
              >
                <X size={14} />
              </button>
            </div>

            <p className="mt-1 text-[11px] text-slate-300 leading-relaxed">
              We use necessary cookies for cart checkout and optional cookies for local weather matching. Read our{" "}
              <Link to="/privacy" className="text-indigo-400 underline hover:text-indigo-300">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link to="/cookies" className="text-indigo-400 underline hover:text-indigo-300">
                Cookie Policy
              </Link>.
            </p>

            <div className="mt-3.5 flex flex-wrap items-center gap-2">
              <button
                onClick={handleAcceptAll}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold transition shadow-sm"
              >
                Accept All
              </button>

              <button
                onClick={handleRejectNonEssential}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-[11px] font-medium transition"
              >
                Reject Non-Essential
              </button>

              <Link
                to="/cookies"
                onClick={() => setIsVisible(false)}
                className="text-[11px] text-slate-400 hover:text-white underline ml-auto py-1"
              >
                Customize
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
