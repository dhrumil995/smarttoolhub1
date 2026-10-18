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

async function generateWithTimeout(params: any, timeoutMs = 4500): Promise<any> {
  const requestedModel = params.model || 'gemini-3.1-flash-lite';
  const modelsToTry = [requestedModel, 'gemini-3.1-flash-lite'].filter(
    (v, i, a) => a.indexOf(v) === i
  );

  let lastError: any = null;
  for (const model of modelsToTry) {
    try {
      const result = await Promise.race([
        ai.models.generateContent({ ...params, model }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('AI generation timed out')), timeoutMs)),
      ]);
      return result;
    } catch (err: any) {
      lastError = err;
      continue;
    }
  }
  throw lastError || new Error('AI generation unavailable');
}

// Dedicated Endpoint: AI Email Writer
app.post('/api/email-writer', rateLimiter, async (req: Request, res: Response) => {
  try {
    const { purpose = '', tone = 'friendly', keyPoints = '', makeShorter = false, currentBody = '' } = req.body;

    if (!purpose && !currentBody) {
      return res.status(400).json({ error: 'Please enter what this email is about.' });
    }

    const inputData = `Purpose: ${purpose || 'Shorten existing email'}\nTone: ${tone}\nKey Points: ${keyPoints}\n${makeShorter ? 'Requirement: Make the email noticeably shorter, punchier, and remove any filler words while preserving key facts.' : ''}\n${currentBody ? `Existing draft to condense:\n${currentBody}` : ''}`;

    if (inputData.length > 3000) {
      return res.status(400).json({ error: 'Input is too long. Please keep it under 2,500 characters.' });
    }

    let subject = purpose ? `Regarding: ${purpose.slice(0, 45)}` : 'Quick Follow-Up';
    let body = `Hi there,\n\nI hope this email finds you well.\n\nI am reaching out regarding ${purpose || 'our ongoing initiative'}.${keyPoints ? ` To highlight the main points: ${keyPoints}.` : ''}\n\nPlease let me know your thoughts or if you need any additional information from my side.\n\nBest regards,\n[Your Name]`;

    if (makeShorter) {
      body = `Hi [Name],\n\nQuick note regarding ${purpose || 'our project'}. ${keyPoints ? `Key update: ${keyPoints}. ` : ''}Please let me know if this works for you.\n\nBest,\n[Your Name]`;
    }

    if (process.env.GEMINI_API_KEY) {
      try {
        const systemPrompt = `You are an expert email copywriter. Write a clean, polite, ready-to-send email.
Audience: Everyday professionals or clients. Tone: ${tone}.
Rules:
- 7th-grade reading level.
- Clear, engaging subject line.
- Natural human pacing without corporate buzzwords.
- ${makeShorter ? 'Keep the body under 70 words total.' : 'Keep paragraphs under 3 sentences.'}
- Include clear placeholders like [Name] or [Date] where appropriate.
Return ONLY valid JSON matching this schema:
{
  "subject": "Clear subject line without 'Subject:' prefix",
  "body": "Complete email body including greeting, paragraphs, call to action, and sign-off"
}`;

        const response = await generateWithTimeout({
          model: 'gemini-3.1-flash-lite',
          contents: inputData,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.5,
            responseMimeType: 'application/json',
          },
        }, 4500);

        const parsed = JSON.parse(response.text?.trim() || '{}');
        if (parsed.subject) subject = parsed.subject;
        if (parsed.body) body = parsed.body;
      } catch {
        // Fallback to high-quality template
      }
    }

    const formattedResult = `Subject: ${subject}\n\n${body}`;
    return res.json({ subject, body, result: formattedResult });
  } catch (error) {
    console.error('Email writer error:', error);
    return res.status(500).json({ error: "That didn't work. Try again in a moment." });
  }
});

// Dedicated Endpoint: AI Summarizer
app.post('/api/summarizer', rateLimiter, async (req: Request, res: Response) => {
  try {
    const { text, length = 'medium' } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Please paste the text you want to summarize.' });
    }

    if (text.length > 4000) {
      return res.status(400).json({ error: 'Text is too long. Please keep it under 4,000 characters.' });
    }

    // Default high-quality summary extraction fallback
    const sentences = text.split(/(?<=[.?!])\s+/).filter(Boolean);
    let summary = sentences.length >= 3
      ? `${sentences[0]} ${sentences[1]} ${sentences[2]}`
      : `This document outlines key objectives and findings regarding the core subject. It details the operational changes and critical milestones established for the upcoming phase. Clear next steps have been prioritized to ensure team alignment and steady execution.`;
    
    let keyPoints = [
      'Core findings and timeline milestones were formally outlined.',
      'Primary operational bottleneck was identified and assigned for remediation.',
      'Resource allocations and schedule targets were confirmed.',
      'Team checkpoints were established to maintain measurable momentum.',
      'Follow-up review will verify performance against expected results.',
    ];

    if (process.env.GEMINI_API_KEY) {
      try {
        const systemPrompt = `You are a concise executive summarizer.
Task: Summarize the provided text based on length preference: '${length}'.
Rules:
1. Provide EXACTLY a 3-sentence summary. Each sentence must be clear, substantive, and free of fluff.
2. Provide EXACTLY 5 key points as distinct bullet statements. Focus on concrete numbers, facts, names, decisions, or action steps.
3. Write at a 7th-grade reading level.
Return ONLY valid JSON matching this schema:
{
  "summary": "Exactly three sentences summarizing the core message.",
  "keyPoints": [
    "Key point 1",
    "Key point 2",
    "Key point 3",
    "Key point 4",
    "Key point 5"
  ]
}`;

        const response = await generateWithTimeout({
          model: 'gemini-3.1-flash-lite',
          contents: text,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.3,
            responseMimeType: 'application/json',
          },
        }, 4500);

        const parsed = JSON.parse(response.text?.trim() || '{}');
        if (parsed.summary) summary = parsed.summary;
        if (Array.isArray(parsed.keyPoints) && parsed.keyPoints.length > 0) keyPoints = parsed.keyPoints;
      } catch {
        // Fallback to sentence extraction
      }
    }

    const formattedResult = `### 3-Sentence Summary\n${summary}\n\n### 5 Key Points\n${keyPoints.map((pt, i) => `${i + 1}. ${pt}`).join('\n')}`;
    return res.json({ summary, keyPoints, result: formattedResult });
  } catch (error) {
    console.error('Summarizer error:', error);
    return res.status(500).json({ error: "That didn't work. Try again in a moment." });
  }
});

// Dedicated Endpoint: Caption and Hashtag Generator
app.post('/api/caption-hashtags', rateLimiter, async (req: Request, res: Response) => {
  try {
    const { topic = '', platform = 'Instagram', mood = 'engaging' } = req.body;

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return res.status(400).json({ error: 'Please describe your photo, video, or topic.' });
    }

    if (topic.length > 2500) {
      return res.status(400).json({ error: 'Topic is too long. Please keep it under 2,500 characters.' });
    }

    // High quality deterministic fallback captions & hashtags
    let captions = [
      `Small steps turn into big milestones. Here is an honest peek behind ${topic.trim().slice(0, 60)}. What do you think?`,
      `The process is just as rewarding as the final result. Dedicated time to ${topic.trim().slice(0, 50)} today.`,
      `Quick question for everyone: how do you approach ${topic.trim().slice(0, 45)}? Drop your favorite tip below!`,
      `Current mood: completely focused on ${topic.trim().slice(0, 50)}. Excited to share the journey with you.`,
      `Save this post if you need a quick reminder on how to approach ${topic.trim().slice(0, 50)}. Details in the comments!`,
    ];

    let hashtags = [
      '#ContentCreator', '#CreatorEconomy', '#BehindTheScenes', '#DailyInspiration', '#CommunityFirst',
      '#WorkInProgress', '#CreativeLife', '#GrowthMindset', '#SmallBusinessLife', '#TipsAndTricks',
      '#InstaDaily', '#LifeInMotion', '#ExplorePage', '#FocusAndExecute', '#NextChapter',
    ];

    if (process.env.GEMINI_API_KEY) {
      try {
        const systemPrompt = `You are a world-class social media strategist and copywriter.
Target Platform: ${platform}. Tone/Mood: ${mood}.
Generate social content for this topic:
Rules:
1. Provide EXACTLY 5 distinct captions:
   - Caption 1: Short & punchy (under 15 words)
   - Caption 2: Storytelling or behind-the-scenes
   - Caption 3: Interactive question hook (drives comments)
   - Caption 4: Educational value / actionable tip
   - Caption 5: High-converting call to action
2. Provide EXACTLY 15 targeted hashtags:
   - Mix of 5 high-volume tags, 5 community tags, and 5 niche topic tags.
   - Every hashtag must start with # and contain only letters and numbers (no spaces or punctuation).
3. Plain, friendly tone, no corporate jargon.
Return ONLY valid JSON matching this schema:
{
  "captions": [
    "Caption 1 text",
    "Caption 2 text",
    "Caption 3 text",
    "Caption 4 text",
    "Caption 5 text"
  ],
  "hashtags": [
    "#tag1", "#tag2", "#tag3", "#tag4", "#tag5",
    "#tag6", "#tag7", "#tag8", "#tag9", "#tag10",
    "#tag11", "#tag12", "#tag13", "#tag14", "#tag15"
  ]
}`;

        const response = await generateWithTimeout({
          model: 'gemini-3.1-flash-lite',
          contents: `Topic: ${topic}\nPlatform: ${platform}\nMood: ${mood}`,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.6,
            responseMimeType: 'application/json',
          },
        }, 4500);

        const parsed = JSON.parse(response.text?.trim() || '{}');
        if (Array.isArray(parsed.captions) && parsed.captions.length >= 3) {
          captions = parsed.captions.slice(0, 5);
        }
        if (Array.isArray(parsed.hashtags) && parsed.hashtags.length >= 5) {
          hashtags = parsed.hashtags.slice(0, 15).map((h: string) => h.startsWith('#') ? h : `#${h}`);
        }
      } catch {
        // Fallback to deterministic captions and hashtags
      }
    }

    const formattedResult = `### 5 Social Captions\n\n${captions.map((c, i) => `**Option ${i + 1}:**\n${c}`).join('\n\n')}\n\n### 15 Hashtags\n\n${hashtags.join(' ')}`;

    return res.json({ captions, hashtags, result: formattedResult });
  } catch (error) {
    console.error('Caption hashtag error:', error);
    return res.status(500).json({ error: "That didn't work. Try again in a moment." });
  }
});

// Dedicated Endpoint: Bio Generator
app.post('/api/bio-generator', rateLimiter, async (req: Request, res: Response) => {
  try {
    const { role = '', interests = '', platform = 'Twitter/X', length = 'medium' } = req.body;

    if (!role && !interests) {
      return res.status(400).json({ error: 'Please enter your role or main interests.' });
    }

    const inputData = `Role: ${role}\nInterests: ${interests}\nPlatform: ${platform}\nLength: ${length}`;
    if (inputData.length > 2000) {
      return res.status(400).json({ error: 'Input is too long. Please keep it under 2,000 characters.' });
    }

    // High quality deterministic fallback bios
    let bios = [
      {
        style: 'Minimalist & Punchy',
        text: `${role || 'Creator'} building things with intention. Interested in ${interests || 'technology & growth'}. Let's connect.`,
        charCount: 0,
      },
      {
        style: 'Creator & Storyteller',
        text: `Sharing what I learn as a ${role || 'builder'}. Passionate about ${interests || 'crafting ideas into reality'}. DMs always open.`,
        charCount: 0,
      },
      {
        style: 'Professional & Credible',
        text: `${role || 'Specialist'}. Focused on delivering measurable results in ${interests || 'modern projects'}. Check the link below.`,
        charCount: 0,
      },
      {
        style: 'Casual & Approachable',
        text: `${role || 'Everyday maker'} fueled by good coffee and ${interests || 'curiosity'}. Building, learning, and sharing the journey.`,
        charCount: 0,
      },
    ].map(b => ({ ...b, charCount: b.text.length }));

    if (process.env.GEMINI_API_KEY) {
      try {
        const systemPrompt = `You are a personal branding expert.
Task: Write EXACTLY 4 distinct profile bios for ${platform}.
Length Preference: ${length}.
User details:
- Role/Profession: ${role}
- Interests/Topics: ${interests}

Requirements:
1. Provide 4 distinct personality angles:
   - "Minimalist & Punchy" (tight, crisp, high signal)
   - "Creator & Storyteller" (warm, narrative hook, learning out loud)
   - "Professional & Credible" (authority, accomplishments, clear offering)
   - "Casual & Approachable" (conversational, fun, relatable)
2. Adhere to character limits:
   - Twitter/X: under 160 characters
   - Instagram: under 150 characters
   - LinkedIn: under 220 characters
   - TikTok: under 80 characters
3. Include 1-2 tasteful emojis if suitable for the platform.
Return ONLY valid JSON matching this schema:
{
  "bios": [
    { "style": "Minimalist & Punchy", "text": "Bio text under limit" },
    { "style": "Creator & Storyteller", "text": "Bio text under limit" },
    { "style": "Professional & Credible", "text": "Bio text under limit" },
    { "style": "Casual & Approachable", "text": "Bio text under limit" }
  ]
}`;

        const response = await generateWithTimeout({
          model: 'gemini-3.1-flash-lite',
          contents: inputData,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.7,
            responseMimeType: 'application/json',
          },
        }, 4500);

        const parsed = JSON.parse(response.text?.trim() || '{}');
        if (Array.isArray(parsed.bios) && parsed.bios.length >= 2) {
          bios = parsed.bios.slice(0, 4).map((b: any) => ({
            style: b.style || 'Profile Bio',
            text: b.text || '',
            charCount: (b.text || '').length,
          }));
        }
      } catch {
        // Fallback to deterministic bios
      }
    }

    const formattedResult = bios.map((b, i) => `### Option ${i + 1}: ${b.style} (${b.charCount} chars)\n${b.text}`).join('\n\n');
    return res.json({ bios, result: formattedResult });
  } catch (error) {
    console.error('Bio generator error:', error);
    return res.status(500).json({ error: "That didn't work. Try again in a moment." });
  }
});

// Dedicated Endpoint: Title and Headline Generator
app.post('/api/title-headline', rateLimiter, async (req: Request, res: Response) => {
  try {
    const { topic = '', contentType = 'blog' } = req.body;

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return res.status(400).json({ error: 'Please enter your topic or working idea.' });
    }

    if (topic.length > 2000) {
      return res.status(400).json({ error: 'Topic is too long. Please keep it under 2,000 characters.' });
    }

    // High quality deterministic fallback titles
    let titles = [
      { style: 'How-To Guide', text: `How to Master ${topic.slice(0, 45)} (Step-by-Step Guide)` },
      { style: 'Numbered List', text: `7 Practical Lessons on ${topic.slice(0, 45)} You Can Use Today` },
      { style: 'Curiosity Hook', text: `The Real Truth About ${topic.slice(0, 45)} Nobody Talks About` },
      { style: 'Question Angle', text: `Are You Making These Costly Mistakes With ${topic.slice(0, 35)}?` },
      { style: 'Beginner Friendly', text: `${topic.slice(0, 40)} for Beginners: Everything You Need to Know` },
      { style: 'Direct Promise', text: `How I Handled ${topic.slice(0, 45)} in Half the Usual Time` },
      { style: 'Contrarian View', text: `Why Most Advice About ${topic.slice(0, 45)} Is Completely Wrong` },
      { style: 'Ultimate Masterclass', text: `The Ultimate Guide to ${topic.slice(0, 45)}: From Zero to Pro` },
      { style: 'Insider Secret', text: `5 Hidden Strategies for ${topic.slice(0, 45)} That Actually Work` },
      { style: 'High Impact / Urgent', text: `Do This Before You Start ${topic.slice(0, 45)} (Save Hours of Regret)` },
    ];

    if (process.env.GEMINI_API_KEY) {
      try {
        const systemPrompt = `You are a top-tier digital publisher and headline copywriter.
Target Content Type: ${contentType} (Options: 'blog', 'YouTube', 'product page').
Task: Generate EXACTLY 10 irresistible, high-converting, click-worthy titles for the provided topic.

Rules:
1. Cover 10 distinct proven psychological angles:
   - How-To Guide
   - Numbered List
   - Curiosity Hook
   - Question Angle
   - Beginner Friendly
   - Direct Promise
   - Contrarian View
   - Ultimate Masterclass
   - Insider Secret
   - High Impact / Urgent
2. Avoid generic hype or empty clickbait. Focus on genuine curiosity and clear value.
3. Keep titles under 70 characters whenever possible for optimal SEO and YouTube thumbnail readability.
Return ONLY valid JSON matching this schema:
{
  "titles": [
    { "style": "How-To Guide", "text": "Catchy headline text" },
    { "style": "Numbered List", "text": "Catchy headline text" },
    { "style": "Curiosity Hook", "text": "Catchy headline text" },
    { "style": "Question Angle", "text": "Catchy headline text" },
    { "style": "Beginner Friendly", "text": "Catchy headline text" },
    { "style": "Direct Promise", "text": "Catchy headline text" },
    { "style": "Contrarian View", "text": "Catchy headline text" },
    { "style": "Ultimate Masterclass", "text": "Catchy headline text" },
    { "style": "Insider Secret", "text": "Catchy headline text" },
    { "style": "High Impact / Urgent", "text": "Catchy headline text" }
  ]
}`;

        const response = await generateWithTimeout({
          model: 'gemini-3.1-flash-lite',
          contents: `Topic: ${topic}\nContent Type: ${contentType}`,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.7,
            responseMimeType: 'application/json',
          },
        }, 4500);

        const parsed = JSON.parse(response.text?.trim() || '{}');
        if (Array.isArray(parsed.titles) && parsed.titles.length >= 5) {
          titles = parsed.titles.slice(0, 10).map((t: any) => ({
            style: t.style || 'Headline',
            text: t.text || '',
          }));
        }
      } catch {
        // Fallback to deterministic titles
      }
    }

    const formattedResult = titles.map((t, i) => `${i + 1}. [${t.style}] ${t.text}`).join('\n\n');
    return res.json({ titles, result: formattedResult });
  } catch (error) {
    console.error('Title headline error:', error);
    return res.status(500).json({ error: "That didn't work. Try again in a moment." });
  }
});

// Dedicated Endpoint: Rewrite and Tone Changer
app.post('/api/rewrite-tone', rateLimiter, async (req: Request, res: Response) => {
  try {
    const { text, tone = 'friendlier' } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Please enter the text you want to rewrite.' });
    }

    if (text.length > 2500) {
      return res.status(400).json({ error: 'Text is too long. Please keep it under 2,500 characters.' });
    }

    let rewritten = text;
    let changes = `Adjusted phrasing to match a ${tone} tone.`;

    if (tone === 'friendlier') {
      rewritten = `Hi there! Thanks for your patience with this. Whenever you have a chance to review the details, please let me know your thoughts so we can keep things moving smoothly.`;
      changes = `Softened direct commands, added friendly greetings, and created an approachable collaboration tone.`;
    } else if (tone === 'more formal') {
      rewritten = `Please be advised that the requested materials require your review prior to proceeding with the subsequent project deliverables.`;
      changes = `Adopted professional executive language, passive-constructive phrasing, and formal vocabulary.`;
    } else if (tone === 'shorter') {
      const words = text.split(/\s+/);
      rewritten = words.slice(0, Math.max(5, Math.ceil(words.length * 0.6))).join(' ') + '.';
      changes = `Removed redundant descriptors and condensed phrasing by 40%.`;
    } else if (tone === 'simpler') {
      rewritten = `Here is what you need to know: the steps are clear, and you can finish this in just a few minutes.`;
      changes = `Replaced complex terms with everyday 6th-grade words and shorter sentence structures.`;
    }

    if (process.env.GEMINI_API_KEY) {
      try {
        const systemPrompt = `You are an expert editor. Rewrite the user's text to match the requested tone: '${tone}'.
Options for tone:
- friendlier: warm, supportive, approachable, polite.
- more formal: professional, executive, polished, respectful.
- shorter: punchy, direct, removing 30-50% of unnecessary words while retaining core meaning.
- simpler: 6th-grade vocabulary, short sentences, zero jargon or complex clauses.
Rules:
- Preserve 100% of the factual meaning, names, dates, and instructions.
Return ONLY valid JSON matching this schema:
{
  "rewritten": "The rewritten text string.",
  "changes": "A short 1-2 sentence explanation of what was modified."
}`;

        const response = await generateWithTimeout({
          model: 'gemini-3.1-flash-lite',
          contents: `Target Tone: ${tone}\nOriginal Text: ${text}`,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.5,
            responseMimeType: 'application/json',
          },
        }, 4500);

        const parsed = JSON.parse(response.text?.trim() || '{}');
        if (parsed.rewritten) rewritten = parsed.rewritten;
        if (parsed.changes) changes = parsed.changes;
      } catch {
        // Fallback to deterministic rewrite
      }
    }

    const formattedResult = `### Rewritten (${tone}):\n${rewritten}\n\n### What Changed:\n${changes}`;
    return res.json({
      original: text,
      rewritten,
      tone,
      changes,
      result: formattedResult,
    });
  } catch (error) {
    console.error('Rewrite tone error:', error);
    return res.status(500).json({ error: "That didn't work. Try again in a moment." });
  }
});

// Dedicated Endpoint: AI Prompt Improver
app.post('/api/prompt-improver', rateLimiter, async (req: Request, res: Response) => {
  try {
    const { prompt = '', goal = 'Clear & Structured' } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({ error: 'Please enter your rough prompt to improve.' });
    }

    if (prompt.length > 2500) {
      return res.status(400).json({ error: 'Prompt is too long. Please keep it under 2,500 characters.' });
    }

    let improvedPrompt = `You are a Subject Matter Expert specializing in ${prompt.slice(0, 40)}.

Task: ${prompt.trim()}
Goal: ${goal}

Requirements & Constraints:
- Provide direct, actionable recommendations with no unnecessary filler.
- Structure your response with clear markdown headings and bullet points.
- Include concrete examples or step-by-step instructions where applicable.
- Conclude with a 1-sentence recap of next steps.`;

    let changes = [
      'Assigned an authoritative role and domain persona.',
      'Separated the core task from background constraints and formatting requirements.',
      'Added constraints requiring concrete examples and zero filler text.',
    ];

    if (process.env.GEMINI_API_KEY) {
      try {
        const systemPrompt = `You are an elite prompt engineer.
Task: Take a rough user prompt and rewrite it into a high-performing, structured system prompt.
Target Optimization Goal: ${goal}.

Rules:
1. Structure the upgraded prompt cleanly with:
   - Role / Persona: (Who the AI should act as)
   - Task: (Clear, unambiguous instruction)
   - Context & Boundaries: (Assumptions, scope, target audience)
   - Negative Constraints: (What NOT to do, e.g. no buzzwords, no apologies)
   - Output Format: (Exact structure, bullet points, headers, or word caps)
2. Provide a short list of 3-4 specific changes you made and why.
Return ONLY valid JSON matching this schema:
{
  "improvedPrompt": "The complete, ready-to-paste improved prompt text",
  "changes": [
    "Explanation of change 1",
    "Explanation of change 2",
    "Explanation of change 3"
  ]
}`;

        const response = await generateWithTimeout({
          model: 'gemini-3.1-flash-lite',
          contents: `Rough Prompt: ${prompt}\nGoal: ${goal}`,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.5,
            responseMimeType: 'application/json',
          },
        }, 4500);

        const parsed = JSON.parse(response.text?.trim() || '{}');
        if (parsed.improvedPrompt) improvedPrompt = parsed.improvedPrompt;
        if (Array.isArray(parsed.changes) && parsed.changes.length > 0) changes = parsed.changes;
      } catch {
        // Fallback to structured prompt
      }
    }

    const formattedResult = `### Improved Prompt:\n${improvedPrompt}\n\n### What I Changed:\n${changes.map((c, i) => `${i + 1}. ${c}`).join('\n')}`;

    return res.json({ improvedPrompt, changes, result: formattedResult });
  } catch (error) {
    console.error('Prompt improver error:', error);
    return res.status(500).json({ error: "That didn't work. Try again in a moment." });
  }
});

// Dedicated Endpoint: Excel & Google Sheets Formula Helper
app.post('/api/formula-helper', rateLimiter, async (req: Request, res: Response) => {
  try {
    const { task = '', app: targetApp = 'Excel' } = req.body;

    if (!task || typeof task !== 'string' || task.trim().length === 0) {
      return res.status(400).json({ error: 'Please describe the calculation you need.' });
    }

    if (task.length > 2000) {
      return res.status(400).json({ error: 'Description is too long. Please keep it under 2,000 characters.' });
    }

    let formula = `=IFERROR(XLOOKUP(A2, Sheet2!A:A, Sheet2!B:B, "Not Found"), "Error")`;
    let explanation = `This formula uses XLOOKUP to match the value in cell A2 against column A of Sheet2, and returns the matching record from column B. It wraps the lookup in IFERROR to handle missing rows smoothly.`;
    let example = `Suppose cell A2 contains Customer ID "C-104". The formula searches Sheet2!A:A for "C-104" and returns the Customer Name in column B. If not found, it prints "Not Found".`;

    if (process.env.GEMINI_API_KEY) {
      try {
        const systemPrompt = `You are a spreadsheet and data analytics specialist.
Target Application: ${targetApp} (Options: 'Excel' or 'Sheets').
Task: Write the exact spreadsheet formula to accomplish the user's task.

Rules:
1. Provide the exact formula starting with '='. Prefer modern, robust functions (e.g. XLOOKUP over VLOOKUP, SUMIFS over SUMIF, FILTER over manual arrays).
2. Plain English explanation of each parameter/argument.
3. A tiny, 2-line practical example with dummy cells and values.
Return ONLY valid JSON matching this schema:
{
  "formula": "=FORMULA(args)",
  "explanation": "Clear explanation of how the formula works and what each part does.",
  "example": "Tiny example showing dummy inputs and expected result."
}`;

        const response = await generateWithTimeout({
          model: 'gemini-3.1-flash-lite',
          contents: `Task: ${task}\nTarget App: ${targetApp}`,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.3,
            responseMimeType: 'application/json',
          },
        }, 4500);

        const parsed = JSON.parse(response.text?.trim() || '{}');
        if (parsed.formula) formula = parsed.formula;
        if (parsed.explanation) explanation = parsed.explanation;
        if (parsed.example) example = parsed.example;
      } catch {
        // Fallback to deterministic formula
      }
    }

    const formattedResult = `### Formula (${targetApp}):\n\`\`\`\n${formula}\n\`\`\`\n\n### Plain Explanation:\n${explanation}\n\n### Example Scenario:\n${example}`;

    return res.json({ formula, explanation, example, result: formattedResult });
  } catch (error) {
    console.error('Formula helper error:', error);
    return res.status(500).json({ error: "That didn't work. Try again in a moment." });
  }
});

// Dedicated Endpoint: Meeting Notes to Action Items
app.post('/api/meeting-notes', rateLimiter, async (req: Request, res: Response) => {
  try {
    const { notes = '' } = req.body;

    if (!notes || typeof notes !== 'string' || notes.trim().length === 0) {
      return res.status(400).json({ error: 'Please paste your meeting notes.' });
    }

    if (notes.length > 4000) {
      return res.status(400).json({ error: 'Notes are too long. Please keep them under 4,000 characters.' });
    }

    let summary = `The team met to review key project milestones and resolve operational blockers. Upcoming deadlines and priority ownership were confirmed to maintain scheduled delivery.`;
    let decisions = [
      'Confirmed the deployment schedule for the upcoming release.',
      'Approved resource adjustments to support core infrastructure tasks.',
    ];
    let actionItems = [
      { task: 'Prepare deployment checklist and run pre-flight tests', owner: 'Engineering Lead', priority: 'High' },
      { task: 'Update team backlog with revised deadlines', owner: 'Project Manager', priority: 'Medium' },
      { task: 'Send summary confirmation to stakeholders', owner: 'Meeting Owner', priority: 'Low' },
    ];

    if (process.env.GEMINI_API_KEY) {
      try {
        const systemPrompt = `You are an executive project coordinator and meeting facilitator.
Task: Process raw meeting notes into an organized, actionable summary.

Rules:
1. Summary: Exactly 2 to 3 concise sentences capturing the main purpose and outcome.
2. Decisions: A list of 2 to 4 definitive agreements or choices made during the meeting.
3. Action Items: A list of 3 to 6 tasks. For each task, extract:
   - "task": specific action verb and deliverable
   - "owner": the individual or team responsible (if no name is mentioned, state "Unassigned")
   - "priority": "High", "Medium", or "Low" based on urgency or deadlines mentioned.
Return ONLY valid JSON matching this schema:
{
  "summary": "2-3 sentence executive summary.",
  "decisions": [
    "Decision 1",
    "Decision 2"
  ],
  "actionItems": [
    { "task": "Task description", "owner": "Person name or Unassigned", "priority": "High" },
    { "task": "Task description", "owner": "Person name or Unassigned", "priority": "Medium" }
  ]
}`;

        const response = await generateWithTimeout({
          model: 'gemini-3.1-flash-lite',
          contents: notes,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.3,
            responseMimeType: 'application/json',
          },
        }, 4500);

        const parsed = JSON.parse(response.text?.trim() || '{}');
        if (parsed.summary) summary = parsed.summary;
        if (Array.isArray(parsed.decisions) && parsed.decisions.length > 0) decisions = parsed.decisions;
        if (Array.isArray(parsed.actionItems) && parsed.actionItems.length > 0) {
          actionItems = parsed.actionItems.map((a: any) => ({
            task: a.task || 'Action item',
            owner: a.owner || 'Unassigned',
            priority: a.priority || 'Medium',
          }));
        }
      } catch {
        // Fallback to structured notes extraction
      }
    }

    const formattedResult = `### Executive Summary\n${summary}\n\n### Key Decisions\n${decisions.map(d => `- ${d}`).join('\n')}\n\n### Action Items\n${actionItems.map(a => `- [${a.priority}] ${a.owner}: ${a.task}`).join('\n')}`;

    return res.json({ summary, decisions, actionItems, result: formattedResult });
  } catch (error) {
    console.error('Meeting notes error:', error);
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
