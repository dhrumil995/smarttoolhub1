import React, { useState } from 'react';
import { Smartphone, Zap, Sliders, ShieldCheck, Check, Copy, ExternalLink, AlertTriangle, Workflow, Sparkles } from 'lucide-react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';

interface AndroidAutomationPageProps {
  navigate: (path: string) => void;
}

export const AndroidAutomationPage: React.FC<AndroidAutomationPageProps> = ({ navigate }) => {
  const [appType, setAppType] = useState<'MacroDroid' | 'Tasker'>('MacroDroid');

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'android-automation-generator') || {
    id: 'android-automation-generator',
    name: 'Android Automation Recipe Generator',
    slug: 'android-automation-generator',
    description: 'Generate clear step-by-step triggers, actions, constraints, and permission requirements for Tasker and MacroDroid.',
    category: 'Developer',
    icon: 'Smartphone',
    type: 'ai',
    keywords: ['android automation recipe generator', 'tasker profile generator', 'macrodroid macro tutorial', 'automate android tasks'],
    relatedToolSlugs: ['autohotkey-script-generator', 'adb-fastboot-command-builder'],
    isFlagship: false,
  };

  const relatedTools = LAUNCH_TOOLS.filter(
    (t) => t.slug === 'autohotkey-script-generator' || t.slug === 'install-command-generator' || t.slug === 'apple-shortcuts-generator'
  );
  const relatedGuide = POPULAR_GUIDES[0];

  const exampleChips = [
    'Silence phone when connected to Office Wi-Fi',
    'Speak battery level when plugged in and fully charged',
    'Turn on Flashlight with double shake gesture',
  ];

  return (
    <ToolPageTemplate
      tool={tool}
      heading="Android Automation Recipe Generator"
      subheading="Generate clear, numbered automation recipes for MacroDroid and Tasker. Includes exact triggers, sequential actions, logic constraints, and required Android system permissions."
      inputLabel="What would you like your Android device to automate?"
      inputPlaceholder="e.g. When I arrive at the gym, open Spotify and set media volume to 80% on weekdays..."
      examplePrompt="Silence phone when connected to Office Wi-Fi on weekdays"
      exampleChips={exampleChips}
      lastUpdated="October 2026"
      navigate={navigate}
      apiEndpoint="/api/android-automation"
      requestPayload={(input) => ({
        description: input,
        appType,
      })}
      customResultRenderer={({ result, rawData }) => {
        const recipeName: string = rawData?.recipeName || 'Generated Android Automation Recipe';
        const trigger: string = rawData?.trigger || 'Wi-Fi / Geofence Trigger';
        const actions: string[] = rawData?.actions || [];
        const constraints: string[] = rawData?.constraints || [];
        const permissions: string[] = rawData?.permissions || [];
        const summary: string = rawData?.summary || result;

        return (
          <div className="space-y-6">
            {/* Header info */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#0a1424] border border-[rgba(108,125,255,0.3)] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-mono uppercase text-[#6c7dff] font-bold">
                  {appType} Blueprint
                </span>
                <span className="text-xs font-mono text-[#9aaccb] bg-[#050a14] px-2.5 py-1 rounded-lg border border-[rgba(143,163,192,0.12)]">
                  Android 11–15 Compatible
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-display text-[#f2f7ff]">
                {recipeName}
              </h3>
              <p className="text-xs sm:text-sm text-[#9aaccb] leading-relaxed">
                {summary}
              </p>
            </div>

            {/* Triggers & Actions Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Trigger */}
              <div className="p-5 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#ffb840] font-bold">
                  <Zap className="w-4 h-4 text-[#ffb840]" />
                  <span>1. Trigger (When This Happens)</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#050a14] border border-[rgba(143,163,192,0.14)] text-xs text-[#f2f7ff] font-medium leading-relaxed">
                  {trigger}
                </div>
              </div>

              {/* Constraints */}
              <div className="p-5 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#5aa9ff] font-bold">
                  <Sliders className="w-4 h-4 text-[#5aa9ff]" />
                  <span>2. Constraints (Only If)</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#050a14] border border-[rgba(143,163,192,0.14)] text-xs text-[#f2f7ff] font-medium leading-relaxed">
                  {constraints.length > 0 ? (
                    <ul className="space-y-1">
                      {constraints.map((c, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-[#5aa9ff]">•</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-[#9aaccb]">None (executes every time trigger fires)</span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions List */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#6c7dff] font-bold">
                <Workflow className="w-4 h-4 text-[#6c7dff]" />
                <span>3. Actions (Execute in Sequential Order)</span>
              </div>
              <div className="space-y-2.5">
                {actions.map((act, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#050a14] border border-[rgba(143,163,192,0.12)] text-xs text-[#f2f7ff]"
                  >
                    <span className="w-5 h-5 rounded-md bg-[#101c33] text-[#6c7dff] font-mono font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed mt-0.5">{act}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Permissions & Disclaimers */}
            <div className="p-5 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#34e0a1] font-bold">
                <ShieldCheck className="w-4 h-4 text-[#34e0a1]" />
                <span>What Permissions You May Need</span>
              </div>
              <div className="space-y-1.5 text-xs text-[#9aaccb]">
                {permissions.map((p, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-[#34e0a1] shrink-0 mt-0.5" />
                    <span className="text-[#f2f7ff]">{p}</span>
                  </div>
                ))}
              </div>
              <div className="p-3 rounded-xl bg-[#101c33] text-[11px] text-[#ffb840] font-mono mt-3">
                * Menus and names can vary by app version.
              </div>
            </div>
          </div>
        );
      }}
      extraControls={
        <div className="p-4 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <span className="text-xs font-mono uppercase text-[#9aaccb] font-semibold">
            Target Automation Engine:
          </span>
          <div className="flex rounded-xl bg-[#050a14] p-1 border border-[rgba(143,163,192,0.16)] text-xs">
            <button
              type="button"
              onClick={() => setAppType('MacroDroid')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all focus-ring ${
                appType === 'MacroDroid'
                  ? 'bg-[#6c7dff] text-white font-bold shadow-sm'
                  : 'text-[#9aaccb] hover:text-[#f2f7ff]'
              }`}
            >
              MacroDroid (Beginner-Friendly)
            </button>
            <button
              type="button"
              onClick={() => setAppType('Tasker')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all focus-ring ${
                appType === 'Tasker'
                  ? 'bg-[#6c7dff] text-white font-bold shadow-sm'
                  : 'text-[#9aaccb] hover:text-[#f2f7ff]'
              }`}
            >
              Tasker (Power Users)
            </button>
          </div>
        </div>
      }
      whatItDoesContent={
        <>
          <p>
            The Android Automation Recipe Generator translates natural language productivity goals into structured, executable recipes for the two leading Android automation apps: MacroDroid and Tasker. Creating robust automations on modern versions of Android (Android 12 through Android 15) requires precise knowledge of background execution limits, Do Not Disturb policies, and runtime permission scopes.
          </p>
          <p>
            Whether you want your phone to silence its ringer when connected to office Wi-Fi, toggle Bluetooth when connecting to your car's hands-free audio, or read battery levels aloud upon full charge, this generator maps your request into exact triggers, sequential actions, logical constraints, and the specific Android permission toggles needed to prevent battery optimization kill-switches.
          </p>
        </>
      }
      howToUseSteps={[
        {
          step: 'Choose your automation app',
          text: 'Select MacroDroid (recommended for intuitive visual menus) or Tasker (for advanced variable handling and plugins).',
        },
        {
          step: 'Describe your routine',
          text: 'Describe what you want your phone to do (e.g. "Silence my phone when I reach the office on weekdays").',
        },
        {
          step: 'Follow the recipe in your app',
          text: 'Open Tasker or MacroDroid, create a new profile/macro, add the specified trigger, actions, and grant requested permissions.',
        },
      ]}
      workedExample={{
        title: 'Example: Auto-Silence Phone at Work',
        scenario: 'User wants their Galaxy S24 to enter Do Not Disturb when connecting to company Wi-Fi "AcmeCorp-Staff".',
        output: `App: MacroDroid
1. TRIGGER:
• Wi-Fi State Change > Connected to Network > SSID: "AcmeCorp-Staff"

2. ACTIONS:
• Volume > Set Priority / Do Not Disturb Mode > Priority Only
• Notification > Display Notification > "Work Profile Active - DND Enabled"

3. CONSTRAINTS:
• Day of the week > Monday, Tuesday, Wednesday, Thursday, Friday

REQUIRED PERMISSIONS:
• Do Not Disturb Access (Settings > Special App Access)
• Location Permission (required by Android 10+ to detect Wi-Fi network names)

*Note: Menus and names can vary by app version.`,
      }}
      tips={[
        'Disable Battery Optimization: In Android Settings > Apps > [Tasker or MacroDroid] > Battery, choose "Unrestricted" so Android does not kill your background automation engine.',
        'Location permission is required for Wi-Fi triggers: Modern Android versions classify Wi-Fi SSIDs as location data to prevent rogue tracking.',
        'Use Exit Actions or Opposite Macros: Remember to create a secondary trigger for when Wi-Fi disconnects to return volume to normal.',
        'Test triggers manually: Both MacroDroid and Tasker offer a "Test Actions" button to preview behavior without waiting for physical events.',
      ]}
      faq={[
        {
          question: 'What is the difference between MacroDroid and Tasker?',
          answer: 'MacroDroid uses a simple, user-friendly 3-column architecture (Trigger, Action, Constraint) with pre-built templates. Tasker separates triggers into "Profiles" and actions into "Tasks", offering deep variable arrays and JavaScript execution for advanced power users.',
        },
        {
          question: 'Do these automations require rooting my phone?',
          answer: 'No. The overwhelming majority of modern automations (volume, Wi-Fi triggers, Bluetooth, notifications, app launching) run purely using standard Android accessibility and notification listener permissions without root.',
        },
        {
          question: 'Why does my automation not trigger when the screen is locked?',
          answer: 'Android battery management (Doze Mode) puts inactive apps to sleep. Ensure your automation app is set to "Unrestricted" under Battery usage and exempt from background power saving.',
        },
        {
          question: 'Can I automate sending WhatsApp or SMS messages?',
          answer: 'Yes, but sending messages without manual user confirmation requires Accessibility permissions or notification interaction plugins depending on your Android version.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
