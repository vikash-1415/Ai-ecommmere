import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ShoppingBag,
  Search,
  Heart,
  User,
  Menu,
  X,
  MapPin,
  Sparkles,
  ShoppingCart,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import WeatherBadge from "./WeatherBadge";
import SearchAutocomplete from "./SearchAutocomplete";

export default function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { cartCount, openDrawer } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  const closeMenu = () => setMobileMenu(false);

  return (
    <>
      {/* NAVBAR */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div className="mx-auto max-w-7xl px-3 pt-3 sm:px-5 lg:px-6">
          <nav className="rounded-2xl border border-slate-200/70 bg-white/85 shadow-lg shadow-slate-900/5 backdrop-blur-xl">
            <div className="flex h-16 items-center justify-between px-3 sm:h-[72px] sm:px-5 lg:px-6">

              {/* LOGO */}
              <Link
                to="/"
                onClick={closeMenu}
                className="flex min-w-0 items-center gap-2.5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white shadow-md">
                  <ShoppingBag size={20} strokeWidth={2.2} />
                </div>

                <div className="min-w-0">
                  <h1 className="truncate text-base font-extrabold tracking-tight text-slate-950 sm:text-lg">
                    WeatherCart
                  </h1>

                  <div className="hidden items-center gap-1 text-[10px] font-medium text-slate-500 min-[380px]:flex">
                    <Sparkles size={10} />
                    AI Shopping
                  </div>
                </div>
              </Link>

              {/* DESKTOP NAVIGATION */}
              <div className="hidden items-center gap-1 lg:flex">
                <Link
                  to="/"
                  className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-950"
                >
                  Home
                </Link>

                <Link
                  to="/products"
                  className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-950"
                >
                  Products
                </Link>

                <a
                  href="/#recommendations"
                  className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-950"
                >
                  Recommendations
                </a>

                <Link
                  to="/blog"
                  className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-950"
                >
                  Blog & Guides
                </Link>
              </div>

              {/* RIGHT ACTIONS */}
              <div className="flex items-center gap-1 sm:gap-2">

                {/* Location & Weather */}
                <div className="hidden sm:flex items-center">
                  <WeatherBadge />
                </div>

                {/* Search */}
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  aria-label="Search"
                  className="hidden rounded-full p-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 sm:flex"
                >
                  <Search size={19} />
                </button>

                {/* Wishlist */}
                <Link
                  to="/wishlist"
                  aria-label="Wishlist"
                  className="hidden rounded-full p-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 sm:flex"
                >
                  <Heart size={19} />
                </Link>

                {/* Cart */}
                <button
                  type="button"
                  onClick={openDrawer}
                  className="relative flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-slate-100"
                  aria-label="Shopping cart"
                >
                  <ShoppingCart size={20} />

                  {cartCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-950 px-1 text-[10px] font-bold text-white">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </button>

                {/* User / Auth */}
                {isAuthenticated ? (
                  <div className="relative group hidden sm:block">
                    <button
                      aria-label="Account"
                      className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-800 transition hover:bg-slate-200"
                    >
                      <User size={15} />
                      <span className="max-w-[70px] truncate">{user?.name?.split(" ")[0]}</span>
                    </button>
                    <div className="absolute right-0 top-full mt-2 hidden w-44 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl group-hover:block z-50">
                      <div className="px-3 py-2 border-b border-slate-100 text-xs">
                        <p className="font-bold text-slate-900 truncate">{user?.name}</p>
                        <p className="text-[10px] text-slate-500 capitalize">{user?.role}</p>
                      </div>
                      <Link
                        to="/orders"
                        className="block mt-1 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={logout}
                        className="w-full text-left mt-0.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    aria-label="Account"
                    className="hidden rounded-full bg-slate-950 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-slate-800 sm:flex items-center gap-1.5"
                  >
                    <User size={15} />
                    <span>Sign In</span>
                  </Link>
                )}

                {/* Mobile menu */}
                <button
                  onClick={() => setMobileMenu(!mobileMenu)}
                  aria-label={mobileMenu ? "Close menu" : "Open menu"}
                  className="rounded-full bg-slate-950 p-2.5 text-white transition sm:hidden"
                >
                  {mobileMenu ? <X size={19} /> : <Menu size={19} />}
                </button>
              </div>
            </div>

            {/* SEARCH BAR */}
            <AnimatePresence>
              {searchOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-visible border-t border-slate-100"
                >
                  <div className="p-3 sm:p-4 max-w-3xl mx-auto">
                    <SearchAutocomplete
                      autoFocus
                      onSelect={() => setSearchOpen(false)}
                      placeholder="Search jackets, umbrella, waterproof shoes, brands..."
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </nav>
        </div>
      </motion.header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenu && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm sm:hidden"
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 32,
              }}
              className="fixed right-0 top-0 z-50 h-full w-[85%] max-w-sm bg-white p-5 shadow-2xl overflow-y-auto sm:hidden"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-xl bg-slate-950 p-2 text-white">
                    <ShoppingBag size={18} />
                  </div>

                  <span className="font-bold">
                    WeatherCart
                  </span>
                </div>

                <button
                  onClick={closeMenu}
                  className="rounded-full bg-slate-100 p-2"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Mobile Search Autocomplete */}
              <div className="mt-5">
                <SearchAutocomplete
                  onSelect={() => setMobileMenu(false)}
                  placeholder="Search products..."
                />
              </div>

              {/* Navigation */}
              <div className="mt-6 space-y-1">
                <Link
                  to="/"
                  onClick={closeMenu}
                  className="block rounded-xl px-4 py-3.5 text-base font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                >
                  Home
                </Link>

                <Link
                  to="/products"
                  onClick={closeMenu}
                  className="block rounded-xl px-4 py-3.5 text-base font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                >
                  Products
                </Link>

                <a
                  href="/#recommendations"
                  onClick={closeMenu}
                  className="block rounded-xl px-4 py-3.5 text-base font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                >
                  Recommendations
                </a>

                <Link
                  to="/blog"
                  onClick={closeMenu}
                  className="block rounded-xl px-4 py-3.5 text-base font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                >
                  Blog & Guides
                </Link>
              </div>

              {/* Location & Weather */}
              <div className="mt-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <span className="text-xs font-bold text-slate-500">Live Weather</span>
                <WeatherBadge />
              </div>

              {/* Account Actions */}
              <div className="mt-4">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs">
                      <p className="font-bold text-slate-900">{user?.name}</p>
                      <p className="text-slate-500 capitalize">{user?.role} • {user?.email}</p>
                    </div>
                    <Link
                      to="/orders"
                      onClick={closeMenu}
                      className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                    >
                      <ShoppingBag size={16} />
                      My Orders
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        closeMenu();
                      }}
                      className="w-full rounded-xl bg-red-50 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to="/login"
                      onClick={closeMenu}
                      className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      <User size={16} />
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={closeMenu}
                      className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
