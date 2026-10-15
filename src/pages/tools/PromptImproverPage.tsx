import React from 'react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';

interface PromptImproverPageProps {
  navigate: (path: string) => void;
}

export const PromptImproverPage: React.FC<PromptImproverPageProps> = ({ navigate }) => {
  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'ai-prompt-improver') || LAUNCH_TOOLS[1];
  const relatedTools = LAUNCH_TOOLS.filter((t) => t.slug === 'apple-shortcuts-generator' || t.slug === 'rewrite-tone-changer');
  const relatedGuide = POPULAR_GUIDES.find((g) => g.slug === 'better-prompts-simple-rules') || POPULAR_GUIDES[1];

  return (
    <ToolPageTemplate
      tool={tool}
      heading="AI Prompt Improver"
      subheading="Paste a rough thought or one-line request. Get an expertly structured prompt with clear persona, background context, rules, and expected output format."
      inputLabel="Paste your rough prompt here"
      inputPlaceholder="e.g. Write a workout plan for someone who is busy and only has 30 minutes..."
      examplePrompt="Give me marketing ideas for my local coffee shop to get more college students during finals week."
      generateButtonText="Improve & Structure Prompt"
      lastUpdated="October 2026"
      navigate={navigate}
      whatItDoesContent={
        <>
          <p>
            The AI Prompt Improver transforms quick, vague requests into comprehensive, high-context instructions that give you significantly better responses in any AI tool (including ChatGPT, Claude, and Gemini).
          </p>
          <p>
            Most AI outputs fail because prompts lack constraints: they don't define the audience, format, or boundaries. This tool automatically inserts role definitions, constraints (length, reading level, tone), and structured output sections so you get actionable answers on the very first try.
          </p>
        </>
      }
      howToUseSteps={[
        {
          step: 'Paste your raw draft',
          text: 'Enter whatever is in your head, whether it is a single sentence or messy bullet points.',
        },
        {
          step: 'Receive the structured prompt',
          text: 'Get an upgraded prompt divided into Persona, Task, Context, Constraints, and Output Format.',
        },
        {
          step: 'Copy and send to any AI',
          text: 'Tap Copy and paste the polished prompt into ChatGPT, Claude, or your favorite AI platform.',
        },
      ]}
      workedExample={{
        title: 'Example: Enhancing a Vague Business Prompt',
        scenario: 'Draft email to customer who is unhappy about delayed shipping.',
        output: `### Upgraded Prompt:
"You are a Senior Customer Relations Specialist known for empathetic, de-escalating communication.

Context: A customer ordered an item 7 business days ago, but unexpected warehouse delays have postponed delivery by an additional 3 days.

Task: Write a sincere, professional update email addressing the delay.

Requirements:
- Acknowledge the frustration upfront without making excuses.
- Clearly state the revised delivery date (provide placeholder [New Date]).
- Offer a concrete goodwill gesture (e.g., 15% discount on their next order via code [PROMO15]).
- Keep the length under 180 words.
- Maintain a warm, accountable, and reassuring tone.
- Close with a direct contact line for questions."`,
      }}
      tips={[
        'Mention the target audience: Telling the AI who the response is for (e.g. beginners, executives, 10-year-olds) radically improves clarity.',
        'Specify negative constraints: Say what NOT to include (e.g. "Do not use corporate jargon" or "No introduction paragraph").',
        'Ask for specific formatting: Tell the AI if you want bullet points, a table, or a numbered checklist.',
        'Provide a word or paragraph cap: Keep responses punchy by specifying maximum lengths.',
      ]}
      faq={[
        {
          question: 'Does this improved prompt work on all AI models?',
          answer: 'Yes. The structure follows universal prompt design best practices that work reliably across ChatGPT (GPT-4o), Claude 3.5 Sonnet, Google Gemini, and open-source models.',
        },
        {
          question: 'Why do short prompts produce generic answers?',
          answer: 'When an AI model does not have constraints, it guesses average values. By defining the role, goal, and tone, you force the model to focus on your exact scenario.',
        },
        {
          question: 'Can I edit the generated prompt before using it?',
          answer: 'Yes. The result is plain text. Simply copy it into your clipboard and adjust any bracketed placeholders like [Brand Name] or [Target Date] as needed.',
        },
        {
          question: 'Is my prompt data private?',
          answer: 'Yes. Your text is processed in real time and is never stored, sold, or added to training datasets.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
