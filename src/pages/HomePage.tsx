import React, { useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  LayoutGrid,
  Lock,
  Cpu,
  Layers,
  Terminal,
  Bookmark,
  Search,
  ExternalLink,
} from 'lucide-react';
import { LAUNCH_TOOLS } from '../data/tools.ts';
import { ToolCard } from '../components/ui/ToolCard.tsx';
import { LiveMiniTool } from '../components/home/LiveMiniTool.tsx';
import { Link } from '../hooks/useRouter.tsx';

interface HomePageProps {
  navigate: (path: string) => void;
  onOpenSearch: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate, onOpenSearch }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'ai' | 'apple' | 'developer' | 'files'>('all');

  const topTools = LAUNCH_TOOLS.filter((t) => t.isFlagship).slice(0, 8);
  const clientTools = LAUNCH_TOOLS.filter((t) => t.type === 'client').slice(0, 8);

  const filteredTabTools = LAUNCH_TOOLS.filter((tool) => {
    if (activeTab === 'ai') return tool.type === 'ai';
    if (activeTab === 'apple') return tool.category === 'Apple' || tool.slug.includes('iphone');
    if (activeTab === 'developer') return tool.category === 'Developer' || tool.category === 'Calculators';
    if (activeTab === 'files') return tool.category === 'Files';
    return true;
  }).slice(0, 15);

  return (
    <div className="w-full space-y-10 sm:space-y-12 pb-24 overflow-x-hidden">
      {/* 1. Mobile-Optimized Hero with Sandbox */}
      <section className="relative rounded-2xl sm:rounded-3xl bg-white border border-gray-200/90 shadow-sm p-5 sm:p-8 lg:p-12 overflow-hidden">
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-purple-100/50 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-blue-100/40 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
          {/* Left Column: Value Prop & Actions */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/80 text-[11px] sm:text-xs font-semibold text-purple-700">
              <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
              <span>Version 2026.4 · 55+ Verified Utilities</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
              The professional toolkit for everyday computing<span className="text-[#0a84ff]">.</span>
            </h1>

            <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl">
              Zero logins. Zero telemetry. High-performance client-side utilities, Apple automation generators, and AI assistants engineered for instant execution.
            </p>

            <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => navigate('/tools')}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#6d28d9] hover:bg-[#5b21b6] text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group touch-press"
              >
                <span>Browse All 55+ Tools</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                type="button"
                onClick={onOpenSearch}
                className="w-full sm:w-auto px-5 py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 touch-press"
              >
                <Search className="w-4 h-4 text-gray-400" />
                <span>Command Search (⌘K)</span>
              </button>
            </div>

            {/* Mobile Metric Strip */}
            <div className="pt-4 sm:pt-6 border-t border-gray-100 grid grid-cols-3 gap-2 sm:gap-4 text-xs">
              <div>
                <div className="text-lg sm:text-xl font-bold font-mono text-gray-900">0s</div>
                <div className="text-gray-500 text-[10px] sm:text-[11px] mt-0.5">Login delay</div>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-bold font-mono text-gray-900">100%</div>
                <div className="text-gray-500 text-[10px] sm:text-[11px] mt-0.5">Private files</div>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-bold font-mono text-purple-700">55+</div>
                <div className="text-gray-500 text-[10px] sm:text-[11px] mt-0.5">Ready tools</div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Playground Sandbox */}
          <div className="lg:col-span-5 w-full mt-2 lg:mt-0">
            <div className="rounded-xl sm:rounded-2xl border border-gray-200/90 bg-gray-50/70 p-3.5 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="ml-2 font-mono text-[11px] text-gray-400 font-semibold">
                    live_demo.sh
                  </span>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-700 font-bold bg-purple-100/60 px-2 py-0.5 rounded">
                  Instant Test
                </span>
              </div>
              <LiveMiniTool />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Flagship Category Bento Cards (Horizontal Swipe on Mobile) */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Featured Workflows
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Engineered for mobile &amp; desktop power users.
            </p>
          </div>
        </div>

        {/* Horizontal Carousel on Mobile (< sm), Grid on Desktop */}
        <div className="flex sm:grid sm:grid-cols-3 gap-3 sm:gap-4.5 overflow-x-auto sm:overflow-visible pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory scrollbar-none">
          {/* Card 1: Apple Ecosystem */}
          <div
            onClick={() => navigate('/tools/apple-shortcuts-generator')}
            className="w-[270px] sm:w-auto shrink-0 snap-start bg-white border border-gray-200/90 rounded-2xl p-5 hover:shadow-lg hover:border-purple-300 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-base">
                ⚡
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                Apple Shortcuts Generator
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Build iOS and macOS automation flows from natural language descriptions with 1-click install links.
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-semibold text-purple-700 gap-1 group-hover:translate-x-1 transition-transform">
              <span>Launch generator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Developer Diagnostics */}
          <div
            onClick={() => navigate('/tools/cidr-subnet-calculator')}
            className="w-[270px] sm:w-auto shrink-0 snap-start bg-white border border-gray-200/90 rounded-2xl p-5 hover:shadow-lg hover:border-purple-300 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                Developer &amp; Network Tools
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                CIDR subnet planning, Cron schedule generators, Regex tester, and JSON/YAML converters.
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-semibold text-purple-700 gap-1 group-hover:translate-x-1 transition-transform">
              <span>Explore developer tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: Privacy Document Suite */}
          <div
            onClick={() => navigate('/tools/pdf-merge-split')}
            className="w-[270px] sm:w-auto shrink-0 snap-start bg-white border border-gray-200/90 rounded-2xl p-5 hover:shadow-lg hover:border-purple-300 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                Private Client-Side PDF Suite
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Merge, split, and extract text from sensitive files in your mobile browser with zero server uploads.
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-semibold text-purple-700 gap-1 group-hover:translate-x-1 transition-transform">
              <span>Open PDF tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Top Rated Library Grid (Horizontal Swipe on Mobile) */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Top Rated by Users
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Swipe to explore most popular daily utilities.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/tools')}
            className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 group"
          >
            <span>View All ({LAUNCH_TOOLS.length})</span>
            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Mobile Horizontal Carousel (< sm), Desktop 4-Col Grid */}
        <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 overflow-x-auto sm:overflow-visible pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory scrollbar-none">
          {topTools.map((tool) => (
            <div key={tool.slug} className="w-[270px] sm:w-auto shrink-0 snap-start">
              <ToolCard tool={tool} navigate={navigate} />
            </div>
          ))}
        </div>
      </section>

      {/* 4. Complete Library by Category Tabs */}
      <section className="space-y-5 pt-6 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Explore Complete Directory
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Select a domain to filter zero-install tools.
            </p>
          </div>

          {/* Segmented Category Buttons with smooth horizontal scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            {[
              { id: 'all', label: 'All Tools' },
              { id: 'ai', label: 'AI & Writing' },
              { id: 'apple', label: 'Apple & iOS' },
              { id: 'developer', label: 'Developer & CLI' },
              { id: 'files', label: 'Files & PDF' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors touch-press ${
                  activeTab === tab.id
                    ? 'bg-purple-700 text-white font-semibold shadow-xs'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 5-Column Grid on Desktop, 1-Col or 2-Col on Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4.5">
          {filteredTabTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} navigate={navigate} />
          ))}
        </div>

        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={() => navigate('/tools')}
            className="w-full sm:w-auto px-8 py-3.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm rounded-xl shadow-md transition-all inline-flex items-center justify-center gap-2 touch-press"
          >
            <span>Browse Full Directory (55+ Tools)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 5. Enterprise Security & Privacy Declaration */}
      <section className="rounded-2xl bg-white border border-gray-200/90 p-5 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
          <div className="md:col-span-8 space-y-2.5">
            <div className="flex items-center gap-2 text-purple-700">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                Enterprise-Grade Privacy Architecture
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Every document utility, OCR tool, and calculator operates client-side inside your browser sandbox. Unlike other online directories that upload your PDF files and photos to unknown third-party clouds, SmartToolHub executes directly in your browser with zero telemetry.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero Server Uploads</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero Tracking Cookies</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>100% Free Forever</span>
              </span>
            </div>
          </div>

          <div className="md:col-span-4 flex justify-start md:justify-end pt-2 md:pt-0">
            <button
              type="button"
              onClick={() => navigate('/about')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-center"
            >
              Learn about our architecture
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
