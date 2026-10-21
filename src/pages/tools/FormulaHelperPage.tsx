import React, { useState } from 'react';
import { Sigma, Copy, Check, FileSpreadsheet, Lightbulb } from 'lucide-react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';

interface FormulaHelperPageProps {
  navigate: (path: string) => void;
}

export const FormulaHelperPage: React.FC<FormulaHelperPageProps> = ({ navigate }) => {
  const [app, setApp] = useState<'Excel' | 'Sheets'>('Excel');
  const [copiedFormulaOnly, setCopiedFormulaOnly] = useState(false);

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'formula-helper') || LAUNCH_TOOLS[7];
  const relatedTools = LAUNCH_TOOLS.filter((t) => t.slug === 'ai-prompt-improver' || t.slug === 'meeting-notes-action-items');
  const relatedGuide = POPULAR_GUIDES.find((g) => g.slug === 'spreadsheet-formulas-plain-english') || POPULAR_GUIDES[2];

  const appOptions: Array<{ id: 'Excel' | 'Sheets'; label: string; desc: string }> = [
    { id: 'Excel', label: 'Microsoft Excel', desc: 'Excel 365, 2021, and modern desktop' },
    { id: 'Sheets', label: 'Google Sheets', desc: 'Browser-based Google Drive spreadsheets' },
  ];

  const exampleChips = [
    'Sum values in column D only if column E equals "Completed" and column B date is in 2026.',
    'Lookup customer email in column C by matching Customer ID in column A with cell F2 using XLOOKUP.',
    'Calculate percentage change between baseline cost in column B and new cost in column C, showing negative values in brackets.',
  ];

  return (
    <ToolPageTemplate
      tool={tool}
      heading="Excel & Google Sheets Formula Helper"
      subheading="Describe what you want to calculate, lookup, or extract in plain English. Get the exact spreadsheet formula with a clear breakdown and a practical example."
      inputLabel="Describe your spreadsheet calculation"
      inputPlaceholder="e.g. Find employee email in column C by matching their Employee ID in column A with cell F2..."
      examplePrompt={exampleChips[0]}
      exampleChips={exampleChips}
      generateButtonText="Generate Spreadsheet Formula"
      lastUpdated="October 2026"
      navigate={navigate}
      apiEndpoint="/api/formula-helper"
      requestPayload={(task) => ({
        task,
        app,
      })}
      extraControls={
        <div className="space-y-4 pt-1">
          {/* App Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0]">
              Spreadsheet Application
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {appOptions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setApp(item.id)}
                  className={`p-3 rounded-xl border text-left transition-colors focus-ring ${
                    app === item.id
                      ? 'bg-[#101c33] border-[#ffb840] shadow-[0_0_12px_rgba(255, 184, 64,0.2)]'
                      : 'bg-[#0a1424] border-[rgba(143,163,192,0.16)] hover:border-[rgba(143,163,192,0.3)]'
                  }`}
                >
                  <div className={`text-xs font-bold ${app === item.id ? 'text-[#ffb840]' : 'text-[#f2f7ff]'}`}>
                    {item.label}
                  </div>
                  <div className="text-[11px] text-[#8fa3c0] mt-0.5">
                    {item.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      }
      customResultRenderer={({ result, rawData, onCopy, copied }) => {
        const formula: string = rawData?.formula || '';
        const explanation: string = rawData?.explanation || '';
        const example: string = rawData?.example || '';

        const copyFormulaOnly = async () => {
          try {
            await navigator.clipboard.writeText(formula);
            setCopiedFormulaOnly(true);
            setTimeout(() => setCopiedFormulaOnly(false), 2000);
          } catch {
            // Handled
          }
        };

        return (
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[#ffb840] font-semibold flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Generated Formula for {app}</span>
              </span>

              <div className="flex flex-wrap items-center gap-2">
                {formula && (
                  <button
                    type="button"
                    onClick={copyFormulaOnly}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#101c33] border border-[rgba(143,163,192,0.25)] text-xs font-semibold text-[#ffb840] hover:border-[#ffb840] transition-colors focus-ring"
                  >
                    {copiedFormulaOnly ? <Check className="w-3.5 h-3.5 text-[#34e0a1]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedFormulaOnly ? 'Copied Formula' : 'Copy Formula'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onCopy(result)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0a1424] border border-[rgba(143,163,192,0.2)] text-xs font-semibold text-[#f2f7ff] hover:border-[#ffb840] transition-colors focus-ring"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#34e0a1]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied All' : 'Copy All'}</span>
                </button>
              </div>
            </div>

            {/* Formula Code Box */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0] font-semibold">
                Ready-to-Paste Formula
              </label>
              <div className="p-4 rounded-2xl bg-[#0a1424] border border-[rgba(255, 184, 64,0.3)] flex items-center justify-between gap-3 overflow-x-auto">
                <code className="text-sm font-mono text-[#ffb840] font-semibold select-all">
                  {formula || result.split('\n')[0] || result}
                </code>
              </div>
            </div>

            {/* Plain Explanation */}
            {explanation && (
              <div className="space-y-2 pt-2 border-t border-[rgba(143,163,192,0.12)]">
                <span className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0] font-semibold flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-[#5aa9ff]" />
                  <span>Plain English Explanation</span>
                </span>
                <p className="text-sm text-[#f2f7ff] leading-relaxed bg-[#0a1424] p-4 rounded-2xl border border-[rgba(143,163,192,0.14)]">
                  {explanation}
                </p>
              </div>
            )}

            {/* Example Scenario */}
            {example && (
              <div className="space-y-2 pt-2 border-t border-[rgba(143,163,192,0.12)]">
                <span className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0] font-semibold flex items-center gap-1.5">
                  <Sigma className="w-3.5 h-3.5 text-[#ffb840]" aria-hidden="true" />
                  <span>Example Scenario</span>
                </span>
                <div className="text-xs font-mono text-[#8fa3c0] bg-[#0a1424] p-4 rounded-2xl border border-[rgba(143,163,192,0.14)] leading-relaxed">
                  {example}
                </div>
              </div>
            )}
          </div>
        );
      }}
      whatItDoesContent={
        <div className="space-y-3">
          <p>
            The Excel and Google Sheets Formula Helper translates everyday plain-English questions into robust spreadsheet formulas. It eliminates the frustration of searching through dozens of obscure syntax forums or getting stuck with #N/A and #VALUE errors.
          </p>
          <p>
            Whether you need modern tools like XLOOKUP, FILTER, and UNIQUE, or multi-condition calculations like SUMIFS and INDEX/MATCH, this tool writes the formula for your exact columns and explains each argument in simple terms. A practical dummy example shows you how your data looks before you paste it into your live sheet.
          </p>
        </div>
      }
      howToUseSteps={[
        {
          step: 'Describe your columns and calculation',
          text: 'Mention which columns hold your values and what you want to calculate (e.g. "Sum sales in column D if status in column E is Completed").',
        },
        {
          step: 'Select your spreadsheet app',
          text: 'Choose Microsoft Excel or Google Sheets to ensure function compatibility and proper array syntax.',
        },
        {
          step: 'Copy and paste into your sheet',
          text: 'Tap Copy Formula, click your destination cell in your spreadsheet, and hit Enter.',
        },
      ]}
      workedExample={{
        title: 'Example: Two-Condition Sum with Date and Status',
        scenario: 'Sum revenue in column D where status in column E is "Completed" and the transaction date in column B is in year 2026.',
        output: `### Formula (Excel & Google Sheets):
=SUMIFS(D:D, E:E, "Completed", B:B, ">=2026-01-01", B:B, "<=2026-12-31")

### Plain Explanation:
1. D:D (Sum Range): The numbers being added together (total revenue).
2. E:E, "Completed" (Condition 1): Only rows where the status in column E exactly matches "Completed".
3. B:B, ">=2026-01-01" (Condition 2): Only rows where the date is on or after January 1, 2026.
4. B:B, "<=2026-12-31" (Condition 3): Only rows where the date is on or before December 31, 2026.

### Example Scenario:
Row 2 has $150 (Col D), "Completed" (Col E), and 2026-03-15 (Col B). It is included.
Row 3 has $200 (Col D), "Pending" (Col E), and 2026-03-15 (Col B). It is excluded because status is not Completed.`,
      }}
      tips={[
        'Prefer XLOOKUP over VLOOKUP: XLOOKUP does not break when you add new columns, and it searches left without needing helper columns.',
        'Wrap lookups in IFERROR: Wrapping your formula in =IFERROR(..., "Not Found") prevents ugly error flags from ruining your dashboard.',
        'Use commas or semicolons based on region: In the US and UK, formulas use commas between arguments; in many European countries, use semicolons instead.',
        'Lock ranges with dollar signs: If you plan to drag the formula down a column, use absolute references like $A$2:$A$100 so the lookup table stays fixed.',
      ]}
      faq={[
        {
          question: 'Does this formula work in both Google Sheets and Microsoft Excel?',
          answer: 'Yes. Unless specified otherwise, formulas are written using universal modern spreadsheet syntax compatible with Excel 365, Excel 2021+, and Google Sheets.',
        },
        {
          question: 'Why should I use XLOOKUP instead of VLOOKUP?',
          answer: 'XLOOKUP is faster, searches in any direction (including looking to the left of the lookup key), and does not require counting column numbers, making your spreadsheets far less prone to breaking.',
        },
        {
          question: 'What should I do if my formula returns a #VALUE! error?',
          answer: 'Check that your numbers are not stored as text, and verify that all range sizes match (for example, using D2:D100 with E2:E100 rather than different lengths).',
        },
        {
          question: 'Is my spreadsheet data sent to your server?',
          answer: 'No spreadsheet files or actual personal row data are ever uploaded. You only enter the description of the columns and the calculation you want.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
