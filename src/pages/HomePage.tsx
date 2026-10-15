import React from 'react';
import { HeroSection } from '../components/home/HeroSection.tsx';
import { BentoGrid } from '../components/home/BentoGrid.tsx';
import { HowItWorks } from '../components/home/HowItWorks.tsx';
import { PopularTools } from '../components/home/PopularTools.tsx';
import { LatestGuides } from '../components/home/LatestGuides.tsx';
import { FaqSection } from '../components/home/FaqSection.tsx';
import { ClosingCta } from '../components/home/ClosingCta.tsx';

interface HomePageProps {
  navigate: (path: string) => void;
  onOpenSearch: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate, onOpenSearch }) => {
  return (
    <div className="w-full">
      {/* 1. Hero with live mini-tool demo */}
      <HeroSection onExploreClick={onOpenSearch} />

      {/* 2. Tool Bento Grid (12-column with flagship Apple Shortcuts) */}
      <BentoGrid navigate={navigate} />

      {/* 3. "How it works" in 3 steps */}
      <HowItWorks />

      {/* 4. Popular Tools */}
      <PopularTools navigate={navigate} />

      {/* 5. Latest Guides */}
      <LatestGuides navigate={navigate} />

      {/* 6. FAQ (6 real questions) */}
      <FaqSection />

      {/* 7. Closing Call-to-Action */}
      <ClosingCta navigate={navigate} />
    </div>
  );
};
