import React, { useState } from 'react';
import {
  Share2,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  BookmarkCheck,
  AlertCircle,
} from 'lucide-react';
import { CopyButton, Button } from './Button.tsx';
import { useToast } from './Toast.tsx';
import { shareWithFallback } from '../../utils/share.ts';
import { saveToolResult } from '../../utils/storage.ts';

export interface ResultCardProps {
  toolSlug: string;
  toolName: string;
  inputPrompt: string;
  result: string;
  onRegenerate?: () => void;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Standard Result Card conforming to Phase 3:
 * - Header row with mono label "RESULT"
 * - Action icons: Copy, Share2, RefreshCw ("Regenerate"), ThumbsUp, ThumbsDown, Bookmark (Save)
 * - Selectable, readable body text with max 65-character lines (max-w-[65ch])
 * - Footer with honest note ("AI can make mistakes. Check important details.")
 * - Web Share API with clipboard copy fallback
 * - Bookmark saves to localStorage with try/catch
 */
export const ResultCard: React.FC<ResultCardProps> = ({
  toolSlug,
  toolName,
  inputPrompt,
  result,
  onRegenerate,
  className = '',
  children,
}) => {
  const { showToast } = useToast();
  const [isSaved, setIsSaved] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<'up' | 'down' | null>(null);

  const handleBookmark = () => {
    try {
      saveToolResult(toolSlug, toolName, inputPrompt, result);
      setIsSaved(true);
      showToast('Saved to your device offline storage!');
    } catch {
      showToast('Could not save result to local storage', 'error');
    }
  };

  const handleShare = async () => {
    const res = await shareWithFallback({
      title: `${toolName} Result · SmartToolHub`,
      text: result,
      url: typeof window !== 'undefined' ? window.location.href : '',
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

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedbackGiven(type);
    showToast(type === 'up' ? 'Helpful rating noted!' : 'Rating noted for quality improvement.', 'info');
  };

  return (
    <section
      aria-label="Generated Tool Result"
      className={`glass-surface rounded-3xl p-5 sm:p-7 border border-[rgba(143,163,192,0.18)] shadow-2xl space-y-4 ${className}`}
    >
      {/* Header Row: Mono Label "RESULT" + Standard Action Icons */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(143,163,192,0.12)] pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#0a84ff]" aria-hidden="true" />
          <span className="font-mono text-xs uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#5aa9ff] to-[#ff7ab5] font-bold">
            RESULT
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Copy Button */}
          <CopyButton
            textToCopy={result}
            size="sm"
            onCopySuccess={() => showToast('Copied to clipboard!')}
          />

          {/* Share */}
          <Button
            variant="icon-only"
            size="sm"
            onClick={handleShare}
            aria-label="Share result"
            title="Share"
            className="w-10 h-10 min-w-[40px] min-h-[40px]"
          >
            <Share2 size={16} aria-hidden="true" />
          </Button>

          {/* Regenerate */}
          {onRegenerate && (
            <Button
              variant="icon-only"
              size="sm"
              onClick={onRegenerate}
              aria-label="Regenerate result"
              title="Regenerate"
              className="w-10 h-10 min-w-[40px] min-h-[40px]"
            >
              <RefreshCw size={15} aria-hidden="true" />
            </Button>
          )}

          {/* Feedback: ThumbsUp & ThumbsDown */}
          <Button
            variant="icon-only"
            size="sm"
            onClick={() => handleFeedback('up')}
            aria-label="Helpful result"
            title="Helpful"
            className={`w-10 h-10 min-w-[40px] min-h-[40px] ${
              feedbackGiven === 'up' ? 'text-[#34e0a1] border-[#34e0a1]' : ''
            }`}
          >
            <ThumbsUp size={15} aria-hidden="true" />
          </Button>

          <Button
            variant="icon-only"
            size="sm"
            onClick={() => handleFeedback('down')}
            aria-label="Not helpful"
            title="Not helpful"
            className={`w-10 h-10 min-w-[40px] min-h-[40px] ${
              feedbackGiven === 'down' ? 'text-[#ff5c7a] border-[#ff5c7a]' : ''
            }`}
          >
            <ThumbsDown size={15} aria-hidden="true" />
          </Button>

          {/* Bookmark (Save to localStorage) */}
          <Button
            variant="icon-only"
            size="sm"
            onClick={handleBookmark}
            aria-label={isSaved ? 'Saved to device' : 'Save result to device'}
            title={isSaved ? 'Saved' : 'Save to device'}
            className={`w-10 h-10 min-w-[40px] min-h-[40px] ${
              isSaved ? 'text-[#0a84ff] border-[#0a84ff] bg-[rgba(10,132,255,0.08)]' : ''
            }`}
          >
            {isSaved ? (
              <BookmarkCheck size={16} className="text-[#0a84ff]" aria-hidden="true" />
            ) : (
              <Bookmark size={16} aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>

      {/* Body: Selectable and easy to read, with max 65-character lines */}
      {children ? (
        children
      ) : (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.14)] max-h-[520px] overflow-y-auto selection:bg-[#0a84ff] selection:text-[#050a14]">
          <div className="text-sm sm:text-base text-[#f2f7ff] leading-relaxed max-w-[65ch] whitespace-pre-wrap">
            {result}
          </div>
        </div>
      )}

      {/* Footer: Honest Note */}
      <div className="flex items-center gap-2 text-xs text-[#8fa3c0] pt-1">
        <AlertCircle size={14} className="text-[#ffb840] shrink-0" aria-hidden="true" />
        <span>AI can make mistakes. Check important details.</span>
      </div>
    </section>
  );
};
