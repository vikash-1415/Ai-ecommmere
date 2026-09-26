import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Heart, Sparkles, MapPin, CloudRain, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="rounded-2xl bg-slate-900 p-2 text-white">
                <ShoppingBag size={20} />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                WeatherCart
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm leading-relaxed">
              AI-powered personalized e-commerce recommendation system adapting in real-time to your local atmosphere, temperature, and lifestyle preferences.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500 pt-2">
              <span className="flex items-center gap-1.5"><MapPin size={14} className="text-blue-600" /> Ahmedabad, IN</span>
              <span className="flex items-center gap-1.5"><CloudRain size={14} className="text-cyan-500" /> Live AI Engine</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link to="/" className="hover:text-blue-600 transition">Home</Link></li>
              <li><Link to="/products" className="hover:text-blue-600 transition">All Products</Link></li>
              <li><a href="#recommendations" className="hover:text-blue-600 transition">AI Recommendations</a></li>
              <li><a href="#categories" className="hover:text-blue-600 transition">Categories</a></li>
            </ul>
          </div>

          {/* Account & Shop */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Account
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link to="/cart" className="hover:text-blue-600 transition">Shopping Cart</Link></li>
              <li><Link to="/wishlist" className="hover:text-blue-600 transition">Wishlist</Link></li>
              <li><Link to="/profile" className="hover:text-blue-600 transition">Preferences & Profile</Link></li>
              <li><Link to="/admin" className="hover:text-blue-600 transition">Admin Dashboard</Link></li>
            </ul>
          </div>

          {/* College Project Badge / Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Project USP
            </h4>
            <div className="rounded-2xl bg-blue-50 p-3.5 border border-blue-100 text-xs text-blue-900 space-y-1.5">
              <p className="font-semibold flex items-center gap-1">
                <Sparkles size={14} className="text-blue-600" /> Hybrid ML Engine
              </p>
              <p className="text-[11px] text-blue-800 leading-relaxed">
                Combines weather tags, geolocation, user preferences, and real-time atmospheric APIs.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} WeatherCart. All rights reserved.</p>
          <p className="flex items-center gap-1 text-slate-500">
            Crafted with <Heart size={13} className="text-rose-500 fill-rose-500" /> for AI & Web Commerce Excellence
          </p>
        </div>
      </div>
    </footer>
  );
}
