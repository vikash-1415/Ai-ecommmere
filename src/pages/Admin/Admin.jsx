import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Package,
  ShoppingBag,
  TrendingUp,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Filter
} from "lucide-react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/layout/Footer";
import { productsData as initialProducts } from "../../data/products";

export default function Admin() {
  const [products, setProducts] = useState(initialProducts);
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'products' | 'orders'
  const [showAddModal, setShowAddModal] = useState(false);

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Fashion",
    price: "",
    weatherTags: "rain",
    season: "monsoon",
    image: "https://images.unsplash.com/photo-1544923246-77307dd654cb?w=600&auto=format&fit=crop&q=80",
    description: ""
  });

  const [orders, setOrders] = useState([
    { id: "#ORD-1024", customer: "Rahul Sharma", items: 2, total: 2598, status: "Shipped", date: "Today" },
    { id: "#ORD-1023", customer: "Pooja Patel", items: 1, total: 1899, status: "Packed", date: "Today" },
    { id: "#ORD-1022", customer: "Amit Kumar", items: 3, total: 4299, status: "Delivered", date: "Yesterday" },
    { id: "#ORD-1021", customer: "Sneha Roy", items: 1, total: 699, status: "Ordered", date: "24 Sep" }
  ]);

  const handleDeleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const created = {
      id: Date.now(),
      name: newProduct.name,
      category: newProduct.category,
      price: Number(newProduct.price),
      rating: 4.8,
      image: newProduct.image,
      description: newProduct.description || "High quality weather gear",
      weatherTags: [newProduct.weatherTags],
      season: newProduct.season,
      weatherTagLabel: `⚡ ${newProduct.weatherTags.toUpperCase()} Gear`,
      isPopular: true
    };
    setProducts([created, ...products]);
    setShowAddModal(false);
    setNewProduct({
      name: "",
      category: "Fashion",
      price: "",
      weatherTags: "rain",
      season: "monsoon",
      image: "https://images.unsplash.com/photo-1544923246-77307dd654cb?w=600&auto=format&fit=crop&q=80",
      description: ""
    });
  };

  const updateOrderStatus = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 sm:pt-28 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                Operations & Analytics
              </span>
              <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Admin Management Console
              </h1>
              <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
                Monitor weather product catalog, customer orders, and AI conversion metrics
              </p>
            </div>

            {/* Admin Tabs */}
            <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200 self-start sm:self-auto">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === "overview" ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab("products")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === "products" ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Products ({products.length})
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === "orders" ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Orders ({orders.length})
              </button>
            </div>
          </div>

          {/* Metric Highlights */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold">Total Revenue</span>
                <div className="h-8 w-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <TrendingUp size={16} />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-slate-900">₹4.2 Lakh</p>
              <p className="text-[11px] font-medium text-emerald-600 flex items-center gap-0.5 mt-1">
                <ArrowUpRight size={12} /> +18.4% this week
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold">Active Users</span>
                <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Users size={16} />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-slate-900">1,245</p>
              <p className="text-[11px] font-medium text-emerald-600 flex items-center gap-0.5 mt-1">
                <ArrowUpRight size={12} /> +9.2% geo-located
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold">Total Orders</span>
                <div className="h-8 w-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <ShoppingBag size={16} />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-slate-900">2,871</p>
              <p className="text-[11px] font-medium text-emerald-600 flex items-center gap-0.5 mt-1">
                <ArrowUpRight size={12} /> 94% fulfillment
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold">Weather Catalog</span>
                <div className="h-8 w-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Package size={16} />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-slate-900">{products.length} Items</p>
              <p className="text-[11px] font-medium text-slate-400 mt-1">
                All tagged with weather tags
              </p>
            </div>
          </div>

          {/* TAB 1: OVERVIEW / ANALYTICS */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Weather Conversion Analytics */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900">
                  Real-Time Weather Recommendations Analytics
                </h3>
                <p className="text-xs text-slate-500">
                  Conversion breakdown of products recommended by active climatic tags:
                </p>

                <div className="space-y-3 pt-2">
                  {[
                    { label: "Monsoon & Rain Gear (Raincoats, Umbrellas)", pct: "42%", count: "1,205 orders", color: "bg-blue-600" },
                    { label: "Summer & Heat Defense (Sunglasses, Linen, Sunscreen)", pct: "28%", count: "804 orders", color: "bg-amber-500" },
                    { label: "Winter & Thermal Essentials (Hoodies, Heaters)", pct: "18%", count: "516 orders", color: "bg-cyan-500" },
                    { label: "Wind & Air Quality (Windbreakers, Purifiers)", pct: "12%", count: "346 orders", color: "bg-teal-500" },
                  ].map((bar, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-800">
                        <span>{bar.label}</span>
                        <span>{bar.pct}</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${bar.color} rounded-full`} style={{ width: bar.pct }} />
                      </div>
                      <p className="text-[10px] text-slate-400 text-right">{bar.count}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders Queue */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-slate-900">Recent Customer Orders</h3>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-3">
                  {orders.slice(0, 4).map((ord) => (
                    <div
                      key={ord.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900">{ord.id}</span>
                        <p className="text-slate-500">{ord.customer} • {ord.items} items</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">₹{ord.total.toLocaleString()}</p>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          ord.status === "Delivered" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"
                        }`}>
                          {ord.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS CRUD */}
          {activeTab === "products" && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Catalog Management</h3>
                  <p className="text-xs text-slate-500">Add, view and delete products from the weather recommendation database</p>
                </div>

                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-2xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-600 transition"
                >
                  <Plus size={16} />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 border-y border-slate-100 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Product</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Weather Tag</th>
                      <th className="py-3 px-4">Rating</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <img src={p.image} alt={p.name} className="h-10 w-10 rounded-xl object-cover" />
                          <span className="font-semibold text-slate-900 line-clamp-1">{p.name}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{p.category}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">₹{p.price.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-700">
                            {p.weatherTags?.[0] || "All"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-amber-500 font-semibold">⭐ {p.rating}</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition"
                            title="Delete product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS MANAGEMENT */}
          {activeTab === "orders" && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-base font-bold text-slate-900">Manage Customer Orders</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 border-y border-slate-100 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Total Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Update Lifecycle</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4 font-bold text-slate-900">{ord.id}</td>
                        <td className="py-3.5 px-4 text-slate-600">{ord.customer}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">₹{ord.total.toLocaleString()}</td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                            ord.status === "Delivered" ? "bg-emerald-100 text-emerald-800" :
                            ord.status === "Shipped" ? "bg-purple-100 text-purple-800" :
                            ord.status === "Packed" ? "bg-blue-100 text-blue-800" :
                            "bg-amber-100 text-amber-800"
                          }`}>
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <select
                            value={ord.status}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs focus:outline-blue-500"
                          >
                            <option value="Ordered">Ordered</option>
                            <option value="Packed">Packed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Add Product Modal */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
              <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
                <h3 className="text-lg font-bold text-slate-900">Add New Weather Product</h3>
                <form onSubmit={handleAddProduct} className="space-y-3.5 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Product Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. UltraDry Rain Poncho"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Category</label>
                      <select
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-blue-500"
                      >
                        <option value="Fashion">Fashion</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Footwear">Footwear</option>
                        <option value="Home & Electronics">Home & Electronics</option>
                        <option value="Personal Care">Personal Care</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Price (₹)</label>
                      <input
                        type="number"
                        required
                        placeholder="1499"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Target Weather Tag</label>
                      <select
                        value={newProduct.weatherTags}
                        onChange={(e) => setNewProduct({ ...newProduct, weatherTags: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-blue-500"
                      >
                        <option value="rain">Rain / Monsoon 🌧️</option>
                        <option value="sunny">Sunny / Summer ☀️</option>
                        <option value="cold">Cold / Winter ❄️</option>
                        <option value="wind">Wind / Storm 💨</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Season</label>
                      <select
                        value={newProduct.season}
                        onChange={(e) => setNewProduct({ ...newProduct, season: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-blue-500"
                      >
                        <option value="monsoon">Monsoon</option>
                        <option value="summer">Summer</option>
                        <option value="winter">Winter</option>
                        <option value="all">All-Season</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Image URL</label>
                    <input
                      type="url"
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-blue-500"
                    />
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                    >
                      Save Product
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
