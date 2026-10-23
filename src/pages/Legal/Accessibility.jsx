import { useEffect } from "react";
import { Eye, Keyboard, Contrast, Volume2, Sparkles } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { updateMeta } from "../../utils/seo";

export default function Accessibility() {
  useEffect(() => {
    updateMeta({
      title: "Accessibility Statement | WeatherCart",
      description: "WeatherCart is committed to digital inclusivity: WCAG 2.1 AA compliance, keyboard navigation, screen-reader support, and reduced motion modes.",
      canonical: `${window.location.origin}/accessibility`,
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-12 shadow-sm">
          
          <div className="border-b border-slate-100 pb-6 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3">
              <Eye size={14} /> Digital Inclusivity & Standards
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Accessibility Statement
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-500">
              Conformance to Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.
            </p>
          </div>

          <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">Our Commitment</h2>
              <p>
                WeatherCart believes that digital shopping must be accessible to everyone, including individuals with visual, auditory, motor, or cognitive impairments. We continuously optimize our interface according to the World Wide Web Consortium (W3C) guidelines.
              </p>
            </section>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <Keyboard size={20} className="text-indigo-600 mb-2" />
                <h3 className="text-xs font-bold text-slate-900">Full Keyboard Navigation</h3>
                <p className="text-xs text-slate-600 mt-1">
                  All interactive menus, modals, search suggestions, and checkout forms can be navigated using Tab, Shift+Tab, Arrow keys, and Enter.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <Contrast size={20} className="text-indigo-600 mb-2" />
                <h3 className="text-xs font-bold text-slate-900">Contrast & Readability</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Typography utilizes high-contrast ratios (minimum 4.5:1 for normal body text) against backgrounds to facilitate effortless readability.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <Volume2 size={20} className="text-indigo-600 mb-2" />
                <h3 className="text-xs font-bold text-slate-900">Screen Reader Optimization</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Semantic HTML tags, descriptive <code className="bg-slate-200 px-1 rounded text-[11px]">aria-label</code> tags, and meaningful alternative image texts.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <Sparkles size={20} className="text-indigo-600 mb-2" />
                <h3 className="text-xs font-bold text-slate-900">Reduced Motion Support</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Respects operating system level <code className="bg-slate-200 px-1 rounded text-[11px]">prefers-reduced-motion</code> settings to prevent vestibular discomfort.
                </p>
              </div>
            </div>

            <section className="pt-4">
              <h2 className="text-base font-bold text-slate-900 mb-2">Feedback & Assistance</h2>
              <p>
                If you encounter any accessibility barriers while browsing WeatherCart, please contact our Accessibility Coordinator at <a href="mailto:accessibility@weathercart.example.com" className="text-indigo-600 font-semibold underline">accessibility@weathercart.example.com</a>.
              </p>
            </section>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
