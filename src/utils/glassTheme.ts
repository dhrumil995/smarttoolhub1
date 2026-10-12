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

  // Highlighted category -> Laser green accent
  if (cat.includes('shortcuts') || cat.includes('audio') || cat.includes('video')) {
    return {
      cardClass: 'bento-card hover:border-[#39ff88]/50',
      badgeClass: 'bg-[#39ff88]/10 text-[#39ff88] border-[#39ff88]/25 font-mono text-[11px] uppercase tracking-wider',
      textAccentClass: 'text-[#39ff88]',
      iconBgClass: 'bg-[#39ff88]/10 border-[#39ff88]/25 text-[#39ff88]',
      glowClass: 'bg-[#39ff88]/15',
      borderHoverClass: 'hover:border-[#39ff88]/50',
      chipClass: 'bg-[#39ff88]/10 text-[#39ff88] border-[#39ff88]/25',
      dotColor: '#39ff88',
    };
  }

  // All other categories -> Navy surfaces with laser green hover rings and crisp mute metadata
  return {
    cardClass: 'bento-card hover:border-[#39ff88]/40',
    badgeClass: 'bg-[#101c33] text-[#8fa3c0] border-[rgba(143,163,192,0.16)] font-mono text-[11px] uppercase tracking-wider',
    textAccentClass: 'text-[#39ff88]',
    iconBgClass: 'bg-[#101c33] border-[rgba(143,163,192,0.2)] text-[#f2f7ff]',
    glowClass: 'bg-[#39ff88]/10',
    borderHoverClass: 'hover:border-[#39ff88]/40',
    chipClass: 'bg-[#101c33] text-[#8fa3c0] border-[rgba(143,163,192,0.2)]',
    dotColor: '#39ff88',
  };
}
