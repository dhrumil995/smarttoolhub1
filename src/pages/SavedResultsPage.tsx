import React, { useState, useEffect } from 'react';
import { Trash2, ArrowUpRight, Share2, AlertCircle, Bookmark, Sparkles, BookOpen } from 'lucide-react';
import { getToolHistory, clearToolHistory, deleteSavedItem, SavedItem } from '../utils/storage.ts';
import { Link } from '../hooks/useRouter.tsx';
import { shareWithFallback } from '../utils/share.ts';
import { Icon } from '../components/ui/Icon.tsx';
import { TOOL_ICON_MAP } from '../data/tools.ts';
import { SOFTWARE_APPS } from '../data/softwareDirectory.ts';
import { useToast } from '../components/ui/Toast.tsx';
import { CopyButton, Button } from '../components/ui/Button.tsx';
import { EmptyState } from '../components/ui/EmptyState.tsx';

interface SavedResultsPageProps {
  navigate: (path: string) => void;
}

export const SavedResultsPage: React.FC<SavedResultsPageProps> = ({ navigate }) => {
  const [history, setHistory] = useState<SavedItem[]>([]);
  const [isConfirmingClear, setIsConfirmingClear] = useState<boolean>(false);
  const { showToast } = useToast();

  useEffect(() => {
    setHistory(getToolHistory());
  }, []);

  const getItemHref = (slug: string) => {
    if (slug.startsWith('guide-')) {
      return `/guides/${slug.replace('guide-', '')}`;
    }
    if (SOFTWARE_APPS[slug]) {
      const app = SOFTWARE_APPS[slug];
      const hub = app.platform === 'apple' ? 'apple-tools' : app.platform === 'android' ? 'android-tools' : 'pc-tools';
      return `/${hub}/${slug}`;
    }
    return `/tools/${slug}`;
  };

  const handleShare = async (item: SavedItem) => {
    const itemPath = getItemHref(item.toolSlug);
    const res = await shareWithFallback({
      title: `${item.toolName} · SmartToolHub`,
      text: item.result,
      url: typeof window !== 'undefined' ? `${window.location.origin}${itemPath}` : '',
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

  const handleConfirmClear = () => {
    clearToolHistory();
    setHistory([]);
    setIsConfirmingClear(false);
    showToast('All saved history cleared', 'info');
  };

  const handleDeleteItem = (id: string) => {
    deleteSavedItem(id);
    setHistory((prev) => prev.filter((item) => item.id !== id));
    showToast('Item removed from history', 'info');
  };

  return (
    <div className="py-6 sm:py-12 max-w-4xl mx-auto space-y-8 relative">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[rgba(143,163,192,0.14)] pb-6">
        <div className="space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-[#0a84ff]">
            Local Offline Storage
          </div>
          <h1 className="h1-fluid font-display text-[#f2f7ff]">
            Saved Results<span className="text-[#0a84ff]">.</span>
          </h1>
          <p className="body-fluid text-[#8fa3c0] max-w-xl">
            Recent tool generations, software profile bookmarks, and guide snippets saved automatically to your device. No account or login required.
          </p>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {isConfirmingClear ? (
              <div className="flex items-center gap-2 bg-[#101c33] p-1.5 rounded-2xl border border-[#ff5c7a]/40 shadow-lg">
                <span className="text-xs text-[#f2f7ff] px-2 font-medium">Clear all?</span>
                <button
                  type="button"
                  onClick={handleConfirmClear}
                  className="px-3 py-1 rounded-xl bg-[#ff5c7a] text-white text-xs font-semibold hover:brightness-110 transition-all focus-ring"
                >
                  Yes, Clear All
                </button>
                <button
                  type="button"
                  onClick={() => setIsConfirmingClear(false)}
                  className="px-2.5 py-1 rounded-xl bg-transparent text-xs text-[#9aaccb] hover:text-[#f2f7ff] transition-all focus-ring"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsConfirmingClear(true)}
                className="text-xs text-[#ff5c7a] border border-[#ff5c7a]/30 hover:border-[#ff5c7a] hover:bg-[#ff5c7a]/10 self-start sm:self-auto"
              >
                <Trash2 size={14} className="mr-1.5" aria-hidden="true" />
                <span>Clear History</span>
              </Button>
            )}
          </div>
        )}
      </header>

      {history.length > 0 ? (
        <div className="space-y-4">
          {history.map((item) => {
            const itemHref = getItemHref(item.toolSlug);
            const isGuide = item.toolSlug.startsWith('guide-');
            const isApp = Boolean(SOFTWARE_APPS[item.toolSlug]);

            return (
              <div
                key={item.id}
                className="glass-surface p-5 sm:p-6 rounded-3xl border border-[rgba(143,163,192,0.14)] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#0a1424] border border-[rgba(143,163,192,0.18)] flex items-center justify-center text-[#0a84ff] shrink-0">
                      {isGuide ? (
                        <BookOpen className="w-4 h-4 text-[#ffb840]" />
                      ) : isApp ? (
                        <Bookmark className="w-4 h-4 text-[#34e0a1]" />
                      ) : (
                        <Icon name={TOOL_ICON_MAP[item.toolSlug] || 'Zap'} size="sm" strokeWidth={1.75} aria-hidden={true} />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[#f2f7ff]">
                          {item.toolName}
                        </span>
                        {isGuide && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#101c33] text-[#ffb840]">
                            Guide
                          </span>
                        )}
                        {isApp && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#101c33] text-[#34e0a1]">
                            Software Bookmark
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#8fa3c0]">
                        Saved {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </div>
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

                    <Button
                      variant="icon-only"
                      size="sm"
                      onClick={() => handleDeleteItem(item.id)}
                      aria-label="Delete this saved result"
                      className="w-11 h-11 text-[#8fa3c0] hover:text-[#ff5c7a] hover:border-[#ff5c7a]/40"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </Button>

                    <Link
                      href={itemHref}
                      navigate={navigate}
                      className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] flex items-center justify-center text-[#8fa3c0] hover:text-[#0a84ff] hover:border-[#0a84ff] transition-colors focus-ring"
                      aria-label={`Open ${item.toolName}`}
                    >
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </Link>
                  </div>
                </div>

                <div className="text-xs text-[#8fa3c0] font-mono p-2.5 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.1)] truncate">
                  <span className="text-[#0a84ff]">&gt; Input: </span>{item.prompt}
                </div>

                <pre className="p-4 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.14)] text-xs sm:text-sm text-[#f2f7ff] font-sans whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
                  {item.result}
                </pre>
              </div>
            );
          })}
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
