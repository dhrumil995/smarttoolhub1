import { WorkflowItem } from '../types';

export interface WorkflowFAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Prerequisites' | 'Troubleshooting' | 'Privacy & Security' | 'Performance & Compatibility' | 'Alternatives';
}

export interface FAQQuestionSchema {
  '@type': 'Question';
  name: string;
  acceptedAnswer: {
    '@type': 'Answer';
    text: string;
  };
}

export interface FAQPageSchema {
  '@context': 'https://schema.org';
  '@type': 'FAQPage';
  '@id': string;
  name: string;
  description: string;
  mainEntity: FAQQuestionSchema[];
}

/**
 * Dynamically synthesizes high-intent, schema-compliant FAQ questions and answers
 * directly from a WorkflowItem's hardware requirements, pitfalls, privacy rules,
 * and alternative execution paths.
 */
export function generateWorkflowFAQs(workflow: WorkflowItem): WorkflowFAQItem[] {
  const faqs: WorkflowFAQItem[] = [];

  // 1. Common Pitfalls & Troubleshooting
  if (workflow.commonProblems && workflow.commonProblems.length > 0) {
    workflow.commonProblems.forEach((prob, idx) => {
      faqs.push({
        id: `troubleshooting-${idx}`,
        question: `How do I resolve: "${prob.issue}"?`,
        answer: prob.solution,
        category: 'Troubleshooting',
      });
    });
  }

  // 2. Hardware and OS Prerequisites
  const devicesText = workflow.devicesRequired
    .map((d) => `${d.device} running ${d.minOS}${d.hardwareNotes ? ` (${d.hardwareNotes})` : ''}`)
    .join(', ');
  
  faqs.push({
    id: 'prerequisites-hardware',
    question: `What hardware, devices, and minimum operating systems are required for ${workflow.title}?`,
    answer: `To execute this workflow, you need: ${devicesText}. System configuration: ${workflow.requiredSettings.join('; ')}`,
    category: 'Prerequisites',
  });

  // 3. Apple Account & Continuity Connectivity
  faqs.push({
    id: 'prerequisites-connectivity',
    question: `Do devices need to be on the same Wi-Fi network and Apple Account?`,
    answer: `Yes. Apple Continuity and peer-to-peer protocols require all participating devices to be signed in to the same Apple Account with Two-Factor Authentication (2FA) active, with Wi-Fi, Bluetooth, and Handoff enabled within close physical proximity.`,
    category: 'Prerequisites',
  });

  // 4. Software Dependencies & Zero Third-Party Bloat
  faqs.push({
    id: 'performance-software',
    question: `Does "${workflow.title}" require third-party paid subscriptions or software?`,
    answer: `${
      workflow.isBuiltInOnly
        ? 'No third-party paid software or subscriptions are required. This blueprint utilizes native macOS, iOS, and iPadOS system capabilities exclusively'
        : 'This blueprint uses native tools alongside standard applications'
    } (${workflow.appsUsed.join(', ')}). Estimated total setup and configuration time is ${workflow.setupTimeMinutes} minutes with zero background memory bloat.`,
    category: 'Performance & Compatibility',
  });

  // 5. Privacy & Zero-Credentials Security
  if (workflow.privacyNotes && workflow.privacyNotes.length > 0) {
    faqs.push({
      id: 'privacy-security',
      question: `Is my personal data, screen contents, or video feed secure when using this workflow?`,
      answer: `${workflow.privacyNotes.join(' ')} SmartToolHub operates on a zero-credentials model and never logs, transmits, or intercepts user passwords or iCloud tokens.`,
      category: 'Privacy & Security',
    });
  }

  // 6. Alternative Workflow & Hardware Fallback
  if (workflow.alternativeWorkflow) {
    faqs.push({
      id: 'alternative-fallback',
      question: `What should I do if my hardware does not meet the minimum requirements for "${workflow.title}"?`,
      answer: `Consider the alternative blueprint "${workflow.alternativeWorkflow.title}": ${workflow.alternativeWorkflow.description}. Key trade-off: ${workflow.alternativeWorkflow.tradeOff}`,
      category: 'Alternatives',
    });
  }

  return faqs;
}

/**
 * Generates the valid Schema.org FAQPage JSON-LD representation for the workflow.
 * Formatted strictly to Google's Search Central Rich Results standards.
 */
export function generateWorkflowFAQSchema(workflow: WorkflowItem, canonicalUrl: string): FAQPageSchema {
  const faqs = generateWorkflowFAQs(workflow);

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${canonicalUrl}#faq`,
    name: `Frequently Asked Questions: ${workflow.title}`,
    description: `Verified troubleshooting solutions, hardware compatibility criteria, and privacy guidelines for ${workflow.title}.`,
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Dynamically injects or updates a dedicated JSON-LD script tag in document.head.
 * Returns a cleanup callback that removes the script on component unmount.
 */
export function injectWorkflowFAQSchema(workflow: WorkflowItem, canonicalUrl: string): () => void {
  if (typeof document === 'undefined') {
    return () => {};
  }

  const scriptId = `faq-schema-wf-${workflow.id}`;
  let script = document.getElementById(scriptId) as HTMLScriptElement | null;

  if (!script) {
    script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  const schema = generateWorkflowFAQSchema(workflow, canonicalUrl);
  script.textContent = JSON.stringify(schema, null, 2);

  return () => {
    const existing = document.getElementById(scriptId);
    if (existing && existing.parentNode) {
      existing.parentNode.removeChild(existing);
    }
  };
}
