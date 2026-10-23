import { Link } from "react-router-dom";
import { ShoppingBag, CloudRain, ShieldCheck, Heart, Sparkles } from "lucide-react";

const Instagram = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const Twitter = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const Github = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
    <path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white pt-14 pb-8 px-4 sm:px-6 lg:px-8 border-t border-white/5 font-sans">
      <div className="mx-auto max-w-7xl">
        
        {/* Main 4-column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info (2 cols on large) */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 p-2 text-white shadow-md">
                <ShoppingBag size={18} />
              </div>
              <span className="text-xl font-black tracking-tight">
                Weather<span className="text-indigo-400">Cart</span>
              </span>
            </Link>

            <p className="mt-3.5 text-xs text-slate-400 leading-relaxed max-w-sm">
              The world's first weather-intelligent e-commerce engine. We match atmospheric sensors, real-time UV, humidity and precipitation with specialized functional gear.
            </p>

            <div className="mt-5 flex items-center gap-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition"
                aria-label="Twitter"
              >
                <Twitter size={15} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition"
                aria-label="Instagram"
              >
                <Instagram size={15} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition"
                aria-label="GitHub"
              >
                <Github size={15} />
              </a>
            </div>

            <div className="mt-6 flex items-center gap-2 text-[11px] text-slate-500">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Meteorological Telemetry Active</span>
            </div>
          </div>

          {/* Column 2: Shop & Weather */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Shop Collections
            </h3>
            <ul className="mt-3.5 space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/products" className="hover:text-white transition">All Products</Link>
              </li>
              <li>
                <Link to="/products?weather=rainy" className="hover:text-white transition">Monsoon & Waterproof</Link>
              </li>
              <li>
                <Link to="/products?weather=sunny" className="hover:text-white transition">Summer UV & Sun Defense</Link>
              </li>
              <li>
                <Link to="/products?weather=winter" className="hover:text-white transition">Thermal Winter Layering</Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-white transition">My Wishlist</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Help & Orders */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Help & Support
            </h3>
            <ul className="mt-3.5 space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/orders" className="hover:text-white transition">Track Your Orders</Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-white transition">Shipping & Delivery</Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-white transition">Returns & Refunds</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition">FAQ & Knowledge Base</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">Contact Helpdesk</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Trust, Content & Legal */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Trust & Legal
            </h3>
            <ul className="mt-3.5 space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/blog" className="hover:text-white transition">Weather & Gear Blog</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">About Our Vision</Link>
              </li>
              <li>
                <Link to="/recommendations-disclosure" className="hover:text-white transition">AI Recommendation Transparency</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition">Terms of Service</Link>
              </li>
              <li>
                <Link to="/cookies" className="hover:text-white transition">Cookie Preferences</Link>
              </li>
              <li>
                <Link to="/trust" className="hover:text-white transition">Trust & Safety Center</Link>
              </li>
              <li>
                <Link to="/accessibility" className="hover:text-white transition">Accessibility</Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} WeatherCart Technologies Pvt. Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-slate-400">Privacy</Link>
            <Link to="/terms" className="hover:text-slate-400">Terms</Link>
            <Link to="/sitemap.xml" target="_blank" className="hover:text-slate-400">Sitemap</Link>
            <Link to="/trust" className="hover:text-slate-400">Security</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
