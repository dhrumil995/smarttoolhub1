import { GuideMeta } from '../types/navigation.ts';

export interface GuideArticle {
  slug: string;
  title: string;
  summary: string;
  readTime: string;
  lastUpdated: string;
  author: string;
  relatedToolSlug: string;
  relatedToolName: string;
  sections: Array<{
    heading: string;
    body: string[];
    callout?: string;
  }>;
}

export const GUIDE_ARTICLES: Record<string, GuideArticle> = {
  'build-first-iphone-shortcut': {
    slug: 'build-first-iphone-shortcut',
    title: 'How to Build Your First iPhone Shortcut in Under 3 Minutes',
    summary: 'A step-by-step walkthrough of creating automated morning routines and photo actions using Apple Shortcuts.',
    readTime: '3 min read',
    lastUpdated: 'October 2026',
    author: 'Dhrumil Aslaliya',
    relatedToolSlug: 'apple-shortcuts-generator',
    relatedToolName: 'Apple Shortcuts Generator',
    sections: [
      {
        heading: 'Why build Apple Shortcuts?',
        body: [
          'If you do the same taps on your iPhone every single day — like checking traffic, turning down your brightness at bedtime, or texting your arrival time — Apple Shortcuts can save you minutes every single day.',
          'The native Shortcuts app comes pre-installed on every iPhone running iOS 14 or later. You do not need to know any programming. You simply link visual building blocks together like digital Lego.',
        ],
      },
      {
        heading: 'Step 1: Open the Shortcuts App',
        body: [
          'Find the Shortcuts app on your iPhone or swipe down on your Home Screen and search for "Shortcuts".',
          'Tap the "+" icon in the top right corner to create a blank canvas. Tap the title at the top to give your shortcut a memorable name like "Heading Home" or "Morning Briefing".',
        ],
        callout: 'Tip: Tap the icon next to the title to pick a custom symbol and color that stands out on your Home Screen.',
      },
      {
        heading: 'Step 2: Add Your First Action',
        body: [
          'Tap the blue "Add Action" button at the center of the screen.',
          'Search for "Get Travel Time". Tap it to add it to your shortcut. Set the end location to "Home".',
          'Next, search for "Send Message". Shortcuts will automatically link the travel time calculation into the text of the message! Choose who to send it to (e.g., your partner or roommate).',
        ],
      },
      {
        heading: 'Step 3: Test and Add to Your Home Screen',
        body: [
          'Tap the Play button in the bottom right corner to test your shortcut. Your iPhone will calculate the driving time and draft the text.',
          'Once it works, tap the share icon at the bottom and choose "Add to Home Screen". Now, one tap triggers the entire sequence.',
        ],
      },
    ],
  },
  'better-prompts-simple-rules': {
    slug: 'better-prompts-simple-rules',
    title: 'How to Get Exact AI Answers with 3 Simple Prompt Rules',
    summary: 'Stop getting generic answers. Learn how context, role, and output format change everything.',
    readTime: '4 min read',
    lastUpdated: 'October 2026',
    author: 'Dhrumil Aslaliya',
    relatedToolSlug: 'ai-prompt-improver',
    relatedToolName: 'AI Prompt Improver',
    sections: [
      {
        heading: 'The Problem with Short Prompts',
        body: [
          'When you ask an AI model something brief like "write a workout plan", the AI has to guess everything: your fitness level, how much time you have, what equipment is in your room, and your physical goals.',
          'Because it has to guess, it averages all the workout plans on the internet. You end up with a boring, generic list that doesn\'t fit your life.',
        ],
      },
      {
        heading: 'Rule 1: Give the AI a Persona and Context',
        body: [
          'Start by telling the model who it is and who you are.',
          'For example: "You are an experienced physical therapist. I am a 34-year-old desk worker with mild lower back tightness and only 20 minutes before work."',
        ],
        callout: 'Adding context takes 10 seconds of typing but improves the output quality by 500%.',
      },
      {
        heading: 'Rule 2: Set Negative Constraints',
        body: [
          'Negative constraints tell the AI what NOT to do. This prevents corporate buzzwords, excessive length, or irrelevant advice.',
          'Examples of strong negative constraints: "Do not recommend gym machines; bodyweight only", "No introduction paragraph", or "Keep the total response under 150 words".',
        ],
      },
      {
        heading: 'Rule 3: Demand a Specific Output Format',
        body: [
          'Always state how you want the answer organized. Do you want a Markdown table, numbered steps, or quick bullets?',
          'When you specify: "Format as a 3-column table: Exercise, Reps, and Form Tip", you get a clean reference you can screenshot and use immediately.',
        ],
      },
    ],
  },
  'spreadsheet-formulas-plain-english': {
    slug: 'spreadsheet-formulas-plain-english',
    title: 'Convert Plain English Questions into Excel and Sheets Formulas',
    summary: 'How to describe lookups, date calculations, and conditionals without memorizing syntax.',
    readTime: '3 min read',
    lastUpdated: 'October 2026',
    author: 'Dhrumil Aslaliya',
    relatedToolSlug: 'formula-helper',
    relatedToolName: 'Excel & Sheets Formula Helper',
    sections: [
      {
        heading: 'Stop Memorizing Function Names',
        body: [
          'Spreadsheets are powerful, but memorizing whether to use VLOOKUP, INDEX/MATCH, XLOOKUP, or FILTER can give anyone a headache.',
          'Modern formula design is about describing the relationship between your columns. When you know how to state your question, AI tools can generate the exact formula in 3 seconds.',
        ],
      },
      {
        heading: 'How to Describe Your Columns Clearly',
        body: [
          'Always state the column letters and what they contain.',
          'Instead of asking "How do I match customer names?", ask: "Column A has Customer IDs and Column B has Customer Names. In Column F, I have an ID in cell F2. What formula returns the name from Column B?"',
          'Notice how specific that is! The AI can immediately write: =XLOOKUP(F2, A:A, B:B, "Not found").',
        ],
      },
      {
        heading: 'Handling Multi-Condition Calculations',
        body: [
          'If you need to sum or count based on two conditions, always name the conditions in order.',
          'Example: "Sum Column D (Sales) where Column C is \'West Coast\' and Column E is \'Shipped\'". This immediately gives you a clean =SUMIFS formula.',
        ],
        callout: 'Pro-Tip: Always wrap lookups in =IFERROR(..., "") to prevent ugly #N/A errors when data is missing.',
      },
    ],
  },
  'windows-winget-setup-guide': {
    slug: 'windows-winget-setup-guide',
    title: 'How to Set Up a Fresh Windows PC in Under 5 Minutes Using winget',
    summary: 'Automate software installation on new or reformatted Windows 10/11 computers without clicking through web downloaders or unchecking bundled adware.',
    readTime: '4 min read',
    lastUpdated: 'October 2026',
    author: 'Dhrumil Aslaliya',
    relatedToolSlug: 'install-command-generator',
    relatedToolName: 'Install Command Generator',
    sections: [
      {
        heading: 'Why Manual Web Installers Waste Hours',
        body: [
          'Setting up a new Windows laptop or desktop PC traditionally involves opening Edge, visiting twenty different websites, dodging fake "Download Now" advertisements, downloading setup EXEs, and manually unchecking bundled toolbars.',
          'Windows 10 and 11 include a native command-line package manager called winget (Windows Package Manager). It pulls verified, checksum-audited installers directly from official repositories and installs them silently in the background.',
        ],
      },
      {
        heading: 'Step 1: Open Windows Terminal as Administrator',
        body: [
          'Right-click the Windows Start menu icon and select "Terminal (Admin)" or "PowerShell (Admin)".',
          'Verify that winget is active by typing "winget --version" and pressing Enter. If it is recognized, you are ready to install software at maximum speed.',
        ],
        callout: 'Tip: If winget is not recognized on an older Windows 10 build, update the "App Installer" package from the Microsoft Store.',
      },
      {
        heading: 'Step 2: Basic Install and Search Syntax',
        body: [
          'To install an app, you simply provide its unique package ID. For example: "winget install 7zip.7zip" or "winget install Microsoft.PowerToys".',
          'Winget will automatically verify the publisher certificate, download the official installer file, execute the installer with silent switches, and register the program in your Start menu.',
        ],
      },
      {
        heading: 'Step 3: Batch Install Everything in One Command',
        body: [
          'Instead of typing commands one by one, you can chain multiple package IDs together into a unified one-liner script using our Install Command Generator.',
          'Selecting PowerToys, 7-Zip, Everything, WizTree, VLC, and Bitwarden generates a clean single-line command you can paste and walk away while your entire PC configures itself.',
        ],
      },
      {
        heading: 'Step 4: Keep Everything Updated with One Command',
        body: [
          'Months down the road, you do not need individual updater popups. Simply open Terminal and run "winget upgrade --all".',
          'Winget inspects every installed package, checks for upstream releases, downloads new builds, and upgrades them all unattended.',
        ],
        callout: 'Pro-Tip: Run "winget upgrade --all --include-unknown" periodically to catch utilities that report custom internal version strings.',
      },
    ],
  },
  'shizuku-wireless-adb-walkthrough': {
    slug: 'shizuku-wireless-adb-walkthrough',
    title: 'How to Enable Shizuku on Android 11+ Without a PC or Root',
    summary: 'Unlock privileged system capabilities, permission management, and debloating on your Android smartphone using built-in Wireless Debugging.',
    readTime: '5 min read',
    lastUpdated: 'October 2026',
    author: 'Dhrumil Aslaliya',
    relatedToolSlug: 'adb-fastboot-command-builder',
    relatedToolName: 'ADB & Fastboot Command Builder',
    sections: [
      {
        heading: 'What is Shizuku and Why Is It Revolutionary?',
        body: [
          'Historically, performing deep Android system tasks—like freezing bloatware, modifying system UI icons, or automating restricted settings—required either rooting your phone (which trips Knox and breaks banking apps) or tethering to a PC via ADB USB cable.',
          'Shizuku solves this by running an ADB-privileged Binder service directly on your device. Once started, authorized open-source apps (App Manager, Hail, SD Maid SE, Termux) can execute privileged operations safely.',
        ],
      },
      {
        heading: 'Step 1: Enable Developer Options and Wireless Debugging',
        body: [
          'Go to Settings > About Phone, and tap "Build Number" 7 times until you see the toast "You are now a developer!".',
          'Return to Settings > System (or Additional Settings) > Developer Options.',
          'Connect your phone to a local Wi-Fi network, then toggle on "Wireless Debugging" and tap "Allow" on your network.',
        ],
        callout: 'Important: Wireless Debugging requires an active Wi-Fi connection. It will not toggle on mobile cellular data.',
      },
      {
        heading: 'Step 2: Pair Shizuku in Split-Screen Mode',
        body: [
          'Open Shizuku, tap "Pairing" under "Start via Wireless Debugging", and tap "Developer Options".',
          'Put Developer Options and Shizuku into split-screen mode or open Developer Options as a floating window.',
          'In Developer Options, tap "Pair device with pairing code". Note the 6-digit Wi-Fi pairing code.',
          'Pull down your notification shade, tap the Shizuku pairing notification, enter the 6 digits, and tap Send.',
        ],
      },
      {
        heading: 'Step 3: Start the Service and Authorize Apps',
        body: [
          'Switch back to Shizuku and tap "Start". In under 3 seconds, the terminal logs scroll and Shizuku displays "Shizuku is running (Version 13+, ADB mode)".',
          'Now open any companion app, such as App Manager or Hail. When prompted for permissions, tap "Grant via Shizuku".',
        ],
        callout: 'Notice: If your phone restarts, Android terminates active ADB background processes. Simply re-open Shizuku on Wi-Fi and tap "Start" (no re-pairing required).',
      },
    ],
  },
  'mac-keyboard-shortcuts-power-user': {
    slug: 'mac-keyboard-shortcuts-power-user',
    title: 'Mastering macOS Keyboard Navigation for Windows Switchers',
    summary: 'A practical guide to bridging muscle memory between Windows and macOS: Option vs Command navigation, window snapping, and app switching.',
    readTime: '4 min read',
    lastUpdated: 'October 2026',
    author: 'Dhrumil Aslaliya',
    relatedToolSlug: 'mac-windows-shortcut-translator',
    relatedToolName: 'Mac & Windows Shortcut Translator',
    sections: [
      {
        heading: 'The Core Difference: Command vs Control',
        body: [
          'On Windows, the Ctrl key does nearly everything: Ctrl+C to copy, Ctrl+V to paste, Ctrl+Z to undo, and Ctrl+F to find. On macOS, this primary modifier is Command (Cmd / ⌘).',
          'The Mac Control (Ctrl / ⌃) key is reserved for Unix terminal signals and contextual menus. The Command key is placed directly next to the spacebar, designed to be pressed naturally with your thumb rather than curling your pinky finger.',
        ],
      },
      {
        heading: 'Mastering Text Navigation with Option and Command',
        body: [
          'Mac word and paragraph jumping is faster and more consistent than Windows once understood:',
          'Option + Left/Right Arrow jumps forward or backward by one full word.',
          'Command + Left/Right Arrow jumps immediately to the beginning or end of the current line.',
          'Command + Up/Down Arrow jumps immediately to the very top or bottom of the entire document.',
          'Adding Shift to any of these combinations extends your text selection highlighted.',
        ],
        callout: 'Tip: Option + Backspace deletes the entire previous word, while Command + Backspace deletes the entire line to the left of the cursor.',
      },
      {
        heading: 'Fixing the Application vs Window Switcher (Cmd+Tab)',
        body: [
          'On Windows, Alt+Tab switches between every open window. On macOS, Cmd+Tab switches between applications. If you have four Safari windows open, Cmd+Tab shows only one Safari icon.',
          'To fix this, install the free open-source utility AltTab (brew install --cask alt-tab). It restores Windows-style window switching with high-resolution thumbnail previews.',
        ],
      },
      {
        heading: 'Window Snapping and Spotlight Replacement',
        body: [
          'Windows Snap (Win + Arrow keys) is sorely missed on older macOS versions. Install Rectangle (brew install --cask rectangle) to get instant snapping with Ctrl+Option+Left/Right/Enter.',
          'Upgrade from default Spotlight to Raycast (brew install --cask raycast) to gain a supercharged launcher with integrated clipboard history, window tiling, and calculator conversions.',
        ],
      },
    ],
  },
  'check-ssd-health-smart-guide': {
    slug: 'check-ssd-health-smart-guide',
    title: 'How to Check SSD and Hard Drive Health with S.M.A.R.T. Telemetry',
    summary: 'Learn how to read SSD wear percentage, reallocated bad sectors, and total bytes written (TBW) before catastrophic drive failure occurs.',
    readTime: '4 min read',
    lastUpdated: 'October 2026',
    author: 'Dhrumil Aslaliya',
    relatedToolSlug: 'drive-health-reader',
    relatedToolName: 'Drive Health S.M.A.R.T. Reader',
    sections: [
      {
        heading: 'Why Solid State Drives Fail Silently',
        body: [
          'Traditional mechanical hard drives gave warning signs before death: clicking noises, grinding platters, and slow seek times. Solid State Drives (NVMe and SATA SSDs) fail silently with zero audible cues.',
          'Every storage drive features an internal monitoring system called S.M.A.R.T. (Self-Monitoring, Analysis and Reporting Technology). It tracks raw hardware metrics inside the drive microcontroller.',
        ],
      },
      {
        heading: 'The 3 Most Critical SSD S.M.A.R.T. Attributes',
        body: [
          '1. Available Spare: On NVMe drives, NAND flash cells wear out over time. Drives reserve spare factory blocks to replace worn cells. If "Available Spare" drops below 10%, drive replacement is urgent.',
          '2. Percentage Used: Reports the percentage of rated factory endurance consumed. 0% means brand new; 100% means the drive has reached its manufacturer TBW endurance rating.',
          '3. Media and Data Integrity Errors: Any value above 0 indicates unrecoverable data corruptions or NAND read failures. If this counter increases, back up your files immediately.',
        ],
        callout: 'Mechanical Drives: On older HDDs, watch Attribute 05 (Reallocated Sectors Count) and Attribute C5 (Current Pending Sector Count). Non-zero numbers indicate bad magnetic sectors.',
      },
      {
        heading: 'How to Extract Your S.M.A.R.T. Log',
        body: [
          'On Windows, download the open-source utility CrystalDiskInfo (or run "smartctl -a /dev/nvme0" in PowerShell). In CrystalDiskInfo, press Edit > Copy to copy the complete raw hardware telemetry table to your clipboard.',
          'On macOS, install smartmontools via Homebrew ("brew install smartmontools") and run "smartctl -a disk0".',
        ],
      },
      {
        heading: 'Decode Your Log Instantly in Browser',
        body: [
          'Paste your raw diagnostic output into our Drive Health S.M.A.R.T. Reader. It parses raw hexadecimal counters, flags abnormal thermal thresholds, and calculates health scores locally in your browser with zero data uploads.',
        ],
      },
    ],
  },
  'autohotkey-v2-beginners-guide': {
    slug: 'autohotkey-v2-beginners-guide',
    title: 'Automate Daily Windows Clicks and Text Expansion with AutoHotkey v2',
    summary: 'How to write lightweight AutoHotkey v2 scripts to expand text snippets, remap awkward keys, and streamline repetitive workflow clicks.',
    readTime: '4 min read',
    lastUpdated: 'October 2026',
    author: 'Dhrumil Aslaliya',
    relatedToolSlug: 'autohotkey-script-generator',
    relatedToolName: 'AutoHotkey v2 Script Generator',
    sections: [
      {
        heading: 'Why AutoHotkey v2 is the Modern Automation Standard',
        body: [
          'AutoHotkey (AHK) is the premier keyboard macro and automation scripting language for Windows. In 2023, AutoHotkey completed a total ground-up rewrite: AutoHotkey v2.',
          'Legacy v1 was notorious for confusing syntax quirks (inconsistent quote marks and legacy command vs expression confusion). Version 2 introduces strict, consistent syntax with clean error handling, making it reliable for everyday productivity.',
        ],
      },
      {
        heading: 'Step 1: Install AutoHotkey v2 via winget',
        body: [
          'Open Windows Terminal or PowerShell and run: "winget install AutoHotkey.AutoHotkey".',
          'This installs the modern v2 runtime and associates .ahk files with the official interpreter.',
        ],
      },
      {
        heading: 'Step 2: Create Instant Text Expansion (Hotstrings)',
        body: [
          'Hotstrings detect abbreviations you type and replace them instantly. Right-click on your desktop, select New > AutoHotkey Script, and name it "productivity.ahk".',
          'Add these lines to expand your email and today\'s date:',
          '::;email::yourname@company.com',
          '::;date:: {\\n    Send(FormatTime(A_Now, "yyyy-MM-dd"))\\n}',
          'Double-click the script to run it. Now whenever you type ";email", it instantly types your full address!',
        ],
        callout: 'Pro-Tip: Use a leading symbol like semicolon (;) or slash (/) in hotstrings so you never accidentally trigger replacements during normal typing.',
      },
      {
        heading: 'Step 3: Create Useful Desktop Hotkeys',
        body: [
          'Remap keys or create global shortcuts for everyday tasks:',
          '#b::Run("chrome.exe") ; Win + B launches browser',
          '^!t::WinSetAlwaysOnTop(-1, "A") ; Ctrl + Alt + T pins active window always on top',
          'The `#` symbol represents the Windows key, `^` is Ctrl, `!` is Alt, and `+` is Shift.',
        ],
      },
      {
        heading: 'Step 4: Run Your Script on Windows Startup',
        body: [
          'Press Win + R, type "shell:startup", and press Enter to open your Windows Startup folder.',
          'Right-click and drag your "productivity.ahk" script into this folder and select "Create shortcuts here". Now your custom shortcuts and text expansions launch automatically every time your PC turns on.',
        ],
      },
    ],
  },
};

export const POPULAR_GUIDES: GuideMeta[] = Object.values(GUIDE_ARTICLES);

