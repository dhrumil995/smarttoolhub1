import { WorkflowItem } from '../types';

export const SUPPLEMENTARY_WORKFLOWS: WorkflowItem[] = [
  {
    id: 'wf-safari-distraction-control-focus',
    slug: 'safari-distraction-control-clean-reading-mode',
    title: 'Safari Distraction Control: Clean Reading & Ad-Banner Vaporization',
    summary: 'Instantly hide annoying floating banners, sticky sign-up prompts, and video popups on any webpage in Safari on macOS Sequoia and iOS 18 with one tap.',
    persona: 'beginners',
    category: 'Productivity & Focus',
    devicesRequired: [
      { device: 'Mac (Apple Silicon or Intel)', minOS: 'macOS 15.0 Sequoia or later' },
      { device: 'iPhone or iPad', minOS: 'iOS 18.0 or iPadOS 18.0 or later' }
    ],
    appsUsed: ['Safari'],
    isBuiltInOnly: true,
    difficulty: 'Beginner',
    setupTimeMinutes: 2,
    requiredSettings: [
      'Safari running on iOS 18, iPadOS 18, or macOS 15 Sequoia.',
      'Active internet connection to load the desired web page.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Open Page & Click Safari Page Menu',
        instruction: 'Navigate to any media-heavy or article webpage in Safari. On Mac, click the Page Menu icon on the left edge of the Smart Search Field. On iPhone, tap the Page Settings icon (left of URL bar).'
      },
      {
        stepNumber: 2,
        title: 'Select "Hide Distracting Items"',
        instruction: 'Choose "Hide Distracting Items" from the dropdown. Safari will dim the webpage slightly and enter element selection mode.'
      },
      {
        stepNumber: 3,
        title: 'Click the Distracting Banner to Vaporize',
        instruction: 'Click or tap on the sticky header, promotional banner, or video autoplay player. An elegant particle dissolution effect vaporizes the element and restores clean content formatting.'
      },
      {
        stepNumber: 4,
        title: 'Done & Persistent Storage',
        instruction: 'Click Done in the Safari search field. Safari remembers your hidden item preferences for that domain permanently unless manually reset.'
      }
    ],
    commonProblems: [
      {
        issue: 'Hidden element reappears after refreshing page',
        solution: 'Some sites dynamically generate unique CSS IDs on reload. Click "Hide Distracting Items" again and select the parent container wrapper.'
      }
    ],
    privacyNotes: [
      'Zero telemetry: hidden CSS selectors are cached strictly in your local Safari preferences database and never transmitted to Apple.'
    ],
    alternativeWorkflow: {
      title: 'Third-Party AdBlock Extensions',
      description: 'Browser extensions like uBlock Origin or AdGuard.',
      tradeOff: 'Extensions run persistent background processes and inspect all DOM traffic; Safari Distraction Control is native and zero-overhead.'
    },
    officialDocLinks: [
      { title: 'Hide distracting items in Safari on iPhone (Apple Support)', url: 'https://support.apple.com/guide/iphone/hide-distracting-items-iph3be916fe1/ios', lastReviewed: '2026-09-10' }
    ],
    lastReviewedDate: '2026-09-10',
    tags: ['Safari', 'iOS 18', 'macOS Sequoia', 'Distraction Control', 'Reading', 'Focus']
  },
  {
    id: 'wf-apple-passwords-app-export-sync',
    slug: 'apple-passwords-cross-device-passkey-autofill',
    title: 'Apple Passwords App: Cross-Device Passkey & 2FA Autofill Mastery',
    summary: 'Consolidate passkeys, Wi-Fi network credentials, verification codes, and shared family credentials into Apple’s native Passwords app across Mac, iPhone, and Windows.',
    persona: 'beginners',
    category: 'Developer & Automation',
    devicesRequired: [
      { device: 'iPhone, iPad, or Mac', minOS: 'iOS 18.0 / iPadOS 18.0 / macOS 15.0 Sequoia' }
    ],
    appsUsed: ['Passwords native app', 'Safari', 'Chrome', 'iCloud for Windows'],
    isBuiltInOnly: true,
    difficulty: 'Beginner',
    setupTimeMinutes: 3,
    requiredSettings: [
      'iCloud Keychain enabled in Apple Account settings.',
      'Two-Factor Authentication active on Apple Account.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Launch the Passwords App',
        instruction: 'Launch the new standalone Passwords app from your Mac Applications folder or iPhone Home Screen, authenticated by Touch ID, Face ID, or your Mac passcode.'
      },
      {
        stepNumber: 2,
        title: 'Configure Built-in 2FA Verification Codes',
        instruction: 'Open any account, click "Set Up Verification Code...", and scan the QR code from the service. Passwords generates RFC 6238 TOTP tokens and auto-fills them in Safari.'
      },
      {
        stepNumber: 3,
        title: 'Create a Shared Password Family Group',
        instruction: 'Click the "+" button and select "New Shared Group". Invite trusted contacts to automatically sync streaming logins and home Wi-Fi keys with end-to-end encryption.'
      }
    ],
    commonProblems: [
      {
        issue: 'Autofill prompt not appearing in third-party browsers',
        solution: 'Install the official Apple "iCloud Passwords" extension for Google Chrome or Microsoft Edge to enable native autofill outside Safari.'
      }
    ],
    privacyNotes: [
      'End-to-end encrypted with Secure Enclave hardware root-of-trust; Apple cannot read your stored credentials or passkeys.'
    ],
    alternativeWorkflow: {
      title: '1Password / Bitwarden subscription',
      description: 'Commercial password management suites.',
      tradeOff: 'Commercial tools cost $3-$8/mo; Apple Passwords is built-in, completely free, and natively integrated into the OS security layer.'
    },
    officialDocLinks: [
      { title: 'Use the Passwords app on Mac (Apple Support)', url: 'https://support.apple.com/guide/passwords-mac/welcome/mac', lastReviewed: '2026-09-05' }
    ],
    lastReviewedDate: '2026-09-05',
    tags: ['Passwords', 'Passkeys', '2FA', 'iCloud Keychain', 'Security', 'macOS Sequoia']
  },
  {
    id: 'wf-photos-clean-up-apple-intelligence',
    slug: 'photos-clean-up-object-removal-apple-intelligence',
    title: 'Apple Photos Clean Up: Smart Object Removal with Apple Intelligence',
    summary: 'Remove background strangers, stray power lines, and unwanted distractions from images using on-device Apple Intelligence generative inpainting in Apple Photos.',
    persona: 'creators',
    category: 'Content Creation',
    devicesRequired: [
      { device: 'iPhone 15 Pro, iPhone 16 series, or Apple Silicon Mac', minOS: 'iOS 18.1 / macOS 15.1 or later' }
    ],
    appsUsed: ['Apple Photos'],
    isBuiltInOnly: true,
    difficulty: 'Beginner',
    setupTimeMinutes: 1,
    requiredSettings: [
      'Apple Intelligence toggled ON in System Settings.',
      'Photo stored in Apple Photos library.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Open Photo & Enter Edit Mode',
        instruction: 'Select any photo in Apple Photos and click "Edit" in the toolbar.'
      },
      {
        stepNumber: 2,
        title: 'Tap the Clean Up Eraser Tool',
        instruction: 'Click the "Clean Up" eraser icon. Apple Intelligence analyzes scene geometry, lighting, and texture maps.'
      },
      {
        stepNumber: 3,
        title: 'Brush or Circle the Distraction',
        instruction: 'Tap automatically highlighted objects or brush over unwanted elements. The Neural Engine synthetically reconstructs background patterns in real time.'
      }
    ],
    commonProblems: [
      {
        issue: 'Inpainting edge artifacts on complex textures',
        solution: 'Use a smaller brush radius and zoom in to apply Clean Up in multiple gentle micro-strokes rather than one large brush.'
      }
    ],
    privacyNotes: [
      'Clean Up inpainting runs locally on the Apple Silicon Neural Engine without cloud upload.'
    ],
    alternativeWorkflow: {
      title: 'Adobe Photoshop Generative Fill',
      description: 'Cloud-based inpainting in Photoshop.',
      tradeOff: 'Photoshop costs $239/year and requires full cloud uploads; Clean Up is instant and on-device.'
    },
    officialDocLinks: [
      { title: 'Clean Up photos with Apple Intelligence (Apple Support)', url: 'https://support.apple.com/en-us/HT213455', lastReviewed: '2026-09-15' }
    ],
    lastReviewedDate: '2026-09-15',
    tags: ['Photos', 'Clean Up', 'Apple Intelligence', 'Generative AI', 'Photo Editing', 'Creators']
  },
  {
    id: 'wf-iphone-fast-charge-battery-health',
    slug: 'iphone-fast-charging-optimization-battery-health',
    title: 'iPhone 16 Fast Charging Optimization & 80% Battery Limit Mastery',
    summary: 'Maximize charging speed while protecting battery health using optimal USB-C Power Delivery wattages and customizable iOS 18 charging thresholds.',
    persona: 'beginners',
    category: 'Developer & Automation',
    devicesRequired: [
      { device: 'iPhone 15 or iPhone 16 family', minOS: 'iOS 18.0 or later' },
      { device: 'USB-C 30W+ Power Adapter', minOS: 'USB Power Delivery 3.0 PPS' }
    ],
    appsUsed: ['iOS Settings', 'SmartToolHub Charging Calculator'],
    isBuiltInOnly: true,
    difficulty: 'Beginner',
    setupTimeMinutes: 2,
    requiredSettings: [
      'Settings > Battery > Charging Optimization configured to 80% or 85% limit.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Select USB-C Power Delivery 30W+ Brick',
        instruction: 'Use an Apple 30W USB-C or certified 45W/65W GaN PPS adapter for full peak charging throughput up to 27W-38W on iPhone 16 models.'
      },
      {
        stepNumber: 2,
        title: 'Set Granular 80%–95% Charge Threshold in iOS 18',
        instruction: 'Navigate to Settings > Battery > Charging. Drag the slider to 80% or 85% to halt lithium plating and thermal degradation.'
      },
      {
        stepNumber: 3,
        title: 'Monitor Slow Charger Warnings',
        instruction: 'In iOS 18, check the 24-hour battery chart. If a charging block is highlighted in amber, your charger is delivering less than 7.5W.'
      }
    ],
    commonProblems: [
      {
        issue: 'iPhone gets warm and halts charging at 80%',
        solution: 'This is normal iOS thermal protection. Remove heavy cases or charge in a cool area to resume high-speed current.'
      }
    ],
    privacyNotes: [
      'Battery telemetry is stored strictly in non-volatile system registers on the iPhone.'
    ],
    alternativeWorkflow: {
      title: 'Standard 5W overnight trickle charging',
      description: 'Slow charging with legacy 5W USB-A blocks.',
      tradeOff: 'Takes 4+ hours to charge; modern 30W PD with an 80% limit charges to 50% in 22 minutes with equal cycle life.'
    },
    officialDocLinks: [
      { title: 'iPhone Battery and Performance (Apple Support)', url: 'https://support.apple.com/en-us/HT208387', lastReviewed: '2026-09-01' }
    ],
    lastReviewedDate: '2026-09-01',
    tags: ['iPhone 16', 'Battery Health', 'Fast Charging', 'USB-C PD', 'Hardware']
  },
  {
    id: 'wf-voice-memos-audio-transcription',
    slug: 'voice-memos-audio-recording-automatic-transcription',
    title: 'Voice Memos to Text: Automatic Audio Transcription & Note Synthesis',
    summary: 'Record interviews, university lectures, or voice notes on iPhone and generate instant, timestamped transcriptions with speaker recognition in Apple Notes.',
    persona: 'students',
    category: 'Study & Research',
    devicesRequired: [
      { device: 'iPhone or iPad', minOS: 'iOS 18.0 / iPadOS 18.0 or later' },
      { device: 'Mac', minOS: 'macOS 15.0 Sequoia or later' }
    ],
    appsUsed: ['Voice Memos', 'Apple Notes'],
    isBuiltInOnly: true,
    difficulty: 'Beginner',
    setupTimeMinutes: 2,
    requiredSettings: [
      'Voice Memos iCloud sync enabled.',
      'Language set to supported transcription locale (e.g. English US/UK/AU).'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Record Inside Notes or Voice Memos',
        instruction: 'Open Apple Notes and tap the paperclip icon > "Record Audio", or record directly inside the Voice Memos app.'
      },
      {
        stepNumber: 2,
        title: 'Live Word-for-Word Transcription',
        instruction: 'As you speak, Apple Intelligence displays live synchronized transcriptions directly under the audio waveform in real time.'
      },
      {
        stepNumber: 3,
        title: 'Generate Instant Executive Summary',
        instruction: 'Tap the Speech bubble icon in Apple Notes and select "Summarize Transcript" to generate clean actionable bullets.'
      }
    ],
    commonProblems: [
      {
        issue: 'Transcription missing in noisy environments',
        solution: 'Enable "Voice Isolation" in iPhone Control Center during recording to remove background noise.'
      }
    ],
    privacyNotes: [
      'Speech recognition models run entirely on the Apple Neural Engine without transmitting raw audio to the cloud.'
    ],
    alternativeWorkflow: {
      title: 'Otter.ai subscription',
      description: 'Third-party cloud transcription service.',
      tradeOff: 'Otter requires paid tiers and stores private conversations on third-party servers; Apple Notes transcription is built-in and private.'
    },
    officialDocLinks: [
      { title: 'Record and transcribe audio in Notes (Apple Support)', url: 'https://support.apple.com/guide/iphone/record-and-transcribe-audio-iph9196b05be/ios', lastReviewed: '2026-09-08' }
    ],
    lastReviewedDate: '2026-09-08',
    tags: ['Voice Memos', 'Audio Transcription', 'Apple Notes', 'Students', 'Speech to Text']
  },
  {
    id: 'wf-notes-math-notes-calculator-sync',
    slug: 'ipad-apple-pencil-math-notes-graphing-calculator',
    title: 'iPadOS 18 Math Notes & Dynamic Graphing with Apple Pencil',
    summary: 'Write handwritten mathematical expressions with Apple Pencil in the Calculator or Notes app and watch iPadOS automatically evaluate variables and plot interactive graphs.',
    persona: 'students',
    category: 'Study & Research',
    devicesRequired: [
      { device: 'iPad (with Apple Pencil support)', minOS: 'iPadOS 18.0 or later' }
    ],
    appsUsed: ['Calculator', 'Notes', 'Apple Pencil'],
    isBuiltInOnly: true,
    difficulty: 'Beginner',
    setupTimeMinutes: 1,
    requiredSettings: [
      'Math Notes enabled in Calculator app.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Open Calculator & Switch to Math Notes',
        instruction: 'Open the native iPad Calculator app and tap the bottom-left icon to switch from Basic to "Math Notes".'
      },
      {
        stepNumber: 2,
        title: 'Write Equations & Variables Naturally',
        instruction: 'Write formulas like `velocity = 45 m/s` and `time = 12 s`. Write `distance = velocity * time =` and iPadOS will output the answer in your own handwriting font.'
      },
      {
        stepNumber: 3,
        title: 'Insert Live 2D Interactive Graphs',
        instruction: 'Write any function like `y = 2x^2 + 5x - 3` and tap "Insert Graph". Pinch and pan the graph to inspect real-time intercepts.'
      }
    ],
    commonProblems: [
      {
        issue: 'Equal sign does not trigger automatic calculation',
        solution: 'Ensure you write a standard horizontal equal sign (`=`) and pause for 0.5 seconds for the recognition engine to trigger.'
      }
    ],
    privacyNotes: [
      'Math evaluation and handwriting synthesis are executed 100% on-device.'
    ],
    alternativeWorkflow: {
      title: 'Wolfram Alpha or Desmos app',
      description: 'Online graphing calculator utilities.',
      tradeOff: 'External apps require manual syntax typing; Math Notes lets you write naturally with Apple Pencil inside your notebook.'
    },
    officialDocLinks: [
      { title: 'Solve math expressions in Calculator on iPad (Apple Support)', url: 'https://support.apple.com/guide/ipad/solve-math-expressions-ipad35faae0e/ipados', lastReviewed: '2026-09-12' }
    ],
    lastReviewedDate: '2026-09-12',
    tags: ['Math Notes', 'iPadOS 18', 'Apple Pencil', 'Graphing Calculator', 'STEM', 'Students']
  },
  {
    id: 'wf-apple-watch-auto-unlock-mac',
    slug: 'auto-unlock-mac-with-apple-watch-continuity',
    title: 'Auto-Unlock Mac & Touch ID Approvals with Apple Watch',
    summary: 'Bypass passwords and Touch ID prompts by authenticating with your unlocked Apple Watch whenever you wake your Mac or run sudo commands in Terminal.',
    persona: 'developers',
    category: 'Developer & Automation',
    devicesRequired: [
      { device: 'Mac (Apple Silicon or Intel 2013+)', minOS: 'macOS 10.12 or later' },
      { device: 'Apple Watch Series 3 or newer', minOS: 'watchOS 4 or later' }
    ],
    appsUsed: ['macOS System Settings', 'Terminal'],
    isBuiltInOnly: true,
    difficulty: 'Beginner',
    setupTimeMinutes: 2,
    requiredSettings: [
      'Two-Factor Authentication on Apple Account.',
      'Passcode enabled on Apple Watch.',
      'Wi-Fi and Bluetooth active on both devices.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Enable Auto-Unlock in Mac System Settings',
        instruction: 'On your Mac, open System Settings > Touch ID & Password (or Login Password). Under "Apple Watch", toggle ON your watch name.'
      },
      {
        stepNumber: 2,
        title: 'Confirm with Mac Administrator Password',
        instruction: 'Enter your Mac user password to establish an encrypted mutual proximity pairing certificate between the Secure Enclave and your Apple Watch.'
      },
      {
        stepNumber: 3,
        title: 'Unlock Mac and Approve Admin Prompts',
        instruction: 'Wake your Mac display while wearing your unlocked Apple Watch. You will feel a gentle haptic tap on your wrist and your Mac will unlock instantly.'
      }
    ],
    commonProblems: [
      {
        issue: 'Error: "Your Mac was unable to communicate with your Apple Watch"',
        solution: 'Toggle Bluetooth off and on in Mac Control Center, and toggle Airplane Mode on and off on Apple Watch to refresh the token cache.'
      }
    ],
    privacyNotes: [
      'Proximity validation uses Time-of-Flight (ToF) radio ranging to prevent relay attacks.'
    ],
    alternativeWorkflow: {
      title: 'Manual master password typing',
      description: 'Entering long complex passwords manually.',
      tradeOff: 'Typing 20-character passwords 40 times a day causes fatigue; Apple Watch maintains hardware security with sub-second biometric ease.'
    },
    officialDocLinks: [
      { title: 'Unlock your Mac with your Apple Watch (Apple Support)', url: 'https://support.apple.com/en-us/HT206995', lastReviewed: '2026-08-28' }
    ],
    lastReviewedDate: '2026-08-28',
    tags: ['Apple Watch', 'Auto Unlock', 'Security', 'Continuity', 'MacBook']
  },
  {
    id: 'wf-airplay-to-mac-studio-screen',
    slug: 'airplay-screen-mirroring-to-mac-studio-display',
    title: 'AirPlay to Mac: Stream iPad & iPhone Displays onto Studio Display',
    summary: 'Use your high-resolution Mac or external Studio Display as an AirPlay 2 receiver to present iOS apps, play videos, or test mobile responsive viewports.',
    persona: 'creators',
    category: 'Audio & Video Production',
    devicesRequired: [
      { device: 'Mac (2018 or later)', minOS: 'macOS 12 Monterey or later' },
      { device: 'iPhone or iPad', minOS: 'iOS 15 or later' }
    ],
    appsUsed: ['AirPlay 2', 'QuickTime Player'],
    isBuiltInOnly: true,
    difficulty: 'Beginner',
    setupTimeMinutes: 2,
    requiredSettings: [
      'System Settings > General > AirDrop & Handoff > AirPlay Receiver toggled ON.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Verify AirPlay Receiver on Mac',
        instruction: 'In Mac System Settings > General > AirDrop & Handoff, ensure "AirPlay Receiver" is turned ON, and set "Allow AirPlay for" to Current User or Anyone on Same Network.'
      },
      {
        stepNumber: 2,
        title: 'Swipe Down Control Center on iPhone/iPad',
        instruction: 'Swipe down from the top-right corner of your iOS device, tap the Screen Mirroring icon, and select your Mac name.'
      },
      {
        stepNumber: 3,
        title: 'Stream Video and System Audio with Zero Lag',
        instruction: 'Your mobile screen instantly mirrors in high definition with stereo audio routing directly through your Mac Studio or Studio Display speakers.'
      }
    ],
    commonProblems: [
      {
        issue: 'Mac does not appear in iOS Screen Mirroring list',
        solution: 'Make sure both devices have Wi-Fi turned on and are on the same subnet, or connect a USB-C cable for wired zero-latency mirroring.'
      }
    ],
    privacyNotes: [
      'AirPlay Receiver supports passcode protection to prevent unauthorized streaming.'
    ],
    alternativeWorkflow: {
      title: 'Third-party HDMI capture card',
      description: 'Using a Lightning-to-HDMI adapter into a USB capture card.',
      tradeOff: 'Hardware dongles cost $50-$100 and introduce cable clutter; AirPlay to Mac is native and completely wireless.'
    },
    officialDocLinks: [
      { title: 'Set up your Mac to be an AirPlay receiver (Apple Support)', url: 'https://support.apple.com/guide/mac-help/set-up-mac-to-be-an-airplay-receiver-mchlb2c56009/mac', lastReviewed: '2026-08-18' }
    ],
    lastReviewedDate: '2026-08-18',
    tags: ['AirPlay to Mac', 'Screen Mirroring', 'Studio Display', 'Presentations', 'Creators']
  },
  {
    id: 'wf-sips-batch-webp-image-optimization',
    slug: 'macos-sips-batch-image-converter-webp-heic',
    title: 'macOS Native sips: Sub-Millisecond Batch WebP & HEIC Converter',
    summary: 'Process hundreds of RAW, HEIC, and PNG images in seconds without third-party software using macOS built-in Scriptable Image Processing System (`sips`).',
    persona: 'developers',
    category: 'Content Creation',
    devicesRequired: [
      { device: 'Mac (Apple Silicon or Intel)', minOS: 'macOS 10.5 or later' }
    ],
    appsUsed: ['Terminal', 'Finder', 'Automator / Shortcuts'],
    isBuiltInOnly: true,
    difficulty: 'Intermediate',
    setupTimeMinutes: 3,
    requiredSettings: [
      'Terminal access in macOS.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Navigate to Image Directory',
        instruction: 'Open Terminal and change directory to your asset folder: `cd ~/Desktop/RawAssets`.'
      },
      {
        stepNumber: 2,
        title: 'Execute Batch sips Conversion Command',
        instruction: 'Run: `for img in *.png; do sips -s format webp -s formatOptions 85 "$img" --out "${img%.png}.webp"; done`. sips uses hardware CoreImage accelerators to convert 100 images in <2 seconds.'
      },
      {
        stepNumber: 3,
        title: 'Package into Finder Quick Action',
        instruction: 'Create an Apple Shortcuts Quick Action to trigger this command from Finder right-click contextual menus with one click.'
      }
    ],
    commonProblems: [
      {
        issue: 'sips command reports invalid format options',
        solution: 'Ensure formatOptions is specified between 0 and 100 for JPEG or WebP.'
      }
    ],
    privacyNotes: [
      'Runs completely offline on your Mac; zero images ever touch web converters or external servers.'
    ],
    alternativeWorkflow: {
      title: 'Online Cloud Image Converters',
      description: 'Websites that convert HEIC to PNG in the cloud.',
      tradeOff: 'Online converters compromise privacy and have file upload limits; sips is instant, free, and completely offline.'
    },
    officialDocLinks: [
      { title: 'sips man page (Apple Developer Documentation)', url: 'https://ss64.com/mac/sips.html', lastReviewed: '2026-08-20' }
    ],
    lastReviewedDate: '2026-08-20',
    tags: ['sips', 'Batch Processing', 'WebP', 'HEIC', 'macOS Terminal', 'Automation']
  },
  {
    id: 'wf-local-llama-ollama-apple-silicon',
    slug: 'run-local-llm-apple-silicon-unified-memory-ollama',
    title: 'Run 70B Local LLMs on Apple Silicon Unified Memory with Ollama',
    summary: 'Harness the massive memory bandwidth (up to 800 GB/s) of M-series Apple Silicon to run 8B, 32B, and 70B open-weights language models entirely offline with zero latency.',
    persona: 'developers',
    category: 'Developer & Automation',
    devicesRequired: [
      { device: 'Mac with Apple Silicon (M1/M2/M3/M4, 16GB–128GB Unified Memory)', minOS: 'macOS 13.0 or later' }
    ],
    appsUsed: ['Terminal', 'Ollama', 'Chatbox / Raycast'],
    isBuiltInOnly: false,
    difficulty: 'Intermediate',
    setupTimeMinutes: 5,
    requiredSettings: [
      'Apple Silicon Mac with Metal Acceleration enabled.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Install Ollama via Terminal',
        instruction: 'Run `brew install ollama` or download from official site, then launch the Ollama system service: `ollama serve`.'
      },
      {
        stepNumber: 2,
        title: 'Pull Quantized Model Tailored to Your RAM',
        instruction: 'For 16GB RAM: `ollama run llama3.2:3b` or `mistral`. For 36GB-64GB RAM: `ollama run deepseek-r1:14b` or `qwen2.5-coder:32b`. For 128GB+: `ollama run llama3.3:70b`.'
      },
      {
        stepNumber: 3,
        title: 'Connect to Native Shortcuts or Local API',
        instruction: 'Ollama exposes a native OpenAI-compatible local API on `http://localhost:11434/v1`. Query it via curl, Python, or Apple Shortcuts.'
      }
    ],
    commonProblems: [
      {
        issue: 'Model runs slowly on CPU instead of Metal GPU',
        solution: 'Check `ollama logs` to ensure Metal GPU support is detected. M-series chips allocate up to 75% of unified memory to Metal automatically.'
      }
    ],
    privacyNotes: [
      '100% private and air-gapped; no prompts, embeddings, or code snippets ever leave your Mac.'
    ],
    alternativeWorkflow: {
      title: 'Cloud AI APIs (OpenAI / Anthropic)',
      description: 'Commercial cloud LLM endpoints.',
      tradeOff: 'Cloud APIs charge per token and send private data over the internet; local Ollama on Apple Silicon is free and zero-leak.'
    },
    officialDocLinks: [
      { title: 'Apple Metal Performance Shaders for Machine Learning', url: 'https://developer.apple.com/metal/', lastReviewed: '2026-09-01' }
    ],
    lastReviewedDate: '2026-09-01',
    tags: ['Apple Silicon', 'Ollama', 'Local LLM', 'Metal Acceleration', 'AI', 'Developers']
  },
  {
    id: 'wf-meeting-mode-siri-shortcut-automation',
    slug: 'meeting-mode-dnd-slack-notes-shortcut',
    title: 'Automated Meeting Mode: DND, Slack Status & Timestamped Notes',
    summary: 'A 1-tap shortcut that detects active calendar meetings, sets your phone and Mac to Do Not Disturb, updates Slack to "In a Meeting", and prepares a clean Markdown meeting notes file.',
    persona: 'freelancers',
    category: 'Productivity & Focus',
    devicesRequired: [
      { device: 'iPhone, iPad, or Mac', minOS: 'iOS 16.0 / macOS 13.0 or later' }
    ],
    appsUsed: ['Shortcuts', 'Calendar', 'Slack', 'Apple Notes'],
    isBuiltInOnly: false,
    difficulty: 'Beginner',
    setupTimeMinutes: 3,
    requiredSettings: [
      'Shortcuts permissions granted for Calendar and Notes.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Fetch Current Calendar Event',
        instruction: 'Action: "Get Upcoming Events" where Start Date is within the next 5 minutes. Extract Event Title and Duration.'
      },
      {
        stepNumber: 2,
        title: 'Enable Do Not Disturb for Duration',
        instruction: 'Action: "Set Focus Mode" to Do Not Disturb until End Time of current event.'
      },
      {
        stepNumber: 3,
        title: 'Create Pre-Formatted Meeting Note',
        instruction: 'Action: "Create Note" in Apple Notes with title `# [Event Title] - [Date]`, listing attendees and action item checkboxes.'
      }
    ],
    commonProblems: [
      {
        issue: 'Shortcut fails if no calendar event is active',
        solution: 'Add an "If" condition: If events have no value, prompt user for custom duration (30m / 60m).'
      }
    ],
    privacyNotes: [
      'Runs locally via native iOS Shortcuts engine.'
    ],
    alternativeWorkflow: {
      title: 'Manual DND toggle and app closing',
      description: 'Remembering to manually mute phone and notify team.',
      tradeOff: 'Manual toggles get forgotten; the shortcut guarantees silence and focus with zero cognitive overhead.'
    },
    officialDocLinks: [
      { title: 'Shortcuts User Guide for Mac (Apple Support)', url: 'https://support.apple.com/guide/shortcuts-mac/welcome/mac', lastReviewed: '2026-08-15' }
    ],
    lastReviewedDate: '2026-08-15',
    tags: ['Meeting Mode', 'Shortcuts', 'Focus', 'Calendar', 'Productivity', 'Freelancers']
  },
  {
    id: 'wf-exif-metadata-scrubber-share-sheet',
    slug: 'ios-photo-exif-location-metadata-scrubber-shortcut',
    title: 'iOS Photo Privacy: Automatic GPS Location & EXIF Metadata Scrubber',
    summary: 'Protect your home address and privacy before posting photos to social media by scrubbing GPS coordinates, camera serial numbers, and device details right from the iOS Share Sheet.',
    persona: 'beginners',
    category: 'Developer & Automation',
    devicesRequired: [
      { device: 'iPhone or iPad', minOS: 'iOS 15.0 or later' }
    ],
    appsUsed: ['Shortcuts', 'Photos Share Sheet'],
    isBuiltInOnly: true,
    difficulty: 'Beginner',
    setupTimeMinutes: 2,
    requiredSettings: [
      'Shortcuts Share Sheet enabled.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Configure Shortcut Input for Images',
        instruction: 'Set Shortcut Input to accept Images from the iOS Share Sheet.'
      },
      {
        stepNumber: 2,
        title: 'Convert Image to Clean JPEG/PNG',
        instruction: 'Action: "Convert Image" to JPEG (Quality 90%, Preserve Metadata toggled OFF). This strips all GPS tags and EXIF data.'
      },
      {
        stepNumber: 3,
        title: 'Pass Cleaned Image to Destination',
        instruction: 'Action: "Share" the cleansed image directly into Messages, WhatsApp, or Twitter.'
      }
    ],
    commonProblems: [
      {
        issue: 'Shortcut does not appear in Share Sheet',
        solution: 'In Shortcuts, open shortcut details and verify "Show in Share Sheet" is checked.'
      }
    ],
    privacyNotes: [
      'Zero third-party code; your original high-res photo remains untouched in your Photos library.'
    ],
    alternativeWorkflow: {
      title: 'Third-party photo privacy apps',
      description: 'Ad-supported privacy tools from App Store.',
      tradeOff: 'Third-party apps show intrusive ads; this shortcut is 100% native, ad-free, and runs instantly.'
    },
    officialDocLinks: [
      { title: 'Use the Share sheet in Shortcuts on iPhone (Apple Support)', url: 'https://support.apple.com/guide/shortcuts/use-the-share-sheet-apd03b603847/ios', lastReviewed: '2026-08-10' }
    ],
    lastReviewedDate: '2026-08-10',
    tags: ['EXIF Scrubber', 'Photo Privacy', 'iOS Share Sheet', 'Shortcuts', 'Security']
  },
  {
    id: 'wf-daily-standup-reminders-slack-sync',
    slug: 'daily-standup-generator-apple-reminders-slack',
    title: 'Daily Standup Generator: Apple Reminders to Markdown Slack Post',
    summary: 'Automatically aggregate completed Apple Reminders from yesterday and calendar commitments for today into a clean 3-bullet asynchronous standup draft.',
    persona: 'developers',
    category: 'Productivity & Focus',
    devicesRequired: [
      { device: 'Mac, iPhone, or iPad', minOS: 'macOS 13.0 / iOS 16.0 or later' }
    ],
    appsUsed: ['Shortcuts', 'Reminders', 'Calendar', 'Slack'],
    isBuiltInOnly: true,
    difficulty: 'Intermediate',
    setupTimeMinutes: 3,
    requiredSettings: [
      'Reminders access granted in Shortcuts.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Fetch Completed Reminders from Past 24 Hours',
        instruction: 'Action: "Find Reminders" where Is Completed is True and Completion Date is in the last 1 day.'
      },
      {
        stepNumber: 2,
        title: 'Fetch Today Calendar Meetings',
        instruction: 'Action: "Find Calendar Events" where Start Date is Today.'
      },
      {
        stepNumber: 3,
        title: 'Format Text & Copy to Clipboard',
        instruction: 'Combine items into: `*Yesterday:* [items] \n*Today:* [items] \n*Blockers:* None` and copy to clipboard.'
      }
    ],
    commonProblems: [
      {
        issue: 'Reminders list includes personal lists',
        solution: 'Filter the Find Reminders action by List equals "Work" or "Sprint".'
      }
    ],
    privacyNotes: [
      'Clipboard text is copied locally and only transmitted when you manually paste into Slack.'
    ],
    alternativeWorkflow: {
      title: 'Manual memory typing',
      description: 'Writing standup updates from scratch every morning.',
      tradeOff: 'Takes 10 minutes and misses completed tasks; the shortcut generates the report in 1 second.'
    },
    officialDocLinks: [
      { title: 'Search for reminders on Mac (Apple Support)', url: 'https://support.apple.com/guide/reminders/search-reminders-remn6e22ba81/mac', lastReviewed: '2026-08-12' }
    ],
    lastReviewedDate: '2026-08-12',
    tags: ['Daily Standup', 'Reminders', 'Slack', 'Shortcuts', 'Productivity']
  },
  {
    id: 'wf-mac-studio-dual-6k-pro-display-setup',
    slug: 'mac-studio-m4-dual-6k-pro-display-xdr-daisy-chain',
    title: 'Mac Studio M4: Dual 6K Pro Display XDR Thunderbolt 5 Bus Topology',
    summary: 'Wire and configure dual 6K Apple Pro Display XDR or Studio Displays over Thunderbolt 5 buses on Mac Studio to avoid PCIe bandwidth bottlenecks and GPU thermal throttling.',
    persona: 'creators',
    category: 'Developer & Automation',
    devicesRequired: [
      { device: 'Mac Studio or Mac Pro (M2/M3/M4)', minOS: 'macOS 14 Sonoma or macOS 15 Sequoia' },
      { device: '2x 5K/6K Thunderbolt Displays', minOS: 'Thunderbolt 4/5 certified cables' }
    ],
    appsUsed: ['macOS System Settings', 'Display Menu', 'ColorSync Utility'],
    isBuiltInOnly: true,
    difficulty: 'Intermediate',
    setupTimeMinutes: 4,
    requiredSettings: [
      'Each high-bandwidth display connected to independent Thunderbolt buses.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Identify Discrete Thunderbolt Buses',
        instruction: 'On Mac Studio, rear Thunderbolt ports share separate PCIe controllers. Plug Display 1 into Bus 0 (Port 1) and Display 2 into Bus 1 (Port 3) to guarantee full 40Gbps-80Gbps per line.'
      },
      {
        stepNumber: 2,
        title: 'Set Reference Presets in Displays Panel',
        instruction: 'Open System Settings > Displays. Choose "Apple Display (P3-1600 nits)" for HDR grading or "Photography (P3-D65)" for web graphic design.'
      },
      {
        stepNumber: 3,
        title: 'Calibrate Arrangement and Night Shift Alignment',
        instruction: 'Drag display icons to reflect physical desk placement and enable "True Tone" and "Automatically adjust brightness".'
      }
    ],
    commonProblems: [
      {
        issue: 'Display flickers or runs at 30Hz instead of 60Hz',
        solution: 'Replace standard USB-C charging cables with active certified 40Gbps Thunderbolt 4/5 cables bearing the lightning bolt icon.'
      }
    ],
    privacyNotes: [
      'Hardware display handshake protocols run strictly via DisplayPort Alt Mode over USB Type-C.'
    ],
    alternativeWorkflow: {
      title: 'Daisy-chaining through external USB-C docks',
      description: 'Routing two 6K screens through a third-party hub.',
      tradeOff: 'Single-cable hubs choke total display bandwidth and limit refresh rates; direct Thunderbolt bus wiring provides 100% uncompressed pixels.'
    },
    officialDocLinks: [
      { title: 'Use multiple displays with Mac Studio (Apple Support)', url: 'https://support.apple.com/en-us/HT213073', lastReviewed: '2026-09-02' }
    ],
    lastReviewedDate: '2026-09-02',
    tags: ['Mac Studio', 'Thunderbolt 5', 'Pro Display XDR', 'Studio Display', 'Hardware', 'Creators']
  },
  {
    id: 'wf-ipad-pro-m4-stage-manager-monitor',
    slug: 'ipad-pro-m4-stage-manager-external-monitor-multitasking',
    title: 'iPad Pro M4 Stage Manager: Full 6K External Monitor Desktop Rig',
    summary: 'Turn your M4 iPad Pro into a complete desktop computer with full-screen external 4K/6K monitor support, freeform window resizing, and multi-audio output via Stage Manager.',
    persona: 'freelancers',
    category: 'Productivity & Focus',
    devicesRequired: [
      { device: 'iPad Air (M1+) or iPad Pro (M1/M2/M4)', minOS: 'iPadOS 16.2 or later (iPadOS 18 recommended)' },
      { device: 'External USB-C/Thunderbolt Monitor, Keyboard & Mouse', minOS: 'DisplayPort 1.4 over USB-C' }
    ],
    appsUsed: ['Stage Manager', 'Files', 'Safari', 'Final Cut Pro for iPad'],
    isBuiltInOnly: true,
    difficulty: 'Beginner',
    setupTimeMinutes: 2,
    requiredSettings: [
      'Stage Manager enabled in iPad Control Center.',
      'External mouse and keyboard connected.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Connect iPad Pro to Monitor via USB-C',
        instruction: 'Plug your iPad Pro into your external display using a high-speed Thunderbolt cable. The monitor displays an extended desktop workspace instead of letterboxed mirroring.'
      },
      {
        stepNumber: 2,
        title: 'Open Multiple Apps Across Both Displays',
        instruction: 'Run up to 4 concurrent window groups on your iPad screen and 4 additional resizable windows on the external monitor.'
      },
      {
        stepNumber: 3,
        title: 'Configure Display Scaling & Audio Output',
        instruction: 'In iPad Settings > Display & Brightness > Arrangement, arrange your screen layout and select "More Space" display scaling.'
      }
    ],
    commonProblems: [
      {
        issue: 'Display only mirrors instead of extending',
        solution: 'An external keyboard and mouse or trackpad MUST be connected for iPadOS to activate extended desktop mode.'
      }
    ],
    privacyNotes: [
      'Hardware encryption is preserved across external displays; apps cannot capture unauthorized frame buffers.'
    ],
    alternativeWorkflow: {
      title: 'Carrying a heavy MacBook laptop',
      description: 'Taking both a Mac and iPad on business trips.',
      tradeOff: 'M4 iPad Pro weighs under 1 lb and delivers desktop multi-window workflows with all-day battery life.'
    },
    officialDocLinks: [
      { title: 'Connect iPad to an external display (Apple Support)', url: 'https://support.apple.com/guide/ipad/connect-to-a-display-ipad42f36d40/ipados', lastReviewed: '2026-08-30' }
    ],
    lastReviewedDate: '2026-08-30',
    tags: ['iPad Pro M4', 'Stage Manager', 'External Display', 'Multitasking', 'Productivity']
  },
  {
    id: 'wf-homekit-morning-wakeup-scene',
    slug: 'homekit-smart-home-morning-wake-up-adaptive-lighting',
    title: 'Apple HomeKit: Adaptive Morning Wake-Up Scene & Gentle Lighting',
    summary: 'Synchronize HomeKit smart bulbs, blinds, and HomePod ambient soundscapes with your iPhone Sleep Alarm to wake up naturally to sunrise color temperatures.',
    persona: 'beginners',
    category: 'Productivity & Focus',
    devicesRequired: [
      { device: 'iPhone or Apple Watch', minOS: 'iOS 16.0 or later' },
      { device: 'HomeKit Hub (Apple TV or HomePod) & HomeKit Bulbs', minOS: 'Matter / Thread enabled' }
    ],
    appsUsed: ['Apple Home', 'Shortcuts', 'Health'],
    isBuiltInOnly: true,
    difficulty: 'Beginner',
    setupTimeMinutes: 3,
    requiredSettings: [
      'Apple Home Sleep schedule active in Apple Health.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Create "Good Morning" Scene in Home App',
        instruction: 'Open Home app, tap "+" > "Add Scene" > "Good Morning". Set bedroom lights to 20% warm sunrise hue and schedule blinds to open.'
      },
      {
        stepNumber: 2,
        title: 'Link Scene to Sleep Alarm Dismissal',
        instruction: 'In Shortcuts, create a Personal Automation: "When my Sleep Alarm is stopped" > Run "Good Morning" Scene.'
      },
      {
        stepNumber: 3,
        title: 'Stream HomePod Morning Briefing',
        instruction: 'Add an action to HomePod to softly read today weather, commute time, and first calendar appointment.'
      }
    ],
    commonProblems: [
      {
        issue: 'Accessories show "No Response" in Home app',
        solution: 'Restart your Thread border router (Apple TV 4K or HomePod mini) to restore local mesh connectivity.'
      }
    ],
    privacyNotes: [
      'HomeKit automation data and camera streams are fully end-to-end encrypted through your local Home Hub.'
    ],
    alternativeWorkflow: {
      title: 'Jarring audible beeping alarms',
      description: 'Loud acoustic alarm clocks.',
      tradeOff: 'Loud alarms spike cortisol; gradual sunrise illumination wakes you during light sleep cycles.'
    },
    officialDocLinks: [
      { title: 'Create scenes and automations in Home (Apple Support)', url: 'https://support.apple.com/guide/iphone/create-scenes-and-automations-iph52a927a7c/ios', lastReviewed: '2026-08-14' }
    ],
    lastReviewedDate: '2026-08-14',
    tags: ['HomeKit', 'Smart Home', 'Adaptive Lighting', 'Morning Routine', 'Shortcuts']
  },
  {
    id: 'wf-encrypted-apfs-time-machine-nas',
    slug: 'encrypted-apfs-time-machine-network-nas-backup',
    title: 'APFS Network Time Machine: Hardware-Encrypted TrueNAS Backup',
    summary: 'Configure hourly, zero-touch network backups from your MacBook over SMB with APFS case-sensitive encryption to a local NAS or Synology server.',
    persona: 'developers',
    category: 'Developer & Automation',
    devicesRequired: [
      { device: 'Mac running macOS 11 Big Sur or newer', minOS: 'macOS 15 Sequoia recommended' },
      { device: 'Local NAS (Synology, TrueNAS, QNAP, or Mac mini server)', minOS: 'SMB 3.1.1 with Apple Time Machine extensions' }
    ],
    appsUsed: ['Time Machine', 'Finder', 'Disk Utility'],
    isBuiltInOnly: true,
    difficulty: 'Intermediate',
    setupTimeMinutes: 5,
    requiredSettings: [
      'NAS configured with dedicated Time Machine SMB user quota.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Connect to NAS via SMB in Finder',
        instruction: 'In Finder, press ⌘ + K and connect to `smb://nas.local/TimeMachine`. Authenticate with your dedicated backup credentials.'
      },
      {
        stepNumber: 2,
        title: 'Select Disk in Time Machine System Settings',
        instruction: 'Go to System Settings > General > Time Machine. Click "Add Backup Disk..." and select your network share.'
      },
      {
        stepNumber: 3,
        title: 'Enable APFS Volume Hardware Encryption',
        instruction: 'Check "Encrypt Backups" and establish a strong recovery passphrase. Your Mac encrypts all sparsebundles locally before sending packets across Wi-Fi.'
      }
    ],
    commonProblems: [
      {
        issue: 'Time Machine reports "Backup volume is read-only"',
        solution: 'Check SMB permissions on the NAS share and ensure the time machine user has write privileges.'
      }
    ],
    privacyNotes: [
      'Sparsebundle encrypted with AES-256-XTS; unauthorized NAS administrators cannot access your personal files.'
    ],
    alternativeWorkflow: {
      title: 'Plugging in an external USB hard drive',
      description: 'Manually connecting a portable drive each day.',
      tradeOff: 'Laptops rarely stay plugged into physical drives; wireless network Time Machine operates silently in the background whenever home.'
    },
    officialDocLinks: [
      { title: 'Back up your Mac with Time Machine (Apple Support)', url: 'https://support.apple.com/en-us/HT201250', lastReviewed: '2026-08-25' }
    ],
    lastReviewedDate: '2026-08-25',
    tags: ['Time Machine', 'APFS', 'NAS', 'Backup', 'Encryption', 'Security']
  },
  {
    id: 'wf-xcode-wireless-ios-device-debugging',
    slug: 'xcode-wireless-ios-device-debugging',
    title: 'Xcode 16 Wireless Debugging: Deploy to iPhone & iPad Over Wi-Fi',
    summary: 'Deploy, build, test, and profile iOS apps directly on physical devices without keeping your phone tethered via USB cables using Xcode 16 wireless Bonjour pairing.',
    persona: 'developers',
    category: 'Developer & Automation',
    devicesRequired: [
      { device: 'Mac with Xcode 15 or 16', minOS: 'macOS 14 Sonoma or macOS 15 Sequoia' },
      { device: 'iPhone or iPad', minOS: 'iOS 16+ with Developer Mode enabled' }
    ],
    appsUsed: ['Xcode', 'Instruments', 'Console'],
    isBuiltInOnly: true,
    difficulty: 'Intermediate',
    setupTimeMinutes: 3,
    requiredSettings: [
      'iPhone Settings > Privacy & Security > Developer Mode turned ON.',
      'Both devices on same local 5GHz Wi-Fi network.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Initial Cable Pairing in Xcode',
        instruction: 'Plug iPhone into Mac via USB cable once. In Xcode, open Window > Devices and Simulators (Shift + ⌘ + 2).'
      },
      {
        stepNumber: 2,
        title: 'Check "Connect via Network"',
        instruction: 'Select your iPhone in the left sidebar and check the "Connect via Network" checkbox. A globe icon appears next to the device name.'
      },
      {
        stepNumber: 3,
        title: 'Unplug and Build Wirelessly',
        instruction: 'Disconnect the cable. Press ⌘ + R in Xcode. The project compiles and deploys straight over Wi-Fi with live LLDB console output.'
      }
    ],
    commonProblems: [
      {
        issue: 'Device shows network globe icon with yellow triangle',
        solution: 'Make sure client isolation is disabled on your office Wi-Fi router so the Mac can reach port 50000 on the iPhone.'
      }
    ],
    privacyNotes: [
      'Encrypted TLS session authenticated with Apple Developer Certificate keys.'
    ],
    alternativeWorkflow: {
      title: 'Constant USB cable tethering',
      description: 'Leaving phone plugged in all day during development.',
      tradeOff: 'Cables wear out and degrade battery cycle life by keeping iPhone at 100% heat; wireless debugging allows free testing anywhere.'
    },
    officialDocLinks: [
      { title: 'Running your app on a physical device (Apple Developer)', url: 'https://developer.apple.com/documentation/xcode/running-your-app-in-the-simulator-or-on-a-device', lastReviewed: '2026-08-22' }
    ],
    lastReviewedDate: '2026-08-22',
    tags: ['Xcode', 'iOS Development', 'Wireless Debugging', 'Developers', 'Swift']
  },
  {
    id: 'wf-apple-health-auto-workout-logger',
    slug: 'apple-health-automated-workout-hydration-shortcut',
    title: 'Apple Health Automated Workout Logging & Daily Hydration Tracker',
    summary: 'Log hydration, caffeine consumption, and strength training sets into Apple Health with quick Siri phrases or Action Button taps without opening third-party calorie apps.',
    persona: 'beginners',
    category: 'Productivity & Focus',
    devicesRequired: [
      { device: 'iPhone or Apple Watch', minOS: 'iOS 16.0 or watchOS 9.0+' }
    ],
    appsUsed: ['Shortcuts', 'Apple Health', 'Action Button'],
    isBuiltInOnly: true,
    difficulty: 'Beginner',
    setupTimeMinutes: 2,
    requiredSettings: [
      'Health permissions granted to Shortcuts.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Create Log Water Shortcut Action',
        instruction: 'Action: "Log Health Sample" > Type: Water, Value: 500 mL, Date: Current Date.'
      },
      {
        stepNumber: 2,
        title: 'Assign to iPhone 15/16 Action Button or Apple Watch Complication',
        instruction: 'In Settings > Action Button, select "Shortcut" and pick your Hydration logger for 1-click execution.'
      },
      {
        stepNumber: 3,
        title: 'Verify Sync Across Health Rings',
        instruction: 'Open Health app to see your hydration bar updated alongside active calories and heart rate.'
      }
    ],
    commonProblems: [
      {
        issue: 'Health data permissions prompt not appearing',
        solution: 'Open iOS Settings > Privacy & Security > Health > Shortcuts and toggle Read & Write permissions to ON.'
      }
    ],
    privacyNotes: [
      'Health records remain encrypted on your device and are synced via encrypted iCloud keychain.'
    ],
    alternativeWorkflow: {
      title: 'Ad-heavy calorie tracking apps',
      description: 'Third-party fitness apps requiring paid subscriptions.',
      tradeOff: 'Third-party apps monetize personal health metrics; Apple Health native shortcuts are private, fast, and free.'
    },
    officialDocLinks: [
      { title: 'Track your health and fitness in Apple Health (Apple Support)', url: 'https://support.apple.com/en-us/HT203037', lastReviewed: '2026-08-16' }
    ],
    lastReviewedDate: '2026-08-16',
    tags: ['Apple Health', 'Shortcuts', 'Action Button', 'Hydration', 'Fitness']
  },
  {
    id: 'wf-low-power-mode-automation-battery-saver',
    slug: 'intelligent-low-power-mode-automation-shortcuts',
    title: 'Intelligent Battery Guard: Dynamic Low Power Mode Automation',
    summary: 'Configure an automatic iOS background trigger that enables Low Power Mode when battery drops below 30% and disables 5G cellular search, restoring full performance when charging.',
    persona: 'beginners',
    category: 'Developer & Automation',
    devicesRequired: [
      { device: 'iPhone or iPad', minOS: 'iOS 15.0 or later' }
    ],
    appsUsed: ['Shortcuts Personal Automation'],
    isBuiltInOnly: true,
    difficulty: 'Beginner',
    setupTimeMinutes: 2,
    requiredSettings: [
      'Personal Automation "Run Immediately" enabled.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Create Battery Level Trigger in Shortcuts',
        instruction: 'In Shortcuts, open Automation tab > New Automation > "Battery Level" > Select "Falls Below 30%".'
      },
      {
        stepNumber: 2,
        title: 'Add Battery Saving Actions',
        instruction: 'Add Action: "Set Low Power Mode" to ON. Add Action: "Set Cellular Data Voice & Data" to LTE (disabling battery-draining 5G search).'
      },
      {
        stepNumber: 3,
        title: 'Set Reverse Automation for Charger Connection',
        instruction: 'Create second automation: "When iPhone is connected to power" > Turn Low Power Mode OFF and restore 5G Auto.'
      }
    ],
    commonProblems: [
      {
        issue: 'Shortcut asks for confirmation before running',
        solution: 'In the automation details, toggle "Run Immediately" ON and toggle "Notify When Run" OFF.'
      }
    ],
    privacyNotes: [
      'Automation executes strictly within the iOS userland sandbox.'
    ],
    alternativeWorkflow: {
      title: 'Manual Low Power Mode toggling',
      description: 'Remembering to turn on battery saver when low.',
      tradeOff: 'Users frequently forget until their phone dies; automation prevents unexpected shutdowns.'
    },
    officialDocLinks: [
      { title: 'Use Low Power Mode to save battery life on iPhone (Apple Support)', url: 'https://support.apple.com/en-us/HT205234', lastReviewed: '2026-08-18' }
    ],
    lastReviewedDate: '2026-08-18',
    tags: ['Low Power Mode', 'Battery Saver', 'Shortcuts Automation', 'iPhone 16', 'iOS 18']
  },
  {
    id: 'wf-terminal-zsh-brew-auto-updater',
    slug: 'macos-zsh-homebrew-nightly-maintenance-pipeline',
    title: 'macOS Maintenance Pipeline: Automated Zsh & Homebrew Optimization',
    summary: 'Set up an automated overnight launchd daemon that updates Homebrew packages, clears expired system caches, and optimizes APFS drive storage with zero manual intervention.',
    persona: 'developers',
    category: 'Developer & Automation',
    devicesRequired: [
      { device: 'Mac (Apple Silicon or Intel)', minOS: 'macOS 12.0 or later' }
    ],
    appsUsed: ['Terminal', 'Homebrew', 'launchd', 'Zsh'],
    isBuiltInOnly: false,
    difficulty: 'Intermediate',
    setupTimeMinutes: 4,
    requiredSettings: [
      'Homebrew installed on Mac.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Write Maintenance Script in Zsh',
        instruction: 'Create `~/scripts/maintenance.sh`: `brew update && brew upgrade && brew cleanup -s && rm -rf ~/Library/Caches/Homebrew/*`.'
      },
      {
        stepNumber: 2,
        title: 'Make Executable',
        instruction: 'Run `chmod +x ~/scripts/maintenance.sh` in Terminal.'
      },
      {
        stepNumber: 3,
        title: 'Schedule with launchd Property List',
        instruction: 'Place a property list in `~/Library/LaunchAgents/com.user.maintenance.plist` scheduled to run at 3:00 AM nightly.'
      }
    ],
    commonProblems: [
      {
        issue: 'launchd fails due to missing PATH variables',
        solution: 'Explicitly specify `PATH=/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin` inside the plist script definition.'
      }
    ],
    privacyNotes: [
      'Runs locally with user-level privileges; no root sudo access needed for Homebrew maintenance.'
    ],
    alternativeWorkflow: {
      title: 'Commercial "CleanMyMac" utility apps',
      description: 'Paid third-party cleaner tools.',
      tradeOff: 'Paid cleaner apps cost $40/year and consume background RAM; a native Zsh script is free, auditable, and uses zero background memory.'
    },
    officialDocLinks: [
      { title: 'Creating Launch Daemons and Agents (Apple Developer)', url: 'https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPSystemStartup/Chapters/CreatingLaunchdJobs.html', lastReviewed: '2026-08-26' }
    ],
    lastReviewedDate: '2026-08-26',
    tags: ['Zsh', 'Homebrew', 'macOS Maintenance', 'Terminal', 'Automation', 'Developers']
  },
  {
    id: 'wf-audio-midi-multitrack-logic-pro',
    slug: 'aggregate-audio-device-logic-pro-podcasting',
    title: 'Logic Pro & Podcasting: Aggregate Multi-Track Audio Device Routing',
    summary: 'Combine multiple USB microphones and podcast inputs into a single virtual aggregate audio interface in macOS Audio MIDI Setup with zero sample rate drift.',
    persona: 'creators',
    category: 'Audio & Video Production',
    devicesRequired: [
      { device: 'Mac (Apple Silicon or Intel)', minOS: 'macOS 11.0 or later' },
      { device: '2+ USB Mics or Audio Interfaces', minOS: 'Core Audio compliant' }
    ],
    appsUsed: ['Audio MIDI Setup', 'Logic Pro', 'GarageBand', 'OBS'],
    isBuiltInOnly: true,
    difficulty: 'Intermediate',
    setupTimeMinutes: 4,
    requiredSettings: [
      'Drift Correction enabled on secondary audio clocks.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Open Audio MIDI Setup on Mac',
        instruction: 'Open Applications > Utilities > Audio MIDI Setup (or Spotlight: "Audio MIDI Setup").'
      },
      {
        stepNumber: 2,
        title: 'Create Aggregate Device',
        instruction: 'Click "+" at bottom left > "Create Aggregate Device". Check all USB microphones you wish to record simultaneously.'
      },
      {
        stepNumber: 3,
        title: 'Enable Drift Correction & Assign in DAW',
        instruction: 'Designate the main interface as Clock Source and check "Drift Correction" on the others. Open Logic Pro or GarageBand and select the Aggregate Device as Input.'
      }
    ],
    commonProblems: [
      {
        issue: 'Microphone audio drifts out of sync after 20 minutes',
        solution: 'Ensure Drift Correction is checked on all interfaces except the designated Master Clock device.'
      }
    ],
    privacyNotes: [
      'Core Audio handles hardware digital signal processing locally on the Apple Silicon audio subsystem.'
    ],
    alternativeWorkflow: {
      title: 'Buying a $400 hardware XLR mixer',
      description: 'Physical audio hardware mixers.',
      tradeOff: 'Hardware mixers add bulk and expense; macOS Core Audio handles multi-mic recording natively for free.'
    },
    officialDocLinks: [
      { title: 'Create an Aggregate Device in Audio MIDI Setup on Mac (Apple Support)', url: 'https://support.apple.com/en-us/HT202000', lastReviewed: '2026-08-19' }
    ],
    lastReviewedDate: '2026-08-19',
    tags: ['Audio MIDI Setup', 'Logic Pro', 'Podcasting', 'Microphones', 'Creators']
  },
  {
    id: 'wf-freeform-realtime-collaboration-canvas',
    slug: 'freeform-board-realtime-collaboration-facetime',
    title: 'Apple Freeform: Infinite Brainstorm Canvas with FaceTime SharePlay',
    summary: 'Collaborate live with clients or study groups on an infinite vector canvas, dropping PDF wireframes, live web links, and handwritten Apple Pencil sketches during a FaceTime call.',
    persona: 'creators',
    category: 'Study & Research',
    devicesRequired: [
      { device: 'Mac, iPad, or iPhone', minOS: 'macOS 13.1 / iOS 16.2 or later' }
    ],
    appsUsed: ['Freeform', 'FaceTime SharePlay'],
    isBuiltInOnly: true,
    difficulty: 'Beginner',
    setupTimeMinutes: 2,
    requiredSettings: [
      'Freeform iCloud sync active.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Start FaceTime Call & Open Freeform',
        instruction: 'Start a FaceTime call with your collaborator and open the native Freeform app.'
      },
      {
        stepNumber: 2,
        title: 'Share Board via SharePlay',
        instruction: 'Tap the Share icon > "Collaborate" and select your active FaceTime call. Collaborators join the board with live cursor indicators.'
      },
      {
        stepNumber: 3,
        title: 'Export Vector Canvas as High-Res PDF',
        instruction: 'When finished, click File > "Export as PDF" to preserve razor-sharp vector lines for client presentations.'
      }
    ],
    commonProblems: [
      {
        issue: 'Changes not showing for collaborators',
        solution: 'Check iCloud Settings > Freeform and ensure iCloud Drive sync is enabled for all participants.'
      }
    ],
    privacyNotes: [
      'Board data and SharePlay streams are encrypted during transit and at rest in iCloud.'
    ],
    alternativeWorkflow: {
      title: 'Miro / FigJam subscriptions',
      description: 'Third-party collaborative whiteboards.',
      tradeOff: 'Miro charges $8/user/mo and limits boards; Freeform is free, unlimited, and natively supports Apple Pencil low-latency ink.'
    },
    officialDocLinks: [
      { title: 'Collaborate on a Freeform board on Mac (Apple Support)', url: 'https://support.apple.com/guide/freeform/collaborate-on-a-board-frfma2ea11a5/mac', lastReviewed: '2026-08-21' }
    ],
    lastReviewedDate: '2026-08-21',
    tags: ['Freeform', 'SharePlay', 'FaceTime', 'Collaboration', 'Apple Pencil', 'Creators']
  },
  {
    id: 'wf-reminders-groceries-auto-categorization',
    slug: 'smart-grocery-list-auto-categorization-reminders',
    title: 'Apple Reminders: Smart Grocery List & Automatic Section Sorting',
    summary: 'Turn your grocery shopping into an organized trip with Apple Reminders automatic section sorting, grouping milk, produce, and bakery items into aisle headers automatically.',
    persona: 'beginners',
    category: 'Productivity & Focus',
    devicesRequired: [
      { device: 'iPhone, Apple Watch, or Mac', minOS: 'iOS 17.0 / watchOS 10.0 / macOS 14.0' }
    ],
    appsUsed: ['Reminders', 'Apple Watch'],
    isBuiltInOnly: true,
    difficulty: 'Beginner',
    setupTimeMinutes: 1,
    requiredSettings: [
      'Reminders list type set to "Groceries".'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Create List with "Groceries" List Type',
        instruction: 'Open Reminders > Add List > Name it "Groceries". Change "List Type" from Standard to "Groceries".'
      },
      {
        stepNumber: 2,
        title: 'Add Items Naturally via Siri or Typing',
        instruction: 'Say: "Add olive oil, sourdough bread, and avocados to my grocery list". Reminders sorts them into Dairy, Bakery, and Produce automatically.'
      },
      {
        stepNumber: 3,
        title: 'Check Off Items on Apple Watch',
        instruction: 'Use the Apple Watch Reminders app in the store. Completed items collapse cleanly into the bottom completed drawer.'
      }
    ],
    commonProblems: [
      {
        issue: 'Item sorts into wrong section',
        solution: 'Drag the item to the correct section header once. Reminders learns your preference for future entries.'
      }
    ],
    privacyNotes: [
      'Classification algorithms run on-device using local language dictionaries.'
    ],
    alternativeWorkflow: {
      title: 'Third-party shopping list apps',
      description: 'Apps like AnyList or Bring.',
      tradeOff: 'Third-party apps require sign-ups and show ads; Apple Reminders is instant, clean, and syncs across family members.'
    },
    officialDocLinks: [
      { title: 'Use grocery lists in Reminders on iPhone (Apple Support)', url: 'https://support.apple.com/guide/iphone/use-grocery-lists-iph90642f88d/ios', lastReviewed: '2026-08-11' }
    ],
    lastReviewedDate: '2026-08-11',
    tags: ['Apple Reminders', 'Groceries', 'Smart Lists', 'Apple Watch', 'Productivity']
  },
  {
    id: 'wf-safari-tab-groups-work-profiles',
    slug: 'safari-profiles-and-tab-groups-client-separation',
    title: 'Safari Profiles & Tab Groups: Air-Tight Freelance Workspace Isolation',
    summary: 'Separate cookies, browsing history, extensions, and bookmarks between work, personal, and client projects using native Safari Profiles and cloud-synced Tab Groups.',
    persona: 'freelancers',
    category: 'Productivity & Focus',
    devicesRequired: [
      { device: 'Mac, iPhone, and iPad', minOS: 'macOS 14.0 / iOS 17.0 or later' }
    ],
    appsUsed: ['Safari'],
    isBuiltInOnly: true,
    difficulty: 'Beginner',
    setupTimeMinutes: 2,
    requiredSettings: [
      'Safari iCloud sync active.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Create Profiles in Safari Settings',
        instruction: 'In Safari > Settings > Profiles, click "New Profile". Name it "Client Work", choose an icon and color, and select distinct favorite bookmarks.'
      },
      {
        stepNumber: 2,
        title: 'Log Into Independent Accounts',
        instruction: 'Log into Google Workspace or GitHub in your Work profile without logging out of personal accounts in your Default profile.'
      },
      {
        stepNumber: 3,
        title: 'Organize Research in Tab Groups',
        instruction: 'Right-click tabs > "Move to Tab Group". Tab groups sync instantly to your iPhone and iPad for on-the-go review.'
      }
    ],
    commonProblems: [
      {
        issue: 'Extensions disabled in new profile',
        solution: 'In Safari Settings > Profiles > Extensions, check the extensions you want enabled for that profile.'
      }
    ],
    privacyNotes: [
      'Cookies and website cache databases are strictly sandboxed per profile; cross-site trackers cannot correlate identities.'
    ],
    alternativeWorkflow: {
      title: 'Installing Chrome alongside Safari',
      description: 'Using separate browsers for work and home.',
      tradeOff: 'Chrome drains battery and lacks Apple Keychain integration; Safari profiles provide sandboxing with Apple Silicon battery efficiency.'
    },
    officialDocLinks: [
      { title: 'Use profiles in Safari on Mac (Apple Support)', url: 'https://support.apple.com/guide/safari/use-profiles-ibrw959146ec/mac', lastReviewed: '2026-08-24' }
    ],
    lastReviewedDate: '2026-08-24',
    tags: ['Safari Profiles', 'Tab Groups', 'Freelancers', 'Productivity', 'Security']
  },
  {
    id: 'wf-apple-fitness-shareplay-workout',
    slug: 'apple-fitness-plus-shareplay-group-workout',
    title: 'Apple Fitness+ SharePlay: Synchronized Group Workouts on Apple TV',
    summary: 'Exercise together with remote friends or workout partners over FaceTime with real-time Apple Watch heart rates and burn bar competition on Apple TV and iPad.',
    persona: 'beginners',
    category: 'Productivity & Focus',
    devicesRequired: [
      { device: 'Apple TV 4K, iPad, or iPhone', minOS: 'tvOS 15.1 / iOS 15.1 or later' },
      { device: 'Apple Watch Series 3 or newer', minOS: 'watchOS 8.0+' }
    ],
    appsUsed: ['Fitness+', 'FaceTime SharePlay'],
    isBuiltInOnly: true,
    difficulty: 'Beginner',
    setupTimeMinutes: 2,
    requiredSettings: [
      'Apple Fitness+ subscription active (or Family Sharing).'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Start FaceTime Call with Friends',
        instruction: 'Call up to 32 workout partners on FaceTime from your iPhone, iPad, or Mac.'
      },
      {
        stepNumber: 2,
        title: 'Launch Workout in Fitness App',
        instruction: 'Open Fitness app, choose HIIT, Strength, or Yoga, and tap "Let is Go". Tap SharePlay to synchronize music and video for everyone.'
      },
      {
        stepNumber: 3,
        title: 'Live Metrics on Shared Screen',
        instruction: 'See your friends workout rings celebrate in real time on screen alongside your Apple Watch heart rate.'
      }
    ],
    commonProblems: [
      {
        issue: 'Apple Watch metrics disconnected during workout',
        solution: 'Make sure Bluetooth is active and your Apple Watch is unlocked on your wrist.'
      }
    ],
    privacyNotes: [
      'Your individual heart rate and calorie burns are shared only with participants you explicitly invite to the call.'
    ],
    alternativeWorkflow: {
      title: 'Peloton group streaming app',
      description: 'Third-party connected gym subscription.',
      tradeOff: 'Peloton charges $44/mo; Apple Fitness+ is included in Apple One Premier and supports any equipment.'
    },
    officialDocLinks: [
      { title: 'Work out together using SharePlay in Fitness on iPhone (Apple Support)', url: 'https://support.apple.com/guide/iphone/work-out-together-using-shareplay-iph2807e32a6/ios', lastReviewed: '2026-08-15' }
    ],
    lastReviewedDate: '2026-08-15',
    tags: ['Fitness Plus', 'SharePlay', 'FaceTime', 'Apple Watch', 'Workouts']
  },
  {
    id: 'wf-screen-time-downtime-app-limits',
    slug: 'screen-time-downtime-and-app-limits-regimen',
    title: 'Strict Screen Time & Downtime Limits: Focus Regimen That Sticks',
    summary: 'Build an impenetrable digital minimalism regimen with iOS Screen Time, locking social apps after 30 minutes and silencing non-essential notifications during evening Downtime.',
    persona: 'students',
    category: 'Productivity & Focus',
    devicesRequired: [
      { device: 'iPhone, iPad, and Mac', minOS: 'iOS 15.0 / macOS 12.0 or later' }
    ],
    appsUsed: ['Screen Time', 'Settings'],
    isBuiltInOnly: true,
    difficulty: 'Beginner',
    setupTimeMinutes: 3,
    requiredSettings: [
      'Screen Time enabled with a dedicated Passcode.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Set App Limits for Social & Entertainment',
        instruction: 'Go to Settings > Screen Time > App Limits > Add Limit. Select "Social" and set time to 30 minutes.'
      },
      {
        stepNumber: 2,
        title: 'Block at End of Limit',
        instruction: 'Toggle ON "Block at End of Limit". When the timer runs out, access is strictly halted without easy 1-tap "Ignore" bypasses.'
      },
      {
        stepNumber: 3,
        title: 'Establish Scheduled Downtime',
        instruction: 'Set Downtime from 10:00 PM to 7:00 AM, allowing only Phone, Maps, and Messages from VIP contacts.'
      }
    ],
    commonProblems: [
      {
        issue: 'App limit easily bypassed with passcode prompt',
        solution: 'Have a trusted friend or partner set the 4-digit Screen Time passcode so you cannot bypass it during impulse moments.'
      }
    ],
    privacyNotes: [
      'Screen Time metrics are encrypted and synced strictly via your private iCloud account.'
    ],
    alternativeWorkflow: {
      title: 'Third-party app blockers (Opal, Forest)',
      description: 'Subscription blocker apps using local VPN profiles.',
      tradeOff: 'Third-party apps charge $60-$100/yr and install VPN configuration profiles; native Screen Time is built into the OS kernel.'
    },
    officialDocLinks: [
      { title: 'Use Screen Time on your iPhone or iPad (Apple Support)', url: 'https://support.apple.com/en-us/HT208982', lastReviewed: '2026-08-20' }
    ],
    lastReviewedDate: '2026-08-20',
    tags: ['Screen Time', 'Downtime', 'App Limits', 'Digital Minimalism', 'Focus']
  },
  {
    id: 'wf-mac-whisper-speech-to-text-coreml',
    slug: 'whisper-speech-to-text-transcription-apple-silicon-coreml',
    title: 'Whisper.cpp on Apple Silicon: Sub-Second Offline Audio Transcription',
    summary: 'Transcribe hours of podcast audio, meetings, and video footage with human-level accuracy in seconds using OpenAI Whisper optimized for Apple Silicon Metal & CoreML.',
    persona: 'developers',
    category: 'Developer & Automation',
    devicesRequired: [
      { device: 'Mac with Apple Silicon (M1/M2/M3/M4)', minOS: 'macOS 13.0 or later' }
    ],
    appsUsed: ['Terminal', 'whisper.cpp', 'CoreML'],
    isBuiltInOnly: false,
    difficulty: 'Intermediate',
    setupTimeMinutes: 4,
    requiredSettings: [
      'Command Line Tools installed (`xcode-select --install`).'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Clone & Build whisper.cpp with CoreML',
        instruction: 'Run: `git clone https://github.com/ggerganov/whisper.cpp && cd whisper.cpp && WHISPER_COREML=1 make -j`.'
      },
      {
        stepNumber: 2,
        title: 'Download Optimized CoreML Model',
        instruction: 'Run: `./models/download-ggml-model.sh base.en && ./models/generate-coreml-model.sh base.en`.'
      },
      {
        stepNumber: 3,
        title: 'Transcribe Audio at 16x Real-Time',
        instruction: 'Run: `./main -m models/ggml-base.en.bin -f ~/Desktop/interview.wav -otxt`. Generates clean text with timestamps in seconds.'
      }
    ],
    commonProblems: [
      {
        issue: 'CoreML model compilation fails',
        solution: 'Install `ane_transformers` python package or run standard Metal GPU acceleration (`WHISPER_METAL=1 make -j`).'
      }
    ],
    privacyNotes: [
      'Zero audio leaves your workstation; 100% compliant with HIPAA, GDPR, and confidential client audio NDA standards.'
    ],
    alternativeWorkflow: {
      title: 'Commercial Cloud APIs (Rev, OpenAI Whisper API)',
      description: 'Uploading sensitive customer recordings to cloud endpoints.',
      tradeOff: 'Cloud APIs charge $0.006/min and transmit audio across the web; whisper.cpp on M4 Mac transcribes 1 hour in 2 minutes completely offline for free.'
    },
    officialDocLinks: [
      { title: 'Core ML Overview (Apple Developer)', url: 'https://developer.apple.com/machine-learning/core-ml/', lastReviewed: '2026-08-27' }
    ],
    lastReviewedDate: '2026-08-27',
    tags: ['Whisper', 'CoreML', 'Apple Silicon', 'Speech to Text', 'Transcription', 'Developers']
  },
  {
    id: 'wf-timemachine-apfs-local-snapshots-recovery',
    slug: 'apfs-local-snapshots-recovery-terminal-tmutil',
    title: 'Instant APFS Local Snapshots: Recover Files in Seconds with `tmutil`',
    summary: 'Leverage APFS copy-on-write local snapshots to roll back accidentally deleted codebases, databases, or documents in seconds using native macOS `tmutil` commands.',
    persona: 'developers',
    category: 'Developer & Automation',
    devicesRequired: [
      { device: 'Mac running APFS filesystem', minOS: 'macOS 10.13 High Sierra or newer' }
    ],
    appsUsed: ['Terminal', 'tmutil command', 'Finder'],
    isBuiltInOnly: true,
    difficulty: 'Intermediate',
    setupTimeMinutes: 2,
    requiredSettings: [
      'APFS formatted internal drive.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'List Existing Local Snapshots',
        instruction: 'Open Terminal and run: `tmutil listlocalsnapshots /`. You will see timestamped snapshots created automatically by macOS.'
      },
      {
        stepNumber: 2,
        title: 'Mount Snapshot as Read-Only Volume',
        instruction: 'Run `tmutil mountlocalsnapshots / [SnapshotName]`. macOS mounts the exact historical disk state in `/Volumes` in 0.1 seconds.'
      },
      {
        stepNumber: 3,
        title: 'Copy Deleted Files Back',
        instruction: 'Browse the mounted snapshot volume in Finder and copy your overwritten file back to your project directory, then unmount.'
      }
    ],
    commonProblems: [
      {
        issue: 'No local snapshots found',
        solution: 'Enable local snapshots by running `tmutil localsnapshot` before starting dangerous database migrations or updates.'
      }
    ],
    privacyNotes: [
      'Snapshots use native APFS copy-on-write pointers without consuming duplicate drive space.'
    ],
    alternativeWorkflow: {
      title: 'Full Time Machine external restore',
      description: 'Restoring an entire system from a network drive.',
      tradeOff: 'Network restores take hours; APFS local snapshots restore accidentally deleted files in 5 seconds.'
    },
    officialDocLinks: [
      { title: 'About Time Machine local snapshots (Apple Support)', url: 'https://support.apple.com/en-us/HT204015', lastReviewed: '2026-08-28' }
    ],
    lastReviewedDate: '2026-08-28',
    tags: ['APFS', 'tmutil', 'Local Snapshots', 'File Recovery', 'macOS Terminal', 'Developers']
  }
];
