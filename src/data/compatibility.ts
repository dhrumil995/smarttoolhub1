import { CompatibilityFeature } from '../types';

export const COMPATIBILITY_FEATURES: CompatibilityFeature[] = [
  {
    id: 'feat-iphone-mirroring',
    name: 'iPhone Mirroring',
    category: 'Display & Input',
    description: 'View and control your iPhone from your Mac keyboard and trackpad, interact with iPhone notifications on your Mac, and drag and drop files directly.',
    requiredMac: 'macOS 15.0 Sequoia or later',
    requiredIos: 'iOS 18.0 or later',
    requiredIpad: 'Not supported on iPad',
    networkPreconditions: [
      'Both devices must have Wi-Fi and Bluetooth turned ON',
      'Devices must be within standard Bluetooth range (~10 meters)',
      'Neither device can be actively sharing its internet connection via Personal Hotspot',
      'Mac cannot be using AirPlay or Sidecar simultaneously'
    ],
    appleAccountRules: 'Both devices must be signed in with the identical Apple Account using Two-Factor Authentication.',
    hardwareChips: 'Mac with Apple Silicon (M1/M2/M3/M4) OR Intel-based Mac with Apple T2 Security Chip.',
    officialSupportUrl: 'https://support.apple.com/en-us/120421',
    lastReviewedDate: '2026-09-01',
    troubleshootSlug: 'iphone-mirroring'
  },
  {
    id: 'feat-continuity-camera',
    name: 'Continuity Camera (Webcam & Desk View)',
    category: 'Audio & Camera',
    description: 'Use iPhone rear cameras as high-definition Mac webcam with Center Stage, Portrait mode, Studio Light, and overhead Desk View.',
    requiredMac: 'macOS 13.0 Ventura or later',
    requiredIos: 'iOS 16.0 or later (iPhone XR or later; Desk View requires iPhone 11 or later)',
    requiredIpad: 'Not supported as camera source',
    networkPreconditions: [
      'Wi-Fi and Bluetooth enabled on both devices',
      'iPhone must be near your Mac and locked, mounted in landscape orientation',
      'Supports optional zero-latency wired connection via USB cable'
    ],
    appleAccountRules: 'Both devices signed in to the same Apple Account with Two-Factor Authentication.',
    hardwareChips: 'All Apple Silicon Macs & all Intel Macs compatible with macOS Ventura+.',
    officialSupportUrl: 'https://support.apple.com/en-us/HT213244',
    lastReviewedDate: '2026-08-15',
    troubleshootSlug: 'continuity-camera'
  },
  {
    id: 'feat-universal-control',
    name: 'Universal Control',
    category: 'Display & Input',
    description: 'Use the keyboard, mouse, or trackpad of your Mac to control up to two other nearby Mac or iPad devices, and move content between them seamlessly.',
    requiredMac: 'macOS 12.3 Monterey or later (MacBook 2016+, MacBook Air 2018+, MacBook Pro 2016+, Mac mini 2018+, iMac 2017+, Mac Studio)',
    requiredIos: 'Not supported on iPhone',
    requiredIpad: 'iPadOS 15.4 or later (iPad Pro all models, iPad Air 3rd gen+, iPad 6th gen+, iPad mini 5th gen+)',
    networkPreconditions: [
      'Devices must be within 1 meter (3 feet) of each other',
      'Bluetooth, Wi-Fi, and Handoff turned ON',
      'Personal Hotspot must be disabled'
    ],
    appleAccountRules: 'Must be signed in to the same Apple Account with 2FA.',
    hardwareChips: 'Apple Silicon or Intel Mac with modern Bluetooth LE and 802.11ac Wi-Fi.',
    officialSupportUrl: 'https://support.apple.com/en-us/102454',
    lastReviewedDate: '2026-07-20',
    troubleshootSlug: 'universal-control'
  },
  {
    id: 'feat-sidecar',
    name: 'Sidecar (iPad as Second Mac Display)',
    category: 'Display & Input',
    description: 'Extend or mirror your Mac desktop onto an iPad, with full Apple Pencil drawing, pressure sensitivity, and touch shortcut bar.',
    requiredMac: 'macOS 10.15 Catalina or later (MacBook Pro 2016+, MacBook Air 2018+, iMac 2017+, Mac mini 2018+, Mac Studio)',
    requiredIos: 'Not supported on iPhone',
    requiredIpad: 'iPadOS 13.0 or later on iPad Pro, iPad 6th gen+, iPad mini 5th gen+, iPad Air 3rd gen+',
    networkPreconditions: [
      'Both devices on same Wi-Fi network within 10 meters, or connected via USB cable (trust prompt confirmed)',
      'Bluetooth turned on'
    ],
    appleAccountRules: 'Same Apple Account with 2FA.',
    hardwareChips: 'Hardware-accelerated HEVC video encoder (Intel 6th Gen Skylake+ or Apple Silicon).',
    officialSupportUrl: 'https://support.apple.com/en-us/HT210380',
    lastReviewedDate: '2026-08-01',
    troubleshootSlug: 'sidecar'
  },
  {
    id: 'feat-universal-clipboard',
    name: 'Universal Clipboard & Handoff',
    category: 'Continuity',
    description: 'Copy text, photos, and files on one Apple device and paste into another within 2 minutes; start tasks in Safari, Mail, Notes and pick up on nearby devices.',
    requiredMac: 'macOS 10.12 Sierra or later',
    requiredIos: 'iOS 10.0 or later',
    requiredIpad: 'iPadOS 13.0 or later (iOS 10+ on older iPads)',
    networkPreconditions: [
      'Wi-Fi and Bluetooth turned ON on all devices',
      'Devices within Bluetooth proximity'
    ],
    appleAccountRules: 'Same Apple Account signed in on all participating devices.',
    hardwareChips: 'Compatible with all modern Mac, iPhone, and iPad hardware.',
    officialSupportUrl: 'https://support.apple.com/en-us/102430',
    lastReviewedDate: '2026-06-10',
    troubleshootSlug: 'universal-clipboard'
  },
  {
    id: 'feat-airdrop-namedrop',
    name: 'AirDrop & NameDrop',
    category: 'Continuity',
    description: 'Instantly share photos, documents, and contact posters over high-speed peer-to-peer Wi-Fi channels by bringing devices near or selecting targets in share sheets.',
    requiredMac: 'macOS 10.10 Yosemite or later (AirDrop to iOS requires 2012+ Mac)',
    requiredIos: 'iOS 7.0+ for AirDrop; iOS 17.0+ for NameDrop contact proximity transfer',
    requiredIpad: 'iPadOS 13.0+ for AirDrop',
    networkPreconditions: [
      'Wi-Fi and Bluetooth ON; Personal Hotspot OFF',
      'AirDrop set to Contacts Only or Everyone for 10 Minutes'
    ],
    appleAccountRules: 'For Contacts Only mode, sender and receiver must have each other in Apple Contacts with email/phone saved.',
    hardwareChips: 'Apple Peer-to-Peer Wi-Fi radio and Bluetooth Low Energy.',
    officialSupportUrl: 'https://support.apple.com/en-us/HT203106',
    lastReviewedDate: '2026-07-15',
    troubleshootSlug: 'airdrop'
  },
  {
    id: 'feat-apple-intelligence',
    name: 'Apple Intelligence (Writing Tools & On-Device Neural Processing)',
    category: 'Ecosystem Intelligence',
    description: 'System-wide language rewrite, document summarization, photo cleanup, and context-aware actions executed on-device with Private Cloud Compute fallback.',
    requiredMac: 'macOS 15.1 Sequoia or later with M-series chip',
    requiredIos: 'iOS 18.1 or later on iPhone 15 Pro, iPhone 15 Pro Max, iPhone 16 series, or later',
    requiredIpad: 'iPadOS 18.1 or later on iPad with M1 or later, or iPad mini with A17 Pro',
    networkPreconditions: [
      'Internet connection required for initial neural model download and complex Private Cloud Compute tasks',
      'Core Writing Tools and summarization run completely offline on-device'
    ],
    appleAccountRules: 'Active Apple Account with device region set to supported geography.',
    hardwareChips: 'Apple Silicon Neural Engine (minimum 8GB unified memory hardware requirement: M1, M2, M3, M4, A17 Pro, A18). Intel Macs are NOT supported.',
    officialSupportUrl: 'https://support.apple.com/en-us/121115',
    lastReviewedDate: '2026-09-12',
    troubleshootSlug: 'apple-intelligence'
  },
  {
    id: 'feat-auto-unlock-apple-watch',
    name: 'Auto Unlock with Apple Watch',
    category: 'Display & Input',
    description: 'Unlock your Mac automatically without typing passwords and approve administrative security prompts by double-clicking the side button on Apple Watch.',
    requiredMac: 'macOS 10.12 Sierra or later on mid-2013 or newer Mac',
    requiredIos: 'iOS matching watchOS release',
    requiredIpad: 'Not supported on iPad',
    networkPreconditions: [
      'Wi-Fi and Bluetooth ON on Mac and Apple Watch',
      'Watch must be on your wrist, unlocked with passcode'
    ],
    appleAccountRules: 'Same Apple Account with Two-Factor Authentication; Apple Watch must have passcode enabled.',
    hardwareChips: 'Time-of-flight 802.11ac Wi-Fi range measurement.',
    officialSupportUrl: 'https://support.apple.com/en-us/HT206995',
    lastReviewedDate: '2026-06-01',
    troubleshootSlug: 'apple-watch-unlock'
  }
];

export interface AppleDeviceCatalogItem {
  id: string;
  name: string;
  type: 'mac' | 'iphone' | 'ipad';
  chip: string;
  latestOS: string;
  supportsAppleIntelligence: boolean;
  supportsContinuityCamera: boolean;
  supportsSidecar: boolean;
  supportsUniversalControl: boolean;
  supportsIphoneMirroring: boolean;
}

export const APPLE_DEVICES_CATALOG: AppleDeviceCatalogItem[] = [
  { id: 'mac-m4-pro', name: 'MacBook Pro 14"/16" (M4 / M4 Pro / M4 Max)', type: 'mac', chip: 'Apple Silicon M4', latestOS: 'macOS 15 Sequoia', supportsAppleIntelligence: true, supportsContinuityCamera: true, supportsSidecar: true, supportsUniversalControl: true, supportsIphoneMirroring: true },
  { id: 'mac-m3-air', name: 'MacBook Air 13"/15" (M3)', type: 'mac', chip: 'Apple Silicon M3', latestOS: 'macOS 15 Sequoia', supportsAppleIntelligence: true, supportsContinuityCamera: true, supportsSidecar: true, supportsUniversalControl: true, supportsIphoneMirroring: true },
  { id: 'mac-m2-studio', name: 'Mac Studio / Mac mini (M2 / M2 Max / Ultra)', type: 'mac', chip: 'Apple Silicon M2', latestOS: 'macOS 15 Sequoia', supportsAppleIntelligence: true, supportsContinuityCamera: true, supportsSidecar: true, supportsUniversalControl: true, supportsIphoneMirroring: true },
  { id: 'mac-m1-air', name: 'MacBook Air / Pro 13" (M1)', type: 'mac', chip: 'Apple Silicon M1', latestOS: 'macOS 15 Sequoia', supportsAppleIntelligence: true, supportsContinuityCamera: true, supportsSidecar: true, supportsUniversalControl: true, supportsIphoneMirroring: true },
  { id: 'mac-intel-t2', name: 'MacBook Pro 16" (Intel 2019 with T2 Chip)', type: 'mac', chip: 'Intel Core i7/i9 with T2', latestOS: 'macOS 15 Sequoia', supportsAppleIntelligence: false, supportsContinuityCamera: true, supportsSidecar: true, supportsUniversalControl: true, supportsIphoneMirroring: true },
  { id: 'mac-intel-pre-t2', name: 'MacBook Air / Pro (Intel 2017 or earlier, No T2)', type: 'mac', chip: 'Intel Core (Pre-T2)', latestOS: 'macOS 12/13/Legacy', supportsAppleIntelligence: false, supportsContinuityCamera: false, supportsSidecar: false, supportsUniversalControl: false, supportsIphoneMirroring: false },
  
  { id: 'iphone-16-pro', name: 'iPhone 16 Pro / Pro Max', type: 'iphone', chip: 'A18 Pro', latestOS: 'iOS 18', supportsAppleIntelligence: true, supportsContinuityCamera: true, supportsSidecar: false, supportsUniversalControl: false, supportsIphoneMirroring: true },
  { id: 'iphone-16', name: 'iPhone 16 / 16 Plus', type: 'iphone', chip: 'A18', latestOS: 'iOS 18', supportsAppleIntelligence: true, supportsContinuityCamera: true, supportsSidecar: false, supportsUniversalControl: false, supportsIphoneMirroring: true },
  { id: 'iphone-15-pro', name: 'iPhone 15 Pro / Pro Max', type: 'iphone', chip: 'A17 Pro', latestOS: 'iOS 18', supportsAppleIntelligence: true, supportsContinuityCamera: true, supportsSidecar: false, supportsUniversalControl: false, supportsIphoneMirroring: true },
  { id: 'iphone-15', name: 'iPhone 15 / 15 Plus', type: 'iphone', chip: 'A16 Bionic', latestOS: 'iOS 18', supportsAppleIntelligence: false, supportsContinuityCamera: true, supportsSidecar: false, supportsUniversalControl: false, supportsIphoneMirroring: true },
  { id: 'iphone-14-13', name: 'iPhone 14 / 13 / 12 Series', type: 'iphone', chip: 'A14/A15 Bionic', latestOS: 'iOS 18', supportsAppleIntelligence: false, supportsContinuityCamera: true, supportsSidecar: false, supportsUniversalControl: false, supportsIphoneMirroring: true },
  { id: 'iphone-11-xr', name: 'iPhone 11 / XR / XS', type: 'iphone', chip: 'A12/A13 Bionic', latestOS: 'iOS 17/18', supportsAppleIntelligence: false, supportsContinuityCamera: true, supportsSidecar: false, supportsUniversalControl: false, supportsIphoneMirroring: true },

  { id: 'ipad-m4-pro', name: 'iPad Pro 11"/13" (M4)', type: 'ipad', chip: 'Apple Silicon M4', latestOS: 'iPadOS 18', supportsAppleIntelligence: true, supportsContinuityCamera: false, supportsSidecar: true, supportsUniversalControl: true, supportsIphoneMirroring: false },
  { id: 'ipad-m2-air', name: 'iPad Air 11"/13" (M2)', type: 'ipad', chip: 'Apple Silicon M2', latestOS: 'iPadOS 18', supportsAppleIntelligence: true, supportsContinuityCamera: false, supportsSidecar: true, supportsUniversalControl: true, supportsIphoneMirroring: false },
  { id: 'ipad-m1-pro', name: 'iPad Pro 11"/12.9" (M1)', type: 'ipad', chip: 'Apple Silicon M1', latestOS: 'iPadOS 18', supportsAppleIntelligence: true, supportsContinuityCamera: false, supportsSidecar: true, supportsUniversalControl: true, supportsIphoneMirroring: false },
  { id: 'ipad-mini-a17', name: 'iPad mini 7th gen (A17 Pro)', type: 'ipad', chip: 'A17 Pro', latestOS: 'iPadOS 18', supportsAppleIntelligence: true, supportsContinuityCamera: false, supportsSidecar: true, supportsUniversalControl: true, supportsIphoneMirroring: false },
  { id: 'ipad-10th-gen', name: 'iPad 10th gen (A14)', type: 'ipad', chip: 'A14 Bionic', latestOS: 'iPadOS 18', supportsAppleIntelligence: false, supportsContinuityCamera: false, supportsSidecar: true, supportsUniversalControl: true, supportsIphoneMirroring: false },
  { id: 'ipad-older', name: 'iPad 5th gen / iPad mini 4 or older', type: 'ipad', chip: 'A9 or older', latestOS: 'Legacy iPadOS', supportsAppleIntelligence: false, supportsContinuityCamera: false, supportsSidecar: false, supportsUniversalControl: false, supportsIphoneMirroring: false }
];
