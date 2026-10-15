import React from 'react';
import { Home, Grid, Search, Bookmark, MoreHorizontal } from 'lucide-react';
import { TabKey } from '../../types/navigation.ts';

interface BottomTabBarProps {
  currentPath: string;
  navigate: (path: string) => void;
  onOpenSearch: () => void;
  onOpenMore: () => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  currentPath,
  navigate,
  onOpenSearch,
  onOpenMore,
}) => {
  const getActiveTab = (): TabKey => {
    if (currentPath === '/') return 'home';
    if (currentPath.startsWith('/tools')) return 'tools';
    if (currentPath === '/saved') return 'saved';
    return 'more';
  };

  const activeTab = getActiveTab();

  const handleTabClick = (key: TabKey) => {
    if (key === 'home') navigate('/');
    else if (key === 'tools') navigate('/tools');
    else if (key === 'search') onOpenSearch();
    else if (key === 'saved') navigate('/saved');
    else if (key === 'more') onOpenMore();
  };

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#050a14]/90 backdrop-blur-[20px] border-t border-[rgba(143,163,192,0.16)] safe-bottom"
    >
      <div className="grid grid-cols-5 items-center h-14 max-w-md mx-auto px-2">
        {/* Home */}
        <button
          type="button"
          onClick={() => handleTabClick('home')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors focus-laser rounded-lg ${
            activeTab === 'home' ? 'text-[#39ff88]' : 'text-[#8fa3c0] hover:text-[#f2f7ff]'
          }`}
          aria-label="Home page"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-1">Home</span>
        </button>

        {/* Tools */}
        <button
          type="button"
          onClick={() => handleTabClick('tools')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors focus-laser rounded-lg ${
            activeTab === 'tools' ? 'text-[#39ff88]' : 'text-[#8fa3c0] hover:text-[#f2f7ff]'
          }`}
          aria-label="All Tools"
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-1">Tools</span>
        </button>

        {/* Search */}
        <button
          type="button"
          onClick={() => handleTabClick('search')}
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 text-[#8fa3c0] hover:text-[#f2f7ff] transition-colors focus-laser rounded-lg"
          aria-label="Search tools"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-1">Search</span>
        </button>

        {/* Saved */}
        <button
          type="button"
          onClick={() => handleTabClick('saved')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors focus-laser rounded-lg ${
            activeTab === 'saved' ? 'text-[#39ff88]' : 'text-[#8fa3c0] hover:text-[#f2f7ff]'
          }`}
          aria-label="Saved results and history"
        >
          <Bookmark className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-1">Saved</span>
        </button>

        {/* More */}
        <button
          type="button"
          onClick={() => handleTabClick('more')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors focus-laser rounded-lg ${
            activeTab === 'more' ? 'text-[#39ff88]' : 'text-[#8fa3c0] hover:text-[#f2f7ff]'
          }`}
          aria-label="More options and menu"
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-1">More</span>
        </button>
      </div>
    </nav>
  );
};
