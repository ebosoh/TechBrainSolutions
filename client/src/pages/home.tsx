import { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import HeroSection from "@/components/HeroSection";
import ExpertiseSection from "@/components/ExpertiseSection";
import AboutSection from "@/components/AboutSection";
import SimpleCustomersCarousel from "@/components/SimpleCustomersCarousel";
import CallToActionSection from "@/components/CallToActionSection";
import DataVisualizationSection from "@/components/DataVisualizationSection";
import ContactSection from "@/components/ContactSection";
import ChatAgent from "@/components/ChatAgent";
import WavySeparator from "@/components/ui/wavy-separator";
import AnnouncementCard from "@/components/AnnouncementCard";

export default function Home() {
  const [showAnnouncement, setShowAnnouncement] = useState(true);

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
      <SimpleCustomersCarousel />
      <WavySeparator />
      <CallToActionSection />
      <WavySeparator />
      <ContactSection />
      <ChatAgent />
      
      {showAnnouncement && (
        <AnnouncementCard 
          message="We are happy to launch Tajiri AI, Your Data-driven MMF Investment Advisor."
          ctaText="Learn More"
          ctaLink="https://tajiri.live/"
          onClose={() => setShowAnnouncement(false)}
          showDelay={2000}
        />
      )}
    </MainLayout>
  );
}
