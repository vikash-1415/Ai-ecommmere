import { motion } from "framer-motion";
import { MapPin, CloudSun, BrainCircuit, ShoppingBag } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: MapPin,
    title: "Detect Location",
    text: "With user permission, the system identifies the current location.",
  },
  {
    number: "02",
    icon: CloudSun,
    title: "Check Weather",
    text: "Real-time weather information is fetched for that location.",
  },
  {
    number: "03",
    icon: BrainCircuit,
    title: "AI Analysis",
    text: "The recommendation engine analyzes weather and user preferences.",
  },
  {
    number: "04",
    icon: ShoppingBag,
    title: "Recommend",
    text: "Relevant products are ranked and shown to the user.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">

        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">
            Simple Process
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            How WeatherCart Works
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
            Four simple steps turn real-world conditions into
            personalized shopping recommendations.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-950">
                    <Icon size={21} />
                  </div>

                  <span className="text-4xl font-black text-white/10">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-7 text-lg font-bold">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {step.text}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
