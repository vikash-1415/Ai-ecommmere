import React from "react";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products, title, subtitle }) {
  if (!products || products.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
        <p className="text-base font-semibold">No matching products found.</p>
        <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search keywords.</p>
      </div>
    );
  }

  return (
    <section className="w-full">
      {(title || subtitle) && (
        <div className="mb-6 sm:mb-8 text-center sm:text-left">
          {title && (
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 min-[380px]:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
