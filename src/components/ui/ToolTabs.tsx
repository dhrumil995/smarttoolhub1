import React from 'react';
import { Icon } from './Icon.tsx';

export interface TabItem {
  id: string;
  label: string;
  icon?: string;
  count?: number;
}

export interface ToolTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

/**
 * Tool Tabs conforming to Phase 3:
 * - Underline tab bar with sliding green indicator
 * - 44px tap targets
 * - Accessible tablist with aria-selected
 */
export const ToolTabs: React.FC<ToolTabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
}) => {
  return (
    <div
      role="tablist"
      className={`border-b border-[rgba(143,163,192,0.14)] flex items-center gap-6 overflow-x-auto scrollbar-none ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 h-11 px-1 relative font-semibold text-xs transition-colors select-none whitespace-nowrap focus-ring rounded-t-lg ${
              isActive ? 'text-[#0a84ff] font-bold' : 'text-[#9aaccb] hover:text-[#f2f7ff]'
            }`}
          >
            {tab.icon && (
              <Icon
                name={tab.icon}
                size="sm"
                strokeWidth={1.75}
                className={isActive ? 'text-[#0a84ff]' : 'text-[#9aaccb]'}
                aria-hidden={true}
              />
            )}
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                isActive ? 'bg-[#0a84ff]/20 text-[#5aa9ff]' : 'bg-[#0a1424] text-[#9aaccb]'
              }`}>
                {tab.count}
              </span>
            )}

            {/* Sliding Brand Gradient Underline Indicator */}
            {isActive && (
              <span
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#0b6bf0] via-[#7a45f5] to-[#ff4f9a] rounded-full shadow-[0_0_8px_rgba(10,132,255,0.4)]"
                aria-hidden="true"
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
