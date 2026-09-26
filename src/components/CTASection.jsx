import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTASection() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-12 text-center text-white shadow-2xl shadow-blue-900/20 sm:px-10 sm:py-16 lg:px-16"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
          <Sparkles size={23} />
        </div>

        <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Ready for Smarter Shopping?
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base">
          Let AI understand your environment and help you discover
          products that fit your current needs.
        </p>

        <button className="group mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-blue-700 transition hover:scale-105">
          Get Personalized Recommendations
          <ArrowRight
            size={17}
            className="transition group-hover:translate-x-1"
          />
        </button>
      </motion.div>
    </section>
  );
}
