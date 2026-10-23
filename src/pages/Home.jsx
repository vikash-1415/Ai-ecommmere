import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import CategorySection from "../components/CategorySection";
import RecommendationSection from "../components/RecommendationSection";
import TrendingSection from "../components/TrendingSection";
import HowItWorks from "../components/HowItWorks";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";
import { updateMeta, injectStructuredData, schemaGenerators } from "../utils/seo";

export default function Home() {
  useEffect(() => {
    updateMeta({
      title: "WeatherCart - AI-Powered Weather-Based Smart Shopping",
      description: "Smart e-commerce tailored to your local weather. Discover monsoon waterproof apparel, UV50+ heat defense, and 3-layer winter essentials in real time.",
      canonical: window.location.origin,
    });
    injectStructuredData(schemaGenerators.organization(), "homepage-org-schema");
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <Navbar />

      <main>
        <Hero />

        <CategorySection />

        <RecommendationSection />

        <TrendingSection />

        <HowItWorks />

        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
