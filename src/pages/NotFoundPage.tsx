import React from 'react';
import { Compass, ArrowLeft, Zap, Search, Laptop, Apple, Smartphone, BookOpen } from 'lucide-react';
import { Link } from '../hooks/useRouter.tsx';

interface NotFoundPageProps {
  navigate: (path: string) => void;
  onOpenSearch?: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ navigate, onOpenSearch }) => {
  return (
    <div className="py-16 sm:py-24 text-center max-w-xl mx-auto space-y-8 px-4">
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
          The page you requested doesn&apos;t exist or may have moved. Try jumping back to the home page, searching, or exploring our verified software directories.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
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
          <span>Explore All Tools</span>
        </Link>

        {onOpenSearch && (
          <button
            type="button"
            onClick={onOpenSearch}
            className="btn-glass text-xs inline-flex items-center gap-2"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search All</span>
          </button>
        )}
      </div>

      {/* Helpful Directory Recovery Links */}
      <div className="pt-6 border-t border-[rgba(143,163,192,0.12)] space-y-3">
        <span className="text-xs font-mono uppercase tracking-wider text-[#9aaccb] block font-semibold">
          Or Explore Verified Directories
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => navigate('/pc-tools')}
            className="p-3 rounded-2xl bg-[#0a1424] hover:bg-[#101c33] border border-[rgba(143,163,192,0.12)] hover:border-[#0a84ff] transition-all text-xs font-medium text-[#f2f7ff] flex flex-col items-center gap-1.5 focus-ring"
          >
            <Laptop size={16} className="text-[#0a84ff]" />
            <span>PC Tools</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/apple-tools')}
            className="p-3 rounded-2xl bg-[#0a1424] hover:bg-[#101c33] border border-[rgba(143,163,192,0.12)] hover:border-[#8b5cf6] transition-all text-xs font-medium text-[#f2f7ff] flex flex-col items-center gap-1.5 focus-ring"
          >
            <Apple size={16} className="text-[#8b5cf6]" />
            <span>Apple Tools</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/android-tools')}
            className="p-3 rounded-2xl bg-[#0a1424] hover:bg-[#101c33] border border-[rgba(143,163,192,0.12)] hover:border-[#34e0a1] transition-all text-xs font-medium text-[#f2f7ff] flex flex-col items-center gap-1.5 focus-ring"
          >
            <Smartphone size={16} className="text-[#34e0a1]" />
            <span>Android Tools</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/guides')}
            className="p-3 rounded-2xl bg-[#0a1424] hover:bg-[#101c33] border border-[rgba(143,163,192,0.12)] hover:border-[#ffb840] transition-all text-xs font-medium text-[#f2f7ff] flex flex-col items-center gap-1.5 focus-ring"
          >
            <BookOpen size={16} className="text-[#ffb840]" />
            <span>How-To Guides</span>
          </button>
        </div>
      </div>
    </div>
  );
};
