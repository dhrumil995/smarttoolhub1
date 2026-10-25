export interface ComparisonRow {
  feature: string;
  optionA: string;
  optionB: string;
  winner?: 'A' | 'B' | 'Tie';
}

export interface ComparisonData {
  slug: string;
  title: string;
  subtitle: string;
  optionAName: string;
  optionBName: string;
  optionAPermalink: string;
  optionBPermalink: string;
  optionAPickIf: string[];
  optionBPickIf: string[];
  verdictSummary: string;
  comparisonRows: ComparisonRow[];
  matchingToolSlug: string;
  matchingToolName: string;
  faqs: Array<{ question: string; answer: string }>;
  appleOfficialNote?: string; // Special requirement for 3uTools vs iMazing
}

export const COMPARISONS: Record<string, ComparisonData> = {
  'wiztree-vs-treesize': {
    slug: 'wiztree-vs-treesize',
    title: 'WizTree vs TreeSize Free: Which Disk Analyzer Should You Use?',
    subtitle: 'A detailed, objective comparison of the two leading Windows storage analyzers: speed benchmarks, MFT scanning, visual treemaps, and file exports.',
    optionAName: 'WizTree',
    optionBName: 'TreeSize Free',
    optionAPermalink: '/pc-tools/wiztree',
    optionBPermalink: '/pc-tools/treesize-free',
    optionAPickIf: [
      'You want the absolute fastest scan speeds on modern SSDs (scans 1 TB in ~2-3 seconds).',
      'You love interactive visual treemaps where colored rectangles represent file sizes.',
      'You are using the software on a personal PC or home gaming rig.',
    ],
    optionBPickIf: [
      'You prefer traditional hierarchical Windows File Explorer folder size lists.',
      'You need to analyze network storage (SMB / NAS shares) or non-NTFS drives.',
      'You need detailed exports of directory permissions and allocated cluster space.',
    ],
    verdictSummary: 'Both utilities are exceptional tools that outclass the default Windows Settings storage screen. Pick WizTree if sheer scan speed and interactive visual treemaps are your top priority. Pick TreeSize Free if you require classic hierarchical folder trees, network drive scans, or enterprise reporting.',
    matchingToolSlug: 'drive-health-reader',
    matchingToolName: 'Drive Health Reader (S.M.A.R.T.)',
    comparisonRows: [
      { feature: 'Scan Technology', optionA: 'Direct NTFS Master File Table (MFT) parser', optionB: 'Sequential directory traversal (with Fast MFT option)', winner: 'A' },
      { feature: 'Scan Speed (1 TB SSD)', optionA: '~2 to 4 seconds', optionB: '~15 to 45 seconds', winner: 'A' },
      { feature: 'Visual Layout', optionA: 'Interactive proportional treemap + table', optionB: 'Hierarchical directory tree with gradient size bars', winner: 'Tie' },
      { feature: 'Network / NAS Drive Scanning', optionA: 'Supported (standard slower scan mode)', optionB: 'Supported with robust SMB share options', winner: 'B' },
      { feature: 'File Type Statistics View', optionA: 'Top 1000 largest files + extension breakdown', optionB: 'Dedicated File Types extension tab', winner: 'Tie' },
      { feature: 'License Model', optionA: 'Free for personal use (commercial license required)', optionB: 'Free edition available; commercial Pro edition sold', winner: 'Tie' },
      { feature: 'Portable Version', optionA: 'Yes (Standalone ZIP, zero installer)', optionB: 'Yes (Portable ZIP available from JAM Software)', winner: 'Tie' },
    ],
    faqs: [
      {
        question: 'Why is WizTree so much faster than TreeSize Free?',
        answer: 'WizTree reads the NTFS Master File Table (MFT) directly from disk blocks in raw binary form, bypassing standard Windows API file traversal. TreeSize Free primarily scans the file system hierarchically, though modern versions also support MFT acceleration on NTFS.',
      },
      {
        question: 'Can WizTree or TreeSize Free damage my operating system if I delete files?',
        answer: 'Both tools offer direct delete options. Always verify what you are deleting: never delete files inside C:\\Windows or System Volume Information manually unless you know their specific purpose.',
      },
      {
        question: 'Do these tools work on Windows 11?',
        answer: 'Yes, both WizTree and TreeSize Free are fully compatible with Windows 11 and Windows 10 (both 64-bit and 32-bit editions).',
      },
    ],
  },

  'rufus-vs-ventoy': {
    slug: 'rufus-vs-ventoy',
    title: 'Rufus vs Ventoy: Which Bootable USB Creator Is Best for You?',
    subtitle: 'Comparing single-image dedicated flashing versus modern multi-boot drag-and-drop USB deployment.',
    optionAName: 'Rufus',
    optionBName: 'Ventoy',
    optionAPermalink: '/pc-tools/rufus',
    optionBPermalink: '/pc-tools/ventoy',
    optionAPickIf: [
      'You are building a dedicated Windows 11 installer and want automatic local account creation and TPM/Secure Boot bypasses.',
      'You need maximum compatibility with finicky older BIOS motherboards.',
      'You want built-in bad-block drive testing and direct ISO checksum calculations.',
    ],
    optionBPickIf: [
      'You carry multiple ISOs (Windows 11, Ubuntu, Clonezilla, MemTest) on one flash drive.',
      'You hate reformatting your flash drive every time a new OS update or ISO release is published.',
      'You want to use the remaining space on your USB drive for regular document storage.',
    ],
    verdictSummary: 'Rufus is the ultimate precision tool for creating a single, rock-solid, tailored bootable installer—especially for customized Windows 11 installations. Ventoy is the ultimate technician’s multi-tool, allowing you to drag dozens of ISOs onto one flash drive without ever reformatting.',
    matchingToolSlug: 'bootable-usb-chooser',
    matchingToolName: 'Bootable USB Chooser Wizard',
    comparisonRows: [
      { feature: 'Core Workflow', optionA: 'Formats entire drive to write 1 ISO', optionB: 'Installs once; drag and drop multiple ISO files', winner: 'B' },
      { feature: 'Multiple ISOs on One USB', optionA: 'No (Single ISO per drive)', optionB: 'Yes (Dozens supported on one drive)', winner: 'B' },
      { feature: 'Windows 11 Setup Customization', optionA: 'Bypass TPM, Secure Boot, Online Account, Telemetry', optionB: 'Supported via custom XML plugin scripts', winner: 'A' },
      { feature: 'Firmware Support', optionA: 'Legacy BIOS (MBR) and UEFI (GPT)', optionB: 'Legacy BIOS and UEFI (x86_64, ARM64, IA32)', winner: 'Tie' },
      { feature: 'Write Speed', optionA: 'High-speed raw block writes', optionB: 'Standard file copy speed into exFAT partition', winner: 'Tie' },
      { feature: 'Operating System Host', optionA: 'Windows only', optionB: 'Windows and Linux official installers', winner: 'B' },
      { feature: 'Drive Space Retention', optionA: 'Drive dedicated solely to the written OS', optionB: 'Remaining storage usable for standard files', winner: 'B' },
    ],
    faqs: [
      {
        question: 'Does Ventoy work with Secure Boot enabled?',
        answer: 'Yes, but on some systems with strict Secure Boot keys, you may need to enroll Ventoy’s custom Machine Owner Key (MOK) once during initial boot.',
      },
      {
        question: 'Can Rufus make a multi-boot drive?',
        answer: 'No. Rufus is designed intentionally as a dedicated single-image formatter to ensure maximum boot reliability across all PC hardware.',
      },
      {
        question: 'Should I verify my ISO checksum before writing it?',
        answer: 'Yes, always verify the SHA-256 hash of your ISO to ensure the download was not corrupted before making bootable media.',
      },
    ],
  },

  'powertoys-vs-flow-launcher': {
    slug: 'powertoys-vs-flow-launcher',
    title: 'PowerToys vs Flow Launcher: Which Windows Productivity Suite Wins?',
    subtitle: 'Comparing Microsoft’s all-in-one system utility suite against the lightweight, highly extensible Flow Launcher.',
    optionAName: 'PowerToys',
    optionBName: 'Flow Launcher',
    optionAPermalink: '/pc-tools/powertoys',
    optionBPermalink: '/pc-tools/flow-launcher',
    optionAPickIf: [
      'You want FancyZones for window snapping on ultrawide monitors.',
      'You need a full suite of utilities: Color Picker, Text Extractor OCR, and Always on Top.',
      'You prefer an official open-source utility supported directly by Microsoft.',
    ],
    optionBPickIf: [
      'You strictly want a fast, beautiful Spotlight-style search launcher.',
      'You want community plugins for Spotify, GitHub, bookmark management, and translation.',
      'You want a lightweight memory footprint (under 60 MB RAM).',
    ],
    verdictSummary: 'These two utilities actually complement each other. PowerToys is an expansive system enhancement toolkit excels at window management and desktop utilities. Flow Launcher is a dedicated, plugin-rich application launcher that outperforms PowerToys Run in speed and customizability.',
    matchingToolSlug: 'mac-windows-shortcut-translator',
    matchingToolName: 'Mac & Windows Shortcut Translator',
    comparisonRows: [
      { feature: 'Primary Focus', optionA: 'Full OS utility suite (20+ independent modules)', optionB: 'Dedicated keyboard search & workflow launcher', winner: 'Tie' },
      { feature: 'Window Management (Snapping)', optionA: 'FancyZones (advanced grid layout editor)', optionB: 'None (Search launcher only)', winner: 'A' },
      { feature: 'Search Plugin Ecosystem', optionA: 'Basic bundled plugins (Run module)', optionB: '150+ community plugins (Spotify, GitHub, etc.)', winner: 'B' },
      { feature: 'File Search Integration', optionA: 'Windows Indexer integration', optionB: 'Instant voidtools Everything search integration', winner: 'B' },
      { feature: 'System RAM Footprint', optionA: '150 MB to 300 MB (depending on modules enabled)', optionB: '40 MB to 70 MB', winner: 'B' },
      { feature: 'Screen Utilities (OCR, Color)', optionA: 'Text Extractor, Color Picker, Screen Ruler', optionB: 'None built-in', winner: 'A' },
    ],
    faqs: [
      {
        question: 'Can I use PowerToys and Flow Launcher together?',
        answer: 'Yes! Many power users disable PowerToys Run inside the PowerToys settings and use Flow Launcher as their dedicated Alt+Space launcher while keeping FancyZones and Text Extractor active.',
      },
      {
        question: 'Do both tools support dark mode?',
        answer: 'Yes, both utilities support automatic dark and light theme switching matching your Windows 11 system accent.',
      },
    ],
  },

  '3utools-vs-imazing': {
    slug: '3utools-vs-imazing',
    title: '3uTools vs iMazing: iPhone Management & Backup Comparison',
    subtitle: 'An objective look at third-party iOS device management tools, backup capabilities, data transfer, and privacy considerations.',
    optionAName: '3uTools',
    optionBName: 'iMazing',
    optionAPermalink: '/compare/3utools-vs-imazing',
    optionBPermalink: '/pc-tools/imazing',
    appleOfficialNote: 'Important notice on Apple device management: Apple provides official, completely free local device backup and sync solutions. On macOS, use the native Finder sidebar. On Windows, use Apple Devices (available in the Microsoft Store) or iTunes. Third-party tools should only be considered when specific export or diagnostic capabilities are required.',
    optionAPickIf: [
      'You are looking for free Windows-only firmware flashing and diagnostic hardware readouts.',
      'You are willing to accept closed-source freeware from an overseas developer.',
    ],
    optionBPickIf: [
      'You prioritize strict privacy, local data storage, and zero telemetry on your device backups.',
      'You want granular backup browsing, selective message export, and WhatsApp transfers.',
      'You need a native macOS and Windows application with commercial enterprise support.',
    ],
    verdictSummary: 'Always start with Apple’s official tools (Finder on Mac or Apple Devices on Windows). If you require advanced third-party backup extraction, iMazing is the industry-standard choice built by DigiDNA in Switzerland with strict privacy practices. 3uTools offers free flashing diagnostics on Windows, but raises privacy concerns due to extensive server communications.',
    matchingToolSlug: 'iphone-battery-health-forecast',
    matchingToolName: 'iPhone Battery Health Forecaster',
    comparisonRows: [
      { feature: 'Official Apple Alternative', optionA: 'Finder (Mac) / Apple Devices (Win)', optionB: 'Finder (Mac) / Apple Devices (Win)', winner: 'Tie' },
      { feature: 'Developer Headquarters', optionA: 'China (Closed Source)', optionB: 'DigiDNA (Switzerland)', winner: 'B' },
      { feature: 'Pricing & Licensing', optionA: 'Freeware', optionB: 'Paid commercial license (Free trial available)', winner: 'A' },
      { feature: 'Platform Availability', optionA: 'Windows only', optionB: 'macOS and Windows native', winner: 'B' },
      { feature: 'Local Backup Extraction', optionA: 'Basic file explorer', optionB: 'Comprehensive backup browser (Messages, Photos, Notes)', winner: 'B' },
      { feature: 'Privacy & Telemetry', optionA: 'Transmits hardware identifiers to remote servers', optionB: 'Strict zero-telemetry local data architecture', winner: 'B' },
    ],
    faqs: [
      {
        question: 'Are third-party iPhone managers safe to use?',
        answer: 'Legitimate third-party tools like iMazing operate using official Apple MobileDevice communication protocols. However, you should never connect your iPhone to untrusted freeware tools with sensitive personal data.',
      },
      {
        question: 'Can iMazing or 3uTools bypass iCloud Activation Lock?',
        answer: 'No. Neither tool can bypass iCloud Activation Lock. We strictly adhere to security standards and do not support or promote unauthorized security bypasses.',
      },
    ],
  },

  'shizuku-adb-wireless-guide': {
    slug: 'shizuku-adb-wireless-guide',
    title: 'Shizuku & ADB Wireless Setup Guide: Grant Android Privileges Without Root',
    subtitle: 'Step-by-step setup guide for pairing Shizuku via Android Wireless Debugging to grant secure elevated permissions without a PC.',
    optionAName: 'Shizuku (Wireless Debugging)',
    optionBName: 'Standard ADB over USB Cable',
    optionAPermalink: '/android-tools/shizuku',
    optionBPermalink: '/tools/adb-fastboot-command-builder',
    optionAPickIf: [
      'You want to grant elevated permissions to apps (App Manager, Hail, Termux) directly on your phone without connecting to a computer.',
      'You are on Android 11 or newer with access to Wireless Debugging on Wi-Fi.',
      'You want a persistent permission service that stays active until your device reboots.',
    ],
    optionBPickIf: [
      'Your phone is running Android 10 or older (which lacks native on-device Wireless Debugging pairing).',
      'You need low-level recovery, bootloader access, or OS partition operations.',
      'You are diagnosing hardware logs or taking low-level system bug reports from a computer.',
    ],
    verdictSummary: 'Shizuku is one of the most useful tools in modern Android customization. It allows apps to execute ADB-level commands directly on-device without root. For initial setup on Android 11+, all you need is local Wi-Fi and Wireless Debugging. For older devices or firmware flashing, standard ADB over a USB cable remains essential.',
    matchingToolSlug: 'adb-fastboot-command-builder',
    matchingToolName: 'ADB & Fastboot Command Builder',
    comparisonRows: [
      { feature: 'Root Access Required?', optionA: 'No (Runs via ADB daemon)', optionB: 'No (Standard ADB)', winner: 'Tie' },
      { feature: 'Computer Needed?', optionA: 'No (Android 11+ on-device pairing)', optionB: 'Yes (PC / Mac required)', winner: 'A' },
      { feature: 'Security Model', optionA: 'Granular app-by-app permission approval prompt', optionB: 'Global shell access for connected computer', winner: 'A' },
      { feature: 'Reboot Persistence', optionA: 'Must be restarted after phone reboot', optionB: 'Active whenever USB cable is plugged in', winner: 'B' },
      { feature: 'Supported Android Versions', optionA: 'Android 11+ for wireless; Android 8+ with PC', optionB: 'All Android versions', winner: 'B' },
    ],
    faqs: [
      {
        question: 'Does Shizuku void my Android phone warranty?',
        answer: 'No. Shizuku uses Android’s official developer debugging APIs. It does not unlock your bootloader, flash custom partitions, or trip Knox / SafetyNet hardware flags.',
      },
      {
        question: 'Why does Shizuku stop working when I reboot my phone?',
        answer: 'Android’s security sandbox terminates developer debugging processes upon reboot. Simply re-open Shizuku on Wi-Fi and tap "Start" to resume the service in seconds.',
      },
    ],
  },
};
