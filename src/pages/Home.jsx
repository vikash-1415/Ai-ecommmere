import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import CategorySection from "../components/CategorySection";
import RecommendationSection from "../components/RecommendationSection";
import TrendingSection from "../components/TrendingSection";
import HowItWorks from "../components/HowItWorks";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";

export default function Home() {
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
