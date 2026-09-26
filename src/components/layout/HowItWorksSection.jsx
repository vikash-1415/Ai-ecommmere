import React from "react";
import { MapPin, CloudRain, Cpu, ShoppingBag, ArrowRight } from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      icon: MapPin,
      title: "Detect Location",
      desc: "Captures your coordinates via browser geolocation or manual selection."
    },
    {
      step: "02",
      icon: CloudRain,
      title: "Real-Time Weather",
      desc: "Fetches live temperature, precipitation, humidity, and wind conditions."
    },
    {
      step: "03",
      icon: Cpu,
      title: "AI Analysis Engine",
      desc: "Calculates hybrid recommendation score combining weather match & user preferences."
    },
    {
      step: "04",
      icon: ShoppingBag,
      title: "Smart Suggestions",
      desc: "Instantly serves weather-tailored essentials with dynamic match percentages."
    }
  ];

  return (
    <section id="how-it-works" className="py-12 sm:py-16 lg:py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20">
            Intelligent Workflow
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
            How The AI System Works
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            A seamless bridge between atmospheric conditions and intelligent product discovery
          </p>
        </div>

        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition duration-300 hover:border-cyan-400/40 hover:bg-white/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-cyan-400/40">
                      {item.step}
                    </span>
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                      <Icon size={22} />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-white mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
