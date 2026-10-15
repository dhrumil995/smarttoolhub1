import React, { useState, useEffect } from 'react';
import { Bookmark, Copy, Check, Trash2, ArrowUpRight, Zap } from 'lucide-react';
import { getToolHistory, clearToolHistory, SavedItem } from '../utils/storage.ts';
import { Link } from '../hooks/useRouter.tsx';

interface SavedResultsPageProps {
  navigate: (path: string) => void;
}

export const SavedResultsPage: React.FC<SavedResultsPageProps> = ({ navigate }) => {
  const [history, setHistory] = useState<SavedItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setHistory(getToolHistory());
  }, []);

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
    }
  };

  const handleClear = () => {
    if (window.confirm('Clear all locally saved results?')) {
      clearToolHistory();
      setHistory([]);
    }
  };

  return (
    <div className="py-6 sm:py-12 max-w-4xl mx-auto space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[rgba(143,163,192,0.14)] pb-6">
        <div className="space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-[#39ff88]">
            Local Offline Storage
          </div>
          <h1 className="h1-fluid font-display text-[#f2f7ff]">
            Saved Results<span className="text-[#39ff88]">.</span>
          </h1>
          <p className="body-fluid text-[#8fa3c0] max-w-xl">
            Recent tool generations saved automatically to your device. No account or login required.
          </p>
        </div>

        {history.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="btn-glass text-xs text-[#ff5c7a] border-[#ff5c7a]/30 hover:border-[#ff5c7a] self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </header>

      {history.length > 0 ? (
        <div className="space-y-4">
          {history.map((item) => (
            <div
              key={item.id}
              className="glass-surface p-5 sm:p-6 rounded-3xl border border-[rgba(143,163,192,0.14)] space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-[#f2f7ff]">
                    {item.toolName}
                  </span>
                  <span className="text-[#8fa3c0] text-xs">·</span>
                  <span className="text-xs text-[#8fa3c0]">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(item.id, item.result)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0a1424] border border-[rgba(143,163,192,0.2)] text-xs text-[#f2f7ff] hover:border-[#39ff88] transition-colors focus-laser"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-[#39ff88]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
                  </button>

                  <Link
                    href={`/tools/${item.toolSlug}`}
                    navigate={navigate}
                    className="p-1.5 rounded-lg bg-[#0a1424] border border-[rgba(143,163,192,0.2)] text-[#8fa3c0] hover:text-[#39ff88] transition-colors focus-laser"
                    title="Open tool"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="text-xs text-[#8fa3c0] font-mono p-2.5 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.1)] truncate">
                <span className="text-[#39ff88]">&gt; Input: </span>{item.prompt}
              </div>

              <pre className="p-4 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.14)] text-xs sm:text-sm text-[#f2f7ff] font-sans whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
                {item.result}
              </pre>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-surface p-12 rounded-3xl border border-[rgba(143,163,192,0.14)] text-center space-y-4 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-[#0a1424] border border-[rgba(57,255,136,0.3)] flex items-center justify-center text-[#39ff88] mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold font-display text-[#f2f7ff]">
            No saved results yet
          </h2>
          <p className="text-xs sm:text-sm text-[#8fa3c0] leading-relaxed">
            When you generate an Apple Shortcut, email, or prompt, your results will appear here automatically for easy reference.
          </p>
          <Link
            href="/tools"
            navigate={navigate}
            className="btn-laser text-xs inline-flex items-center gap-2 mt-2"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Explore Tools</span>
          </Link>
        </div>
      )}
    </div>
  );
};
