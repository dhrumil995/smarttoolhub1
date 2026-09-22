import { WorkflowItem } from '../types';

export const WORKFLOWS_DATA: WorkflowItem[] = [
  {
    id: 'wf-continuity-camera-desk-view',
    slug: 'continuity-camera-desk-view-streaming',
    title: '4K Studio Webcam & Desk View Overhaul with iPhone',
    summary: 'Turn your iPhone Ultra Wide camera into a professional overhead document camera and 4K webcam on Mac with zero cables or third-party capture cards.',
    persona: 'creators',
    category: 'Audio & Video Production',
    devicesRequired: [
      { device: 'Mac (MacBook, Mac mini, Mac Studio, iMac)', minOS: 'macOS 13 Ventura or newer (macOS 15 Sequoia recommended)', hardwareNotes: 'Apple Silicon or Intel 2018+' },
      { device: 'iPhone with Ultra Wide Camera (iPhone 11 or later)', minOS: 'iOS 16.0 or newer', hardwareNotes: 'Desk View requires iPhone 11 or newer' }
    ],
    appsUsed: ['QuickTime Player', 'OBS Studio', 'FaceTime', 'Zoom'],
    isBuiltInOnly: true,
    difficulty: 'Beginner',
    setupTimeMinutes: 5,
    requiredSettings: [
      'iPhone: Settings > General > AirPlay & Continuity > Continuity Camera toggled ON.',
      'Both devices must have Wi-Fi and Bluetooth turned ON.',
      'Both devices must be signed in with the same Apple Account with Two-Factor Authentication enabled.',
      'iPhone must be locked and mounted horizontally with the rear camera facing you.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Verify Continuity Camera Setting on iPhone',
        instruction: 'On your iPhone, navigate to Settings > General > AirPlay & Continuity. Ensure "Continuity Camera" is enabled. Mount your iPhone on a monitor mount or MagSafe stand in horizontal orientation.',
        callout: 'The rear cameras provide vastly superior optics and low-light performance compared to any built-in laptop webcam.'
      },
      {
        stepNumber: 2,
        title: 'Launch Video App & Select iPhone Camera Source',
        instruction: 'Launch FaceTime, Zoom, QuickTime, or OBS on your Mac. Open Video Settings or the Camera selection menu. Your iPhone will appear automatically under Camera and Microphone sources without any pairing prompt.',
        shortcuts: [
          { mac: '⌘ + Space', description: 'Search and launch video recording software' }
        ]
      },
      {
        stepNumber: 3,
        title: 'Enable Center Stage, Portrait Mode & Studio Light',
        instruction: 'On your Mac, click the Control Center icon in the upper-right menu bar, then click "Video Effects". Select Center Stage to keep you automatically framed, Portrait mode for depth of field, and Studio Light to illuminate your face while dimming the background.',
        shortcuts: [
          { mac: 'Control + F2', description: 'Focus menu bar for keyboard navigation' }
        ]
      },
      {
        stepNumber: 4,
        title: 'Activate Desk View for Overhead Demonstration',
        instruction: 'Click Desk View in Control Center or open the Desk View app via Spotlight. The iPhone Ultra Wide camera dynamically simulates an overhead tabletop camera view, ideal for sketching, unboxings, or handwritten notes.',
        shortcuts: [
          { mac: '⌘ + Space > "Desk View"', description: 'Open native Desk View helper utility' }
        ]
      }
    ],
    commonProblems: [
      {
        issue: 'iPhone does not appear in the Mac camera list',
        solution: 'Lock your iPhone screen and ensure it is in landscape orientation. If an active VPN is running on either device, temporarily disconnect it as VPNs can block local Bonjour discovery.'
      },
      {
        issue: 'Video stuttering or audio desync over Wi-Fi',
        solution: 'Connect the iPhone to your Mac via a USB-C or Lightning cable. Continuity Camera will automatically route zero-latency uncompressed video over the USB bus.'
      }
    ],
    privacyNotes: [
      'Continuity Camera uses direct peer-to-peer Wi-Fi and Bluetooth. No video stream touches Apple servers.',
      'A pause privacy notification appears on the iPhone with an audible chime whenever the camera is actively accessed.'
    ],
    alternativeWorkflow: {
      title: 'Elgato Cam Link 4K with Mirrorless DSLR',
      description: 'Use an external mirrorless camera via HDMI capture card into Mac.',
      tradeOff: 'Higher lens interchangeability, but costs $600-$1500+ and requires additional power adapters, cables, and dummy batteries.'
    },
    officialDocLinks: [
      { title: 'Use iPhone as a webcam for Mac (Apple Support)', url: 'https://support.apple.com/en-us/HT213244', lastReviewed: '2026-08-15' },
      { title: 'Use Desk View on your Mac (Apple Support)', url: 'https://support.apple.com/en-us/102558', lastReviewed: '2026-08-15' }
    ],
    lastReviewedDate: '2026-08-15',
    tags: ['Continuity Camera', 'Desk View', 'Video Recording', 'FaceTime', 'OBS', 'Creators'],
    featured: true
  },
  {
    id: 'wf-universal-control-freelancer-desk',
    slug: 'seamless-dual-display-universal-control',
    title: 'Dual-Device Command Center with Universal Control',
    summary: 'Control your MacBook, iMac, and iPad seamlessly with a single keyboard and mouse. Push cursor and drag-and-drop assets across device screens with zero configuration.',
    persona: 'freelancers',
    category: 'Productivity & Focus',
    devicesRequired: [
      { device: 'Mac (MacBook Pro/Air, iMac, Mac mini, Studio)', minOS: 'macOS 12.3 Monterey or later', hardwareNotes: 'Apple Silicon or Intel 2016+' },
      { device: 'iPad (Pro, Air 3+, iPad 6th gen+, mini 5+)', minOS: 'iPadOS 15.4 or later', hardwareNotes: 'Must be placed within 1 meter' }
    ],
    appsUsed: ['Finder', 'Files', 'Keynote', 'Final Cut Pro', 'Photoshop'],
    isBuiltInOnly: true,
    difficulty: 'Beginner',
    setupTimeMinutes: 3,
    requiredSettings: [
      'Mac: System Settings > Displays > Advanced > "Allow your pointer and keyboard to move between any nearby Mac or iPad" checked.',
      'iPad: Settings > General > AirPlay & Handoff > "Cursor and Keyboard" toggled ON.',
      'Both devices signed into same Apple Account with 2FA.',
      'Wi-Fi, Bluetooth, and Handoff turned on on both devices.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Enable Universal Control in System Settings',
        instruction: 'On your Mac, open System Settings > Displays. Click the "Advanced..." button at the bottom. Check all three checkboxes: "Allow pointer and keyboard to move between nearby Mac or iPad", "Push through edge of display to connect", and "Automatically reconnect".',
        shortcuts: [
          { mac: '⌘ + ,', description: 'Open System Settings' }
        ]
      },
      {
        stepNumber: 2,
        title: 'Arrange Virtual Screen Placement',
        instruction: 'Place your iPad physically to the left or right of your Mac. In Mac System Settings > Displays, drag the iPad display icon to match its physical position next to your Mac display.',
        callout: 'Correct physical alignment prevents mouse jumps when moving between Mac and iPad edges.'
      },
      {
        stepNumber: 3,
        title: 'Push Cursor Across Screen Boundary',
        instruction: 'Move your Mac mouse pointer all the way to the edge of the screen facing the iPad and push past it. You will see an edge animation on the iPad, and your pointer will glide seamlessly onto iPadOS.',
        shortcuts: [
          { mac: 'Control + Left/Right', description: 'Switch virtual spaces on Mac independently' }
        ]
      },
      {
        stepNumber: 4,
        title: 'Cross-Device Drag and Drop Assets',
        instruction: 'Click and drag an image or video file from your Mac desktop directly through the edge of the screen and drop it into an open iPad app like Procreate, Notes, or Files.',
        shortcuts: [
          { mac: '⌘ + C / ⌘ + V', description: 'Copy text or screenshots on Mac and paste on iPad' }
        ]
      }
    ],
    commonProblems: [
      {
        issue: 'Pointer stops at the edge and will not push through to iPad',
        solution: 'Verify your iPad is not locked. Universal Control requires the iPad screen to be active. Also make sure you are not sharing your internet connection via Cellular Personal Hotspot.'
      },
      {
        issue: 'Frequent cursor disconnects after waking from sleep',
        solution: 'Toggle Bluetooth off and back on in Mac Control Center, or unplug and replug any third-party USB hubs that might emit 2.4GHz radio interference.'
      }
    ],
    privacyNotes: [
      'Direct peer-to-peer encrypted wireless link over 802.11ac/ax and Bluetooth Low Energy.',
      'Does not share your screen or transmit sensitive screen buffers, only pointer telemetry and user-initiated drag transfers.'
    ],
    alternativeWorkflow: {
      title: 'Sidecar (Mac Screen Extension)',
      description: 'Use Sidecar instead to turn the iPad into a pure secondary Mac monitor with Apple Pencil digitizer support.',
      tradeOff: 'Sidecar mirrors or extends macOS workspace (iPadOS apps are hidden), whereas Universal Control lets you run native iPad apps with your Mac keyboard.'
    },
    officialDocLinks: [
      { title: 'Use Universal Control across Mac and iPad (Apple Support)', url: 'https://support.apple.com/en-us/102454', lastReviewed: '2026-07-20' }
    ],
    lastReviewedDate: '2026-07-20',
    tags: ['Universal Control', 'iPad', 'MacBook', 'Productivity', 'Dual Monitor', 'Freelancers'],
    featured: true
  },
  {
    id: 'wf-iphone-mirroring-macos-sequoia',
    slug: 'iphone-mirroring-sequoia-remote-access',
    title: 'iPhone Mirroring on macOS Sequoia: Seamless Desktop Interaction',
    summary: 'Interact with your iPhone entirely from your Mac desktop while your iPhone stays locked in your pocket or charging across the room, with unified notifications and drag-and-drop.',
    persona: 'freelancers',
    category: 'Productivity & Focus',
    devicesRequired: [
      { device: 'Mac with Apple Silicon or Intel with T2 Chip', minOS: 'macOS 15.0 Sequoia or later', hardwareNotes: 'Apple Silicon M1+ or Intel Mac with T2 chip' },
      { device: 'iPhone', minOS: 'iOS 18.0 or later', hardwareNotes: 'Must be locked and nearby' }
    ],
    appsUsed: ['iPhone Mirroring native app', 'Mac Notification Center'],
    isBuiltInOnly: true,
    difficulty: 'Beginner',
    setupTimeMinutes: 2,
    requiredSettings: [
      'Both Mac and iPhone must be signed into the same Apple Account with 2FA.',
      'Wi-Fi and Bluetooth must be active on both devices.',
      'iPhone must be locked and nearby (within standard Bluetooth range).',
      'Mac FileVault or Mac password must be enabled.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Open iPhone Mirroring from Mac Dock or Applications',
        instruction: 'Click the iPhone Mirroring app icon in your Mac Dock or open it using Spotlight (⌘ + Space > "iPhone Mirroring").',
        shortcuts: [
          { mac: '⌘ + Space > "iPhone Mirroring"', description: 'Instant Spotlight trigger' }
        ]
      },
      {
        stepNumber: 2,
        title: 'Authenticate Mac Password or Touch ID',
        instruction: 'Confirm your identity using Touch ID or your Mac user password. Choose whether to require authentication every time or automatically authenticate when your Mac is unlocked.',
        callout: 'Your iPhone screen remains completely black and locked during the entire session for physical privacy.'
      },
      {
        stepNumber: 3,
        title: 'Navigate iOS with Mac Keyboard and Trackpad',
        instruction: 'Use your trackpad to swipe between home screen pages, scroll feeds, and launch iOS-exclusive applications. Use standard Mac keyboard text entry inside iOS fields.',
        shortcuts: [
          { mac: '⌘ + 1', description: 'Go to iPhone Home Screen' },
          { mac: '⌘ + 2', description: 'Open iPhone App Switcher' },
          { mac: '⌘ + 3', description: 'Open iPhone Spotlight Search' }
        ]
      },
      {
        stepNumber: 4,
        title: 'Drag and Drop Photos and Files Directly Between Devices',
        instruction: 'Drag images, videos, or documents directly from Mac Finder windows into active iPhone apps like Photos, Files, or messaging apps, and vice versa.',
        shortcuts: [
          { mac: 'Esc', description: 'Go back one level in iOS view' }
        ]
      }
    ],
    commonProblems: [
      {
        issue: 'Error: "iPhone is in Use" or "Unlock iPhone to continue"',
        solution: 'If you pick up and unlock your iPhone, the Mac mirroring session immediately pauses for security. Lock the iPhone screen and click Try Again on Mac.'
      },
      {
        issue: 'Audio from iPhone does not play through Mac speakers',
        solution: 'Check Mac System Settings > Sound > Output and verify output volume is not muted. iPhone audio routes automatically through the selected Mac sound device.'
      }
    ],
    privacyNotes: [
      'Physical privacy: iPhone remains dark and locked. Anyone in the room with your phone cannot see what you are doing on your Mac.',
      'End-to-end encrypted local peer-to-peer session over Apple protocol.'
    ],
    alternativeWorkflow: {
      title: 'Scrcpy / Web-based remote casting',
      description: 'Third-party Android screen mirroring tools.',
      tradeOff: 'iPhone Mirroring is natively integrated into macOS Sequoia without any developer modes, cables, or third-party background daemons.'
    },
    officialDocLinks: [
      { title: 'iPhone Mirroring: Use your iPhone from your Mac (Apple Support)', url: 'https://support.apple.com/en-us/120421', lastReviewed: '2026-09-01' }
    ],
    lastReviewedDate: '2026-09-01',
    tags: ['iPhone Mirroring', 'macOS Sequoia', 'iOS 18', 'Remote Control', 'Productivity'],
    featured: true
  },
  {
    id: 'wf-student-sidecar-handwritten-math',
    slug: 'sidecar-ipad-math-apple-pencil-notes',
    title: 'Paperless Study Station: iPad Sidecar with Apple Pencil Digitizer',
    summary: 'Turn your iPad into a precision secondary Mac screen and graphics tablet. Annotate PDF lecture slides and solve complex math equations in Mac apps using Apple Pencil.',
    persona: 'students',
    category: 'Study & Research',
    devicesRequired: [
      { device: 'Mac (MacBook Air/Pro, iMac, Mac mini)', minOS: 'macOS 10.15 Catalina or newer', hardwareNotes: 'Compatible with all modern Macs' },
      { device: 'iPad with Apple Pencil support', minOS: 'iPadOS 13 or newer', hardwareNotes: 'Apple Pencil 1st gen, 2nd gen, USB-C, or Pro' }
    ],
    appsUsed: ['Preview', 'Goodnotes', 'OneNote', 'Affinity Photo', 'Adobe Acrobat'],
    isBuiltInOnly: true,
    difficulty: 'Beginner',
    setupTimeMinutes: 3,
    requiredSettings: [
      'Both devices on same Wi-Fi and within 10 meters.',
      'Bluetooth turned on on both devices.',
      'Signed into identical Apple Account with 2FA.',
      'Mac: System Settings > Displays > "+" icon > select your iPad under Mirror or Extend to.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Establish Sidecar Connection from Mac Control Center',
        instruction: 'Click the Display control in your Mac menu bar or Control Center. Under "Mirror or extend to", select your iPad.',
        shortcuts: [
          { mac: 'Control + F2', description: 'Focus menu bar' }
        ]
      },
      {
        stepNumber: 2,
        title: 'Choose "Use As Separate Display"',
        instruction: 'In the Display menu on Mac, ensure "Use As Separate Display" is selected (instead of Mirror Built-in Display). This expands your desktop real estate.',
        callout: 'You can drag any Mac application window (such as lecture PDFs in Preview or browser tabs) onto your iPad display.'
      },
      {
        stepNumber: 3,
        title: 'Use Apple Pencil for Precision Annotation and Drawing',
        instruction: 'In Preview or graphic software on Mac, select markup mode. Use your Apple Pencil directly on the iPad glass to highlight, write equations, and draw vector paths with full pressure sensitivity and tilt support.',
        shortcuts: [
          { mac: '⌘ + Shift + A', description: 'Show Markup Toolbar in Apple Preview' }
        ]
      },
      {
        stepNumber: 4,
        title: 'Utilize On-Screen Sidecar Sidebar and Touch Bar',
        instruction: 'The iPad side border displays quick-action keys: Command (⌘), Option (⌥), Control (⌃), Shift (⇧), Undo, and the virtual Touch Bar for fast one-tap formatting without touching your Mac keyboard.'
      }
    ],
    commonProblems: [
      {
        issue: 'Sidecar disconnects intermittently or screen shows lag',
        solution: 'Plug your iPad directly into your Mac using the USB-C charging cable. Sidecar switches instantly to a high-speed hardwired display bus, eliminating wireless interference.'
      },
      {
        issue: 'iPad does not show up in the Display menu list',
        solution: 'Make sure your iPad screen is unlocked. Check that neither device is sharing its internet connection via Personal Hotspot.'
      }
    ],
    privacyNotes: [
      'Display data is transmitted via hardware-accelerated H.264/HEVC encoding over local Wi-Fi direct or USB.',
      'Zero cloud transmission of your desktop content.'
    ],
    alternativeWorkflow: {
      title: 'Astropad Studio / Duet Display',
      description: 'Third-party display extension software with specialized digital art features.',
      tradeOff: 'Astropad requires a paid subscription, whereas Apple Sidecar is completely free, built-in, and driverless.'
    },
    officialDocLinks: [
      { title: 'Use your iPad as a second display for your Mac (Apple Support)', url: 'https://support.apple.com/en-us/HT210380', lastReviewed: '2026-08-01' }
    ],
    lastReviewedDate: '2026-08-01',
    tags: ['Sidecar', 'Apple Pencil', 'Students', 'iPad Display', 'PDF Annotation', 'Study'],
    featured: true
  },
  {
    id: 'wf-universal-clipboard-developer-terminal',
    slug: 'universal-clipboard-handoff-developer-flow',
    title: 'Cross-Device Clipboard Sync: Mac, iPhone & iPad Clipboard Pipeline',
    summary: 'Copy code snippets, authentication 2FA tokens, images, and URLs on one Apple device and instantly paste on another with zero lag or manual sharing steps.',
    persona: 'developers',
    category: 'Developer & Automation',
    devicesRequired: [
      { device: 'Mac', minOS: 'macOS 10.12 Sierra or newer', hardwareNotes: 'All Macs supported' },
      { device: 'iPhone or iPad', minOS: 'iOS 10.0 or newer', hardwareNotes: 'All iOS devices' }
    ],
    appsUsed: ['Terminal', 'Xcode', 'Safari', 'Notes', 'Visual Studio Code'],
    isBuiltInOnly: true,
    difficulty: 'Beginner',
    setupTimeMinutes: 2,
    requiredSettings: [
      'System Settings > General > AirDrop & Handoff > "Allow Handoff between this Mac and your iCloud devices" checked.',
      'iOS Settings > General > AirPlay & Handoff > Handoff enabled.',
      'Wi-Fi and Bluetooth active on both devices.',
      'Both devices on same Apple Account with 2FA.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Verify Handoff Enabled Across Ecosystem',
        instruction: 'On Mac: System Settings > General > AirDrop & Handoff. On iPhone: Settings > General > AirPlay & Handoff. Ensure Handoff toggle is ON.',
        shortcuts: [
          { mac: '⌘ + Space > "Handoff"', description: 'Direct search to Handoff settings' }
        ]
      },
      {
        stepNumber: 2,
        title: 'Copy Content on Device A',
        instruction: 'Highlight text, code block, or select an image on your iPhone or Mac and copy it using standard copy controls.',
        shortcuts: [
          { mac: '⌘ + C', ios: 'Double tap > Copy', description: 'Copy to shared clipboard buffer' }
        ]
      },
      {
        stepNumber: 3,
        title: 'Paste Instantly on Device B',
        instruction: 'Within 2 minutes, focus the target window on your other device and press paste. A brief "Pasting from Mac / iPhone" toast indicator appears at the top of the screen as content syncs.',
        shortcuts: [
          { mac: '⌘ + V', ios: 'Tap > Paste', description: 'Paste cross-device clipboard item' }
        ],
        callout: 'Universal Clipboard retains data in the shared memory buffer for approximately 120 seconds before auto-clearing for security.'
      },
      {
        stepNumber: 4,
        title: 'Handoff Active Apps in Dock or App Switcher',
        instruction: 'If you are viewing a webpage in Safari or editing a note on your iPhone, look at the far-left or far-right of your Mac Dock. Click the icon with the iPhone badge to instantly resume reading right where you left off.'
      }
    ],
    commonProblems: [
      {
        issue: 'Pasting gives error or pastes old clipboard item',
        solution: 'Toggle Bluetooth off and on in Mac menu bar. If a corporate VPN or DNS filter is enabled, ensure local multicast traffic (mDNS) is permitted.'
      },
      {
        issue: 'Large files (e.g. 500MB videos) fail to paste over Universal Clipboard',
        solution: 'Universal Clipboard is optimized for text, snippets, and photos under 50MB. For large media files, use AirDrop which uses high-speed direct peer-to-peer Wi-Fi channels.'
      }
    ],
    privacyNotes: [
      'Encrypted end-to-end between your devices using your Apple Account security keys.',
      'Clipboard buffer automatically purges itself after 2 minutes of inactivity.'
    ],
    alternativeWorkflow: {
      title: 'Paste / Raycast Clipboard History Sync',
      description: 'Third-party clipboard managers with multi-day searchable history.',
      tradeOff: 'Third-party apps store history indefinitely on disk, whereas Apple Universal Clipboard is ephemeral and requires zero third-party software.'
    },
    officialDocLinks: [
      { title: 'Use Universal Clipboard to copy and paste between your Apple devices', url: 'https://support.apple.com/en-us/102430', lastReviewed: '2026-06-10' }
    ],
    lastReviewedDate: '2026-06-10',
    tags: ['Universal Clipboard', 'Handoff', 'Shortcuts', 'Developer', 'Productivity'],
    featured: false
  },
  {
    id: 'wf-content-creator-airdrop-batch-media',
    slug: 'high-speed-airdrop-prores-batch-transfer',
    title: 'High-Speed 4K ProRes Video Ingestion via Peer-to-Peer AirDrop',
    summary: 'Transfer gigabytes of 4K 60fps ProRes footage and RAW photos from iPhone to Mac at maximum hardware Wi-Fi 6E/7 speeds without cables or cloud upload delays.',
    persona: 'creators',
    category: 'Cross-Device File Sync',
    devicesRequired: [
      { device: 'iPhone (iPhone 13 Pro or newer for ProRes)', minOS: 'iOS 17.0 or newer', hardwareNotes: 'Wi-Fi 6 / 6E capable' },
      { device: 'Mac (MacBook Pro / Air, Mac Studio, Mac mini)', minOS: 'macOS 13.0 or newer', hardwareNotes: 'Fast NVMe SSD' }
    ],
    appsUsed: ['Photos app', 'Finder', 'Final Cut Pro', 'DaVinci Resolve'],
    isBuiltInOnly: true,
    difficulty: 'Beginner',
    setupTimeMinutes: 2,
    requiredSettings: [
      'Mac: Finder > AirDrop > "Allow me to be discovered by: Contacts Only" or "Everyone for 10 Minutes".',
      'iPhone: Settings > General > AirDrop > Contacts Only or Everyone.',
      'Both devices must have Wi-Fi and Bluetooth ON.',
      'Personal Hotspot must be OFF on both devices.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Configure Mac AirDrop Receiving State',
        instruction: 'Open Finder on your Mac and press ⌘ + Shift + R to open AirDrop. Confirm your Mac is discoverable by Contacts Only (or Everyone).',
        shortcuts: [
          { mac: '⌘ + Shift + R', description: 'Open AirDrop folder in Finder' }
        ]
      },
      {
        stepNumber: 2,
        title: 'Select Video Clips in iPhone Photos App with Full Quality',
        instruction: 'In iPhone Photos, tap Select and highlight your 4K video clips. Tap the Share button. At the top of the share sheet, tap "Options" and check "All Photos Data" to preserve uncompressed ProRes metadata and HDR color space.',
        callout: 'Checking "All Photos Data" ensures original color profiles, captions, and edit histories are preserved for color grading.'
      },
      {
        stepNumber: 3,
        title: 'Tap Mac Target in AirDrop Carousel',
        instruction: 'Tap your Mac icon in the AirDrop row. Because both devices share your Apple Account, the transfer begins instantly without a manual confirmation prompt on Mac.',
        shortcuts: [
          { mac: '⌘ + Option + L', description: 'Open Downloads folder on Mac to view incoming footage' }
        ]
      },
      {
        stepNumber: 4,
        title: 'Organize Directly into NLE Video Scratch Disk',
        instruction: 'Files land directly in your Mac ~/Downloads folder. Drag the batch into your Final Cut Pro or DaVinci Resolve project bin.'
      }
    ],
    commonProblems: [
      {
        issue: 'AirDrop transfer gets stuck or fails after 100MB',
        solution: 'Ensure neither device screen falls asleep during the transfer. Disable Low Power Mode on iPhone during heavy video transfers.'
      },
      {
        issue: 'Mac does not appear in iPhone AirDrop list',
        solution: 'In Mac System Settings > Network > Firewall, verify that "Block all incoming connections" is NOT enabled.'
      }
    ],
    privacyNotes: [
      'AirDrop creates an ad-hoc TLS-encrypted Wi-Fi Direct connection directly between the two devices. No data touches iCloud or any external server.',
      'Cryptographic hashes of Apple Account emails are used for contact verification without leaking contact addresses.'
    ],
    alternativeWorkflow: {
      title: 'Direct USB-C 3.2 Gen 2 Hardwired Cable Transfer',
      description: 'Connect iPhone 15 Pro / 16 Pro via a 10Gbps USB-C cable directly to Mac.',
      tradeOff: 'Requires carrying a certified 10Gbps USB-C cable, but achieves up to 1,000 MB/s transfer speeds for multi-terabyte projects.'
    },
    officialDocLinks: [
      { title: 'Use AirDrop on your Mac (Apple Support)', url: 'https://support.apple.com/en-us/HT203106', lastReviewed: '2026-07-15' },
      { title: 'How to use AirDrop on your iPhone (Apple Support)', url: 'https://support.apple.com/en-us/HT204144', lastReviewed: '2026-07-15' }
    ],
    lastReviewedDate: '2026-07-15',
    tags: ['AirDrop', 'ProRes', '4K Video', 'Final Cut Pro', 'Creators', 'File Sync'],
    featured: true
  },
  {
    id: 'wf-automated-deep-work-focus-shortcuts',
    slug: 'unified-apple-focus-shortcuts-automation',
    title: 'Cross-Device Deep Work Focus Mode with Automated Filter Pipelines',
    summary: 'Trigger an ecosystem-wide deep focus state with one tap or keyboard shortcut: silence notifications, launch specific Safari tab groups, switch Apple Watch face, and tint displays.',
    persona: 'freelancers',
    category: 'Productivity & Focus',
    devicesRequired: [
      { device: 'Mac', minOS: 'macOS 13 Ventura or newer', hardwareNotes: 'Any Mac' },
      { device: 'iPhone', minOS: 'iOS 16 or newer', hardwareNotes: 'Any iPhone' },
      { device: 'iPad (Optional)', minOS: 'iPadOS 16 or newer', hardwareNotes: 'Any iPad' }
    ],
    appsUsed: ['Shortcuts app', 'System Settings Focus', 'Safari Tab Groups', 'Calendar'],
    isBuiltInOnly: true,
    difficulty: 'Intermediate',
    setupTimeMinutes: 8,
    requiredSettings: [
      'Settings > Focus > "Share Across Devices" toggled ON on all devices.',
      'Allow notifications from VIP contacts and emergency bypass only.',
      'Configure Safari Focus Filter to show only client/project tab groups.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Create a Custom "Deep Focus" Mode in System Settings',
        instruction: 'On Mac or iPhone, open System Settings > Focus. Click "Add Focus" > Custom. Name it "Deep Focus", assign a blue icon, and toggle ON "Share Across Devices".',
        shortcuts: [
          { mac: '⌘ + Space > "Focus"', description: 'Open Focus settings directly' }
        ]
      },
      {
        stepNumber: 2,
        title: 'Attach Safari Focus Filter for Work Tab Group',
        instruction: 'Scroll down to "Focus Filters". Click "Add Filter" > Safari. Select your active client or study Tab Group. When Deep Focus is engaged, all personal tabs are hidden automatically.',
        callout: 'Focus Filters can also hide personal email inboxes in Apple Mail and silence personal calendars in Calendar.'
      },
      {
        stepNumber: 3,
        title: 'Build a One-Tap Shortcuts Macro',
        instruction: 'Open Shortcuts app. Create a shortcut named "Enter Deep Work". Add actions: (1) Set Focus Deep Focus ON until turned off, (2) Open Safari with Research Tab Group, (3) Play "Lo-Fi Beats" playlist in Apple Music or Spotify.',
        shortcuts: [
          { mac: '⌘ + Shift + F', description: 'Assign custom global shortcut in Shortcuts app' }
        ]
      },
      {
        stepNumber: 4,
        title: 'Add Shortcut to Mac Menu Bar and iPhone Lock Screen Widget',
        instruction: 'In Shortcuts on Mac, check "Use as Quick Action" and "Pin in Menu Bar". On iPhone, add the Shortcut widget directly to your lock screen for instant activation.'
      }
    ],
    commonProblems: [
      {
        issue: 'Focus status does not sync to iPad or Apple Watch',
        solution: 'Verify "Share Across Devices" is enabled on every single device individually, and that iCloud Drive is enabled in your Apple Account settings.'
      },
      {
        issue: 'Important phone calls get silenced accidentally',
        solution: 'In Focus settings > People > Allow Calls From, set to "Favorites" and turn ON "Allow Repeated Calls".'
      }
    ],
    privacyNotes: [
      'Focus status syncs across your devices via end-to-end encrypted iCloud key-value storage.',
      'No third-party apps can view which specific contacts or apps are silenced in your Focus filters.'
    ],
    alternativeWorkflow: {
      title: 'Freedom / Opal app blocking services',
      description: 'Third-party VPN-based app and website blocking services.',
      tradeOff: 'Apple Focus Modes are free, native, do not require routing web traffic through third-party VPN profiles, and sync seamlessly across Apple Watch.'
    },
    officialDocLinks: [
      { title: 'Use Focus on your Mac (Apple Support)', url: 'https://support.apple.com/en-us/HT212608', lastReviewed: '2026-08-10' },
      { title: 'Use Focus on your iPhone or iPad (Apple Support)', url: 'https://support.apple.com/en-us/HT212608', lastReviewed: '2026-08-10' }
    ],
    lastReviewedDate: '2026-08-10',
    tags: ['Focus Mode', 'Shortcuts', 'Productivity', 'Safari Tab Groups', 'Freelancers', 'Students'],
    featured: false
  },
  {
    id: 'wf-instant-hotspot-remote-freelancer',
    slug: 'instant-personal-hotspot-zero-password',
    title: 'Instant Personal Hotspot with Zero Passwords or Manual Pairing',
    summary: 'Connect your Mac or iPad to your iPhone cellular data connection instantly from the Wi-Fi menu without touching your iPhone, typing passwords, or waking its screen.',
    persona: 'freelancers',
    category: 'Cross-Device File Sync',
    devicesRequired: [
      { device: 'Mac or iPad (Wi-Fi only models)', minOS: 'macOS 10.10 Yosemite+ / iPadOS 13+', hardwareNotes: 'Wi-Fi 802.11ac+' },
      { device: 'iPhone with Cellular Data Plan', minOS: 'iOS 8.0 or newer', hardwareNotes: 'Carrier plan must support Personal Hotspot' }
    ],
    appsUsed: ['System Settings', 'Control Center Wi-Fi'],
    isBuiltInOnly: true,
    difficulty: 'Beginner',
    setupTimeMinutes: 1,
    requiredSettings: [
      'Both devices signed into same Apple Account.',
      'Bluetooth and Wi-Fi active on both devices.',
      'iPhone cellular carrier enables Personal Hotspot.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Open Mac Wi-Fi Menu in Control Center',
        instruction: 'Click the Wi-Fi icon in your Mac menu bar or Control Center. Look at the "Personal Hotspots" section at the top of the network list.',
        shortcuts: [
          { mac: 'Control + F2', description: 'Jump to Menu Bar' }
        ]
      },
      {
        stepNumber: 2,
        title: 'Inspect Live Signal and Battery Telemetry',
        instruction: 'Notice that your iPhone appears with its cellular signal bars (5G/LTE) and real-time battery percentage displayed right next to its name, even with the iPhone screen off.',
        callout: 'Instant Hotspot uses Bluetooth Low Energy beacons to wake your iPhone cellular radio on demand without leaving the hotspot transmitter constantly draining battery.'
      },
      {
        stepNumber: 3,
        title: 'Click to Connect Instantly',
        instruction: 'Click your iPhone name. Your Mac automatically commands the iPhone to spin up a secure WPA3 network and joins it without ever asking for a Wi-Fi password.',
        shortcuts: [
          { mac: '⌘ + Space > "Network"', description: 'Open network status' }
        ]
      },
      {
        stepNumber: 4,
        title: 'Enable "Low Data Mode" on Metred Connections',
        instruction: 'In Mac System Settings > Wi-Fi > Details, toggle on "Low Data Mode" to automatically pause background cloud backups, macOS updates, and automatic photo syncing while on cellular.'
      }
    ],
    commonProblems: [
      {
        issue: 'iPhone does not appear in the Mac Wi-Fi menu under Personal Hotspots',
        solution: 'In iPhone Settings > Personal Hotspot, toggle "Allow Others to Join" ON at least once to ensure your carrier provisioning profile is active, then toggle Bluetooth off and on.'
      },
      {
        issue: 'High cellular battery consumption on iPhone',
        solution: 'Keep iPhone plugged into your MacBook USB-C port. This charges the iPhone while providing a direct ultra-fast hardwired USB hotspot connection simultaneously.'
      }
    ],
    privacyNotes: [
      'Apple Instant Hotspot establishes a unique hardware-level WPA3-SAE encrypted key negotiated over your Apple Account credentials.',
      'Never broadcasts an open or vulnerable Wi-Fi SSID to nearby strangers.'
    ],
    alternativeWorkflow: {
      title: 'Dedicated 5G Mobile Wi-Fi Hotspot Puck (e.g. Netgear Nighthawk)',
      description: 'Carry a separate battery-powered cellular modem with physical SIM card.',
      tradeOff: 'Requires paying for an additional monthly cellular line ($30-$60/mo) and carrying extra hardware, whereas iPhone Instant Hotspot is included in existing mobile plans.'
    },
    officialDocLinks: [
      { title: 'Use Instant Hotspot to connect to your Personal Hotspot without entering a password', url: 'https://support.apple.com/en-us/HT209459', lastReviewed: '2026-06-25' }
    ],
    lastReviewedDate: '2026-06-25',
    tags: ['Personal Hotspot', 'Instant Hotspot', 'Remote Work', '5G', 'Travel', 'Freelancers'],
    featured: false
  },
  {
    id: 'wf-apple-intelligence-summarization-workflow',
    slug: 'apple-intelligence-writing-tools-system-mac-ios',
    title: 'Apple Intelligence Writing Tools & Smart Proofreading across Mac & iPhone',
    summary: 'Harness on-device Apple Intelligence Writing Tools across any text field in macOS and iOS to rewrite, proofread, summarize long PDF documents, and extract key action items with zero cloud privacy exposure.',
    persona: 'beginners',
    category: 'Productivity & Focus',
    devicesRequired: [
      { device: 'Mac (M1 chip or later)', minOS: 'macOS 15.1 Sequoia or newer', hardwareNotes: 'Apple Silicon M1/M2/M3/M4 required' },
      { device: 'iPhone 15 Pro / 16 / 16 Pro', minOS: 'iOS 18.1 or newer', hardwareNotes: 'A17 Pro or A18 chip' }
    ],
    appsUsed: ['Mail', 'Safari', 'Notes', 'Pages', 'Slack', 'TextEdit'],
    isBuiltInOnly: true,
    difficulty: 'Beginner',
    setupTimeMinutes: 2,
    requiredSettings: [
      'System Settings > Apple Intelligence & Siri > Apple Intelligence enabled.',
      'Device language set to supported English (or localized supported regions).',
      'At least 4GB of free local storage for on-device neural models.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Highlight Text in Any App (Native or Third-Party)',
        instruction: 'Select a paragraph, email draft, or customer message in any application (Apple Mail, Notes, Slack, or Safari).',
        shortcuts: [
          { mac: '⌘ + A', description: 'Select all text' }
        ]
      },
      {
        stepNumber: 2,
        title: 'Invoke Writing Tools Menu',
        instruction: 'Right-click (or two-finger tap) the selected text and choose "Writing Tools", or press the global Writing Tools keyboard shortcut.',
        shortcuts: [
          { mac: 'Shift + ⌘ + Space', description: 'Global shortcut to invoke Apple Intelligence Writing Tools' }
        ]
      },
      {
        stepNumber: 3,
        title: 'Choose Rewrite Tone or Document Summary',
        instruction: 'Click "Friendly", "Professional", or "Concise" to adjust tone. For long reports or research papers, click "Summary" or "Key Points" to generate a bulleted executive briefing.',
        callout: 'The "Proofread" option highlights grammar, syntax, and punctuation recommendations with one-click side-by-side replacements.'
      },
      {
        stepNumber: 4,
        title: 'Summarize Long Webpages in Safari Reader View',
        instruction: 'In Safari, click the Reader icon in the address bar. Click the "Summarize" badge at the top to read an instant AI synthesis before reading the full article.'
      }
    ],
    commonProblems: [
      {
        issue: 'Writing Tools option is grayed out or not appearing in contextual menu',
        solution: 'Verify your Mac is Apple Silicon (M1 or later). Intel Macs do not support on-device Apple Intelligence. Check that Apple Intelligence is active in System Settings > Apple Intelligence & Siri.'
      },
      {
        issue: 'Device displays "Downloading Apple Intelligence Models"',
        solution: 'Connect your device to Wi-Fi and power. On-device foundation models (~3GB) download in the background when the feature is first turned on.'
      }
    ],
    privacyNotes: [
      'Basic writing tasks run 100% on-device utilizing the Apple Silicon Neural Engine.',
      'Complex queries use Apple Private Cloud Compute where data is never stored, logs are prohibited, and security is independently verifiable by cryptographers.'
    ],
    alternativeWorkflow: {
      title: 'Grammarly / LanguageTool desktop apps',
      description: 'Third-party cloud grammar checking browser extensions and apps.',
      tradeOff: 'Third-party tools transmit your keystrokes to third-party cloud servers, whereas Apple Intelligence runs on-device without third-party data collection.'
    },
    officialDocLinks: [
      { title: 'Use Apple Intelligence Writing Tools (Apple Support)', url: 'https://support.apple.com/en-us/121115', lastReviewed: '2026-09-12' }
    ],
    lastReviewedDate: '2026-09-12',
    tags: ['Apple Intelligence', 'macOS Sequoia', 'iOS 18', 'Writing Tools', 'AI Summarizer', 'Beginners'],
    featured: true
  }
];
