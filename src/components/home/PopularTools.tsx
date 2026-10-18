import React from 'react';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { SectionHeader } from '../ui/SectionHeader.tsx';
import { ToolCard } from '../ui/ToolCard.tsx';

interface PopularToolsProps {
  navigate: (path: string) => void;
}

export const PopularTools: React.FC<PopularToolsProps> = ({ navigate }) => {
  // Curate 4 top tools for quick everyday access
  const popular = LAUNCH_TOOLS.slice(0, 4);

  return (
    <section className="py-12 sm:py-16 border-t border-[rgba(143,163,192,0.12)]">
      <SectionHeader
        eyebrow="Quick Launch"
        eyebrowIcon="Zap"
        title="Popular tools"
        subtext="The fastest way to accomplish everyday writing, automation, and calculation tasks."
        viewAllHref="/tools"
        viewAllLabel="View all tools"
        navigate={navigate}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {popular.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            navigate={navigate}
          />
        ))}
      </div>
    </section>
  );
};
