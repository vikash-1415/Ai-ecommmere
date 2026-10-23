import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  Clock, 
  Calendar, 
  ArrowRight, 
  Sparkles, 
  CloudRain, 
  Sun, 
  Snowflake, 
  Bookmark, 
  TrendingUp, 
  BookOpen
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { blogArticles } from "../../data/blogArticles";
import { updateMeta, injectStructuredData, schemaGenerators } from "../../utils/seo";

export default function BlogHome() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    updateMeta({
      title: "Weather & Shopping Intelligence Blog | WeatherCart",
      description: "Explore in-depth seasonal gear guides, monsoon waterproof technology, heatwave sun defense, and cold weather layering guides.",
      canonical: `${window.location.origin}/blog`,
    });
    injectStructuredData(schemaGenerators.organization(), "blog-org-schema");
  }, []);

  const categories = useMemo(() => {
    const cats = ["All"];
    blogArticles.forEach((art) => {
      if (!cats.includes(art.category)) cats.push(art.category);
    });
    return cats;
  }, []);

  const featuredArticle = useMemo(() => {
    return blogArticles.find((art) => art.featured) || blogArticles[0];
  }, []);

  const filteredArticles = useMemo(() => {
    return blogArticles.filter((art) => {
      const matchesCategory =
        selectedCategory === "All" || art.category === selectedCategory;
      const matchesSearch =
        art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        art.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        art.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pb-16">
        {/* Blog Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_50%)] pointer-events-none" />
          
          <div className="relative mx-auto max-w-6xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-semibold mb-4 backdrop-blur-sm">
              <Sparkles size={14} className="text-indigo-400" />
              <span>WeatherCart Intelligence & Research</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-3xl">
              Meteorological Insights for Smarter Everyday Living.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Curated guides on technical textiles, atmospheric protection, and real-time gear selection built to withstand rainstorms, heatwaves, and freeze alerts.
            </p>

            {/* Quick Stats / Weather Badges */}
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300">
                <CloudRain size={14} className="text-blue-400" /> Monsoon Gear Science
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300">
                <Sun size={14} className="text-amber-400" /> UV Index & Heat Defense
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300">
                <Snowflake size={14} className="text-cyan-400" /> 3-Layer Thermal Dynamics
              </span>
            </div>
          </div>
        </div>

        {/* Search & Category Filter Navigation */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 -mt-7 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/80 p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search articles, guides, hydro-ratings, UPF fabrics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/20"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Content Container */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-12">
          
          {/* Featured Article Card (Shown when on "All" and no search query) */}
          {selectedCategory === "All" && !searchTerm && featuredArticle && (
            <div className="mb-14">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={18} className="text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider text-xs">Featured Editorial</h2>
              </div>

              <Link
                to={`/blog/${featuredArticle.slug}`}
                className="group block relative rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-lg hover:shadow-2xl transition duration-500"
              >
                <div className="grid md:grid-cols-12 gap-0 items-stretch">
                  <div className="md:col-span-7 relative min-h-[280px] sm:min-h-[360px] overflow-hidden">
                    <img
                      src={featuredArticle.coverImage}
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent md:hidden" />
                    <span className="absolute top-4 left-4 bg-indigo-600/90 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md shadow-md">
                      {featuredArticle.category}
                    </span>
                  </div>

                  <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar size={13} /> {featuredArticle.publishedAt}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={13} /> {featuredArticle.readTime}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition leading-snug">
                        {featuredArticle.title}
                      </h3>

                      <p className="mt-3 text-sm text-slate-600 line-clamp-3 leading-relaxed">
                        {featuredArticle.excerpt}
                      </p>
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={featuredArticle.author.avatar}
                          alt={featuredArticle.author.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900">{featuredArticle.author.name}</div>
                          <div className="text-[11px] text-slate-500">{featuredArticle.author.role}</div>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition">
                        Read Guide <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Articles Grid Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">
                {searchTerm
                  ? `Search results for "${searchTerm}"`
                  : selectedCategory === "All"
                  ? "Latest Articles & Guides"
                  : `${selectedCategory}`}
              </h2>
            </div>
            <span className="text-xs font-medium text-slate-500">
              Showing {filteredArticles.length} {filteredArticles.length === 1 ? "article" : "articles"}
            </span>
          </div>

          {/* Articles Grid */}
          {filteredArticles.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/blog/${article.slug}`}
                  className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Article Thumbnail */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      loading="lazy"
                    />
                    <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-md">
                      {article.category}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Meta */}
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-2">
                        <span>{article.publishedAt}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={11} /> {article.readTime}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition line-clamp-2 leading-snug">
                        {article.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {article.excerpt}
                      </p>
                    </div>

                    {/* Footer Author & CTA */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={article.author.avatar}
                          alt={article.author.name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <span className="text-xs font-medium text-slate-700">{article.author.name}</span>
                      </div>

                      <span className="text-xs font-bold text-indigo-600 group-hover:translate-x-0.5 transition inline-flex items-center gap-1">
                        Read <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8">
              <Search className="mx-auto text-slate-400 mb-3" size={36} />
              <h3 className="text-lg font-bold text-slate-800">No articles found</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                We couldn't find any guides matching "{searchTerm}". Try clearing your filters or search keywords.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Newsletter / Weather Alerts Subscription */}
          <div className="mt-16 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-12 text-white text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.2),transparent_50%)] pointer-events-none" />
            <div className="relative max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-indigo-300 mb-3">
                <Sparkles size={12} /> Never Get Caught Unprepared
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Get Weekly Weather Forecasts & Smart Product Dispatches
              </h2>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                Join 18,000+ conscious consumers receiving proactive warnings for sudden temperature drops, high UV alerts, and tailored footwear advisories.
              </p>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Thank you for subscribing to WeatherCart Weather Dispatches!");
                }}
                className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/15"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-sm text-white transition shadow-lg shadow-indigo-600/30"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
