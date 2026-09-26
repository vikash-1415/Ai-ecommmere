import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Compass,
  LayoutDashboard,
  LogOut,
  Sparkles,
  CloudRain,
  Sun,
  Snowflake,
  Wind
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useWeather } from "../../context/WeatherContext";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { totalItems } = useCart();
  const { wishlistCount } = useWishlist();
  const { city, weatherData, switchWeatherPreset, weatherMode } = useWeather();
  const { user, logout } = useAuth();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Recommendations", path: "/#recommendations" },
    { name: "Categories", path: "/#categories" },
    { name: "How It Works", path: "/#how-it-works" }
  ];

  const getWeatherIcon = () => {
    switch (weatherMode) {
      case "sunny":
        return <Sun size={14} className="text-amber-500" />;
      case "cold":
        return <Snowflake size={14} className="text-cyan-400" />;
      case "windy":
        return <Wind size={14} className="text-teal-400" />;
      default:
        return <CloudRain size={14} className="text-blue-500" />;
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="rounded-2xl bg-gradient-to-tr from-slate-950 via-slate-900 to-blue-700 p-2 text-white shadow-md">
              <ShoppingBag size={20} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-slate-900">
                  WeatherCart
                </span>
                <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[9px] font-semibold text-blue-700 uppercase">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden min-[400px]:block">
                Smart Weather Commerce
              </p>
            </div>
          </Link>

          {/* Desktop Weather Indicator Pill */}
          <div className="hidden lg:flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50/80 px-3.5 py-1.5 text-xs text-slate-700 shadow-sm">
            <span className="flex items-center gap-1 font-medium text-slate-900">
              📍 {city}
            </span>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1">
              {getWeatherIcon()}
              <span>
                {weatherData.temp}°C {weatherData.condition}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  location.pathname === link.path
                    ? "text-blue-600 font-semibold"
                    : "text-slate-600"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative rounded-full p-2.5 text-slate-700 hover:bg-slate-100 transition"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex items-center gap-1.5 rounded-full bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-600"
              aria-label="Shopping Cart"
            >
              <ShoppingBag size={16} />
              <span className="hidden min-[480px]:inline">Cart</span>
              {totalItems > 0 && (
                <span className="ml-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-cyan-400 text-[10px] font-bold text-slate-950">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Profile / Login */}
            {user ? (
              <Link
                to="/profile"
                className="hidden sm:flex items-center gap-1.5 rounded-full border border-slate-200 p-1.5 pr-3 hover:bg-slate-50 transition"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                  {user.name?.charAt(0) || "U"}
                </div>
                <span className="text-xs font-medium text-slate-700 max-w-[80px] truncate">
                  {user.name?.split(" ")[0]}
                </span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-full p-2 text-slate-800 hover:bg-slate-100 md:hidden"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Animated Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm md:hidden"
            />

            {/* Slide-out Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[82%] max-w-sm bg-white p-6 shadow-2xl flex flex-col justify-between md:hidden"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="rounded-xl bg-slate-900 p-2 text-white">
                      <ShoppingBag size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">WeatherCart</h3>
                      <p className="text-[11px] text-slate-500">AI Commerce</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Weather Pill on Mobile Drawer */}
                <div className="my-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 p-3.5 border border-blue-100">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-800">📍 {city}</span>
                    <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-medium text-white">
                      {weatherData.temp}°C
                    </span>
                  </div>
                  <p className="text-xs text-blue-900 mt-1 flex items-center gap-1.5">
                    {getWeatherIcon()} {weatherData.condition}
                  </p>
                </div>

                {/* Navigation Links */}
                <div className="space-y-1.5">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
                    >
                      <span>{link.name}</span>
                      <Compass size={16} className="text-slate-400" />
                    </Link>
                  ))}
                  <Link
                    to="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
                  >
                    <span className="flex items-center gap-2">
                      <Heart size={16} className="text-rose-500" /> Wishlist
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
                      {wishlistCount}
                    </span>
                  </Link>
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
                  >
                    <span className="flex items-center gap-2">
                      <LayoutDashboard size={16} className="text-indigo-600" /> Admin Panel
                    </span>
                  </Link>
                </div>
              </div>

              {/* User Footer on Drawer */}
              <div className="border-t border-slate-100 pt-4">
                {user ? (
                  <div className="space-y-3">
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 hover:bg-slate-100"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                        {user.name?.charAt(0) || "U"}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-xl border border-slate-300 py-2.5 text-center text-xs font-semibold text-slate-700"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-xl bg-slate-900 py-2.5 text-center text-xs font-semibold text-white"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
