import { motion } from "framer-motion";
import { ArrowRight, Flame } from "lucide-react";
import { products } from "../data/products";
import ProductCard from "./ProductCard";

export default function TrendingSection() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <div className="inline-flex items-center gap-2 text-sm font-bold text-orange-600">
              <Flame size={17} />
              TRENDING NOW
            </div>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Popular Products
            </h2>

            <p className="mt-3 text-sm text-slate-600 sm:text-base">
              What shoppers are loving right now.
            </p>
          </div>

          <button className="flex items-center gap-2 self-start text-sm font-bold text-slate-900">
            Explore all
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 min-[380px]:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
