import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Package, ShoppingBag, Users, TrendingUp,
  Plus, Pencil, Trash2, X, Check, Search,
  AlertTriangle, ArrowUpRight, ArrowDownRight, RefreshCw,
  LogOut, Menu, Sparkles, Eye, BarChart2, CloudRain, Sun,
  Snowflake, Wind, Star, BoxSelect, Activity, Download,
  ArrowRight, Zap, Target, CheckCircle2, ShoppingCart,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { API_URL } from "../../services/apiBaseUrl";

function authHeaders() {
  const token = localStorage.getItem("weathercart-token");
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

const STATUS_COLORS = {
  pending: "bg-amber-100 text-amber-800", confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-violet-100 text-violet-800", shipped: "bg-cyan-100 text-cyan-800",
  delivered: "bg-emerald-100 text-emerald-800", cancelled: "bg-rose-100 text-rose-800",
};
const ORDER_STATUSES = ["pending","confirmed","processing","shipped","delivered","cancelled"];
const WEATHER_TAGS = ["rain","sunny","cold","hot","warm","humid","cloudy","clear","winter","mild"];
const CATEGORIES = ["Fashion","Accessories","Footwear","Electronics","Home","Sports","Bags","Lifestyle"];

function StatCard({ icon: Icon, label, value, sub, color, trend }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
        <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${color}`}><Icon size={18} /></div>
      </div>
      <p className="text-2xl font-extrabold text-slate-900">{value}</p>
      {sub && (
        <p className={`mt-1 text-[11px] font-semibold flex items-center gap-0.5 ${trend >= 0 ? "text-emerald-600" : "text-rose-500"}`}>
          {trend >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{sub}
        </p>
      )}
    </motion.div>
  );
}

const weatherStats = [
  { label: "Rain / Monsoon", icon: CloudRain, pct: 42, orders: "1,205", color: "bg-blue-500", text: "text-blue-600" },
  { label: "Summer / Sunny", icon: Sun, pct: 28, orders: "804", color: "bg-amber-400", text: "text-amber-600" },
  { label: "Cold / Winter", icon: Snowflake, pct: 18, orders: "516", color: "bg-cyan-500", text: "text-cyan-600" },
  { label: "Wind / Storm", icon: Wind, pct: 12, orders: "346", color: "bg-teal-500", text: "text-teal-600" },
];

function WeatherAnalytics() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles size={16} className="text-blue-600" />
        <h3 className="text-sm font-bold text-slate-900">Weather x Sales Breakdown</h3>
      </div>
      <p className="text-xs text-slate-500 mb-5">Orders driven by AI weather recommendations</p>
      <div className="space-y-4">
        {weatherStats.map((s, i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-1.5">
              <span className={`flex items-center gap-1.5 text-xs font-semibold ${s.text}`}><s.icon size={13} /> {s.label}</span>
              <span className="text-xs font-bold text-slate-700">{s.pct}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${s.pct}%` }}
                transition={{ duration: 0.8, delay: i * 0.1 }} className={`h-full rounded-full ${s.color}`} />
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5 text-right">{s.orders} orders</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const revData = [18, 22, 17, 31, 28, 35, 42, 38, 44, 48, 52, 58];
function RevenueChart() {
  const max = Math.max(...revData), w = 280, h = 80, pad = 4;
  const pts = revData.map((v, i) => `${pad + (i / (revData.length - 1)) * (w - pad * 2)},${h - pad - ((v / max) * (h - pad * 2))}`).join(" ");
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Monthly Revenue</h3>
          <p className="text-xs text-slate-500">Last 12 months trend</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-extrabold text-slate-900">Rs.4.2L</p>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5 justify-end">
            <ArrowUpRight size={12} /> +18.4% MoM
          </p>
        </div>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full mt-4" style={{ height: 80 }}>
        <defs>
          <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={pts} />
        <polygon fill="url(#rg)" points={`${pad},${h} ${pts} ${w - pad},${h}`} />
      </svg>
      <div className="flex justify-between text-[9px] text-slate-400 mt-1">
        {["Oct","Nov","Dec","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep"].map(m => <span key={m}>{m}</span>)}
      </div>
    </div>
  );
}

function Toast({ toasts }) {
  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-xl
              ${t.type === "success" ? "bg-emerald-600" : t.type === "error" ? "bg-rose-600" : "bg-slate-800"}`}>
            {t.type === "success" ? <Check size={16} /> : <AlertTriangle size={16} />}{t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

const EMPTY = {
  name: "", description: "", category: "Fashion", price: "", oldPrice: "", stock: "",
  rating: "4.5", image: "", isFeatured: false, isActive: true, weatherTags: [], suitableFor: ""
};

function ProductModal({ product, onClose, onSave, loading }) {
  const isEdit = Boolean(product?._id);
  const [form, setForm] = useState(isEdit ? {
    ...product, weatherTags: product.weatherTags || [],
    suitableFor: (product.suitableFor || []).join(", "),
    price: String(product.price), oldPrice: String(product.oldPrice || ""),
    stock: String(product.stock || ""), rating: String(product.rating || "4.5"),
  } : EMPTY);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleTag = tag => set("weatherTags", form.weatherTags.includes(tag)
    ? form.weatherTags.filter(t => t !== tag) : [...form.weatherTags, tag]);

  const handleSubmit = e => {
    e.preventDefault();
    onSave({
      ...form, price: Number(form.price),
      oldPrice: Number(form.oldPrice) || Number(form.price),
      stock: Number(form.stock) || 0, rating: Number(form.rating) || 4.5,
      suitableFor: form.suitableFor.split(",").map(s => s.trim()).filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">{isEdit ? "Edit Product" : "Add New Product"}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Product Name *</label>
            <input required value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Premium Rain Jacket"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
            <textarea rows={2} value={form.description} onChange={e => set("description", e.target.value)}
              placeholder="Product description..."
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
              <select required value={form.category} onChange={e => set("category", e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Price (Rs.) *</label>
              <input required type="number" min="0" value={form.price} onChange={e => set("price", e.target.value)} placeholder="1499"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Original Price</label>
              <input type="number" min="0" value={form.oldPrice} onChange={e => set("oldPrice", e.target.value)} placeholder="1999"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Stock</label>
              <input type="number" min="0" value={form.stock} onChange={e => set("stock", e.target.value)} placeholder="50"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Rating (0-5)</label>
              <input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => set("rating", e.target.value)} placeholder="4.5"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Image URL</label>
            <input type="url" value={form.image} onChange={e => set("image", e.target.value)} placeholder="https://images.unsplash.com/..."
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {form.image && <img src={form.image} alt="preview" className="mt-2 h-20 w-20 rounded-xl object-cover border border-slate-200" onError={e => e.target.style.display = "none"} />}
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Weather Tags</label>
            <div className="flex flex-wrap gap-2">
              {WEATHER_TAGS.map(tag => (
                <button key={tag} type="button" onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition
                    ${form.weatherTags.includes(tag) ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:border-blue-400"}`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Suitable For <span className="font-normal text-slate-400">(comma separated)</span></label>
            <input value={form.suitableFor} onChange={e => set("suitableFor", e.target.value)} placeholder="monsoon, travel, outdoor"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700">
              <input type="checkbox" checked={form.isFeatured} onChange={e => set("isFeatured", e.target.checked)} className="w-4 h-4 rounded accent-blue-600" />Featured
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700">
              <input type="checkbox" checked={form.isActive} onChange={e => set("isActive", e.target.checked)} className="w-4 h-4 rounded accent-blue-600" />Active
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition">Cancel</button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <RefreshCw size={16} className="animate-spin" /> : <Check size={16} />}
              {isEdit ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function DeleteModal({ product, onClose, onConfirm, loading }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
        <div className="h-14 w-14 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={28} className="text-rose-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Product?</h3>
        <p className="text-sm text-slate-500 mb-6">
          <span className="font-semibold text-slate-800">"{product?.name}"</span> will be permanently removed.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50">Cancel</button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-semibold text-sm hover:bg-rose-700 disabled:opacity-60 flex items-center justify-center gap-2">
            {loading ? <RefreshCw size={16} className="animate-spin" /> : <Trash2 size={16} />}Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function OverviewTab({ stats, orders, onTabChange }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={TrendingUp} label="Total Revenue" value="Rs.4.2L" sub="+18.4% this month" color="bg-blue-50 text-blue-600" trend={1} />
        <StatCard icon={ShoppingBag} label="Total Orders" value={stats.orders} sub="94% fulfillment" color="bg-violet-50 text-violet-600" trend={1} />
        <StatCard icon={Users} label="Active Users" value={stats.users} sub="+9.2% geo-located" color="bg-emerald-50 text-emerald-600" trend={1} />
        <StatCard icon={Package} label="Products" value={stats.products} sub={`${stats.lowStock} low stock`} color="bg-amber-50 text-amber-600" trend={stats.lowStock > 5 ? -1 : 1} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><RevenueChart /><WeatherAnalytics /></div>
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-2 mb-5">
          <Sparkles size={18} className="text-amber-400" />
          <h3 className="font-bold text-sm">AI Recommendation Engine - Conversion Funnel</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Recs Shown", value: "12,482", icon: Eye },
            { label: "Product Clicks", value: "3,821", icon: BarChart2 },
            { label: "Added to Cart", value: "1,247", icon: Package },
            { label: "Purchases", value: "428", icon: Check },
          ].map((m, i) => (
            <div key={i} className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
              <m.icon size={18} className="text-blue-400 mx-auto mb-2" />
              <p className="text-lg font-extrabold">{m.value}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{m.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-400">
          <span>CTR: <strong className="text-emerald-400">30.6%</strong></span>
          <span>Cart Conversion: <strong className="text-emerald-400">32.6%</strong></span>
          <span>Purchase Conversion: <strong className="text-emerald-400">11.2%</strong></span>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900">Recent Orders</h3>
          <button onClick={() => onTabChange("orders")} className="text-xs font-semibold text-blue-600 hover:underline">View All</button>
        </div>
        <div className="space-y-2">
          {orders.slice(0, 5).map((ord, i) => (
            <div key={ord._id || i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <div>
                <span className="font-bold text-slate-900">{ord.orderNumber || ord._id}</span>
                <p className="text-slate-500 mt-0.5">{ord.user?.name || "Customer"} - {ord.items?.length || 0} items</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-900">Rs.{ord.totalAmount?.toLocaleString() || "-"}</p>
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold mt-1 ${STATUS_COLORS[ord.status] || "bg-slate-100 text-slate-600"}`}>{ord.status}</span>
              </div>
            </div>
          ))}
          {orders.length === 0 && <p className="text-xs text-slate-400 text-center py-6">No orders yet.</p>}
        </div>
      </div>
    </div>
  );
}

function ProductsTab({ products, onAdd, onEdit, onDelete }) {
  const [search, setSearch] = useState(""), [catFilter, setCatFilter] = useState("All");
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) && (catFilter === "All" || p.category === catFilter)
  );
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
              className="w-full pl-8 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none">
            <option value="All">All</option>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button onClick={onAdd} className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-700 transition">
          <Plus size={15} /> Add Product
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-500">
            <tr>
              <th className="py-3 px-4 text-left">Product</th><th className="py-3 px-4 text-left">Category</th>
              <th className="py-3 px-4 text-left">Price</th><th className="py-3 px-4 text-left">Stock</th>
              <th className="py-3 px-4 text-left">Rating</th><th className="py-3 px-4 text-left">Tags</th>
              <th className="py-3 px-4 text-left">Status</th><th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(p => (
              <tr key={p._id || p.id} className="hover:bg-slate-50/60 transition">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="h-10 w-10 rounded-xl object-cover border border-slate-100"
                      onError={e => { e.target.src = "https://placehold.co/40"; }} />
                    <div>
                      <p className="font-semibold text-slate-900 line-clamp-1 max-w-[140px]">{p.name}</p>
                      {p.isFeatured && <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">Featured</span>}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-slate-600">{p.category}</td>
                <td className="py-3 px-4">
                  <span className="font-bold text-slate-900">Rs.{p.price?.toLocaleString()}</span>
                  {p.oldPrice > p.price && <p className="text-[10px] text-slate-400 line-through">Rs.{p.oldPrice?.toLocaleString()}</p>}
                </td>
                <td className="py-3 px-4">
                  <span className={`font-semibold ${p.stock <= 5 ? "text-rose-600" : p.stock <= 20 ? "text-amber-600" : "text-emerald-600"}`}>{p.stock ?? "-"}</span>
                  {p.stock <= 5 && p.stock !== undefined && <p className="text-[9px] text-rose-500 font-semibold">Low!</p>}
                </td>
                <td className="py-3 px-4"><span className="flex items-center gap-1 text-amber-500 font-semibold"><Star size={11} fill="currentColor" />{p.rating || "-"}</span></td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {(p.weatherTags || []).slice(0, 2).map(t => <span key={t} className="bg-blue-50 text-blue-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full">{t}</span>)}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${p.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                    {p.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => onEdit(p)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition"><Pencil size={14} /></button>
                    <button onClick={() => onDelete(p)} className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="py-16 text-center text-slate-400"><Package size={32} className="mx-auto mb-2 opacity-30" /><p className="text-sm">No products found.</p></div>}
      </div>
    </div>
  );
}

function OrdersTab({ orders, onStatusChange }) {
  const [search, setSearch] = useState(""), [statusFilter, setStatusFilter] = useState("all"), [updating, setUpdating] = useState(null);
  const filtered = orders.filter(o => {
    const ms = (o.orderNumber || o._id || "").toLowerCase().includes(search.toLowerCase()) || (o.user?.name || "").toLowerCase().includes(search.toLowerCase());
    return ms && (statusFilter === "all" || o.status === statusFilter);
  });
  const handleStatus = async (id, s) => { setUpdating(id); await onStatusChange(id, s); setUpdating(null); };
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..."
            className="w-full pl-8 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {["all", ...ORDER_STATUSES].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition capitalize ${statusFilter === s ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{s}</button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-500">
            <tr>
              <th className="py-3 px-4 text-left">Order</th><th className="py-3 px-4 text-left">Customer</th>
              <th className="py-3 px-4 text-left">Total</th><th className="py-3 px-4 text-left">Payment</th>
              <th className="py-3 px-4 text-left">Status</th><th className="py-3 px-4 text-left">Update</th>
              <th className="py-3 px-4 text-left">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(ord => (
              <tr key={ord._id} className="hover:bg-slate-50/60 transition">
                <td className="py-3.5 px-4 font-bold text-slate-900 text-[11px]">{ord.orderNumber || ord._id?.slice(-8)}</td>
                <td className="py-3.5 px-4">
                  <p className="font-semibold text-slate-800">{ord.user?.name || "-"}</p>
                  <p className="text-slate-400 text-[10px]">{ord.user?.email || ""}</p>
                </td>
                <td className="py-3.5 px-4 font-bold text-slate-900">Rs.{ord.totalAmount?.toLocaleString() || "-"}</td>
                <td className="py-3.5 px-4">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ord.paymentStatus === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {ord.paymentStatus || "pending"}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[ord.status] || "bg-slate-100 text-slate-600"}`}>{ord.status}</span>
                </td>
                <td className="py-3.5 px-4">
                  <div className="relative">
                    <select value={ord.status} onChange={e => handleStatus(ord._id, e.target.value)}
                      disabled={updating === ord._id || ord.status === "cancelled"}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-[11px] focus:outline-none disabled:opacity-50 cursor-pointer">
                      {ORDER_STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                    </select>
                    {updating === ord._id && <RefreshCw size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 animate-spin" />}
                  </div>
                </td>
                <td className="py-3.5 px-4 text-slate-400 text-[10px]">{ord.createdAt ? new Date(ord.createdAt).toLocaleDateString("en-IN") : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="py-16 text-center text-slate-400"><ShoppingBag size={32} className="mx-auto mb-2 opacity-30" /><p className="text-sm">No orders found.</p></div>}
      </div>
    </div>
  );
}

function InventoryTab({ products }) {
  const sorted = [...products].sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0));
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm"><p className="text-xs font-semibold text-slate-500 mb-1">Total</p><p className="text-2xl font-extrabold text-slate-900">{products.length}</p></div>
        <div className="bg-white border border-rose-100 rounded-2xl p-5 shadow-sm"><p className="text-xs font-semibold text-rose-500 mb-1">Out of Stock</p><p className="text-2xl font-extrabold text-rose-600">{products.filter(p => (p.stock ?? 0) === 0).length}</p></div>
        <div className="bg-white border border-amber-100 rounded-2xl p-5 shadow-sm"><p className="text-xs font-semibold text-amber-600 mb-1">Low Stock</p><p className="text-2xl font-extrabold text-amber-600">{products.filter(p => (p.stock ?? 0) > 0 && (p.stock ?? 0) <= 10).length}</p></div>
        <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm"><p className="text-xs font-semibold text-emerald-600 mb-1">In Stock</p><p className="text-2xl font-extrabold text-emerald-600">{products.filter(p => (p.stock ?? 0) > 10).length}</p></div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center gap-2">
          <AlertTriangle size={16} className="text-amber-500" />
          <h3 className="text-sm font-bold text-slate-900">Stock Levels — All Products</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3 px-4 text-left">Product</th><th className="py-3 px-4 text-left">Category</th>
                <th className="py-3 px-4 text-left">Price</th><th className="py-3 px-4 text-left">Stock Level</th>
                <th className="py-3 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sorted.map(p => {
                const stock = p.stock ?? 0;
                const sc = stock === 0 ? "bg-rose-100 text-rose-700" : stock <= 5 ? "bg-rose-50 text-rose-600" : stock <= 10 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700";
                const bc = stock === 0 ? "bg-rose-500" : stock <= 10 ? "bg-amber-500" : "bg-emerald-500";
                return (
                  <tr key={p._id || p.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="h-8 w-8 rounded-lg object-cover" onError={e => { e.target.src = "https://placehold.co/32"; }} />
                        <span className="font-semibold text-slate-900 line-clamp-1 max-w-[150px]">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{p.category}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">Rs.{p.price?.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 w-24 rounded-full bg-slate-100 overflow-hidden">
                          <div className={`h-full rounded-full ${bc}`} style={{ width: `${Math.min((stock / 100) * 100, 100)}%` }} />
                        </div>
                        <span className={`font-bold ${stock <= 5 ? "text-rose-600" : stock <= 10 ? "text-amber-600" : "text-slate-700"}`}>{stock}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sc}`}>{stock === 0 ? "Out of Stock" : stock <= 5 ? "Critical" : stock <= 10 ? "Low" : "OK"}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AnalyticsTab({ products, orders }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const res = await fetch(`${API_URL}/analytics/dashboard`, { headers: authHeaders() });
        const data = await res.json();
        if (data.success) {
          setDashboardData(data);
        }
      } catch (e) {
        console.error("Failed to load analytics dashboard data", e);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  const totalRevenue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const funnel = dashboardData?.funnel;
  const uplift = dashboardData?.recommendationUplift;
  const weatherBreakdown = dashboardData?.weatherBreakdown || [];
  const recentEvents = dashboardData?.recentActivity || [];

  const handleExportReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalOrders: orders.length,
        totalRevenue: totalRevenue,
        catalogSize: products.length,
      },
      funnel: dashboardData?.funnel,
      uplift: dashboardData?.recommendationUplift,
      weatherBreakdown: dashboardData?.weatherBreakdown,
      recentEvents: dashboardData?.recentActivity,
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `weathercart-analytics-report-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Export Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold mb-1">
            <Activity size={13} className="text-blue-600 animate-pulse" /> Telemetry Stream Active
          </div>
          <h2 className="text-base font-extrabold text-slate-900">AI Conversion Funnel & Weather Intelligence</h2>
          <p className="text-xs text-slate-500">Real-time attribution matching meteorological events to product checkout conversions.</p>
        </div>

        <button
          onClick={handleExportReport}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm"
        >
          <Download size={14} /> Export Analytics Report
        </button>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 mb-1">Live Revenue</p>
          <p className="text-2xl font-extrabold text-slate-900">Rs.{totalRevenue.toLocaleString()}</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-0.5">
            <ArrowUpRight size={12} /> +18.4% from Weather AI
          </p>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 mb-1">Overall Conversion Rate</p>
          <p className="text-2xl font-extrabold text-indigo-600">{funnel?.overallConversionRate || "17.9%"}</p>
          <p className="text-[11px] text-slate-400 mt-1">Visitors to completed purchases</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 mb-1">Weather Recommendation Lift</p>
          <p className="text-2xl font-extrabold text-emerald-600">{uplift?.upliftPercentage || "+183.3%"}</p>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1">vs generic product browsing</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 mb-1">AI Attributed Orders</p>
          <p className="text-2xl font-extrabold text-slate-900">{orders.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">94.2% statistical confidence</p>
        </div>
      </div>

      {/* 5-Stage Conversion Funnel Visualization */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Target size={16} className="text-blue-600" />
              Full E-Commerce Conversion Funnel (Views → Orders)
            </h3>
            <p className="text-xs text-slate-500">Stage-by-stage drop-off analytics</p>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
            5 Stages Active
          </span>
        </div>

        {funnel?.stages ? (
          <div className="space-y-4">
            {funnel.stages.map((st, i) => {
              const maxCount = funnel.stages[0].count;
              const barWidth = Math.max(8, (st.count / maxCount) * 100);
              return (
                <div key={st.key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      {st.label}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-900 font-extrabold">{st.count.toLocaleString()}</span>
                      <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                        {st.conversionRate}
                      </span>
                    </div>
                  </div>
                  <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${barWidth}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className={`h-full rounded-full ${
                        i === 0
                          ? "bg-slate-400"
                          : i === 1
                          ? "bg-blue-500"
                          : i === 2
                          ? "bg-indigo-500"
                          : i === 3
                          ? "bg-purple-500"
                          : "bg-emerald-500"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-28 flex items-center justify-center text-xs text-slate-400">Loading Funnel Telemetry...</div>
        )}
      </div>

      {/* Weather Sales Matrix & AI Recommendation Lift Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weather Sales Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <CloudRain size={16} className="text-blue-500" /> Weather Condition Correlation Matrix
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Orders by atmospheric alert</span>
          </div>

          <div className="space-y-4">
            {weatherBreakdown.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                  <span>{item.label}</span>
                  <span className="text-indigo-600">Rs. {item.revenue?.toLocaleString()} ({item.percentage}%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full ${
                      item.weather === "rain"
                        ? "bg-blue-500"
                        : item.weather === "sunny"
                        ? "bg-amber-400"
                        : item.weather === "cold"
                        ? "bg-cyan-500"
                        : "bg-teal-500"
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{item.orders} orders • Avg: Rs.{item.avgOrderValue}</span>
                  <span className="font-semibold text-slate-700 truncate max-w-[150px]">Top: {item.topItem}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Uplift & Live Event Ticker */}
        <div className="space-y-6">
          {/* AI Uplift Card */}
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold mb-2">
                <Zap size={14} className="text-amber-400" /> Machine Learning Uplift
              </div>
              <h3 className="text-xl font-black">Weather-Matched Recommendation Conversion</h3>
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/10">
                <div>
                  <div className="text-[11px] text-slate-400">Weather Matched</div>
                  <div className="text-2xl font-black text-emerald-400">{uplift?.weatherRecommendedConversion || "6.8%"}</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400">Generic Catalog</div>
                  <div className="text-2xl font-black text-slate-300">{uplift?.genericBrowsingConversion || "2.4%"}</div>
                </div>
              </div>
              <div className="mt-4 p-3 rounded-xl bg-white/10 text-xs text-slate-200 flex items-center justify-between">
                <span>Revenue from Weather AI:</span>
                <span className="font-bold text-white">{uplift?.weatherAttributedRevenue || "Rs. 4.90L"}</span>
              </div>
            </div>
          </div>

          {/* Real-time Customer Activity Feed */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                Live Customer Telemetry Stream
              </h3>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Real-time</span>
            </div>

            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
              {recentEvents.length > 0 ? (
                recentEvents.map((evt, idx) => (
                  <div key={evt.id || idx} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition">
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          evt.eventType === "purchase"
                            ? "bg-emerald-100 text-emerald-800"
                            : evt.eventType === "cart_add"
                            ? "bg-blue-100 text-blue-800"
                            : evt.eventType === "recommendation_click"
                            ? "bg-indigo-100 text-indigo-800"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {evt.eventType.replace("_", " ")}
                      </span>
                      <span className="font-semibold text-slate-800 truncate max-w-[140px]">{evt.productName}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500 shrink-0">
                      <span>{evt.city} ({evt.weather})</span>
                      {evt.orderValue > 0 && <span className="font-bold text-slate-900">₹{evt.orderValue}</span>}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-slate-400">Listening for client events...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const NAV = [
  { key: "overview", label: "Dashboard", icon: LayoutDashboard },
  { key: "products", label: "Products", icon: Package },
  { key: "orders", label: "Orders", icon: ShoppingBag },
  { key: "inventory", label: "Inventory", icon: BoxSelect },
  { key: "analytics", label: "Analytics", icon: BarChart2 },
];

export default function AdminDashboard() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [sidebar, setSidebar] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [lprod, setLprod] = useState(true), [lord, setLord] = useState(true);
  const [prodModal, setProdModal] = useState(null);
  const [delTarget, setDelTarget] = useState(null);
  const [mloading, setMloading] = useState(false);
  const [toasts, setToasts] = useState([]);

  useEffect(() => { if (user !== undefined && user !== null && !isAdmin) navigate("/"); }, [user, isAdmin, navigate]);

  const toast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);

  const loadProducts = useCallback(async () => {
    setLprod(true);
    try {
      const r = await fetch(`${API_URL}/products`, { headers: authHeaders() });
      const d = await r.json();
      setProducts(d.products || d || []);
    } catch { toast("Failed to load products", "error"); }
    finally { setLprod(false); }
  }, [toast]);

  const loadOrders = useCallback(async () => {
    setLord(true);
    try {
      const r = await fetch(`${API_URL}/orders/admin/all`, { headers: authHeaders() });
      const d = await r.json();
      setOrders(d.orders || []);
    } catch { setOrders([]); }
    finally { setLord(false); }
  }, []);

  useEffect(() => { loadProducts(); loadOrders(); }, [loadProducts, loadOrders]);

  const saveProduct = async (data) => {
    setMloading(true);
    const isEdit = Boolean(data._id);
    try {
      const r = await fetch(isEdit ? `${API_URL}/products/${data._id}` : `${API_URL}/products`, {
        method: isEdit ? "PUT" : "POST", headers: authHeaders(), body: JSON.stringify(data)
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message || "Failed");
      toast(isEdit ? "Product updated!" : "Product added!"); setProdModal(null); loadProducts();
    } catch (e) { toast(e.message || "Failed", "error"); }
    finally { setMloading(false); }
  };

  const deleteProduct = async () => {
    if (!delTarget) return; setMloading(true);
    try {
      const r = await fetch(`${API_URL}/products/${delTarget._id}`, { method: "DELETE", headers: authHeaders() });
      if (!r.ok) throw new Error("Delete failed");
      toast("Product deleted"); setDelTarget(null); loadProducts();
    } catch (e) { toast(e.message || "Failed", "error"); }
    finally { setMloading(false); }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const r = await fetch(`${API_URL}/orders/${id}/status`, { method: "PUT", headers: authHeaders(), body: JSON.stringify({ status }) });
      if (!r.ok) throw new Error("Failed");
      toast(`Order marked as ${status}`);
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
    } catch { toast("Failed to update order", "error"); }
  };

  const stats = { products: products.length, orders: orders.length, users: "1,245", lowStock: products.filter(p => (p.stock ?? 0) <= 5).length };
  const isLoading = lprod || lord;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {sidebar && <div className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden" onClick={() => setSidebar(false)} />}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 text-white flex flex-col transform transition-transform duration-300 ${sidebar ? "translate-x-0" : "-translate-x-full"} lg:relative lg:translate-x-0`}>
        <div className="px-6 py-5 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-blue-600 flex items-center justify-center"><CloudRain size={16} className="text-white" /></div>
            <span className="font-extrabold text-sm">WeatherCart Admin</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-5 space-y-1">
          {NAV.map(item => (
            <button key={item.key} onClick={() => { setTab(item.key); setSidebar(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${tab === item.key ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-white/10 hover:text-white"}`}>
              <item.icon size={17} />{item.label}
              {item.key === "inventory" && stats.lowStock > 0 && (
                <span className="ml-auto bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{stats.lowStock}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">{user?.name?.[0]?.toUpperCase() || "A"}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.name || "Admin"}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email || ""}</p>
            </div>
            <button onClick={() => { logout(); navigate("/login"); }} className="p-1 text-slate-400 hover:text-white transition"><LogOut size={15} /></button>
          </div>
        </div>
      </aside>
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-4 shadow-sm">
          <button onClick={() => setSidebar(true)} className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition"><Menu size={20} /></button>
          <div className="flex-1"><h1 className="text-sm font-bold text-slate-900 capitalize">{tab}</h1></div>
          <div className="flex items-center gap-2">
            <button onClick={() => { loadProducts(); loadOrders(); }} className="p-2 rounded-xl hover:bg-slate-100 transition text-slate-500">
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            </button>
            <Link to="/" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition">
              <Eye size={14} /> View Site
            </Link>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-3 text-slate-400">
                <RefreshCw size={28} className="animate-spin text-blue-500" />
                <p className="text-sm font-semibold">Loading admin data...</p>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                {tab === "overview" && <OverviewTab stats={stats} orders={orders} onTabChange={setTab} />}
                {tab === "products" && <ProductsTab products={products} onAdd={() => setProdModal("add")} onEdit={p => setProdModal(p)} onDelete={p => setDelTarget(p)} />}
                {tab === "orders" && <OrdersTab orders={orders} onStatusChange={updateOrderStatus} />}
                {tab === "inventory" && <InventoryTab products={products} />}
                {tab === "analytics" && <AnalyticsTab products={products} orders={orders} />}
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>
      <AnimatePresence>
        {prodModal && <ProductModal product={prodModal === "add" ? null : prodModal} onClose={() => setProdModal(null)} onSave={saveProduct} loading={mloading} />}
        {delTarget && <DeleteModal product={delTarget} onClose={() => setDelTarget(null)} onConfirm={deleteProduct} loading={mloading} />}
      </AnimatePresence>
      <Toast toasts={toasts} />
    </div>
  );
}
