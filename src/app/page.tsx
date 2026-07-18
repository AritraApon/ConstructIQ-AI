export const dynamic = "force-dynamic";

import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import StatisticsSection from "@/components/home/StatisticsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FAQSection from "@/components/home/FAQSection";
import CTASection from "@/components/home/CTASection";


export const metadata = {
  title: "ConstructIQ AI — AI-Powered Civil Engineering Estimator",
  description:
    "Harness machine learning to generate precise construction cost estimates, track material pipelines, and accelerate your civil engineering projects.",
};

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <StatisticsSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />

    </main>
  );
}
