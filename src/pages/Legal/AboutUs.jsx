import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CloudSun, Sparkles, Compass, ShieldCheck, Users, Award, ArrowRight } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { updateMeta } from "../../utils/seo";

export default function AboutUs() {
  useEffect(() => {
    updateMeta({
      title: "About Us | The WeatherCart Story",
      description: "Discover how WeatherCart combines real-time meteorological intelligence with smart e-commerce to ensure you're always dressed for the elements.",
      canonical: `${window.location.origin}/about`,
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pb-16">
        {/* Hero */}
        <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.2),transparent_60%)] pointer-events-none" />
          <div className="relative max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-semibold mb-4">
              <Sparkles size={13} /> The Atmospheric Commerce Vision
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Shopping That Adapts To The Sky Above You.
            </h1>
            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
              WeatherCart was born from a simple realization: human daily needs change with temperature, humidity, UV radiation, and rainfall. Why should your shopping experience stay static?
            </p>
          </div>
        </div>

        {/* Narrative Section */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-12 shadow-xl space-y-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3">Our Mission</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Traditional retail forces customers to wade through winter parkas during scorching summer months or summer sandals in the midst of monsoon floodings. WeatherCart integrates live atmospheric APIs with AI-driven product relevance scoring to present exactly what you need, exactly when Mother Nature demands it.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100">
                <Compass size={24} className="text-indigo-600 mb-2" />
                <h3 className="text-sm font-bold text-slate-900">Live Context Engine</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Processes live humidity, rain probability, and UV index every time you browse.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                <ShieldCheck size={24} className="text-emerald-600 mb-2" />
                <h3 className="text-sm font-bold text-slate-900">Tested Quality</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Every garment and accessory has verified hydrostatic ratings and UV-filtering certifications.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100">
                <Users size={24} className="text-purple-600 mb-2" />
                <h3 className="text-sm font-bold text-slate-900">Customer Centric</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Transparent recommendations, 7-day hassle-free returns, and privacy-respecting geodata.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Ready to explore intelligent shopping?</h3>
                <p className="text-xs text-slate-500">Check current recommendations based on your local sky.</p>
              </div>
              <Link
                to="/products"
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs inline-flex items-center gap-2 transition shadow-md shadow-indigo-600/20"
              >
                Browse Weather Catalog <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
