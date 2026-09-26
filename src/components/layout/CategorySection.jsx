import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Shirt, Glasses, Footprints, Home, Shield, ArrowRight } from "lucide-react";
import { categoriesData } from "../../data/products";

export default function CategorySection({ onSelectCategory }) {
  const iconMap = {
    Sparkles: Sparkles,
    Shirt: Shirt,
    Glasses: Glasses,
    Footprints: Footprints,
    Home: Home,
    Shield: Shield
  };

  return (
    <section id="categories" className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Explore Collections
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Shop by Category
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Browse weather-tailored collections curated for every condition
            </p>
          </div>

          <Link
            to="/products"
            className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            <span>View All Categories</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
          {categoriesData.map((cat) => {
            const IconComponent = iconMap[cat.icon] || Sparkles;
            return (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                className="group flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-slate-50/50 p-4 sm:p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg hover:border-blue-200"
              >
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm border border-slate-100 mb-3 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition duration-300">
                  <IconComponent size={24} />
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-slate-800">
                  {cat.name}
                </h3>
                <span className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
                  {cat.count}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
