/**
 * Google Tag Manager & dataLayer helper
 * Provides type-safe event tracking for Google Tag Manager containers and Google Analytics 4 (GA4).
 */

declare global {
  interface Window {
    dataLayer?: Record<string, any>[];
    gtag?: (...args: any[]) => void;
    __GTM_ID__?: string;
  }
}

const GTM_STORAGE_KEY = 'smarttoolhub_gtm_id';

/**
 * Retrieve the active or stored Google Tag Manager container ID
 */
export function getStoredGtmId(): string {
  if (typeof window === 'undefined') return '';
  try {
    return window.__GTM_ID__ || localStorage.getItem(GTM_STORAGE_KEY) || '';
  } catch (_) {
    return '';
  }
}

/**
 * Update the stored GTM container ID and dynamically load/reload the GTM script
 */
export function setStoredGtmId(newId: string): void {
  if (typeof window === 'undefined') return;
  const cleanId = newId.trim();
  try {
    if (cleanId) {
      localStorage.setItem(GTM_STORAGE_KEY, cleanId);
      window.__GTM_ID__ = cleanId;
      initGTM(cleanId);
    } else {
      localStorage.removeItem(GTM_STORAGE_KEY);
      delete window.__GTM_ID__;
    }
  } catch (_) {}
}

/**
 * Initialize or dynamically inject Google Tag Manager container script safely
 */
export function initGTM(gtmId?: string): void {
  if (typeof window === 'undefined') return;
  const idToLoad = (gtmId || getStoredGtmId() || '').trim();
  if (!idToLoad || idToLoad.includes('XXXXXXX')) {
    return;
  }

  // Ensure dataLayer is ready
  window.dataLayer = window.dataLayer || [];

  // Check if GTM script with this ID already exists
  const existingScript = document.querySelector(`script[src*="googletagmanager.com/gtm.js?id=${idToLoad}"]`);
  if (!existingScript) {
    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js',
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(idToLoad)}`;
    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.head.appendChild(script);
    }
  }
}

/**
 * Push arbitrary event payload to window.dataLayer safely and mirror to gtag if present
 */
export function pushToDataLayer(eventPayload: Record<string, any>): void {
  if (typeof window === 'undefined') return;
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      ...eventPayload,
      timestamp: eventPayload.timestamp || new Date().toISOString(),
    });

    // Mirror to GA4 gtag() if event name is present
    if (typeof window.gtag === 'function' && eventPayload.event) {
      const { event, ...params } = eventPayload;
      window.gtag('event', event, params);
    }
  } catch (err) {
    console.warn('[GTM] Failed to push event to dataLayer:', err);
  }
}

/**
 * Track virtual page views for SPA navigation
 */
export function trackPageView(pageId: string, pageTitle?: string, path?: string): void {
  const currentPath = path || (typeof window !== 'undefined' ? window.location.pathname + window.location.search : '');
  const currentTitle = pageTitle || (typeof document !== 'undefined' ? document.title : '');

  pushToDataLayer({
    event: 'virtual_page_view',
    page_id: pageId,
    page_path: currentPath,
    page_title: currentTitle,
    page_location: typeof window !== 'undefined' ? window.location.href : '',
  });
}

/**
 * Track Apple Shortcut creation / generation
 */
export function trackShortcutGenerate(params: {
  shortcutName?: string;
  triggerType?: string;
  actionsCount?: number;
  category?: string;
  source?: string;
}): void {
  pushToDataLayer({
    event: 'generate_shortcut',
    shortcut_name: params.shortcutName || 'Untitled Shortcut',
    trigger_type: params.triggerType || 'manual',
    actions_count: params.actionsCount || 1,
    category: params.category || 'General',
    generator_source: params.source || 'home_generator',
  });
}

/**
 * Track pre-built workflow interaction (view, copy, download, share)
 */
export function trackWorkflowAction(
  action: 'view' | 'copy' | 'download' | 'share',
  workflow: { id: string; name: string; category?: string }
): void {
  pushToDataLayer({
    event: 'workflow_interaction',
    workflow_action: action,
    workflow_id: workflow.id,
    workflow_name: workflow.name,
    workflow_category: workflow.category || 'Automations',
  });
}

/**
 * Track user search queries
 */
export function trackSearchQuery(query: string, resultsCount?: number): void {
  if (!query.trim()) return;
  pushToDataLayer({
    event: 'search',
    search_term: query.trim(),
    results_count: resultsCount ?? 0,
  });
}

/**
 * Track plan selection / upgrade button click
 */
export function trackSelectPlan(planId: string, price?: number, billingCycle?: string): void {
  pushToDataLayer({
    event: 'select_plan',
    plan_id: planId,
    value: price,
    currency: 'USD',
    billing_cycle: billingCycle || 'one-time',
  });
}

/**
 * Track interactive web tool usage (calculators, triggers, ideas)
 */
export function trackToolUse(
  toolName: string,
  category: string,
  details?: Record<string, any>
): void {
  pushToDataLayer({
    event: 'tool_interaction',
    tool_name: toolName,
    tool_category: category,
    ...(details || {}),
  });
}

/**
 * Track copying code or scripts (AppleScript, Zsh, Shortcuts XML/JSON)
 */
export function trackCopyCode(
  codeSnippetType: string,
  itemId: string
): void {
  pushToDataLayer({
    event: 'copy_code',
    code_type: codeSnippetType,
    item_id: itemId,
  });
}

/**
 * Track theme switching
 */
export function trackThemeChange(newTheme: string): void {
  pushToDataLayer({
    event: 'theme_change',
    theme: newTheme,
  });
}

/**
 * Track battery charge calculation tool usage
 */
export function trackBatteryCalculation(params: {
  currentPercentage: number;
  targetPercentage: number;
  wattage: number;
}): void {
  pushToDataLayer({
    event: 'calculate_charge_time',
    current_percentage: params.currentPercentage,
    target_percentage: params.targetPercentage,
    charger_wattage: params.wattage,
  });
}
