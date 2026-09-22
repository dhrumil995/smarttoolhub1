import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'crypto';
import {
  SubscriptionRepository,
  DodoPaymentsClient,
  DodoWebhookHandler,
  DodoWebhookEvent,
} from '../src/server/billing';

describe('Dodo Payments Merchant of Record Subscription Billing Engine', () => {
  const repository = SubscriptionRepository.getInstance();
  const client = DodoPaymentsClient.getInstance();
  const webhookHandler = new DodoWebhookHandler();

  describe('1. Webhook Signature Verification & Anti-Tampering', () => {
    const testSecret = 'whsec_test_secret_key_987654321';

    test('validates authentic webhook signature with HMAC-SHA256', () => {
      const payload = JSON.stringify({ type: 'subscription.active', id: 'evt_sig_test_1' });
      const signature = crypto.createHmac('sha256', testSecret).update(payload).digest('hex');

      const isValid = client.verifyWebhookSignature(payload, signature, testSecret);
      assert.equal(isValid, true);
    });

    test('validates v1= prefixed webhook signatures (standard webhook format)', () => {
      const payload = JSON.stringify({ type: 'subscription.renewed', id: 'evt_sig_test_2' });
      const hexSig = crypto.createHmac('sha256', testSecret).update(payload).digest('hex');
      const header = `t=1726000000,v1=${hexSig}`;

      const isValid = client.verifyWebhookSignature(payload, header, testSecret);
      assert.equal(isValid, true);
    });

    test('rejects tampered webhook payloads or invalid signatures', () => {
      const payload = JSON.stringify({ type: 'subscription.active', id: 'evt_sig_test_1' });
      const tamperedPayload = JSON.stringify({ type: 'subscription.active', id: 'evt_sig_test_1', hacker: true });
      const signature = crypto.createHmac('sha256', testSecret).update(payload).digest('hex');

      const isValid = client.verifyWebhookSignature(tamperedPayload, signature, testSecret);
      assert.equal(isValid, false);
    });
  });

  describe('2. Idempotency & Webhook Audit Ledger', () => {
    test('enforces strict idempotency on duplicate event arrivals', async () => {
      const testEventId = `evt_idemp_${Date.now()}`;
      const payload: DodoWebhookEvent = {
        id: testEventId,
        type: 'subscription.active',
        created_at: Date.now(),
        data: {
          subscription_id: `sub_idemp_${Date.now()}`,
          customer_id: 'cust_idemp_1',
          customer: { email: 'idemp@example.com', name: 'Idempotency Tester' },
          metadata: { user_id: 'usr_idemp_100', plan: 'yearly' },
        },
      };

      const raw = JSON.stringify(payload);

      // First run: processes event
      const res1 = await webhookHandler.handleWebhook(raw, undefined, payload, { skipSignatureVerification: true });
      assert.equal(res1.success, true);
      assert.equal(res1.idempotent, undefined);

      // Verify recorded in audit ledger
      const isRecorded = await repository.hasProcessedWebhook(testEventId);
      assert.equal(isRecorded, true);

      // Second run with same eventId: must return idempotent: true without duplicating work
      const res2 = await webhookHandler.handleWebhook(raw, undefined, payload, { skipSignatureVerification: true });
      assert.equal(res2.success, true);
      assert.equal(res2.idempotent, true);
    });
  });

  describe('3. Lifecycle: subscription.renewed as Definitive Source of Truth', () => {
    test('extends expiration date correctly upon subscription.renewed', async () => {
      const subId = `sub_renew_${Date.now()}`;
      const userId = `usr_renew_${Date.now()}`;
      const initialEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      // Seed initial subscription
      await repository.upsertSubscription({
        userId,
        subscriptionId: subId,
        customerEmail: 'renew@example.com',
        plan: 'yearly',
        status: 'active',
        currentPeriodEnd: initialEnd,
      });

      // Target future renewal date (1 year from now)
      const nextYearTimestamp = Date.now() + 365 * 24 * 60 * 60 * 1000;
      const nextYearIso = new Date(nextYearTimestamp).toISOString();

      const renewEvent: DodoWebhookEvent = {
        id: `evt_renew_${Date.now()}`,
        type: 'subscription.renewed',
        created_at: Date.now(),
        data: {
          subscription_id: subId,
          current_period_end: nextYearIso,
          metadata: { user_id: userId, plan: 'yearly' },
        },
      };

      const result = await webhookHandler.handleWebhook(
        JSON.stringify(renewEvent),
        undefined,
        renewEvent,
        { skipSignatureVerification: true }
      );

      assert.equal(result.success, true);
      assert.equal(result.event, 'subscription.renewed');

      // Verify DB record is extended to the exact date from payload
      const updated = await repository.findBySubscriptionId(subId);
      assert.ok(updated);
      assert.equal(updated.status, 'active');
      assert.equal(updated.currentPeriodEnd, nextYearIso);
      assert.equal(updated.needsPaymentMethodUpdate, false);
    });
  });

  describe('4. Lifecycle: subscription.on_hold & Dunning Interruption', () => {
    test('marks subscription as on_hold and sets payment method update flag', async () => {
      const subId = `sub_hold_${Date.now()}`;
      const userId = `usr_hold_${Date.now()}`;

      await repository.upsertSubscription({
        userId,
        subscriptionId: subId,
        customerEmail: 'hold@example.com',
        plan: 'yearly',
        status: 'active',
      });

      const onHoldEvent: DodoWebhookEvent = {
        id: `evt_hold_${Date.now()}`,
        type: 'subscription.on_hold',
        created_at: Date.now(),
        data: {
          subscription_id: subId,
          failure_reason: 'Card expired (insufficient funds on renewal attempt)',
          metadata: { user_id: userId },
        },
      };

      const result = await webhookHandler.handleWebhook(
        JSON.stringify(onHoldEvent),
        undefined,
        onHoldEvent,
        { skipSignatureVerification: true }
      );

      assert.equal(result.success, true);
      assert.equal(result.event, 'subscription.on_hold');

      const updated = await repository.findBySubscriptionId(subId);
      assert.ok(updated);
      assert.equal(updated.status, 'on_hold');
      assert.equal(updated.needsPaymentMethodUpdate, true);
      assert.match(updated.failureReason || '', /Card expired/);
    });
  });

  describe('5. Lifecycle: subscription.failed & Terminal Revocation', () => {
    test('revokes platform access completely upon subscription.failed', async () => {
      const subId = `sub_fail_${Date.now()}`;
      const userId = `usr_fail_${Date.now()}`;

      await repository.upsertSubscription({
        userId,
        subscriptionId: subId,
        customerEmail: 'failed@example.com',
        plan: 'yearly',
        status: 'on_hold',
      });

      const failedEvent: DodoWebhookEvent = {
        id: `evt_fail_${Date.now()}`,
        type: 'subscription.failed',
        created_at: Date.now(),
        data: {
          subscription_id: subId,
          failure_reason: 'Final dunning retry failed. Account cancelled.',
          metadata: { user_id: userId },
        },
      };

      const result = await webhookHandler.handleWebhook(
        JSON.stringify(failedEvent),
        undefined,
        failedEvent,
        { skipSignatureVerification: true }
      );

      assert.equal(result.success, true);
      assert.equal(result.event, 'subscription.failed');

      const updated = await repository.findBySubscriptionId(subId);
      assert.ok(updated);
      assert.equal(updated.status, 'failed');
      assert.equal(updated.needsPaymentMethodUpdate, true);
    });
  });
});
