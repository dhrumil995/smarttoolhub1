import { GuideMeta } from '../types/navigation.ts';

export interface GuideArticle {
  slug: string;
  title: string;
  summary: string;
  readTime: string;
  lastUpdated: string;
  author: string;
  relatedToolSlug: string;
  relatedToolName: string;
  sections: Array<{
    heading: string;
    body: string[];
    callout?: string;
  }>;
}

export const GUIDE_ARTICLES: Record<string, GuideArticle> = {
  'build-first-iphone-shortcut': {
    slug: 'build-first-iphone-shortcut',
    title: 'How to Build Your First iPhone Shortcut in Under 3 Minutes',
    summary: 'A step-by-step walkthrough of creating automated morning routines and photo actions using Apple Shortcuts.',
    readTime: '3 min read',
    lastUpdated: 'October 2026',
    author: 'Dhrumil Aslaliya',
    relatedToolSlug: 'apple-shortcuts-generator',
    relatedToolName: 'Apple Shortcuts Generator',
    sections: [
      {
        heading: 'Why build Apple Shortcuts?',
        body: [
          'If you do the same taps on your iPhone every single day — like checking traffic, turning down your brightness at bedtime, or texting your arrival time — Apple Shortcuts can save you minutes every single day.',
          'The native Shortcuts app comes pre-installed on every iPhone running iOS 14 or later. You do not need to know any programming. You simply link visual building blocks together like digital Lego.',
        ],
      },
      {
        heading: 'Step 1: Open the Shortcuts App',
        body: [
          'Find the Shortcuts app on your iPhone or swipe down on your Home Screen and search for "Shortcuts".',
          'Tap the "+" icon in the top right corner to create a blank canvas. Tap the title at the top to give your shortcut a memorable name like "Heading Home" or "Morning Briefing".',
        ],
        callout: 'Tip: Tap the icon next to the title to pick a custom symbol and color that stands out on your Home Screen.',
      },
      {
        heading: 'Step 2: Add Your First Action',
        body: [
          'Tap the blue "Add Action" button at the center of the screen.',
          'Search for "Get Travel Time". Tap it to add it to your shortcut. Set the end location to "Home".',
          'Next, search for "Send Message". Shortcuts will automatically link the travel time calculation into the text of the message! Choose who to send it to (e.g., your partner or roommate).',
        ],
      },
      {
        heading: 'Step 3: Test and Add to Your Home Screen',
        body: [
          'Tap the Play button in the bottom right corner to test your shortcut. Your iPhone will calculate the driving time and draft the text.',
          'Once it works, tap the share icon at the bottom and choose "Add to Home Screen". Now, one tap triggers the entire sequence.',
        ],
      },
    ],
  },
  'better-prompts-simple-rules': {
    slug: 'better-prompts-simple-rules',
    title: 'How to Get Exact AI Answers with 3 Simple Prompt Rules',
    summary: 'Stop getting generic answers. Learn how context, role, and output format change everything.',
    readTime: '4 min read',
    lastUpdated: 'October 2026',
    author: 'Dhrumil Aslaliya',
    relatedToolSlug: 'ai-prompt-improver',
    relatedToolName: 'AI Prompt Improver',
    sections: [
      {
        heading: 'The Problem with Short Prompts',
        body: [
          'When you ask an AI model something brief like "write a workout plan", the AI has to guess everything: your fitness level, how much time you have, what equipment is in your room, and your physical goals.',
          'Because it has to guess, it averages all the workout plans on the internet. You end up with a boring, generic list that doesn\'t fit your life.',
        ],
      },
      {
        heading: 'Rule 1: Give the AI a Persona and Context',
        body: [
          'Start by telling the model who it is and who you are.',
          'For example: "You are an experienced physical therapist. I am a 34-year-old desk worker with mild lower back tightness and only 20 minutes before work."',
        ],
        callout: 'Adding context takes 10 seconds of typing but improves the output quality by 500%.',
      },
      {
        heading: 'Rule 2: Set Negative Constraints',
        body: [
          'Negative constraints tell the AI what NOT to do. This prevents corporate buzzwords, excessive length, or irrelevant advice.',
          'Examples of strong negative constraints: "Do not recommend gym machines; bodyweight only", "No introduction paragraph", or "Keep the total response under 150 words".',
        ],
      },
      {
        heading: 'Rule 3: Demand a Specific Output Format',
        body: [
          'Always state how you want the answer organized. Do you want a Markdown table, numbered steps, or quick bullets?',
          'When you specify: "Format as a 3-column table: Exercise, Reps, and Form Tip", you get a clean reference you can screenshot and use immediately.',
        ],
      },
    ],
  },
  'spreadsheet-formulas-plain-english': {
    slug: 'spreadsheet-formulas-plain-english',
    title: 'Convert Plain English Questions into Excel and Sheets Formulas',
    summary: 'How to describe lookups, date calculations, and conditionals without memorizing syntax.',
    readTime: '3 min read',
    lastUpdated: 'October 2026',
    author: 'Dhrumil Aslaliya',
    relatedToolSlug: 'formula-helper',
    relatedToolName: 'Excel & Sheets Formula Helper',
    sections: [
      {
        heading: 'Stop Memorizing Function Names',
        body: [
          'Spreadsheets are powerful, but memorizing whether to use VLOOKUP, INDEX/MATCH, XLOOKUP, or FILTER can give anyone a headache.',
          'Modern formula design is about describing the relationship between your columns. When you know how to state your question, AI tools can generate the exact formula in 3 seconds.',
        ],
      },
      {
        heading: 'How to Describe Your Columns Clearly',
        body: [
          'Always state the column letters and what they contain.',
          'Instead of asking "How do I match customer names?", ask: "Column A has Customer IDs and Column B has Customer Names. In Column F, I have an ID in cell F2. What formula returns the name from Column B?"',
          'Notice how specific that is! The AI can immediately write: =XLOOKUP(F2, A:A, B:B, "Not found").',
        ],
      },
      {
        heading: 'Handling Multi-Condition Calculations',
        body: [
          'If you need to sum or count based on two conditions, always name the conditions in order.',
          'Example: "Sum Column D (Sales) where Column C is \'West Coast\' and Column E is \'Shipped\'". This immediately gives you a clean =SUMIFS formula.',
        ],
        callout: 'Pro-Tip: Always wrap lookups in =IFERROR(..., "") to prevent ugly #N/A errors when data is missing.',
      },
    ],
  },
};

export const POPULAR_GUIDES: GuideMeta[] = Object.values(GUIDE_ARTICLES);
