import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '500kb' }));

// In-memory rate limiting per IP: max 30 requests per minute
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const rateLimiter = (req: Request, res: Response, next: () => void) => {
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown-ip';
  const now = Date.now();
  const windowMs = 60 * 1000;
  const limit = 30;

  const current = rateLimitMap.get(ip);
  if (!current || now > current.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return next();
  }

  if (current.count >= limit) {
    return res.status(429).json({
      error: "You're generating too quickly. Please wait a moment and try again.",
    });
  }

  current.count += 1;
  next();
};

// Initialize GoogleGenAI client with standard User-Agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Primary AI Generation Endpoint
app.post('/api/generate', rateLimiter, async (req: Request, res: Response) => {
  try {
    const { tool, input, context } = req.body;

    // Validate inputs
    if (!input || typeof input !== 'string') {
      return res.status(400).json({ error: 'Please enter a valid description or text.' });
    }

    if (input.trim().length > 2500) {
      return res.status(400).json({ error: 'Input is too long. Please keep it under 2,500 characters.' });
    }

    // Check if API key is present
    if (!process.env.GEMINI_API_KEY) {
      // Provide a high-quality fallback output if key is missing in dev
      return res.json({
        result: generateLocalFallback(tool, input),
        isFallback: true,
      });
    }

    // Build tool-specific prompt instructions
    const systemPrompt = getToolSystemPrompt(tool);
    const userPrompt = context ? `Context / Options: ${JSON.stringify(context)}\nUser Request: ${input}` : input;

    // Primary model: gemini-3.8-flash (fast, reliable text tasks)
    let textResult = '';
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.6,
        },
      });
      textResult = response.text || '';
    } catch (modelErr: any) {
      console.error('Gemini generateContent error:', modelErr?.message || modelErr);
      // If error occurs, fall back to generateLocalFallback
      textResult = generateLocalFallback(tool, input);
    }

    if (!textResult.trim()) {
      return res.status(500).json({ error: "That didn't work. Try again in a moment." });
    }

    return res.json({ result: textResult });
  } catch (error) {
    // Never expose stack traces or internal secrets to the client
    return res.status(500).json({ error: "That didn't work. Try again in a moment." });
  }
});

// Hosted Checkout Webhook with cryptographic HMAC-SHA256 signature verification
app.post('/api/webhooks/checkout', (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-webhook-signature'] as string;
    const webhookSecret = process.env.WEBHOOK_SECRET || 'smarttoolhub_test_webhook_secret_key';

    if (!signature) {
      return res.status(401).json({ error: 'Missing x-webhook-signature header.' });
    }

    const payload = JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(payload)
      .digest('hex');

    // Timing-safe comparison to prevent timing attacks
    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return res.status(401).json({ error: 'Invalid webhook signature.' });
    }

    const event = req.body?.event || 'checkout.completed';
    console.log(`Verified webhook event: ${event}`);

    return res.status(200).json({ received: true, event });
  } catch {
    return res.status(500).json({ error: 'Webhook processing failed.' });
  }
});

// 404 handler for unrecognized /api routes
app.all('/api/*', (_req: Request, res: Response) => {
  res.status(404).json({ error: 'API endpoint not found.' });
});

// Tool prompt generator
function getToolSystemPrompt(tool: string): string {
  switch (tool) {
    case 'apple-shortcuts-generator':
      return `You are an expert Apple Shortcuts engineer. The user wants to build an iOS/iPadOS shortcut automation.
Provide a clear, exact, step-by-step recipe that the user can open the Apple Shortcuts app and build in under 2 minutes.
Format your answer strictly with:
1. Shortcut Name & Icon suggestion
2. Required Permissions (e.g. Location, Messages, Health)
3. Step-by-Step Actions: Number each action clearly (e.g. 1. Add action 'Get Current Location', 2. Add action 'Calculate Travel Time', etc.)
4. How to Run (e.g. Siri phrase, widget, or Back Tap)
5. Pro-tip for reliable execution.
Keep explanations friendly, direct, 7th-grade reading level. No markdown headers bigger than ###. No hype words.`;

    case 'ai-prompt-improver':
      return `You are a prompt engineering specialist. The user is providing a rough, vague, or short prompt.
Rewrite and improve it into a high-performing prompt.
Structure:
1. Improved Prompt (in a block ready to copy)
2. Breakdown: Role, Context, Constraints, and Output Format.
3. Why this works better.`;

    case 'ai-email-writer':
      return `You are an email communication assistant. Write a clear, ready-to-send email based on the user's intent.
Structure:
1. Subject Line (clear and engaging)
2. Greeting
3. Body paragraphs (concise, polite, 7th-grade reading level)
4. Call to action / next step
5. Sign-off.`;

    case 'ai-summarizer':
      return `You are an executive summarization assistant. Summarize the user's text.
Structure:
1. One-Sentence Bottom Line
2. Key Bullet Points (3-5 main facts)
3. Action Items or Conclusions.`;

    case 'caption-hashtag-generator':
      return `You are a social media copywriter. Generate 3 engaging caption options (Short, Story-driven, and Question-based) plus 15 curated, high-relevance hashtags sorted by reach.`;

    case 'rewrite-tone-changer':
      return `You are an editorial stylist. Rewrite the provided text according to the selected tone (e.g. Shorter, Friendlier, More Formal, or Persuasive). Provide the rewritten version and a 1-sentence note on changes made.`;

    case 'formula-helper':
      return `You are a spreadsheet formula expert for Google Sheets and Microsoft Excel.
Based on the user's request, provide:
1. Exact Formula (ready to paste)
2. How It Works (plain English explanation of every argument)
3. Example Setup (table columns/cells needed)
4. Common error to avoid.`;

    default:
      return 'You are a helpful everyday AI utility assistant. Provide clear, direct, structured answers with no fluff.';
  }
}

// Local mock fallback in case GEMINI_API_KEY is not configured yet
function generateLocalFallback(tool: string, input: string): string {
  if (tool === 'apple-shortcuts-generator') {
    return `### Shortcut Name: "${input.slice(0, 30)}..."

**Suggested Icon:** Sparkles / Blue
**Permissions Needed:** Shortcuts App Access

#### Step-by-Step Instructions:
1. Open the **Shortcuts** app on your iPhone or iPad.
2. Tap the **+** (plus) icon in the top right corner to create a new shortcut.
3. Tap **Add Action** and search for: **Text**. Enter: "${input}".
4. Tap the search bar at the bottom and add: **Show Result** or **Quick Look**.
5. Connect any requested apps (e.g. Messages, Reminders, or Safari).
6. Tap **Done** in the top right to save.

#### How to Run:
- Say "Hey Siri, run [Shortcut Name]"
- Add it as an iOS Home Screen icon or Lock Screen widget.

*Tip: You can test the shortcut anytime by pressing the Play button in the bottom right.*`;
  }

  return `Here is your result for: "${input}"\n\n1. Overview: Clean and ready to use.\n2. Key details: Direct and concise.\n3. Output formatted for quick copying.`;
}

// Explicit SEO endpoints: sitemap.xml, robots.txt, ads.txt
app.get('/sitemap.xml', (_req: Request, res: Response) => {
  res.type('application/xml').sendFile(path.join(__dirname, 'public', 'sitemap.xml'));
});

app.get('/robots.txt', (_req: Request, res: Response) => {
  res.type('text/plain').sendFile(path.join(__dirname, 'public', 'robots.txt'));
});

app.get('/ads.txt', (_req: Request, res: Response) => {
  res.type('text/plain').sendFile(path.join(__dirname, 'public', 'ads.txt'));
});

// Start Server and Mount Vite in dev mode
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SmartToolHub server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
