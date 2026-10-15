import React from 'react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';

interface FormulaHelperPageProps {
  navigate: (path: string) => void;
}

export const FormulaHelperPage: React.FC<FormulaHelperPageProps> = ({ navigate }) => {
  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'formula-helper') || LAUNCH_TOOLS[6];
  const relatedTools = LAUNCH_TOOLS.filter((t) => t.slug === 'quick-calculators' || t.slug === 'apple-shortcuts-generator');
  const relatedGuide = POPULAR_GUIDES.find((g) => g.slug === 'spreadsheet-formulas-plain-english') || POPULAR_GUIDES[2];

  return (
    <ToolPageTemplate
      tool={tool}
      heading="Excel &amp; Sheets Formula Helper"
      subheading="Describe what you want to calculate, lookup, sum, or extract in plain English. Get the exact formula with syntax breakdown, cell references, and error tips."
      inputLabel="Describe your spreadsheet calculation"
      inputPlaceholder="e.g. Find employee email in column C by matching their Employee ID in column A with cell F2..."
      examplePrompt="Sum the sales values in column D only if the status in column E is 'Completed' and the date in column B is in year 2026."
      generateButtonText="Generate Spreadsheet Formula"
      lastUpdated="October 2026"
      navigate={navigate}
      whatItDoesContent={
        <>
          <p>
            The Excel and Google Sheets Formula Helper translates natural language questions into working spreadsheet functions.
          </p>
          <p>
            Whether you need modern functions like XLOOKUP, FILTER, and UNIQUE, or classic formulas like INDEX/MATCH, SUMIFS, and REGEXEXTRACT, this tool provides the ready-to-paste formula along with an explanation of every argument so you understand how it works.
          </p>
        </>
      }
      howToUseSteps={[
        {
          step: 'Describe your data layout',
          text: 'Mention the columns and rows holding your data (e.g. "Column A has product names, Column B has prices").',
        },
        {
          step: 'Specify your goal',
          text: 'State what you want to calculate (e.g. "Sum prices if category is Electronics").',
        },
        {
          step: 'Copy and paste into your sheet',
          text: 'Copy the formula, paste it into cell F2 (or your target cell), and press Enter.',
        },
      ]}
      workedExample={{
        title: 'Example: Two-Condition Sum with Date and Status',
        scenario: 'Sum column D where column E equals "Completed" and column B year is 2026.',
        output: `### Formula (Google Sheets & Excel):
=SUMIFS(D:D, E:E, "Completed", B:B, ">=2026-01-01", B:B, "<=2026-12-31")

### How It Works:
1. **D:D (Sum Range):** The numbers you want to add up (sales/revenue).
2. **E:E, "Completed" (Condition 1):** Only include rows where column E matches "Completed" exactly.
3. **B:B, ">=2026-01-01" (Condition 2):** Only include rows where date is on or after January 1, 2026.
4. **B:B, "<=2026-12-31" (Condition 3):** Only include rows where date is on or before December 31, 2026.

### Pro-Tip:
If you are using Google Sheets and your dates are stored as text, wrap the date condition in DATE(2026,1,1) for 100% reliable evaluation.`,
      }}
      tips={[
        'Mention Excel vs Google Sheets: If you use Google Sheets specifically, mention it to unlock Sheets-native functions like ARRAYFORMULA and QUERY.',
        'Always specify column letters: Stating "Column A" and "Column B" gives you exact formulas without needing to replace dummy variables.',
        'Watch for date formats: Make sure your dates are formatted as Date types in your spreadsheet so greater-than / less-than comparisons work.',
        'Use commas or semicolons: If your country uses comma for decimals, replace formula commas with semicolons.',
      ]}
      faq={[
        {
          question: 'Does this formula work in both Google Sheets and Microsoft Excel?',
          answer: 'Yes. Unless specified otherwise, formulas are designed for universal compatibility across Google Sheets, Excel 365, and Excel 2021+.',
        },
        {
          question: 'Can it help with nested IF statements or VLOOKUP?',
          answer: 'Yes. It will often recommend modern alternatives like IFS or XLOOKUP which are much easier to read and less prone to breaking.',
        },
        {
          question: 'What if I get a #N/A or #VALUE error?',
          answer: 'The explanation explains how to wrap the formula in =IFERROR(..., "Not found") to handle missing records gracefully.',
        },
        {
          question: 'Can it write Google Sheets Apps Script or Excel VBA?',
          answer: 'Yes, if you ask for automation scripts or macros, it will provide the script with instructions on where to paste it.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
