import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Lock, Award, Server, CheckCircle2, UserCheck, ArrowRight } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { updateMeta } from "../../utils/seo";

export default function TrustCenter() {
  useEffect(() => {
    updateMeta({
      title: "Trust, Security & Safety Center | WeatherCart",
      description: "Learn about WeatherCart security infrastructure, 256-bit SSL encryption, tokenized payments, and authentic verified review policies.",
      canonical: `${window.location.origin}/trust`,
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-12 shadow-sm">
          
          <div className="border-b border-slate-100 pb-6 mb-8 text-center max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-3">
              <ShieldCheck size={14} /> Security, Veracity & Safety
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              WeatherCart Trust Center
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-500">
              How we safeguard your financial transactions, data privacy, and catalog authenticity.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mb-10">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <Lock size={24} className="text-indigo-600 mb-3" />
              <h2 className="text-sm font-bold text-slate-900">256-Bit SSL Encryption</h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Every byte transmitted between your browser and WeatherCart servers is protected with TLS 1.3 cryptographic protocols, preventing interception or packet snooping.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <Award size={24} className="text-emerald-600 mb-3" />
              <h2 className="text-sm font-bold text-slate-900">100% Verified Customer Reviews</h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                We only attach the green "Verified Purchase" badge to customer ratings after backend verification confirms an actual delivered order for that exact product SKU.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <Server size={24} className="text-blue-600 mb-3" />
              <h2 className="text-sm font-bold text-slate-900">Zero Raw Card Storage</h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Payment data is tokenized through PCI-DSS Level 1 compliant gateways. WeatherCart staff never have access to card numbers or banking credentials.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <UserCheck size={24} className="text-purple-600 mb-3" />
              <h2 className="text-sm font-bold text-slate-900">Right to Complete Deletion</h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                We believe in total user sovereignty. You can download your transaction data or permanently purge your account at any moment.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Have a security disclosure or question?</h3>
              <p className="text-xs text-slate-600">Reach our dedicated security response team directly.</p>
            </div>
            <Link
              to="/contact"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition flex items-center gap-1.5 shrink-0"
            >
              Contact Support <ArrowRight size={14} />
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
