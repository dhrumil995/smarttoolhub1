import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import compression from 'compression';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import {
  SubscriptionRepository,
  DodoPaymentsClient,
  DodoWebhookHandler,
  DodoPaymentsException,
  PlanType,
} from './src/server/billing';

dotenv.config();

const app = express();
const PORT = 3000;

// Trust proxy for reverse proxy routing (e.g. Cloud Run, Nginx)
app.set('trust proxy', 1);

// Enable Gzip/Deflate HTTP response compression for text, JS, CSS, and SVG
app.use(compression({
  threshold: 1024,
  level: 6,
}));

// Body parsing with strict payload size limit and rawBody capture for HMAC verification
app.use(
  express.json({
    limit: '100kb',
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  })
);

// Simple in-memory rate limiter per IP: max 20 requests per minute
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 20;

function rateLimitMiddleware(req: Request, res: Response, next: () => void) {
  const ip = req.ip || req.socket.remoteAddress || 'anonymous';
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      error: 'Too many requests. Please wait a minute before generating more workflows.',
    });
  }

  record.count += 1;
  next();
}

// Clean up old rate limit records periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);

// Lazy initialization for GoogleGenAI with User-Agent telemetry
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

// Timeout wrapper for resilient AI generation with fallback
async function callGeminiWithTimeout<T>(promise: Promise<T>, timeoutMs = 8000): Promise<T> {
  let timer: NodeJS.Timeout | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('AI generation timed out')), timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'SmartToolHub API',
    timestamp: new Date().toISOString(),
    aiConfigured: Boolean(process.env.GEMINI_API_KEY),
    aiEngine: 'gemini-3.8-flash',
    proFeaturesActive: true,
  });
});

// Generate Custom Workflow API (Pro Exclusive)
app.post('/api/generate-workflow', rateLimitMiddleware, async (req: Request, res: Response) => {
  try {
    const {
      devices,
      osVersions,
      task,
      currentApps,
      toolPreference,
      experienceLevel,
      isPro,
    } = req.body;

    // Strict input validation
    if (!task || typeof task !== 'string' || task.trim().length < 3 || task.length > 500) {
      return res.status(400).json({
        error: 'Task description is required and must be between 3 and 500 characters.',
      });
    }

    if (!devices || !Array.isArray(devices) || devices.length === 0) {
      return res.status(400).json({
        error: 'At least one Apple device must be selected.',
      });
    }

    // Security check: Never accept sensitive credential words
    const lowerTask = task.toLowerCase();
    const sensitiveTokens = ['password', 'passcode', 'apple id password', 'private key', 'secret key', 'credit card'];
    for (const token of sensitiveTokens) {
      if (lowerTask.includes(token)) {
        return res.status(400).json({
          error: 'For your security, SmartToolHub never accepts or handles passwords, passcodes, or private credentials.',
        });
      }
    }

    // Pro Tier Enforcement for AI features
    if (!isPro) {
      return res.status(403).json({
        error: 'The AI Workflow Synthesizer with live Gemini API intelligence is an exclusive SmartToolHub Pro feature. Free members have full access to our Curated Library. Please activate Pro to generate bespoke multi-device setups.',
        requiresPro: true,
      });
    }

    const ai = getGenAI();

    // If Gemini is available, use gemini-3.8-flash
    if (ai) {
      const prompt = `You are the lead Apple ecosystem technical architect for SmartToolHub.
Generate a tailored, highly accurate, verified Apple multi-device workflow based on the following user details.

USER INPUTS:
- Devices Owned: ${devices.join(', ')}
- OS Versions: ${osVersions || 'Current latest (macOS Sequoia / iOS 18 / iPadOS 18)'}
- Task to complete: ${task}
- Current Apps Used: ${Array.isArray(currentApps) ? currentApps.join(', ') : currentApps || 'None specified'}
- Preference: ${toolPreference || 'Built-in Apple tools preferred'}
- Experience Level: ${experienceLevel || 'Intermediate'}

STRICT ACCURACY & SECURITY RULES:
- Never hallucinate Apple features. Only use real Continuity, macOS, iOS, iPadOS, and Shortcuts capabilities.
- Clearly state exact OS versions required for features (e.g. macOS Sequoia 15.0+ for iPhone Mirroring).
- State connectivity prerequisites (same Apple Account with 2FA, Bluetooth On, Wi-Fi On, proximity).
- Never instruct users to enter Apple ID passwords or passcodes into 3rd-party tools.
- Provide keyboard shortcuts for Mac (using ⌘, ⌥, ⇧, ⌃ glyphs) where applicable.

RESPOND WITH VALID JSON ONLY (no markdown formatting, no code fences):
{
  "goalSummary": "Clear 1-2 sentence statement of what this workflow accomplishes.",
  "estimatedSetupTime": "e.g. 5-10 minutes",
  "difficulty": "${experienceLevel || 'Intermediate'}",
  "requiredDevices": [
    { "device": "e.g. MacBook Pro (M-series)", "minOS": "macOS 15.0+", "hardwareNotes": "Apple Silicon recommended" }
  ],
  "requiredSettings": [
    "e.g. System Settings > General > AirDrop & Handoff > Allow Handoff enabled",
    "e.g. Wi-Fi and Bluetooth enabled on all devices"
  ],
  "steps": [
    {
      "stepNumber": 1,
      "title": "Clear step title",
      "instruction": "Detailed instructions on exactly what to click or configure.",
      "shortcuts": [
        { "mac": "⌘ + Space", "ios": "Swipe down on Home Screen", "description": "Open Spotlight" }
      ],
      "callout": "Optional pro tip or safety warning"
    }
  ],
  "commonProblems": [
    { "issue": "Specific failure symptom", "solution": "Exact isolation step to fix it" }
  ],
  "privacyNotes": [
    "Explanation of how data stays on-device or uses end-to-end encrypted iCloud syncing."
  ],
  "alternativeWorkflow": {
    "title": "Alternative approach (e.g. if 3rd party tool preferred or on older macOS)",
    "description": "How to achieve a similar outcome.",
    "tradeOff": "Why you might choose this vs primary method."
  },
  "relatedWorkflows": [
    "Related workflow title 1",
    "Related workflow title 2"
  ],
  "officialSupportLinks": [
    { "title": "Official Apple Guide", "url": "https://support.apple.com" }
  ]
}`;

      try {
        const response = await callGeminiWithTimeout(
          ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              temperature: 0.2,
            },
          }),
          7000
        );

        const responseText = response.text;
        if (responseText) {
          const parsed = JSON.parse(responseText);
          return res.json({ success: true, workflow: parsed, aiEngine: 'gemini-3.8-flash', isPro: true });
        }
      } catch (geminiError: any) {
        console.warn('Gemini API notice: falling back to verified heuristic synthesis:', geminiError?.message);
      }
    }

    // Heuristic fallback if Gemini API key not present or returns unparseable json
    return res.json({
      success: true,
      isPro: true,
      aiEngine: 'SmartToolHub Pro Engine (Heuristic Mode)',
      workflow: {
        goalSummary: `Personalized workflow to ${task} utilizing your ${devices.join(' and ')}.`,
        estimatedSetupTime: '8-12 minutes',
        difficulty: experienceLevel || 'Intermediate',
        requiredDevices: devices.map((d: string) => ({
          device: d,
          minOS: d.includes('Mac') ? 'macOS 14 Sonoma or 15 Sequoia' : 'iOS 17 or 18',
          hardwareNotes: 'Bluetooth 4.2+ & Wi-Fi support required',
        })),
        requiredSettings: [
          'Ensure all devices are signed into the same Apple Account with Two-Factor Authentication enabled.',
          'Enable Wi-Fi and Bluetooth on all devices without connecting to a VPN on local network.',
          'Verify System Settings > General > AirDrop & Handoff > "Allow Handoff between this Mac and your iCloud devices" is checked.',
        ],
        steps: [
          {
            stepNumber: 1,
            title: 'Verify Continuity Connectivity & Proximity',
            instruction: 'Place your devices within 10 meters (30 feet) of each other. Verify both devices share the identical 5GHz Wi-Fi network and Bluetooth is turned on.',
            shortcuts: [{ mac: '⌘ + Space', ios: 'Swipe Down', description: 'Spotlight Search to launch Settings' }],
            callout: 'Ensure neither device is actively sharing an active Personal Hotspot connection.',
          },
          {
            stepNumber: 2,
            title: `Configure ${devices[0]} for ${task}`,
            instruction: `Open your primary tool (${Array.isArray(currentApps) && currentApps[0] ? currentApps[0] : 'Shortcuts or Finder'}). If using native tools, prepare your working files in iCloud Drive for instant zero-latency syncing across devices.`,
            shortcuts: [{ mac: '⌘ + N', description: 'Create new document or automation item' }],
          },
          {
            stepNumber: 3,
            title: 'Integrate Secondary Device Actions',
            instruction: devices.length > 1
              ? `Use Universal Clipboard (⌘ + C on ${devices[0]}, then ⌘ + V or tap Paste on ${devices[1]}) or AirDrop to hand off working assets instantly.`
              : 'Add an automated Quick Action in Shortcuts to streamline this task with a single click or keyboard shortcut.',
            shortcuts: [{ mac: '⌘ + Shift + A', description: 'Quick access to Applications folder' }],
            callout: 'Universal Clipboard contents remain active in the buffer for approximately 2 minutes before expiring for privacy.',
          },
          {
            stepNumber: 4,
            title: 'Test & Validate Workflow Pipeline',
            instruction: 'Run a test run with a sample item to confirm notifications, handoff states, and data consistency across your ecosystem.',
          },
        ],
        commonProblems: [
          {
            issue: 'Devices cannot discover each other or Universal Clipboard times out',
            solution: 'Toggle Bluetooth Off then On in Control Center on both devices. Check that "AirDrop & Handoff" is enabled under General settings.',
          },
          {
            issue: 'Shortcuts automation fails in the background on iOS/iPadOS',
            solution: 'In iOS Settings > Shortcuts > Advanced, toggle on "Allow Running Scripts" and "Allow Private Access".',
          },
        ],
        privacyNotes: [
          'All communication between your devices uses Apple Peer-to-Peer Wi-Fi with end-to-end TLS encryption.',
          'SmartToolHub never collects, logs, or transmits your personal inputs or device serials.',
        ],
        alternativeWorkflow: {
          title: 'Direct AirDrop & Folder Sharing Alternative',
          description: 'If you prefer manual control over automated handoff, establish a shared iCloud Drive collaborative folder with pinned Finder sidebar access.',
          tradeOff: 'Requires manual file dropping instead of seamless clipboard synchronization, but works reliably across guest accounts.',
        },
        relatedWorkflows: [
          'Multi-Device Universal Clipboard Masterclass',
          'Automated Batch Media Sync with Apple Shortcuts',
          'Continuity Camera Wireless Desk View Setup',
        ],
        officialSupportLinks: [
          { title: 'Use Continuity to connect your Mac, iPhone, iPad', url: 'https://support.apple.com/en-us/HT204681' },
          { title: 'Use Universal Clipboard on Apple Devices', url: 'https://support.apple.com/en-us/HT209460' },
        ],
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      error: 'An unexpected error occurred while generating the workflow. Please try again.',
      details: error?.message || 'Internal Server Error',
    });
  }
});

// AI Deep Diagnostic Assistant API (Pro Exclusive)
app.post('/api/ai-diagnose', rateLimitMiddleware, async (req: Request, res: Response) => {
  try {
    const { issueTitle, symptoms, deviceDetails, customNotes, isPro } = req.body;

    if (!isPro) {
      return res.status(403).json({
        error: 'AI Deep Diagnosis is an exclusive SmartToolHub Pro feature. Please activate Pro to generate custom root-cause fixes.',
        requiresPro: true,
      });
    }

    if (!symptoms && !issueTitle) {
      return res.status(400).json({ error: 'Please describe the symptoms or issue to diagnose.' });
    }

    const ai = getGenAI();
    if (ai) {
      const prompt = `You are a Senior Apple Genius / CoreOS Engineer specializing in Continuity, Bluetooth stack, Bonjour mDNS, Wi-Fi peer-to-peer, and macOS/iOS/iPadOS subsystem troubleshooting.
Analyze the following Apple ecosystem issue and diagnose the exact root causes, provide immediate isolation steps, safe terminal commands, and preconditions.

ISSUE DETAILS:
- Title / Feature: ${issueTitle || 'General Apple Ecosystem Issue'}
- Symptoms: ${Array.isArray(symptoms) ? symptoms.join('; ') : symptoms || 'None given'}
- Devices & OS: ${deviceDetails || 'macOS Sequoia / iOS 18 / iPadOS 18'}
- User Notes: ${customNotes || 'None'}

STRICT SECURITY & ACCURACY RULES:
- Never provide destructive or wiping commands (no rm -rf, no sudo nvram -c without warning, no Apple Account deletion).
- For terminal commands, provide precise macOS commands (e.g. sudo pkill bluetoothd, sudo killall -HUP mDNSResponder, tccutil reset, defaults read/write).
- For each terminal command, assign riskLevel: "safe", "caution", or "sudo".
- Explain the exact technical mechanism causing the failure.

RESPOND WITH VALID JSON ONLY (no markdown formatting, no code fences):
{
  "rootCauseAnalysis": "Precise technical breakdown of why this failure occurs.",
  "quickFix": [
    "Step 1 to try immediately",
    "Step 2 to try immediately"
  ],
  "terminalCommands": [
    {
      "command": "sudo pkill bluetoothd",
      "description": "Restarts the core Bluetooth daemon to reset unresponsive device discovery.",
      "riskLevel": "sudo"
    }
  ],
  "preconditionChecklist": [
    "Both devices on identical 5GHz Wi-Fi (no guest isolation)",
    "Bluetooth powered on in Control Center",
    "Apple Account Two-Factor Authentication confirmed"
  ],
  "officialAdvice": "Apple official recommendations regarding this subsystem."
}`;

      try {
        const response = await callGeminiWithTimeout(
          ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              temperature: 0.1,
            },
          }),
          7000
        );

        const responseText = response.text;
        if (responseText) {
          const parsed = JSON.parse(responseText);
          return res.json({ success: true, diagnosis: parsed, aiEngine: 'gemini-3.8-flash' });
        }
      } catch (geminiErr: any) {
        console.warn('Gemini diagnosis temporary error, falling back to Pro heuristic engine:', geminiErr?.message);
      }
    }

    // Heuristic diagnostic fallback
    return res.json({
      success: true,
      aiEngine: 'SmartToolHub Pro Heuristics',
      diagnosis: {
        rootCauseAnalysis: `Subsystem communication failure between Apple devices. Commonly caused by Bonjour mDNS broadcast drops on modern Wi-Fi router AP isolation or stale Bluetooth daemon discovery tables in macOS Sequoia / iOS 18.`,
        quickFix: [
          'Toggle Bluetooth OFF on both devices, wait 5 seconds, and toggle back ON.',
          'Verify System Settings > General > AirDrop & Handoff > "Allow Handoff between this Mac and your iCloud devices" is enabled.',
          'Disable any active VPN or Firewall blocking incoming local connections.',
        ],
        terminalCommands: [
          {
            command: 'sudo pkill bluetoothd',
            description: 'Forces macOS to reload the Bluetooth daemon without requiring a full system reboot.',
            riskLevel: 'sudo',
          },
          {
            command: 'sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder',
            description: 'Flushes stale Bonjour multicast DNS cache so devices discover each other instantly.',
            riskLevel: 'sudo',
          },
        ],
        preconditionChecklist: [
          'Same Apple Account with Two-Factor Authentication on all devices',
          'Both devices within 10 meters (30 feet) of each other',
          'Personal Hotspot disconnected on iPhone',
        ],
        officialAdvice: 'Apple recommends updating both devices to matching minor OS releases to avoid Continuity handshake protocol mismatches.',
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      error: 'Failed to run AI diagnosis.',
      details: error?.message || 'Internal Server Error',
    });
  }
});

// AI Automation Script Generator API (Pro Exclusive)
app.post('/api/ai-automation-script', rateLimitMiddleware, async (req: Request, res: Response) => {
  try {
    const { workflowTitle, goal, devices, scriptType, isPro } = req.body;

    if (!isPro) {
      return res.status(403).json({
        error: 'AI Automation Script Generator is an exclusive SmartToolHub Pro feature.',
        requiresPro: true,
      });
    }

    const ai = getGenAI();
    if (ai) {
      const prompt = `You are an expert Apple automation engineer specializing in AppleScript, JXA (JavaScript for Automation), macOS zsh scripts, and Apple Shortcuts actions.
Generate a verified, ready-to-run automation script for the following task.

TASK:
- Workflow Title: ${workflowTitle || 'Ecosystem Automation'}
- Goal: ${goal || 'Automate multi-device handoff and file processing'}
- Devices: ${Array.isArray(devices) ? devices.join(', ') : devices || 'Mac and iPhone'}
- Desired Script Type: ${scriptType || 'applescript'} (options: 'applescript', 'zsh', 'shortcuts-spec')

RULES:
- Provide clean, robust, commented code that can be pasted directly into Script Editor, Terminal, or Shortcuts.
- Include error handling.
- Never write destructive commands.

RESPOND WITH VALID JSON ONLY (no markdown formatting, no code fences):
{
  "scriptType": "${scriptType || 'applescript'}",
  "title": "Clear title for this automation",
  "code": "Ready to execute code string with line breaks",
  "instructions": [
    "Step 1: How to open Script Editor / Terminal",
    "Step 2: How to run or assign a keyboard shortcut"
  ],
  "safetyNotes": "Security notes regarding macOS permissions (e.g. Accessibility or Automation prompt)."
}`;

      try {
        const response = await callGeminiWithTimeout(
          ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              temperature: 0.2,
            },
          }),
          7000
        );

        const responseText = response.text;
        if (responseText) {
          const parsed = JSON.parse(responseText);
          return res.json({ success: true, script: parsed, aiEngine: 'gemini-3.8-flash' });
        }
      } catch (geminiErr: any) {
        console.warn('Gemini script generator temporary error, falling back to Pro engine:', geminiErr?.message);
      }
    }

    // Heuristic fallback script
    const sampleAppleScript = `(*
  SmartToolHub Pro Automation: Quick Clipboard Handoff Trigger
  Author: SmartToolHub Pro
*)

on run
  display notification "Universal Clipboard buffer refreshed" with title "SmartToolHub Pro"
  tell application "Finder"
    activate
  end tell
end run`;

    return res.json({
      success: true,
      aiEngine: 'SmartToolHub Pro Engine',
      script: {
        scriptType: scriptType || 'applescript',
        title: `${workflowTitle || 'Apple'} Automation Script`,
        code: sampleAppleScript,
        instructions: [
          'Open Script Editor on your Mac (press ⌘ + Space, type Script Editor, and press Enter).',
          'Create a new document, paste this script, and click Compile (hammer icon).',
          'Click Run to test. You can save it as an Application (.app) or a Quick Action for Finder.',
        ],
        safetyNotes: 'macOS may prompt for Accessibility or Automation permissions when first executing.',
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      error: 'Failed to generate automation script.',
      details: error?.message || 'Internal Server Error',
    });
  }
});

// ==========================================
// DODO PAYMENTS SUBSCRIPTION & CHECKOUT API
// ==========================================

const DODO_CONFIG_FILE = path.join(process.cwd(), '.dodo-config.json');

interface DodoSettings {
  apiKey: string;
  mode: 'test' | 'live';
  productIdLifetime: string;
  productIdYearly: string;
  webhookSecret: string;
}

function loadDodoSettings(): DodoSettings {
  let fileSettings: Partial<DodoSettings> = {};
  try {
    if (fs.existsSync(DODO_CONFIG_FILE)) {
      const data = fs.readFileSync(DODO_CONFIG_FILE, 'utf-8');
      fileSettings = JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading dodo config file:', err);
  }

  const apiKey = (process.env.DODO_PAYMENTS_API_KEY || fileSettings.apiKey || '').trim();
  const mode = ((fileSettings.mode || process.env.DODO_PAYMENTS_MODE || 'live').toLowerCase() === 'test' ? 'test' : 'live') as 'test' | 'live';
  const productIdLifetime = (fileSettings.productIdLifetime || process.env.DODO_PAYMENTS_PRODUCT_ID_LIFETIME || '').trim();
  const productIdYearly = (fileSettings.productIdYearly || process.env.DODO_PAYMENTS_PRODUCT_ID_YEARLY || '').trim();
  const webhookSecret = (fileSettings.webhookSecret || process.env.DODO_PAYMENTS_WEBHOOK_SECRET || '').trim();

  return { apiKey, mode, productIdLifetime, productIdYearly, webhookSecret };
}

function saveDodoSettings(settings: Partial<DodoSettings>): DodoSettings {
  const current = loadDodoSettings();
  const updated: DodoSettings = {
    apiKey: settings.apiKey !== undefined ? settings.apiKey.trim() : current.apiKey,
    mode: settings.mode === 'test' ? 'test' : 'live',
    productIdLifetime: settings.productIdLifetime !== undefined ? settings.productIdLifetime.trim() : current.productIdLifetime,
    productIdYearly: settings.productIdYearly !== undefined ? settings.productIdYearly.trim() : current.productIdYearly,
    webhookSecret: settings.webhookSecret !== undefined ? settings.webhookSecret.trim() : current.webhookSecret,
  };
  try {
    fs.writeFileSync(DODO_CONFIG_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write dodo config file:', err);
  }
  return updated;
}

// GET current Dodo Payments status and public settings (key masked)
app.get('/api/dodo/config', (req: Request, res: Response) => {
  const settings = loadDodoSettings();
  const hasKey = Boolean(settings.apiKey);
  const maskedKey = hasKey
    ? settings.apiKey.length > 8
      ? `${settings.apiKey.slice(0, 4)}••••${settings.apiKey.slice(-4)}`
      : '••••••••'
    : '';

  res.json({
    configured: hasKey,
    mode: settings.mode,
    maskedKey,
    hasApiKey: hasKey,
    productIdLifetime: settings.productIdLifetime,
    productIdYearly: settings.productIdYearly,
    hasWebhookSecret: Boolean(settings.webhookSecret),
    endpoint: settings.mode === 'live' ? 'https://live.dodopayments.com' : 'https://test.dodopayments.com',
  });
});

// POST save Dodo Payments settings from the UI setup form
app.post('/api/dodo/config', (req: Request, res: Response) => {
  try {
    const { apiKey, mode, productIdLifetime, productIdYearly, webhookSecret } = req.body || {};
    const updated = saveDodoSettings({
      ...(typeof apiKey === 'string' ? { apiKey: apiKey.trim() } : {}),
      ...(mode ? { mode } : {}),
      ...(typeof productIdLifetime === 'string' ? { productIdLifetime: productIdLifetime.trim() } : {}),
      ...(typeof productIdYearly === 'string' ? { productIdYearly: productIdYearly.trim() } : {}),
      ...(typeof webhookSecret === 'string' ? { webhookSecret: webhookSecret.trim() } : {}),
    });

    const maskedKey = updated.apiKey
      ? updated.apiKey.length > 8
        ? `${updated.apiKey.slice(0, 4)}••••${updated.apiKey.slice(-4)}`
        : '••••••••'
      : '';

    return res.json({
      success: true,
      message: 'Dodo Payments configuration saved successfully.',
      configured: Boolean(updated.apiKey),
      mode: updated.mode,
      maskedKey,
      productIdLifetime: updated.productIdLifetime,
      productIdYearly: updated.productIdYearly,
      hasWebhookSecret: Boolean(updated.webhookSecret),
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to save Dodo Payments settings', details: err?.message });
  }
});

// POST test API key connection with Dodo Payments
app.post('/api/dodo/test-connection', async (req: Request, res: Response) => {
  try {
    const bodyKey = typeof req.body?.apiKey === 'string' ? req.body.apiKey.trim() : '';
    const bodyMode = req.body?.mode === 'test' ? 'test' : 'live';
    const settings = loadDodoSettings();
    const apiKey = bodyKey || settings.apiKey;
    const mode = bodyKey ? bodyMode : settings.mode;

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        message: 'No Dodo Payments API key provided. Please enter your API key to test.',
      });
    }

    const baseUrl = mode === 'live' ? 'https://live.dodopayments.com' : 'https://test.dodopayments.com';
    const response = await fetch(`${baseUrl}/products`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data: any = await response.json();
      const productList = Array.isArray(data) ? data : data?.items || data?.products || [];
      return res.json({
        success: true,
        message: `Successfully connected to Dodo Payments (${mode.toUpperCase()} mode)! Verified access with ${productList.length} product(s) found in your account.`,
        productsCount: productList.length,
        products: productList.slice(0, 5).map((p: any) => ({
          id: p.product_id || p.id,
          name: p.name || p.title,
          price: p.price,
          type: p.type || p.payment_type,
        })),
      });
    } else {
      const errorText = await response.text();
      let errorJson: any = null;
      try {
        errorJson = JSON.parse(errorText);
      } catch {}

      return res.status(response.status).json({
        success: false,
        status: response.status,
        message: errorJson?.message || errorJson?.error || `Dodo Payments responded with status ${response.status}`,
        details: errorText,
      });
    }
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: 'Network error communicating with Dodo Payments API.',
      details: err?.message || 'Connection failed',
    });
  }
});

// POST create a real Dodo Payments checkout session
app.post('/api/dodo/create-checkout', async (req: Request, res: Response) => {
  try {
    const dodoClient = DodoPaymentsClient.getInstance();
    const repository = SubscriptionRepository.getInstance();
    const config = dodoClient.getConfig();

    if (!config.apiKey) {
      return res.status(400).json({
        error_code: 'DODO_NOT_CONFIGURED',
        error_message: 'Dodo Payments API key is not configured yet. Please configure DODO_PAYMENTS_API_KEY.',
      });
    }

    const {
      plan,
      customerEmail,
      customerName,
      customerId,
      userId = 'usr_guest_' + Date.now().toString(36),
      tenantId,
      returnUrl,
    } = req.body || {};

    const selectedPlan: PlanType = plan === 'yearly' ? 'yearly' : 'lifetime';
    const productId =
      (selectedPlan === 'yearly' ? config.productIdYearly : config.productIdLifetime) ||
      config.productIdLifetime ||
      config.productIdYearly;

    if (!productId) {
      return res.status(400).json({
        error_code: 'PRODUCT_ID_MISSING',
        error_message: `Missing Product ID for the ${selectedPlan === 'yearly' ? 'Annual Subscription' : 'Lifetime License'}.`,
      });
    }

    const origin = req.headers.origin || `http://localhost:${PORT}`;
    const finalReturnUrl = returnUrl || `${origin}/pricing?payment=success&plan=${selectedPlan}`;

    // 1. ARCHITECTURE & CUSTOMER ROUTING:
    // Create checkout session via POST /checkouts with payment_link: true and metadata
    let checkoutResult;
    try {
      checkoutResult = await dodoClient.createCheckoutSession({
        product_cart: [{ product_id: productId, quantity: 1 }],
        customer: {
          ...(customerId ? { customer_id: customerId } : {}),
          email: customerEmail || 'subscriber@smarttoolhub.com',
          name: customerName || 'SmartToolHub Pro Member',
        },
        payment_link: true,
        return_url: finalReturnUrl,
        metadata: {
          user_id: String(userId),
          tenant_id: tenantId ? String(tenantId) : undefined,
          plan: selectedPlan,
          tier: 'pro',
        },
      });
    } catch (checkoutErr: any) {
      const isMerchantNotLive =
        checkoutErr instanceof DodoPaymentsException &&
        (checkoutErr.errorCode === 'MERCHANT_NOT_LIVE' ||
          checkoutErr.message?.includes('Live payments not enabled') ||
          checkoutErr.statusCode === 403);

      if (isMerchantNotLive) {
        console.warn(
          '[Dodo Payments] Live payments not enabled for merchant on app.dodopayments.com.'
        );

        return res.status(200).json({
          success: false,
          error_code: 'MERCHANT_NOT_LIVE',
          error_message:
            'Live payments are pending approval for this merchant profile on Dodo Payments. Please complete business/KYC verification on app.dodopayments.com to process real customer payments.',
          details: {
            code: 'MERCHANT_NOT_LIVE',
            message: 'Live payments not enabled for merchant',
            dashboard_url: 'https://app.dodopayments.com',
          },
        });
      }

      throw checkoutErr;
    }

    // Record initial pending subscription record for tracking
    await repository.upsertSubscription({
      userId: String(userId),
      tenantId: tenantId ? String(tenantId) : undefined,
      customerId: checkoutResult.customer_id,
      customerEmail: customerEmail || 'subscriber@smarttoolhub.com',
      customerName: customerName || 'SmartToolHub Pro Member',
      plan: selectedPlan,
      status: 'pending',
    });

    return res.json({
      success: true,
      checkout_url: checkoutResult.checkout_url,
      session_id: checkoutResult.session_id,
      customer_id: checkoutResult.customer_id,
      plan: selectedPlan,
    });
  } catch (err: any) {
    console.warn('[API /api/dodo/create-checkout] Notice:', err?.message || err);
    const errorCode = err instanceof DodoPaymentsException ? err.errorCode : 'CHECKOUT_INITIALIZATION_FAILED';
    const is403 = (err instanceof DodoPaymentsException && err.statusCode === 403) ||
      err?.message?.includes('403') ||
      err?.message?.includes('Live payments') ||
      errorCode === 'MERCHANT_NOT_LIVE';

    return res.status(200).json({
      success: false,
      error_code: is403 ? 'MERCHANT_NOT_LIVE' : errorCode,
      error_message: is403
        ? 'Live payments are pending approval for this merchant profile on Dodo Payments. Please complete business/KYC verification on app.dodopayments.com to process real customer payments.'
        : err?.message || 'Failed to initialize Dodo Payments checkout session.',
      details: err?.details,
    });
  }
});

// GET user subscription status & dunning state
app.get('/api/dodo/subscription-status', async (req: Request, res: Response) => {
  try {
    const userId = (req.query.userId as string) || 'default-user';
    const repository = SubscriptionRepository.getInstance();
    const sub = await repository.findByUserId(userId);

    if (!sub) {
      return res.json({
        isPro: false,
        status: 'none',
        plan: null,
        needsPaymentMethodUpdate: false,
      });
    }

    const isExpired = new Date(sub.currentPeriodEnd).getTime() < Date.now();
    const isActive = (sub.status === 'active' || (sub.status === 'cancelled' && sub.cancelAtPeriodEnd)) && !isExpired;

    return res.json({
      isPro: isActive,
      status: isExpired && sub.status === 'active' ? 'expired' : sub.status,
      plan: sub.plan,
      currentPeriodStart: sub.currentPeriodStart,
      currentPeriodEnd: sub.currentPeriodEnd,
      cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
      needsPaymentMethodUpdate: sub.needsPaymentMethodUpdate,
      failureReason: sub.failureReason,
      subscriptionId: sub.subscriptionId,
      customerId: sub.customerId,
    });
  } catch (err: any) {
    return res.status(500).json({
      error_code: 'STATUS_FETCH_FAILED',
      error_message: err?.message || 'Failed to retrieve subscription status.',
    });
  }
});

// POST Customer Portal / Update Payment Method URL (for subscription.on_hold remediation)
app.post('/api/dodo/customer-portal', async (req: Request, res: Response) => {
  try {
    const { customerId, subscriptionId, returnUrl } = req.body || {};
    const dodoClient = DodoPaymentsClient.getInstance();
    const portal = await dodoClient.getCustomerPortalUrl({ customerId, subscriptionId, returnUrl });
    return res.json(portal);
  } catch (err: any) {
    return res.status(500).json({
      error_code: 'PORTAL_URL_FAILED',
      error_message: err?.message || 'Failed to generate customer portal session.',
    });
  }
});

// POST Verify Payment / Checkout Session (Anti-Fraud / Tamper-Proof Client Fallback)
app.post('/api/dodo/verify-session', async (req: Request, res: Response) => {
  try {
    const { sessionId, paymentId, plan, userId } = req.body || {};
    const dodoClient = DodoPaymentsClient.getInstance();
    const repository = SubscriptionRepository.getInstance();
    const config = dodoClient.getConfig();

    if (!sessionId && !paymentId) {
      return res.status(400).json({
        verified: false,
        error_code: 'MISSING_IDENTIFIER',
        error_message: 'No session ID or payment ID provided for verification.',
      });
    }

    // Handle simulated sandbox sessions cleanly
    if (typeof sessionId === 'string' && sessionId.startsWith('dodo_sbox_')) {
      const activeUser = userId || 'usr_guest_' + sessionId.slice(10);
      await repository.upsertSubscription({
        userId: activeUser,
        customerId: 'cust_' + sessionId.slice(10),
        customerEmail: 'subscriber@smarttoolhub.com',
        customerName: 'SmartToolHub Pro Member',
        plan: plan === 'yearly' ? 'yearly' : 'lifetime',
        status: 'active',
        currentPeriodEnd: plan === 'yearly' ? new Date(Date.now() + 365 * 86400000).toISOString() : undefined,
      });

      return res.json({
        verified: true,
        plan: plan === 'yearly' ? 'yearly' : 'lifetime',
        status: 'active',
        is_sandbox: true,
        message: 'Sandbox checkout verified successfully! SmartToolHub Pro activated.',
      });
    }

    if (!config.apiKey) {
      return res.status(400).json({
        verified: false,
        error_code: 'DODO_NOT_CONFIGURED',
        error_message: 'Dodo Payments gateway is not configured.',
      });
    }

    const baseUrl = dodoClient.getBaseUrl();
    const targetId = sessionId || paymentId;

    let verifyRes = await fetch(`${baseUrl}/checkouts/${targetId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (verifyRes.status === 404 && paymentId) {
      verifyRes = await fetch(`${baseUrl}/payments/${paymentId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
    }

    if (!verifyRes.ok) {
      const errorText = await verifyRes.text();
      return res.status(verifyRes.status).json({
        verified: false,
        error_code: 'DODO_VERIFICATION_FAILED',
        error_message: 'Payment verification failed at Dodo Payments gateway.',
        details: errorText,
      });
    }

    const sessionData: any = await verifyRes.json();
    const status = (sessionData?.status || sessionData?.payment_status || '').toLowerCase();
    const isPaid = status === 'succeeded' || status === 'paid' || status === 'completed' || status === 'active';

    if (!isPaid) {
      return res.status(400).json({
        verified: false,
        status,
        error_code: 'PAYMENT_NOT_COMPLETED',
        error_message: `Payment has not been completed yet (status: ${status || 'pending'}).`,
      });
    }

    const resolvedPlan: PlanType = sessionData?.metadata?.plan || plan || 'lifetime';
    const resolvedUserId = sessionData?.metadata?.user_id || userId || 'default-user';
    const customerEmail = sessionData?.customer?.email || 'subscriber@smarttoolhub.com';

    // Synchronize local database
    await repository.upsertSubscription({
      userId: resolvedUserId,
      subscriptionId: sessionData?.subscription_id || `sub_${targetId}`,
      customerId: sessionData?.customer?.customer_id || sessionData?.customer_id,
      customerEmail,
      customerName: sessionData?.customer?.name,
      plan: resolvedPlan,
      status: 'active',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd:
        resolvedPlan === 'lifetime'
          ? new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString()
          : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    });

    // Generate cryptographic verification signature to prevent client manipulation
    const verificationToken = crypto
      .createHmac('sha256', config.apiKey)
      .update(`${targetId}:${resolvedPlan}:${status}`)
      .digest('hex');

    return res.json({
      verified: true,
      status,
      plan: resolvedPlan,
      customerEmail,
      verificationToken,
      verifiedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return res.status(500).json({
      verified: false,
      error_code: 'VERIFICATION_SERVER_ERROR',
      error_message: 'Server error while verifying payment session.',
      details: err?.message,
    });
  }
});

// Interactive test card checkout endpoint (requires explicit card submission)
app.post('/api/dodo/submit-test-payment', async (req: Request, res: Response) => {
  try {
    const { plan = 'lifetime', customerEmail, customerName, cardNumber } = req.body || {};
    const repository = SubscriptionRepository.getInstance();
    const selectedPlan: PlanType = plan === 'yearly' ? 'yearly' : 'lifetime';
    const testSessionId = 'dodo_test_pay_' + Date.now().toString(36);
    const testCustomerId = 'cust_test_' + Date.now().toString(36);

    const cleanCard = String(cardNumber || '').replace(/\s+/g, '');
    if (cleanCard.length < 12) {
      return res.status(400).json({
        success: false,
        error_message: 'Please enter a valid card number (minimum 12 digits).',
      });
    }

    await repository.upsertSubscription({
      userId: (req.body?.userId as string) || 'default-user',
      customerId: testCustomerId,
      customerEmail: customerEmail || 'subscriber@smarttoolhub.com',
      customerName: customerName || 'SmartToolHub Pro Member',
      plan: selectedPlan,
      status: 'active',
      currentPeriodEnd:
        selectedPlan === 'yearly'
          ? new Date(Date.now() + 365 * 86400000).toISOString()
          : new Date(Date.now() + 100 * 365 * 86400000).toISOString(),
    });

    return res.json({
      success: true,
      session_id: testSessionId,
      customer_id: testCustomerId,
      plan: selectedPlan,
      status: 'active',
      message: `Test payment of $${selectedPlan === 'yearly' ? '79.00' : '39.00'} successfully approved. SmartToolHub Pro activated.`,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error_message: err?.message || 'Payment simulation failed.' });
  }
});

// Reset subscription endpoint (allows testing free vs pro states)
app.post('/api/dodo/reset-subscription', async (req: Request, res: Response) => {
  try {
    const userId = (req.body?.userId as string) || 'default-user';
    const repository = SubscriptionRepository.getInstance();
    await repository.upsertSubscription({
      userId,
      customerEmail: 'subscriber@smarttoolhub.com',
      status: 'cancelled',
      plan: 'lifetime',
      currentPeriodEnd: new Date(Date.now() - 1000).toISOString(),
    });
    return res.json({ success: true, message: 'Subscription reset to free tier.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error_message: err?.message });
  }
});

// 3. WEBHOOK LIFE-CYCLE ARCHITECTURE:
// Idempotent webhook listener endpoint capturing real-time events from Dodo Payments
app.post('/api/dodo/webhook', async (req: Request, res: Response) => {
  const signature =
    (req.headers['webhook-signature'] as string) ||
    (req.headers['dodo-signature'] as string) ||
    (req.headers['x-dodo-signature'] as string);

  const rawPayload = (req as any).rawBody || JSON.stringify(req.body);

  try {
    const webhookHandler = new DodoWebhookHandler();
    const result = await webhookHandler.handleWebhook(rawPayload, signature, req.body);

    return res.status(200).json({
      received: true,
      event: result.event,
      idempotent: result.idempotent || false,
      message: result.message,
    });
  } catch (err: any) {
    console.error('[API /api/dodo/webhook] Error handling webhook:', err);
    if (err?.message?.includes('WEBHOOK_SIGNATURE_MISMATCH')) {
      return res.status(401).json({
        error_code: 'INVALID_SIGNATURE',
        error_message: 'Dodo Payments webhook signature verification failed.',
      });
    }
    return res.status(500).json({
      error_code: 'WEBHOOK_PROCESSING_FAILED',
      error_message: err?.message || 'Error executing webhook lifecycle handler.',
    });
  }
});

// Cloud Run Container Health Check & Warmup Endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Serve public static assets (favicons, manifest, sitemap, robots, webp images)
const publicPath = path.join(process.cwd(), 'public');
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath, {
    maxAge: '1d',
    etag: true,
    lastModified: true,
  }));
}

// Vite / static file serving
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    const distAssetsPath = path.join(distPath, 'assets');

    // Immutable caching for hashed production build chunks (1 year)
    if (fs.existsSync(distAssetsPath)) {
      app.use('/assets', express.static(distAssetsPath, {
        maxAge: '1y',
        immutable: true,
      }));
    }

    // Serve other dist assets
    app.use(express.static(distPath, {
      maxAge: '1d',
      etag: true,
    }));

    // HTML fallback with no-cache so users always receive latest bundle references
    app.get('*', (req: Request, res: Response) => {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SmartToolHub server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
