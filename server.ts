import express, { Request, Response } from 'express';
import http from 'http';
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

// Dedicated Endpoint: Task Breaker (H1)
app.post('/api/task-breaker', rateLimiter, async (req: Request, res: Response) => {
  try {
    const { task = '', detailLevel = 'normal' } = req.body;
    if (!task.trim()) {
      return res.status(400).json({ error: 'Please enter a task or goal to break down.' });
    }
    if (task.length > 5000) {
      return res.status(400).json({ error: 'Input is too long. Please keep it under 5,000 characters.' });
    }

    let steps = [
      { id: 1, text: `Define the outcome for: ${task.slice(0, 40)}`, duration: '5 mins', completed: false },
      { id: 2, text: 'Gather all required materials and clear your workspace', duration: '10 mins', completed: false },
      { id: 3, text: 'Draft the initial outline or first draft', duration: '20 mins', completed: false },
      { id: 4, text: 'Review and refine the draft', duration: '15 mins', completed: false },
      { id: 5, text: 'Final check and completion', duration: '10 mins', completed: false },
    ];
    let encouragement = 'Breathe. You do not need to finish everything at once—just do step 1.';

    if (process.env.GEMINI_API_KEY) {
      try {
        const stepCountInstruction =
          detailLevel === 'tiny'
            ? 'Generate 8-12 extremely small, low-friction micro-steps (2 to 15 mins each) designed to beat procrastination.'
            : detailLevel === 'few'
            ? 'Generate 3-5 high-level milestones (20 to 45 mins each).'
            : 'Generate 5-7 clear, manageable steps (10 to 30 mins each).';

        const prompt = `You are a calm, supportive productivity coach. Break down the user's task or goal into manageable steps.
Goal: "${task}"
Detail level: ${detailLevel}
Requirement: ${stepCountInstruction}
Tone: Calm, encouraging, gentle, non-judgmental, zero pressure.

Respond ONLY with valid JSON in this exact structure:
{
  "steps": [
    { "id": 1, "text": "Specific micro-step description", "duration": "10 mins" }
  ],
  "encouragement": "A short 1-2 sentence warm, reassuring thought."
}`;

        const aiRes = await generateWithTimeout({
          model: 'gemini-3.1-flash-lite',
          contents: prompt,
          generationConfig: { responseMimeType: 'application/json' },
        });

        const raw = aiRes.candidates?.[0]?.content?.parts?.[0]?.text;
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed.steps) && parsed.steps.length > 0) {
            steps = parsed.steps.map((s: any, idx: number) => ({
              id: idx + 1,
              text: s.text || `Step ${idx + 1}`,
              duration: s.duration || '15 mins',
              completed: false,
            }));
          }
          if (parsed.encouragement) encouragement = parsed.encouragement;
        }
      } catch (err) {
        console.warn('Task breaker AI fallback:', err);
      }
    }

    const formattedResult = `### Action Plan: ${task}\n*${encouragement}*\n\n` +
      steps.map(s => `${s.id}. [${s.duration}] ${s.text}`).join('\n');

    return res.json({ steps, encouragement, result: formattedResult });
  } catch (error) {
    console.error('Task breaker error:', error);
    return res.status(500).json({ error: "That didn't work. Try again in a moment." });
  }
});

// Dedicated Endpoint: Explain It Simply (H2)
app.post('/api/explain-simply', rateLimiter, async (req: Request, res: Response) => {
  try {
    const { topic = '', level = 'age10' } = req.body;
    if (!topic.trim()) {
      return res.status(400).json({ error: 'Please enter a topic or concept to explain.' });
    }
    if (topic.length > 5000) {
      return res.status(400).json({ error: 'Input is too long. Please keep it under 5,000 characters.' });
    }

    let explanation = `${topic} is a concept that can be understood by breaking it into everyday parts.`;
    let everydayExample = 'Imagine baking a cake: each ingredient has a specific purpose, just like each part of this concept.';
    let quiz = [
      { question: `What is the main purpose of ${topic.slice(0, 25)}?`, answer: 'To solve a specific problem step by step.', explanation: 'It organizes how things interact.' },
      { question: 'Why does this matter in everyday life?', answer: 'It helps explain how systems work together.', explanation: 'Observing the inputs and outputs makes it predictable.' },
      { question: 'What is one common mistake people make?', answer: 'Assuming it is too complicated without breaking it down.', explanation: 'Simplicity comes from identifying core rules.' },
    ];

    if (process.env.GEMINI_API_KEY) {
      try {
        const levelGuide =
          level === 'age10'
            ? 'Explain like teaching an inquisitive 10-year-old: simple words, playful imagery, no jargon.'
            : level === 'college'
            ? 'Explain at early college undergraduate level: rigorous principles, core trade-offs, and key mechanics.'
            : 'Explain at high school level: clear intuition, relatable everyday terms, minimal academic fluff.';

        const prompt = `You are a world-class tutor using the Feynman technique. Explain the following concept clearly.
Topic: "${topic}"
Audience Level: ${level} (${levelGuide})

Respond ONLY with valid JSON in this exact structure:
{
  "explanation": "Clear, intuitive 2-3 paragraph explanation avoiding unnecessary jargon.",
  "everydayExample": "A vivid, relatable real-world analogy or example that cements the concept.",
  "quiz": [
    {
      "question": "Question 1 testing core understanding",
      "answer": "Concise correct answer",
      "explanation": "Why this answer is correct"
    },
    {
      "question": "Question 2",
      "answer": "Answer",
      "explanation": "Explanation"
    },
    {
      "question": "Question 3",
      "answer": "Answer",
      "explanation": "Explanation"
    }
  ]
}`;

        const aiRes = await generateWithTimeout({
          model: 'gemini-3.1-flash-lite',
          contents: prompt,
          generationConfig: { responseMimeType: 'application/json' },
        });

        const raw = aiRes.candidates?.[0]?.content?.parts?.[0]?.text;
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.explanation) explanation = parsed.explanation;
          if (parsed.everydayExample) everydayExample = parsed.everydayExample;
          if (Array.isArray(parsed.quiz) && parsed.quiz.length > 0) quiz = parsed.quiz;
        }
      } catch (err) {
        console.warn('Explain simply AI fallback:', err);
      }
    }

    const formattedResult = `### Simple Explanation (${level.toUpperCase()})\n${explanation}\n\n### Everyday Analogy\n${everydayExample}\n\n### Check Your Understanding\n` +
      quiz.map((q, i) => `**Q${i + 1}: ${q.question}**\n*Answer:* ${q.answer}\n*Why:* ${q.explanation}\n`).join('\n');

    return res.json({ explanation, everydayExample, quiz, result: formattedResult });
  } catch (error) {
    console.error('Explain simply error:', error);
    return res.status(500).json({ error: "That didn't work. Try again in a moment." });
  }
});

// Dedicated Endpoint: Flashcard & Quiz Maker (H3)
app.post('/api/flashcards-quiz', rateLimiter, async (req: Request, res: Response) => {
  try {
    const { notes = '' } = req.body;
    if (!notes.trim()) {
      return res.status(400).json({ error: 'Please paste your study notes or summary.' });
    }
    if (notes.length > 6000) {
      return res.status(400).json({ error: 'Notes are too long. Please keep them under 6,000 characters.' });
    }

    let flashcards = [
      { front: 'Key Concept 1', back: 'Core definition derived from your study material.' },
      { front: 'Key Concept 2', back: 'Important formula, date, or causal relationship.' },
      { front: 'Key Concept 3', back: 'Essential contrast or differentiating factor.' },
      { front: 'Key Concept 4', back: 'Crucial application or real-world example.' },
      { front: 'Key Concept 5', back: 'Common pitfall or test trap to remember.' },
    ];
    let quiz = [
      {
        question: 'Which of the following best summarizes the main idea in your notes?',
        options: ['The foundational principle', 'An unrelated exception', 'A historical footnote', 'None of the above'],
        correctIndex: 0,
        explanation: 'The primary concept anchors all supporting details.',
      },
    ];

    if (process.env.GEMINI_API_KEY) {
      try {
        const prompt = `You are an expert cognitive learning specialist. Extract high-yield study flashcards and a multiple-choice quiz from these study notes.
Notes:
"${notes.slice(0, 4500)}"

Requirements:
1. Generate exactly 8 to 10 distinct, atomic flashcards (Front: prompt/question/term, Back: concise answer/definition).
2. Generate 4 multiple-choice quiz questions with 4 options each, indicating the 0-based correctIndex and a 1-line explanation.

Respond ONLY with valid JSON in this exact structure:
{
  "flashcards": [
    { "front": "Term or concept", "back": "Clear concise definition or explanation" }
  ],
  "quiz": [
    {
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Why Option A is correct."
    }
  ]
}`;

        const aiRes = await generateWithTimeout({
          model: 'gemini-3.1-flash-lite',
          contents: prompt,
          generationConfig: { responseMimeType: 'application/json' },
        });

        const raw = aiRes.candidates?.[0]?.content?.parts?.[0]?.text;
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed.flashcards) && parsed.flashcards.length > 0) flashcards = parsed.flashcards;
          if (Array.isArray(parsed.quiz) && parsed.quiz.length > 0) quiz = parsed.quiz;
        }
      } catch (err) {
        console.warn('Flashcards AI fallback:', err);
      }
    }

    const formattedResult = `### 10 Study Flashcards\n` +
      flashcards.map((f, i) => `**Card ${i + 1}**\nFront: ${f.front}\nBack: ${f.back}\n`).join('\n') +
      `\n### Self-Test Quiz\n` +
      quiz.map((q, i) => `**Q${i + 1}: ${q.question}**\n${q.options.map((opt, oIdx) => `  [${String.fromCharCode(65 + oIdx)}] ${opt}`).join('\n')}\n*Correct:* ${q.options[q.correctIndex]} (${q.explanation})\n`).join('\n');

    return res.json({ flashcards, quiz, result: formattedResult });
  } catch (error) {
    console.error('Flashcards quiz error:', error);
    return res.status(500).json({ error: "That didn't work. Try again in a moment." });
  }
});

// Dedicated Endpoint: Study Plan Maker (H4)
app.post('/api/study-plan', rateLimiter, async (req: Request, res: Response) => {
  try {
    const { subject = '', examDate = '', hoursPerDay = 2, totalDays = 7 } = req.body;
    if (!subject.trim()) {
      return res.status(400).json({ error: 'Please enter your subject or exam topic.' });
    }

    let planDays = Math.max(3, Math.min(30, totalDays || 7));
    let schedule = Array.from({ length: planDays }).map((_, idx) => ({
      day: `Day ${idx + 1}`,
      topic: idx === planDays - 1 ? 'Full Mock Exam & Final Review' : `Core Module ${idx + 1}: Key Topics`,
      focus: idx === planDays - 1 ? 'Timed practice under exam conditions and review missed questions' : 'Active recall note-taking and practice problems',
      duration: `${hoursPerDay} hrs`,
    }));
    let strategy = 'Use the Pomodoro technique (25 min study, 5 min rest). Spend 60% of your time solving problems rather than passively re-reading.';

    if (process.env.GEMINI_API_KEY) {
      try {
        const prompt = `You are an academic advisor. Create a realistic, high-efficiency day-by-day study schedule.
Subject/Exam: "${subject}"
Exam Date / Horizon: "${examDate || `${planDays} days from now`}"
Daily Study Time: ${hoursPerDay} hours/day
Total Days: ${planDays} days

Requirements:
- Plan exactly ${planDays} days.
- Ensure the final 1-2 days focus on mock testing, high-yield cheat sheets, and active review.
- Distribute foundational topics first, followed by application and spaced practice.

Respond ONLY with valid JSON in this exact structure:
{
  "strategy": "1-2 sentence core cognitive retention tip.",
  "schedule": [
    { "day": "Day 1", "topic": "Module Name", "focus": "Exact study tasks", "duration": "${hoursPerDay} hrs" }
  ]
}`;

        const aiRes = await generateWithTimeout({
          model: 'gemini-3.1-flash-lite',
          contents: prompt,
          generationConfig: { responseMimeType: 'application/json' },
        });

        const raw = aiRes.candidates?.[0]?.content?.parts?.[0]?.text;
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed.schedule) && parsed.schedule.length > 0) schedule = parsed.schedule;
          if (parsed.strategy) strategy = parsed.strategy;
        }
      } catch (err) {
        console.warn('Study plan AI fallback:', err);
      }
    }

    const formattedResult = `### Study Plan for ${subject}\n*Target: ${hoursPerDay} hrs/day · Horizon: ${planDays} days*\n\nStrategy: ${strategy}\n\n` +
      `| Day | Topic | Key Focus | Duration |\n|---|---|---|---|\n` +
      schedule.map(s => `| ${s.day} | ${s.topic} | ${s.focus} | ${s.duration} |`).join('\n');

    return res.json({ schedule, strategy, result: formattedResult });
  } catch (error) {
    console.error('Study plan error:', error);
    return res.status(500).json({ error: "That didn't work. Try again in a moment." });
  }
});

// Dedicated Endpoint: Cover Letter & Resume Bullets (I2)
app.post('/api/cover-letter-resume', rateLimiter, async (req: Request, res: Response) => {
  try {
    const { mode = 'cover-letter', role = '', company = '', background = '' } = req.body;
    if (!role.trim() && !background.trim()) {
      return res.status(400).json({ error: 'Please enter a target role or your background details.' });
    }
    if ((role + company + background).length > 5000) {
      return res.status(400).json({ error: 'Input is too long. Please keep it under 5,000 characters.' });
    }

    let outputText = '';
    let bullets: string[] = [];

    if (process.env.GEMINI_API_KEY) {
      try {
        const prompt = mode === 'bullets'
          ? `You are an executive resume coach. Improve the user's rough experience bullet or background into 3 stronger, high-impact resume bullets.
Target Role: "${role}"
Company (if any): "${company}"
User's Background / Rough Bullet:
"${background}"

STRICT RULES:
1. Start each bullet with a powerful past-tense action verb (e.g. Spearheaded, Engineered, Streamlined, Reduced).
2. ONLY use numbers, metrics, percentages, or achievements if the user explicitly provided them. NEVER invent false metrics or achievements.
3. Keep bullets concise (1 to 2 lines each).
4. Return valid JSON: { "bullets": ["Bullet 1", "Bullet 2", "Bullet 3"] }`
          : `You are an executive career advisor. Write a short, persuasive, authentic cover letter for this job application.
Role: "${role}"
Company: "${company || 'the hiring team'}"
Candidate Background: "${background}"

STRICT RULES:
1. 3 concise paragraphs max: Hook/Introduction, Concrete Value/Fit, Confident Closing.
2. Tone: Confident, professional, human, direct. Avoid cheesy openings like "I was thrilled to see..." or "I am writing to express my eager interest...".
3. ONLY mention skills and experiences the user provided; NEVER fabricate past roles or achievements.
4. Return valid JSON: { "letter": "Full letter text with paragraphs separated by newlines." }`;

        const aiRes = await generateWithTimeout({
          model: 'gemini-3.1-flash-lite',
          contents: prompt,
          generationConfig: { responseMimeType: 'application/json' },
        });

        const raw = aiRes.candidates?.[0]?.content?.parts?.[0]?.text;
        if (raw) {
          const parsed = JSON.parse(raw);
          if (mode === 'bullets' && Array.isArray(parsed.bullets)) {
            bullets = parsed.bullets;
            outputText = bullets.map(b => `• ${b}`).join('\n\n');
          } else if (parsed.letter) {
            outputText = parsed.letter;
          }
        }
      } catch (err) {
        console.warn('Cover letter AI fallback:', err);
      }
    }

    if (!outputText) {
      if (mode === 'bullets') {
        bullets = [
          `Spearheaded ${role || 'key initiatives'} by standardizing workflows and collaborating cross-functionally to achieve strategic delivery milestones.`,
          `Engineered scalable solutions for ${company || 'the team'}, translating requirements into actionable project deliverables.`,
          `Streamlined day-to-day operations and resolved blockers to maintain consistent project velocity and high execution standards.`,
        ];
        outputText = bullets.map(b => `• ${b}`).join('\n\n');
      } else {
        outputText = `Dear Hiring Team at ${company || 'your organization'},\n\nI am writing to apply for the ${role || 'open'} position. With my background in ${background.slice(0, 80) || 'industry operations'}, I have developed a track record of executing strategic priorities and delivering dependable results.\n\nThroughout my career, I have focused on solving complex challenges through cross-functional collaboration and meticulous attention to detail. I am confident that my practical skills and proactive approach will bring immediate value to your team.\n\nThank you for your time and consideration. I welcome the opportunity to discuss how my qualifications align with your current objectives.\n\nSincerely,\n[Your Name]`;
      }
    }

    return res.json({ result: outputText, bullets, mode });
  } catch (error) {
    console.error('Cover letter error:', error);
    return res.status(500).json({ error: "That didn't work. Try again in a moment." });
  }
});

// Dedicated Endpoint: Product Description Generator (I3)
app.post('/api/product-description', rateLimiter, async (req: Request, res: Response) => {
  try {
    const { product = '', features = '', audience = '', tone = 'persuasive' } = req.body;
    if (!product.trim()) {
      return res.status(400).json({ error: 'Please enter your product name or category.' });
    }
    if ((product + features + audience).length > 5000) {
      return res.status(400).json({ error: 'Input is too long. Please keep it under 5,000 characters.' });
    }

    let shortDesc = `${product} delivers exceptional reliability and intuitive performance designed specifically for ${audience || 'modern users'}.`;
    let longDesc = `${product} combines premium craft with everyday practicality. Built to streamline your workflow and elevate your daily routine, it solves key challenges through thoughtful engineering and durable design. Whether you are looking for peak efficiency or effortless reliability, this product stands ready to exceed expectations.`;
    let bulletPoints = [
      'Engineered for premium performance and everyday durability',
      'Thoughtful design that integrates seamlessly into your routine',
      'Optimized to save time and eliminate friction',
      'High-grade materials built for long-lasting use',
      'Backed by customer-first support and satisfaction guarantee',
    ];

    if (process.env.GEMINI_API_KEY) {
      try {
        const prompt = `You are an elite e-commerce copywriter. Write a high-converting product description suite.
Product: "${product}"
Key Features / Specs: "${features}"
Target Audience: "${audience || 'General consumers'}"
Tone: "${tone}"

Requirements:
1. shortDescription: 1-2 punchy sentences ideal for search snippets and quick above-the-fold cards (under 40 words).
2. longDescription: 2 engaging paragraphs highlighting benefits, emotional transformation, and practical utility.
3. bulletPoints: exactly 5 benefit-driven bullet points (Feature + Benefit structure).

Respond ONLY with valid JSON in this exact structure:
{
  "shortDescription": "...",
  "longDescription": "...",
  "bulletPoints": ["...", "...", "...", "...", "..."]
}`;

        const aiRes = await generateWithTimeout({
          model: 'gemini-3.1-flash-lite',
          contents: prompt,
          generationConfig: { responseMimeType: 'application/json' },
        });

        const raw = aiRes.candidates?.[0]?.content?.parts?.[0]?.text;
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.shortDescription) shortDesc = parsed.shortDescription;
          if (parsed.longDescription) longDesc = parsed.longDescription;
          if (Array.isArray(parsed.bulletPoints) && parsed.bulletPoints.length === 5) {
            bulletPoints = parsed.bulletPoints;
          }
        }
      } catch (err) {
        console.warn('Product description AI fallback:', err);
      }
    }

    const formattedResult = `### Summary\n${shortDesc}\n\n### Overview\n${longDesc}\n\n### Key Highlights\n${bulletPoints.map(b => `• ${b}`).join('\n')}`;

    return res.json({ shortDescription: shortDesc, longDescription: longDesc, bulletPoints, result: formattedResult });
  } catch (error) {
    console.error('Product description error:', error);
    return res.status(500).json({ error: "That didn't work. Try again in a moment." });
  }
});

// Dedicated Endpoint: AI Translator with Tone (I4)
app.post('/api/translator-tone', rateLimiter, async (req: Request, res: Response) => {
  try {
    const { text = '', sourceLang = 'English', targetLang = 'Spanish', tone = 'polite' } = req.body;
    if (!text.trim()) {
      return res.status(400).json({ error: 'Please enter text to translate.' });
    }
    if (text.length > 5000) {
      return res.status(400).json({ error: 'Text is too long. Please keep it under 5,000 characters.' });
    }

    let translation = `[${targetLang} translation of: ${text.slice(0, 60)}...]`;
    let toneNote = `Adapted with a ${tone} register natural for native ${targetLang} speakers.`;

    if (process.env.GEMINI_API_KEY) {
      try {
        const prompt = `You are a native bilingual translator and linguist. Translate the text with nuanced tonal awareness.
Source Language: ${sourceLang}
Target Language: ${targetLang}
Desired Tone: ${tone} (e.g. casual: conversational idioms; polite: respectful and courteous; business: professional, crisp executive tone).

Input Text:
"${text}"

Respond ONLY with valid JSON in this exact structure:
{
  "translation": "Natural, culturally fluent translation reflecting the requested tone.",
  "toneNote": "One-line honest note explaining key vocabulary or formality choices made."
}`;

        const aiRes = await generateWithTimeout({
          model: 'gemini-3.1-flash-lite',
          contents: prompt,
          generationConfig: { responseMimeType: 'application/json' },
        });

        const raw = aiRes.candidates?.[0]?.content?.parts?.[0]?.text;
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.translation) translation = parsed.translation;
          if (parsed.toneNote) toneNote = parsed.toneNote;
        }
      } catch (err) {
        console.warn('Translator AI fallback:', err);
      }
    }

    const formattedResult = `${translation}\n\n---\n*Linguistic Note:* ${toneNote}`;

    return res.json({ translation, toneNote, sourceLang, targetLang, result: formattedResult });
  } catch (error) {
    console.error('Translator error:', error);
    return res.status(500).json({ error: "That didn't work. Try again in a moment." });
  }
});

// Dedicated Endpoint: Natural Rewrite (I5)
app.post('/api/natural-rewrite', rateLimiter, async (req: Request, res: Response) => {
  try {
    const { text = '' } = req.body;
    if (!text.trim()) {
      return res.status(400).json({ error: 'Please paste your AI-assisted draft to rewrite.' });
    }
    if (text.length > 6000) {
      return res.status(400).json({ error: 'Text is too long. Please keep it under 6,000 characters.' });
    }

    const disclaimer = 'Always review and make the text your own.';
    let rewritten = text;
    let improvements = [
      'Removed repetitive transitional phrases',
      'Varied sentence lengths for natural rhythm',
      'Replaced stiff vocabulary with conversational clarity',
    ];

    if (process.env.GEMINI_API_KEY) {
      try {
        const prompt = `You are an expert human editor. Rewrite this AI-generated draft so it sounds natural, authentic, and human.
Text to edit:
"${text}"

STRICT GUIDELINES:
1. Eliminate robotic AI clichés: ban words like "delve", "tapestry", "testament to", "furthermore", "in summary", "moreover", "beacon", "game-changer", "plethora".
2. Vary sentence cadence: mix short punchy sentences with natural compound clauses.
3. Sound like an experienced human practitioner writing directly to a colleague.
4. DO NOT make any claims about bypassing AI detectors or beating plagiarism scanners.
5. Return valid JSON in this exact structure:
{
  "rewritten": "Natural human rewrite of the text.",
  "improvements": ["Specific edit 1", "Specific edit 2", "Specific edit 3"]
}`;

        const aiRes = await generateWithTimeout({
          model: 'gemini-3.1-flash-lite',
          contents: prompt,
          generationConfig: { responseMimeType: 'application/json' },
        });

        const raw = aiRes.candidates?.[0]?.content?.parts?.[0]?.text;
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.rewritten) rewritten = parsed.rewritten;
          if (Array.isArray(parsed.improvements) && parsed.improvements.length > 0) {
            improvements = parsed.improvements;
          }
        }
      } catch (err) {
        console.warn('Natural rewrite AI fallback:', err);
      }
    }

    const formattedResult = `${rewritten}\n\n---\n*Editorial Note:* ${disclaimer}\n\nKey Edits:\n${improvements.map(i => `• ${i}`).join('\n')}`;

    return res.json({ rewritten, improvements, disclaimer, result: formattedResult });
  } catch (error) {
    console.error('Natural rewrite error:', error);
    return res.status(500).json({ error: "That didn't work. Try again in a moment." });
  }
});

// Dedicated Endpoint: M1 Android Automation Recipe Generator
app.post('/api/android-automation', rateLimiter, async (req: Request, res: Response) => {
  try {
    const { description = '', appType = 'MacroDroid' } = req.body;

    if (!description || description.trim().length < 3) {
      return res.status(400).json({ error: 'Please enter what you want your phone to automate.' });
    }

    if (description.length > 1000) {
      return res.status(400).json({ error: 'Input is too long. Please keep it under 1,000 characters.' });
    }

    let recipeName = `${appType} Recipe: ${description.slice(0, 40)}`;
    let trigger = 'Wi-Fi Connected / Disconnected or Time Trigger';
    let actions = [
      'Set Do Not Disturb (DND) or Volume Stream to 0%',
      'Display notification: "Work Mode Active"',
    ];
    let constraints = ['Only on Weekdays (Mon-Fri)'];
    let permissions = [
      'Do Not Disturb access (Notification Policy)',
      'Location / Nearby Wi-Fi Devices permission (required by Android for SSID detection)',
    ];
    let summary = `This automation configures ${appType} to automate device state based on your conditions.`;

    if (process.env.GEMINI_API_KEY) {
      try {
        const prompt = `You are a certified Android automation engineer specializing in Tasker and MacroDroid.
User Request: "${description}"
Target Application: ${appType}

Generate an accurate, feasible automation recipe matching modern Android 13/14/15 capabilities.
Do NOT suggest private root actions if standard Android permissions suffice.
Return strictly valid JSON:
{
  "recipeName": "Brief descriptive title",
  "trigger": "Exact trigger name in ${appType} (e.g. Wi-Fi Connected, Geofence, Time, Battery)",
  "actions": ["Step 1 in ${appType}", "Step 2 in ${appType}"],
  "constraints": ["Optional condition 1", "Optional condition 2"],
  "permissions": ["Required Android permission 1", "Required Android permission 2"],
  "summary": "Plain English summary of what this automation accomplishes"
}`;

        const aiRes = await generateWithTimeout({
          model: 'gemini-2.5-flash',
          contents: prompt,
          generationConfig: { responseMimeType: 'application/json' },
        });

        const raw = aiRes.candidates?.[0]?.content?.parts?.[0]?.text;
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.recipeName) recipeName = parsed.recipeName;
          if (parsed.trigger) trigger = parsed.trigger;
          if (Array.isArray(parsed.actions) && parsed.actions.length > 0) actions = parsed.actions;
          if (Array.isArray(parsed.constraints)) constraints = parsed.constraints;
          if (Array.isArray(parsed.permissions) && parsed.permissions.length > 0) permissions = parsed.permissions;
          if (parsed.summary) summary = parsed.summary;
        }
      } catch (err) {
        console.warn('Android automation AI fallback:', err);
      }
    }

    const formattedResult = `### ${recipeName} (${appType})\n\n${summary}\n\n**1. TRIGGER:**\n• ${trigger}\n\n**2. ACTIONS (In Order):**\n${actions.map((a, i) => `${i + 1}. ${a}`).join('\n')}\n\n${constraints.length > 0 ? `**3. CONSTRAINTS / CONDITIONS:**\n${constraints.map(c => `• ${c}`).join('\n')}\n\n` : ''}**REQUIRED ANDROID PERMISSIONS:**\n${permissions.map(p => `• ${p}`).join('\n')}\n\n*Note: Menus and names can vary by app version.*`;

    return res.json({
      recipeName,
      appType,
      trigger,
      actions,
      constraints,
      permissions,
      summary,
      result: formattedResult,
    });
  } catch (error) {
    console.error('Android automation error:', error);
    return res.status(500).json({ error: "That didn't work. Try again in a moment." });
  }
});

// Dedicated Endpoint: M2 AutoHotkey Script Generator
app.post('/api/autohotkey-script', rateLimiter, async (req: Request, res: Response) => {
  try {
    const { description = '' } = req.body;

    if (!description || description.trim().length < 3) {
      return res.status(400).json({ error: 'Please describe the hotkey or automation you want.' });
    }

    if (description.length > 1000) {
      return res.status(400).json({ error: 'Input is too long. Please keep it under 1,000 characters.' });
    }

    // Strict Safety Check: Refuse keyloggers, surveillance, credential theft, security evasion
    const disallowedPatterns = [
      /\bkeylog/i,
      /\bpassword\s*stealer/i,
      /\bsteal\s*credential/i,
      /\bcredential\s*harvest/i,
      /\bstealth\s*record/i,
      /\bspy\b/i,
      /\banti[\s-]*cheat\s*bypass/i,
      /\bbypass\s*security/i,
      /\btoken\s*grab/i,
      /\bhidden\s*surveillance/i,
    ];

    if (disallowedPatterns.some(pattern => pattern.test(description))) {
      return res.status(400).json({
        error:
          'I cannot generate scripts intended for keylogging, credential harvesting, hidden surveillance, or security evasion. I can help create hotkeys for everyday productivity, text expansion, window management, or gaming shortcuts.',
      });
    }

    let script = `; AutoHotkey v2 Script
; Read it before you run it.
#Requires AutoHotkey v2.0+

; Hotkey: Ctrl + Alt + E
^!e::
{
    SendInput("user@example.com")
}
`;
    let explanation = [
      '#Requires AutoHotkey v2.0+ ensures the script runs in modern AutoHotkey v2 syntax.',
      '^!e defines the hotkey triggers: ^ is Control, ! is Alt, and e is the letter key.',
      'SendInput instantly types your text into whichever field currently has keyboard focus.',
    ];
    let howToRun = [
      'Install AutoHotkey v2 from the official website (autohotkey.com).',
      'Right-click your Windows desktop > New > AutoHotkey Script.',
      'Right-click the newly created .ahk file > Edit Script, paste this code, and save.',
      'Double-click the .ahk file to run it. An "H" icon will appear in your Windows taskbar notification tray.',
    ];

    if (process.env.GEMINI_API_KEY) {
      try {
        const prompt = `You are a senior Windows automation engineer specializing in AutoHotkey v2.
User Request: "${description}"

Rules:
1. Generate valid, modern AutoHotkey v2 syntax (#Requires AutoHotkey v2.0+). Do NOT use legacy v1 syntax.
2. Refuse any harmful, stealth, or credential-stealing requests.
3. Every script must include the comment: "; Read it before you run it."
4. Provide a line-by-line explanation and standard instructions on how to run it.

Return strictly valid JSON:
{
  "script": "Complete .ahk v2 code string",
  "explanation": ["Explanation of line 1", "Explanation of line 2"],
  "howToRun": ["Step 1", "Step 2", "Step 3"]
}`;

        const aiRes = await generateWithTimeout({
          model: 'gemini-2.5-flash',
          contents: prompt,
          generationConfig: { responseMimeType: 'application/json' },
        });

        const raw = aiRes.candidates?.[0]?.content?.parts?.[0]?.text;
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.script) script = parsed.script;
          if (Array.isArray(parsed.explanation) && parsed.explanation.length > 0) explanation = parsed.explanation;
          if (Array.isArray(parsed.howToRun) && parsed.howToRun.length > 0) howToRun = parsed.howToRun;
        }
      } catch (err) {
        console.warn('AutoHotkey AI fallback:', err);
      }
    }

    const formattedResult = `${script}\n\n---\n**Line-by-Line Explanation:**\n${explanation.map(e => `• ${e}`).join('\n')}\n\n**How to Run It:**\n${howToRun.map((h, i) => `${i + 1}. ${h}`).join('\n')}\n\n*Notice: Read it before you run it.*`;

    return res.json({
      script,
      explanation,
      howToRun,
      safetyNotice: 'Read it before you run it.',
      result: formattedResult,
    });
  } catch (error) {
    console.error('AutoHotkey script error:', error);
    return res.status(500).json({ error: "That didn't work. Try again in a moment." });
  }
});

// Dedicated Endpoint: Command Explainer (AI)
app.post('/api/command-explainer', rateLimiter, async (req: Request, res: Response) => {
  try {
    const { command = '', environment = 'auto' } = req.body;
    const cleanCmd = String(command).trim();

    if (!cleanCmd) {
      return res.status(400).json({ error: 'Please enter a command to explain.' });
    }

    if (cleanCmd.length > 1000) {
      return res.status(400).json({ error: 'Command exceeds the 1,000 character limit.' });
    }

    let whatItDoes = `This command executes "${cleanCmd}" in the ${environment === 'auto' ? 'terminal shell' : environment} environment.`;
    let breakdown: Array<{ part: string; meaning: string }> = [
      { part: cleanCmd.split(' ')[0] || cleanCmd, meaning: 'The base command or executable invoked.' },
    ];
    let riskRating: 'Safe' | 'Caution' | 'Dangerous' = 'Safe';
    let riskReason = 'This command queries information or performs a standard non-destructive operation.';
    let saferAlternative: string | null = null;

    const lower = cleanCmd.toLowerCase();
    if (
      lower.includes('rm -rf /') ||
      lower.includes('mkfs') ||
      lower.includes('dd if=') ||
      lower.includes('format c:') ||
      lower.includes('wipefs') ||
      lower.includes(':(){ :|:& };:') ||
      lower.includes('chmod -r 777 /')
    ) {
      riskRating = 'Dangerous';
      riskReason = 'Contains destructive patterns capable of erasing entire disks, wiping critical system files, or crashing the OS.';
      saferAlternative = 'Inspect files with ls or find first, or use a trash CLI utility like trash-put instead of unrecoverable recursive deletion.';
    } else if (
      lower.includes('rm ') ||
      lower.includes('sudo ') ||
      lower.includes('del /') ||
      lower.includes('drop database') ||
      lower.includes('kill -9') ||
      lower.includes('reboot') ||
      lower.includes('poweroff') ||
      lower.includes('fastboot flash')
    ) {
      riskRating = 'Caution';
      riskReason = 'Modifies system state, terminates processes, or removes files without a recycle bin.';
      saferAlternative = 'Verify the exact target path first with an interactive flag (such as rm -i) or run without elevated privileges if possible.';
    }

    if (process.env.GEMINI_API_KEY) {
      try {
        const prompt = `You are a principal systems administrator and security researcher.
User pasted command: "${cleanCmd}"
Target environment: ${environment}

Analyze the command and provide:
1. whatItDoes: A plain-English explanation of what this command does, written at an accessible level (no jargon without quick clarification).
2. breakdown: An array of objects each having "part" (e.g. binary name, flags, subcommands, target arguments, pipes) and "meaning" (plain explanation of what that exact flag or parameter instructs the system to do).
3. riskRating: Exactly one of "Safe", "Caution", or "Dangerous".
   - Safe: Read-only, inspection, status queries (e.g. ls, cat, ping, git status, Get-Process, uname).
   - Caution: System modifications, software installations, elevated permissions, or overwriting specific files (e.g. sudo apt install, chmod, npm i -g, restarting services).
   - Dangerous: Recursive data deletion, disk formatting, partition wiping, arbitrary remote script piping (curl | bash), or unrecoverable system destruction.
4. riskReason: Plain-English explanation of why this risk rating was assigned.
5. saferAlternative: A safer variation (e.g. adding -i for interactive confirmation, using --dry-run, running on a test directory first, or quoting variables), or null if the command is already safe.

Rules:
- NEVER execute or attempt to execute the command.
- Always include the safety reminder "Read it before you run it."
- Limit your breakdown to the actual components of the command provided.

Return strictly valid JSON:
{
  "whatItDoes": "...",
  "breakdown": [
    {"part": "command_part", "meaning": "..."},
    {"part": "flag", "meaning": "..."}
  ],
  "riskRating": "Safe",
  "riskReason": "...",
  "saferAlternative": "..."
}`;

        const aiRes = await generateWithTimeout({
          model: 'gemini-2.5-flash',
          contents: prompt,
          generationConfig: { responseMimeType: 'application/json' },
        });

        const raw = aiRes.candidates?.[0]?.content?.parts?.[0]?.text;
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.whatItDoes) whatItDoes = parsed.whatItDoes;
          if (Array.isArray(parsed.breakdown) && parsed.breakdown.length > 0) breakdown = parsed.breakdown;
          if (['Safe', 'Caution', 'Dangerous'].includes(parsed.riskRating)) riskRating = parsed.riskRating;
          if (parsed.riskReason) riskReason = parsed.riskReason;
          if (parsed.saferAlternative !== undefined) saferAlternative = parsed.saferAlternative;
        }
      } catch (err) {
        console.warn('Command Explainer AI fallback:', err);
      }
    }

    const formattedResult = `### Command Overview\n${whatItDoes}\n\n**Risk Level:** ${riskRating}\n${riskReason}\n\n---\n**Part-by-Part Breakdown:**\n${breakdown.map(b => `• \`${b.part}\`: ${b.meaning}`).join('\n')}${saferAlternative ? `\n\n---\n**Safer Alternative:**\n\`${saferAlternative}\`` : ''}\n\n*Notice: Read it before you run it.*`;

    return res.json({
      whatItDoes,
      breakdown,
      riskRating,
      riskReason,
      saferAlternative,
      safetyNotice: 'Read it before you run it.',
      result: formattedResult,
    });
  } catch (error) {
    console.error('Command explainer error:', error);
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
  const httpServer = http.createServer(app);

  if (process.env.NODE_ENV !== 'production') {
    const isHmrDisabled = process.env.DISABLE_HMR === 'true';
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: isHmrDisabled ? false : { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`SmartToolHub server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
