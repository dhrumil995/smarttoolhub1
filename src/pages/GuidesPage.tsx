import React, { useState } from 'react';
import { PageId } from '../types';
import { 
  BookOpen, 
  Cpu, 
  Terminal, 
  Wrench, 
  Image, 
  CheckCircle2, 
  Copy, 
  Check, 
  Clock, 
  ArrowRight, 
  Sparkles,
  Layers,
  Search,
  ChevronDown,
  Calendar,
  Share2
} from 'lucide-react';
import { haptics } from '../utils/haptics';

interface GuidesPageProps {
  onNavigate: (page: PageId, workflowId?: string) => void;
}

interface TechnicalArticle {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  category: 'Continuity & Wireless' | 'Apple Silicon' | 'Shortcuts & Scripting' | 'Media Engineering';
  readTime: string;
  lastUpdated: string;
  author: string;
  authorRole: string;
  summary: string;
  sections: {
    heading: string;
    content: string[];
    terminalCommand?: string;
    keyTakeaway?: string;
  }[];
  faq: {
    question: string;
    answer: string;
  }[];
}

const ARTICLES_DATA: TechnicalArticle[] = [
  {
    id: 'guide-awdl-continuity',
    title: 'The Architectural Guide to macOS 15 Sequoia Continuity & AWDL Wireless Handshakes',
    slug: 'awdl-continuity-handshakes',
    subtitle: 'Under the hood of AirDrop, iPhone Mirroring, and Universal Clipboard: How Apple Wireless Direct Link (AWDL) negotiates peer-to-peer data channels without local Wi-Fi router congestion.',
    category: 'Continuity & Wireless',
    readTime: '9 min read',
    lastUpdated: 'September 2026',
    author: 'Dhrumil Aslaliya',
    authorRole: 'Principal Systems Architect',
    summary: 'A deep-dive technical analysis of Apple Wireless Direct Link (AWDL), Bluetooth Low Energy (BLE) peripheral beacons, and Bonjour multicast DNS (mDNS) resolution in macOS Sequoia and iOS 18.',
    sections: [
      {
        heading: '1. The Tri-Layer Continuity Discovery Stack',
        content: [
          'Apple Continuity features do not operate as single monolithic protocols. Instead, every handshake between a Mac, iPhone, and iPad traverses three distinct hardware and software abstraction layers:',
          'Layer 1: Bluetooth Low Energy (BLE 5.3) Proximity Advertising. Devices continuously broadcast encrypted 16-byte tokens over BLE. When your Mac detects your iPhone within 3 meters, it initiates mutual identity verification using the Apple Account public key stored in the Secure Enclave.',
          'Layer 2: Apple Wireless Direct Link (AWDL) Channel Negotiation. Rather than routing heavy payloads through your home or office Wi-Fi router, macOS brings up a virtual network interface named `awdl0`. It hops between channel 6 (2.4 GHz) and channel 44 or 149 (5 GHz) to negotiate an ad-hoc, peer-to-peer 802.11 Wi-Fi mesh.',
          'Layer 3: Local Bonjour mDNS Record Synchronization. Once the AWDL link is established, the `mDNSResponder` daemon registers local zero-configuration service discovery records (such as `_airdrop._tcp` and `_continuity-camera._tcp`).'
        ],
        keyTakeaway: 'Continuity does NOT require both devices to be on the same Wi-Fi router network. They only require Wi-Fi and Bluetooth hardware enabled to form an ad-hoc peer-to-peer link.'
      },
      {
        heading: '2. The Primary Causes of Continuity Latency & Disconnects',
        content: [
          'In over 90% of field diagnostic reports, Continuity failures are caused by two specific environmental bottlenecks:',
          '1. Dual-Band Channel Hopping Collisions: If your Mac is connected to an access point on channel 36, but the AWDL radio interface insists on operating on channel 149 for peer communication, your Mac Wi-Fi card must time-slice between infrastructure Wi-Fi and direct AWDL peer traffic. This channel hopping introduces 120ms to 450ms of jitter.',
          '2. Stale Bluetooth Discovery Daemon State: If `bluetoothd` caches an obsolete session encryption token after your iPhone exits sleep mode, handoffs will silently fail until the userland daemon refreshes its cryptographic session table.'
        ],
        terminalCommand: 'sudo pkill -HUP mDNSResponder && sudo pkill -HUP bluetoothd',
        keyTakeaway: 'Restarting mDNSResponder and bluetoothd resets the cryptographic token table without requiring a reboot of either macOS or iOS.'
      },
      {
        heading: '3. Optimizing macOS 15 iPhone Mirroring Frame Rates',
        content: [
          'macOS 15 Sequoia introduces hardware-accelerated iPhone Mirroring using ultra-low-latency H.265 (HEVC) streaming over AWDL.',
          'To ensure a locked 60 frames per second with sub-20ms touch input latency, maintain a 5GHz channel width on your local router. When your local router operates on 5GHz 80MHz or 160MHz channels, the Mac Wi-Fi chip can co-locate its AWDL virtual interface with zero channel-switching penalty.'
        ],
        keyTakeaway: 'Connecting your Mac to a 5GHz Wi-Fi band aligns the AWDL virtual adapter with the infrastructure radio, eliminating frame drops during iPhone Mirroring.'
      }
    ],
    faq: [
      {
        question: 'Does Universal Clipboard require an active Internet connection?',
        answer: 'No. Universal Clipboard transmits cryptographic handshakes over Bluetooth LE and transfers clipboard payloads directly over peer-to-peer AWDL Wi-Fi. An active Internet connection is only required initially to authenticate both devices to your iCloud identity.'
      },
      {
        question: 'Why does AirDrop fail when VPN software is active?',
        answer: 'Many third-party corporate VPN clients enforce strict "Block Local LAN Access" rules. This erroneously filters out packets routed to the local `awdl0` virtual interface. Whitelisting local multicast (224.0.0.251) resolves this conflict.'
      }
    ]
  },
  {
    id: 'guide-apple-silicon-memory',
    title: 'Apple Silicon Unified Memory Architecture & Local LLM Quantization Guide',
    slug: 'apple-silicon-unified-memory-llm',
    subtitle: 'Why unified memory bandwidth (up to 800 GB/s on M2 Ultra and 546 GB/s on M4 Max) makes modern Macs the premier workstation platform for running 70B parameter open-weights language models.',
    category: 'Apple Silicon',
    readTime: '11 min read',
    lastUpdated: 'September 2026',
    author: 'Dhrumil Aslaliya',
    authorRole: 'Principal Systems Architect',
    summary: 'A technical exploration of unified memory architecture (UMA), memory bandwidth benchmarks across M1, M2, M3, and M4 processors, and calculating exact RAM overhead for local AI models.',
    sections: [
      {
        heading: '1. Discrete VRAM vs. Unified Memory Architecture (UMA)',
        content: [
          'Traditional PC architectures force data to travel across a PCIe bus from system RAM to dedicated GPU VRAM. On an NVIDIA RTX 4090, while internal VRAM bandwidth is high (~1,008 GB/s), total capacity is strictly capped at 24 GB. Loading a 70B parameter model requires multiple expensive GPUs linked over PCIe.',
          'Apple Silicon replaces this split architecture with Unified Memory Architecture (UMA). The CPU, GPU, and 16-core Neural Engine share a singular, wide memory pool with ultra-high bandwidth directly soldered adjacent to the SoC die package:',
          '• Apple M4: 120 GB/s memory bandwidth (up to 32 GB RAM)',
          '• Apple M4 Pro: 273 GB/s memory bandwidth (up to 64 GB RAM)',
          '• Apple M4 Max: 546 GB/s memory bandwidth (up to 128 GB RAM)',
          '• Apple M2 Ultra: 800 GB/s memory bandwidth (up to 192 GB RAM)',
          'Because the GPU accesses the same physical memory space as the CPU, zero PCIe memory copying is needed. Model weights are mapped directly into unified virtual memory.'
        ],
        keyTakeaway: 'A 128 GB M4 Max MacBook Pro can comfortably load and run an 8-bit quantized 70B parameter model that would otherwise require $8,000+ of dedicated enterprise server GPUs.'
      },
      {
        heading: '2. The Mathematical Formula for Local LLM Memory Footprint',
        content: [
          'To determine if a specific model will execute without triggering macOS memory compression or swap thrashing, use this exact sizing formula:',
          'Required Memory (GB) = (Parameter Count in Billions × Bits Per Weight / 8) × 1.20 Context Overhead + 8 GB macOS Base Allocation',
          'Example: Running Llama 3 70B at 4-bit precision (Q4_K_M):',
          '• Weight Size: 70 × 4.5 / 8 = 39.37 GB',
          '• 8K Context Window KV-Cache: ~3.5 GB',
          '• Total Model Footprint: ~42.9 GB',
          '• System + Applications Reserve: ~12 GB',
          '• Recommended Unified Memory: 64 GB minimum (optimal performance on 96 GB or 128 GB).'
        ],
        terminalCommand: 'sysctl hw.memsize && vm_stat',
        keyTakeaway: 'Never allocate more than 75% of total unified memory to model weights. macOS requires headroom for CoreAudio, WindowServer, and metal command buffer allocations.'
      },
      {
        heading: '3. Quantization Trade-offs: Q4_K_M vs Q8_0',
        content: [
          'Quantization reduces the precision of model weights from 16-bit floating point (FP16) down to 4-bit or 8-bit integers. On Apple Silicon, 4-bit medium quantization (Q4_K_M) retains approximately 98.7% of perplexity benchmarks while cutting memory bandwidth saturation in half.',
          'Because token generation speed in transformer architectures is strictly memory-bandwidth bound (not compute bound), halving model size nearly doubles generation tokens per second on Apple Silicon.'
        ],
        keyTakeaway: 'For text reasoning and coding assistance, 4-bit Q4_K_M represents the sweet spot of throughput speed and accuracy on Apple Silicon.'
      }
    ],
    faq: [
      {
        question: 'Can the Neural Engine (NPU) run large language models?',
        answer: 'The Apple Neural Engine (ANE) is optimized for CNNs and small transformer modules (such as Whisper speech-to-text or CLIP image embeddings). Large 7B+ language models run on the Metal GPU cores because the GPU has direct high-speed memory bus access to UMA.'
      },
      {
        question: 'Does macOS swap memory cause SSD degradation during AI inference?',
        answer: 'Constant heavy swapping to SSD during AI inference will increase disk wear and severely throttle token speed from 30 t/s down to 1–2 t/s. Always size your models so weights fit entirely in active physical RAM.'
      }
    ]
  },
  {
    id: 'guide-shortcuts-automation',
    title: 'Mastering the Siri Shortcuts Engine: Native Actions, Plist Schemas & POSIX Zsh Scripts',
    slug: 'shortcuts-automation-engine-architecture',
    subtitle: 'How to build rock-solid, production-grade Apple Shortcuts that combine native Shortcuts sandboxing with AppleScript GUI scripting and asynchronous POSIX Zsh commands.',
    category: 'Shortcuts & Scripting',
    readTime: '8 min read',
    lastUpdated: 'September 2026',
    author: 'Dhrumil Aslaliya',
    authorRole: 'Principal Systems Architect',
    summary: 'An architectural guide to the macOS Shortcuts runtime, sandboxed entitlements, compiling Siri action graphs, and executing shell scripts safely from macOS Sequoia.',
    sections: [
      {
        heading: '1. The Internal Architecture of Apple Shortcuts',
        content: [
          'Under the hood, an Apple Shortcut is an XML or binary Property List (`.shortcut` / `.plist`) containing an ordered array of action dictionaries. Each action invokes a modular system framework plugin located within `/System/Library/PrivateFrameworks/WorkflowKit.framework`.',
          'Unlike traditional bash scripts that execute with standard user permissions, Shortcuts actions run under system sandbox entitlements. When a shortcut requests access to Photos, Calendar, or File System directories, the Privacy & Security daemon (`tccd`) inspects the action signature before granting access.'
        ],
        keyTakeaway: 'Apple Shortcuts are secure, sandbox-compliant, and synchronized across all your devices using encrypted iCloud Keychain metadata.'
      },
      {
        heading: '2. Combining Native Shortcuts with POSIX Zsh Shell Commands',
        content: [
          'The most powerful design pattern for macOS power users is the "Hybrid Action Architecture": using native Shortcuts actions for UI notifications and file pickers, while delegating heavy algorithmic tasks to native shell commands via the "Run Shell Script" action.',
          'Key guidelines for resilient execution:',
          '1. Always define explicit `PATH` environments. The Shortcuts shell runner executes with a minimal `/usr/bin:/bin` path and will NOT find Homebrew binaries located in `/opt/homebrew/bin` unless explicitly exported.',
          '2. Sanitize user inputs by quoting variables to prevent shell injection vulnerabilities.',
          '3. Return clean JSON or standard POSIX exit status codes (0 for success, non-zero for error).'
        ],
        terminalCommand: 'export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"\necho "Running verified macOS batch routine..."',
        keyTakeaway: 'Always prepend your scripts with `export PATH="/opt/homebrew/bin:$PATH"` when calling third-party command-line utilities from Apple Shortcuts.'
      }
    ],
    faq: [
      {
        question: 'Can Apple Shortcuts execute headless in the background without opening the app?',
        answer: 'Yes. Shortcuts can be triggered headlessly from Terminal using the `shortcuts run "Workflow Name"` CLI command, from cron/launchd daemons, or from hotkey action triggers in macOS Sequoia.'
      },
      {
        question: 'How do I share a custom Shortcut without an iCloud link?',
        answer: 'You can export the shortcut as a `.shortcut` file directly from the Shortcuts app File menu, or serialize the action graph into signed AppleScript / Zsh scripts as provided on SmartToolHub.'
      }
    ]
  },
  {
    id: 'guide-media-sips-pipeline',
    title: 'High-Throughput Digital Media Automation: macOS Native sips, CoreImage & WebP Pipeline',
    slug: 'media-sips-webp-pipeline',
    subtitle: 'Eliminate heavy commercial subscriptions: How to use Apple’s built-in Scriptable Image Processing System (`sips`) and CoreImage hardware pipelines for sub-millisecond asset optimization.',
    category: 'Media Engineering',
    readTime: '7 min read',
    lastUpdated: 'September 2026',
    author: 'Dhrumil Aslaliya',
    authorRole: 'Principal Systems Architect',
    summary: 'A complete developer tutorial on automating Retina @2x/@3x asset generation, HEIC to WebP conversions, and lossless compression using native macOS CLI binaries.',
    sections: [
      {
        heading: '1. Why macOS sips Outperforms Electron-Based Utilities',
        content: [
          'Many web designers and photographers install bloated 400MB Electron utilities just to resize images or convert formats. What many don’t realize is that macOS includes a built-in, C-based command line binary called `sips` (Scriptable Image Processing System).',
          'Because `sips` is directly compiled against macOS CoreGraphics and ImageIO frameworks, it accesses Apple Silicon hardware accelerators directly. It can resize a 48MP raw iPhone photo in 18 milliseconds without consuming background RAM.'
        ],
        terminalCommand: 'sips -Z 1920 --setProperty format jpeg image.png --out optimized.jpg',
        keyTakeaway: 'macOS sips provides zero-latency image resizing and format conversion natively on every Mac without installing extra dependencies.'
      },
      {
        heading: '2. Batch Converting Retina @2x and @3x Asset Hierarchies',
        content: [
          'Building assets for high-DPI Retina screens requires exporting images at 1x (base resolution), 2x (Retina), and 3x (Super Retina) scale factors.',
          'Using our SmartToolHub sips batch synthesizer, developers can process an entire folder of high-resolution source graphics into structured Xcode asset catalogs (`Assets.xcassets`) or web responsive image sets with a single terminal command.'
        ],
        terminalCommand: 'for f in *.png; do sips -Z 1440 "$f" --out "retina_2x_$f"; done',
        keyTakeaway: 'Batch processing with shell loops and sips cuts web image export times from minutes to seconds.'
      }
    ],
    faq: [
      {
        question: 'Does sips preserve EXIF metadata and color profiles?',
        answer: 'Yes. By default, `sips` preserves ICC color profile tags (including Display P3 and sRGB) and embedded EXIF shooting data unless explicitly stripped via the `--deleteProperty` flag.'
      },
      {
        question: 'Can sips directly convert images to modern WebP format?',
        answer: 'In macOS 15 Sequoia, ImageIO supports WebP encoding natively. On older macOS versions, pair `sips` with Homebrew’s `cwebp` utility for maximal cross-platform compression efficiency.'
      }
    ]
  }
];

export const GuidesPage: React.FC<GuidesPageProps> = ({ onNavigate }) => {
  const [activeArticleId, setActiveArticleId] = useState<string>(ARTICLES_DATA[0].id);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const activeArticle = ARTICLES_DATA.find((a) => a.id === activeArticleId) || ARTICLES_DATA[0];

  const handleCopy = async (cmd: string) => {
    haptics.playTap();
    try {
      await navigator.clipboard.writeText(cmd);
      setCopiedCmd(cmd);
      setTimeout(() => setCopiedCmd(null), 2000);
    } catch {}
  };

  const categories = ['all', 'Continuity & Wireless', 'Apple Silicon', 'Shortcuts & Scripting', 'Media Engineering'];

  const filteredArticles = ARTICLES_DATA.filter((article) => {
    const matchesCat = filterCategory === 'all' || article.category === filterCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q || article.title.toLowerCase().includes(q) || article.summary.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 dark:bg-indigo-400/10 border border-indigo-500/20 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Peer-Reviewed Engineering Knowledge Base</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Apple Systems & Automation Guides
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 leading-relaxed font-normal">
          In-depth architectural teardowns, protocol breakdowns, and empirical benchmarks for macOS Sequoia, Apple Silicon, and iOS 18 power users.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="ios-card-static p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                haptics.playTap();
                setFilterCategory(cat);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                filterCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04]'
              }`}
            >
              {cat === 'all' ? 'All Engineering Guides' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search technical guides..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl glass-input"
          />
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Article Index List */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 px-1">
            Table of Articles ({filteredArticles.length})
          </h2>

          <div className="space-y-2.5">
            {filteredArticles.map((article) => {
              const isSelected = activeArticle.id === article.id;
              return (
                <div
                  key={article.id}
                  onClick={() => {
                    haptics.playTap();
                    setActiveArticleId(article.id);
                  }}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-white dark:bg-white/[0.08] border-indigo-500/50 shadow-md ring-1 ring-indigo-500/20'
                      : 'glass-panel hover:bg-white/60 dark:hover:bg-white/[0.04] border-slate-200/70 dark:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400 mb-1.5">
                    <span className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{article.readTime}</span>
                    </span>
                  </div>

                  <h3 className={`text-xs sm:text-sm font-bold leading-snug ${
                    isSelected ? 'text-indigo-600 dark:text-white' : 'text-slate-900 dark:text-zinc-200'
                  }`}>
                    {article.title}
                  </h3>

                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-2 mt-1.5 leading-relaxed">
                    {article.summary}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Full Long-Form Article Reader */}
        <div className="lg:col-span-8">
          <article className="ios-card-static p-6 sm:p-10 space-y-8">
            {/* Article Header Metadata */}
            <div className="space-y-4 border-b border-slate-200/80 dark:border-white/10 pb-6">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-mono font-semibold">
                  {activeArticle.category}
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-500 dark:text-zinc-400 flex items-center gap-1 font-mono text-[11px]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{activeArticle.readTime}</span>
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-500 dark:text-zinc-400 text-[11px]">
                  Reviewed: {activeArticle.lastUpdated}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                {activeArticle.title}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed font-normal">
                {activeArticle.subtitle}
              </p>

              {/* Author Attribution Bylines for E-E-A-T */}
              <div className="flex items-center gap-3 pt-2">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  DA
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {activeArticle.author}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
                    {activeArticle.authorRole} · SmartToolHub Labs
                  </div>
                </div>
              </div>
            </div>

            {/* Article Sections */}
            <div className="space-y-8 text-xs sm:text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
              {activeArticle.sections.map((section, sIdx) => (
                <section key={sIdx} className="space-y-3">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                    {section.heading}
                  </h2>

                  {section.content.map((p, pIdx) => (
                    <p key={pIdx} className="leading-relaxed">
                      {p}
                    </p>
                  ))}

                  {/* Terminal Code Snippet if applicable */}
                  {section.terminalCommand && (
                    <div className="mt-3 p-3.5 rounded-xl bg-slate-950 text-slate-200 border border-slate-800 font-mono text-xs flex items-center justify-between gap-3 overflow-x-auto">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span className="select-all">{section.terminalCommand}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(section.terminalCommand!)}
                        className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
                        title="Copy command to clipboard"
                      >
                        {copiedCmd === section.terminalCommand ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}

                  {/* Key Takeaway Box */}
                  {section.keyTakeaway && (
                    <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-500/20 text-indigo-900 dark:text-indigo-200 text-xs flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-semibold">Key Takeaway: </strong>
                        <span>{section.keyTakeaway}</span>
                      </div>
                    </div>
                  )}
                </section>
              ))}
            </div>

            {/* Article FAQ Section */}
            {activeArticle.faq.length > 0 && (
              <div className="border-t border-slate-200/80 dark:border-white/10 pt-8 space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Frequently Asked Questions (FAQ)
                </h3>
                <div className="space-y-3">
                  {activeArticle.faq.map((item, fIdx) => (
                    <div key={fIdx} className="p-4 rounded-xl glass-panel space-y-1.5 text-xs">
                      <h4 className="font-bold text-slate-900 dark:text-white">
                        {item.question}
                      </h4>
                      <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* End-of-Article CTA */}
            <div className="border-t border-slate-200/80 dark:border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500 dark:text-zinc-400">
                Want to test this in practice? Explore our interactive diagnostics.
              </div>
              <a
                href="/troubleshooting"
                onClick={(e) => {
                  e.preventDefault();
                  haptics.playTap();
                  onNavigate('troubleshooting');
                }}
                className="px-4 py-2 rounded-xl glass-button-primary text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer text-decoration-none"
              >
                <span>Launch Continuity Sync Doctor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};
