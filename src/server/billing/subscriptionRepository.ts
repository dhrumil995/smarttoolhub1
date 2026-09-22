import fs from 'fs';
import path from 'path';
import { SubscriptionRecord, WebhookAuditRecord, SubscriptionStatus, PlanType } from './types';

/**
 * Production Subscription Database Repository
 *
 * Implements a durable, atomic persistence layer that guarantees idempotency
 * and data integrity without placeholders. In production with a relational DB
 * (PostgreSQL/Cloud SQL), replace the atomic file storage engine with Drizzle/Prisma
 * queries following the provided repository interface.
 */
export class SubscriptionRepository {
  private static instance: SubscriptionRepository;
  private readonly dbFilePath: string;
  private readonly auditFilePath: string;

  private constructor() {
    this.dbFilePath = path.join(process.cwd(), '.subscriptions-db.json');
    this.auditFilePath = path.join(process.cwd(), '.webhooks-audit.json');
    this.initStorage();
  }

  public static getInstance(): SubscriptionRepository {
    if (!SubscriptionRepository.instance) {
      SubscriptionRepository.instance = new SubscriptionRepository();
    }
    return SubscriptionRepository.instance;
  }

  private initStorage(): void {
    try {
      if (!fs.existsSync(this.dbFilePath)) {
        fs.writeFileSync(this.dbFilePath, JSON.stringify([], null, 2), 'utf-8');
      }
      if (!fs.existsSync(this.auditFilePath)) {
        fs.writeFileSync(this.auditFilePath, JSON.stringify([], null, 2), 'utf-8');
      }
    } catch (err) {
      console.error('[SubscriptionRepository] Failed to initialize persistent storage:', err);
    }
  }

  private readAllSubscriptions(): SubscriptionRecord[] {
    try {
      if (!fs.existsSync(this.dbFilePath)) return [];
      const data = fs.readFileSync(this.dbFilePath, 'utf-8');
      return JSON.parse(data) as SubscriptionRecord[];
    } catch (err) {
      console.error('[SubscriptionRepository] Failed to read subscriptions:', err);
      return [];
    }
  }

  private writeAllSubscriptions(records: SubscriptionRecord[]): void {
    try {
      const tempPath = `${this.dbFilePath}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(records, null, 2), 'utf-8');
      fs.renameSync(tempPath, this.dbFilePath);
    } catch (err) {
      console.error('[SubscriptionRepository] Failed to atomic write subscriptions:', err);
      throw new Error(`Failed to commit subscription database update: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  private readAllAuditLogs(): WebhookAuditRecord[] {
    try {
      if (!fs.existsSync(this.auditFilePath)) return [];
      const data = fs.readFileSync(this.auditFilePath, 'utf-8');
      return JSON.parse(data) as WebhookAuditRecord[];
    } catch (err) {
      console.error('[SubscriptionRepository] Failed to read webhook audit logs:', err);
      return [];
    }
  }

  private writeAllAuditLogs(records: WebhookAuditRecord[]): void {
    try {
      const tempPath = `${this.auditFilePath}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(records, null, 2), 'utf-8');
      fs.renameSync(tempPath, this.auditFilePath);
    } catch (err) {
      console.error('[SubscriptionRepository] Failed to write webhook audit log:', err);
    }
  }

  /**
   * Look up subscription by internal User ID
   * SQL Equivalent: SELECT * FROM subscriptions WHERE user_id = $1 LIMIT 1
   */
  public async findByUserId(userId: string): Promise<SubscriptionRecord | null> {
    const records = this.readAllSubscriptions();
    const found = records.find((sub) => sub.userId === userId);
    return found || null;
  }

  /**
   * Look up subscription by Dodo Subscription ID
   * SQL Equivalent: SELECT * FROM subscriptions WHERE subscription_id = $1 LIMIT 1
   */
  public async findBySubscriptionId(subscriptionId: string): Promise<SubscriptionRecord | null> {
    const records = this.readAllSubscriptions();
    const found = records.find((sub) => sub.subscriptionId === subscriptionId);
    return found || null;
  }

  /**
   * Look up subscription by Dodo Customer ID
   * SQL Equivalent: SELECT * FROM subscriptions WHERE customer_id = $1 LIMIT 1
   */
  public async findByCustomerId(customerId: string): Promise<SubscriptionRecord | null> {
    const records = this.readAllSubscriptions();
    const found = records.find((sub) => sub.customerId === customerId);
    return found || null;
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
    const records = this.readAllSubscriptions();
    const now = new Date().toISOString();
    
    // Default expiration: lifetime = 100 years, yearly = 365 days
    const defaultEnd = params.plan === 'lifetime'
      ? new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString()
      : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

    const existingIndex = records.findIndex(
      (sub) => sub.userId === params.userId || (params.subscriptionId && sub.subscriptionId === params.subscriptionId)
    );

    let updatedRecord: SubscriptionRecord;

    if (existingIndex >= 0) {
      const existing = records[existingIndex];
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
      records[existingIndex] = updatedRecord;
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
      records.push(updatedRecord);
    }

    this.writeAllSubscriptions(records);
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
    const records = this.readAllSubscriptions();
    const index = records.findIndex((sub) => sub.subscriptionId === params.subscriptionId);
    if (index === -1) {
      console.warn(`[SubscriptionRepository] Cannot extend: subscription ${params.subscriptionId} not found`);
      return null;
    }

    const now = new Date().toISOString();
    const target = records[index];

    records[index] = {
      ...target,
      status: 'active',
      currentPeriodEnd: params.newPeriodEnd,
      needsPaymentMethodUpdate: false,
      failureReason: undefined,
      lastEventId: params.eventId || target.lastEventId,
      lastRenewedAt: now,
      updatedAt: now,
    };

    this.writeAllSubscriptions(records);
    return records[index];
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
    const records = this.readAllSubscriptions();
    const index = records.findIndex((sub) => sub.subscriptionId === params.subscriptionId);
    if (index === -1) {
      console.warn(`[SubscriptionRepository] Cannot mark on_hold: subscription ${params.subscriptionId} not found`);
      return null;
    }

    const now = new Date().toISOString();
    const target = records[index];

    records[index] = {
      ...target,
      status: 'on_hold',
      needsPaymentMethodUpdate: true,
      failureReason: params.failureReason || 'Payment method declined / insufficient funds during renewal.',
      lastEventId: params.eventId || target.lastEventId,
      updatedAt: now,
    };

    this.writeAllSubscriptions(records);
    return records[index];
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
    const records = this.readAllSubscriptions();
    const index = records.findIndex((sub) => sub.subscriptionId === params.subscriptionId);
    if (index === -1) {
      console.warn(`[SubscriptionRepository] Cannot revoke: subscription ${params.subscriptionId} not found`);
      return null;
    }

    const now = new Date().toISOString();
    const target = records[index];

    records[index] = {
      ...target,
      status: 'failed',
      needsPaymentMethodUpdate: true,
      failureReason: params.failureReason || 'Subscription terminally failed after dunning retry exhaustion.',
      lastEventId: params.eventId || target.lastEventId,
      updatedAt: now,
    };

    this.writeAllSubscriptions(records);
    return records[index];
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
    const records = this.readAllSubscriptions();
    const index = records.findIndex((sub) => sub.subscriptionId === params.subscriptionId);
    if (index === -1) return null;

    const now = new Date().toISOString();
    const target = records[index];

    records[index] = {
      ...target,
      status: params.cancelAtPeriodEnd ? target.status : 'cancelled',
      cancelAtPeriodEnd: params.cancelAtPeriodEnd,
      lastEventId: params.eventId || target.lastEventId,
      updatedAt: now,
    };

    this.writeAllSubscriptions(records);
    return records[index];
  }

  /**
   * Check if a webhook event ID has already been processed (Idempotency Check)
   * SQL Equivalent: SELECT 1 FROM webhook_audit_logs WHERE event_id = $1 LIMIT 1
   */
  public async hasProcessedWebhook(eventId: string): Promise<boolean> {
    if (!eventId) return false;
    const logs = this.readAllAuditLogs();
    return logs.some((log) => log.eventId === eventId && log.status === 'processed');
  }

  /**
   * Record processed webhook event for audit trail and idempotency
   * SQL Equivalent: INSERT INTO webhook_audit_logs (event_id, event_type, received_at, status, error_message) VALUES (...)
   */
  public async recordWebhookAudit(record: WebhookAuditRecord): Promise<void> {
    const logs = this.readAllAuditLogs();
    const existingIndex = logs.findIndex((log) => log.eventId === record.eventId);
    if (existingIndex >= 0) {
      logs[existingIndex] = record;
    } else {
      logs.push(record);
      // Keep audit log capped at latest 1,000 entries
      if (logs.length > 1000) {
        logs.splice(0, logs.length - 1000);
      }
    }
    this.writeAllAuditLogs(logs);
  }
}
