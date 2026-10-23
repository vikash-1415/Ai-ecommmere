import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Shield, Lock, Eye, MapPin, Database, UserCheck, RefreshCw } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { updateMeta, injectStructuredData, schemaGenerators } from "../../utils/seo";

export default function PrivacyPolicy() {
  useEffect(() => {
    updateMeta({
      title: "Privacy Policy | WeatherCart",
      description: "Understand how WeatherCart collects, encrypts, and handles meteorological telemetry, location context, and personal account information.",
      canonical: `${window.location.origin}/privacy`,
    });
    injectStructuredData(schemaGenerators.organization(), "privacy-org-schema");
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-12 shadow-sm">
          
          {/* Header */}
          <div className="border-b border-slate-100 pb-6 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3">
              <Shield size={14} /> Trust, Security & Compliance
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              WeatherCart Privacy Policy
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-500">
              Version 2.4 • Effective Date: October 2026 • Last Reviewed: October 22, 2026
            </p>
          </div>

          {/* Quick Summary Highlights Box */}
          <div className="mb-10 p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 grid sm:grid-cols-3 gap-4">
            <div className="flex items-start gap-2.5">
              <MapPin size={18} className="text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-slate-900">City-Level Geodata</div>
                <div className="text-[11px] text-slate-600 mt-0.5">We never store continuous GPS coordinates; only approximate city coordinates for weather matching.</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Lock size={18} className="text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-slate-900">No Raw Card Storage</div>
                <div className="text-[11px] text-slate-600 mt-0.5">All transactions pass through PCI-DSS Level 1 tokenized encrypted banking channels.</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <UserCheck size={18} className="text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-slate-900">Full Data Control</div>
                <div className="text-[11px] text-slate-600 mt-0.5">Request account data export or total data erasure at any time in account settings.</div>
              </div>
            </div>
          </div>

          {/* Detailed Content */}
          <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed space-y-6">
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">1. Overview & Commitment</h2>
              <p>
                WeatherCart ("we", "our", or "the platform") is committed to protecting the privacy of our visitors and registered users. This policy outlines how we collect, process, and protect your information when using our AI-assisted weather-recommendation e-commerce system.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">2. Information We Collect</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Account Information:</strong> Name, verified email address, hashed passwords, and shipping addresses.</li>
                <li><strong>Atmospheric & Location Data:</strong> Browser-reported latitude/longitude (converted into a broad city identifier) or manually selected city preferences used strictly to query meteorological APIs.</li>
                <li><strong>Order & Transaction Records:</strong> Purchased item SKUs, payment gateway transaction tokens, order delivery timestamps, and invoice snapshots.</li>
                <li><strong>Technical Telemetry:</strong> Device screen resolution, browser user-agent, session identifiers, and anonymized referral links.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">3. How Location & Weather Data is Utilized</h2>
              <p>
                WeatherCart queries trusted meteorological services (such as Open-Meteo and OpenWeatherMap) using your localized latitude/longitude. We use the resulting parameters (precipitation probability, ambient temperature, humidity percentage, and UV index) exclusively to sort catalog items into weather-relevant categories (e.g., waterproof jackets during rain, polarized eyewear during high UV).
              </p>
              <p className="mt-2 font-medium text-slate-800">
                You can revoke browser location permissions at any time or manually type your city name into the Weather Selector dropdown.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">4. Payment Security & Third-Party Gateways</h2>
              <p>
                WeatherCart never stores credit card numbers, CVVs, or bank net-banking passwords on our servers. Payment processing is delegated to compliant, certified payment aggregators using tokenized 256-bit SSL handshakes.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">5. Cookies and Local Storage</h2>
              <p>
                We use browser <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">localStorage</code> and necessary session cookies to preserve your cart items, guest checkout progress, recently searched queries, and authentication tokens. Please review our <Link to="/cookies" className="text-indigo-600 underline">Cookie Policy</Link> for configuration.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">6. Your Rights & Data Erasure</h2>
              <p>
                In compliance with global data privacy frameworks (including India's Digital Personal Data Protection Act and GDPR principles), you have the right to inspect, download an export of, or permanently erase all personal telemetry and order history associated with your profile.
              </p>
              <div className="mt-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-semibold text-slate-800">Need to delete your profile?</span>
                <p className="text-xs text-slate-600 mt-1">
                  Email our Data Protection Officer at <a href="mailto:privacy@weathercart.example.com" className="text-indigo-600 font-medium">privacy@weathercart.example.com</a> or visit your Account Settings to initiate account deletion.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">7. Contact Information</h2>
              <p>
                If you have inquiries regarding this Privacy Policy, please contact our Legal Compliance Desk at:
              </p>
              <div className="text-xs text-slate-600 mt-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>WeatherCart Technologies Pvt. Ltd.</div>
                <div>Compliance Officer: legal@weathercart.example.com</div>
                <div>Ahmedabad / Bengaluru, India</div>
              </div>
            </section>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
