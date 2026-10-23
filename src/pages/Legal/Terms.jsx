import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FileText, CheckCircle2, AlertCircle } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { updateMeta } from "../../utils/seo";

export default function Terms() {
  useEffect(() => {
    updateMeta({
      title: "Terms and Conditions | WeatherCart",
      description: "Read the complete terms of service governing user accounts, weather-based recommendations, purchases, and orders on WeatherCart.",
      canonical: `${window.location.origin}/terms`,
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-12 shadow-sm">
          
          <div className="border-b border-slate-100 pb-6 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-3">
              <FileText size={14} /> Legal Agreement
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Terms & Conditions of Service
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-500">
              Version 1.8 • Last Updated: October 2026
            </p>
          </div>

          <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed space-y-6">
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">1. Acceptance of Terms</h2>
              <p>
                By accessing, browsing, or completing a transaction on WeatherCart ("Website" or "Service"), you agree to be bound by these Terms and Conditions. If you do not agree with any provision, please discontinue using the service immediately.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">2. Eligibility & Account Security</h2>
              <p>
                You must be at least 18 years of age or possess legal parental/guardian consent to make purchases. You are responsible for safeguarding your login credentials. WeatherCart cannot and will not be liable for any unauthorized access resulting from your failure to maintain confidential passwords.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">3. Product Catalog, Pricing & Stock Availability</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>All prices listed on WeatherCart are in Indian Rupees (INR) and are inclusive of applicable GST unless explicitly stated otherwise.</li>
                <li>While we strive for 100% price accuracy, human or technical discrepancies may occur. Backend verification is authoritative; in the rare event of a mispriced product, WeatherCart reserves the right to cancel the order and provide a full refund.</li>
                <li>Adding an item to your Cart does not constitute a reservation of physical warehouse stock until checkout payment is completed.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">4. AI Weather Recommendation Disclaimer</h2>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 flex items-start gap-3 text-xs leading-relaxed">
                <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Important Notice:</strong> Our weather-aware product suggestions are algorithmically generated using third-party meteorological feeds. WeatherCart does not guarantee absolute forecasting accuracy for micro-climate shifts, storm trajectories, or sudden regional temperature anomalies. Users are advised to exercise personal judgment when selecting outdoor survival gear.
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">5. Promotional Coupons & Abuse Prevention</h2>
              <p>
                Discount coupons (e.g. MONSOON20, WEATHER10) must be entered at checkout before completing payment. Coupons are subject to minimum cart value criteria, single-use limits per account, and promotional expiry windows. Any attempt to exploit coupon logic or use automated scrapers will result in immediate order cancellation and account suspension.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">6. Shipping, Returns & Cancellations</h2>
              <p>
                Orders may be cancelled free of charge before fulfillment packaging. Please refer to our detailed <Link to="/shipping" className="text-indigo-600 underline">Shipping Policy</Link> and <Link to="/returns" className="text-indigo-600 underline">Return Policy</Link> for exact windows, eligible criteria, and refund timelines.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">7. Governing Law & Jurisdiction</h2>
              <p>
                These terms shall be governed and interpreted under the laws of the Republic of India. Any legal dispute or claim arising out of these terms shall be subject to the exclusive jurisdiction of the competent courts in Ahmedabad, Gujarat.
              </p>
            </section>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
