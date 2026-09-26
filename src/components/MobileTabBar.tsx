import React from 'react';
import { PageId } from '../types';
import { haptics } from '../utils/haptics';
import { Home, Wand2, Wrench, BookOpen, Search } from 'lucide-react';

interface MobileTabBarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  onOpenSearch: () => void;
}

export const MobileTabBar: React.FC<MobileTabBarProps> = ({
  currentPage,
  onNavigate,
  onOpenSearch,
}) => {
  const tabs = [
    { id: 'home' as PageId, label: 'Home', icon: Home },
    { id: 'generator' as PageId, label: 'Shortcuts', icon: Wand2 },
    { id: 'troubleshooting' as PageId, label: 'Sync Doctor', icon: Wrench },
    { id: 'library' as PageId, label: 'Workflows', icon: BookOpen },
  ];

  return (
    <nav
      aria-label="iOS Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 ios-glass-tabbar shadow-[0_-4px_24px_rgba(0,0,0,0.15)] select-none transition-colors duration-250"
      style={{
        paddingBottom: 'max(0.6rem, env(safe-area-inset-bottom, 0.6rem))',
      }}
    >
      <div className="grid grid-cols-5 h-[52px] max-w-lg mx-auto px-1 items-center">
        {tabs.map((tab) => {
          const isActive = currentPage === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                haptics.playTap();
                onNavigate(tab.id);
              }}
              className={`flex flex-col items-center justify-center h-full w-full py-1 min-h-[44px] transition-all duration-200 active:scale-90 ${
                isActive
                  ? 'text-[#0A84FF]'
                  : 'text-[#86868B] hover:text-neutral-900 dark:hover:text-[#F5F5F7]'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'stroke-[2.2] scale-105' : 'stroke-[1.8]'
                  }`}
                />
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-[#0A84FF] shadow-[0_0_6px_#0A84FF]" />
                )}
              </div>
              <span
                className={`text-[10px] mt-0.5 tracking-tight ${
                  isActive ? 'font-semibold text-[#0A84FF]' : 'font-normal'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* 5th Tab: Quick Search */}
        <button
          onClick={() => {
            haptics.playTap();
            onOpenSearch();
          }}
          className="flex flex-col items-center justify-center h-full w-full py-1 min-h-[44px] text-[#86868B] hover:text-neutral-900 dark:hover:text-[#F5F5F7] transition-all duration-200 active:scale-90"
        >
          <Search className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] mt-0.5 font-normal tracking-tight">Search</span>
        </button>
      </div>
    </nav>
  );
};
