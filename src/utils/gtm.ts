/**
 * Google Tag Manager & dataLayer helper
 * Provides type-safe event tracking for Google Tag Manager containers and GA4.
 */

declare global {
  interface Window {
    dataLayer?: Record<string, any>[];
  }
}

/**
 * Push arbitrary event payload to window.dataLayer safely
 */
export function pushToDataLayer(eventPayload: Record<string, any>): void {
  if (typeof window === 'undefined') return;
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(eventPayload);
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
    timestamp: new Date().toISOString(),
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
}): void {
  pushToDataLayer({
    event: 'generate_shortcut',
    shortcut_name: params.shortcutName || 'Untitled Shortcut',
    trigger_type: params.triggerType || 'manual',
    actions_count: params.actionsCount || 1,
    category: params.category || 'General',
  });
}

/**
 * Track pre-built workflow interaction (view, copy, download)
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
