import { SubscriptionRecord, WebhookAuditRecord, SubscriptionStatus, PlanType } from './types';

/**
 * Production Subscription Database Repository
 *
 * NOTE FOR PRODUCTION DEPLOYMENT:
 * In a multi-instance production environment, replace this in-memory repository
 * with a persistent managed datastore such as:
 * - PostgreSQL / Cloud SQL (using Drizzle ORM or Prisma)
 * - Google Cloud Firestore (using the Firebase Admin SDK)
 * - Redis / Key-Value Store (for distributed session cache & idempotency keys)
 *
 * In accordance with Phase 1 Security Guidelines, local JSON file storage
 * (.subscriptions-db.json, .webhooks-audit.json) has been completely removed
 * to prevent filesystem race conditions, unauthorized git exposure, and data leakage.
 */
export class SubscriptionRepository {
  private static instance: SubscriptionRepository;
  private readonly subscriptions: Map<string, SubscriptionRecord> = new Map();
  private readonly webhookAudits: Map<string, WebhookAuditRecord> = new Map();

  private constructor() {
    // Memory-backed storage initialized
  }

  public static getInstance(): SubscriptionRepository {
    if (!SubscriptionRepository.instance) {
      SubscriptionRepository.instance = new SubscriptionRepository();
    }
    return SubscriptionRepository.instance;
  }

  private readAllSubscriptions(): SubscriptionRecord[] {
    return Array.from(this.subscriptions.values());
  }

  private readAllAuditLogs(): WebhookAuditRecord[] {
    return Array.from(this.webhookAudits.values());
  }

  /**
   * Look up subscription by internal User ID
   * SQL Equivalent: SELECT * FROM subscriptions WHERE user_id = $1 LIMIT 1
   */
  public async findByUserId(userId: string): Promise<SubscriptionRecord | null> {
    for (const sub of this.subscriptions.values()) {
      if (sub.userId === userId) {
        return sub;
      }
    }
    return null;
  }

  /**
   * Look up subscription by Dodo Subscription ID
   * SQL Equivalent: SELECT * FROM subscriptions WHERE subscription_id = $1 LIMIT 1
   */
  public async findBySubscriptionId(subscriptionId: string): Promise<SubscriptionRecord | null> {
    for (const sub of this.subscriptions.values()) {
      if (sub.subscriptionId === subscriptionId) {
        return sub;
      }
    }
    return null;
  }

  /**
   * Look up subscription by Dodo Customer ID
   * SQL Equivalent: SELECT * FROM subscriptions WHERE customer_id = $1 LIMIT 1
   */
  public async findByCustomerId(customerId: string): Promise<SubscriptionRecord | null> {
    for (const sub of this.subscriptions.values()) {
      if (sub.customerId === customerId) {
        return sub;
      }
    }
    return null;
  }

  /**
   * Upsert Subscription record on checkout or activation
   * SQL Equivalent: INSERT INTO subscriptions (...) VALUES (...) ON CONFLICT (user_id) DO UPDATE SET ...
   */
  public async upsertSubscription(params: {
    userId: string;
    tenantId?: string;
    subscriptionId?: string;
    customerId?: string;
    customerEmail: string;
    customerName?: string;
    plan: PlanType;
    status: SubscriptionStatus;
    currentPeriodStart?: string;
    currentPeriodEnd?: string;
    cancelAtPeriodEnd?: boolean;
    needsPaymentMethodUpdate?: boolean;
    lastEventId?: string;
  }): Promise<SubscriptionRecord> {
    const now = new Date().toISOString();
    
    // Default expiration: lifetime = 100 years, yearly = 365 days
    const defaultEnd = params.plan === 'lifetime'
      ? new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString()
      : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

    let existing: SubscriptionRecord | undefined;
    for (const sub of this.subscriptions.values()) {
      if (sub.userId === params.userId || (params.subscriptionId && sub.subscriptionId === params.subscriptionId)) {
        existing = sub;
        break;
      }
    }

    let updatedRecord: SubscriptionRecord;

    if (existing) {
      updatedRecord = {
        ...existing,
        tenantId: params.tenantId || existing.tenantId,
        subscriptionId: params.subscriptionId || existing.subscriptionId,
        customerId: params.customerId || existing.customerId,
        customerEmail: params.customerEmail || existing.customerEmail,
        customerName: params.customerName || existing.customerName,
        plan: params.plan || existing.plan,
        status: params.status,
        currentPeriodStart: params.currentPeriodStart || existing.currentPeriodStart || now,
        currentPeriodEnd: params.currentPeriodEnd || existing.currentPeriodEnd || defaultEnd,
        cancelAtPeriodEnd: params.cancelAtPeriodEnd !== undefined ? params.cancelAtPeriodEnd : existing.cancelAtPeriodEnd,
        needsPaymentMethodUpdate: params.needsPaymentMethodUpdate !== undefined ? params.needsPaymentMethodUpdate : false,
        lastEventId: params.lastEventId || existing.lastEventId,
        updatedAt: now,
      };
    } else {
      updatedRecord = {
        id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        userId: params.userId,
        tenantId: params.tenantId,
        subscriptionId: params.subscriptionId,
        customerId: params.customerId,
        customerEmail: params.customerEmail,
        customerName: params.customerName,
        plan: params.plan,
        status: params.status,
        currentPeriodStart: params.currentPeriodStart || now,
        currentPeriodEnd: params.currentPeriodEnd || defaultEnd,
        cancelAtPeriodEnd: params.cancelAtPeriodEnd ?? false,
        needsPaymentMethodUpdate: params.needsPaymentMethodUpdate ?? false,
        lastEventId: params.lastEventId,
        createdAt: now,
        updatedAt: now,
      };
    }

    this.subscriptions.set(updatedRecord.id, updatedRecord);
    return updatedRecord;
  }

  /**
   * Extend Subscription Expiration Date on subscription.renewed event
   * SQL Equivalent: UPDATE subscriptions SET current_period_end = $1, status = 'active', needs_payment_method_update = false, updated_at = NOW() WHERE subscription_id = $2
   */
  public async extendSubscriptionPeriod(params: {
    subscriptionId: string;
    newPeriodEnd: string;
    eventId?: string;
  }): Promise<SubscriptionRecord | null> {
    const target = await this.findBySubscriptionId(params.subscriptionId);
    if (!target) {
      console.warn(`[SubscriptionRepository] Cannot extend: subscription ${params.subscriptionId} not found`);
      return null;
    }

    const now = new Date().toISOString();
    const updated: SubscriptionRecord = {
      ...target,
      status: 'active',
      currentPeriodEnd: params.newPeriodEnd,
      needsPaymentMethodUpdate: false,
      failureReason: undefined,
      lastEventId: params.eventId || target.lastEventId,
      lastRenewedAt: now,
      updatedAt: now,
    };

    this.subscriptions.set(updated.id, updated);
    return updated;
  }

  /**
   * Set Subscription status to 'on_hold' when payment fails during dunning
   * SQL Equivalent: UPDATE subscriptions SET status = 'on_hold', needs_payment_method_update = true, failure_reason = $1, updated_at = NOW() WHERE subscription_id = $2
   */
  public async markSubscriptionOnHold(params: {
    subscriptionId: string;
    failureReason?: string;
    eventId?: string;
  }): Promise<SubscriptionRecord | null> {
    const target = await this.findBySubscriptionId(params.subscriptionId);
    if (!target) {
      console.warn(`[SubscriptionRepository] Cannot mark on_hold: subscription ${params.subscriptionId} not found`);
      return null;
    }

    const now = new Date().toISOString();
    const updated: SubscriptionRecord = {
      ...target,
      status: 'on_hold',
      needsPaymentMethodUpdate: true,
      failureReason: params.failureReason || 'Payment method declined / insufficient funds during renewal.',
      lastEventId: params.eventId || target.lastEventId,
      updatedAt: now,
    };

    this.subscriptions.set(updated.id, updated);
    return updated;
  }

  /**
   * Revoke platform access entirely on terminal subscription.failed event
   * SQL Equivalent: UPDATE subscriptions SET status = 'failed', failure_reason = $1, updated_at = NOW() WHERE subscription_id = $2
   */
  public async revokeSubscriptionAccess(params: {
    subscriptionId: string;
    failureReason?: string;
    eventId?: string;
  }): Promise<SubscriptionRecord | null> {
    const target = await this.findBySubscriptionId(params.subscriptionId);
    if (!target) {
      console.warn(`[SubscriptionRepository] Cannot revoke: subscription ${params.subscriptionId} not found`);
      return null;
    }

    const now = new Date().toISOString();
    const updated: SubscriptionRecord = {
      ...target,
      status: 'failed',
      needsPaymentMethodUpdate: true,
      failureReason: params.failureReason || 'Subscription terminally failed after dunning retry exhaustion.',
      lastEventId: params.eventId || target.lastEventId,
      updatedAt: now,
    };

    this.subscriptions.set(updated.id, updated);
    return updated;
  }

  /**
   * Update cancellation state on subscription.cancelled event
   * SQL Equivalent: UPDATE subscriptions SET status = 'cancelled', cancel_at_period_end = $1, updated_at = NOW() WHERE subscription_id = $2
   */
  public async cancelSubscription(params: {
    subscriptionId: string;
    cancelAtPeriodEnd: boolean;
    eventId?: string;
  }): Promise<SubscriptionRecord | null> {
    const target = await this.findBySubscriptionId(params.subscriptionId);
    if (!target) return null;

    const now = new Date().toISOString();
    const updated: SubscriptionRecord = {
      ...target,
      status: params.cancelAtPeriodEnd ? target.status : 'cancelled',
      cancelAtPeriodEnd: params.cancelAtPeriodEnd,
      lastEventId: params.eventId || target.lastEventId,
      updatedAt: now,
    };

    this.subscriptions.set(updated.id, updated);
    return updated;
  }

  /**
   * Check if a webhook event ID has already been processed (Idempotency Check)
   * SQL Equivalent: SELECT 1 FROM webhook_audit_logs WHERE event_id = $1 LIMIT 1
   */
  public async hasProcessedWebhook(eventId: string): Promise<boolean> {
    if (!eventId) return false;
    const log = this.webhookAudits.get(eventId);
    return Boolean(log && log.status === 'processed');
  }

  /**
   * Record processed webhook event for audit trail and idempotency
   * SQL Equivalent: INSERT INTO webhook_audit_logs (event_id, event_type, received_at, status, error_message) VALUES (...)
   */
  public async recordWebhookAudit(record: WebhookAuditRecord): Promise<void> {
    this.webhookAudits.set(record.eventId, record);
    // Keep audit log capped at latest 1,000 entries
    if (this.webhookAudits.size > 1000) {
      const firstKey = this.webhookAudits.keys().next().value;
      if (firstKey) {
        this.webhookAudits.delete(firstKey);
      }
    }
  }

  /**
   * Clear all in-memory subscriptions (for testing or reset under admin secret)
   */
  public clearAll(): void {
    this.subscriptions.clear();
    this.webhookAudits.clear();
  }
}
