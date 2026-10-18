import React, { useState, useEffect } from 'react';
import { Trash2, ArrowUpRight, Share2 } from 'lucide-react';
import { getToolHistory, clearToolHistory, SavedItem } from '../utils/storage.ts';
import { Link } from '../hooks/useRouter.tsx';
import { shareWithFallback } from '../utils/share.ts';
import { Icon } from '../components/ui/Icon.tsx';
import { TOOL_ICON_MAP } from '../data/tools.ts';
import { useToast } from '../components/ui/Toast.tsx';
import { CopyButton, Button } from '../components/ui/Button.tsx';
import { EmptyState } from '../components/ui/EmptyState.tsx';

interface SavedResultsPageProps {
  navigate: (path: string) => void;
}

export const SavedResultsPage: React.FC<SavedResultsPageProps> = ({ navigate }) => {
  const [history, setHistory] = useState<SavedItem[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    setHistory(getToolHistory());
  }, []);

  const handleShare = async (item: SavedItem) => {
    const res = await shareWithFallback({
      title: `${item.toolName} Result · SmartToolHub`,
      text: item.result,
      url: typeof window !== 'undefined' ? `${window.location.origin}/tools/${item.toolSlug}` : '',
    });

    if (res.success) {
      if (res.mode === 'native') {
        showToast('Shared successfully!');
      } else {
        showToast('Copied link to clipboard!');
      }
    } else if (res.message !== 'Share dismissed') {
      showToast(res.message, 'error');
    }
  };

  const handleClear = () => {
    if (window.confirm('Clear all locally saved results?')) {
      clearToolHistory();
      setHistory([]);
      showToast('All saved history cleared', 'info');
    }
  };

  return (
    <div className="py-6 sm:py-12 max-w-4xl mx-auto space-y-8 relative">
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
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-xs text-[#ff5c7a] border border-[#ff5c7a]/30 hover:border-[#ff5c7a] hover:bg-[#ff5c7a]/10 self-start sm:self-auto"
          >
            <Trash2 size={14} className="mr-1.5" aria-hidden="true" />
            <span>Clear History</span>
          </Button>
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
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#0a1424] border border-[rgba(143,163,192,0.18)] flex items-center justify-center text-[#39ff88] shrink-0">
                    <Icon name={TOOL_ICON_MAP[item.toolSlug] || 'Bookmark'} size="sm" strokeWidth={1.75} aria-hidden={true} />
                  </div>
                  <span className="font-semibold text-sm text-[#f2f7ff]">
                    {item.toolName}
                  </span>
                  <span className="text-[#8fa3c0] text-xs">·</span>
                  <span className="text-xs text-[#8fa3c0]">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <CopyButton
                    textToCopy={item.result}
                    size="sm"
                    onCopySuccess={() => showToast('Copied to clipboard!')}
                  />

                  <Button
                    variant="icon-only"
                    size="sm"
                    onClick={() => handleShare(item)}
                    aria-label="Share result"
                    className="w-11 h-11"
                  >
                    <Share2 size={16} aria-hidden="true" />
                  </Button>

                  <Link
                    href={`/tools/${item.toolSlug}`}
                    navigate={navigate}
                    className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] flex items-center justify-center text-[#8fa3c0] hover:text-[#39ff88] hover:border-[#39ff88] transition-colors focus-laser"
                    aria-label={`Open ${item.toolName}`}
                  >
                    <ArrowUpRight size={16} aria-hidden="true" />
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
        <EmptyState
          icon="History"
          message="Nothing here yet. Try an example."
          actionLabel="Explore Tools"
          onAction={() => navigate('/tools')}
          className="my-12"
        />
      )}
    </div>
  );
};
