import React from 'react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';

interface SummarizerPageProps {
  navigate: (path: string) => void;
}

export const SummarizerPage: React.FC<SummarizerPageProps> = ({ navigate }) => {
  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'ai-summarizer') || LAUNCH_TOOLS[3];
  const relatedTools = LAUNCH_TOOLS.filter((t) => t.slug === 'rewrite-tone-changer' || t.slug === 'ai-prompt-improver');
  const relatedGuide = POPULAR_GUIDES.find((g) => g.slug === 'better-prompts-simple-rules') || POPULAR_GUIDES[1];

  return (
    <ToolPageTemplate
      tool={tool}
      heading="AI Text Summarizer"
      subheading="Turn long articles, meeting transcripts, reports, or messy notes into a quick 30-second brief with executive takeaways and action items."
      inputLabel="Paste text or article to summarize"
      inputPlaceholder="Paste article paragraphs, meeting notes, research summaries, or emails..."
      examplePrompt="Artificial intelligence models rely on transformer architecture introduced in 2017. Transformers process entire sequences simultaneously rather than word-by-word, drastically speeding up training on large clusters of GPUs. This allows models to capture long-range dependencies across thousands of tokens, enabling breakthroughs in code generation, language translation, and reasoning tasks. However, training requires substantial electrical power, high-bandwidth memory, and specialized datacenter infrastructure."
      generateButtonText="Summarize in Seconds"
      lastUpdated="October 2026"
      navigate={navigate}
      whatItDoesContent={
        <>
          <p>
            The AI Summarizer distills complex, lengthy documents down to their vital essence without dropping crucial numbers, facts, or deadlines.
          </p>
          <p>
            Instead of reading 2,000 words to find two action points, you get an instant 1-sentence bottom line followed by 3 to 5 digestible bullet points and identified next steps. It is designed specifically for reading on phones while commuting or moving between meetings.
          </p>
        </>
      }
      howToUseSteps={[
        {
          step: 'Paste your source text',
          text: 'Copy text from a news article, PDF, email chain, or meeting transcript and paste it into the box.',
        },
        {
          step: 'Generate the summary',
          text: 'Tap the button to extract the core ideas, key statistics, and takeaways in under 5 seconds.',
        },
        {
          step: 'Copy or share with your team',
          text: 'Grab the bullet points to forward to colleagues in Slack, Teams, or your notes app.',
        },
      ]}
      workedExample={{
        title: 'Example: Meeting Transcript Summary',
        scenario: 'Team sprint retro discussion about slow QA cycles and new automated testing roadmap.',
        output: `### One-Sentence Bottom Line:
The engineering team will introduce automated regression suites next sprint to resolve QA bottlenecks and cut release cycles from 4 days to 24 hours.

### Key Takeaways:
- **Core Bottleneck:** Manual regression testing is causing 60% of release delays.
- **Action Plan:** Two engineers (Alex and Mia) will dedicate next week to building automated Playwright end-to-end tests.
- **Target Goal:** Shorten QA verification cycle from 4 days down to under 24 hours by mid-November.
- **Budget Approval:** Engineering leadership approved $200/month for cloud test runners.`,
      }}
      tips={[
        'Paste plain text: Strip out unnecessary headers, disclaimers, or legal footers for faster, cleaner results.',
        'Include raw data: The summarizer excels at extracting numbers, dates, and percentages.',
        'Use for study notes: Paste textbook excerpts to generate quick flashcard review points.',
        'Specify focus if needed: Add a note at the top like "(Focus on financial figures)" if you only care about metrics.',
      ]}
      faq={[
        {
          question: 'What is the maximum text length I can paste?',
          answer: 'You can paste up to 2,500 characters per run on the free tier, which easily covers typical articles, emails, and meeting transcripts.',
        },
        {
          question: 'Does the summarizer preserve factual numbers?',
          answer: 'Yes. The prompt strictly instructs the AI not to invent or round critical dates, dollar figures, or quantities.',
        },
        {
          question: 'Can I summarize articles written in languages other than English?',
          answer: 'Yes. The tool automatically detects non-English text and summarizes it either in the original language or in English upon request.',
        },
        {
          question: 'Can I use this for academic papers?',
          answer: 'Yes. It quickly pulls out the research hypothesis, methodology, results, and limitations.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
