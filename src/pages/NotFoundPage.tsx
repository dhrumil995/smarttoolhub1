import React from 'react';
import { Compass, ArrowLeft, Zap, Search } from 'lucide-react';
import { Link } from '../hooks/useRouter.tsx';

interface NotFoundPageProps {
  navigate: (path: string) => void;
  onOpenSearch?: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ navigate, onOpenSearch }) => {
  return (
    <div className="py-16 sm:py-24 text-center max-w-lg mx-auto space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-[#0a1424] border border-[rgba(255,92,122,0.3)] flex items-center justify-center text-[#ff5c7a] mx-auto shadow-[0_0_24px_rgba(255,92,122,0.15)]">
        <Compass className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <div className="font-mono text-xs text-[#ff5c7a] uppercase tracking-wider font-semibold">
          Error 404 · Page Not Found
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-[#f2f7ff]">
          Lost in cyberspace?
        </h1>
        <p className="text-sm text-[#8fa3c0] leading-relaxed max-w-md mx-auto">
          The page you requested doesn&apos;t exist or may have moved. Try jumping back to the home page or browsing our free everyday AI tools.
        </p>
      </div>

      <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="btn-primary text-xs inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>

        <Link
          href="/tools"
          navigate={navigate}
          className="btn-glass text-xs inline-flex items-center gap-2"
        >
          <Zap className="w-3.5 h-3.5 text-[#0a84ff]" />
          <span>Explore 8 Tools</span>
        </Link>

        {onOpenSearch && (
          <button
            type="button"
            onClick={onOpenSearch}
            className="btn-glass text-xs inline-flex items-center gap-2"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
        )}
      </div>
    </div>
  );
};
