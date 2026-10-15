import React from 'react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';

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
      subheading="Describe any automation you want in plain words. Get exact, numbered step-by-step instructions to configure it directly inside your iPhone or iPad Shortcuts app."
      inputLabel="Describe your automation idea"
      inputPlaceholder="e.g. Send my partner a text with my current location and driving ETA whenever I leave work..."
      examplePrompt="When I connect my phone to CarPlay, start playing my Favorites playlist on Apple Music and ask for directions home."
      generateButtonText="Generate Apple Shortcut Steps"
      lastUpdated="October 2026"
      navigate={navigate}
      whatItDoesContent={
        <>
          <p>
            The Apple Shortcuts Generator turns your everyday phone routine ideas into clear, numbered recipes that you can build inside the native Apple Shortcuts app on iOS 16, 17, and 18.
          </p>
          <p>
            Instead of searching through hundreds of confusing nested actions, you simply describe what you want your phone to do — such as batch-resizing photos, calculating commute times, muting notifications at night, or logging water intake to Apple Health. The generator analyzes your request and maps it to the exact actions available in iOS.
          </p>
        </>
      }
      howToUseSteps={[
        {
          step: 'Describe your routine',
          text: 'Type what you want to happen in simple language. Mention any apps you want to connect, like Messages, Maps, Calendar, or Spotify.',
        },
        {
          step: 'Get the exact actions',
          text: 'Tap the generate button to receive a numbered step-by-step recipe with action names and settings.',
        },
        {
          step: 'Build it in iOS',
          text: 'Open the Shortcuts app on your iPhone or iPad, tap the plus sign (+), and add each action in order. Test it with one tap.',
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
        'Name your apps clearly: If you want to use Spotify instead of Apple Music, mention "Spotify" in your description.',
        'Include your trigger: Mention whether you want to run it by tapping a button, using Siri, or automatically (like when arriving at a location).',
        'Keep multi-step automations simple: Start with 3 to 5 core actions first, test them, and then add extras like sound alerts.',
        'Use the built-in search in Shortcuts: The action names in your result match the exact search terms in Apple\'s action library.',
      ]}
      faq={[
        {
          question: 'Do I need a Mac or a computer to use this?',
          answer: 'No. Everything runs directly on your iPhone or iPad. The generated steps are designed for the native iOS Shortcuts app that is already installed on your device.',
        },
        {
          question: 'Can this shortcut run automatically without me tapping it?',
          answer: 'Yes. In the iOS Shortcuts app, tap the "Automation" tab at the bottom, select "Create Personal Automation", choose a trigger (like Time of Day, Wi-Fi connection, or Alarm), and select "Run Shortcut" to pick your generated shortcut.',
        },
        {
          question: 'Are there any security risks with these shortcuts?',
          answer: 'Shortcuts created through the Apple Shortcuts app run within Apple\'s secure sandbox. The app asks for your explicit permission the first time a shortcut accesses your Location, Contacts, or Photos.',
        },
        {
          question: 'What versions of iOS are supported?',
          answer: 'The action recipes provided work on iOS 15, iOS 16, iOS 17, iOS 18, and iPadOS. If an action name differs slightly between iOS versions, the app suggests the closest match.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
