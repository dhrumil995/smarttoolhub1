/**
 * Internal Linking & Link Juice Architecture Engine
 * 
 * Maps the 50 canonical pages of SmartToolHub into an authoritative PageRank link graph.
 * Directs link equity ("link juice") from high-click power hubs (Homepage, Generator,
 * Compatibility, Troubleshooting, Library) to lower-depth target pages, improving
 * crawling efficiency, indexation, and organic search authority.
 */

export type LinkJuiceTier = 'power' | 'mid' | 'growth-target';

export interface InternalLinkItem {
  targetPath: string;
  targetTitle: string;
  anchorText: string;
  relationship: 'parent-hub' | 'topic-sibling' | 'deep-action' | 'prerequisite' | 'troubleshooting-bridge';
  equityValue: 'high' | 'medium' | 'contextual';
}

export interface PageLinkingProfile {
  path: string;
  title: string;
  category: string;
  topicalSilo: 'Continuity & Wireless' | 'Automation & Shortcuts' | 'Apple Silicon & Hardware' | 'Media & Production' | 'System Utilities & Security' | 'Core Portal';
  tier: LinkJuiceTier;
  clicksCategory: 'most-clicks' | 'moderate-clicks' | 'least-clicks';
  inboundEquitySources: { sourcePath: string; sourceTitle: string; recommendedAnchor: string }[];
  outboundEquityTargets: InternalLinkItem[];
  semanticKeywords: string[];
}

export const INTERNAL_LINKING_PLAN_50_PAGES: PageLinkingProfile[] = [
  // =========================================================================
  // SECTION 1: TOP POWER HUBS (MOST CLICKS & TRAFFIC) — SOURCE HUBS
  // =========================================================================
  {
    path: '/',
    title: 'SmartToolHub — Apple Workflows, Shortcuts & Hardware Diagnostics Hub',
    category: 'Core Portal',
    topicalSilo: 'Core Portal',
    tier: 'power',
    clicksCategory: 'most-clicks',
    inboundEquitySources: [
      { sourcePath: '/library', sourceTitle: 'Workflow Library', recommendedAnchor: 'SmartToolHub Home' },
      { sourcePath: '/generator', sourceTitle: 'Shortcut Generator', recommendedAnchor: 'Apple Ecosystem Tools' }
    ],
    outboundEquityTargets: [
      { targetPath: '/generator', targetTitle: 'AI Shortcut Generator', anchorText: 'Siri Shortcuts Automation Generator', relationship: 'deep-action', equityValue: 'high' },
      { targetPath: '/compatibility', targetTitle: 'Hardware Compatibility Matrix', anchorText: 'macOS Sequoia & Apple Silicon Compatibility', relationship: 'deep-action', equityValue: 'high' },
      { targetPath: '/troubleshooting', targetTitle: 'Continuity & AirDrop Diagnostic Wizard', anchorText: 'AirDrop & Continuity Sync Doctor', relationship: 'deep-action', equityValue: 'high' },
      { targetPath: '/workflows/safari-distraction-control-clean-reading-mode', targetTitle: 'Safari Distraction Control', anchorText: 'Safari Distraction Control Guide', relationship: 'deep-action', equityValue: 'high' },
      { targetPath: '/workflows/run-local-llm-apple-silicon-unified-memory-ollama', targetTitle: 'Local LLM on Apple Silicon', anchorText: 'Run Local LLMs on Apple Silicon Unified Memory', relationship: 'deep-action', equityValue: 'high' },
      { targetPath: '/workflows/iphone-fast-charging-optimization-battery-health', targetTitle: 'iPhone Fast Charging Optimization', anchorText: 'iPhone 16 Fast Charging Calculator & Battery Guide', relationship: 'deep-action', equityValue: 'high' }
    ],
    semanticKeywords: ['Apple shortcuts', 'macOS Sequoia automations', 'iOS 18 workflows', 'AirDrop diagnostics', 'Continuity troubleshooting']
  },
  {
    path: '/generator',
    title: 'Apple Shortcut & Multi-Device Workflow Generator',
    category: 'Automation & Shortcuts',
    topicalSilo: 'Automation & Shortcuts',
    tier: 'power',
    clicksCategory: 'most-clicks',
    inboundEquitySources: [
      { sourcePath: '/', sourceTitle: 'Home Hub', recommendedAnchor: 'Shortcut Generator' },
      { sourcePath: '/library', sourceTitle: 'Workflow Library', recommendedAnchor: 'Custom Automation Generator' }
    ],
    outboundEquityTargets: [
      { targetPath: '/workflows/meeting-mode-dnd-slack-notes-shortcut', targetTitle: 'Meeting Mode Automation', anchorText: 'Automated Meeting Mode & DND Shortcut', relationship: 'topic-sibling', equityValue: 'high' },
      { targetPath: '/workflows/ios-photo-exif-location-metadata-scrubber-shortcut', targetTitle: 'EXIF Metadata Scrubber', anchorText: 'iOS Photo EXIF Location Scrubber Shortcut', relationship: 'topic-sibling', equityValue: 'high' },
      { targetPath: '/workflows/daily-standup-generator-apple-reminders-slack', targetTitle: 'Daily Standup Generator', anchorText: 'Daily Standup Reminders Slack Sync', relationship: 'topic-sibling', equityValue: 'high' },
      { targetPath: '/workflows/intelligent-low-power-mode-automation-shortcuts', targetTitle: 'Intelligent Low Power Mode', anchorText: 'Automated Battery Saver Shortcuts', relationship: 'topic-sibling', equityValue: 'high' },
      { targetPath: '/troubleshooting', targetTitle: 'Troubleshooting Wizard', anchorText: 'Fix Shortcut Automation Permission Errors', relationship: 'troubleshooting-bridge', equityValue: 'medium' }
    ],
    semanticKeywords: ['Siri Shortcuts builder', 'AppleScript generator', 'POSIX Zsh automations', 'iOS 18 share sheet tools']
  },
  {
    path: '/compatibility',
    title: 'macOS Sequoia & Apple Silicon Hardware Compatibility Matrix',
    category: 'Apple Silicon & Hardware',
    topicalSilo: 'Apple Silicon & Hardware',
    tier: 'power',
    clicksCategory: 'most-clicks',
    inboundEquitySources: [
      { sourcePath: '/', sourceTitle: 'Home Hub', recommendedAnchor: 'Hardware Compatibility Matrix' },
      { sourcePath: '/guides', sourceTitle: 'Engineering Guides', recommendedAnchor: 'Apple Hardware Specifications' }
    ],
    outboundEquityTargets: [
      { targetPath: '/workflows/mac-studio-m4-dual-6k-pro-display-xdr-daisy-chain', targetTitle: 'Dual 6K Display Setup', anchorText: 'M4 Mac Studio Dual 6K Pro Display XDR Wiring', relationship: 'deep-action', equityValue: 'high' },
      { targetPath: '/workflows/ipad-pro-m4-stage-manager-external-monitor-multitasking', targetTitle: 'iPad Pro M4 Stage Manager', anchorText: 'iPad Pro M4 Stage Manager 4K Monitor Setup', relationship: 'deep-action', equityValue: 'high' },
      { targetPath: '/workflows/iphone-mirroring-sequoia-remote-access', targetTitle: 'iPhone Mirroring Guide', anchorText: 'macOS Sequoia iPhone Mirroring Hardware Checklist', relationship: 'topic-sibling', equityValue: 'high' },
      { targetPath: '/troubleshooting', targetTitle: 'Continuity Troubleshooting', anchorText: 'Resolve Hardware Bluetooth & AWDL Mismatch', relationship: 'troubleshooting-bridge', equityValue: 'medium' }
    ],
    semanticKeywords: ['M4 chip compatibility', 'Apple Silicon external displays', 'macOS 15 supported Macs', 'T2 Security Chip']
  },
  {
    path: '/troubleshooting',
    title: 'Apple Continuity & AirDrop Diagnostic Wizard',
    category: 'Continuity & Wireless',
    topicalSilo: 'Continuity & Wireless',
    tier: 'power',
    clicksCategory: 'most-clicks',
    inboundEquitySources: [
      { sourcePath: '/', sourceTitle: 'Home Hub', recommendedAnchor: 'AirDrop & Continuity Diagnostics' },
      { sourcePath: '/generator', sourceTitle: 'Generator', recommendedAnchor: 'Troubleshooting Engine' }
    ],
    outboundEquityTargets: [
      { targetPath: '/workflows/high-speed-airdrop-prores-batch-transfer', targetTitle: 'High-Speed AirDrop 4K Transfer', anchorText: 'High-Speed 4K ProRes AirDrop Protocol', relationship: 'deep-action', equityValue: 'high' },
      { targetPath: '/workflows/universal-clipboard-handoff-developer-flow', targetTitle: 'Universal Clipboard Sync', anchorText: 'Zero-Lag Universal Clipboard & Handoff Pipeline', relationship: 'deep-action', equityValue: 'high' },
      { targetPath: '/workflows/instant-personal-hotspot-zero-password', targetTitle: 'Instant Personal Hotspot', anchorText: 'Instant Hotspot Without Password or Pairing', relationship: 'deep-action', equityValue: 'high' },
      { targetPath: '/guides', targetTitle: 'Engineering Guides', anchorText: 'AWDL Wireless Handshake Technical Guide', relationship: 'topic-sibling', equityValue: 'high' }
    ],
    semanticKeywords: ['AirDrop not working', 'AWDL reset', 'Universal Clipboard delay', 'Continuity Camera black screen']
  },
  {
    path: '/library',
    title: 'Verified Apple Workflows & Shortcuts Blueprint Library',
    category: 'Core Portal',
    topicalSilo: 'Core Portal',
    tier: 'power',
    clicksCategory: 'most-clicks',
    inboundEquitySources: [
      { sourcePath: '/', sourceTitle: 'Home Hub', recommendedAnchor: '120+ Workflow Library' },
      { sourcePath: '/pricing', sourceTitle: 'Pricing', recommendedAnchor: 'Full Blueprint Catalog' }
    ],
    outboundEquityTargets: [
      { targetPath: '/workflows/whisper-speech-to-text-transcription-apple-silicon-coreml', targetTitle: 'Whisper CoreML Transcription', anchorText: 'Local Whisper Audio Transcription on Apple Silicon', relationship: 'deep-action', equityValue: 'high' },
      { targetPath: '/workflows/macos-sips-batch-image-converter-webp-heic', targetTitle: 'macOS sips Batch Image Converter', anchorText: 'macOS sips Batch WebP & HEIC Converter', relationship: 'deep-action', equityValue: 'high' },
      { targetPath: '/workflows/encrypted-apfs-time-machine-network-nas-backup', targetTitle: 'Encrypted APFS Time Machine Backup', anchorText: 'Encrypted APFS Time Machine Network NAS Guide', relationship: 'deep-action', equityValue: 'high' },
      { targetPath: '/workflows/apple-passwords-cross-device-passkey-autofill', targetTitle: 'Apple Passwords Passkey Autofill', anchorText: 'Apple Passwords App & Passkey Autofill Blueprint', relationship: 'deep-action', equityValue: 'high' }
    ],
    semanticKeywords: ['Apple ecosystem blueprints', 'verified macOS workflows', 'curated iOS shortcuts', 'multi-device automation library']
  },

  // =========================================================================
  // SECTION 2: TOP WORKFLOW PAGES (MOST CLICKS) — SOURCE WORKFLOWS
  // =========================================================================
  {
    path: '/workflows/continuity-camera-desk-view-streaming',
    title: '4K Studio Webcam & Desk View Overhaul with iPhone',
    category: 'Audio & Video Production',
    topicalSilo: 'Media & Production',
    tier: 'power',
    clicksCategory: 'most-clicks',
    inboundEquitySources: [
      { sourcePath: '/', sourceTitle: 'Home Hub', recommendedAnchor: '4K Continuity Desk View' },
      { sourcePath: '/library', sourceTitle: 'Library', recommendedAnchor: 'iPhone 4K Studio Webcam' }
    ],
    outboundEquityTargets: [
      { targetPath: '/workflows/aggregate-audio-device-logic-pro-podcasting', targetTitle: 'Aggregate Audio MIDI Setup', anchorText: 'Multi-Track Aggregate Audio MIDI Podcasting Setup', relationship: 'deep-action', equityValue: 'high' },
      { targetPath: '/workflows/macos-sips-batch-image-converter-webp-heic', targetTitle: 'macOS sips Image Converter', anchorText: 'macOS Built-in sips Media Engine', relationship: 'topic-sibling', equityValue: 'medium' },
      { targetPath: '/compatibility', targetTitle: 'Compatibility Matrix', anchorText: 'Continuity Camera Hardware Support', relationship: 'prerequisite', equityValue: 'medium' },
      { targetPath: '/troubleshooting', targetTitle: 'Troubleshooting', anchorText: 'Fix Continuity Camera Black Screen or USB Latency', relationship: 'troubleshooting-bridge', equityValue: 'high' }
    ],
    semanticKeywords: ['Continuity Camera 4K', 'Desk View overhead camera', 'iPhone Mac webcam', 'Studio Light Center Stage']
  },
  {
    path: '/workflows/seamless-dual-display-universal-control',
    title: 'Dual-Device Command Center with Universal Control',
    category: 'Productivity & Focus',
    topicalSilo: 'Continuity & Wireless',
    tier: 'power',
    clicksCategory: 'most-clicks',
    inboundEquitySources: [
      { sourcePath: '/', sourceTitle: 'Home Hub', recommendedAnchor: 'Universal Control Setup' },
      { sourcePath: '/compatibility', sourceTitle: 'Compatibility', recommendedAnchor: 'Universal Control Requirements' }
    ],
    outboundEquityTargets: [
      { targetPath: '/workflows/sidecar-ipad-math-apple-pencil-notes', targetTitle: 'Sidecar & Apple Pencil', anchorText: 'iPad Sidecar with Apple Pencil Digitizer', relationship: 'topic-sibling', equityValue: 'high' },
      { targetPath: '/workflows/ipad-pro-m4-stage-manager-external-monitor-multitasking', targetTitle: 'iPad Pro M4 Stage Manager', anchorText: 'iPad Pro External Display Multitasking', relationship: 'deep-action', equityValue: 'high' },
      { targetPath: '/workflows/auto-unlock-mac-with-apple-watch-continuity', targetTitle: 'Auto Unlock with Apple Watch', anchorText: 'Auto-Unlock Mac with Apple Watch', relationship: 'deep-action', equityValue: 'medium' },
      { targetPath: '/troubleshooting', targetTitle: 'Troubleshooting', anchorText: 'Universal Control Cursor Boundary Disconnect Fix', relationship: 'troubleshooting-bridge', equityValue: 'high' }
    ],
    semanticKeywords: ['Universal Control Mac iPad', 'one keyboard mouse two screens', 'drag and drop cross device', 'macOS iPadOS synergy']
  },
  {
    path: '/workflows/iphone-mirroring-sequoia-remote-access',
    title: 'iPhone Mirroring on macOS Sequoia: Seamless Desktop Interaction',
    category: 'Productivity & Focus',
    topicalSilo: 'Continuity & Wireless',
    tier: 'power',
    clicksCategory: 'most-clicks',
    inboundEquitySources: [
      { sourcePath: '/', sourceTitle: 'Home Hub', recommendedAnchor: 'iPhone Mirroring on macOS Sequoia' },
      { sourcePath: '/guides', sourceTitle: 'Engineering Guides', recommendedAnchor: 'macOS 15 AWDL iPhone Mirroring' }
    ],
    outboundEquityTargets: [
      { targetPath: '/workflows/safari-distraction-control-clean-reading-mode', targetTitle: 'Safari Distraction Control', anchorText: 'Safari Distraction Control Clean Reading Mode', relationship: 'topic-sibling', equityValue: 'high' },
      { targetPath: '/workflows/photos-clean-up-object-removal-apple-intelligence', targetTitle: 'Apple Photos Clean Up', anchorText: 'Apple Intelligence Photos Clean Up Tool', relationship: 'deep-action', equityValue: 'high' },
      { targetPath: '/workflows/apple-passwords-cross-device-passkey-autofill', targetTitle: 'Apple Passwords App', anchorText: 'Apple Passwords App Cross-Device Autofill', relationship: 'deep-action', equityValue: 'high' },
      { targetPath: '/troubleshooting', targetTitle: 'Troubleshooting', anchorText: 'iPhone Mirroring "iPhone is in Use" Error Resolution', relationship: 'troubleshooting-bridge', equityValue: 'high' }
    ],
    semanticKeywords: ['iPhone Mirroring macOS Sequoia', 'use iPhone on Mac', 'remote iPhone control', 'drag drop files Mac to iPhone']
  },
  {
    path: '/workflows/sidecar-ipad-math-apple-pencil-notes',
    title: 'Paperless Study Station: iPad Sidecar with Apple Pencil Digitizer',
    category: 'Study & Research',
    topicalSilo: 'Media & Production',
    tier: 'power',
    clicksCategory: 'most-clicks',
    inboundEquitySources: [
      { sourcePath: '/', sourceTitle: 'Home Hub', recommendedAnchor: 'Paperless Study Station Sidecar' },
      { sourcePath: '/workflows/seamless-dual-display-universal-control', sourceTitle: 'Universal Control', recommendedAnchor: 'Sidecar Screen Extension' }
    ],
    outboundEquityTargets: [
      { targetPath: '/workflows/ipad-apple-pencil-math-notes-graphing-calculator', targetTitle: 'iPad Math Notes Calculator', anchorText: 'iPadOS 18 Math Notes & Graphing Calculator', relationship: 'deep-action', equityValue: 'high' },
      { targetPath: '/workflows/freeform-board-realtime-collaboration-facetime', targetTitle: 'Freeform Real-Time Board', anchorText: 'Freeform Infinite Canvas with Apple Pencil', relationship: 'topic-sibling', equityValue: 'high' },
      { targetPath: '/workflows/smart-grocery-list-auto-categorization-reminders', targetTitle: 'Smart Reminders Grocery List', anchorText: 'Smart Auto-Categorized Reminders List', relationship: 'deep-action', equityValue: 'medium' }
    ],
    semanticKeywords: ['Sidecar Mac iPad', 'Apple Pencil graphics tablet', 'iPad second monitor', 'annotate PDF on Mac with iPad']
  },

  // =========================================================================
  // SECTION 3: MID-TIER HUBS & GUIDES (MODERATE CLICKS) — BALANCED NODES
  // =========================================================================
  {
    path: '/guides',
    title: 'Apple Systems Engineering & Automation Guides | SmartToolHub',
    category: 'System Utilities & Security',
    topicalSilo: 'System Utilities & Security',
    tier: 'mid',
    clicksCategory: 'moderate-clicks',
    inboundEquitySources: [
      { sourcePath: '/', sourceTitle: 'Home Hub', recommendedAnchor: 'Apple Systems Engineering Guides' },
      { sourcePath: '/troubleshooting', sourceTitle: 'Troubleshooting', recommendedAnchor: 'Technical AWDL Guide' }
    ],
    outboundEquityTargets: [
      { targetPath: '/workflows/run-local-llm-apple-silicon-unified-memory-ollama', targetTitle: 'Local LLM on Apple Silicon', anchorText: 'Deploy Ollama & DeepSeek on M4 Unified Memory', relationship: 'deep-action', equityValue: 'high' },
      { targetPath: '/workflows/macos-zsh-homebrew-nightly-maintenance-pipeline', targetTitle: 'macOS Zsh Homebrew Maintenance', anchorText: 'Automated Zsh & Homebrew Clean-up Pipeline', relationship: 'deep-action', equityValue: 'high' },
      { targetPath: '/workflows/apfs-local-snapshots-recovery-terminal-tmutil', targetTitle: 'APFS Local Snapshots Recovery', anchorText: 'Recover Deleted Files via APFS Local Snapshots (`tmutil`)', relationship: 'deep-action', equityValue: 'high' }
    ],
    semanticKeywords: ['Apple systems engineering', 'AWDL protocol reverse engineering', 'Apple Silicon memory bandwidth', 'sips image command line']
  },
  {
    path: '/help',
    title: 'Apple Shortcuts Help Center & Troubleshooting Guide | SmartToolHub',
    category: 'Core Portal',
    topicalSilo: 'Core Portal',
    tier: 'mid',
    clicksCategory: 'moderate-clicks',
    inboundEquitySources: [
      { sourcePath: '/', sourceTitle: 'Home Hub', recommendedAnchor: 'Help Center' },
      { sourcePath: '/generator', sourceTitle: 'Generator', recommendedAnchor: 'Shortcut Automation Help' }
    ],
    outboundEquityTargets: [
      { targetPath: '/troubleshooting', targetTitle: 'Troubleshooting Wizard', anchorText: 'Continuity & AirDrop Diagnostic Tool', relationship: 'deep-action', equityValue: 'high' },
      { targetPath: '/workflows/intelligent-low-power-mode-automation-shortcuts', targetTitle: 'Low Power Mode Shortcut', anchorText: 'Battery Optimization Shortcuts', relationship: 'deep-action', equityValue: 'medium' },
      { targetPath: '/workflows/auto-unlock-mac-with-apple-watch-continuity', targetTitle: 'Auto Unlock Mac', anchorText: 'Fix Apple Watch Mac Unlock Failures', relationship: 'deep-action', equityValue: 'medium' }
    ],
    semanticKeywords: ['Shortcuts troubleshooting', 'Siri action errors', 'Apple ID sync issues', 'macOS permission dialogs']
  },
  {
    path: '/about',
    title: 'About SmartToolHub — Independent Apple Shortcuts & Automation Guides',
    category: 'Core Portal',
    topicalSilo: 'Core Portal',
    tier: 'mid',
    clicksCategory: 'moderate-clicks',
    inboundEquitySources: [
      { sourcePath: '/', sourceTitle: 'Home Hub', recommendedAnchor: 'About Editorial Standards' }
    ],
    outboundEquityTargets: [
      { targetPath: '/library', targetTitle: 'Workflow Library', anchorText: 'Explore Verified Apple Workflows', relationship: 'deep-action', equityValue: 'high' },
      { targetPath: '/generator', targetTitle: 'Generator', anchorText: 'Browser-Based Shortcut Generator', relationship: 'deep-action', equityValue: 'medium' },
      { targetPath: '/pricing', targetTitle: 'Pricing', anchorText: 'SmartToolHub Pro Developer Licensing', relationship: 'deep-action', equityValue: 'medium' }
    ],
    semanticKeywords: ['independent Apple engineering', 'zero-credential tools', 'Dhrumil Aslaliya', 'browser-native utilities']
  },
  {
    path: '/pricing',
    title: 'SmartToolHub Pro Pricing & Licensing Plans',
    category: 'Core Portal',
    topicalSilo: 'Core Portal',
    tier: 'mid',
    clicksCategory: 'moderate-clicks',
    inboundEquitySources: [
      { sourcePath: '/', sourceTitle: 'Home Hub', recommendedAnchor: 'Pro Licensing' },
      { sourcePath: '/generator', sourceTitle: 'Generator', recommendedAnchor: 'Upgrade to Pro' }
    ],
    outboundEquityTargets: [
      { targetPath: '/generator', targetTitle: 'Generator', anchorText: 'Unlimited AI Shortcut Generator', relationship: 'deep-action', equityValue: 'high' },
      { targetPath: '/library', targetTitle: 'Library', anchorText: 'Commercial-Use Workflow Library', relationship: 'deep-action', equityValue: 'high' }
    ],
    semanticKeywords: ['Pro lifetime license', 'Dodo payments', 'commercial automation templates', 'priority support']
  },
  {
    path: '/contact',
    title: 'Contact Engineering & Editorial Support',
    category: 'Core Portal',
    topicalSilo: 'Core Portal',
    tier: 'mid',
    clicksCategory: 'moderate-clicks',
    inboundEquitySources: [
      { sourcePath: '/', sourceTitle: 'Home Hub', recommendedAnchor: 'Contact Support' }
    ],
    outboundEquityTargets: [
      { targetPath: '/help', targetTitle: 'Help Center', anchorText: 'Self-Service Help Center', relationship: 'deep-action', equityValue: 'medium' },
      { targetPath: '/troubleshooting', targetTitle: 'Troubleshooting Wizard', anchorText: 'Run Automated Continuity Diagnostics', relationship: 'deep-action', equityValue: 'high' }
    ],
    semanticKeywords: ['editorial support', 'workflow submission', 'bug report', 'enterprise inquiry']
  },
  {
    path: '/privacy',
    title: 'Privacy Policy & Zero-Credentials Security Architecture',
    category: 'Core Portal',
    topicalSilo: 'System Utilities & Security',
    tier: 'mid',
    clicksCategory: 'moderate-clicks',
    inboundEquitySources: [
      { sourcePath: '/', sourceTitle: 'Home Hub', recommendedAnchor: 'Zero-Credentials Privacy Policy' }
    ],
    outboundEquityTargets: [
      { targetPath: '/workflows/apple-passwords-cross-device-passkey-autofill', targetTitle: 'Apple Passwords Guide', anchorText: 'Zero-Knowledge Apple Passwords Architecture', relationship: 'topic-sibling', equityValue: 'high' },
      { targetPath: '/workflows/encrypted-apfs-time-machine-network-nas-backup', targetTitle: 'Encrypted APFS Backups', anchorText: 'Hardware-Encrypted APFS Storage Protocols', relationship: 'deep-action', equityValue: 'medium' }
    ],
    semanticKeywords: ['client-side processing', 'no server storage', 'zero tracking', 'Secure Enclave privacy']
  },
  {
    path: '/terms',
    title: 'Terms of Service & Usage Guidelines',
    category: 'Core Portal',
    topicalSilo: 'System Utilities & Security',
    tier: 'mid',
    clicksCategory: 'moderate-clicks',
    inboundEquitySources: [
      { sourcePath: '/', sourceTitle: 'Home Hub', recommendedAnchor: 'Terms of Service' }
    ],
    outboundEquityTargets: [
      { targetPath: '/pricing', targetTitle: 'Pricing', anchorText: 'License Terms & Commercial Rights', relationship: 'topic-sibling', equityValue: 'medium' },
      { targetPath: '/privacy', targetTitle: 'Privacy Policy', anchorText: 'Data Security Guarantees', relationship: 'topic-sibling', equityValue: 'medium' }
    ],
    semanticKeywords: ['usage terms', 'code redistribution', 'disclaimer', 'intellectual property']
  },

  // =========================================================================
  // SECTION 4: REMAINING WORKFLOWS & WEAKER TARGET PAGES (LEAST CLICKS) — RECEIVE EQUITY
  // =========================================================================
  {
    path: '/workflows/universal-clipboard-handoff-developer-flow',
    title: 'Cross-Device Clipboard Sync: Mac, iPhone & iPad Clipboard Pipeline',
    category: 'Cross-Device File Sync',
    topicalSilo: 'Continuity & Wireless',
    tier: 'growth-target',
    clicksCategory: 'least-clicks',
    inboundEquitySources: [
      { sourcePath: '/troubleshooting', sourceTitle: 'Troubleshooting Wizard', recommendedAnchor: 'Zero-Lag Universal Clipboard & Handoff Pipeline' },
      { sourcePath: '/workflows/seamless-dual-display-universal-control', sourceTitle: 'Universal Control', recommendedAnchor: 'Cross-Device Clipboard Sync' }
    ],
    outboundEquityTargets: [
      { targetPath: '/workflows/apple-passwords-cross-device-passkey-autofill', targetTitle: 'Apple Passwords Passkey Autofill', anchorText: 'Seamless Passkey & Password Cross-Device Autofill', relationship: 'deep-action', equityValue: 'high' },
      { targetPath: '/troubleshooting', targetTitle: 'Troubleshooting', anchorText: 'Diagnose Clipboard Stuttering Over Wi-Fi', relationship: 'troubleshooting-bridge', equityValue: 'medium' }
    ],
    semanticKeywords: ['Universal Clipboard Mac iPhone', 'Handoff not syncing', 'copy paste across Apple devices', 'Bluetooth LE clipboard tokens']
  },
  {
    path: '/workflows/high-speed-airdrop-prores-batch-transfer',
    title: 'High-Speed 4K ProRes Video Ingestion via Peer-to-Peer AirDrop',
    category: 'Cross-Device File Sync',
    topicalSilo: 'Continuity & Wireless',
    tier: 'growth-target',
    clicksCategory: 'least-clicks',
    inboundEquitySources: [
      { sourcePath: '/troubleshooting', sourceTitle: 'Troubleshooting Wizard', recommendedAnchor: 'High-Speed 4K ProRes AirDrop Protocol' },
      { sourcePath: '/', sourceTitle: 'Home Hub', recommendedAnchor: 'High-Speed AirDrop ProRes Transfer' }
    ],
    outboundEquityTargets: [
      { targetPath: '/workflows/macos-sips-batch-image-converter-webp-heic', targetTitle: 'macOS sips Batch Converter', anchorText: 'Post-AirDrop Batch Asset Compression via sips', relationship: 'deep-action', equityValue: 'high' },
      { targetPath: '/workflows/instant-personal-hotspot-zero-password', targetTitle: 'Instant Personal Hotspot', anchorText: 'Maintain Direct Wi-Fi Channel During File Transfers', relationship: 'topic-sibling', equityValue: 'medium' }
    ],
    semanticKeywords: ['AirDrop 4K ProRes transfer', 'fastest file transfer iPhone to Mac', 'AWDL 5GHz channel optimization', 'bypass router for AirDrop']
  },
  {
    path: '/workflows/unified-apple-focus-shortcuts-automation',
    title: 'Cross-Device Deep Work Focus Mode with Automated Filter Pipelines',
    category: 'Productivity & Focus',
    topicalSilo: 'Automation & Shortcuts',
    tier: 'growth-target',
    clicksCategory: 'least-clicks',
    inboundEquitySources: [
      { sourcePath: '/generator', sourceTitle: 'Shortcut Generator', recommendedAnchor: 'Automated Deep Work Focus Mode' },
      { sourcePath: '/', sourceTitle: 'Home Hub', recommendedAnchor: 'Focus Mode Shortcuts Automation' }
    ],
    outboundEquityTargets: [
      { targetPath: '/workflows/meeting-mode-dnd-slack-notes-shortcut', targetTitle: 'Meeting Mode Shortcut', anchorText: 'Meeting Mode Mute & Calendar Integration', relationship: 'deep-action', equityValue: 'high' },
      { targetPath: '/workflows/screen-time-downtime-and-app-limits-regimen', targetTitle: 'Screen Time & Downtime Limits', anchorText: 'Strict Screen Time App Limit Enforcer', relationship: 'deep-action', equityValue: 'high' }
    ],
    semanticKeywords: ['Apple Focus Mode shortcuts', 'filter notifications Mac iPhone', 'DND automation', 'Lock Screen focus automation']
  },
  {
    path: '/workflows/instant-personal-hotspot-zero-password',
    title: 'Instant Personal Hotspot with Zero Passwords or Manual Pairing',
    category: 'Productivity & Focus',
    topicalSilo: 'Continuity & Wireless',
    tier: 'growth-target',
    clicksCategory: 'least-clicks',
    inboundEquitySources: [
      { sourcePath: '/troubleshooting', sourceTitle: 'Troubleshooting Wizard', recommendedAnchor: 'Instant Hotspot Without Password or Pairing' }
    ],
    outboundEquityTargets: [
      { targetPath: '/troubleshooting', targetTitle: 'Troubleshooting', anchorText: 'Fix Instant Hotspot Disconnect During Mac Sleep', relationship: 'troubleshooting-bridge', equityValue: 'high' },
      { targetPath: '/workflows/iphone-fast-charging-optimization-battery-health', targetTitle: 'iPhone Fast Charging Optimization', anchorText: 'Reduce Thermal Throttling While Hotspotting', relationship: 'topic-sibling', equityValue: 'medium' }
    ],
    semanticKeywords: ['Instant Hotspot Mac', 'iPhone tethering no password', 'auto connect personal hotspot', 'cellular data sharing Apple']
  },
  {
    path: '/workflows/apple-intelligence-writing-tools-system-mac-ios',
    title: 'Apple Intelligence Writing Tools & Smart Proofreading across Mac & iPhone',
    category: 'Productivity & Focus',
    topicalSilo: 'Automation & Shortcuts',
    tier: 'growth-target',
    clicksCategory: 'least-clicks',
    inboundEquitySources: [
      { sourcePath: '/', sourceTitle: 'Home Hub', recommendedAnchor: 'Apple Intelligence Writing Tools' },
      { sourcePath: '/library', sourceTitle: 'Library', recommendedAnchor: 'System-Wide Writing Tools' }
    ],
    outboundEquityTargets: [
      { targetPath: '/workflows/photos-clean-up-object-removal-apple-intelligence', targetTitle: 'Photos Clean Up Tool', anchorText: 'Apple Intelligence Clean Up in Photos', relationship: 'deep-action', equityValue: 'high' },
      { targetPath: '/workflows/voice-memos-audio-recording-automatic-transcription', targetTitle: 'Voice Memos Audio Transcription', anchorText: 'Live Audio Transcription & Notes Summarization', relationship: 'deep-action', equityValue: 'high' },
      { targetPath: '/workflows/run-local-llm-apple-silicon-unified-memory-ollama', targetTitle: 'Local LLMs on Apple Silicon', anchorText: 'Run Private Offline LLMs via Ollama & CoreML', relationship: 'topic-sibling', equityValue: 'high' }
    ],
    semanticKeywords: ['Apple Intelligence writing tools', 'macOS 15 rewrite proofread', 'summarize text in Mail Safari', 'on-device neural engine proofreading']
  },
  {
    path: '/workflows/safari-distraction-control-clean-reading-mode',
    title: 'Safari Distraction Control: Clean Reading & Ad-Banner Vaporization',
    category: 'Productivity & Focus',
    topicalSilo: 'Automation & Shortcuts',
    tier: 'growth-target',
    clicksCategory: 'least-clicks',
    inboundEquitySources: [
      { sourcePath: '/', sourceTitle: 'Home Hub', recommendedAnchor: 'Safari Distraction Control Guide' },
      { sourcePath: '/workflows/iphone-mirroring-sequoia-remote-access', sourceTitle: 'iPhone Mirroring', recommendedAnchor: 'Safari Distraction Control Clean Reading Mode' }
    ],
    outboundEquityTargets: [
      { targetPath: '/workflows/safari-profiles-and-tab-groups-client-separation', targetTitle: 'Safari Profiles & Tab Groups', anchorText: 'Safari Profiles & Tab Groups for Work Separation', relationship: 'deep-action', equityValue: 'high' },
      { targetPath: '/workflows/screen-time-downtime-and-app-limits-regimen', targetTitle: 'Screen Time Limits', anchorText: 'Strict Web Focus & Screen Time Rules', relationship: 'topic-sibling', equityValue: 'medium' }
    ],
    semanticKeywords: ['Safari Distraction Control', 'hide distracting items Safari iOS 18', 'clean reading web pages Mac', 'hide banner popups Safari']
  },
  {
    path: '/workflows/apple-passwords-cross-device-passkey-autofill',
    title: 'Apple Passwords App: Cross-Device Passkey & 2FA Autofill Mastery',
    category: 'System Utilities & Security',
    topicalSilo: 'System Utilities & Security',
    tier: 'growth-target',
    clicksCategory: 'least-clicks',
    inboundEquitySources: [
      { sourcePath: '/library', sourceTitle: 'Library', recommendedAnchor: 'Apple Passwords App & Passkey Autofill Blueprint' },
      { sourcePath: '/privacy', sourceTitle: 'Privacy Policy', recommendedAnchor: 'Zero-Knowledge Apple Passwords Architecture' }
    ],
    outboundEquityTargets: [
      { targetPath: '/workflows/encrypted-apfs-time-machine-network-nas-backup', targetTitle: 'Encrypted APFS Backups', anchorText: 'Hardware Secure Enclave Key Backups', relationship: 'deep-action', equityValue: 'high' },
      { targetPath: '/workflows/auto-unlock-mac-with-apple-watch-continuity', targetTitle: 'Auto-Unlock Mac with Apple Watch', anchorText: 'Approve Admin & Password Prompts with Apple Watch', relationship: 'deep-action', equityValue: 'high' }
    ],
    semanticKeywords: ['Apple Passwords app iOS 18', 'passkey autofill Mac', 'built-in 2FA authenticator Apple', 'replace 1Password with Apple Passwords']
  },
  {
    path: '/workflows/photos-clean-up-object-removal-apple-intelligence',
    title: 'Apple Photos Clean Up: Smart Object Removal with Apple Intelligence',
    category: 'Content Creation',
    topicalSilo: 'Media & Production',
    tier: 'growth-target',
    clicksCategory: 'least-clicks',
    inboundEquitySources: [
      { sourcePath: '/workflows/apple-intelligence-writing-tools-system-mac-ios', sourceTitle: 'Writing Tools', recommendedAnchor: 'Apple Intelligence Clean Up in Photos' },
      { sourcePath: '/workflows/iphone-mirroring-sequoia-remote-access', sourceTitle: 'iPhone Mirroring', recommendedAnchor: 'Apple Intelligence Photos Clean Up Tool' }
    ],
    outboundEquityTargets: [
      { targetPath: '/workflows/macos-sips-batch-image-converter-webp-heic', targetTitle: 'macOS sips Batch Converter', anchorText: 'Batch Export & Compress Retouched Photos via sips', relationship: 'deep-action', equityValue: 'high' },
      { targetPath: '/workflows/ios-photo-exif-location-metadata-scrubber-shortcut', targetTitle: 'EXIF Location Scrubber', anchorText: 'Remove Geolocation Before Sharing Retouched Photos', relationship: 'topic-sibling', equityValue: 'high' }
    ],
    semanticKeywords: ['Photos Clean Up tool iOS 18', 'object eraser Apple Photos', 'Apple Intelligence photo retouching', 'remove photobombers Mac iPhone']
  },
  {
    path: '/workflows/iphone-fast-charging-optimization-battery-health',
    title: 'iPhone 16 Fast Charging Optimization & 80% Battery Limit Mastery',
    category: 'System Utilities & Security',
    topicalSilo: 'Apple Silicon & Hardware',
    tier: 'growth-target',
    clicksCategory: 'least-clicks',
    inboundEquitySources: [
      { sourcePath: '/', sourceTitle: 'Home Hub', recommendedAnchor: 'iPhone 16 Fast Charging Calculator & Battery Guide' },
      { sourcePath: '/generator', sourceTitle: 'Generator', recommendedAnchor: 'Battery Charging Calculations' }
    ],
    outboundEquityTargets: [
      { targetPath: '/workflows/intelligent-low-power-mode-automation-shortcuts', targetTitle: 'Intelligent Low Power Mode', anchorText: 'Automate Low Power Mode Below 30% Battery', relationship: 'deep-action', equityValue: 'high' },
      { targetPath: '/compatibility', targetTitle: 'Compatibility', anchorText: 'USB-C Power Delivery Wattage Matrix for iPhone 16', relationship: 'topic-sibling', equityValue: 'medium' }
    ],
    semanticKeywords: ['iPhone 16 fast charge wattage', '80% charge limit battery health', 'USB-C PD fast charge benchmarks', 'prolong iPhone lithium battery lifespan']
  },
  {
    path: '/workflows/voice-memos-audio-recording-automatic-transcription',
    title: 'Voice Memos to Text: Automatic Audio Transcription & Note Synthesis',
    category: 'Productivity & Focus',
    topicalSilo: 'Automation & Shortcuts',
    tier: 'growth-target',
    clicksCategory: 'least-clicks',
    inboundEquitySources: [
      { sourcePath: '/workflows/apple-intelligence-writing-tools-system-mac-ios', sourceTitle: 'Writing Tools', recommendedAnchor: 'Live Audio Transcription & Notes Summarization' }
    ],
    outboundEquityTargets: [
      { targetPath: '/workflows/whisper-speech-to-text-transcription-apple-silicon-coreml', targetTitle: 'Local Whisper CoreML Transcription', anchorText: 'High-Accuracy Long-Form Whisper Transcription on Mac', relationship: 'deep-action', equityValue: 'high' },
      { targetPath: '/workflows/apple-intelligence-writing-tools-system-mac-ios', targetTitle: 'Apple Intelligence Writing Tools', anchorText: 'Format Audio Transcripts with Apple Intelligence', relationship: 'topic-sibling', equityValue: 'medium' }
    ],
    semanticKeywords: ['iOS 18 Voice Memos transcription', 'transcribe lecture audio iPhone', 'Notes app audio recording summary', 'speech to text Apple Notes']
  },
  {
    path: '/workflows/ipad-apple-pencil-math-notes-graphing-calculator',
    title: 'iPadOS 18 Math Notes & Dynamic Graphing with Apple Pencil',
    category: 'Study & Research',
    topicalSilo: 'Media & Production',
    tier: 'growth-target',
    clicksCategory: 'least-clicks',
    inboundEquitySources: [
      { sourcePath: '/workflows/sidecar-ipad-math-apple-pencil-notes', sourceTitle: 'Sidecar & Apple Pencil', recommendedAnchor: 'iPadOS 18 Math Notes & Graphing Calculator' }
    ],
    outboundEquityTargets: [
      { targetPath: '/workflows/sidecar-ipad-math-apple-pencil-notes', targetTitle: 'Sidecar Studio', anchorText: 'Project Math Notes onto Mac Desktop via Sidecar', relationship: 'prerequisite', equityValue: 'high' },
      { targetPath: '/workflows/freeform-board-realtime-collaboration-facetime', targetTitle: 'Freeform Board', anchorText: 'Share Handwritten Math Proofs in Freeform', relationship: 'deep-action', equityValue: 'medium' }
    ],
    semanticKeywords: ['iPadOS 18 Math Notes', 'Apple Pencil solve equations', 'Calculator app graphing iPad', 'handwritten formulas calculator']
  },
  {
    path: '/workflows/auto-unlock-mac-with-apple-watch-continuity',
    title: 'Auto-Unlock Mac & Touch ID Approvals with Apple Watch',
    category: 'System Utilities & Security',
    topicalSilo: 'Continuity & Wireless',
    tier: 'growth-target',
    clicksCategory: 'least-clicks',
    inboundEquitySources: [
      { sourcePath: '/workflows/seamless-dual-display-universal-control', sourceTitle: 'Universal Control', recommendedAnchor: 'Auto-Unlock Mac with Apple Watch' },
      { sourcePath: '/workflows/apple-passwords-cross-device-passkey-autofill', sourceTitle: 'Apple Passwords', recommendedAnchor: 'Approve Admin & Password Prompts with Apple Watch' }
    ],
    outboundEquityTargets: [
      { targetPath: '/troubleshooting', targetTitle: 'Troubleshooting', anchorText: 'Fix "Your Mac was unable to communicate with your Apple Watch"', relationship: 'troubleshooting-bridge', equityValue: 'high' },
      { targetPath: '/workflows/apple-passwords-cross-device-passkey-autofill', targetTitle: 'Apple Passwords', anchorText: 'Double-Click Side Button for Sudo & Keychain Access', relationship: 'topic-sibling', equityValue: 'medium' }
    ],
    semanticKeywords: ['unlock Mac with Apple Watch', 'auto unlock Mac continuity', 'Apple Watch approve password Mac', 'Mac watch proximity unlock']
  },
  {
    path: '/workflows/airplay-screen-mirroring-to-mac-studio-display',
    title: 'AirPlay to Mac: Stream iPad & iPhone Displays onto Studio Display',
    category: 'Audio & Video Production',
    topicalSilo: 'Media & Production',
    tier: 'growth-target',
    clicksCategory: 'least-clicks',
    inboundEquitySources: [
      { sourcePath: '/workflows/continuity-camera-desk-view-streaming', sourceTitle: 'Continuity Camera', recommendedAnchor: 'AirPlay Mirroring to Mac' }
    ],
    outboundEquityTargets: [
      { targetPath: '/workflows/mac-studio-m4-dual-6k-pro-display-xdr-daisy-chain', targetTitle: 'Mac Studio Dual 6K Setup', anchorText: 'Mac Studio Multi-Display Topology', relationship: 'deep-action', equityValue: 'high' },
      { targetPath: '/troubleshooting', targetTitle: 'Troubleshooting', anchorText: 'Fix AirPlay to Mac Resolution Scaling & Audio Sync', relationship: 'troubleshooting-bridge', equityValue: 'medium' }
    ],
    semanticKeywords: ['AirPlay to Mac', 'stream iPhone screen to Mac', 'use Mac as AirPlay speaker', 'mirror iPad Pro to Mac Studio Display']
  },
  {
    path: '/workflows/macos-sips-batch-image-converter-webp-heic',
    title: 'macOS Native sips: Sub-Millisecond Batch WebP & HEIC Converter',
    category: 'Content Creation',
    topicalSilo: 'Media & Production',
    tier: 'growth-target',
    clicksCategory: 'least-clicks',
    inboundEquitySources: [
      { sourcePath: '/library', sourceTitle: 'Library', recommendedAnchor: 'macOS sips Batch WebP & HEIC Converter' },
      { sourcePath: '/workflows/high-speed-airdrop-prores-batch-transfer', sourceTitle: 'AirDrop Transfer', recommendedAnchor: 'Post-AirDrop Batch Asset Compression via sips' },
      { sourcePath: '/guides', sourceTitle: 'Engineering Guides', recommendedAnchor: 'High-Throughput Digital Media sips Pipeline' }
    ],
    outboundEquityTargets: [
      { targetPath: '/workflows/ios-photo-exif-location-metadata-scrubber-shortcut', targetTitle: 'EXIF Scrubber', anchorText: 'Automate EXIF Cleansing Before Batch Resizing', relationship: 'deep-action', equityValue: 'high' },
      { targetPath: '/workflows/photos-clean-up-object-removal-apple-intelligence', targetTitle: 'Photos Clean Up', anchorText: 'AI Image Cleanup Before WebP Compression', relationship: 'topic-sibling', equityValue: 'medium' }
    ],
    semanticKeywords: ['sips command line macOS', 'batch convert HEIC to WebP', 'resize images terminal Mac', 'compress photos without Photoshop']
  },
  {
    path: '/workflows/run-local-llm-apple-silicon-unified-memory-ollama',
    title: 'Run 70B Local LLMs on Apple Silicon Unified Memory with Ollama',
    category: 'Developer & Automation',
    topicalSilo: 'Apple Silicon & Hardware',
    tier: 'growth-target',
    clicksCategory: 'least-clicks',
    inboundEquitySources: [
      { sourcePath: '/', sourceTitle: 'Home Hub', recommendedAnchor: 'Run Local LLMs on Apple Silicon Unified Memory' },
      { sourcePath: '/guides', sourceTitle: 'Engineering Guides', recommendedAnchor: 'Deploy Ollama & DeepSeek on M4 Unified Memory' }
    ],
    outboundEquityTargets: [
      { targetPath: '/workflows/whisper-speech-to-text-transcription-apple-silicon-coreml', targetTitle: 'Whisper CoreML Transcription', anchorText: 'Pair Local LLM with Offline Whisper Transcription', relationship: 'deep-action', equityValue: 'high' },
      { targetPath: '/compatibility', targetTitle: 'Compatibility', anchorText: 'Unified Memory Bandwidth Specs (M4 Pro / Max / Ultra)', relationship: 'prerequisite', equityValue: 'high' }
    ],
    semanticKeywords: ['run local LLM Mac', 'Ollama Apple Silicon M4', 'unified memory LLM bandwidth', 'DeepSeek R1 local Mac']
  },
  {
    path: '/workflows/meeting-mode-dnd-slack-notes-shortcut',
    title: 'Automated Meeting Mode: DND, Slack Status & Timestamped Notes',
    category: 'Productivity & Focus',
    topicalSilo: 'Automation & Shortcuts',
    tier: 'growth-target',
    clicksCategory: 'least-clicks',
    inboundEquitySources: [
      { sourcePath: '/generator', sourceTitle: 'Shortcut Generator', recommendedAnchor: 'Automated Meeting Mode & DND Shortcut' },
      { sourcePath: '/workflows/unified-apple-focus-shortcuts-automation', sourceTitle: 'Focus Shortcuts', recommendedAnchor: 'Meeting Mode Mute & Calendar Integration' }
    ],
    outboundEquityTargets: [
      { targetPath: '/workflows/daily-standup-generator-apple-reminders-slack', targetTitle: 'Daily Standup Generator', anchorText: 'Generate Daily Standups from Completed Meeting Action Items', relationship: 'deep-action', equityValue: 'high' },
      { targetPath: '/generator', targetTitle: 'Generator', anchorText: 'Generate Custom Slack Webhook Shortcuts', relationship: 'deep-action', equityValue: 'medium' }
    ],
    semanticKeywords: ['Meeting Mode shortcut', 'auto set Slack status in meeting', 'mute phone during calendar event', 'automatic meeting notes template']
  },
  {
    path: '/workflows/ios-photo-exif-location-metadata-scrubber-shortcut',
    title: 'iOS Photo Privacy: Automatic GPS Location & EXIF Metadata Scrubber',
    category: 'Content Creation',
    topicalSilo: 'System Utilities & Security',
    tier: 'growth-target',
    clicksCategory: 'least-clicks',
    inboundEquitySources: [
      { sourcePath: '/generator', sourceTitle: 'Shortcut Generator', recommendedAnchor: 'iOS Photo EXIF Location Scrubber Shortcut' },
      { sourcePath: '/workflows/macos-sips-batch-image-converter-webp-heic', sourceTitle: 'sips Converter', recommendedAnchor: 'Automate EXIF Cleansing Before Batch Resizing' }
    ],
    outboundEquityTargets: [
      { targetPath: '/privacy', targetTitle: 'Privacy Architecture', anchorText: 'Zero-Telemetry Image Processing Standards', relationship: 'deep-action', equityValue: 'medium' },
      { targetPath: '/workflows/macos-sips-batch-image-converter-webp-heic', targetTitle: 'sips Converter', anchorText: 'Batch Convert Cleansed Photos to High-Efficiency WebP', relationship: 'topic-sibling', equityValue: 'high' }
    ],
    semanticKeywords: ['remove GPS from photo iPhone', 'strip EXIF data shortcut', 'scrub photo metadata iOS Share Sheet', 'photo privacy shortcut']
  },
  {
    path: '/workflows/daily-standup-generator-apple-reminders-slack',
    title: 'Daily Standup Generator: Apple Reminders to Markdown Slack Post',
    category: 'Productivity & Focus',
    topicalSilo: 'Automation & Shortcuts',
    tier: 'growth-target',
    clicksCategory: 'least-clicks',
    inboundEquitySources: [
      { sourcePath: '/generator', sourceTitle: 'Shortcut Generator', recommendedAnchor: 'Daily Standup Reminders Slack Sync' },
      { sourcePath: '/workflows/meeting-mode-dnd-slack-notes-shortcut', sourceTitle: 'Meeting Mode', recommendedAnchor: 'Generate Daily Standups from Completed Meeting Action Items' }
    ],
    outboundEquityTargets: [
      { targetPath: '/workflows/smart-grocery-list-auto-categorization-reminders', targetTitle: 'Smart Reminders Lists', anchorText: 'Advanced Apple Reminders Smart List Filtering', relationship: 'topic-sibling', equityValue: 'medium' },
      { targetPath: '/generator', targetTitle: 'Generator', anchorText: 'Synthesize Custom Reminders Automations', relationship: 'deep-action', equityValue: 'medium' }
    ],
    semanticKeywords: ['daily standup shortcut', 'Apple Reminders to Slack', 'generate status report iPhone', 'markdown standup automation']
  },
  {
    path: '/workflows/mac-studio-m4-dual-6k-pro-display-xdr-daisy-chain',
    title: 'Mac Studio M4: Dual 6K Pro Display XDR Thunderbolt 5 Bus Topology',
    category: 'Developer & Automation',
    topicalSilo: 'Apple Silicon & Hardware',
    tier: 'growth-target',
    clicksCategory: 'least-clicks',
    inboundEquitySources: [
      { sourcePath: '/compatibility', sourceTitle: 'Compatibility Matrix', recommendedAnchor: 'M4 Mac Studio Dual 6K Pro Display XDR Wiring' },
      { sourcePath: '/workflows/airplay-screen-mirroring-to-mac-studio-display', sourceTitle: 'AirPlay to Mac', recommendedAnchor: 'Mac Studio Multi-Display Topology' }
    ],
    outboundEquityTargets: [
      { targetPath: '/compatibility', targetTitle: 'Compatibility', anchorText: 'Verify DisplayPort Bandwidth on Mac Studio Ports', relationship: 'prerequisite', equityValue: 'high' },
      { targetPath: '/workflows/ipad-pro-m4-stage-manager-external-monitor-multitasking', targetTitle: 'iPad Pro Stage Manager', anchorText: 'Add iPad Pro as Third Floating Display', relationship: 'topic-sibling', equityValue: 'high' }
    ],
    semanticKeywords: ['Mac Studio dual 6K displays', 'Thunderbolt 5 bus allocation Mac', 'Pro Display XDR daisy chain', 'dual monitor M4 Max setup']
  },
  {
    path: '/workflows/ipad-pro-m4-stage-manager-external-monitor-multitasking',
    title: 'iPad Pro M4 Stage Manager: Full 6K External Monitor Desktop Rig',
    category: 'Productivity & Focus',
    topicalSilo: 'Continuity & Wireless',
    tier: 'growth-target',
    clicksCategory: 'least-clicks',
    inboundEquitySources: [
      { sourcePath: '/compatibility', sourceTitle: 'Compatibility Matrix', recommendedAnchor: 'iPad Pro M4 Stage Manager 4K Monitor Setup' },
      { sourcePath: '/workflows/seamless-dual-display-universal-control', sourceTitle: 'Universal Control', recommendedAnchor: 'iPad Pro External Display Multitasking' }
    ],
    outboundEquityTargets: [
      { targetPath: '/workflows/seamless-dual-display-universal-control', targetTitle: 'Universal Control', anchorText: 'Bridge Mac Keyboard to External iPad Monitor', relationship: 'deep-action', equityValue: 'high' },
      { targetPath: '/compatibility', targetTitle: 'Compatibility', anchorText: 'Stage Manager External Display Requirements', relationship: 'prerequisite', equityValue: 'medium' }
    ],
    semanticKeywords: ['iPad Pro external display Stage Manager', 'iPad desktop mode full screen', 'M4 iPad Pro 6K monitor output', 'iPad multitasking monitor']
  },
  {
    path: '/workflows/homekit-smart-home-morning-wake-up-adaptive-lighting',
    title: 'Apple HomeKit: Adaptive Morning Wake-Up Scene & Gentle Lighting',
    category: 'Productivity & Focus',
    topicalSilo: 'Automation & Shortcuts',
    tier: 'growth-target',
    clicksCategory: 'least-clicks',
    inboundEquitySources: [
      { sourcePath: '/generator', sourceTitle: 'Shortcut Generator', recommendedAnchor: 'HomeKit Smart Home Automation Routines' }
    ],
    outboundEquityTargets: [
      { targetPath: '/workflows/unified-apple-focus-shortcuts-automation', targetTitle: 'Focus Automation', anchorText: 'Trigger Morning Routine via Sleep Focus Deactivation', relationship: 'deep-action', equityValue: 'high' },
      { targetPath: '/workflows/apple-health-automated-workout-hydration-shortcut', targetTitle: 'Health Automation', anchorText: 'Log Morning Hydration and Wake-Up Metrics', relationship: 'topic-sibling', equityValue: 'medium' }
    ],
    semanticKeywords: ['HomeKit morning scene', 'Adaptive Lighting Apple Home', 'Shortcuts smart home automation', 'gradual wake-up light Siri']
  },
  {
    path: '/workflows/encrypted-apfs-time-machine-network-nas-backup',
    title: 'APFS Network Time Machine: Hardware-Encrypted TrueNAS Backup',
    category: 'Developer & Automation',
    topicalSilo: 'System Utilities & Security',
    tier: 'growth-target',
    clicksCategory: 'least-clicks',
    inboundEquitySources: [
      { sourcePath: '/library', sourceTitle: 'Library', recommendedAnchor: 'Encrypted APFS Time Machine Network NAS Guide' },
      { sourcePath: '/privacy', sourceTitle: 'Privacy', recommendedAnchor: 'Hardware-Encrypted APFS Storage Protocols' }
    ],
    outboundEquityTargets: [
      { targetPath: '/workflows/apfs-local-snapshots-recovery-terminal-tmutil', targetTitle: 'APFS Local Snapshots Recovery', anchorText: 'Instant Rollback via Local APFS Snapshots (`tmutil`)', relationship: 'deep-action', equityValue: 'high' },
      { targetPath: '/workflows/apple-passwords-cross-device-passkey-autofill', targetTitle: 'Apple Passwords', anchorText: 'Safely Store NAS SMB Credentials in Apple Passwords', relationship: 'topic-sibling', equityValue: 'medium' }
    ],
    semanticKeywords: ['Time Machine APFS NAS', 'network backup Mac encrypted', 'TrueNAS Apple Time Machine SMB', 'secure Mac system backup']
  },
  {
    path: '/workflows/xcode-wireless-ios-device-debugging',
    title: 'Xcode 16 Wireless Debugging: Deploy to iPhone & iPad Over Wi-Fi',
    category: 'Developer & Automation',
    topicalSilo: 'Continuity & Wireless',
    tier: 'growth-target',
    clicksCategory: 'least-clicks',
    inboundEquitySources: [
      { sourcePath: '/guides', sourceTitle: 'Engineering Guides', recommendedAnchor: 'Xcode Wireless Network Debugging' }
    ],
    outboundEquityTargets: [
      { targetPath: '/troubleshooting', targetTitle: 'Troubleshooting', anchorText: 'Fix Xcode "Device Disconnected" or Bonjour Drops', relationship: 'troubleshooting-bridge', equityValue: 'high' },
      { targetPath: '/workflows/macos-zsh-homebrew-nightly-maintenance-pipeline', targetTitle: 'Zsh Maintenance', anchorText: 'Automate Xcode DerivedData Clean-up in Zsh', relationship: 'deep-action', equityValue: 'medium' }
    ],
    semanticKeywords: ['Xcode wireless deployment', 'debug iPhone over Wi-Fi', 'Xcode 16 Connect via Network', 'cableless iOS app testing']
  },
  {
    path: '/workflows/apple-health-automated-workout-hydration-shortcut',
    title: 'Apple Health Automated Workout Logging & Daily Hydration Tracker',
    category: 'Productivity & Focus',
    topicalSilo: 'Automation & Shortcuts',
    tier: 'growth-target',
    clicksCategory: 'least-clicks',
    inboundEquitySources: [
      { sourcePath: '/generator', sourceTitle: 'Shortcut Generator', recommendedAnchor: 'Apple Health Automation Shortcuts' }
    ],
    outboundEquityTargets: [
      { targetPath: '/workflows/apple-fitness-plus-shareplay-group-workout', targetTitle: 'Fitness+ SharePlay', anchorText: 'Sync Workout Telemetry with Fitness+ SharePlay', relationship: 'deep-action', equityValue: 'high' },
      { targetPath: '/workflows/homekit-smart-home-morning-wake-up-adaptive-lighting', targetTitle: 'HomeKit Morning', anchorText: 'Trigger Hydration Reminder at Morning Wake-Up', relationship: 'topic-sibling', equityValue: 'medium' }
    ],
    semanticKeywords: ['Apple Health shortcuts', 'log water intake Siri', 'automatic workout log iPhone', 'HealthKit automation shortcut']
  },
  {
    path: '/workflows/intelligent-low-power-mode-automation-shortcuts',
    title: 'Intelligent Battery Guard: Dynamic Low Power Mode Automation',
    category: 'System Utilities & Security',
    topicalSilo: 'Apple Silicon & Hardware',
    tier: 'growth-target',
    clicksCategory: 'least-clicks',
    inboundEquitySources: [
      { sourcePath: '/generator', sourceTitle: 'Shortcut Generator', recommendedAnchor: 'Automated Battery Saver Shortcuts' },
      { sourcePath: '/workflows/iphone-fast-charging-optimization-battery-health', sourceTitle: 'Charging Optimization', recommendedAnchor: 'Automate Low Power Mode Below 30% Battery' }
    ],
    outboundEquityTargets: [
      { targetPath: '/workflows/iphone-fast-charging-optimization-battery-health', targetTitle: 'Charging Optimization', anchorText: 'Fast Charging Curve & Thermal Management Guide', relationship: 'deep-action', equityValue: 'high' },
      { targetPath: '/help', targetTitle: 'Help Center', anchorText: 'Troubleshoot iOS Background Automation Triggers', relationship: 'topic-sibling', equityValue: 'medium' }
    ],
    semanticKeywords: ['auto enable Low Power Mode', 'iPhone battery automation', 'extend battery life iOS 18', 'disable 5G when battery low shortcut']
  },
  {
    path: '/workflows/macos-zsh-homebrew-nightly-maintenance-pipeline',
    title: 'macOS Maintenance Pipeline: Automated Zsh & Homebrew Optimization',
    category: 'Developer & Automation',
    topicalSilo: 'System Utilities & Security',
    tier: 'growth-target',
    clicksCategory: 'least-clicks',
    inboundEquitySources: [
      { sourcePath: '/guides', sourceTitle: 'Engineering Guides', recommendedAnchor: 'Automated Zsh & Homebrew Clean-up Pipeline' }
    ],
    outboundEquityTargets: [
      { targetPath: '/workflows/apfs-local-snapshots-recovery-terminal-tmutil', targetTitle: 'APFS Snapshots Recovery', anchorText: 'Create APFS Snapshot Before System Updates', relationship: 'deep-action', equityValue: 'high' },
      { targetPath: '/workflows/xcode-wireless-ios-device-debugging', targetTitle: 'Xcode Wireless Debugging', anchorText: 'Prune Xcode Caches via Scheduled Zsh Job', relationship: 'topic-sibling', equityValue: 'medium' }
    ],
    semanticKeywords: ['brew update cleanup shortcut', 'macOS maintenance zsh script', 'clean caches terminal Mac', 'nightly macOS optimization cron']
  },
  {
    path: '/workflows/aggregate-audio-device-logic-pro-podcasting',
    title: 'Logic Pro & Podcasting: Aggregate Multi-Track Audio Device Routing',
    category: 'Audio & Video Production',
    topicalSilo: 'Media & Production',
    tier: 'growth-target',
    clicksCategory: 'least-clicks',
    inboundEquitySources: [
      { sourcePath: '/workflows/continuity-camera-desk-view-streaming', sourceTitle: 'Continuity Camera', recommendedAnchor: 'Multi-Track Aggregate Audio MIDI Podcasting Setup' }
    ],
    outboundEquityTargets: [
      { targetPath: '/workflows/continuity-camera-desk-view-streaming', targetTitle: 'Continuity Camera Studio', anchorText: 'Combine Aggregate Audio with 4K Continuity Video', relationship: 'topic-sibling', equityValue: 'high' },
      { targetPath: '/workflows/airplay-screen-mirroring-to-mac-studio-display', targetTitle: 'AirPlay to Mac', anchorText: 'Route iPad Synthesizers into Logic Pro via AirPlay', relationship: 'deep-action', equityValue: 'medium' }
    ],
    semanticKeywords: ['Audio MIDI Setup Mac aggregate', 'Logic Pro multiple USB mics', 'podcast multitrack recording macOS', 'BlackHole virtual audio cable Mac']
  },
  {
    path: '/workflows/freeform-board-realtime-collaboration-facetime',
    title: 'Apple Freeform: Infinite Brainstorm Canvas with FaceTime SharePlay',
    category: 'Study & Research',
    topicalSilo: 'Media & Production',
    tier: 'growth-target',
    clicksCategory: 'least-clicks',
    inboundEquitySources: [
      { sourcePath: '/workflows/sidecar-ipad-math-apple-pencil-notes', sourceTitle: 'Sidecar Notes', recommendedAnchor: 'Share Handwritten Math Proofs in Freeform' }
    ],
    outboundEquityTargets: [
      { targetPath: '/workflows/ipad-apple-pencil-math-notes-graphing-calculator', targetTitle: 'Math Notes Calculator', anchorText: 'Paste Live Graphs into Freeform Boards', relationship: 'deep-action', equityValue: 'high' },
      { targetPath: '/workflows/apple-fitness-plus-shareplay-group-workout', targetTitle: 'SharePlay Workouts', anchorText: 'Group SharePlay Session Protocols', relationship: 'topic-sibling', equityValue: 'medium' }
    ],
    semanticKeywords: ['Apple Freeform collaboration', 'FaceTime SharePlay whiteboard', 'infinite canvas Apple Pencil', 'realtime brainstorming Mac iPad']
  },
  {
    path: '/workflows/smart-grocery-list-auto-categorization-reminders',
    title: 'Apple Reminders: Smart Grocery List & Automatic Section Sorting',
    category: 'Productivity & Focus',
    topicalSilo: 'Automation & Shortcuts',
    tier: 'growth-target',
    clicksCategory: 'least-clicks',
    inboundEquitySources: [
      { sourcePath: '/workflows/daily-standup-generator-apple-reminders-slack', sourceTitle: 'Daily Standup', recommendedAnchor: 'Advanced Apple Reminders Smart List Filtering' }
    ],
    outboundEquityTargets: [
      { targetPath: '/workflows/daily-standup-generator-apple-reminders-slack', targetTitle: 'Daily Standup Generator', anchorText: 'Reminders Smart List Filter Mechanics', relationship: 'topic-sibling', equityValue: 'medium' },
      { targetPath: '/generator', targetTitle: 'Generator', anchorText: 'Generate Voice-Activated Grocery Reminders Shortcut', relationship: 'deep-action', equityValue: 'medium' }
    ],
    semanticKeywords: ['Apple Reminders grocery sections', 'auto categorize shopping list iPhone', 'shared family grocery list Apple', 'Reminders smart lists iOS 18']
  },
  {
    path: '/workflows/safari-profiles-and-tab-groups-client-separation',
    title: 'Safari Profiles & Tab Groups: Air-Tight Freelance Workspace Isolation',
    category: 'Productivity & Focus',
    topicalSilo: 'Automation & Shortcuts',
    tier: 'growth-target',
    clicksCategory: 'least-clicks',
    inboundEquitySources: [
      { sourcePath: '/workflows/safari-distraction-control-clean-reading-mode', sourceTitle: 'Safari Distraction Control', recommendedAnchor: 'Safari Profiles & Tab Groups for Work Separation' }
    ],
    outboundEquityTargets: [
      { targetPath: '/workflows/safari-distraction-control-clean-reading-mode', targetTitle: 'Safari Distraction Control', anchorText: 'Enforce Distraction Control across Work Profiles', relationship: 'topic-sibling', equityValue: 'high' },
      { targetPath: '/workflows/apple-passwords-cross-device-passkey-autofill', targetTitle: 'Apple Passwords', anchorText: 'Separate Keychain Passwords by Safari Profile', relationship: 'deep-action', equityValue: 'high' }
    ],
    semanticKeywords: ['Safari profiles setup', 'separate work personal Safari', 'Tab Groups iCloud sync', 'multiple Safari cookies accounts']
  },
  {
    path: '/workflows/apple-fitness-plus-shareplay-group-workout',
    title: 'Apple Fitness+ SharePlay: Synchronized Group Workouts on Apple TV',
    category: 'Productivity & Focus',
    topicalSilo: 'Media & Production',
    tier: 'growth-target',
    clicksCategory: 'least-clicks',
    inboundEquitySources: [
      { sourcePath: '/workflows/apple-health-automated-workout-hydration-shortcut', sourceTitle: 'Health Automation', recommendedAnchor: 'Sync Workout Telemetry with Fitness+ SharePlay' }
    ],
    outboundEquityTargets: [
      { targetPath: '/workflows/apple-health-automated-workout-hydration-shortcut', targetTitle: 'Health Automation', anchorText: 'Log High-Intensity Intervals in Apple Health', relationship: 'deep-action', equityValue: 'high' },
      { targetPath: '/workflows/airplay-screen-mirroring-to-mac-studio-display', targetTitle: 'AirPlay to Mac', anchorText: 'AirPlay Fitness Video Streams to Mac Studio', relationship: 'topic-sibling', equityValue: 'medium' }
    ],
    semanticKeywords: ['Fitness Plus SharePlay', 'group workout Apple TV iPhone', 'Apple Watch burn bar SharePlay', 'remote synchronized exercise Apple']
  },
  {
    path: '/workflows/screen-time-downtime-and-app-limits-regimen',
    title: 'Strict Screen Time & Downtime Limits: Focus Regimen That Sticks',
    category: 'Productivity & Focus',
    topicalSilo: 'Automation & Shortcuts',
    tier: 'growth-target',
    clicksCategory: 'least-clicks',
    inboundEquitySources: [
      { sourcePath: '/workflows/unified-apple-focus-shortcuts-automation', sourceTitle: 'Focus Automation', recommendedAnchor: 'Strict Screen Time App Limit Enforcer' }
    ],
    outboundEquityTargets: [
      { targetPath: '/workflows/unified-apple-focus-shortcuts-automation', targetTitle: 'Focus Automation', anchorText: 'Coordinate Downtime with Deep Work Focus Modes', relationship: 'deep-action', equityValue: 'high' },
      { targetPath: '/workflows/safari-distraction-control-clean-reading-mode', targetTitle: 'Safari Distraction Control', anchorText: 'Block Addictive Web Elements in Safari', relationship: 'topic-sibling', equityValue: 'medium' }
    ],
    semanticKeywords: ['Screen Time downtime limits', 'lock addictive apps Mac iPhone', 'strict app limits no bypass', 'digital minimalism Apple ecosystem']
  },
  {
    path: '/workflows/whisper-speech-to-text-transcription-apple-silicon-coreml',
    title: 'Whisper.cpp on Apple Silicon: Sub-Second Offline Audio Transcription',
    category: 'Developer & Automation',
    topicalSilo: 'Apple Silicon & Hardware',
    tier: 'growth-target',
    clicksCategory: 'least-clicks',
    inboundEquitySources: [
      { sourcePath: '/library', sourceTitle: 'Library', recommendedAnchor: 'Local Whisper Audio Transcription on Apple Silicon' },
      { sourcePath: '/workflows/voice-memos-audio-recording-automatic-transcription', sourceTitle: 'Voice Memos', recommendedAnchor: 'High-Accuracy Long-Form Whisper Transcription on Mac' },
      { sourcePath: '/workflows/run-local-llm-apple-silicon-unified-memory-ollama', sourceTitle: 'Local LLM', recommendedAnchor: 'Pair Local LLM with Offline Whisper Transcription' }
    ],
    outboundEquityTargets: [
      { targetPath: '/workflows/run-local-llm-apple-silicon-unified-memory-ollama', targetTitle: 'Local LLM on Apple Silicon', anchorText: 'Feed Transcripts into Private Local LLaMA 3.3', relationship: 'deep-action', equityValue: 'high' },
      { targetPath: '/compatibility', targetTitle: 'Compatibility', anchorText: 'Apple Silicon Neural Engine Performance Matrix', relationship: 'prerequisite', equityValue: 'medium' }
    ],
    semanticKeywords: ['Whisper CoreML Mac', 'offline transcription Apple Silicon', 'whisper cpp fast transcription', 'private audio to text Mac']
  },
  {
    path: '/workflows/apfs-local-snapshots-recovery-terminal-tmutil',
    title: 'Instant APFS Local Snapshots: Recover Files in Seconds with `tmutil`',
    category: 'Developer & Automation',
    topicalSilo: 'System Utilities & Security',
    tier: 'growth-target',
    clicksCategory: 'least-clicks',
    inboundEquitySources: [
      { sourcePath: '/guides', sourceTitle: 'Engineering Guides', recommendedAnchor: 'Recover Deleted Files via APFS Local Snapshots (`tmutil`)' },
      { sourcePath: '/workflows/encrypted-apfs-time-machine-network-nas-backup', sourceTitle: 'Encrypted Backups', recommendedAnchor: 'Instant Rollback via Local APFS Snapshots (`tmutil`)' }
    ],
    outboundEquityTargets: [
      { targetPath: '/workflows/encrypted-apfs-time-machine-network-nas-backup', targetTitle: 'Encrypted APFS Backups', anchorText: 'Full Off-Site Redundancy via Encrypted APFS NAS', relationship: 'topic-sibling', equityValue: 'high' },
      { targetPath: '/workflows/macos-zsh-homebrew-nightly-maintenance-pipeline', targetTitle: 'Zsh Maintenance', anchorText: 'Schedule Automatic Hourly Snapshot Creation in Zsh', relationship: 'deep-action', equityValue: 'medium' }
    ],
    semanticKeywords: ['APFS snapshot recovery tmutil', 'recover deleted file Mac terminal', 'local Time Machine snapshots', 'APFS snapshot rollback macOS']
  }
];

/**
 * Utility helper to fetch all outbound internal links for any given route
 */
export function getInternalLinksForPage(pathname: string): InternalLinkItem[] {
  const cleanPath = pathname.replace(/\/+$/, '') || '/';
  const profile = INTERNAL_LINKING_PLAN_50_PAGES.find(p => p.path === cleanPath);
  return profile ? profile.outboundEquityTargets : [];
}

/**
 * Utility helper to fetch inbound link equity donors for any given route
 */
export function getInboundEquityForPage(pathname: string) {
  const cleanPath = pathname.replace(/\/+$/, '') || '/';
  const profile = INTERNAL_LINKING_PLAN_50_PAGES.find(p => p.path === cleanPath);
  return profile ? profile.inboundEquitySources : [];
}

/**
 * High-level link juice topology metrics
 */
export function getLinkJuiceAuditMetrics() {
  const totalPages = INTERNAL_LINKING_PLAN_50_PAGES.length;
  const powerPages = INTERNAL_LINKING_PLAN_50_PAGES.filter(p => p.clicksCategory === 'most-clicks').length;
  const moderatePages = INTERNAL_LINKING_PLAN_50_PAGES.filter(p => p.clicksCategory === 'moderate-clicks').length;
  const growthTargetPages = INTERNAL_LINKING_PLAN_50_PAGES.filter(p => p.clicksCategory === 'least-clicks').length;
  
  let totalConnections = 0;
  INTERNAL_LINKING_PLAN_50_PAGES.forEach(p => {
    totalConnections += p.outboundEquityTargets.length;
  });

  const avgOutboundLinksPerHub = (totalConnections / totalPages).toFixed(1);

  return {
    totalPages,
    powerPages,
    moderatePages,
    growthTargetPages,
    totalConnections,
    avgOutboundLinksPerHub
  };
}
