import React, { useState, useMemo } from 'react';
import { Terminal, ShieldAlert, Check, Copy, Smartphone, ShieldCheck, AlertTriangle, AlertCircle, Sparkles, Filter, ExternalLink } from 'lucide-react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';

interface AdbTask {
  id: string;
  name: string;
  category: 'Everyday' | 'App Management' | 'Media & Logs' | 'Reboot & Hardware';
  description: string;
  risk: 'Safe' | 'Caution' | 'Data loss';
  commandTemplate: (params: Record<string, string>) => string[];
  paramFields?: Array<{ key: string; label: string; placeholder: string; defaultVal: string }>;
  explanation: string[];
}

const ADB_TASKS: AdbTask[] = [
  {
    id: 'list-devices',
    name: 'List Connected Devices',
    category: 'Everyday',
    description: 'Verify USB debugging connection and list authorized device serial numbers.',
    risk: 'Safe',
    commandTemplate: () => ['adb devices -l'],
    explanation: [
      'Checks the local ADB server daemon and polls connected USB / Wi-Fi endpoints.',
      'Displays the device state: "device" (authorized), "unauthorized" (needs RSA prompt accepted on phone screen), or "offline".',
    ],
  },
  {
    id: 'install-apk',
    name: 'Install an APK File',
    category: 'App Management',
    description: 'Install or update an APK package from your computer onto the connected Android device.',
    risk: 'Safe',
    paramFields: [{ key: 'apkPath', label: 'Local APK Path or Filename', placeholder: 'e.g. app-release.apk', defaultVal: 'my-app.apk' }],
    commandTemplate: (p) => [`adb install -r "${p.apkPath || 'app.apk'}"`],
    explanation: [
      '-r allows reinstallation, keeping existing application data intact.',
      'Transfers the APK into /data/local/tmp and triggers PackageManager to verify and install.',
    ],
  },
  {
    id: 'uninstall-user-app',
    name: 'Uninstall App for Current User (Debloat)',
    category: 'App Management',
    description: 'Remove pre-installed bloatware or system apps for User 0 without requiring root.',
    risk: 'Caution',
    paramFields: [{ key: 'pkgName', label: 'Package Name', placeholder: 'e.g. com.facebook.katana', defaultVal: 'com.example.bloatware' }],
    commandTemplate: (p) => [
      `adb shell pm uninstall -k --user 0 ${p.pkgName || 'com.example.package'}`,
    ],
    explanation: [
      '--user 0 uninstalls the app for the primary device user only, hiding it from the launcher and disabling background services.',
      '-k keeps cache and data directories if desired.',
      'Can be reversed anytime by running: adb shell cmd package install-existing [package_name]',
    ],
  },
  {
    id: 'wireless-pair',
    name: 'Pair & Connect via Wireless Debugging',
    category: 'Everyday',
    description: 'Connect to Android 11+ over your local Wi-Fi network without a physical USB cable.',
    risk: 'Safe',
    paramFields: [
      { key: 'pairHost', label: 'Pairing IP & Port', placeholder: '192.168.1.50:37123', defaultVal: '192.168.1.50:37123' },
      { key: 'pairCode', label: '6-Digit Pairing Code', placeholder: '123456', defaultVal: '123456' },
      { key: 'connectHost', label: 'Connection IP & Port', placeholder: '192.168.1.50:41235', defaultVal: '192.168.1.50:41235' },
    ],
    commandTemplate: (p) => [
      `adb pair ${p.pairHost || '192.168.1.50:port'} ${p.pairCode || 'code'}`,
      `adb connect ${p.connectHost || '192.168.1.50:port'}`,
      'adb devices',
    ],
    explanation: [
      'Android 11+ uses separate ports for initial pairing and continuous connection.',
      'In Developer Options > Wireless Debugging, click "Pair device with pairing code" to find these values.',
      'Once paired, the computer remains trusted on this Wi-Fi network.',
    ],
  },
  {
    id: 'screenshot',
    name: 'Take Screenshot Directly to Computer',
    category: 'Media & Logs',
    description: 'Capture the current Android screen directly as a PNG on your computer without writing to phone storage.',
    risk: 'Safe',
    paramFields: [{ key: 'outFile', label: 'Output PNG Filename', placeholder: 'screenshot.png', defaultVal: 'phone-screen.png' }],
    commandTemplate: (p) => [`adb exec-out screencap -p > ${p.outFile || 'screenshot.png'}`],
    explanation: [
      'exec-out streams binary pixel data straight to standard output on your PC.',
      'Avoids saving temporary files on the device storage, making it instantaneous.',
    ],
  },
  {
    id: 'screen-record',
    name: 'Record Screen Video to MP4',
    category: 'Media & Logs',
    description: 'Record an MP4 video of your phone screen, then pull it to your computer.',
    risk: 'Safe',
    paramFields: [
      { key: 'duration', label: 'Recording Time Limit (seconds)', placeholder: '30', defaultVal: '30' },
      { key: 'recordName', label: 'Output Filename', placeholder: 'demo.mp4', defaultVal: 'screen-recording.mp4' },
    ],
    commandTemplate: (p) => [
      `adb shell screenrecord --time-limit ${p.duration || '30'} /sdcard/temp_screen.mp4`,
      `adb pull /sdcard/temp_screen.mp4 ./${p.recordName || 'recording.mp4'}`,
      'adb shell rm /sdcard/temp_screen.mp4',
    ],
    explanation: [
      'Uses hardware video encoders on the phone to record high-framerate H.264 video.',
      'Pulls the completed MP4 to your current working directory and cleans up the temporary file.',
    ],
  },
  {
    id: 'view-logs',
    name: 'Stream Live Logcat Logs with Filter',
    category: 'Media & Logs',
    description: 'Inspect real-time system and application crash logs filtered by keyword or tag.',
    risk: 'Safe',
    paramFields: [{ key: 'tag', label: 'Filter Keyword or Tag', placeholder: 'e.g. MyApp or Exception', defaultVal: 'Crash' }],
    commandTemplate: (p) => [`adb logcat -v time | grep -i "${p.tag || 'Exception'}"`],
    explanation: [
      '-v time adds clean timestamp prefixes to each log line.',
      'Pipes output through grep (or findstr on Windows CMD) to isolate application events.',
    ],
  },
  {
    id: 'file-push',
    name: 'Push Files from PC to Phone Storage',
    category: 'Everyday',
    description: 'Transfer files or folders from your computer directly to your phone’s internal storage.',
    risk: 'Safe',
    paramFields: [
      { key: 'localPath', label: 'Local File / Folder Path', placeholder: 'my_file.zip', defaultVal: 'document.pdf' },
      { key: 'remotePath', label: 'Phone Destination Path', placeholder: '/sdcard/Download/', defaultVal: '/sdcard/Download/' },
    ],
    commandTemplate: (p) => [`adb push "${p.localPath || 'file.txt'}" "${p.remotePath || '/sdcard/Download/'}"`],
    explanation: [
      'Transfers files over high-speed USB protocol, bypassing slow MTP file explorer locks.',
    ],
  },
  {
    id: 'file-pull',
    name: 'Pull Files from Phone to PC',
    category: 'Everyday',
    description: 'Copy photos, backups, or documents from your phone onto your computer.',
    risk: 'Safe',
    paramFields: [
      { key: 'remotePath', label: 'Phone Source Path', placeholder: '/sdcard/DCIM/Camera/', defaultVal: '/sdcard/DCIM/Camera/' },
      { key: 'localPath', label: 'Local Destination Folder', placeholder: './backup/', defaultVal: './phone-photos/' },
    ],
    commandTemplate: (p) => [`adb pull "${p.remotePath || '/sdcard/'}" "${p.localPath || './'}"`],
    explanation: [
      'Pulls the specified file or entire directory recursively to your computer.',
    ],
  },
  {
    id: 'reboot-recovery',
    name: 'Reboot to Recovery Mode',
    category: 'Reboot & Hardware',
    description: 'Restart phone directly into recovery mode (TWRP, Lineage Recovery, or Stock Recovery).',
    risk: 'Caution',
    commandTemplate: () => ['adb reboot recovery'],
    explanation: [
      'Bypasses physical volume button combinations to enter recovery environment directly.',
    ],
  },
  {
    id: 'reboot-bootloader',
    name: 'Reboot to Bootloader (Fastboot Mode)',
    category: 'Reboot & Hardware',
    description: 'Restart device into Fastboot bootloader mode for low-level diagnostic querying.',
    risk: 'Caution',
    commandTemplate: () => ['adb reboot bootloader', 'fastboot devices'],
    explanation: [
      'Restarts the SoC into bootloader mode.',
      'fastboot devices verifies that the Fastboot USB interface driver is recognized.',
    ],
  },
  {
    id: 'fastboot-reboot',
    name: 'Reboot from Fastboot to Android System',
    category: 'Reboot & Hardware',
    description: 'Exit Fastboot mode and reboot normally into the Android operating system.',
    risk: 'Safe',
    commandTemplate: () => ['fastboot reboot'],
    explanation: [
      'Signals the bootloader to boot the primary boot partition (boot_a / boot_b) into Android.',
    ],
  },
];

interface AdbFastbootCommandBuilderPageProps {
  navigate: (path: string) => void;
}

export const AdbFastbootCommandBuilderPage: React.FC<AdbFastbootCommandBuilderPageProps> = ({ navigate }) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string>('list-devices');
  const [params, setParams] = useState<Record<string, string>>({});
  const [copiedScript, setCopiedScript] = useState<boolean>(false);

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'adb-fastboot-command-builder') || {
    id: 'adb-fastboot-command-builder',
    name: 'ADB & Fastboot Command Builder',
    slug: 'adb-fastboot-command-builder',
    description: 'Build safe, exact Android Debug Bridge (ADB) and Fastboot command sequences with risk tags and parameter customization.',
    category: 'Developer',
    icon: 'Terminal',
    type: 'client',
    keywords: ['adb command builder', 'fastboot command generator', 'android usb debugging commands', 'adb debloat uninstall'],
    relatedToolSlugs: ['android-automation-generator', 'install-command-generator'],
    isFlagship: false,
  };

  const relatedTools = LAUNCH_TOOLS.filter(
    (t) => t.slug === 'android-automation-generator' || t.slug === 'install-command-generator' || t.slug === 'quick-calculators'
  );
  const relatedGuide = POPULAR_GUIDES[0];

  const currentTask = useMemo(() => {
    return ADB_TASKS.find((t) => t.id === selectedTaskId) || ADB_TASKS[0];
  }, [selectedTaskId]);

  const handleParamChange = (key: string, val: string) => {
    setParams((prev) => ({ ...prev, [key]: val }));
  };

  const generatedCommands = useMemo(() => {
    const activeParams: Record<string, string> = {};
    if (currentTask.paramFields) {
      currentTask.paramFields.forEach((field) => {
        activeParams[field.key] = params[field.key] || field.defaultVal;
      });
    }
    return currentTask.commandTemplate(activeParams);
  }, [currentTask, params]);

  const handleCopyCommands = async () => {
    const script = generatedCommands.join('\n');
    try {
      await navigator.clipboard.writeText(script);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    } catch {
      // Handled
    }
  };

  const exampleChips = [
    'Pair phone over Wireless Debugging (Android 11+)',
    'Take screen capture straight to PC',
    'Safely debloat / uninstall system app for user 0',
  ];

  return (
    <ToolPageTemplate
      tool={tool}
      heading="ADB & Fastboot Command Builder"
      subheading="Generate exact Android Debug Bridge (ADB) and Fastboot terminal sequences for app management, wireless pairing, screenshots, and device diagnostics with verified risk classifications."
      inputLabel="Custom Parameter Notes"
      inputPlaceholder="e.g. Pixel 8 Pro on Android 15..."
      examplePrompt="Generate ADB command to uninstall bloatware app for user 0"
      exampleChips={exampleChips}
      lastUpdated="October 2026"
      navigate={navigate}
      onClientCompute={() => ({
        result: `Task: ${currentTask.name} [Risk Level: ${currentTask.risk.toUpperCase()}]

Commands:
${generatedCommands.join('\n')}

Technical Explanation:
${currentTask.explanation.map((e, idx) => `${idx + 1}. ${e}`).join('\n')}

Safety Reminder: Read it before you run it.`,
      })}
      extraControls={
        <div className="space-y-6 pt-2">
          {/* Task Picker Grid */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-[#6c7dff] font-bold flex items-center gap-1.5">
                <Smartphone className="w-4 h-4" />
                <span>1. Select Android Task</span>
              </span>
              <span className="text-xs font-mono text-[#9aaccb]">
                {ADB_TASKS.length} verified tasks
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {ADB_TASKS.map((task) => {
                const isSelected = selectedTaskId === task.id;
                return (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => {
                      setSelectedTaskId(task.id);
                      setParams({});
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all focus-ring flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? 'bg-[#101c33] border-[#6c7dff] shadow-sm'
                        : 'bg-[#050a14] border-[rgba(143,163,192,0.12)] hover:border-[rgba(143,163,192,0.25)]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-[#f2f7ff] line-clamp-1">
                          {task.name}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded uppercase font-bold shrink-0 ${
                            task.risk === 'Safe'
                              ? 'bg-[rgba(52,224,161,0.14)] text-[#34e0a1]'
                              : task.risk === 'Caution'
                              ? 'bg-[rgba(255,184,64,0.14)] text-[#ffb840]'
                              : 'bg-[rgba(255,92,122,0.14)] text-[#ff5c7a]'
                          }`}
                        >
                          {task.risk}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#9aaccb] line-clamp-2 mt-1">
                        {task.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Task Parameters (if task has customizable parameters) */}
          {currentTask.paramFields && currentTask.paramFields.length > 0 && (
            <div className="p-5 sm:p-6 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-4">
              <span className="text-xs font-mono uppercase text-[#6c7dff] font-bold">
                2. Configure Command Parameters
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentTask.paramFields.map((field) => (
                  <div key={field.key} className="space-y-1">
                    <label className="text-xs font-mono text-[#9aaccb]">{field.label}</label>
                    <input
                      type="text"
                      value={params[field.key] !== undefined ? params[field.key] : field.defaultVal}
                      onChange={(e) => handleParamChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full bg-[#050a14] border border-[rgba(143,163,192,0.2)] rounded-xl px-3 py-2 text-xs font-mono text-[#f2f7ff] focus-ring"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Generated Command Output */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#0a1424] border border-[rgba(108,125,255,0.3)] space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#6c7dff]" />
                <span className="text-xs font-mono uppercase text-[#6c7dff] font-bold">
                  Terminal Commands
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                    currentTask.risk === 'Safe'
                      ? 'bg-[rgba(52,224,161,0.14)] text-[#34e0a1]'
                      : currentTask.risk === 'Caution'
                      ? 'bg-[rgba(255,184,64,0.14)] text-[#ffb840]'
                      : 'bg-[rgba(255,92,122,0.14)] text-[#ff5c7a]'
                  }`}
                >
                  {currentTask.risk} Risk
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyCommands}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#101c33] border border-[rgba(108,125,255,0.3)] text-xs font-semibold text-[#f2f7ff] hover:border-[#6c7dff] transition-colors focus-ring"
              >
                {copiedScript ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#34e0a1]" />
                    <span className="text-[#34e0a1]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Commands</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#050a14] border border-[rgba(143,163,192,0.18)] font-mono text-xs sm:text-sm text-[#f2f7ff] space-y-2 select-all leading-relaxed">
              {generatedCommands.map((cmd, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-[#6c7dff] select-none">$</span>
                  <span>{cmd}</span>
                </div>
              ))}
            </div>

            {/* Explanation lines */}
            <div className="space-y-1.5 pt-1 text-xs text-[#9aaccb]">
              <div className="font-mono text-[#f2f7ff] font-semibold">How it works:</div>
              {currentTask.explanation.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-[#6c7dff]">•</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Mandatory Safety Notice */}
            <div className="p-3.5 rounded-xl bg-[#101c33] border border-[rgba(255,184,64,0.3)] flex items-start gap-2.5 text-xs text-[#ffb840]">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Read it before you run it: </span>
                <span>
                  Always review commands prior to running them in your command prompt or terminal. Ensure your phone’s RSA USB Debugging prompt is authorized.
                </span>
              </div>
            </div>

            {/* Data loss warning for bootloader commands */}
            {(currentTask.category === 'Reboot & Hardware' || currentTask.risk === 'Data loss') && (
              <div className="p-3.5 rounded-xl bg-[rgba(255,92,122,0.12)] border border-[#ff5c7a] flex items-start gap-2.5 text-xs text-[#ff5c7a]">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Critical Data Protection Warning: </span>
                  <span>Back up your data first. Run this only on a device you own.</span>
                </div>
              </div>
            )}
          </div>
        </div>
      }
      whatItDoesContent={
        <>
          <p>
            Android Debug Bridge (ADB) and Fastboot are the official command-line developer tools provided by Google within the Android SDK Platform-Tools package. They allow computers to communicate directly with connected Android devices over USB or local Wi-Fi to install applications, capture diagnostics, transfer files, and manage device firmware states.
          </p>
          <p>
            This tool provides pre-validated, syntax-accurate templates for the most common administrative and troubleshooting workflows. Each command sequence is paired with clear technical explanations and risk ratings to ensure users understand the impact of every command before execution.
          </p>
        </>
      }
      howToUseSteps={[
        {
          step: 'Enable USB Debugging on your phone',
          text: 'On Android, go to Settings > About Phone, tap "Build Number" 7 times to enable Developer Options, then toggle on "USB Debugging".',
        },
        {
          step: 'Select your task and customize parameters',
          text: 'Choose an administrative task from the list and enter any custom parameters like file names, package names, or pairing codes.',
        },
        {
          step: 'Copy and execute in your terminal',
          text: 'Open Terminal (macOS/Linux) or PowerShell (Windows), paste the generated command, and accept the RSA key fingerprint on your phone screen.',
        },
      ]}
      workedExample={{
        title: 'Example: Debloating Pre-installed Apps for User 0',
        scenario: 'A user wants to remove an unwanted background telemetry app (com.example.telemetry) without rooting their phone.',
        output: `Selected Task: Uninstall App for Current User
Command:
adb shell pm uninstall -k --user 0 com.example.telemetry

Technical Execution:
1. Opens the Android package manager shell environment.
2. Uninstalls the application specifically for the current user profile (User 0).
3. The app is disabled and purged from the application drawer and active memory.
4. System partition remains intact, allowing clean factory resets or re-installation.`,
      }}
      tips={[
        'Accept the RSA prompt on your phone: When connecting for the first time, check "Always allow from this computer" and tap Allow.',
        'Use Tab key for local file autocompletion: When typing file paths for `adb push` or `adb install`, press Tab in your terminal to autocomplete names.',
        'Install official Platform-Tools only: Download Google’s official standalone Platform-Tools zip directly from developer.android.com.',
        'No root required for User 0 debloating: Modern Android architecture allows removing user-space packages cleanly without modifying the system partition.',
      ]}
      faq={[
        {
          question: 'Where do I download official ADB and Fastboot binaries?',
          answer: 'Download the official Android SDK Platform-Tools package directly from Google at developer.android.com/tools/releases/platform-tools. Avoid third-party installer repackages.',
        },
        {
          question: 'Why does "adb devices" say "unauthorized"?',
          answer: 'Your phone has not yet accepted your computer’s cryptographic RSA key fingerprint. Unlock your phone screen, look for the "Allow USB debugging?" pop-up dialog, check "Always allow", and tap Allow.',
        },
        {
          question: 'Does uninstalling an app via ADB void my phone warranty?',
          answer: 'No. Using "pm uninstall --user 0" only disables and uninstalls the app for the primary user. It does not unlock the bootloader, trip Knox/SafetyNet, or modify the read-only system partition.',
        },
        {
          question: 'Can these commands bypass carrier locks or FRP Google locks?',
          answer: 'No. This tool strictly adheres to standard developer and administration workflows. We do not provide or support factory reset protection (FRP) bypasses, bootloader unlock bypasses, or carrier lock circumvention.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
