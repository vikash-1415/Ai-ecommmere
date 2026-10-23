import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  Clock, 
  Calendar, 
  ArrowLeft, 
  Share2, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  ThumbsUp, 
  ThumbsDown, 
  ShoppingBag, 
  ArrowRight,
  Bookmark,
  MessageCircleQuestion,
  HelpCircle
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { blogArticles } from "../../data/blogArticles";
import { api } from "../../services/api";
import { updateMeta, injectStructuredData, schemaGenerators } from "../../utils/seo";

export default function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [helpfulFeedback, setHelpfulFeedback] = useState(null); // 'yes' | 'no'
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Find article
  const article = useMemo(() => {
    return blogArticles.find((a) => a.slug === slug);
  }, [slug]);

  // Reading progress tracker
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Set SEO metadata & schemas
  useEffect(() => {
    if (article) {
      updateMeta({
        title: `${article.title} | WeatherCart Guides`,
        description: article.excerpt,
        canonical: `${window.location.origin}/blog/${article.slug}`,
        ogImage: article.coverImage,
        type: "article",
      });

      // Inject Article Schema
      injectStructuredData(schemaGenerators.article(article), "blog-article-schema");

      // Inject Breadcrumbs Schema
      injectStructuredData(
        schemaGenerators.breadcrumbs([
          { name: "Home", url: `${window.location.origin}/` },
          { name: "Blog", url: `${window.location.origin}/blog` },
          { name: article.category, url: `${window.location.origin}/blog` },
          { name: article.title, url: `${window.location.origin}/blog/${article.slug}` },
        ]),
        "blog-breadcrumbs-schema"
      );

      // Inject FAQ Schema if present
      if (article.faq && article.faq.length > 0) {
        injectStructuredData(schemaGenerators.faq(article.faq), "blog-faq-schema");
      }
    }
  }, [article]);

  // Load related products
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoadingProducts(true);
        const res = await api.getProducts("?limit=12");
        const allProds = res.products || [];
        if (article?.relatedProductIds && article.relatedProductIds.length > 0) {
          const matched = allProds.filter((p) =>
            article.relatedProductIds.includes(Number(p.id) || Number(p._id))
          );
          setRelatedProducts(matched.length > 0 ? matched : allProds.slice(0, 3));
        } else {
          setRelatedProducts(allProds.slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to fetch related products for blog", err);
      } finally {
        setLoadingProducts(false);
      }
    }
    loadProducts();
  }, [article]);

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h1 className="text-2xl font-bold text-slate-800">Article Not Found</h1>
          <p className="text-sm text-slate-500 mt-2">The guide you are looking for does not exist or has been moved.</p>
          <Link
            to="/blog"
            className="mt-4 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
          >
            ← Back to All Guides
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`${article.title} - Read on WeatherCart: ${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`${article.title} via @WeatherCart\n${window.location.href}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  // Find other articles for recommendations
  const otherArticles = blogArticles.filter((a) => a.id !== article.id).slice(0, 2);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-50 transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

      <Navbar />

      <main className="flex-1 pb-20">
        {/* Breadcrumb Navigation */}
        <div className="bg-white border-b border-slate-200">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 py-3 flex items-center gap-2 text-xs text-slate-500 overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-indigo-600">Home</Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-indigo-600">Blog</Link>
            <span>/</span>
            <span className="text-slate-400">{article.category}</span>
            <span>/</span>
            <span className="text-slate-800 font-medium truncate max-w-xs">{article.title}</span>
          </div>
        </div>

        {/* Article Header Container */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-8 pb-4">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-6 transition"
          >
            <ArrowLeft size={14} /> Back to all guides
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
              {article.category}
            </span>
            {article.tags.map((t) => (
              <span key={t} className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600">
                #{t}
              </span>
            ))}
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {article.title}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            {article.excerpt}
          </p>

          {/* Author and Metadata Bar */}
          <div className="mt-6 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-indigo-100"
              />
              <div>
                <div className="text-sm font-bold text-slate-900">{article.author.name}</div>
                <div className="text-xs text-slate-500">{article.author.role}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar size={13} /> {article.publishedAt}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock size={13} /> {article.readTime}
              </span>
            </div>
          </div>
        </div>

        {/* Hero Cover Image */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 my-6">
          <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-200 aspect-[16/9] sm:aspect-[21/9] bg-slate-900">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Article Body Content */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="grid md:grid-cols-12 gap-8 items-start">
            
            {/* Left Social & Floating Share */}
            <div className="hidden md:block md:col-span-1 sticky top-24 space-y-3">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center mb-1">
                Share
              </div>
              <button
                onClick={handleCopyLink}
                title="Copy Article Link"
                className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:border-indigo-300 transition shadow-sm"
              >
                {copied ? <Check size={16} className="text-emerald-600" /> : <Share2 size={16} />}
              </button>
              <button
                onClick={handleShareWhatsApp}
                title="Share on WhatsApp"
                className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 hover:bg-emerald-100 transition shadow-sm text-xs font-bold"
              >
                WA
              </button>
              <button
                onClick={handleShareTwitter}
                title="Share on X / Twitter"
                className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 transition shadow-sm text-xs font-bold"
              >
                𝕏
              </button>
            </div>

            {/* Main Article Content */}
            <div className="md:col-span-11 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm">
              
              {/* Formatted Content */}
              <div className="prose prose-slate max-w-none prose-headings:font-black prose-headings:tracking-tight prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2 prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-4 prose-li:text-slate-700 prose-strong:text-slate-950">
                {article.content.split("\n\n").map((block, idx) => {
                  const trimmed = block.trim();
                  if (!trimmed) return null;

                  if (trimmed.startsWith("### ")) {
                    return (
                      <h3 key={idx} className="text-lg font-bold text-slate-900 mt-6 mb-2">
                        {trimmed.replace("### ", "")}
                      </h3>
                    );
                  }
                  if (trimmed.startsWith("## ")) {
                    return (
                      <h2 key={idx} className="text-2xl font-black text-slate-900 mt-8 mb-4 border-b border-slate-100 pb-2">
                        {trimmed.replace("## ", "")}
                      </h2>
                    );
                  }
                  if (trimmed.startsWith("- ")) {
                    const items = trimmed.split("\n").map((line) => line.replace(/^- /, ""));
                    return (
                      <ul key={idx} className="list-disc pl-5 my-3 space-y-1.5 text-slate-700 text-sm">
                        {items.map((it, i) => (
                          <li key={i}>{it}</li>
                        ))}
                      </ul>
                    );
                  }
                  if (/^\d+\./.test(trimmed)) {
                    const items = trimmed.split("\n").map((line) => line.replace(/^\d+\.\s*/, ""));
                    return (
                      <ol key={idx} className="list-decimal pl-5 my-3 space-y-1.5 text-slate-700 text-sm">
                        {items.map((it, i) => (
                          <li key={i}>{it}</li>
                        ))}
                      </ol>
                    );
                  }

                  return (
                    <p key={idx} className="text-slate-700 leading-relaxed text-sm sm:text-base my-3">
                      {trimmed}
                    </p>
                  );
                })}
              </div>

              {/* Related Weather-Specific Products Embed */}
              <div className="mt-12 pt-8 border-t border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ShoppingBag size={18} className="text-indigo-600" />
                    <h3 className="text-base font-bold text-slate-900">
                      Recommended Gear Mentioned in this Guide
                    </h3>
                  </div>
                  <Link
                    to="/products"
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  >
                    Browse Catalog <ArrowRight size={12} />
                  </Link>
                </div>

                {loadingProducts ? (
                  <div className="grid sm:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-32 rounded-xl bg-slate-100 animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-3 gap-4">
                    {relatedProducts.slice(0, 3).map((prod) => (
                      <Link
                        key={prod.id || prod._id}
                        to={`/products/${prod.id || prod._id}`}
                        className="group flex flex-col p-3 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-300 hover:shadow-md transition"
                      >
                        <div className="aspect-video rounded-xl overflow-hidden bg-slate-200 mb-2">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                          />
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 line-clamp-1">
                          {prod.name}
                        </h4>
                        <div className="mt-1 flex items-center justify-between text-xs">
                          <span className="font-bold text-indigo-700">₹{prod.price?.toLocaleString()}</span>
                          <span className="text-[11px] text-slate-500 font-medium">★ {prod.ratingAverage || 4.5}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* FAQ Accordion Section */}
              {article.faq && article.faq.length > 0 && (
                <div className="mt-12 pt-8 border-t border-slate-100">
                  <div className="flex items-center gap-2 mb-4">
                    <HelpCircle size={18} className="text-indigo-600" />
                    <h3 className="text-base font-bold text-slate-900">Frequently Asked Questions</h3>
                  </div>

                  <div className="space-y-3">
                    {article.faq.map((faqItem, idx) => {
                      const isOpen = openFaqIndex === idx;
                      return (
                        <div
                          key={idx}
                          className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50/60"
                        >
                          <button
                            onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                            className="w-full px-4 py-3 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800 hover:text-indigo-600 transition"
                          >
                            <span>{faqItem.question}</span>
                            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                          {isOpen && (
                            <div className="px-4 pb-3 pt-1 text-xs text-slate-600 border-t border-slate-100 leading-relaxed bg-white">
                              {faqItem.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Article Helpful Feedback */}
              <div className="mt-10 p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs font-medium text-slate-700 text-center sm:text-left">
                  Did this weather guide help you choose the right gear?
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setHelpfulFeedback("yes")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      helpfulFeedback === "yes"
                        ? "bg-emerald-600 text-white"
                        : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <ThumbsUp size={13} /> {helpfulFeedback === "yes" ? "Helpful ✓" : "Yes"}
                  </button>
                  <button
                    onClick={() => setHelpfulFeedback("no")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      helpfulFeedback === "no"
                        ? "bg-slate-800 text-white"
                        : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <ThumbsDown size={13} /> {helpfulFeedback === "no" ? "Feedback recorded" : "No"}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Read Next Section */}
        {otherArticles.length > 0 && (
          <div className="mx-auto max-w-4xl px-4 sm:px-6 mt-16 pt-10 border-t border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-6">More Weather Intelligence Guides</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {otherArticles.map((art) => (
                <Link
                  key={art.id}
                  to={`/blog/${art.slug}`}
                  className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
                >
                  <div className="aspect-[16/9] bg-slate-100 overflow-hidden">
                    <img
                      src={art.coverImage}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 line-clamp-2">
                      {art.title}
                    </h3>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                      <span>{art.category}</span>
                      <span className="font-semibold text-indigo-600 group-hover:translate-x-0.5 transition flex items-center gap-1">
                        Read <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
