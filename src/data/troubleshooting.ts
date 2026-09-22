import { TroubleshootingIssue } from '../types';

export const TROUBLESHOOTING_DATA: TroubleshootingIssue[] = [
  {
    id: 'ts-airdrop-discovery-failure',
    title: 'AirDrop Devices Not Showing Up or Transfers Failing',
    feature: 'AirDrop',
    category: 'AirDrop & Sharing',
    symptoms: [
      'Nearby Mac, iPhone, or iPad does not show up in the AirDrop sharing sheet',
      'AirDrop transfer sits on "Waiting..." indefinitely and times out',
      'Declined automatically without receiving a prompt',
      'Device only appears when set to "Everyone for 10 Minutes" but not "Contacts Only"'
    ],
    quickFixSteps: [
      'Verify Wi-Fi and Bluetooth are actively turned ON on both devices (not disabled from Control Center).',
      'Confirm that Personal Hotspot is disabled in iPhone Settings > Personal Hotspot.',
      'Bring devices within 1 meter (3 feet) to eliminate 2.4GHz interference.',
      'Temporarily set AirDrop receiving to "Everyone for 10 Minutes" to rule out Apple Account contact matching issues.',
      'Ensure neither device has Low Power Mode active.'
    ],
    deepDiagnostics: [
      {
        step: 1,
        title: 'Check macOS Firewall Incoming Connection Filters',
        details: 'Go to System Settings > Network > Firewall > Options. Ensure "Block all incoming connections" is UNCHECKED. If checked, macOS will silently drop peer-to-peer Bonjour discovery broadcasts.'
      },
      {
        step: 2,
        title: 'Clear Stale Bluetooth Daemon Cache on Mac',
        details: 'If Mac Bluetooth discovery is unresponsive, restart the core macOS bluetooth daemon via Terminal. It will restart automatically within 2 seconds without requiring a system reboot.',
        command: 'sudo pkill bluetoothd'
      },
      {
        step: 3,
        title: 'Flush macOS mDNS Multicast Responder',
        details: 'AirDrop utilizes multicast DNS (Bonjour) to announce host identities. Flushing the cache clears corrupted broadcast entries.',
        command: 'sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder'
      },
      {
        step: 4,
        title: 'Verify Apple Account Contact Card Email / Phone Formatting',
        details: 'In Contacts app, ensure the recipient contact card includes the exact email address or phone number linked to their primary Apple Account, formatted with international area code (+1, +44, etc.).'
      }
    ],
    officialDocUrl: 'https://support.apple.com/en-us/HT203106',
    lastReviewedDate: '2026-08-20'
  },
  {
    id: 'ts-universal-clipboard-not-pasting',
    title: 'Universal Clipboard Not Pasting or Delaying Across Devices',
    feature: 'Universal Clipboard & Handoff',
    category: 'Universal Clipboard & Handoff',
    symptoms: [
      'Copying on iPhone or Mac pastes old local clipboard text on the other device',
      'Pasting takes 10+ seconds or displays "Pasting from Mac..." followed by a silent failure',
      'Handoff icon missing from Mac Dock or iPhone App Switcher',
      'Stops working after waking Mac from sleep'
    ],
    quickFixSteps: [
      'Verify both devices are signed into the exact same Apple Account in System Settings / iOS Settings.',
      'Check that Two-Factor Authentication is active on the Apple Account (required for Universal Clipboard key exchange).',
      'Turn Bluetooth Off and back On on both devices in Control Center.',
      'Ensure both devices are connected to the same Wi-Fi SSID and channel (e.g. both on the 5GHz home network).',
      'Verify the clipboard content is copied within 2 minutes before pasting (buffer auto-expires for privacy).'
    ],
    deepDiagnostics: [
      {
        step: 1,
        title: 'Cycle Handoff System Toggle',
        details: 'On Mac: System Settings > General > AirDrop & Handoff. Turn OFF "Allow Handoff between this Mac and your iCloud devices", wait 15 seconds, and turn it back ON. On iPhone: Settings > General > AirPlay & Handoff > toggle Handoff OFF and ON.'
      },
      {
        step: 2,
        title: 'Inspect Active VPN and Cloudflare WARP Profiles',
        details: 'VPN profiles (especially those with "Kill Switch" or "Block Local Network Traffic" enabled) encapsulate all IP packets and isolate your device from local peer-to-peer Wi-Fi discovery. Temporarily disconnect VPN profiles.'
      },
      {
        step: 3,
        title: 'Sign Out and Sign Back In to Apple Account on Primary Device',
        details: 'If iCloud cryptographic keychain tokens get corrupted, go to System Settings > [Your Name] > Sign Out. Choose to keep a copy of your data on this Mac, then sign back in.'
      }
    ],
    officialDocUrl: 'https://support.apple.com/en-us/102430',
    lastReviewedDate: '2026-08-10'
  },
  {
    id: 'ts-iphone-mirroring-sequoia-issues',
    title: 'iPhone Mirroring "Cannot Connect to iPhone" or "iPhone In Use"',
    feature: 'iPhone Mirroring',
    category: 'iPhone Mirroring',
    symptoms: [
      'Error: "Cannot Connect to iPhone" or "Make sure your iPhone is nearby and unlocked"',
      'Error: "iPhone is In Use" when the phone screen is seemingly locked',
      'Black screen inside the iPhone Mirroring window on Mac',
      'Touch/Trackpad clicks do not register inside the iOS window'
    ],
    quickFixSteps: [
      'Ensure your Mac is running macOS 15.0+ Sequoia and iPhone is running iOS 18.0+.',
      'Lock your iPhone physically using the side sleep/wake button. iPhone Mirroring will refuse to connect if your phone is currently unlocked in someone\'s hands.',
      'Ensure iPhone is not actively streaming via AirPlay or using Continuity Camera webcam mode.',
      'Disconnect from any active Personal Hotspot on Mac.',
      'Quit the iPhone Mirroring app on Mac (⌘ + Q) and reopen it.'
    ],
    deepDiagnostics: [
      {
        step: 1,
        title: 'Reset iPhone Mirroring Permission and Re-pair',
        details: 'On iPhone, navigate to Settings > General > AirPlay & Continuity > iPhone Mirroring. Tap "Edit" in the top right, delete your Mac from the trusted devices list, then relaunch iPhone Mirroring on your Mac to initiate a fresh secure pairing handshake.'
      },
      {
        step: 2,
        title: 'Check Mac FileVault and Password Requirements',
        details: 'iPhone Mirroring requires your Mac user account to have a login password configured and your Mac to be unlocked with your user password or Touch ID.'
      },
      {
        step: 3,
        title: 'Verify Same Primary Apple Account Identity',
        details: 'Check if you use separate Apple Accounts for iCloud and Media/App Store purchases. Both devices must share the identical primary Apple Account.'
      }
    ],
    officialDocUrl: 'https://support.apple.com/en-us/120421',
    lastReviewedDate: '2026-09-05'
  },
  {
    id: 'ts-sidecar-black-screen-lag',
    title: 'Sidecar Screen Black, Laggy, or iPad "Device Timed Out"',
    feature: 'Sidecar',
    category: 'Sidecar & Displays',
    symptoms: [
      'iPad displays a black screen with only the Sidecar touch sidebar visible',
      'Sidecar menu says "Connecting to iPad..." then shows "Device timed out"',
      'Cursor freezes or exhibits extreme input latency',
      'Audio cuts out or crackles when Sidecar is active'
    ],
    quickFixSteps: [
      'Plug your iPad directly into your Mac using a USB-C or Lightning cable. When the "Trust this Computer" prompt appears on iPad, tap Trust and enter your passcode.',
      'In Mac System Settings > Displays, toggle the arrangement or change resolution to "Default".',
      'Ensure iPad is not charging via a low-power USB hub that causes USB bus resets.',
      'Turn off "Low Power Mode" on both Mac and iPad.'
    ],
    deepDiagnostics: [
      {
        step: 1,
        title: 'Reset iPad Trust Settings on Mac',
        details: 'If USB Sidecar fails to negotiate, reset the mobile device trust daemon in Terminal:',
        command: 'sudo killall -STOP -c usbd; sudo killall -CONT -c usbd'
      },
      {
        step: 2,
        title: 'Switch Wi-Fi Router Channel Away from DFS Bands',
        details: 'Apple Sidecar wireless transmission relies on Wi-Fi Direct (AWDL). If your home router is on DFS 5GHz channels (channels 52-144), AWDL can incur severe packet collisions. Switch router 5GHz radio to non-DFS channels (36-48 or 149-165).'
      }
    ],
    officialDocUrl: 'https://support.apple.com/en-us/HT210380',
    lastReviewedDate: '2026-08-01'
  },
  {
    id: 'ts-continuity-camera-not-connecting',
    title: 'Continuity Camera iPhone Not Listed in FaceTime, Zoom, or OBS',
    feature: 'Continuity Camera',
    category: 'Continuity Camera & Mic',
    symptoms: [
      'iPhone does not appear in camera dropdown lists in Zoom, Teams, Meet, or FaceTime',
      'Phone connects for 5 seconds then drops back to MacBook built-in webcam',
      'Desk View button is grayed out in Mac Control Center Video Effects',
      'Audio from iPhone microphone sounds distorted or muffled'
    ],
    quickFixSteps: [
      'On iPhone, navigate to Settings > General > AirPlay & Continuity. Verify "Continuity Camera" is enabled.',
      'Lock your iPhone screen with the side button and mount it in landscape (horizontal) orientation.',
      'Ensure the rear camera lenses are unobstructed and pointing towards you.',
      'Connect via USB cable to Mac to bypass wireless packet drops.'
    ],
    deepDiagnostics: [
      {
        step: 1,
        title: 'Reset Mac CoreMediaIO and Assistant Services',
        details: 'Third-party virtual webcam drivers (like OBS virtual camera, EpocCam, or Camo) can intercept Apple CoreMediaIO streams. Restart the camera assistant daemon:',
        command: 'sudo killall VDCAssistant; sudo killall AppleCameraAssistant'
      },
      {
        step: 2,
        title: 'Verify Hardware Desk View Compatibility',
        details: 'Desk View requires an iPhone 11 or newer equipped with an Ultra Wide lens. Standard iPhone XR/XS supports standard Continuity Camera webcam mode but cannot produce Desk View without an Ultra Wide optic.'
      }
    ],
    officialDocUrl: 'https://support.apple.com/en-us/HT213244',
    lastReviewedDate: '2026-08-15'
  },
  {
    id: 'ts-shortcuts-automation-failing-background',
    title: 'Shortcuts Automations Failing or Requiring Manual Tap to Run',
    feature: 'Apple Shortcuts',
    category: 'Shortcuts & Automations',
    symptoms: [
      'Scheduled time-of-day automation prompts for confirmation instead of running silently',
      'Automation terminates with "Error: Problem Running Shortcut" when device is locked',
      'Shortcuts using files fail with "Access Denied"',
      'Mac Shortcuts menu bar item spins indefinitely'
    ],
    quickFixSteps: [
      'In the Shortcuts app > Automation tab, open your automation and ensure "Ask Before Running" is turned OFF, and "Notify When Run" can be toggled as desired.',
      'On Mac: System Settings > Privacy & Security > Automation. Verify Shortcuts has permission to control target applications.',
      'On iPhone: Settings > Shortcuts > Advanced > enable "Allow Running Scripts" and "Allow Private Access".'
    ],
    deepDiagnostics: [
      {
        step: 1,
        title: 'Resolve Cloud Sync Lockout in Shortcuts Database',
        details: 'If a shortcut hangs on Mac, rebuild the local shortcuts cache without losing your iCloud shortcuts:',
        command: 'defaults delete com.apple.shortcuts; killall Shortcuts'
      },
      {
        step: 2,
        title: 'Audit Protected Actions in Locked State',
        details: 'Certain Apple security policies strictly forbid opening secure third-party apps or accessing Keychain credentials while an iPhone is locked with Face ID. Add a "Wait to Return" or "Continue in App" action if user authentication is mandatory.'
      }
    ],
    officialDocUrl: 'https://support.apple.com/guide/shortcuts/welcome/ios',
    lastReviewedDate: '2026-07-25'
  }
];
