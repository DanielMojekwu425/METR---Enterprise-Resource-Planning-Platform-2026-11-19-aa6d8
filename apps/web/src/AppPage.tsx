import React from 'react';
import { MotionConfig } from 'motion/react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ConnectedWorkflowSection } from './components/ConnectedWorkflowSection';
import { ModulesGridSection } from './components/ModulesGridSection';
import { ArchitectureTrustSection } from './components/ArchitectureTrustSection';
import { RoadmapSection } from './components/RoadmapSection';
import { FaqSection } from './components/FaqSection';
import { WaitlistSection } from './components/WaitlistSection';
import { Footer } from './components/Footer';

export function AppPage() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex flex-col bg-[#F5F7FA] text-[#172B4D]">
        <Navbar />
        <main className="flex-1">
          <HeroSection />
          <ConnectedWorkflowSection />
          <ModulesGridSection />
          <ArchitectureTrustSection />
          <RoadmapSection />
          <FaqSection />
          <WaitlistSection />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}

export default AppPage;
