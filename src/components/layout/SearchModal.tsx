import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronRight, Zap } from 'lucide-react';
import { LAUNCH_TOOLS } from '../../data/tools.ts';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  navigate: (path: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  navigate,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Global keyboard shortcut '/' to open search and 'Escape' to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isOpen && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredTools = LAUNCH_TOOLS.filter((t) =>
    t.name.toLowerCase().includes(query.toLowerCase()) ||
    t.description.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (slug: string) => {
    navigate(`/tools/${slug}`);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search tools"
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-[#050a14]/85 backdrop-blur-[16px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl glass-surface rounded-2xl border border-[rgba(143,163,192,0.2)] p-4 shadow-2xl flex flex-col max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.2)]">
          <Search className="w-5 h-5 text-[#8fa3c0] shrink-0" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a tool name (e.g. shortcuts, email, formulas)..."
            className="flex-1 bg-transparent text-sm text-[#f2f7ff] placeholder-[#8fa3c0] focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-[#8fa3c0] hover:text-[#f2f7ff] focus-laser rounded"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <span className="font-mono text-[10px] text-[#8fa3c0] px-1.5 py-0.5 rounded border border-[rgba(143,163,192,0.16)]">
              ESC
            </span>
          )}
        </div>

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto mt-3 space-y-1.5 pr-1">
          {filteredTools.length > 0 ? (
            filteredTools.map((tool) => (
              <button
                key={tool.id}
                type="button"
                onClick={() => handleSelect(tool.slug)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#0a1424]/50 hover:bg-[#101c33] border border-transparent hover:border-[rgba(57,255,136,0.24)] transition-all text-left group focus-laser"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#050a14] border border-[rgba(143,163,192,0.16)] flex items-center justify-center text-[#39ff88] shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-[#f2f7ff] truncate group-hover:text-[#39ff88] transition-colors">
                      {tool.name}
                    </div>
                    <div className="text-xs text-[#8fa3c0] truncate">
                      {tool.description}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8fa3c0] group-hover:text-[#39ff88] shrink-0 transition-colors" />
              </button>
            ))
          ) : (
            <div className="py-8 text-center text-sm text-[#8fa3c0]">
              No tools matching &ldquo;{query}&rdquo;.
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-3 pt-2 border-t border-[rgba(143,163,192,0.12)] flex items-center justify-between text-[11px] text-[#8fa3c0]">
          <span>Free AI tools · Instant results</span>
          <button
            type="button"
            onClick={() => {
              navigate('/tools');
              onClose();
            }}
            className="hover:text-[#39ff88] transition-colors"
          >
            Browse all 8 tools &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
