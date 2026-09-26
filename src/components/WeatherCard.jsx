import React from "react";

export default function WeatherCard({ location = "Ahmedabad", temp = 24, condition = "Light Rain", humidity = "82%", wind = "12 km/h" }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl text-white">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-slate-400">Your Location</p>
          <h3 className="text-xl font-bold">{location}</h3>
        </div>
        <span className="text-2xl">🌧️</span>
      </div>
      <div className="my-4 flex items-baseline gap-2">
        <span className="text-5xl font-light">{temp}°</span>
        <span className="text-sm text-cyan-300">{condition}</span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
        <div className="bg-white/5 p-2 rounded-xl">Humidity: {humidity}</div>
        <div className="bg-white/5 p-2 rounded-xl">Wind: {wind}</div>
      </div>
    </div>
  );
}
