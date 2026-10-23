import { useEffect } from "react";
import { Truck, Zap, PackageCheck, MapPin } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { updateMeta } from "../../utils/seo";

export default function ShippingPolicy() {
  useEffect(() => {
    updateMeta({
      title: "Shipping & Delivery Policy | WeatherCart",
      description: "Fast nationwide shipping options: Standard Delivery (3-5 days, free above ₹999) and Express Delivery (1-2 days) across all Indian pin codes.",
      canonical: `${window.location.origin}/shipping`,
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-12 shadow-sm">
          
          <div className="border-b border-slate-100 pb-6 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3">
              <Truck size={14} /> Nationwide Logistics
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Shipping & Delivery Policy
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-500">
              Reliable delivery timelines, partner couriers, and transparent shipping charges.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm mb-1">
                <Truck size={18} /> Standard Delivery
              </div>
              <div className="text-xl font-black text-slate-900">3 – 5 Business Days</div>
              <p className="text-xs text-slate-600 mt-1">
                ₹49 flat rate for orders below ₹999. <strong className="text-emerald-600">FREE on orders ₹999 and above!</strong>
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-100">
              <div className="flex items-center gap-2 text-purple-700 font-bold text-sm mb-1">
                <Zap size={18} /> Express Air Shipping
              </div>
              <div className="text-xl font-black text-slate-900">1 – 2 Business Days</div>
              <p className="text-xs text-slate-600 mt-1">
                ₹149 expedited air delivery. Ideal for sudden storm warnings or immediate weekend treks.
              </p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed space-y-6">
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">1. Courier & Fulfillment Network</h2>
              <p>
                WeatherCart partners with leading logistics providers including Blue Dart, Delhivery, DTDC, and Xpressbees. All parcels are packaged in recyclable water-repellent protective cartons to ensure rain and moisture do not compromise items during transit.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">2. Live Order Tracking</h2>
              <p>
                As soon as your shipment is dispatched from our automated climate-controlled fulfillment hub, you will receive an SMS and email notification containing your unique AWB tracking number. You can also view live status updates directly in your <span className="text-indigo-600 font-semibold">My Orders</span> tab.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">3. Serviceable Pin Codes</h2>
              <p>
                We service over 19,000 pin codes across all states and Union Territories in India. For remote hill stations or extreme weather zones, delivery timelines may occasionally experience 24–48 hours of weather-induced road delay.
              </p>
            </section>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
