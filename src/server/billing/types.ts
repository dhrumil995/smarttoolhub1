/**
 * Dodo Payments Subscription Billing System Types
 * Production-ready TypeScript definitions conforming to Dodo Payments Merchant of Record API specifications.
 */

export type SubscriptionStatus = 'active' | 'on_hold' | 'cancelled' | 'failed' | 'expired' | 'pending';
export type PlanType = 'yearly' | 'lifetime';

export interface DodoCustomerPayload {
  customer_id?: string;
  email: string;
  name: string;
  phone_number?: string;
}

export interface DodoProductCartItem {
  product_id: string;
  quantity: number;
}

export interface DodoCheckoutSessionRequest {
  product_cart: DodoProductCartItem[];
  customer: DodoCustomerPayload;
  payment_link: boolean;
  return_url: string;
  metadata: {
    user_id: string;
    tenant_id?: string;
    plan: PlanType;
    tier?: string;
    source?: string;
    [key: string]: string | number | boolean | undefined;
  };
  billing_address?: {
    street?: string;
    city?: string;
    state?: string;
    country: string;
    zipcode?: string;
  };
}

export interface DodoCheckoutSessionResponse {
  checkout_url: string;
  session_id: string;
  customer_id?: string;
  status?: string;
  raw?: Record<string, unknown>;
}

export interface DodoApiErrorResponse {
  error_code: string;
  error_message: string;
  status_code: number;
  details?: unknown;
}

export interface DodoWebhookEvent<T = Record<string, any>> {
  id?: string;
  event_id?: string;
  webhook_id?: string;
  type: 
    | 'subscription.active'
    | 'subscription.created'
    | 'subscription.renewed'
    | 'subscription.on_hold'
    | 'subscription.failed'
    | 'subscription.cancelled'
    | 'subscription.updated'
    | 'payment.succeeded'
    | 'payment.failed'
    | 'refund.succeeded';
  created_at: string | number;
  data: {
    subscription_id?: string;
    customer_id?: string;
    customer?: {
      customer_id?: string;
      email: string;
      name?: string;
    };
    status?: string;
    current_period_start?: string | number;
    current_period_end?: string | number;
    next_billing_date?: string | number;
    expires_at?: string | number;
    cancel_at_period_end?: boolean;
    failure_reason?: string;
    payment_id?: string;
    amount?: number;
    currency?: string;
    metadata?: {
      user_id?: string;
      tenant_id?: string;
      plan?: PlanType;
      [key: string]: any;
    };
    [key: string]: any;
  };
}

/**
 * Local Subscription Database Model
 * Represents the persistent subscription record stored locally.
 */
export interface SubscriptionRecord {
  id: string;
  userId: string;
  tenantId?: string;
  subscriptionId?: string;
  customerId?: string;
  customerEmail: string;
  customerName?: string;
  plan: PlanType;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  needsPaymentMethodUpdate: boolean;
  failureReason?: string;
  lastEventId?: string;
  lastRenewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Webhook Audit Log Record
 * Tracks processed webhooks for idempotent execution.
 */
export interface WebhookAuditRecord {
  eventId: string;
  eventType: string;
  receivedAt: string;
  status: 'processed' | 'skipped' | 'failed';
  errorMessage?: string;
}

/**
 * Customer Portal Session Result
 */
export interface CustomerPortalResult {
  url: string;
  expires_at?: string;
}
