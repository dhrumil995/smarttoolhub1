import React from 'react';
import { Laptop, Apple, Smartphone, ArrowRight, ShieldCheck, Terminal, Scale } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader.tsx';

interface SoftwareHubPreviewProps {
  navigate: (path: string) => void;
}

const ECOSYSTEMS = [
  {
    id: 'pc',
    title: 'PC & Windows Tools',
    path: '/pc-tools',
    count: '20 Apps',
    icon: Laptop,
    accentColor: '#0a84ff',
    badgeText: 'winget verified',
    desc: 'High-speed NTFS MFT analyzers, window snapping, debloating, and system diagnostics for Windows 10 & 11.',
    highlightApps: ['PowerToys', 'WizTree', 'Rufus', 'Everything', 'Flow Launcher'],
  },
  {
    id: 'apple',
    title: 'Apple & Mac Tools',
    path: '/apple-tools',
    count: '10 Apps',
    icon: Apple,
    accentColor: '#8b5cf6',
    badgeText: 'brew cask verified',
    desc: 'Lightweight native Swift utilities, menu bar decluttering, window tiling, and battery telemetry for macOS & iOS.',
    highlightApps: ['Raycast', 'Rectangle', 'Stats', 'Ice', 'coconutBattery'],
  },
  {
    id: 'android',
    title: 'Android Power Tools',
    path: '/android-tools',
    count: '20 Apps',
    icon: Smartphone,
    accentColor: '#34e0a1',
    badgeText: 'F-Droid & Shizuku',
    desc: 'Wireless ADB automation, tracker scanning, screen mirroring, and offline utilities without root or tethered PCs.',
    highlightApps: ['scrcpy', 'Shizuku', 'Tasker', 'Termux', 'LocalSend'],
  },
];

const COMPARISONS_LIST = [
  {
    title: 'WizTree vs TreeSize Free',
    path: '/compare/wiztree-vs-treesize',
    tag: 'Storage',
    highlight: 'MFT speed vs Network drives',
  },
  {
    title: 'Rufus vs Ventoy',
    path: '/compare/rufus-vs-ventoy',
    tag: 'Bootable USB',
    highlight: 'Single-OS vs Multi-ISO drag-and-drop',
  },
  {
    title: 'PowerToys vs Flow Launcher',
    path: '/compare/powertoys-vs-flow-launcher',
    tag: 'Productivity',
    highlight: 'Full system utility suite vs Plugin launcher',
  },
  {
    title: '3uTools vs iMazing',
    path: '/compare/3utools-vs-imazing',
    tag: 'iOS Management',
    highlight: 'Apple official advisory first & privacy audits',
  },
  {
    title: 'Shizuku & ADB Wireless Guide',
    path: '/compare/shizuku-adb-wireless-guide',
    tag: 'Android Systems',
    highlight: 'Wireless elevated permissions without root',
  },
];

export const SoftwareHubPreview: React.FC<SoftwareHubPreviewProps> = ({ navigate }) => {
  return (
    <section className="py-12 sm:py-16 border-t border-[rgba(143,163,192,0.12)]">
      <SectionHeader
        eyebrow="Software Directory & Comparisons"
        eyebrowIcon="Laptop"
        title="Curated tools for Windows, Mac & Android"
        subtext="50 vetted open-source utilities, verified one-line package manager commands, honest limitations, and head-to-head comparisons."
        viewAllHref="/pc-tools"
        viewAllLabel="Explore PC tools"
        navigate={navigate}
      />

      {/* 3 Ecosystem Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {ECOSYSTEMS.map((eco) => {
          const IconComp = eco.icon;
          return (
            <div
              key={eco.id}
              onClick={() => navigate(eco.path)}
              className="group relative p-6 rounded-3xl bg-[#0a1424]/70 hover:bg-[#101c33] border border-[rgba(143,163,192,0.14)] hover:border-[#0a84ff]/50 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center border border-[rgba(143,163,192,0.16)] bg-[#050a14]"
                    style={{ color: eco.accentColor }}
                  >
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#9aaccb] bg-[#050a14] px-2.5 py-1 rounded-full border border-[rgba(143,163,192,0.12)] font-semibold">
                    {eco.count}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#f2f7ff] group-hover:text-white transition-colors mb-2">
                  {eco.title}
                </h3>
                <p className="text-xs text-[#9aaccb] leading-relaxed mb-4">
                  {eco.desc}
                </p>

                {/* Popular apps preview */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {eco.highlightApps.map((app) => (
                    <span
                      key={app}
                      className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#050a14]/80 text-[#8fa3c0] border border-[rgba(143,163,192,0.1)]"
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[rgba(143,163,192,0.1)] flex items-center justify-between text-xs font-semibold text-[#0a84ff] group-hover:text-[#5aa9ff]">
                <span className="flex items-center gap-1.5 text-[11px] font-mono uppercase text-[#9aaccb]">
                  <Terminal className="w-3.5 h-3.5 text-[#34e0a1]" />
                  {eco.badgeText}
                </span>
                <span className="flex items-center gap-1">
                  Browse directory <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Head-to-Head Comparison Ribbon */}
      <div className="p-6 rounded-3xl bg-[#0a1424]/40 border border-[rgba(143,163,192,0.14)] space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#ffb840]" />
            <h4 className="text-sm font-bold text-[#f2f7ff]">
              Head-to-Head Software Comparisons
            </h4>
          </div>
          <span className="text-xs text-[#9aaccb]">
            Objective analysis with verified official recommendations
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {COMPARISONS_LIST.map((comp) => (
            <button
              key={comp.path}
              type="button"
              onClick={() => navigate(comp.path)}
              className="p-3.5 rounded-2xl bg-[#050a14]/60 hover:bg-[#101c33] border border-[rgba(143,163,192,0.12)] hover:border-[#ffb840]/40 transition-all text-left group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#ffb840] font-semibold">
                    {comp.tag}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#9aaccb] group-hover:text-[#ffb840] group-hover:translate-x-0.5 transition-all" />
                </div>
                <div className="text-xs font-semibold text-[#f2f7ff] group-hover:text-white transition-colors">
                  {comp.title}
                </div>
              </div>
              <div className="text-[11px] text-[#9aaccb] mt-2">
                {comp.highlight}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
