import React, { useState, useEffect, useRef } from 'react';
import { PageId } from '../types';
import { WORKFLOWS_DATA } from '../data/workflows';
import { COMPATIBILITY_FEATURES } from '../data/compatibility';
import { TROUBLESHOOTING_DATA } from '../data/troubleshooting';
import { Search, X, BookOpen, Cpu, Wrench, ArrowRight } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: PageId, workflowId?: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger open via parent or event
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();

  // Filter workflows
  const matchedWorkflows = WORKFLOWS_DATA.filter((wf) =>
    wf.title.toLowerCase().includes(normalizedQuery) ||
    wf.summary.toLowerCase().includes(normalizedQuery) ||
    wf.tags.some((t) => t.toLowerCase().includes(normalizedQuery)) ||
    wf.category.toLowerCase().includes(normalizedQuery)
  ).slice(0, 4);

  // Filter compatibility features
  const matchedCompatibility = COMPATIBILITY_FEATURES.filter((f) =>
    f.name.toLowerCase().includes(normalizedQuery) ||
    f.description.toLowerCase().includes(normalizedQuery) ||
    f.hardwareChips.toLowerCase().includes(normalizedQuery)
  ).slice(0, 3);

  // Filter troubleshooting guides
  const matchedTroubleshooting = TROUBLESHOOTING_DATA.filter((ts) =>
    ts.title.toLowerCase().includes(normalizedQuery) ||
    ts.feature.toLowerCase().includes(normalizedQuery) ||
    ts.symptoms.some((s) => s.toLowerCase().includes(normalizedQuery))
  ).slice(0, 3);

  const totalResults = matchedWorkflows.length + matchedCompatibility.length + matchedTroubleshooting.length;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-label="Global search command palette"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/65 backdrop-blur-md animate-in fade-in duration-150 cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#0F1118]/85 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.25)] overflow-hidden cursor-default"
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-white/[0.10] bg-white/[0.02]">
          <Search className="w-5 h-5 text-blue-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search workflows, error symptoms, Continuity, Sequoia, or shortcuts..."
            className="w-full bg-transparent text-sm text-white placeholder-[#777777] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#888888] hover:text-white rounded-md mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="apple-key text-[10px]">ESC</kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {totalResults === 0 && query ? (
            <div className="py-10 text-center text-[#888888]">
              <p className="text-sm">No exact matches found for "{query}"</p>
              <p className="text-xs mt-1 text-[#666666]">Try searching for "AirDrop", "Sequoia", "Sidecar", "Shortcuts", or "Audio".</p>
            </div>
          ) : (
            <>
              {/* Workflows Group */}
              {matchedWorkflows.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold text-[#888888] uppercase tracking-wider">
                    <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                    <span>Workflows</span>
                  </div>
                  <div className="mt-1 space-y-1">
                    {matchedWorkflows.map((wf) => (
                      <button
                        key={wf.id}
                        onClick={() => {
                          onNavigate('workflow-detail', wf.id);
                          onClose();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl text-left bg-white/[0.02] hover:bg-white/[0.07] border border-transparent hover:border-white/10 transition-colors group cursor-pointer"
                      >
                        <div>
                          <p className="text-xs font-medium text-white group-hover:text-blue-300 transition-colors">
                            {wf.title}
                          </p>
                          <p className="text-[11px] text-[#888888] line-clamp-1 mt-0.5">
                            {wf.summary}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-[#666666] group-hover:text-blue-400 shrink-0 ml-3">
                          <span>{wf.setupTimeMinutes}m</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Compatibility Features Group */}
              {matchedCompatibility.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold text-[#888888] uppercase tracking-wider">
                    <Cpu className="w-3.5 h-3.5 text-purple-400" />
                    <span>Hardware Compatibility</span>
                  </div>
                  <div className="mt-1 space-y-1">
                    {matchedCompatibility.map((feat) => (
                      <button
                        key={feat.id}
                        onClick={() => {
                          onNavigate('compatibility');
                          onClose();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl text-left bg-white/[0.02] hover:bg-white/[0.07] border border-transparent hover:border-white/10 transition-colors group cursor-pointer"
                      >
                        <div>
                          <p className="text-xs font-medium text-white group-hover:text-purple-300 transition-colors">
                            {feat.name}
                          </p>
                          <p className="text-[11px] text-[#888888] line-clamp-1 mt-0.5">
                            {feat.description}
                          </p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 shrink-0 ml-2">
                          {feat.category}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Troubleshooting Group */}
              {matchedTroubleshooting.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold text-[#888888] uppercase tracking-wider">
                    <Wrench className="w-3.5 h-3.5 text-amber-400" />
                    <span>Troubleshooting Diagnoses</span>
                  </div>
                  <div className="mt-1 space-y-1">
                    {matchedTroubleshooting.map((ts) => (
                      <button
                        key={ts.id}
                        onClick={() => {
                          onNavigate('troubleshooting');
                          onClose();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl text-left bg-white/[0.02] hover:bg-white/[0.07] border border-transparent hover:border-white/10 transition-colors group cursor-pointer"
                      >
                        <div>
                          <p className="text-xs font-medium text-white group-hover:text-amber-300 transition-colors">
                            {ts.title}
                          </p>
                          <p className="text-[11px] text-[#888888] line-clamp-1 mt-0.5">
                            Feature: {ts.feature} • {ts.quickFixSteps.length} quick fixes
                          </p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 shrink-0 ml-2">
                          Fix Now
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer info in palette */}
        <div className="p-2.5 bg-white/[0.03] backdrop-blur-md border-t border-white/[0.08] flex items-center justify-between text-[11px] text-[#888888] px-4">
          <div className="flex items-center gap-3">
            <span>Press <kbd className="apple-key text-[10px] py-0 px-1">↑</kbd> <kbd className="apple-key text-[10px] py-0 px-1">↓</kbd> to navigate</span>
            <span><kbd className="apple-key text-[10px] py-0 px-1">↵</kbd> to select</span>
          </div>
          <span>Instant Apple ecosystem search</span>
        </div>
      </div>
    </div>
  );
};
