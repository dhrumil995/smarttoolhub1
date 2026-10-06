/**
 * High-Fidelity Apple & Developer Theme Mapping
 * Provides cohesive, tasteful micro-accents while maintaining architectural surface consistency.
 * Eliminates rainbow clashing to deliver an ultra-clean Linear / Apple Developer aesthetic.
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

  // 1. Audio / Video / Shortcuts -> Refined Indigo / Royal Violet
  if (cat.includes('audio') || cat.includes('video') || cat === 'shortcuts') {
    return {
      cardClass: 'bento-card hover:border-indigo-500/40',
      badgeClass: 'bg-indigo-500/10 text-indigo-500 dark:text-indigo-300 border-indigo-500/20',
      textAccentClass: 'text-indigo-600 dark:text-indigo-400',
      iconBgClass: 'bg-indigo-500/10 dark:bg-indigo-500/15 border-indigo-500/25 text-indigo-600 dark:text-indigo-400',
      glowClass: 'bg-indigo-500/10',
      borderHoverClass: 'hover:border-indigo-400/40',
      chipClass: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border-indigo-500/20',
      dotColor: '#818CF8',
    };
  }

  // 2. Cross-Device Sync / Image Tools / Diagnostics -> Precision Sky Cyan
  if (cat.includes('sync') || cat.includes('continuity') || cat === 'image' || cat === 'diagnostics') {
    return {
      cardClass: 'bento-card hover:border-cyan-500/40',
      badgeClass: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border-cyan-500/20',
      textAccentClass: 'text-cyan-600 dark:text-cyan-400',
      iconBgClass: 'bg-cyan-500/10 dark:bg-cyan-500/15 border-cyan-500/25 text-cyan-600 dark:text-cyan-400',
      glowClass: 'bg-cyan-500/10',
      borderHoverClass: 'hover:border-cyan-400/40',
      chipClass: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border-cyan-500/20',
      dotColor: '#38BDF8',
    };
  }

  // 3. Productivity / SEO / Security -> Emerald / Mint
  if (cat.includes('productivity') || cat.includes('focus') || cat === 'seo') {
    return {
      cardClass: 'bento-card hover:border-emerald-500/40',
      badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20',
      textAccentClass: 'text-emerald-600 dark:text-emerald-400',
      iconBgClass: 'bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/25 text-emerald-600 dark:text-emerald-400',
      glowClass: 'bg-emerald-500/10',
      borderHoverClass: 'hover:border-emerald-400/40',
      chipClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20',
      dotColor: '#34D399',
    };
  }

  // 4. Study / Research / Text -> Amber / Bronze
  if (cat.includes('study') || cat.includes('research') || cat === 'text') {
    return {
      cardClass: 'bento-card hover:border-amber-500/40',
      badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20',
      textAccentClass: 'text-amber-600 dark:text-amber-400',
      iconBgClass: 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-500/25 text-amber-600 dark:text-amber-400',
      glowClass: 'bg-amber-500/10',
      borderHoverClass: 'hover:border-amber-400/40',
      chipClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20',
      dotColor: '#FBBF24',
    };
  }

  // 5. Developer / Automation / Calculator -> Fuchsia / Rose
  if (cat.includes('developer') || cat.includes('calculator') || cat.includes('silicon')) {
    return {
      cardClass: 'bento-card hover:border-rose-500/40',
      badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/20',
      textAccentClass: 'text-rose-600 dark:text-rose-400',
      iconBgClass: 'bg-rose-500/10 dark:bg-rose-500/15 border-rose-500/25 text-rose-600 dark:text-rose-400',
      glowClass: 'bg-rose-500/10',
      borderHoverClass: 'hover:border-rose-400/40',
      chipClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/20',
      dotColor: '#FB7185',
    };
  }

  // Default Cohesive Slate Glass
  return {
    cardClass: 'bento-card hover:border-indigo-500/40',
    badgeClass: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border-indigo-500/20',
    textAccentClass: 'text-indigo-600 dark:text-indigo-400',
    iconBgClass: 'bg-indigo-500/10 dark:bg-indigo-500/15 border-indigo-500/25 text-indigo-600 dark:text-indigo-400',
    glowClass: 'bg-indigo-500/10',
    borderHoverClass: 'hover:border-indigo-400/40',
    chipClass: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border-indigo-500/20',
    dotColor: '#818CF8',
  };
}
