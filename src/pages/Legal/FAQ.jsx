import { useState, useEffect, useMemo } from "react";
import { HelpCircle, ChevronDown, ChevronUp, Search, Sparkles } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { updateMeta, injectStructuredData, schemaGenerators } from "../../utils/seo";

const faqData = [
  {
    category: "Weather AI & Recommendations",
    question: "How does WeatherCart know what weather I am currently experiencing?",
    answer: "With your permission, your web browser shares approximate location coordinates (city/region level). WeatherCart queries live meteorological feeds to extract temperature, humidity percentage, atmospheric precipitation, and UV index, which then match against our categorized product catalog.",
  },
  {
    category: "Weather AI & Recommendations",
    question: "Can I use WeatherCart if I deny location access?",
    answer: "Absolutely! You can manually pick any city (such as Mumbai, Delhi, Bengaluru, Ahmedabad, London) from the weather dropdown in the top navigation bar at any time.",
  },
  {
    category: "Weather AI & Recommendations",
    question: "What happens if the weather changes suddenly?",
    answer: "Our weather telemetry syncs every 30 minutes or immediately when you change your location selector, updating your personalized 'Recommended for You' feed instantly.",
  },
  {
    category: "Orders & Shipping",
    question: "How long does standard delivery take?",
    answer: "Standard delivery typically arrives in 3 to 5 business days. Express air delivery reaches metro locations within 1 to 2 business days.",
  },
  {
    category: "Orders & Shipping",
    question: "Is shipping free?",
    answer: "Yes, all orders above ₹999 qualify for completely free delivery across India. Orders below ₹999 carry a nominal ₹49 flat shipping charge.",
  },
  {
    category: "Returns & Refunds",
    question: "What is your return policy window?",
    answer: "We offer a 7-day hassle-free return and exchange policy from the moment your shipment is delivered. Products must be unwashed with tags intact.",
  },
  {
    category: "Returns & Refunds",
    question: "How soon do I get my refund after returning an item?",
    answer: "UPI and QR code refunds are processed instantly or within 4 hours of courier pickup verification. Credit/debit card refunds credit within 3 to 5 business days.",
  },
  {
    category: "Payments & Coupons",
    question: "Which payment options are supported?",
    answer: "We support UPI (Google Pay, PhonePe, Paytm, BHIM), all major Credit/Debit Cards (Visa, MasterCard, RuPay), and Net Banking across 50+ banks.",
  },
  {
    category: "Payments & Coupons",
    question: "How do I apply a discount coupon?",
    answer: "On the Checkout page, you can select from available coupons (e.g. MONSOON20, WEATHER10) or enter a code into the coupon field and click Apply to enjoy immediate bill deductions.",
  },
];

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openIndexes, setOpenIndexes] = useState({});

  useEffect(() => {
    updateMeta({
      title: "Frequently Asked Questions (FAQ) | WeatherCart",
      description: "Find instant answers to questions regarding WeatherCart AI weather recommendations, orders, returns, and payments.",
      canonical: `${window.location.origin}/faq`,
    });
    injectStructuredData(schemaGenerators.faq(faqData), "faq-schema");
  }, []);

  const categories = useMemo(() => {
    const set = ["All"];
    faqData.forEach((f) => {
      if (!set.includes(f.category)) set.push(f.category);
    });
    return set;
  }, []);

  const filteredFaqs = useMemo(() => {
    return faqData.filter((f) => {
      const matchCat = selectedCategory === "All" || f.category === selectedCategory;
      const matchSearch =
        f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.answer.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [searchTerm, selectedCategory]);

  const toggleIndex = (idx) => {
    setOpenIndexes((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3">
              <HelpCircle size={14} /> Help & Knowledge Base
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              Clear answers regarding our meteorological algorithms, delivery windows, and refund procedures.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search questions by keyword (e.g. location, returns, UPI, waterproof)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Accordion Questions */}
          <div className="space-y-3">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, idx) => {
                const isOpen = !!openIndexes[idx];
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm transition"
                  >
                    <button
                      onClick={() => toggleIndex(idx)}
                      className="w-full px-5 py-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 hover:text-indigo-600 transition"
                    >
                      <span className="pr-4">{faq.question}</span>
                      {isOpen ? (
                        <ChevronUp size={18} className="text-slate-400 shrink-0" />
                      ) : (
                        <ChevronDown size={18} className="text-slate-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-600 border-t border-slate-100 leading-relaxed bg-slate-50/50">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
                <HelpCircle className="mx-auto text-slate-400 mb-2" size={32} />
                <h3 className="text-sm font-bold text-slate-800">No matching questions found</h3>
                <p className="text-xs text-slate-500 mt-1">Try different search keywords or reach out to our team.</p>
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
