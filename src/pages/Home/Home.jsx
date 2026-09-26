import React from "react";
import Navbar from "../../components/navbar/Navbar";
import HeroSection from "../../components/layout/HeroSection";
import AIRecommendationSection from "../../components/recommendations/AIRecommendationSection";
import CategorySection from "../../components/layout/CategorySection";
import HowItWorksSection from "../../components/layout/HowItWorksSection";
import ProductGrid from "../../components/products/ProductGrid";
import Footer from "../../components/layout/Footer";
import { productsData } from "../../data/products";

export default function Home() {
  const trendingProducts = productsData.filter((p) => p.isPopular).slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Responsive Hero Section */}
        <HeroSection />

        {/* Core USP: AI Recommendations */}
        <AIRecommendationSection />

        {/* Category Explorer */}
        <CategorySection />

        {/* How It Works Diagrammatic Flow */}
        <HowItWorksSection />

        {/* Trending Essentials Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ProductGrid
              products={trendingProducts}
              title="Trending Seasonal Essentials"
              subtitle="Top-rated gear shoppers are currently checking out in your region"
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
