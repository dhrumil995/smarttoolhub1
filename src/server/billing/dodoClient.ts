import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import {
  DodoCheckoutSessionRequest,
  DodoCheckoutSessionResponse,
  DodoApiErrorResponse,
  CustomerPortalResult,
} from './types';

export interface DodoClientConfig {
  apiKey: string;
  mode: 'test' | 'live';
  productIdYearly: string;
  productIdLifetime: string;
  webhookSecret: string;
}

export class DodoPaymentsException extends Error {
  public readonly errorCode: string;
  public readonly statusCode: number;
  public readonly details: unknown;

  constructor(errorCode: string, errorMessage: string, statusCode = 400, details?: unknown) {
    super(errorMessage);
    this.name = 'DodoPaymentsException';
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Production Dodo Payments Merchant of Record Client
 *
 * Encapsulates the complete integration surface for Dodo Payments API:
 * - Checkout session creation with payment_link
 * - Customer routing (customer_id or email/name hook)
 * - Metadata propagation for seamless reconciliation
 * - HMAC-SHA256 Webhook signature validation
 * - Customer portal / Update Payment Method links
 */
export class DodoPaymentsClient {
  private static instance: DodoPaymentsClient;
  private readonly configFilePath: string;

  private constructor() {
    this.configFilePath = path.join(process.cwd(), '.dodo-config.json');
  }

  public static getInstance(): DodoPaymentsClient {
    if (!DodoPaymentsClient.instance) {
      DodoPaymentsClient.instance = new DodoPaymentsClient();
    }
    return DodoPaymentsClient.instance;
  }

  /**
   * Load active configuration combining environment variables and local config
   */
  public getConfig(): DodoClientConfig {
    let fileSettings: Partial<DodoClientConfig> = {};
    try {
      if (fs.existsSync(this.configFilePath)) {
        const raw = fs.readFileSync(this.configFilePath, 'utf-8');
        fileSettings = JSON.parse(raw);
      }
    } catch (err) {
      console.warn('[DodoPaymentsClient] Warning: Failed to read .dodo-config.json:', err);
    }

    const apiKey = (process.env.DODO_PAYMENTS_API_KEY || fileSettings.apiKey || '').trim();
    const mode = ((fileSettings.mode || process.env.DODO_PAYMENTS_MODE || 'live').toLowerCase() === 'test' ? 'test' : 'live') as 'test' | 'live';
    const productIdLifetime = (fileSettings.productIdLifetime || process.env.DODO_PAYMENTS_PRODUCT_ID_LIFETIME || '').trim();
    const productIdYearly = (fileSettings.productIdYearly || process.env.DODO_PAYMENTS_PRODUCT_ID_YEARLY || '').trim();
    const webhookSecret = (fileSettings.webhookSecret || process.env.DODO_PAYMENTS_WEBHOOK_SECRET || '').trim();

    return { apiKey, mode, productIdLifetime, productIdYearly, webhookSecret };
  }

  /**
   * Save configuration to .dodo-config.json
   */
  public saveConfig(updates: Partial<DodoClientConfig>): DodoClientConfig {
    const current = this.getConfig();
    const merged: DodoClientConfig = {
      apiKey: updates.apiKey !== undefined ? updates.apiKey.trim() : current.apiKey,
      mode: updates.mode === 'test' ? 'test' : 'live',
      productIdLifetime: updates.productIdLifetime !== undefined ? updates.productIdLifetime.trim() : current.productIdLifetime,
      productIdYearly: updates.productIdYearly !== undefined ? updates.productIdYearly.trim() : current.productIdYearly,
      webhookSecret: updates.webhookSecret !== undefined ? updates.webhookSecret.trim() : current.webhookSecret,
    };

    try {
      fs.writeFileSync(this.configFilePath, JSON.stringify(merged, null, 2), 'utf-8');
    } catch (err) {
      console.error('[DodoPaymentsClient] Failed to persist config:', err);
    }

    return merged;
  }

  public getBaseUrl(): string {
    const { mode } = this.getConfig();
    return mode === 'live' ? 'https://live.dodopayments.com' : 'https://test.dodopayments.com';
  }

  /**
   * Parse error from Dodo Payments response
   */
  private async parseApiError(response: Response): Promise<DodoPaymentsException> {
    let body: any = null;
    let rawText = '';
    try {
      rawText = await response.text();
      body = JSON.parse(rawText);
    } catch {
      // not JSON
    }

    const errorCode = body?.code || body?.error_code || `HTTP_${response.status}`;
    let errorMessage = body?.message || body?.error || body?.detail || rawText || 'Dodo Payments request failed.';

    if (errorCode === 'MERCHANT_NOT_LIVE' || errorMessage.includes('Live payments not enabled')) {
      errorMessage =
        'Live payments not enabled for merchant. Please complete your merchant verification on app.dodopayments.com.';
    }

    return new DodoPaymentsException(errorCode, errorMessage, response.status, body || rawText);
  }

  /**
   * 1. ARCHITECTURE & CUSTOMER ROUTING:
   * Creates a Checkout Session via POST /checkouts passing subscription product in product_cart,
   * setting payment_link: true, attaching user_id / tenant_id into metadata, and handling customer_id or email/name.
   */
  public async createCheckoutSession(
    payload: DodoCheckoutSessionRequest
  ): Promise<DodoCheckoutSessionResponse> {
    const { apiKey } = this.getConfig();
    if (!apiKey) {
      throw new DodoPaymentsException(
        'DODO_API_KEY_MISSING',
        'Dodo Payments API Key is not configured. Please supply DODO_PAYMENTS_API_KEY in environment or settings.',
        500
      );
    }

    // Input Validation
    if (!payload.product_cart || !payload.product_cart.length) {
      throw new DodoPaymentsException('INVALID_CART', 'product_cart array must contain at least one item.', 400);
    }
    if (!payload.customer?.email) {
      throw new DodoPaymentsException('INVALID_CUSTOMER', 'customer.email is required for checkout creation.', 400);
    }
    if (!payload.metadata?.user_id) {
      throw new DodoPaymentsException('INVALID_METADATA', 'metadata.user_id is strictly required for reconciliation.', 400);
    }

    const baseUrl = this.getBaseUrl();

    // Construct clean payload strictly adhering to Dodo Payments specs
    const bodyPayload: Record<string, any> = {
      product_cart: payload.product_cart,
      customer: {
        ...(payload.customer.customer_id ? { customer_id: payload.customer.customer_id } : {}),
        email: payload.customer.email.trim().toLowerCase(),
        name: (payload.customer.name || 'SmartToolHub Pro Customer').trim(),
        ...(payload.customer.phone_number ? { phone_number: payload.customer.phone_number } : {}),
      },
      payment_link: true, // Generate hosted checkout URL
      return_url: payload.return_url,
      metadata: {
        ...payload.metadata,
        system: 'smarttoolhub-billing',
        created_at: new Date().toISOString(),
      },
    };

    if (payload.billing_address) {
      bodyPayload.billing_address = payload.billing_address;
    }

    const headers = {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    // Primary endpoint: POST /checkouts
    let response = await fetch(`${baseUrl}/checkouts`, {
      method: 'POST',
      headers,
      body: JSON.stringify(bodyPayload),
    });

    // Fallback to /checkout-sessions if 404
    if (response.status === 404) {
      response = await fetch(`${baseUrl}/checkout-sessions`, {
        method: 'POST',
        headers,
        body: JSON.stringify(bodyPayload),
      });
    }

    if (!response.ok) {
      throw await this.parseApiError(response);
    }

    const responseData: any = await response.json();
    const checkoutUrl =
      responseData?.checkout_url ||
      responseData?.payment_link ||
      responseData?.url ||
      responseData?.checkout_link;

    const sessionId = responseData?.session_id || responseData?.id || '';
    const customerId = responseData?.customer_id || responseData?.customer?.customer_id || '';

    if (!checkoutUrl) {
      throw new DodoPaymentsException(
        'MALFORMED_RESPONSE',
        'Dodo Payments API response did not contain a valid checkout_url.',
        502,
        responseData
      );
    }

    return {
      checkout_url: checkoutUrl,
      session_id: sessionId,
      customer_id: customerId,
      status: responseData?.status,
      raw: responseData,
    };
  }

  /**
   * Fetch live subscription details from Dodo Payments
   */
  public async getSubscription(subscriptionId: string): Promise<Record<string, any>> {
    const { apiKey } = this.getConfig();
    if (!apiKey) {
      throw new DodoPaymentsException('DODO_API_KEY_MISSING', 'API key missing', 500);
    }

    const baseUrl = this.getBaseUrl();
    const response = await fetch(`${baseUrl}/subscriptions/${subscriptionId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw await this.parseApiError(response);
    }

    return await response.json();
  }

  /**
   * Generate customer portal or update payment method link
   * Handles subscription.on_hold remediation flow.
   */
  public async getCustomerPortalUrl(params: {
    customerId?: string;
    subscriptionId?: string;
    returnUrl?: string;
  }): Promise<CustomerPortalResult> {
    const { apiKey, mode } = this.getConfig();
    const baseUrl = this.getBaseUrl();

    // 1. If subscriptionId provided, attempt dedicated update payment method endpoint
    if (params.subscriptionId && apiKey) {
      try {
        const updateRes = await fetch(`${baseUrl}/subscriptions/${params.subscriptionId}/update-payment-method`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            return_url: params.returnUrl || 'https://app.smarttoolhub.com/pricing',
          }),
        });

        if (updateRes.ok) {
          const data: any = await updateRes.json();
          if (data?.url || data?.portal_url) {
            return { url: data.url || data.portal_url };
          }
        }
      } catch (err) {
        console.warn('[DodoPaymentsClient] Sub-specific update payment method call failed, falling back to customer portal:', err);
      }
    }

    // 2. Attempt customer portal endpoint
    if (params.customerId && apiKey) {
      try {
        const portalRes = await fetch(`${baseUrl}/customer-portal`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customer_id: params.customerId,
            return_url: params.returnUrl || 'https://app.smarttoolhub.com/pricing',
          }),
        });

        if (portalRes.ok) {
          const data: any = await portalRes.json();
          if (data?.url || data?.portal_url) {
            return { url: data.url || data.portal_url };
          }
        }
      } catch (err) {
        console.warn('[DodoPaymentsClient] Customer portal API call failed:', err);
      }
    }

    // 3. Fallback to hosted customer portal URL
    const defaultPortalUrl =
      mode === 'live'
        ? `https://live.dodopayments.com/portal/${params.customerId || ''}`
        : `https://test.dodopayments.com/portal/${params.customerId || ''}`;

    return { url: defaultPortalUrl };
  }

  /**
   * Cryptographic HMAC-SHA256 Webhook Signature Verification
   * Uses timingSafeEqual to prevent timing side-channel attacks.
   */
  public verifyWebhookSignature(
    rawBody: string | Buffer,
    signatureHeader: string | undefined,
    secretOverride?: string
  ): boolean {
    const { webhookSecret } = this.getConfig();
    const secret = secretOverride || webhookSecret;

    // If no secret configured, signature verification is not enabled
    if (!secret) {
      console.warn('[DodoPaymentsClient] No webhook secret configured. Webhook accepted in unverified mode.');
      return true;
    }

    if (!signatureHeader) {
      return false;
    }

    try {
      const payloadString = typeof rawBody === 'string' ? rawBody : rawBody.toString('utf-8');

      // Support direct hex or timestamp-prefixed headers (t=timestamp,v1=signature)
      let receivedSignature = signatureHeader.trim();
      if (signatureHeader.includes('v1=')) {
        const match = signatureHeader.match(/v1=([a-fA-F0-9]+)/);
        if (match) receivedSignature = match[1];
      }

      const computedSignature = crypto
        .createHmac('sha256', secret)
        .update(payloadString)
        .digest('hex');

      const expectedBuf = Buffer.from(computedSignature, 'utf-8');
      const receivedBuf = Buffer.from(receivedSignature, 'utf-8');

      if (expectedBuf.length !== receivedBuf.length) {
        return false;
      }

      return crypto.timingSafeEqual(expectedBuf, receivedBuf);
    } catch (err) {
      console.error('[DodoPaymentsClient] Webhook signature verification error:', err);
      return false;
    }
  }
}
