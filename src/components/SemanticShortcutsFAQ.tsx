import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Copy, Check, ExternalLink } from 'lucide-react';
import { haptics } from '../utils/haptics';

export interface FAQItemData {
  id: string;
  question: string;
  answer: string;
}

export const SHORTCUTS_FAQ_ITEMS: FAQItemData[] = [
  {
    id: 'faq-create-shortcut',
    question: 'How do I create and run an Apple Shortcut on iPhone, iPad, or Mac?',
    answer:
      'Open the built-in Shortcuts app on your Apple device. Tap or click the "+" button in the top right to start a new workflow. Browse or search actions from the right-hand action library (such as "Send Message", "Open App", "Get Calendar Events", or "Set Low Power Mode"), connect variables between steps, name your shortcut, and tap Done. You can run it immediately by tapping its tile, using a Home Screen or Mac Menu Bar widget, or speaking "Hey Siri, [shortcut name]".',
  },
  {
    id: 'faq-install-untrusted',
    question: 'How do I install an untrusted or shared .shortcut file in iOS 18?',
    answer:
      'In iOS 18 and macOS Sequoia, open any shared iCloud or SmartToolHub shortcut link directly in Safari. Tap "Get Shortcut" or "Add Shortcut". iOS displays a native security preview sheet detailing every action, required permission (such as location or photos), and external network request. Review the actions, configure any personalized variables, and tap "Add Shortcut". Modern iOS signs shortcuts with iCloud certificates, so you no longer need the legacy "Allow Untrusted Shortcuts" toggle in Settings.',
  },
  {
    id: 'faq-background-timeout',
    question: 'Why does my Apple Shortcut get stuck or fail to complete in the background?',
    answer:
      'iOS strictly enforces background execution resource limits (typically ~30 seconds for non-interactive routines). If your shortcut processes large batches of images, queries slow external APIs, or runs infinite repeat loops, iOS memory management will terminate the process. To ensure smooth background completion: keep action chains lightweight, optimize images before processing, use native built-in actions rather than repeated webhooks, and test execution with the screen unlocked.',
  },
  {
    id: 'faq-silent-automation',
    question: 'How do Apple Shortcuts automations work without asking for confirmation each time?',
    answer:
      'In the Shortcuts app, tap the "Automation" tab at the bottom and create a personal automation. Choose an event trigger that supports background execution (such as "Time of Day", "Alarm Dismissal", "Connecting to CarPlay", "NFC Tag Tap", or "Battery Level"). When configuring the action sequence, toggle OFF "Ask Before Running" and toggle OFF "Notify When Run". This allows the shortcut to run 100% silently in the background without prompting you.',
  },
  {
    id: 'faq-cross-device-sync',
    question: 'Can I transfer and run the same Shortcut across Mac and iPhone?',
    answer:
      'Yes! Apple Shortcuts automatically synchronize in real time across iPhone, iPad, Mac, and Apple Watch through iCloud when signed into the same Apple Account. Cross-platform actions (such as Calendar, Notes, Reminders, and Web requests) run seamlessly everywhere. macOS also supports running native AppleScript and Zsh shell scripts within shortcuts, while platform-specific actions (like toggling cellular data) gracefully adapt on Mac.',
  },
  {
    id: 'faq-troubleshoot-continuity',
    question: 'How do I fix Continuity, iPhone Mirroring, and AirDrop handoff issues?',
    answer:
      'Make sure both your Mac and iPhone have Wi-Fi and Bluetooth turned on, are signed into the exact same Apple Account with Two-Factor Authentication, and are within 30 feet of each other. In macOS Sequoia System Settings > General > AirDrop & Handoff, ensure "Allow Handoff" is enabled. If handoff stalls, toggle Bluetooth off and on, reboot the Apple Wireless Direct Link (AWDL) daemon, or use our built-in Continuity Sync Doctor to verify network handshake tokens.',
  },
];

export const SemanticShortcutsFAQ: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (answer: string, id: string) => {
    haptics.playTap();
    try {
      await navigator.clipboard.writeText(answer);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (_) {}
  };

  return (
    <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
      <div className="bento-card p-6 sm:p-10 tilt-card-3d space-y-8">
        {/* Section Header */}
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-mono">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Apple Shortcuts Knowledge Base</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400">
            Clear, practical answers on creating, configuring, and troubleshooting Apple Shortcuts in iOS 18 and macOS Sequoia.
          </p>
        </div>

        {/* Semantic <details> elements FAQ Accordion */}
        <div className="space-y-3.5">
          {SHORTCUTS_FAQ_ITEMS.map((faq, index) => (
            <details
              key={faq.id}
              className="group rounded-2xl bg-white/5 dark:bg-white/[0.03] border border-white/10 hover:border-blue-400/35 transition-all duration-200 overflow-hidden"
              open={index === 0}
            >
              <summary className="flex items-center justify-between p-4 sm:p-5 text-left cursor-pointer list-none select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-2xl">
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-zinc-100 group-open:text-blue-500 dark:group-open:text-blue-400 font-heading pr-4">
                  {faq.question}
                </span>
                <span className="p-1.5 rounded-lg bg-white/5 text-zinc-400 group-open:rotate-180 group-open:bg-blue-500/20 group-open:text-blue-400 transition-transform duration-200 shrink-0">
                  <ChevronDown className="w-4 h-4" />
                </span>
              </summary>

              <div className="px-4 pb-5 sm:px-5 sm:pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed border-t border-white/5">
                <p>{faq.answer}</p>
                <div className="mt-3 pt-3 flex items-center justify-between text-[11px] font-mono text-zinc-400 border-t border-white/5">
                  <span className="text-[10px]">Verified for iOS 18.2 &amp; macOS 15.2</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(faq.answer, faq.id)}
                    className="inline-flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedId === faq.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Answer</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};
