import { HeroSection } from "@/components/HeroSection";
import { PhilosophyBar } from "@/components/PhilosophyBar";
import { ClassesSection } from "@/components/ClassesSection";
import { PromoBannersSection } from "@/components/PromoBannersSection";
import { ManifestoSection } from "@/components/ManifestoSection";
import { TeachersSection } from "@/components/TeachersSection";
import { GallerySection } from "@/components/GallerySection";
import { PricingSection } from "@/components/PricingSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { PressSection } from "@/components/PressSection";
import { CTASection } from "@/components/CTASection";
import { AIChatWidget } from "@/components/AIChatWidget";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PhilosophyBar />
      <ClassesSection />
      <PromoBannersSection />
      <ManifestoSection />
      <TeachersSection />
      <GallerySection />
      <PricingSection />
      <TestimonialsSection />
      <PressSection />
      <CTASection />
      <AIChatWidget />
    </>
  );
}
