import React from "react";

export default function CategoryCard({ title, icon: Icon, count, color }) {
  return (
    <div className="group relative flex flex-col items-center justify-center p-6 bg-white rounded-3xl border border-slate-200/70 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
      <div className={`p-4 rounded-2xl ${color || "bg-blue-50 text-blue-600"} mb-3 transition group-hover:scale-110`}>
        {Icon ? <Icon size={28} /> : <span>🛍️</span>}
      </div>
      <h3 className="font-semibold text-slate-800 text-sm">{title}</h3>
      <p className="text-xs text-slate-400 mt-0.5">{count || "24+ items"}</p>
    </div>
  );
}
