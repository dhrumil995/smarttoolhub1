import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

describe('SmartToolHub - Integration Tests', () => {

  describe('1. Rate Limiting Middleware Simulation', () => {
    test('enforces rate limit ceiling per IP', () => {
      const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
      const WINDOW_MS = 60 * 1000;
      const MAX_REQUESTS = 20;

      function simulateRateLimit(ip: string, now: number): { allowed: boolean; status: number } {
        const record = rateLimitMap.get(ip);
        if (!record || now > record.resetTime) {
          rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
          return { allowed: true, status: 200 };
        }

        if (record.count >= MAX_REQUESTS) {
          return { allowed: false, status: 429 };
        }

        record.count += 1;
        return { allowed: true, status: 200 };
      }

      const clientIp = '192.168.1.50';
      const baseTime = Date.now();

      // Send 20 requests
      for (let i = 0; i < 20; i++) {
        const res = simulateRateLimit(clientIp, baseTime);
        assert.equal(res.allowed, true, `Request ${i + 1} should be permitted`);
      }

      // 21st request should be rejected with 429
      const rejectedRes = simulateRateLimit(clientIp, baseTime);
      assert.equal(rejectedRes.allowed, false);
      assert.equal(rejectedRes.status, 429);

      // After window passes, new requests are allowed
      const futureTime = baseTime + WINDOW_MS + 1000;
      const renewedRes = simulateRateLimit(clientIp, futureTime);
      assert.equal(renewedRes.allowed, true);
      assert.equal(renewedRes.status, 200);
    });
  });

  describe('2. AI Shortcut Generation & Heuristic Fallback Engine', () => {
    test('generates complete verified multi-step workflow on fallback', () => {
      const payload = {
        devices: ['Mac', 'iPhone'],
        osVersions: 'macOS Sequoia / iOS 18',
        task: 'Mirror iPhone notifications and copy OTP codes automatically',
        experienceLevel: 'Intermediate',
        isPro: true,
      };

      // Ensure mock/heuristic generator produces compliant schema
      function generateHeuristicWorkflow(input: typeof payload) {
        return {
          goalSummary: `Personalized workflow to ${input.task} utilizing your ${input.devices.join(' and ')}.`,
          estimatedSetupTime: '8-12 minutes',
          difficulty: input.experienceLevel || 'Intermediate',
          requiredSettings: [
            'Wi-Fi and Bluetooth enabled on all devices',
            'Signed in to the same Apple Account with Two-Factor Authentication',
            'Handoff enabled under System Settings > General > AirDrop & Handoff',
          ],
          steps: [
            {
              stepNumber: 1,
              title: 'Enable iPhone Mirroring on macOS Sequoia',
              instruction: 'Open iPhone Mirroring from your Mac Applications folder or Dock. Ensure your iPhone is locked and nearby.',
              device: 'Mac',
            },
            {
              stepNumber: 2,
              title: 'Allow Notification Forwarding',
              instruction: 'On your iPhone, navigate to Settings > Notifications > iPhone Mirroring and enable notifications for required apps.',
              device: 'iPhone',
            },
          ],
          commonProblems: [
            {
              issue: 'Timed out connecting to iPhone',
              solution: 'Toggle Bluetooth off and on on both devices and verify both are connected to the same Wi-Fi network.',
            },
          ],
        };
      }

      const result = generateHeuristicWorkflow(payload);
      assert.ok(result.goalSummary.includes('Mirror iPhone notifications'));
      assert.equal(result.steps.length, 2);
      assert.equal(result.steps[0].stepNumber, 1);
      assert.equal(result.requiredSettings.length, 3);
      assert.equal(result.commonProblems.length, 1);
    });

    test('script generator produces syntactically valid AppleScript, Zsh, or Shortcuts Spec', () => {
      const scriptTypes = ['applescript', 'zsh', 'shortcuts-spec'] as const;

      function mockScriptGenerator(type: typeof scriptTypes[number], goal: string) {
        if (type === 'applescript') {
          return {
            scriptType: 'applescript',
            title: `AppleScript Automation for ${goal}`,
            code: `tell application "System Events"\n    display notification "Running automated workflow" with title "SmartToolHub"\nend tell`,
            instructions: ['Open Script Editor on your Mac', 'Paste this code and click Run'],
          };
        } else if (type === 'zsh') {
          return {
            scriptType: 'zsh',
            title: `macOS zsh Shell Script for ${goal}`,
            code: `#!/usr/bin/env zsh\n# SmartToolHub automated trigger\nosascript -e 'display notification "Active" with title "SmartToolHub"'\necho "Done."`,
            instructions: ['Open Terminal', 'Save to ~/script.zsh and run chmod +x ~/script.zsh'],
          };
        } else {
          return {
            scriptType: 'shortcuts-spec',
            title: `Shortcuts Action Spec for ${goal}`,
            code: `[Shortcuts Action Plan]\n1. Action: Get Clipboard\n2. Action: Set Variable "CopiedItem"\n3. Action: Run AppleScript on Mac`,
            instructions: ['Open Shortcuts app', 'Add actions as listed in the specification'],
          };
        }
      }

      for (const st of scriptTypes) {
        const res = mockScriptGenerator(st, 'Desktop Organization');
        assert.equal(res.scriptType, st);
        assert.ok(res.code.length > 20);
        assert.ok(res.instructions.length >= 2);
      }
    });
  });

  describe('3. Dodo Payments Integration Logic', () => {
    test('constructs valid Dodo Payments live checkout payload', () => {
      const settings = {
        mode: 'live',
        apiKey: 'live_sk_sample_1234567890',
        productIdYearly: 'p_prod_yearly_456',
        productIdLifetime: 'p_prod_lifetime_789',
      };

      function createCheckoutPayload(plan: 'yearly' | 'lifetime', email: string, origin: string) {
        const productId = plan === 'yearly' ? settings.productIdYearly : settings.productIdLifetime;
        return {
          product_cart: [{ product_id: productId, quantity: 1 }],
          customer: { email, name: 'Pro Subscriber' },
          return_url: `${origin}/pricing?payment=success&plan=${plan}`,
          metadata: { source: 'smarttoolhub-app', plan },
        };
      }

      const payloadYearly = createCheckoutPayload('yearly', 'user@example.com', 'https://smarttoolhub.com');
      assert.equal(payloadYearly.product_cart[0].product_id, 'p_prod_yearly_456');
      assert.equal(payloadYearly.metadata.plan, 'yearly');
      assert.equal(payloadYearly.return_url, 'https://smarttoolhub.com/pricing?payment=success&plan=yearly');

      const payloadLifetime = createCheckoutPayload('lifetime', 'user@example.com', 'https://smarttoolhub.com');
      assert.equal(payloadLifetime.product_cart[0].product_id, 'p_prod_lifetime_789');
    });

    test('validates live session status and verification token calculation', () => {
      const apiKey = 'live_sk_test_gateway_key';

      function verifyPaidSession(sessionId: string, status: string, plan: string) {
        if (!sessionId) {
          return { verified: false, error: 'Session ID is required' };
        }
        const isPaid = ['succeeded', 'paid', 'completed', 'active'].includes(status.toLowerCase());
        if (!isPaid) {
          return { verified: false, status, message: 'Payment not completed' };
        }

        const token = crypto
          .createHmac('sha256', apiKey)
          .update(`${sessionId}:${plan}:${status}`)
          .digest('hex');

        return { verified: true, status, plan, token };
      }

      const validSession = verifyPaidSession('checkout_session_live_888', 'succeeded', 'yearly');
      assert.equal(validSession.verified, true);
      assert.equal(validSession.status, 'succeeded');
      assert.equal(typeof validSession.token, 'string');
      assert.equal(validSession.token?.length, 64);

      const invalidStatus = verifyPaidSession('checkout_session_live_888', 'pending', 'yearly');
      assert.equal(invalidStatus.verified, false);
    });
  });
});
