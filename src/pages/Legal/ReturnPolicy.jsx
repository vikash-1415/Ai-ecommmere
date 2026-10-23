import { useEffect } from "react";
import { Link } from "react-router-dom";
import { RotateCcw, CheckCircle, Clock, AlertTriangle, HelpCircle } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { updateMeta } from "../../utils/seo";

export default function ReturnPolicy() {
  useEffect(() => {
    updateMeta({
      title: "Return & Refund Policy | WeatherCart",
      description: "Learn about our hassle-free 7-day return policy, eligible items, door-step pickup, and instant UPI / bank refund procedures.",
      canonical: `${window.location.origin}/returns`,
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-12 shadow-sm">
          
          <div className="border-b border-slate-100 pb-6 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-3">
              <RotateCcw size={14} /> 7-Day Guarantee
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Returns & Refund Policy
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-500">
              Clear, transparent rules for hassle-free replacements and refunds.
            </p>
          </div>

          {/* Stepper highlight */}
          <div className="mb-10 grid sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold mb-2">1</span>
              <h3 className="text-xs font-bold text-slate-900">Request Return</h3>
              <p className="text-[11px] text-slate-600 mt-1">Navigate to My Orders within 7 days of delivery and click "Return Item".</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold mb-2">2</span>
              <h3 className="text-xs font-bold text-slate-900">Doorstep Pickup</h3>
              <p className="text-[11px] text-slate-600 mt-1">Our courier will verify tags and pick up the package within 48 hours at zero cost.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold mb-2">3</span>
              <h3 className="text-xs font-bold text-slate-900">Instant Refund</h3>
              <p className="text-[11px] text-slate-600 mt-1">Once verified, refund is disbursed directly to your original payment mode (UPI/Card).</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed space-y-6">
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">1. 7-Day Hassle-Free Returns Window</h2>
              <p>
                We want you to be completely satisfied with your weather gear. If a raincoat sizing doesn't fit or outdoor footwear feels tight, you may return any unused item in its original condition within 7 days of delivery.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">2. Conditions for Return</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Products must have all original brand tags, hydro-repellency seals, and labels intact.</li>
                <li>Items must be unused, unwashed, and free of dirt, mud, or wear scents.</li>
                <li>Electronics (like portable weather sensors or hand warmers) must include all cables and accessories in original box packaging.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">3. Non-Returnable Categories</h2>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                For hygiene reasons, thermal underwear, base layer socks, and opened sunscreen/skincare tubes cannot be returned once the protective seal is unfastened unless received defective.
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">4. Refund Methods & Timelines</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-800 bg-slate-50">
                      <th className="py-2.5 px-3">Payment Method</th>
                      <th className="py-2.5 px-3">Refund Destination</th>
                      <th className="py-2.5 px-3">Estimated Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    <tr>
                      <td className="py-2 px-3 font-semibold text-slate-800">UPI / QR Code</td>
                      <td className="py-2 px-3">Direct to linked VPA</td>
                      <td className="py-2 px-3 text-emerald-600 font-semibold">Instant to 4 hours</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold text-slate-800">Credit / Debit Card</td>
                      <td className="py-2 px-3">Original bank account</td>
                      <td className="py-2 px-3">3–5 business days</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold text-slate-800">Net Banking</td>
                      <td className="py-2 px-3">Bank account via NEFT</td>
                      <td className="py-2 px-3">2–4 business days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
