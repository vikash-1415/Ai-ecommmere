import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CloudOff, Search, Home, ArrowRight, Compass } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { updateMeta } from "../../utils/seo";

export default function NotFound() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    updateMeta({
      title: "404 - Page Not Found | WeatherCart",
      description: "The requested page could not be located on WeatherCart. Use our search or browse weather-tailored collections.",
    });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6">
        <div className="max-w-lg w-full text-center">
          
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto text-indigo-600 shadow-sm animate-bounce">
              <CloudOff size={44} />
            </div>
            <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[11px] font-black">
              404
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Lost in the Cloud Cover?
          </h1>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
            The page you are looking for has been moved, renamed, or evaporated into thin air. Let's get you back on track!
          </p>

          {/* Quick Search */}
          <form onSubmit={handleSearch} className="mt-6 flex gap-2 max-w-sm mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search products or weather gear..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition"
            >
              Search
            </button>
          </form>

          {/* Quick Links */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <Link
              to="/"
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold inline-flex items-center gap-1.5 hover:bg-slate-800 transition shadow-sm"
            >
              <Home size={14} /> Back to Home
            </Link>

            <Link
              to="/products"
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold inline-flex items-center gap-1.5 hover:bg-slate-100 transition shadow-sm"
            >
              <Compass size={14} /> Browse Catalog
            </Link>

            <Link
              to="/blog"
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold inline-flex items-center gap-1.5 hover:bg-slate-100 transition shadow-sm"
            >
              Read Guides
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
