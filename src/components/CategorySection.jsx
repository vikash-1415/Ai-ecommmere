import { motion } from "framer-motion";
import {
  Shirt,
  Smartphone,
  Home,
  Dumbbell,
  Sparkles,
  Footprints,
} from "lucide-react";

const categories = [
  {
    name: "Fashion",
    icon: Shirt,
    description: "Style for every season",
  },
  {
    name: "Electronics",
    icon: Smartphone,
    description: "Smart tech essentials",
  },
  {
    name: "Home",
    icon: Home,
    description: "Comfort for your home",
  },
  {
    name: "Sports",
    icon: Dumbbell,
    description: "Gear up and move",
  },
  {
    name: "Beauty",
    icon: Sparkles,
    description: "Care made personal",
  },
  {
    name: "Footwear",
    icon: Footprints,
    description: "Walk in comfort",
  },
];

export default function CategorySection() {
  return (
    <section id="categories" className="bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
            Explore
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Shop by Category
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Discover products across categories, intelligently personalized
            for your lifestyle and environment.
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:mt-14 lg:grid-cols-6">
          {categories.map((category, index) => {
            const Icon = category.icon;

            return (
              <motion.button
                key={category.name}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.06,
                }}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.97 }}
                className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left transition-all duration-300 hover:border-slate-300 hover:bg-white hover:shadow-xl hover:shadow-slate-900/5 sm:p-6"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-800 shadow-sm transition group-hover:bg-slate-950 group-hover:text-white">
                  <Icon size={21} />
                </div>

                <h3 className="mt-5 text-sm font-bold text-slate-950 sm:text-base">
                  {category.name}
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {category.description}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
