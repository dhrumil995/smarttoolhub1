import React from 'react';
import { Download } from 'lucide-react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';
import { downloadShortcutFile } from '../../utils/shortcutGenerator.ts';

interface AppleShortcutsPageProps {
  navigate: (path: string) => void;
}

export const AppleShortcutsPage: React.FC<AppleShortcutsPageProps> = ({ navigate }) => {
  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'apple-shortcuts-generator') || LAUNCH_TOOLS[0];
  const relatedTools = LAUNCH_TOOLS.filter((t) => t.slug === 'ai-prompt-improver' || t.slug === 'quick-calculators');
  const relatedGuide = POPULAR_GUIDES.find((g) => g.slug === 'build-first-iphone-shortcut') || POPULAR_GUIDES[0];

  return (
    <ToolPageTemplate
      tool={tool}
      heading="Apple Shortcuts Generator"
      subheading="Describe any automation you want in plain words. Get exact, numbered step-by-step instructions and download a ready-to-import .shortcut file directly for your iPhone or iPad."
      inputLabel="Describe your automation idea"
      inputPlaceholder="e.g. Send my partner a text with my current location and driving ETA whenever I leave work..."
      examplePrompt="When I connect my phone to CarPlay, start playing my Favorites playlist on Apple Music and ask for directions home."
      generateButtonText="Generate Apple Shortcut Steps"
      lastUpdated="October 2026"
      navigate={navigate}
      extraResultActions={(result, input) => (
        <button
          type="button"
          onClick={() => downloadShortcutFile(result, input)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8b5cf6]/15 border border-[#8b5cf6]/40 text-xs font-semibold text-[#8b5cf6] hover:bg-[#8b5cf6]/25 transition-colors focus-ring"
          title="Download ready-to-import iOS .shortcut file"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Download .shortcut</span>
          <span className="sm:hidden">.shortcut</span>
        </button>
      )}
      whatItDoesContent={
        <>
          <p>
            The Apple Shortcuts Generator turns your everyday phone routine ideas into clear, numbered recipes that you can build inside the native Apple Shortcuts app on iOS 16, 17, and 18.
          </p>
          <p>
            Instead of searching through hundreds of confusing nested actions, you simply describe what you want your phone to do — such as batch-resizing photos, calculating commute times, muting notifications at night, or logging water intake to Apple Health. The generator analyzes your request, maps it to native iOS actions, and provides a 1-click downloadable <code>.shortcut</code> file.
          </p>
        </>
      }
      howToUseSteps={[
        {
          step: 'Describe your routine',
          text: 'Type what you want to happen in simple language. Mention any apps you want to connect, like Messages, Maps, Calendar, or Spotify.',
        },
        {
          step: 'Get steps & .shortcut file',
          text: 'Tap generate to receive numbered instructions and download the ready .shortcut file directly to your device.',
        },
        {
          step: 'Import or build in iOS',
          text: 'Tap the downloaded file or open the Shortcuts app to import the automation in seconds with zero manual typing.',
        },
      ]}
      workedExample={{
        title: 'Example: Automatic Bedtime Wind-Down Routine',
        scenario: 'Turn on Low Power Mode, set screen brightness to 15%, turn on Do Not Disturb until 7 AM, and set a wake-up alarm for 7:00 AM.',
        output: `### Shortcut Name: "Bedtime Chill"
**Suggested Icon:** Moon / Indigo
**Permissions:** Shortcuts, Clock, Settings

#### Step-by-Step Instructions:
1. Open the **Shortcuts** app and tap **+** in the top right.
2. Tap **Add Action** and search for: **Set Low Power Mode**. Toggle to **Turn On**.
3. Search for: **Set Brightness**. Tap the percentage and drag the slider to **15%**.
4. Search for: **Set Focus**. Choose **Do Not Disturb** and set it to **Until 7:00 AM**.
5. Search for: **Create Alarm**. Set the time to **7:00 AM** and label it **Wake Up**.
6. Tap **Done** in the top right corner to save.

#### How to Run:
- Say "Hey Siri, Bedtime Chill"
- Add to your Lock Screen widget or trigger automatically with an iOS Sleep Automation.`,
      }}
      tips={[
        'Use the "Download .shortcut" button: Tap to save a native file you can import directly into iOS Shortcuts.',
        'Name your apps clearly: If you want to use Spotify instead of Apple Music, mention "Spotify" in your description.',
        'Include your trigger: Mention whether you want to run it by tapping a button, using Siri, or automatically (like when arriving at a location).',
        'Keep multi-step automations simple: Start with 3 to 5 core actions first, test them, and then add extras like sound alerts.',
      ]}
      faq={[
        {
          question: 'What is the downloaded .shortcut file?',
          answer: 'The .shortcut file is Apple\'s native property list format. When opened on an iPhone, iPad, or Mac, the Shortcuts app immediately asks to add the shortcut to your library.',
        },
        {
          question: 'Do I need a Mac or a computer to use this?',
          answer: 'No. Everything runs directly on your iPhone or iPad. The generated steps and downloadable .shortcut file are designed for the native iOS Shortcuts app.',
        },
        {
          question: 'Can this shortcut run automatically without me tapping it?',
          answer: 'Yes. In the iOS Shortcuts app, tap the "Automation" tab at the bottom, select "Create Personal Automation", choose a trigger (like Time of Day, Wi-Fi connection, or Alarm), and select "Run Shortcut" to pick your generated shortcut.',
        },
        {
          question: 'Are there any security risks with these shortcuts?',
          answer: 'Shortcuts created through the Apple Shortcuts app run within Apple\'s secure sandbox. The app asks for your explicit permission the first time a shortcut accesses your Location, Contacts, or Photos.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
