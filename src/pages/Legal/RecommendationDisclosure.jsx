import { useEffect } from "react";
import { Sparkles, Cpu, Eye, CloudRain, Sun, Snowflake, CheckCircle } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { updateMeta } from "../../utils/seo";

export default function RecommendationDisclosure() {
  useEffect(() => {
    updateMeta({
      title: "AI Recommendation Transparency & Disclosure | WeatherCart",
      description: "Learn how the WeatherCart recommendation algorithm evaluates weather data, temperature bands, and user browsing context.",
      canonical: `${window.location.origin}/recommendations-disclosure`,
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-12 shadow-sm">
          
          <div className="border-b border-slate-100 pb-6 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3">
              <Sparkles size={14} /> AI Transparency & Explainability
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Recommendation System Disclosure
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-500">
              Understanding why specific products appear in your "Recommended for You" carousel.
            </p>
          </div>

          <div className="space-y-8 text-sm text-slate-700 leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">1. Algorithmic Principles</h2>
              <p>
                At WeatherCart, we believe in transparent, explainable AI. We do not use opaque black-box models to manipulate customer behavior or bias search results toward high-margin sponsored items. Our ranking algorithm combines four measurable weights:
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                    <CloudRain size={16} className="text-blue-500" /> Weather Match (40% Weight)
                  </div>
                  <p className="text-xs text-slate-600">
                    Product weather tags (<code className="bg-slate-200 px-1 rounded text-[11px]">rainy</code>, <code className="bg-slate-200 px-1 rounded text-[11px]">sunny</code>, <code className="bg-slate-200 px-1 rounded text-[11px]">winter</code>, <code className="bg-slate-200 px-1 rounded text-[11px]">all-weather</code>) matching your current atmospheric conditions.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                    <Eye size={16} className="text-indigo-500" /> Category Affinity (25% Weight)
                  </div>
                  <p className="text-xs text-slate-600">
                    Categories you have recently viewed or placed in your Wishlist during your active shopping session.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                    <Sparkles size={16} className="text-amber-500" /> Customer Ratings & Trust (20% Weight)
                  </div>
                  <p className="text-xs text-slate-600">
                    Weighted Bayesian average based on verified customer reviews, eliminating low-reputation or defective items.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                    <Cpu size={16} className="text-emerald-500" /> Stock Readiness (15% Weight)
                  </div>
                  <p className="text-xs text-slate-600">
                    Prioritizes products physically in-stock and ready for immediate fulfillment dispatch from our closest logistics node.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">2. What Data We Never Use</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>We do not track off-platform browsing behavior or sell telemetry to advertising brokers.</li>
                <li>We do not perform dynamic pricing surge based on weather panic (e.g. inflating umbrella prices during sudden cloudbursts). Product pricing remains constant regardless of storm intensity.</li>
                <li>We do not record exact residential GPS addresses for recommendations; only approximate municipal city-level weather indices.</li>
              </ul>
            </section>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
