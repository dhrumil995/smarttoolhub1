/**
 * Utility functions for Colorful Glassmorphism Theme mapping
 * Maps workflow and tool categories to Apple-inspired vibrant frosted glass styling.
 */

export type GlassCategory =
  | 'Audio & Video Production'
  | 'Productivity & Focus'
  | 'Study & Research'
  | 'Cross-Device File Sync'
  | 'Developer & Automation'
  | 'shortcuts'
  | 'image'
  | 'text'
  | 'seo'
  | 'calculator'
  | 'diagnostics'
  | 'all'
  | string;

export interface GlassColorConfig {
  cardClass: string;
  badgeClass: string;
  textAccentClass: string;
  iconBgClass: string;
  glowClass: string;
  borderHoverClass: string;
  chipClass: string;
  dotColor: string;
}

export function getGlassTheme(category?: GlassCategory): GlassColorConfig {
  const cat = (category || '').toLowerCase();

  // 1. Audio / Video / Shortcuts -> Violet & Indigo
  if (cat.includes('audio') || cat.includes('video') || cat === 'shortcuts') {
    return {
      cardClass: 'glass-violet',
      badgeClass: 'bg-violet-500/15 text-violet-600 dark:text-violet-300 border-violet-500/30',
      textAccentClass: 'text-violet-600 dark:text-violet-400',
      iconBgClass: 'bg-violet-500/10 dark:bg-violet-500/20 border-violet-500/30 text-violet-600 dark:text-violet-400',
      glowClass: 'bg-violet-500/20',
      borderHoverClass: 'hover:border-violet-400/60',
      chipClass: 'bg-violet-500/10 text-violet-600 dark:text-violet-300 border-violet-500/25',
      dotColor: '#A78BFA',
    };
  }

  // 2. Cross-Device Sync / Image Tools / Diagnostics -> Electric Cyan
  if (cat.includes('sync') || cat.includes('continuity') || cat === 'image' || cat === 'diagnostics') {
    return {
      cardClass: 'glass-cyan',
      badgeClass: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border-cyan-500/30',
      textAccentClass: 'text-cyan-600 dark:text-cyan-400',
      iconBgClass: 'bg-cyan-500/10 dark:bg-cyan-500/20 border-cyan-500/30 text-cyan-600 dark:text-cyan-400',
      glowClass: 'bg-cyan-500/20',
      borderHoverClass: 'hover:border-cyan-400/60',
      chipClass: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border-cyan-500/25',
      dotColor: '#22D3EE',
    };
  }

  // 3. Productivity / SEO / Security -> Emerald & Mint
  if (cat.includes('productivity') || cat.includes('focus') || cat === 'seo') {
    return {
      cardClass: 'glass-emerald',
      badgeClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30',
      textAccentClass: 'text-emerald-600 dark:text-emerald-400',
      iconBgClass: 'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
      glowClass: 'bg-emerald-500/20',
      borderHoverClass: 'hover:border-emerald-400/60',
      chipClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/25',
      dotColor: '#34D399',
    };
  }

  // 4. Study / Research / Text -> Warm Amber & Gold
  if (cat.includes('study') || cat.includes('research') || cat === 'text') {
    return {
      cardClass: 'glass-amber',
      badgeClass: 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30',
      textAccentClass: 'text-amber-600 dark:text-amber-400',
      iconBgClass: 'bg-amber-500/10 dark:bg-amber-500/20 border-amber-500/30 text-amber-600 dark:text-amber-400',
      glowClass: 'bg-amber-500/20',
      borderHoverClass: 'hover:border-amber-400/60',
      chipClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/25',
      dotColor: '#FBBF24',
    };
  }

  // 5. Developer / Automation / Calculator -> Rose & Fuchsia
  if (cat.includes('developer') || cat.includes('calculator') || cat.includes('silicon')) {
    return {
      cardClass: 'glass-rose',
      badgeClass: 'bg-rose-500/15 text-rose-600 dark:text-rose-300 border-rose-500/30',
      textAccentClass: 'text-rose-600 dark:text-rose-400',
      iconBgClass: 'bg-rose-500/10 dark:bg-rose-500/20 border-rose-500/30 text-rose-600 dark:text-rose-400',
      glowClass: 'bg-rose-500/20',
      borderHoverClass: 'hover:border-rose-400/60',
      chipClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/25',
      dotColor: '#FB7185',
    };
  }

  // Default Indigo
  return {
    cardClass: 'glass-violet',
    badgeClass: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 border-indigo-500/30',
    textAccentClass: 'text-indigo-600 dark:text-indigo-400',
    iconBgClass: 'bg-indigo-500/10 dark:bg-indigo-500/20 border-indigo-500/30 text-indigo-600 dark:text-indigo-400',
    glowClass: 'bg-indigo-500/20',
    borderHoverClass: 'hover:border-indigo-400/60',
    chipClass: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border-indigo-500/25',
    dotColor: '#818CF8',
  };
}
