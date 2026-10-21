import React, { useEffect } from 'react';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { GUIDE_ARTICLES } from '../../data/guides.ts';

interface MetaManagerProps {
  currentPath: string;
}

export const MetaManager: React.FC<MetaManagerProps> = ({ currentPath }) => {
  useEffect(() => {
    let title = 'SmartToolHub - Free Everyday AI Tools';
    let description = 'Free AI tools that just work. No sign-up. Results in seconds. Fast Apple Shortcuts generator, prompt improver, email writer, and formulas.';
    let schemaJson: any = null;

    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://smarttoolhub.net';
    const canonicalUrl = `${origin}${currentPath}`;
    const socialImage = `${origin}/og-image.svg`;

    // 1. Homepage
    if (currentPath === '/') {
      title = 'SmartToolHub - Free Everyday AI Tools (No Sign-Up)';
      description = 'Free AI tools that just work. No sign-up. Results in seconds. Apple Shortcuts generator, prompt improver, formula helper, and everyday utilities.';
      schemaJson = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': `${origin}/#organization`,
            'name': 'SmartToolHub',
            'url': origin,
            'logo': `${origin}/icon.svg`,
            'founder': {
              '@type': 'Person',
              'name': 'Dhrumil Aslaliya',
            },
            'sameAs': ['https://smarttoolhub.net'],
          },
          {
            '@type': 'WebSite',
            '@id': `${origin}/#website`,
            'url': origin,
            'name': 'SmartToolHub',
            'description': 'Free AI tools that just work. No sign-up. Results in seconds.',
            'publisher': {
              '@id': `${origin}/#organization`,
            },
          },
        ],
      };
    }

    // 2. Tools Hub
    else if (currentPath === '/tools') {
      title = 'All AI Tools - Free Everyday Utilities | SmartToolHub';
      description = 'Explore 8 free everyday AI tools with no sign-up. Generate Apple Shortcuts, polish prompts, write emails, and calculate spreadsheet formulas in seconds.';
      schemaJson = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': origin },
          { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': `${origin}/tools` },
        ],
      };
    }

    // 3. Apple Shortcuts Generator
    else if (currentPath === '/tools/apple-shortcuts-generator') {
      title = 'Apple Shortcuts Generator - Free iOS Automations';
      description = 'Turn automation ideas into step-by-step iOS Shortcuts instructions. Connect Maps, Messages, and apps in under 2 minutes. 100% free with no sign-up.';
      schemaJson = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebApplication',
            'name': 'Apple Shortcuts Generator',
            'applicationCategory': 'UtilitiesApplication',
            'operatingSystem': 'iOS, iPadOS, macOS',
            'url': canonicalUrl,
            'description': 'Converts automation descriptions into step-by-step Apple Shortcuts action recipes.',
            'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
            'creator': { '@type': 'Person', 'name': 'Dhrumil Aslaliya' },
          },
          {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': origin },
              { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': `${origin}/tools` },
              { '@type': 'ListItem', 'position': 3, 'name': 'Apple Shortcuts Generator', 'item': canonicalUrl },
            ],
          },
          {
            '@type': 'FAQPage',
            'mainEntity': [
              {
                '@type': 'Question',
                'name': 'Do I need a Mac or a computer to use this?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'No. Everything runs directly on your iPhone or iPad. The generated steps are designed for the native iOS Shortcuts app that is already installed on your device.',
                },
              },
              {
                '@type': 'Question',
                'name': 'Can this shortcut run automatically without me tapping it?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'Yes. In the iOS Shortcuts app, tap the "Automation" tab at the bottom, select "Create Personal Automation", choose a trigger, and select "Run Shortcut".',
                },
              },
            ],
          },
        ],
      };
    }

    // 3b. AI Email Writer
    else if (currentPath === '/tools/ai-email-writer') {
      title = 'AI Email Writer - Draft Clear Emails Fast';
      description = 'Write clear, polite emails with high-converting subject lines in seconds. Choose from 4 tones, add bullet points, and copy ready-to-send drafts for free.';
      schemaJson = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebApplication',
            'name': 'AI Email Writer',
            'applicationCategory': 'BusinessApplication',
            'url': canonicalUrl,
            'description': 'Drafts polite, clear emails with custom subject lines and tones in seconds.',
            'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
            'creator': { '@type': 'Person', 'name': 'Dhrumil Aslaliya' },
          },
          {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': origin },
              { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': `${origin}/tools` },
              { '@type': 'ListItem', 'position': 3, 'name': 'AI Email Writer', 'item': canonicalUrl },
            ],
          },
          {
            '@type': 'FAQPage',
            'mainEntity': [
              {
                '@type': 'Question',
                'name': 'What does the "Make it shorter" button do?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'It condenses your generated email down to under 70 words by removing pleasantries and wordy clauses while keeping the subject line, main request, and call to action intact.',
                },
              },
              {
                '@type': 'Question',
                'name': 'Are my email drafts saved on your servers?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'No. Your inputs and generated emails are processed securely in real time and are never stored on our database or shared with third parties.',
                },
              },
              {
                '@type': 'Question',
                'name': 'Can I write emails in languages other than English?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'Yes. Enter your purpose and bullet points in Spanish, French, German, Japanese, or any language you prefer, and the tool will draft the email in that language.',
                },
              },
              {
                '@type': 'Question',
                'name': 'How do the four tones differ from one another?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'Friendly is warm and approachable. Formal is polite and executive. Short cuts straight to the facts. Firm is confident and direct when holding boundaries or chasing deliverables.',
                },
              },
            ],
          },
        ],
      };
    }

    // 3c. AI Summarizer
    else if (currentPath === '/tools/ai-summarizer') {
      title = 'AI Summarizer - Condense Long Text in Seconds';
      description = 'Summarize long articles, meeting notes, transcripts, or reports into 3 clear sentences and 5 bullet points. Fast, free, private, and no account needed.';
      schemaJson = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebApplication',
            'name': 'AI Summarizer',
            'applicationCategory': 'UtilitiesApplication',
            'url': canonicalUrl,
            'description': 'Condenses long articles, transcripts, and notes into 3-sentence summaries and key points.',
            'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
            'creator': { '@type': 'Person', 'name': 'Dhrumil Aslaliya' },
          },
          {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': origin },
              { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': `${origin}/tools` },
              { '@type': 'ListItem', 'position': 3, 'name': 'AI Summarizer', 'item': canonicalUrl },
            ],
          },
          {
            '@type': 'FAQPage',
            'mainEntity': [
              {
                '@type': 'Question',
                'name': 'What is the difference between Short and Medium mode?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'Short mode keeps sentences tight and produces brief one-line bullet points. Medium mode provides richer context around background reasons and next steps.',
                },
              },
              {
                '@type': 'Question',
                'name': 'How long can the pasted text be?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'You can paste up to 4,000 characters at once, which comfortably covers articles, email chains, and typical meeting transcripts.',
                },
              },
              {
                '@type': 'Question',
                'name': 'Does the tool make up facts if the text is incomplete?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'No. The AI model is strictly instructed to only summarize information explicitly found in your pasted text, preventing hallucinated numbers or false claims.',
                },
              },
              {
                '@type': 'Question',
                'name': 'Are my pasted articles or private notes saved anywhere?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'No. Everything is processed ephemerally through our server API and is never recorded, saved in a database, or used to train models.',
                },
              },
            ],
          },
        ],
      };
    }

    // 3d. Rewrite and Tone Changer
    else if (currentPath === '/tools/rewrite-tone-changer') {
      title = 'Rewrite & Tone Changer - Polish Your Words Fast';
      description = 'Rewrite awkward messages to sound friendlier, more formal, shorter, or simpler. See an instant before-and-after view with zero fluff and total privacy.';
      schemaJson = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebApplication',
            'name': 'Rewrite and Tone Changer',
            'applicationCategory': 'UtilitiesApplication',
            'url': canonicalUrl,
            'description': 'Rewrites sentences to sound friendlier, more formal, shorter, or simpler.',
            'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
            'creator': { '@type': 'Person', 'name': 'Dhrumil Aslaliya' },
          },
          {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': origin },
              { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': `${origin}/tools` },
              { '@type': 'ListItem', 'position': 3, 'name': 'Rewrite and Tone Changer', 'item': canonicalUrl },
            ],
          },
          {
            '@type': 'FAQPage',
            'mainEntity': [
              {
                '@type': 'Question',
                'name': 'Does this change what my message actually means?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'No. The AI is instructed to preserve 100% of your facts, dates, commitments, and core intent. Only the vocabulary, rhythm, and sentence structure are refined.',
                },
              },
              {
                '@type': 'Question',
                'name': 'How does the Before and After view help me?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'It lets you compare your original draft side-by-side with the new phrasing and review the character count so you can be confident your message strikes the right chord.',
                },
              },
              {
                '@type': 'Question',
                'name': 'Which tone should I use for asking for a favor?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'The Friendlier tone works best. It softens direct commands into helpful requests, which makes people far more willing to help you quickly.',
                },
              },
              {
                '@type': 'Question',
                'name': 'Are my private messages or emails stored on your server?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'No. SmartToolHub operates with an ephemeral architecture. Your text is processed in memory to generate the rewrite and is immediately discarded.',
                },
              },
            ],
          },
        ],
      };
    }

    // 3e. Caption and Hashtag Generator
    else if (currentPath === '/tools/caption-hashtag-generator') {
      title = 'Caption & Hashtag Generator - High Reach Ideas';
      description = 'Create 5 catchy social media captions and 15 high-reach hashtags for Instagram, TikTok, LinkedIn, and X. Free, instant, and no login required.';
      schemaJson = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebApplication',
            'name': 'Caption and Hashtag Generator',
            'applicationCategory': 'UtilitiesApplication',
            'url': canonicalUrl,
            'description': 'Turn any topic into 5 engaging social captions and 15 curated high-reach hashtags.',
            'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
            'creator': { '@type': 'Person', 'name': 'Dhrumil Aslaliya' },
          },
          {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': origin },
              { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': `${origin}/tools` },
              { '@type': 'ListItem', 'position': 3, 'name': 'Caption and Hashtag Generator', 'item': canonicalUrl },
            ],
          },
          {
            '@type': 'FAQPage',
            'mainEntity': [
              {
                '@type': 'Question',
                'name': 'How many hashtags should I use on Instagram and TikTok?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'Current social media algorithms favor 5 to 15 targeted, accurate hashtags rather than 30 spammy tags. Our tool produces 15 high-relevance tags so you can paste them all or pick your top 10.',
                },
              },
              {
                '@type': 'Question',
                'name': 'Can I generate professional captions for LinkedIn?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'Yes. Simply tap the LinkedIn platform button. The tool adjusts sentence structure, removes unnecessary slang, and highlights professional insights and clear discussions.',
                },
              },
              {
                '@type': 'Question',
                'name': 'Are emojis included in the generated captions?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'The tool uses 1 to 2 tasteful emojis that match the mood you selected. You can easily delete or replace them before posting.',
                },
              },
              {
                '@type': 'Question',
                'name': 'Is this caption generator free to use?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'Yes. You can generate unlimited captions and hashtags with no account, no credits, and no subscription fees.',
                },
              },
            ],
          },
        ],
      };
    }

    // 3f. Social Bio Generator
    else if (currentPath === '/tools/social-bio-generator') {
      title = 'Social Bio Generator - Catchy Profile Bios Fast';
      description = 'Craft 4 engaging profile bios for Twitter/X, Instagram, TikTok, and LinkedIn in seconds. Includes character counters and instant one-tap copy.';
      schemaJson = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebApplication',
            'name': 'Social Bio Generator',
            'applicationCategory': 'UtilitiesApplication',
            'url': canonicalUrl,
            'description': 'Craft 4 compelling profile bios with character counters for Instagram, X, and LinkedIn.',
            'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
            'creator': { '@type': 'Person', 'name': 'Dhrumil Aslaliya' },
          },
          {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': origin },
              { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': `${origin}/tools` },
              { '@type': 'ListItem', 'position': 3, 'name': 'Social Bio Generator', 'item': canonicalUrl },
            ],
          },
          {
            '@type': 'FAQPage',
            'mainEntity': [
              {
                '@type': 'Question',
                'name': 'What are the character limits for bios on different platforms?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'Twitter/X allows 160 characters, Instagram allows 150 characters, TikTok allows 80 characters, and LinkedIn allows 220 characters for your headline. Our generator enforces these limits automatically.',
                },
              },
              {
                '@type': 'Question',
                'name': 'Can I include emojis in my generated bio?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'Yes. The generator includes 1 to 2 tasteful emojis that fit your industry. You can easily remove or adjust them before saving your profile.',
                },
              },
              {
                '@type': 'Question',
                'name': 'How do I pick between the four generated styles?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'Choose Minimalist if you want a clean look, Creator if you share tips and build an audience, Professional if you are pitching freelance clients, or Casual for personal accounts.',
                },
              },
              {
                '@type': 'Question',
                'name': 'Is my personal information stored anywhere?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'No. The bio generator processes your input in real time and does not save your profile details, name, or interests to any database.',
                },
              },
            ],
          },
        ],
      };
    }

    // 3g. Title and Headline Generator
    else if (currentPath === '/tools/title-headline-generator') {
      title = 'Headline Generator - 10 Catchy Blog & Video Titles';
      description = 'Generate 10 high-converting headlines for blog articles, YouTube videos, and product pages. Compare proven hook styles with instant one-tap copy.';
      schemaJson = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebApplication',
            'name': 'Title and Headline Generator',
            'applicationCategory': 'UtilitiesApplication',
            'url': canonicalUrl,
            'description': 'Generate 10 catchy, click-worthy headlines for blog posts, YouTube videos, and products.',
            'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
            'creator': { '@type': 'Person', 'name': 'Dhrumil Aslaliya' },
          },
          {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': origin },
              { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': `${origin}/tools` },
              { '@type': 'ListItem', 'position': 3, 'name': 'Title and Headline Generator', 'item': canonicalUrl },
            ],
          },
          {
            '@type': 'FAQPage',
            'mainEntity': [
              {
                '@type': 'Question',
                'name': 'Are these headlines optimized for Google SEO?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'Yes. The generator ensures the primary keyword appears near the front of the headline while keeping total character length under 60 to 70 characters so search engines do not truncate it.',
                },
              },
              {
                '@type': 'Question',
                'name': 'What makes YouTube titles different from blog titles?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'YouTube titles prioritize immediate emotional curiosity and fast comprehension on mobile devices, while blog titles focus more on keyword clarity and reader promise.',
                },
              },
              {
                '@type': 'Question',
                'name': 'Can I generate headlines for eCommerce product pages?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'Yes. Select the "Product Pages" button. The tool creates high-converting value proposition headers designed to explain the key benefit to shoppers instantly.',
                },
              },
              {
                '@type': 'Question',
                'name': 'Is there a limit on how many titles I can generate?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'No. The Title and Headline Generator is completely free with no usage caps, credits, or account requirements.',
                },
              },
            ],
          },
        ],
      };
    }

    // 3h. AI Prompt Improver
    else if (currentPath === '/tools/ai-prompt-improver') {
      title = 'AI Prompt Improver - Structure & Optimize Prompts';
      description = 'Transform rough prompts into structured, high-performing instructions with clear roles, rules, and examples. Free prompt engineering tool with no sign-up.';
      schemaJson = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebApplication',
            'name': 'AI Prompt Improver',
            'applicationCategory': 'UtilitiesApplication',
            'url': canonicalUrl,
            'description': 'Paste a rough prompt and get a structured, high-performing version with role and rules.',
            'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
            'creator': { '@type': 'Person', 'name': 'Dhrumil Aslaliya' },
          },
          {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': origin },
              { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': `${origin}/tools` },
              { '@type': 'ListItem', 'position': 3, 'name': 'AI Prompt Improver', 'item': canonicalUrl },
            ],
          },
          {
            '@type': 'FAQPage',
            'mainEntity': [
              {
                '@type': 'Question',
                'name': 'Does this improved prompt work across all AI models?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'Yes. The structure follows universal prompt engineering standards that work reliably on ChatGPT, Claude 3.5 Sonnet, Google Gemini, and open-source models.',
                },
              },
              {
                '@type': 'Question',
                'name': 'Why do short prompts often produce disappointing AI responses?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'When you give an AI a short prompt without constraints, it fills in the missing context with statistical averages. Adding persona, boundaries, and formatting requirements forces it to focus on your specific situation.',
                },
              },
              {
                '@type': 'Question',
                'name': 'Can I edit the prompt before running it?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'Yes. The output is plain text. Simply copy it into your clipboard and tweak any bracketed placeholders or requirements as needed.',
                },
              },
              {
                '@type': 'Question',
                'name': 'Are my private prompts recorded or stored?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'No. SmartToolHub operates with an ephemeral memory model. Your text is processed in real time and is never saved to a database or used for training.',
                },
              },
            ],
          },
        ],
      };
    }

    // 3i. Formula Helper
    else if (currentPath === '/tools/formula-helper') {
      title = 'Formula Helper - Excel & Google Sheets AI Formulas';
      description = 'Describe what you want to calculate in plain English. Get instant, error-free Excel and Google Sheets formulas with plain explanations and practical examples.';
      schemaJson = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebApplication',
            'name': 'Excel & Sheets Formula Helper',
            'applicationCategory': 'UtilitiesApplication',
            'url': canonicalUrl,
            'description': 'Describe what you want to calculate and receive the exact spreadsheet formula.',
            'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
            'creator': { '@type': 'Person', 'name': 'Dhrumil Aslaliya' },
          },
          {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': origin },
              { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': `${origin}/tools` },
              { '@type': 'ListItem', 'position': 3, 'name': 'Formula Helper', 'item': canonicalUrl },
            ],
          },
          {
            '@type': 'FAQPage',
            'mainEntity': [
              {
                '@type': 'Question',
                'name': 'Does this formula work in both Google Sheets and Microsoft Excel?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'Yes. Unless specified otherwise, formulas are written using universal modern spreadsheet syntax compatible with Excel 365, Excel 2021+, and Google Sheets.',
                },
              },
              {
                '@type': 'Question',
                'name': 'Why should I use XLOOKUP instead of VLOOKUP?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'XLOOKUP is faster, searches in any direction (including looking to the left of the lookup key), and does not require counting column numbers, making your spreadsheets far less prone to breaking.',
                },
              },
              {
                '@type': 'Question',
                'name': 'What should I do if my formula returns a #VALUE! error?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'Check that your numbers are not stored as text, and verify that all range sizes match (for example, using D2:D100 with E2:E100 rather than different lengths).',
                },
              },
              {
                '@type': 'Question',
                'name': 'Is my spreadsheet data sent to your server?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'No spreadsheet files or actual personal row data are ever uploaded. You only enter the description of the columns and the calculation you want.',
                },
              },
            ],
          },
        ],
      };
    }

    // 3j. Meeting Notes to Action Items
    else if (currentPath === '/tools/meeting-notes-action-items') {
      title = 'Meeting Notes to Action Items - Extract Tasks Fast';
      description = 'Turn raw meeting notes or transcripts into executive summaries, key decisions, and assigned action items with owners and deadlines. Free, instant, and private.';
      schemaJson = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebApplication',
            'name': 'Meeting Notes to Action Items',
            'applicationCategory': 'UtilitiesApplication',
            'url': canonicalUrl,
            'description': 'Turn messy meeting notes into a concise summary, key decisions, and assigned action items.',
            'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
            'creator': { '@type': 'Person', 'name': 'Dhrumil Aslaliya' },
          },
          {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': origin },
              { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': `${origin}/tools` },
              { '@type': 'ListItem', 'position': 3, 'name': 'Meeting Notes to Action Items', 'item': canonicalUrl },
            ],
          },
          {
            '@type': 'FAQPage',
            'mainEntity': [
              {
                '@type': 'Question',
                'name': 'What if someone in the meeting is not assigned a specific task?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'If an action item has no clear person named, the tool tags the owner as "Unassigned" so your team can assign it during follow-up.',
                },
              },
              {
                '@type': 'Question',
                'name': 'Can I paste transcripts from Zoom or Google Meet?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'Yes. You can paste raw text transcripts directly into the box. The tool filters out conversational filler and extracts only key takeaways and tasks.',
                },
              },
              {
                '@type': 'Question',
                'name': 'How are priority levels (High, Medium, Low) determined?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'Tasks with same-day deadlines or blocking dependencies are marked High, near-term weekly tasks are marked Medium, and general follow-ups are marked Low.',
                },
              },
              {
                '@type': 'Question',
                'name': 'Are my confidential company meeting notes safe?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'Yes. All text is processed transiently in memory without being recorded to a database or used to train public language models.',
                },
              },
            ],
          },
        ],
      };
    }

    // 3k. Retina Image Size Calculator
    else if (currentPath === '/tools/retina-image-size-calculator') {
      title = 'Retina Image Size Calculator - @1x @2x @3x Pixels';
      description = 'Convert design points into @1x, @2x, and @3x pixel dimensions for iOS, iPadOS, and Retina displays. Instant HTML srcset snippet and zero blur.';
      schemaJson = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebApplication',
            'name': 'Retina Image Size Calculator',
            'applicationCategory': 'UtilitiesApplication',
            'url': canonicalUrl,
            'description': 'Calculate crisp @1x, @2x, and @3x pixel dimensions from points for iOS and web graphics.',
            'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
            'creator': { '@type': 'Person', 'name': 'Dhrumil Aslaliya' },
          },
          {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': origin },
              { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': `${origin}/tools` },
              { '@type': 'ListItem', 'position': 3, 'name': 'Retina Image Size Calculator', 'item': canonicalUrl },
            ],
          },
          {
            '@type': 'FAQPage',
            'mainEntity': [
              {
                '@type': 'Question',
                'name': 'What is the difference between a point (pt) and a pixel (px)?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'A point is an abstract unit of physical distance on a screen that stays roughly the same physical size to the human eye, whereas a pixel is an actual hardware light emitter. On a Retina screen, 1 point contains 4 pixels (@2x) or 9 pixels (@3x).',
                },
              },
              {
                '@type': 'Question',
                'name': 'Which Apple devices use @3x assets?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'All modern flagship iPhones with OLED screens use @3x, including iPhone 16 Pro, iPhone 16, iPhone 15 series, iPhone 14 Pro, iPhone 13 Pro, and iPhone Plus models. iPads and MacBooks primarily use @2x.',
                },
              },
              {
                '@type': 'Question',
                'name': 'Can I just export @3x and let the browser scale it down?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'While browsers can downscale images, loading a massive @3x image on a mobile cellular connection wastes user data and slows down page speed. Providing responsive @1x, @2x, and @3x via srcset is the recommended best practice.',
                },
              },
              {
                '@type': 'Question',
                'name': 'Does this calculator run on my device or on a server?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'All calculations run directly in your web browser. No measurements or image data are sent to any server.',
                },
              },
            ],
          },
        ],
      };
    }

    // 3l. iPhone Charging Time Calculator
    else if (currentPath === '/tools/iphone-charging-time-calculator') {
      title = 'iPhone Charging Time Calculator - Accurate Fast Charge';
      description = 'Calculate realistic iPhone charging times based on battery mAh, charger wattage, and phone speed limits. Includes fast-charge and trickle-charge curves.';
      schemaJson = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebApplication',
            'name': 'iPhone Charging Time Calculator',
            'applicationCategory': 'UtilitiesApplication',
            'url': canonicalUrl,
            'description': 'Calculate exact iPhone charge time from battery mAh, charger watts, and phone max rate.',
            'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
            'creator': { '@type': 'Person', 'name': 'Dhrumil Aslaliya' },
          },
          {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': origin },
              { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': `${origin}/tools` },
              { '@type': 'ListItem', 'position': 3, 'name': 'iPhone Charging Time Calculator', 'item': canonicalUrl },
            ],
          },
          {
            '@type': 'FAQPage',
            'mainEntity': [
              {
                '@type': 'Question',
                'name': 'Does using a fast charger ruin my iPhone battery health?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'No. Modern iPhones feature intelligent Power Delivery management that throttles speed when the battery warms up. Setting the 80% limit in iOS 18+ is the most effective way to keep your battery healthy.',
                },
              },
              {
                '@type': 'Question',
                'name': 'Can I use a MacBook or iPad charger for my iPhone?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'Yes. Apple USB-C chargers (from 30W to 140W) negotiate safe voltages via the USB-PD standard. Your iPhone will safely draw its maximum rate without danger of overcharging.',
                },
              },
              {
                '@type': 'Question',
                'name': 'Why does charging slow down so much after 80%?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'Lithium-ion cells experience high resistance and heat when almost full. iOS automatically switches to trickle charging to avoid damaging the internal electrolyte and preserve battery longevity.',
                },
              },
              {
                '@type': 'Question',
                'name': 'Is wireless MagSafe charging as fast as a cable?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'MagSafe charges at up to 15W to 25W on newer models, but because wireless charging generates more ambient heat, thermal throttling usually makes it about 20% to 30% slower than a direct USB-C cable.',
                },
              },
            ],
          },
        ],
      };
    }

    // 3m. File Transfer Time Calculator
    else if (currentPath === '/tools/file-transfer-time-calculator') {
      title = 'File Transfer Time Calculator - Honest Real Speeds';
      description = 'Calculate realistic transfer times for AirDrop, USB-C 3.2, Lightning, Wi-Fi, and 5G. Compare honest real-world transfer speeds without theoretical fluff.';
      schemaJson = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebApplication',
            'name': 'File Transfer Time Calculator',
            'applicationCategory': 'UtilitiesApplication',
            'url': canonicalUrl,
            'description': 'Calculate realistic transfer times for AirDrop, USB-C, Wi-Fi, and 5G with honest speeds.',
            'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
            'creator': { '@type': 'Person', 'name': 'Dhrumil Aslaliya' },
          },
          {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': origin },
              { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': `${origin}/tools` },
              { '@type': 'ListItem', 'position': 3, 'name': 'File Transfer Time Calculator', 'item': canonicalUrl },
            ],
          },
          {
            '@type': 'FAQPage',
            'mainEntity': [
              {
                '@type': 'Question',
                'name': 'Why is real-world transfer speed slower than the rated cable speed?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'Rated speeds (like 10 Gbps) describe maximum raw signalling bandwidth. After accounting for USB encoding overhead, file system metadata, and target SSD sustained write speeds, real-world speeds typically hover around 900 to 1,000 MB/s.',
                },
              },
              {
                '@type': 'Question',
                'name': 'Does the cable included in the iPhone box support high-speed transfers?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'No. The cable included in the box is designed primarily for charging and runs at USB 2.0 speeds (up to 480 Mbps). To achieve 10 Gbps on an iPhone 15 Pro or 16 Pro, you must purchase a USB 3.2 Gen 2 or Thunderbolt cable.',
                },
              },
              {
                '@type': 'Question',
                'name': 'Is AirDrop faster than a standard Lightning cable?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'Yes! AirDrop over Wi-Fi 6 routinely achieves sustained speeds of 60 to 80 MB/s, which is more than double the ~35 MB/s maximum speed of a physical Lightning cable.',
                },
              },
              {
                '@type': 'Question',
                'name': 'Are my file names or directory details stored anywhere?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'No files or file names are ever uploaded to a server. All calculations run strictly in your browser using local mathematical formulas.',
                },
              },
            ],
          },
        ],
      };
    }

    // 4. Other Tools
    else if (currentPath.startsWith('/tools/')) {
      const slug = currentPath.replace('/tools/', '');
      const tool = LAUNCH_TOOLS.find((t) => t.slug === slug);
      if (tool) {
        title = `${tool.name} - Free AI Utility | SmartToolHub`;
        description = `${tool.description.slice(0, 145)}. 100% free everyday AI tool with instant results and zero registration.`;
        schemaJson = {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'WebApplication',
              'name': tool.name,
              'applicationCategory': 'UtilitiesApplication',
              'url': canonicalUrl,
              'description': tool.description,
              'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
            },
            {
              '@type': 'BreadcrumbList',
              'itemListElement': [
                { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': origin },
                { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': `${origin}/tools` },
                { '@type': 'ListItem', 'position': 3, 'name': tool.name, 'item': canonicalUrl },
              ],
            },
          ],
        };
      }
    }

    // 5. Guides
    else if (currentPath === '/guides') {
      title = 'How-To Guides & Tutorials | SmartToolHub';
      description = 'Practical step-by-step guides by Dhrumil Aslaliya on iPhone shortcuts, prompt optimization, and spreadsheet formula creation in plain English.';
      schemaJson = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': origin },
          { '@type': 'ListItem', 'position': 2, 'name': 'Guides', 'item': `${origin}/guides` },
        ],
      };
    }

    // 6. Guide Details
    else if (currentPath.startsWith('/guides/')) {
      const slug = currentPath.replace('/guides/', '');
      const guide = GUIDE_ARTICLES[slug];
      if (guide) {
        title = `${guide.title.slice(0, 48)} | SmartToolHub`;
        description = `${guide.summary.slice(0, 148)} Practical guide by ${guide.author}.`;
        schemaJson = {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Article',
              'headline': guide.title,
              'description': guide.summary,
              'author': {
                '@type': 'Person',
                'name': guide.author,
                'url': `${origin}/about`,
              },
              'datePublished': '2026-10-01',
              'dateModified': '2026-10-14',
              'publisher': {
                '@type': 'Organization',
                'name': 'SmartToolHub',
                'logo': { '@type': 'ImageObject', 'url': `${origin}/icon.svg` },
              },
            },
            {
              '@type': 'BreadcrumbList',
              'itemListElement': [
                { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': origin },
                { '@type': 'ListItem', 'position': 2, 'name': 'Guides', 'item': `${origin}/guides` },
                { '@type': 'ListItem', 'position': 3, 'name': guide.title, 'item': canonicalUrl },
              ],
            },
          ],
        };
      }
    }

    // 7. About
    else if (currentPath === '/about') {
      title = 'About SmartToolHub & Dhrumil Aslaliya | Independent Tools';
      description = 'SmartToolHub is an independent website of free everyday AI tools built by Dhrumil Aslaliya. No accounts, fast sub-30-second utility, and honest privacy.';
      schemaJson = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': origin },
          { '@type': 'ListItem', 'position': 2, 'name': 'About', 'item': canonicalUrl },
        ],
      };
    }

    // 8. Contact
    else if (currentPath === '/contact') {
      title = 'Contact SmartToolHub - Feedback & Tool Requests';
      description = 'Have feedback or a tool idea? Contact creator Dhrumil Aslaliya directly. We read and respond to every message within 24 to 48 hours.';
    }

    // 9. Privacy
    else if (currentPath === '/privacy') {
      title = 'Privacy Policy - Zero Tracking & Ephemeral AI | SmartToolHub';
      description = 'Plain-English privacy policy. Your prompts are processed securely and never stored, sold, or logged. No accounts required to use any tool.';
    }

    // 10. Terms
    else if (currentPath === '/terms') {
      title = 'Terms of Service - Fair Use & Disclaimers | SmartToolHub';
      description = 'Simple terms of service for SmartToolHub. Free usage terms, AI output verification reminder, and trademark independence disclosures.';
    }

    // 11. Pricing
    else if (currentPath === '/pricing') {
      title = 'Pricing & Pro Upgrade - 100% Free Tools | SmartToolHub';
      description = 'All tools are free forever. Optional Pro plan for power users wanting higher caps and zero ads via secure hosted checkout.';
    }

    // 12. Dynamic Tool Fallback for all tools in LAUNCH_TOOLS
    else if (currentPath.startsWith('/tools/')) {
      const toolSlug = currentPath.replace('/tools/', '').split('?')[0].split('#')[0];
      const matchedTool = LAUNCH_TOOLS.find((t) => t.slug === toolSlug);
      if (matchedTool) {
        title = `${matchedTool.name} - Free Utility | SmartToolHub`;
        description = `${matchedTool.description} Free with no sign-up. Fast, private on-device utility.`;
        schemaJson = {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'WebApplication',
              'name': matchedTool.name,
              'applicationCategory': 'UtilitiesApplication',
              'operatingSystem': 'iOS, iPadOS, macOS, Web',
              'url': canonicalUrl,
              'description': matchedTool.description,
              'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
              'creator': { '@type': 'Person', 'name': 'Dhrumil Aslaliya' },
            },
            {
              '@type': 'BreadcrumbList',
              'itemListElement': [
                { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': origin },
                { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': `${origin}/tools` },
                { '@type': 'ListItem', 'position': 3, 'name': matchedTool.name, 'item': canonicalUrl },
              ],
            },
          ],
        };
      }
    }

    // Apply document title
    document.title = title;

    // Helper to set or create meta tag
    const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:image', socialImage);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', socialImage);

    // Set canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // Inject JSON-LD
    let scriptTag = document.getElementById('schema-jsonld') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'schema-jsonld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    if (schemaJson) {
      scriptTag.textContent = JSON.stringify(schemaJson);
    } else {
      scriptTag.textContent = '';
    }
  }, [currentPath]);

  return null;
};
