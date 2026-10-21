import React, { useState } from 'react';
import { ArrowLeftRight, Copy, Check, Globe, Sparkles, MessageSquareQuote } from 'lucide-react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';
import { Button } from '../../components/ui/Button.tsx';

interface TranslatorTonePageProps {
  navigate: (path: string) => void;
}

const SUPPORTED_LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Italian',
  'Portuguese',
  'Japanese',
  'Korean',
  'Chinese (Simplified)',
  'Dutch',
  'Hindi',
  'Arabic',
];

export const TranslatorTonePage: React.FC<TranslatorTonePageProps> = ({ navigate }) => {
  const [sourceLang, setSourceLang] = useState<string>('English');
  const [targetLang, setTargetLang] = useState<string>('Spanish');
  const [tone, setTone] = useState<'casual' | 'polite' | 'business'>('polite');

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'ai-translator-tone') || LAUNCH_TOOLS[23];
  const relatedTools = LAUNCH_TOOLS.filter((t) => t.slug === 'natural-rewrite' || t.slug === 'rewrite-tone-changer');
  const relatedGuide = POPULAR_GUIDES.find((g) => g.slug === 'better-prompts-simple-rules') || POPULAR_GUIDES[0];

  const exampleChips = [
    'Business email to German client regarding project deliverables',
    'Casual weekend greeting to a friend in Tokyo in conversational Japanese',
    'Polite formal inquiry to French hotel asking about late check-in options',
  ];

  const [textToTranslate, setTextToTranslate] = useState<string>(
    'Thank you for your partnership on this release. We are preparing the quarterly project deliverables and will send the final summary for your review on Friday.'
  );

  const handleChipClick = (chip: string) => {
    if (chip.includes('German client')) {
      setSourceLang('English');
      setTargetLang('German');
      setTone('business');
      setTextToTranslate('Thank you for your partnership on this release. We are preparing the quarterly project deliverables and will send the final summary for your review on Friday.');
    } else if (chip.includes('conversational Japanese')) {
      setSourceLang('English');
      setTargetLang('Japanese');
      setTone('casual');
      setTextToTranslate('Hey! Let\'s catch up this weekend. Are you free to grab ramen around Shibuya on Saturday afternoon?');
    } else {
      setSourceLang('English');
      setTargetLang('French');
      setTone('polite');
      setTextToTranslate('Good afternoon. Could you please confirm if late check-in is possible for our reservation tomorrow? Our flight arrives around 11 PM.');
    }
  };

  const handleSwapLanguages = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
  };

  return (
    <ToolPageTemplate
      tool={tool}
      heading="AI Translator with Tone"
      subheading="Translate messages across 12 languages with culturally accurate tonal nuance. Choose between everyday casual conversation, respectful polite correspondence, or crisp executive business registers."
      inputLabel={`Original Text (${sourceLang})`}
      inputPlaceholder="Type or paste the sentences, email, or message you want translated..."
      examplePrompt={textToTranslate}
      exampleChips={exampleChips}
      generateButtonText={`Translate to ${targetLang} (${tone})`}
      apiEndpoint="/api/translator-tone"
      requestPayload={(input) => ({
        text: input,
        sourceLang,
        targetLang,
        tone,
      })}
      lastUpdated="October 2026"
      navigate={navigate}
      extraControls={
        <div className="space-y-4 pt-1">
          {/* Language Selection & Swap Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-full sm:flex-1 space-y-1">
              <label className="text-xs font-mono uppercase text-[#8fa3c0]">
                Source Language
              </label>
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="w-full bg-[#0a1424] border border-[rgba(143,163,192,0.2)] rounded-xl px-3 py-2 text-xs text-[#f2f7ff] focus-ring"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-4 sm:pt-4">
              <button
                type="button"
                onClick={handleSwapLanguages}
                className="p-2.5 rounded-xl bg-[#101c33] border border-[rgba(143,163,192,0.2)] text-[#8fa3c0] hover:text-[#f472d0] hover:border-[rgba(244, 114, 208,0.3)] transition-all focus-ring flex items-center justify-center gap-1.5 text-xs font-mono"
                title="Swap source and target languages"
                aria-label="Swap source and target languages"
              >
                <ArrowLeftRight size={15} />
                <span className="sm:hidden">Swap</span>
              </button>
            </div>

            <div className="w-full sm:flex-1 space-y-1">
              <label className="text-xs font-mono uppercase text-[#8fa3c0]">
                Target Language
              </label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full bg-[#0a1424] border border-[rgba(143,163,192,0.2)] rounded-xl px-3 py-2 text-xs text-[#f2f7ff] focus-ring"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tone Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase text-[#8fa3c0]">
              Tone & Register
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTone('casual')}
                className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all focus-ring text-center ${
                  tone === 'casual'
                    ? 'bg-[#101c33] border-[rgba(244, 114, 208,0.4)] text-[#f472d0] shadow-sm'
                    : 'bg-[#0a1424] border-[rgba(143,163,192,0.16)] text-[#8fa3c0] hover:text-[#f2f7ff]'
                }`}
              >
                <div className="font-bold">Casual</div>
                <div className="text-[10px] opacity-75">Friends & chat</div>
              </button>
              <button
                type="button"
                onClick={() => setTone('polite')}
                className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all focus-ring text-center ${
                  tone === 'polite'
                    ? 'bg-[#101c33] border-[rgba(244, 114, 208,0.4)] text-[#f472d0] shadow-sm'
                    : 'bg-[#0a1424] border-[rgba(143,163,192,0.16)] text-[#8fa3c0] hover:text-[#f2f7ff]'
                }`}
              >
                <div className="font-bold">Polite</div>
                <div className="text-[10px] opacity-75">Service & hotels</div>
              </button>
              <button
                type="button"
                onClick={() => setTone('business')}
                className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all focus-ring text-center ${
                  tone === 'business'
                    ? 'bg-[#101c33] border-[rgba(244, 114, 208,0.4)] text-[#f472d0] shadow-sm'
                    : 'bg-[#0a1424] border-[rgba(143,163,192,0.16)] text-[#8fa3c0] hover:text-[#f2f7ff]'
                }`}
              >
                <div className="font-bold">Business</div>
                <div className="text-[10px] opacity-75">Clients & proposals</div>
              </button>
            </div>
          </div>
        </div>
      }
      customResultRenderer={({ result, rawData, onCopy, copied }) => {
        const translation: string = rawData?.translation || result;
        const toneNote: string = rawData?.toneNote || '';
        const target: string = rawData?.targetLang || targetLang;

        return (
          <div className="space-y-4">
            <div className="p-5 sm:p-6 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase text-[#f472d0] font-bold">
                    {target} ({tone} register)
                  </span>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onCopy(translation)}
                  className="text-xs gap-1.5"
                >
                  <Copy size={14} />
                  <span>{copied ? 'Copied' : 'Copy Translation'}</span>
                </Button>
              </div>

              <div className="text-sm sm:text-base text-[#f2f7ff] leading-relaxed p-4 rounded-xl bg-[#101c33] border border-[rgba(143,163,192,0.14)] whitespace-pre-wrap select-all">
                {translation}
              </div>

              {toneNote && (
                <div className="p-3.5 rounded-xl bg-[#0a1424] border border-[rgba(244, 114, 208,0.25)] flex items-start gap-2.5 text-xs text-[#f472d0]">
                  <MessageSquareQuote size={16} className="shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold uppercase tracking-wider block text-[10px] text-[#f472d0]/80 mb-0.5">
                      Tone & Cultural Adaptation Note
                    </span>
                    <span className="text-[#f2f7ff] font-medium leading-relaxed">
                      {toneNote}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      }}
      whatItDoesContent={
        <div className="space-y-3">
          <p>
            Standard machine translators treat words as isolated mathematical tokens, frequently stumbling over subtle honorifics, formal vs. informal pronouns (such as <em>tu</em> vs. <em>vous</em> in French, or <em>du</em> vs. <em>Sie</em> in German), and culturally respectful business idioms.
          </p>
          <p>
            The <strong>AI Translator with Tone</strong> allows you to specify the exact social register of your communication. Whether you need a warm, casual greeting for messaging a friend in Tokyo, a respectful courteous inquiry to a European hotelier, or an executive-ready business email to an international client, the engine selects the natural idiomatic phrasing native speakers actually use.
          </p>
          <p>
            Every translation includes a concise one-line linguistic note explaining why specific grammar choices, pronoun levels, or vocabulary words were selected, helping you learn cultural conventions as you communicate.
          </p>
        </div>
      }
      howToUseSteps={[
        {
          step: 'Select Source and Target Languages',
          text: 'Pick your source language and destination language. Use the Swap button to instantly reverse directions when continuing a conversation.',
        },
        {
          step: 'Select Desired Tone Register',
          text: 'Choose Casual (everyday slang, friendly warmth), Polite (courteous standard hospitality), or Business (crisp corporate professionalism).',
        },
        {
          step: 'Translate and Inspect Linguistic Note',
          text: 'Generate your nuanced translation and review the linguistic explanation clarifying how cultural nuances were applied.',
        },
      ]}
      workedExample={{
        title: 'Formal Accounts Payable Inquiry in German',
        scenario: 'Draft input in English: "Could you please check if our contract invoice has been paid? We need to finalize the quarterly books by Friday."',
        output: 'Dürften wir höflich anfragen, ob unsere Vertragsrechnung bereits beglichen wurde? Wir müssen die Quartalsabschlüsse bis Freitag finalisieren.\n\nLinguistic Note: Rendered using the formal German "Sie/Ihre" honorific and courteous subjunctive "Dürften wir anfragen" suited for European accounts receivable correspondence.',
      }}
      tips={[
        'When writing in German or French, "Polite" tone guarantees the formal "Sie" or "Vous" pronoun sets respectively.',
        'In Japanese, "Casual" applies conversational plain form (da/ta), while "Polite" uses polite desu/masu verbs.',
        'The quick Swap button keeps your current draft so you can instantly translate responses back into your native language.',
      ]}
      faq={[
        {
          question: 'How is this different from generic search translators?',
          answer: 'Standard machine translation defaults to a single rigid, often overly literal tone. This tool understands social hierarchy, honorifics, and corporate conventions across cultures, and explains its vocabulary choices in a transparent note.',
        },
        {
          question: 'Are my translated messages stored or shared?',
          answer: 'No. Input text is processed strictly to generate the translation and is never stored on disk, logged, or used to build user profiles.',
        },
        {
          question: 'Can I swap languages to read incoming replies?',
          answer: 'Yes! Tap the Swap button between the language dropdowns to immediately reverse your source and target settings for bidirectional conversation.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
