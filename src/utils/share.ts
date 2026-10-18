/**
 * Robust Web Share API with automatic clipboard fallback and user-facing status.
 */
export interface ShareOptions {
  title: string;
  text: string;
  url?: string;
}

export interface ShareResult {
  success: boolean;
  mode: 'native' | 'clipboard' | 'failed';
  message: string;
}

export async function shareWithFallback(options: ShareOptions): Promise<ShareResult> {
  const shareData: ShareData = {
    title: options.title,
    text: options.text,
    url: options.url || (typeof window !== 'undefined' ? window.location.href : ''),
  };

  // Try Web Share API on supported devices (e.g. mobile Safari, Chrome Android)
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share(shareData);
      return {
        success: true,
        mode: 'native',
        message: 'Shared successfully!',
      };
    } catch (err: any) {
      // If user aborted or dismissed the share sheet, return friendly status without clipboard spam
      if (err?.name === 'AbortError') {
        return {
          success: false,
          mode: 'native',
          message: 'Share dismissed',
        };
      }
      // If permission or other error occurred, fall through to clipboard copy
    }
  }

  // Fallback: Copy content directly to system clipboard
  try {
    const textToCopy = `${options.text}\n\n${options.url || ''}`.trim();
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(textToCopy);
      return {
        success: true,
        mode: 'clipboard',
        message: 'Copied to clipboard! (Share sheet not supported)',
      };
    }

    // Older mobile browser execCommand fallback
    const textArea = document.createElement('textarea');
    textArea.value = textToCopy;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);

    if (successful) {
      return {
        success: true,
        mode: 'clipboard',
        message: 'Copied to clipboard!',
      };
    }
  } catch (clipErr) {
    console.error('Clipboard copy failed:', clipErr);
  }

  return {
    success: false,
    mode: 'failed',
    message: 'Could not share or copy. Please select the text manually.',
  };
}
