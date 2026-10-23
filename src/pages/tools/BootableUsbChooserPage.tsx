import React, { useState, useMemo } from 'react';
import { Usb, Check, ShieldAlert, Sparkles, ExternalLink, HardDrive, ArrowRight, ShieldCheck } from 'lucide-react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';
import { Link } from '../../hooks/useRouter.tsx';

interface BootableUsbChooserPageProps {
  navigate: (path: string) => void;
}

export const BootableUsbChooserPage: React.FC<BootableUsbChooserPageProps> = ({ navigate }) => {
  // Wizard state: 4 targeted questions
  const [isoCount, setIsoCount] = useState<'single' | 'multi'>('single');
  const [targetOs, setTargetOs] = useState<'windows' | 'linux' | 'macos' | 'both'>('windows');
  const [needPersistence, setNeedPersistence] = useState<'no' | 'yes'>('no');
  const [hostOs, setHostOs] = useState<'windows' | 'mac' | 'linux'>('windows');

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'bootable-usb-chooser') || {
    id: 'bootable-usb-chooser',
    name: 'Bootable USB Chooser',
    slug: 'bootable-usb-chooser',
    description: 'Find the right bootable USB creation tool and step-by-step instructions based on your OS and hardware needs.',
    category: 'Developer',
    icon: 'Usb',
    type: 'client',
    keywords: ['bootable usb tool', 'rufus vs ventoy', 'create bootable usb windows mac linux', 'multiboot usb creator'],
    relatedToolSlugs: ['file-checksum-verifier', 'install-command-generator'],
    isFlagship: false,
  };

  const relatedTools = LAUNCH_TOOLS.filter(
    (t) => t.slug === 'file-checksum-verifier' || t.slug === 'install-command-generator' || t.slug === 'quick-calculators'
  );
  const relatedGuide = POPULAR_GUIDES[0];

  // Neutral recommendation engine based on official software documentation
  const recommendation = useMemo(() => {
    // Case 1: Multi-ISO setup
    if (isoCount === 'multi') {
      return {
        name: 'Ventoy',
        type: 'Open-Source Multi-Boot Engine',
        bestFor: 'Carrying multiple Windows, Linux, and diagnostic ISOs on a single flash drive without reformatting.',
        officialUrl: 'https://www.ventoy.net',
        summary:
          'Ventoy formats the flash drive once with a dual-partition layout. Afterward, you simply copy and paste `.iso`, `.wim`, or `.vhd` files directly onto the flash drive. When booting, Ventoy presents an interactive menu to boot any copied image.',
        steps: [
          'Download and launch Ventoy on your host computer (available for Windows and Linux).',
          'Insert your USB flash drive (minimum 16 GB recommended for multi-boot).',
          'Click "Install" in Ventoy (Warning: this wipes the drive on initial setup only).',
          'Copy your downloaded ISO files directly into the root of the Ventoy USB drive.',
          'Reboot your PC and enter the BIOS/UEFI boot menu (F12, F11, or Esc) to select the USB drive.',
        ],
        notes:
          'Ventoy supports both Legacy BIOS and UEFI Secure Boot. Checksums can be validated from the Ventoy boot menu.',
      };
    }

    // Case 2: Creating native macOS bootable installer on a Mac
    if (targetOs === 'macos' && hostOs === 'mac') {
      return {
        name: 'Apple createinstallmedia (Native Terminal)',
        type: 'Official Apple Command-Line Utility',
        bestFor: 'Creating clean macOS installation media directly using Apple-signed tools.',
        officialUrl: 'https://support.apple.com/en-us/101578',
        summary:
          'Apple includes the `createinstallmedia` command inside all official macOS installer packages from the Mac App Store. It is the most reliable method for Mac hardware and bypasses third-party flashing bugs.',
        steps: [
          'Download your desired macOS installer from the Mac App Store or system settings.',
          'Format a USB drive (16 GB+) as Mac OS Extended (Journaled) with GUID Partition Map named "MyVolume".',
          'Open Terminal on your Mac.',
          'Run the official Apple command: sudo /Applications/Install\\ macOS\\ *.app/Contents/Resources/createinstallmedia --volume /Volumes/MyVolume',
          'Enter your admin password and wait for the "Install media now available" confirmation.',
        ],
        notes:
          'Always back up external drive files before running Terminal commands. Read the volume path before confirming.',
      };
    }

    // Case 3: Linux with Persistence
    if (needPersistence === 'yes' && targetOs === 'linux') {
      return {
        name: 'Rufus (Windows) or mkusb (Linux)',
        type: 'Persistent Live USB Creator',
        bestFor: 'Saving user documents, browser history, and installed packages across Linux live sessions.',
        officialUrl: 'https://rufus.ie',
        summary:
          'Rufus (for Windows hosts) features a dedicated "Persistent partition size" slider for Ubuntu, Debian, and Mint ISOs. It creates a secondary `casper-rw` partition on the USB stick to retain data across system restarts.',
        steps: [
          'Download the official Rufus executable (rufus.ie) on your Windows machine.',
          'Select your USB drive under "Device" and browse to your Linux ISO under "Boot selection".',
          'Adjust the "Persistent partition size" slider to dedicate storage (e.g., 4 GB to 16 GB).',
          'Ensure Partition Scheme is set to GPT for modern UEFI systems.',
          'Click "Start" and confirm partition creation.',
        ],
        notes:
          'Persistence is supported natively on Debian and Ubuntu derivatives. Not all Linux distributions support persistent overlay partitions.',
      };
    }

    // Case 4: Windows Target on Windows Host (Standard single ISO)
    if (targetOs === 'windows' && hostOs === 'windows') {
      return {
        name: 'Rufus',
        type: 'High-Performance Windows & Linux Flasher',
        bestFor: 'Windows 11 installations with optional TPM/RAM bypass and local account creation.',
        officialUrl: 'https://rufus.ie',
        summary:
          'Rufus is a lightweight, zero-install utility for Windows. When creating a Windows 11 installation media, it provides optional prompts to remove requirements for TPM 2.0, Secure Boot, and mandatory Microsoft accounts.',
        steps: [
          'Insert your USB flash drive (minimum 8 GB required for Windows 11).',
          'Open Rufus and select your target flash drive.',
          'Click "SELECT" and choose your official Windows 11 or Windows 10 ISO.',
          'Keep Partition scheme as "GPT" and Target system as "UEFI (non CSM)".',
          'Click "START". Rufus will display custom deployment options (e.g., local account creation, privacy defaults).',
          'Wait for the progress bar to reach 100% "READY".',
        ],
        notes:
          'Rufus formats the flash drive completely. Ensure all important files on the USB are backed up first.',
      };
    }

    // Case 5: Universal / Cross-Platform Flashing (Mac or Linux host creating Linux/Raspberry Pi media)
    return {
      name: 'Raspberry Pi Imager or balenaEtcher',
      type: 'Cross-Platform Image Flasher',
      bestFor: 'Zero-configuration flashing of raw disk images, Linux ISOs, and Raspberry Pi OS on macOS, Windows, or Linux.',
      officialUrl: 'https://www.raspberrypi.com/software/',
      summary:
        'Raspberry Pi Imager and balenaEtcher provide clean, graphical 3-step flashing (Select Image -> Select Drive -> Flash) with automatic post-write checksum validation.',
      steps: [
        'Download and install Raspberry Pi Imager or balenaEtcher for your operating system.',
        'Choose OS: Click "Use Custom" and select your downloaded `.iso` or `.img` file.',
        'Choose Storage: Select your connected USB drive or SD card carefully.',
        'Click "Write / Flash" and enter system permissions if prompted.',
        'Wait for the automated verification pass to confirm zero sector write errors.',
      ],
      notes:
        'Both tools verify writes against source checksums upon completion. Raspberry Pi Imager is completely telemetry-free.',
    };
  }, [isoCount, targetOs, needPersistence, hostOs]);

  const exampleChips = [
    'Multi-boot USB with Windows & Linux ISOs',
    'Windows 11 installer with local account bypass',
    'Bootable Ubuntu USB with persistence',
  ];

  return (
    <ToolPageTemplate
      tool={tool}
      heading="Bootable USB Chooser"
      subheading="A neutral decision wizard that recommends the optimal, verified bootable USB creation tool and exact step-by-step instructions for your specific OS and hardware setup."
      inputLabel="Hardware or Custom Deployment Notes"
      inputPlaceholder="e.g. Dell XPS 15 UEFI Secure Boot with Ubuntu live persistence..."
      examplePrompt="Recommend best tool for creating a multi-boot USB on Windows"
      exampleChips={exampleChips}
      lastUpdated="October 2026"
      navigate={navigate}
      onClientCompute={() => ({
        result: `Recommended Tool: ${recommendation.name} (${recommendation.type})
Target Use Case: ${recommendation.bestFor}
Official Documentation: ${recommendation.officialUrl}

Summary:
${recommendation.summary}

Step-by-Step Instructions:
${recommendation.steps.map((s, idx) => `${idx + 1}. ${s}`).join('\n')}

Important Notice:
${recommendation.notes}`,
      })}
      extraControls={
        <div className="space-y-6 pt-2">
          {/* Checksum reminder banner linking to L2 */}
          <div className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-[#0a1424] border border-[rgba(108,125,255,0.3)] text-xs text-[#f2f7ff]">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#6c7dff] shrink-0" />
              <span>
                <strong className="text-[#6c7dff]">Verify before you flash: </strong>
                Corrupted ISO downloads cause silent installation failures. Compute your file hash with our free verifier first.
              </span>
            </div>
            <Link
              href="/tools/file-checksum-verifier"
              navigate={navigate}
              className="px-3 py-1.5 rounded-lg bg-[#101c33] border border-[rgba(108,125,255,0.3)] text-xs font-semibold text-[#6c7dff] hover:text-[#f2f7ff] hover:border-[#6c7dff] transition-colors shrink-0 focus-ring"
            >
              Verify Checksum &rarr;
            </Link>
          </div>

          {/* Decision Wizard: 4 Questions */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-5">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#6c7dff] font-bold flex items-center gap-2">
              <Usb className="w-4 h-4 text-[#6c7dff]" />
              <span>Interactive Decision Wizard</span>
            </h3>

            {/* Q1: Single or Multiple ISOs */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-[#9aaccb]">
                1. How many ISO images do you want on this flash drive?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsoCount('single')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all focus-ring ${
                    isoCount === 'single'
                      ? 'bg-[#101c33] border-[#6c7dff] shadow-sm'
                      : 'bg-[#050a14] border-[rgba(143,163,192,0.14)] text-[#9aaccb] hover:text-[#f2f7ff]'
                  }`}
                >
                  <div className="font-bold text-[#f2f7ff]">One single OS / Installer</div>
                  <div className="text-[11px] text-[#9aaccb] mt-0.5">Dedicated flash drive for one specific OS</div>
                </button>

                <button
                  type="button"
                  onClick={() => setIsoCount('multi')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all focus-ring ${
                    isoCount === 'multi'
                      ? 'bg-[#101c33] border-[#6c7dff] shadow-sm'
                      : 'bg-[#050a14] border-[rgba(143,163,192,0.14)] text-[#9aaccb] hover:text-[#f2f7ff]'
                  }`}
                >
                  <div className="font-bold text-[#f2f7ff]">Multiple ISOs (Multi-boot)</div>
                  <div className="text-[11px] text-[#9aaccb] mt-0.5">Drop multiple ISOs on one drive with a boot menu</div>
                </button>
              </div>
            </div>

            {/* Q2: Target OS */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-[#9aaccb]">
                2. What operating system are you installing?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'windows', label: 'Windows 11 / 10' },
                  { id: 'linux', label: 'Linux (Ubuntu/Mint/etc)' },
                  { id: 'macos', label: 'macOS Installer' },
                  { id: 'both', label: 'Diagnostic / Mixed' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTargetOs(item.id as any)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all focus-ring ${
                      targetOs === item.id
                        ? 'bg-[#6c7dff] text-white border-[#6c7dff] shadow-sm font-bold'
                        : 'bg-[#050a14] text-[#9aaccb] border-[rgba(143,163,192,0.14)] hover:text-[#f2f7ff]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Q3: Need Persistence? */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-[#9aaccb]">
                3. Do you need persistent storage for live sessions?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setNeedPersistence('no')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all focus-ring ${
                    needPersistence === 'no'
                      ? 'bg-[#101c33] border-[#6c7dff] shadow-sm'
                      : 'bg-[#050a14] border-[rgba(143,163,192,0.14)] text-[#9aaccb] hover:text-[#f2f7ff]'
                  }`}
                >
                  <div className="font-bold text-[#f2f7ff]">No (Standard Installer / Live Session)</div>
                  <div className="text-[11px] text-[#9aaccb] mt-0.5">Fresh installation or temporary trial session</div>
                </button>

                <button
                  type="button"
                  onClick={() => setNeedPersistence('yes')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all focus-ring ${
                    needPersistence === 'yes'
                      ? 'bg-[#101c33] border-[#6c7dff] shadow-sm'
                      : 'bg-[#050a14] border-[rgba(143,163,192,0.14)] text-[#9aaccb] hover:text-[#f2f7ff]'
                  }`}
                >
                  <div className="font-bold text-[#f2f7ff]">Yes (Save Files Across Reboots)</div>
                  <div className="text-[11px] text-[#9aaccb] mt-0.5">Retain user files and apps on the USB drive</div>
                </button>
              </div>
            </div>

            {/* Q4: Host Computer OS */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-[#9aaccb]">
                4. What computer are you using right now to create the USB?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'windows', label: 'Windows PC' },
                  { id: 'mac', label: 'Mac (macOS)' },
                  { id: 'linux', label: 'Linux PC' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setHostOs(item.id as any)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all focus-ring ${
                      hostOs === item.id
                        ? 'bg-[#6c7dff] text-white border-[#6c7dff] shadow-sm font-bold'
                        : 'bg-[#050a14] text-[#9aaccb] border-[rgba(143,163,192,0.14)] hover:text-[#f2f7ff]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dynamic Recommendation Card */}
          <div className="p-6 rounded-3xl bg-[#0a1424] border border-[rgba(108,125,255,0.4)] shadow-2xl space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(143,163,192,0.12)] pb-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#6c7dff] font-bold">
                  Recommended Method &amp; Utility
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-[#f2f7ff] mt-0.5">
                  {recommendation.name}
                </h3>
              </div>

              <a
                href={recommendation.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#101c33] border border-[rgba(108,125,255,0.3)] text-xs font-semibold text-[#f2f7ff] hover:border-[#6c7dff] hover:text-[#6c7dff] transition-all focus-ring"
              >
                <span>Official Documentation</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <p className="text-sm text-[#f2f7ff] leading-relaxed">
              {recommendation.summary}
            </p>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#6c7dff] font-bold">
                Step-by-Step Instructions
              </h4>
              <div className="space-y-2.5">
                {recommendation.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-[#050a14] border border-[rgba(143,163,192,0.12)] text-xs text-[#f2f7ff]">
                    <span className="w-5 h-5 rounded-md bg-[#101c33] text-[#6c7dff] font-mono font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed mt-0.5">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety & Backup Warning */}
            <div className="p-3.5 rounded-xl bg-[#101c33] border border-[rgba(255,184,64,0.3)] flex items-start gap-2.5 text-xs text-[#ffb840]">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold">Back up your data first: </span>
                <span>
                  Flashing a USB drive overwrites all existing partitions and files permanently. Always double-check drive letters and volume names before clicking Start or Write. Run this only on a device you own.
                </span>
              </div>
            </div>
          </div>
        </div>
      }
      whatItDoesContent={
        <>
          <p>
            The Bootable USB Chooser helps users select the correct, verified method for creating bootable installation media without falling victim to ad-heavy download wrapper sites or outdated guides. Depending on whether you need a single-purpose installer, a versatile multi-boot rescue flash drive, or a persistent live Linux environment, different utilities provide vastly different reliability.
          </p>
          <p>
            All recommendations are grounded exclusively in official software documentation from tools like Ventoy, Rufus, Raspberry Pi Imager, and Apple’s native command-line binaries. We do not host binaries or promote cracked software; each tool links strictly to its official project homepage or official GitHub repository.
          </p>
        </>
      }
      howToUseSteps={[
        {
          step: 'Answer the 4 hardware questions',
          text: 'Specify your target OS, whether you need single or multiple ISOs, live persistence, and your current host computer.',
        },
        {
          step: 'Review the recommended software',
          text: 'Read the summary explaining why that tool is best suited for your partition structure and motherboard firmware.',
        },
        {
          step: 'Follow the numbered execution steps',
          text: 'Follow the official step-by-step instructions. Remember to verify your ISO checksum with our free tool before writing.',
        },
      ]}
      workedExample={{
        title: 'Example: Windows 11 Multi-boot Diagnostic Flash Drive',
        scenario: 'A technician wants one 64 GB USB drive with Windows 11, Ubuntu 24.04, and MemTest86.',
        output: `Recommended Solution: Ventoy (v1.0.99+)
Partition Style: MBR or GPT with exFAT data partition

Workflow:
1. Format the 64 GB drive once with Ventoy on a Windows or Linux PC.
2. Drag and drop Win11_English_x64.iso, ubuntu-24.04-desktop.iso, and memtest86.iso into the flash drive folder.
3. Plug into any modern UEFI PC and select the USB drive from the F12 boot menu.
4. Ventoy displays a graphical boot menu listing all three systems.`,
      }}
      tips={[
        'Prefer GPT over MBR for modern PCs: All computers sold in the last 8+ years use UEFI firmware, which boots fastest with GPT partition layouts.',
        'Use USB 3.0 or 3.2 ports: Bootable media creation can take 15–20 minutes on slow USB 2.0 ports compared to 2–3 minutes on USB 3.0+.',
        'Avoid multi-partition USB hubs during flashing: Connect your flash drive directly to the computer motherboard or laptop chassis.',
        'Always check the checksum first: Use our free File Checksum Verifier to ensure the ISO is 100% complete before flashing.',
      ]}
      faq={[
        {
          question: 'What is the main difference between Rufus and Ventoy?',
          answer: 'Rufus formats the entire USB drive and writes a single operating system installer directly to the partition table. Ventoy formats the drive once with a boot engine, allowing you to simply copy and paste multiple ISO files onto the drive like regular files.',
        },
        {
          question: 'Can I make a bootable Windows 11 USB on a Mac?',
          answer: 'Yes, but it requires specialized tools like UTM/virtual machines or command-line wimlib-imagex split commands because the Windows 11 install.wim file exceeds the 4 GB file size limit of standard FAT32 partitions.',
        },
        {
          question: 'What does "persistence" mean on a live Linux USB?',
          answer: 'Standard live USB sessions run entirely in RAM; all downloaded files and settings vanish when you turn off the computer. A persistent USB dedicates storage space to save changes across reboots.',
        },
        {
          question: 'Will creating a bootable USB erase my flash drive?',
          answer: 'Yes. Flashing an image or initializing Ventoy/Rufus overwrites the drive partition table and deletes all files. Always back up important files from the flash drive first.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
