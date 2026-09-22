import { SubscriptionRepository } from './subscriptionRepository';
import { DodoPaymentsClient } from './dodoClient';
import { DodoWebhookEvent, SubscriptionRecord } from './types';

export interface WebhookProcessingResult {
  success: boolean;
  event: string;
  idempotent?: boolean;
  message: string;
  subscription?: SubscriptionRecord | null;
}

/**
 * Production Dodo Payments Webhook Life-Cycle Manager
 *
 * Enforces:
 * 1. Strict Idempotency via persistent audit ledger
 * 2. subscription.renewed as the definitive source of truth for expiration dates
 * 3. subscription.on_hold handling with dunning state and payment method update flags
 * 4. subscription.failed terminal failure handling with access revocation
 */
export class DodoWebhookHandler {
  private readonly repository: SubscriptionRepository;
  private readonly client: DodoPaymentsClient;

  constructor() {
    this.repository = SubscriptionRepository.getInstance();
    this.client = DodoPaymentsClient.getInstance();
  }

  /**
   * Main entry point for processing incoming Dodo Payments webhooks
   */
  public async handleWebhook(
    rawPayload: string | Buffer,
    signatureHeader?: string,
    parsedEvent?: DodoWebhookEvent,
    options?: { skipSignatureVerification?: boolean; secretOverride?: string }
  ): Promise<WebhookProcessingResult> {
    // 1. Signature Verification
    if (!options?.skipSignatureVerification) {
      const isSignatureValid = this.client.verifyWebhookSignature(
        rawPayload,
        signatureHeader,
        options?.secretOverride
      );
      if (!isSignatureValid) {
        throw new Error('WEBHOOK_SIGNATURE_MISMATCH: Invalid or missing webhook signature');
      }
    }

    // 2. Parse Event Payload
    const event: DodoWebhookEvent =
      parsedEvent || (typeof rawPayload === 'string' ? JSON.parse(rawPayload) : JSON.parse(rawPayload.toString('utf-8')));

    const eventId = event.id || event.event_id || event.webhook_id || `evt_${Date.now()}`;
    const eventType = event.type;

    console.log(`[DodoWebhookHandler] Processing event: ${eventType} (ID: ${eventId})`);

    // 3. Idempotency Check
    const alreadyProcessed = await this.repository.hasProcessedWebhook(eventId);
    if (alreadyProcessed) {
      console.log(`[DodoWebhookHandler] Skipping duplicate event ${eventId} (already processed)`);
      return {
        success: true,
        event: eventType,
        idempotent: true,
        message: 'Event was previously processed.',
      };
    }

    try {
      let resultSubscription: SubscriptionRecord | null = null;

      switch (eventType) {
        // --------------------------------------------------------------------
        // SUBSCRIPTION RENEWED: Definitive source of truth for extending recurring access
        // --------------------------------------------------------------------
        case 'subscription.renewed': {
          resultSubscription = await this.handleSubscriptionRenewed(event, eventId);
          break;
        }

        // --------------------------------------------------------------------
        // SUBSCRIPTION ON HOLD: Payment declined / Insufficient funds / Dunning
        // --------------------------------------------------------------------
        case 'subscription.on_hold': {
          resultSubscription = await this.handleSubscriptionOnHold(event, eventId);
          break;
        }

        // --------------------------------------------------------------------
        // SUBSCRIPTION FAILED: Terminal dunning failure -> Revoke access entirely
        // --------------------------------------------------------------------
        case 'subscription.failed': {
          resultSubscription = await this.handleSubscriptionFailed(event, eventId);
          break;
        }

        // --------------------------------------------------------------------
        // SUBSCRIPTION ACTIVE / CREATED: Initial provisioning
        // --------------------------------------------------------------------
        case 'subscription.active':
        case 'subscription.created': {
          resultSubscription = await this.handleSubscriptionActive(event, eventId);
          break;
        }

        // --------------------------------------------------------------------
        // SUBSCRIPTION CANCELLED: User canceled renewal
        // --------------------------------------------------------------------
        case 'subscription.cancelled': {
          resultSubscription = await this.handleSubscriptionCancelled(event, eventId);
          break;
        }

        // --------------------------------------------------------------------
        // PAYMENT SUCCEEDED: One-time purchases or audit confirmation
        // --------------------------------------------------------------------
        case 'payment.succeeded': {
          resultSubscription = await this.handlePaymentSucceeded(event, eventId);
          break;
        }

        default: {
          console.log(`[DodoWebhookHandler] Unhandled event type ignored: ${eventType}`);
          break;
        }
      }

      // Record successful processing in audit ledger for idempotency
      await this.repository.recordWebhookAudit({
        eventId,
        eventType,
        receivedAt: new Date().toISOString(),
        status: 'processed',
      });

      return {
        success: true,
        event: eventType,
        message: `Successfully processed event: ${eventType}`,
        subscription: resultSubscription,
      };
    } catch (err: any) {
      console.error(`[DodoWebhookHandler] Error processing event ${eventId}:`, err);

      await this.repository.recordWebhookAudit({
        eventId,
        eventType,
        receivedAt: new Date().toISOString(),
        status: 'failed',
        errorMessage: err?.message || String(err),
      });

      throw err;
    }
  }

  /**
   * CORE PRINCIPLE: subscription.renewed
   * Use subscription.renewed event payload as the definitive source of truth to compute and extend expiration.
   */
  private async handleSubscriptionRenewed(
    event: DodoWebhookEvent,
    eventId: string
  ): Promise<SubscriptionRecord | null> {
    const data = event.data;
    const subscriptionId = data.subscription_id;

    if (!subscriptionId) {
      console.warn('[DodoWebhookHandler] subscription.renewed missing subscription_id');
      return null;
    }

    // Compute new expiration date from payload
    let newPeriodEndIso: string;
    const periodEndRaw = data.current_period_end || data.next_billing_date || data.expires_at;

    if (periodEndRaw) {
      // If unix seconds or ms
      const timestamp = typeof periodEndRaw === 'number'
        ? periodEndRaw > 1e11 ? periodEndRaw : periodEndRaw * 1000
        : new Date(periodEndRaw).getTime();

      newPeriodEndIso = new Date(timestamp).toISOString();
    } else {
      // Fallback: 1 year extension from now for annual plans
      newPeriodEndIso = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
    }

    console.log(`[DodoWebhookHandler] Extending subscription ${subscriptionId} to ${newPeriodEndIso}`);

    const updated = await this.repository.extendSubscriptionPeriod({
      subscriptionId,
      newPeriodEnd: newPeriodEndIso,
      eventId,
    });

    if (!updated) {
      // If subscription didn't exist locally yet, create it from metadata
      const userId = data.metadata?.user_id || `user_cust_${data.customer_id || 'unknown'}`;
      const customerEmail = data.customer?.email || 'subscriber@smarttoolhub.com';

      return await this.repository.upsertSubscription({
        userId,
        tenantId: data.metadata?.tenant_id,
        subscriptionId,
        customerId: data.customer_id,
        customerEmail,
        customerName: data.customer?.name,
        plan: data.metadata?.plan || 'yearly',
        status: 'active',
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: newPeriodEndIso,
        needsPaymentMethodUpdate: false,
        lastEventId: eventId,
      });
    }

    return updated;
  }

  /**
   * CORE PRINCIPLE: subscription.on_hold
   * Card declined / Insufficient funds -> Mark local status to 'on_hold', prompt user for payment method update.
   */
  private async handleSubscriptionOnHold(
    event: DodoWebhookEvent,
    eventId: string
  ): Promise<SubscriptionRecord | null> {
    const data = event.data;
    const subscriptionId = data.subscription_id;

    if (!subscriptionId) {
      console.warn('[DodoWebhookHandler] subscription.on_hold missing subscription_id');
      return null;
    }

    const failureReason =
      data.failure_reason ||
      'Card declined or insufficient funds triggered dunning cycle. Payment method update required.';

    console.warn(`[DodoWebhookHandler] Subscription ${subscriptionId} ON HOLD. Reason: ${failureReason}`);

    return await this.repository.markSubscriptionOnHold({
      subscriptionId,
      failureReason,
      eventId,
    });
  }

  /**
   * CORE PRINCIPLE: subscription.failed
   * Terminal dunning failure -> Revoke platform access entirely.
   */
  private async handleSubscriptionFailed(
    event: DodoWebhookEvent,
    eventId: string
  ): Promise<SubscriptionRecord | null> {
    const data = event.data;
    const subscriptionId = data.subscription_id;

    if (!subscriptionId) {
      console.warn('[DodoWebhookHandler] subscription.failed missing subscription_id');
      return null;
    }

    const failureReason =
      data.failure_reason || 'Terminal renewal failure: All dunning retries exhausted. Subscription canceled.';

    console.error(`[DodoWebhookHandler] Subscription ${subscriptionId} TERMINALLY FAILED. Revoking access.`);

    return await this.repository.revokeSubscriptionAccess({
      subscriptionId,
      failureReason,
      eventId,
    });
  }

  /**
   * Initial Subscription Activation
   */
  private async handleSubscriptionActive(
    event: DodoWebhookEvent,
    eventId: string
  ): Promise<SubscriptionRecord | null> {
    const data = event.data;
    const subscriptionId = data.subscription_id;
    const userId = data.metadata?.user_id || `user_${data.customer_id || Date.now()}`;
    const customerEmail = data.customer?.email || 'subscriber@smarttoolhub.com';

    let periodEndIso: string;
    const rawEnd = data.current_period_end || data.next_billing_date || data.expires_at;
    if (rawEnd) {
      const ts = typeof rawEnd === 'number' ? (rawEnd > 1e11 ? rawEnd : rawEnd * 1000) : new Date(rawEnd).getTime();
      periodEndIso = new Date(ts).toISOString();
    } else {
      periodEndIso = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
    }

    return await this.repository.upsertSubscription({
      userId,
      tenantId: data.metadata?.tenant_id,
      subscriptionId,
      customerId: data.customer_id,
      customerEmail,
      customerName: data.customer?.name,
      plan: data.metadata?.plan || 'yearly',
      status: 'active',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: periodEndIso,
      needsPaymentMethodUpdate: false,
      lastEventId: eventId,
    });
  }

  /**
   * Subscription Cancellation
   */
  private async handleSubscriptionCancelled(
    event: DodoWebhookEvent,
    eventId: string
  ): Promise<SubscriptionRecord | null> {
    const data = event.data;
    const subscriptionId = data.subscription_id;
    if (!subscriptionId) return null;

    const cancelAtPeriodEnd = data.cancel_at_period_end !== undefined ? Boolean(data.cancel_at_period_end) : true;

    return await this.repository.cancelSubscription({
      subscriptionId,
      cancelAtPeriodEnd,
      eventId,
    });
  }

  /**
   * One-time Payment Succeeded (e.g. Lifetime Access)
   */
  private async handlePaymentSucceeded(
    event: DodoWebhookEvent,
    eventId: string
  ): Promise<SubscriptionRecord | null> {
    const data = event.data;
    const plan = data.metadata?.plan;

    // If lifetime plan one-time checkout
    if (plan === 'lifetime') {
      const userId = data.metadata?.user_id || `user_${data.customer_id || Date.now()}`;
      const customerEmail = data.customer?.email || 'subscriber@smarttoolhub.com';

      // 100-year expiration for lifetime access
      const lifetimeEnd = new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString();

      return await this.repository.upsertSubscription({
        userId,
        tenantId: data.metadata?.tenant_id,
        subscriptionId: `lifetime_${data.payment_id || Date.now()}`,
        customerId: data.customer_id,
        customerEmail,
        customerName: data.customer?.name,
        plan: 'lifetime',
        status: 'active',
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: lifetimeEnd,
        needsPaymentMethodUpdate: false,
        lastEventId: eventId,
      });
    }

    return null;
  }
}
