import MainLayout from "@/layouts/MainLayout";
import HeroSection from "@/components/HeroSection";
import ExpertiseSection from "@/components/ExpertiseSection";
import AboutSection from "@/components/AboutSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CustomersCarousel from "@/components/CustomersCarousel";
import CallToActionSection from "@/components/CallToActionSection";
import DataVisualizationSection from "@/components/DataVisualizationSection";
import ContactSection from "@/components/ContactSection";
import ChatAgent from "@/components/ChatAgent";
import WavySeparator from "@/components/ui/wavy-separator";

export default function Home() {
  return (
    <MainLayout>
      <HeroSection />
      <WavySeparator />
      <ExpertiseSection />
      <WavySeparator />
      <AboutSection />
      <WavySeparator />
      <DataVisualizationSection />
      <WavySeparator />
      <TestimonialsSection />
      <WavySeparator />
      <CustomersCarousel />
      <WavySeparator />
      <CallToActionSection />
      <WavySeparator />
      <ContactSection />
      <ChatAgent />
    </MainLayout>
  );
}
