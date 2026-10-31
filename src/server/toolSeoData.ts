export interface ToolPageSeoEntry {
  heading: string;
  subheading: string;
  faqs: Array<{ question: string; answer: string }>;
  extraHtml?: string;
}

export const TOOL_SEO_DATA: Record<string, ToolPageSeoEntry> = {
  "apple-shortcuts-generator": {
    "heading": "Apple Shortcuts Generator",
    "subheading": "Describe any automation you want in plain words. Get exact, numbered step-by-step instructions and download a ready-to-import .shortcut file directly for your iPhone or iPad.",
    "faqs": [
      {
        "question": "What is the downloaded .shortcut file?",
        "answer": "The .shortcut file is Apple\\"
      },
      {
        "question": "Do I need a Mac or a computer to use this?",
        "answer": "No. Everything runs directly on your iPhone or iPad. The generated steps and downloadable .shortcut file are designed for the native iOS Shortcuts app."
      },
      {
        "question": "Can this shortcut run automatically without me tapping it?",
        "answer": "Yes. In the iOS Shortcuts app, tap the \"Automation\" tab at the bottom, select \"Create Personal Automation\", choose a trigger (like Time of Day, Wi-Fi connection, or Alarm), and select \"Run Shortcut\" to pick your generated shortcut."
      },
      {
        "question": "Are there any security risks with these shortcuts?",
        "answer": "Shortcuts created through the Apple Shortcuts app run within Apple\\"
      }
    ]
  },
  "ai-prompt-improver": {
    "heading": "AI Prompt Improver",
    "subheading": "Transform rough requests into structured, high-performing prompts with explicit roles, clear rules, and output criteria. Works across ChatGPT, Claude, and Gemini.",
    "faqs": [
      {
        "question": "Does this improved prompt work across all AI models?",
        "answer": "Yes. The structure follows universal prompt engineering standards that work reliably on ChatGPT, Claude 3.5 Sonnet, Google Gemini, and open-source models."
      },
      {
        "question": "Why do short prompts often produce disappointing AI responses?",
        "answer": "When you give an AI a short prompt without constraints, it fills in the missing context with statistical averages. Adding persona, boundaries, and formatting requirements forces it to focus on your specific situation."
      },
      {
        "question": "Can I edit the prompt before running it?",
        "answer": "Yes. The output is plain text. Simply copy it into your clipboard and tweak any bracketed placeholders or requirements as needed."
      },
      {
        "question": "Are my private prompts recorded or stored?",
        "answer": "No. SmartToolHub operates with an ephemeral memory model. Your text is processed in real time and is never saved to a database or used for training."
      }
    ]
  },
  "ai-email-writer": {
    "heading": "AI Email Writer",
    "subheading": "Write ready-to-send emails in seconds. Pick your tone, add your main points, and get a clear subject line plus an email body ready to paste.",
    "faqs": [
      {
        "question": "What does the &quot;Make it shorter&quot; button do?",
        "answer": "It condenses your generated email down to under 70 words by removing pleasantries and wordy clauses while keeping the subject line, main request, and call to action intact."
      },
      {
        "question": "Are my email drafts saved on your servers?",
        "answer": "No. Your inputs and generated emails are processed securely in real time and are never stored on our database or shared with third parties."
      },
      {
        "question": "Can I write emails in languages other than English?",
        "answer": "Yes. Enter your purpose and bullet points in Spanish, French, German, Japanese, or any language you prefer, and the tool will draft the email in that language."
      },
      {
        "question": "How do the four tones differ from one another?",
        "answer": "Friendly is warm and approachable. Formal is polite and executive. Short cuts straight to the facts. Firm is confident and direct when holding boundaries or chasing deliverables."
      }
    ]
  },
  "ai-summarizer": {
    "heading": "AI Text Summarizer",
    "subheading": "Condense long articles, meeting notes, transcripts, and research into a punchy 3-sentence summary and 5 clear key points in seconds.",
    "faqs": [
      {
        "question": "What is the difference between Short and Medium mode?",
        "answer": "Short mode keeps sentences tight and produces brief one-line bullet points. Medium mode provides richer context around background reasons and next steps."
      },
      {
        "question": "How long can the pasted text be?",
        "answer": "You can paste up to 4,000 characters at once, which comfortably covers articles, email chains, and typical meeting transcripts."
      },
      {
        "question": "Does the tool make up facts if the text is incomplete?",
        "answer": "No. The AI model is strictly instructed to only summarize information explicitly found in your pasted text, preventing hallucinated numbers or false claims."
      },
      {
        "question": "Are my pasted articles or private notes saved anywhere?",
        "answer": "No. Everything is processed ephemerally through our server API and is never recorded, saved in a database, or used to train models."
      }
    ]
  },
  "caption-hashtag-generator": {
    "heading": "Caption & Hashtag Generator",
    "subheading": "Create 5 catchy social media captions and 15 curated high-reach hashtags in seconds. Pick your platform and mood for instant post-ready results.",
    "faqs": [
      {
        "question": "How many hashtags should I use on Instagram and TikTok?",
        "answer": "Current social media algorithms favor 5 to 15 targeted, accurate hashtags rather than 30 spammy tags. Our tool produces 15 high-relevance tags so you can paste them all or pick your top 10."
      },
      {
        "question": "Can I generate professional captions for LinkedIn?",
        "answer": "Yes. Simply tap the LinkedIn platform button. The tool adjusts sentence structure, removes unnecessary slang, and highlights professional insights and clear discussions."
      },
      {
        "question": "Are emojis included in the generated captions?",
        "answer": "The tool uses 1 to 2 tasteful emojis that match the mood you selected. You can easily delete or replace them before posting."
      },
      {
        "question": "Is this caption generator free to use?",
        "answer": "Yes. You can generate unlimited captions and hashtags with no account, no credits, and no subscription fees."
      }
    ]
  },
  "social-bio-generator": {
    "heading": "Social Bio Generator",
    "subheading": "Craft 4 compelling profile bios tailored for Twitter/X, Instagram, LinkedIn, and TikTok. Compare angles and check character limits in one tap.",
    "faqs": [
      {
        "question": "What are the character limits for bios on different platforms?",
        "answer": "Twitter/X allows 160 characters, Instagram allows 150 characters, TikTok allows 80 characters, and LinkedIn allows 220 characters for your headline. Our generator enforces these limits automatically."
      },
      {
        "question": "Can I include emojis in my generated bio?",
        "answer": "Yes. The generator includes 1 to 2 tasteful emojis that fit your industry. You can easily remove or adjust them before saving your profile."
      },
      {
        "question": "How do I pick between the four generated styles?",
        "answer": "Choose Minimalist if you want a clean look, Creator if you share tips and build an audience, Professional if you are pitching freelance clients, or Casual for personal accounts."
      },
      {
        "question": "Is my personal information stored anywhere?",
        "answer": "No. The bio generator processes your input in real time and does not save your profile details, name, or interests to any database."
      }
    ]
  },
  "title-headline-generator": {
    "heading": "Title & Headline Generator",
    "subheading": "Generate 10 click-worthy, high-converting headlines for blog posts, YouTube videos, and product pages. Compare 10 proven psychological angles with instant one-tap copy.",
    "faqs": [
      {
        "question": "Are these headlines optimized for Google SEO?",
        "answer": "Yes. The generator ensures the primary keyword appears near the front of the headline while keeping total character length under 60 to 70 characters so search engines do not truncate it."
      },
      {
        "question": "What makes YouTube titles different from blog titles?",
        "answer": "YouTube titles prioritize immediate emotional curiosity and fast comprehension on mobile devices, while blog titles focus more on keyword clarity and reader promise."
      },
      {
        "question": "Can I generate headlines for eCommerce product pages?",
        "answer": "Yes. Select the \"Product Pages\" button. The tool creates high-converting value proposition headers designed to explain the key benefit to shoppers instantly."
      },
      {
        "question": "Is there a limit on how many titles I can generate?",
        "answer": "No. The Title and Headline Generator is completely free with no usage caps, credits, or account requirements."
      }
    ]
  },
  "rewrite-tone-changer": {
    "heading": "Rewrite and Tone Changer",
    "subheading": "Change how your words feel without changing what they mean. Choose friendlier, more formal, shorter, or simpler to get an instant before-and-after view.",
    "faqs": [
      {
        "question": "Does this change what my message actually means?",
        "answer": "No. The AI is instructed to preserve 100% of your facts, dates, commitments, and core intent. Only the vocabulary, rhythm, and sentence structure are refined."
      },
      {
        "question": "How does the Before and After view help me?",
        "answer": "It lets you compare your original draft side-by-side with the new phrasing and review the character count so you can be confident your message strikes the right chord."
      },
      {
        "question": "Which tone should I use for asking for a favor?",
        "answer": "The Friendlier tone works best. It softens direct commands into helpful requests, which makes people far more willing to help you quickly."
      },
      {
        "question": "Are my private messages or emails stored on your server?",
        "answer": "No. SmartToolHub operates with an ephemeral architecture. Your text is processed in memory to generate the rewrite and is immediately discarded."
      }
    ]
  },
  "formula-helper": {
    "heading": "Excel & Google Sheets Formula Helper",
    "subheading": "Describe what you want to calculate, lookup, or extract in plain English. Get the exact spreadsheet formula with a clear breakdown and a practical example.",
    "faqs": [
      {
        "question": "Does this formula work in both Google Sheets and Microsoft Excel?",
        "answer": "Yes. Unless specified otherwise, formulas are written using universal modern spreadsheet syntax compatible with Excel 365, Excel 2021+, and Google Sheets."
      },
      {
        "question": "Why should I use XLOOKUP instead of VLOOKUP?",
        "answer": "XLOOKUP is faster, searches in any direction (including looking to the left of the lookup key), and does not require counting column numbers, making your spreadsheets far less prone to breaking."
      },
      {
        "question": "What should I do if my formula returns a #VALUE! error?",
        "answer": "Check that your numbers are not stored as text, and verify that all range sizes match (for example, using D2:D100 with E2:E100 rather than different lengths)."
      },
      {
        "question": "Is my spreadsheet data sent to your server?",
        "answer": "No spreadsheet files or actual personal row data are ever uploaded. You only enter the description of the columns and the calculation you want."
      }
    ]
  },
  "meeting-notes-action-items": {
    "heading": "Meeting Notes to Action Items",
    "subheading": "Turn messy transcripts and scattered meeting notes into an executive summary, clear key decisions, and assigned action items with owners and deadlines.",
    "faqs": [
      {
        "question": "What if someone in the meeting is not assigned a specific task?",
        "answer": "If an action item has no clear person named, the tool tags the owner as \"Unassigned\" so your team can assign it during follow-up."
      },
      {
        "question": "Can I paste transcripts from Zoom or Google Meet?",
        "answer": "Yes. You can paste raw text transcripts directly into the box. The tool filters out conversational filler and extracts only key takeaways and tasks."
      },
      {
        "question": "How are priority levels (High, Medium, Low) determined?",
        "answer": "Tasks with same-day deadlines or blocking dependencies are marked High, near-term weekly tasks are marked Medium, and general follow-ups are marked Low."
      },
      {
        "question": "Are my confidential company meeting notes safe?",
        "answer": "Yes. All text is processed transiently in memory without being recorded to a database or used to train public language models."
      }
    ]
  },
  "retina-image-size-calculator": {
    "heading": "Retina Image Size Calculator",
    "subheading": "Convert design points into pixel-perfect @1x, @2x, and @3x dimensions. Never ship blurry images to iPhone, iPad, or Mac screens.",
    "faqs": [
      {
        "question": "What is the difference between a point (pt) and a pixel (px)?",
        "answer": "A point is an abstract unit of physical distance on a screen that stays roughly the same physical size to the human eye, whereas a pixel is an actual hardware light emitter. On a Retina screen, 1 point contains 4 pixels (@2x) or 9 pixels (@3x)."
      },
      {
        "question": "Which Apple devices use @3x assets?",
        "answer": "All modern flagship iPhones with OLED screens use @3x, including iPhone 16 Pro, iPhone 16, iPhone 15 series, iPhone 14 Pro, iPhone 13 Pro, and iPhone Plus models. iPads and MacBooks primarily use @2x."
      },
      {
        "question": "Can I just export @3x and let the browser scale it down?",
        "answer": "While browsers can downscale images, loading a massive @3x image on a mobile cellular connection wastes user data and slows down page speed. Providing responsive @1x, @2x, and @3x via srcset is the recommended best practice."
      },
      {
        "question": "Does this calculator run on my device or on a server?",
        "answer": "All calculations run directly in your web browser. No measurements or image data are sent to any server."
      }
    ]
  },
  "iphone-charging-time-calculator": {
    "heading": "iPhone Charging Time Calculator",
    "subheading": "Calculate realistic iPhone charging durations based on your battery capacity, charger wattage, and phone speed limits. Includes smart fast-charge and trickle-charge curves.",
    "faqs": [
      {
        "question": "Does using a fast charger ruin my iPhone battery health?",
        "answer": "No. Modern iPhones feature intelligent Power Delivery management that throttles speed when the battery warms up. Setting the 80% limit in iOS 18+ is the most effective way to keep your battery healthy."
      },
      {
        "question": "Can I use a MacBook or iPad charger for my iPhone?",
        "answer": "Yes. Apple USB-C chargers (from 30W to 140W) negotiate safe voltages via the USB-PD standard. Your iPhone will safely draw its maximum rate without danger of overcharging."
      },
      {
        "question": "Why does charging slow down so much after 80%?",
        "answer": "Lithium-ion cells experience high resistance and heat when almost full. iOS automatically switches to trickle charging to avoid damaging the internal electrolyte and preserve battery longevity."
      },
      {
        "question": "Is wireless MagSafe charging as fast as a cable?",
        "answer": "MagSafe charges at up to 15W to 25W on newer models, but because wireless charging generates more ambient heat, thermal throttling usually makes it about 20% to 30% slower than a direct USB-C cable."
      }
    ]
  },
  "file-transfer-time-calculator": {
    "heading": "File Transfer Time Calculator",
    "subheading": "Calculate data transfer time with round-trip latency (ms) and protocol overhead (%). Switch between MB/s, Mbps, and GB to compare realistic cable, Wi-Fi, and network speeds.",
    "extraHtml": `<section style="margin-bottom: 2.5rem;"><h2 style="font-size: 1.25rem; font-weight: 700; color: #f2f7ff; margin-bottom: 1rem;">Worked Example Table: Transfer Time with Latency and Overhead</h2><div style="overflow-x: auto;"><table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;"><thead style="border-bottom: 1px solid rgba(143,163,192,0.25);"><tr style="color: #8fa3c0;"><th style="padding: 0.65rem;">File Size</th><th style="padding: 0.65rem;">Connection (Mbps / MB/s)</th><th style="padding: 0.65rem;">Latency &amp; Overhead</th><th style="padding: 0.65rem;">Effective Speed</th><th style="padding: 0.65rem;">Transfer Time</th></tr></thead><tbody style="color: #d1dced;"><tr style="border-bottom: 1px solid rgba(143,163,192,0.1);"><td style="padding: 0.65rem;">10 GB (10,240 MB)</td><td style="padding: 0.65rem;">1,000 Mbps (125 MB/s)</td><td style="padding: 0.65rem;">10 ms RTT, 10% overhead</td><td style="padding: 0.65rem;">~108.6 MB/s</td><td style="padding: 0.65rem;">1 min 34 sec</td></tr><tr style="border-bottom: 1px solid rgba(143,163,192,0.1);"><td style="padding: 0.65rem;">25 GB (25,600 MB)</td><td style="padding: 0.65rem;">7,600 Mbps (950 MB/s USB-C)</td><td style="padding: 0.65rem;">1 ms RTT, 5% overhead</td><td style="padding: 0.65rem;">~873.9 MB/s</td><td style="padding: 0.65rem;">29 sec</td></tr><tr style="border-bottom: 1px solid rgba(143,163,192,0.1);"><td style="padding: 0.65rem;">25 GB (25,600 MB)</td><td style="padding: 0.65rem;">600 Mbps (75 MB/s AirDrop)</td><td style="padding: 0.65rem;">8 ms RTT, 10% overhead</td><td style="padding: 0.65rem;">~66.0 MB/s</td><td style="padding: 0.65rem;">6 min 28 sec</td></tr><tr><td style="padding: 0.65rem;">100 GB (102,400 MB)</td><td style="padding: 0.65rem;">100 Mbps (12.5 MB/s Wi-Fi)</td><td style="padding: 0.65rem;">40 ms RTT, 12% overhead</td><td style="padding: 0.65rem;">~10.8 MB/s</td><td style="padding: 0.65rem;">2 hrs 38 mins 2 sec</td></tr></tbody></table></div></section>`,
    "faqs": [
      {
        "question": "How do I calculate data transfer time between two devices or over the internet?",
        "answer": "To calculate data transfer time, convert your file size into megabytes (1 GB = 1,024 MB), convert your connection speed into megabytes per second (divide Mbps by 8 to get MB/s), and divide the file size by the effective speed after subtracting protocol overhead and latency delays."
      },
      {
        "question": "Why should I use a file transfer calculator with latency instead of a basic speed formula?",
        "answer": "A basic formula assumes data flows at full line speed from the first millisecond. Using a file transfer calculator with latency accounts for round-trip time (RTT in ms) and packet acknowledgements, which explains why copying files to a distant cloud server is slower than copying over a local cable at the same bandwidth."
      },
      {
        "question": "How does this work as a file copy speed calculator for USB drives and external SSDs?",
        "answer": "You can use this tool as a local file copy speed calculator by selecting a cable preset (such as USB-C 3.2 or USB 2.0) or switching the speed unit to MB/s, setting round-trip latency to 1 ms, and setting protocol overhead to 5% to reflect file system indexing."
      },
      {
        "question": "What is the difference between Mbps and MB/s when checking transfer time?",
        "answer": "Internet providers advertise speeds in megabits per second (Mbps), while computers measure files in megabytes (MB) or gigabytes (GB). Because there are 8 bits in 1 byte, a 100 Mbps connection has a maximum raw speed of 12.5 MB/s before overhead, which directly affects your total transfer time."
      },
      {
        "question": "Why does copying thousands of small files increase transfer time compared to one large file?",
        "answer": "Every individual file requires the operating system or network protocol to open, verify, and close metadata records. When moving thousands of small photos or code files, those extra round-trips add overhead. Zipping small files into a single archive before copying reduces total transfer time."
      }
    ]
  },
  "quick-calculators": {
    "heading": "Quick Utilities Calculator",
    "subheading": "Instant calculators for Retina image pixel dimensions (@2x and @3x), file transfer download times, and phone/laptop battery charging duration.",
    "faqs": [
      {
        "question": "Do the interactive calculators require an internet connection?",
        "answer": "No. The interactive tabs run completely client-side in your browser using JavaScript math with zero latency."
      },
      {
        "question": "Why does my download take longer than the calculated time in real life?",
        "answer": "Real-world internet connections experience Wi-Fi packet loss, server bandwidth caps, and TCP protocol overhead (typically 10-15%)."
      },
      {
        "question": "Why do I need @3x images if @2x looks sharp?",
        "answer": "Flagship devices like the iPhone 15/16 Pro have screen densities exceeding 460 PPI, where @3x assets prevent micro-blur on high-contrast text and icons."
      },
      {
        "question": "Can I calculate charging times for electric vehicles (EVs) or power banks?",
        "answer": "Yes! Simply enter the battery capacity in mAh (or type the kWh capacity in the custom prompt box below) and the charger wattage."
      }
    ]
  },
  "iphone-screenshot-mockup-maker": {
    "heading": "iPhone Screenshot Mockup Maker",
    "subheading": "Place any screenshot inside a clean, neutral phone frame with customizable backgrounds, shadow elevation, and instant high-res PNG export. 100% private and processed on-device.",
    "faqs": [
      {
        "question": "Are my uploaded screenshots sent to your servers?",
        "answer": "No. SmartToolHub operates strictly on-device. Images are loaded via local Blob URLs and painted directly into an HTML5 Canvas in your browser memory. No data is transmitted across the network."
      },
      {
        "question": "Does this mockup generator contain official Apple logos or trademarks?",
        "answer": "No. This tool uses clean, original, neutral device geometry and non-trademarked proportions. It is fully suitable for commercial advertising and editorial portfolios."
      },
      {
        "question": "What is the optimal screenshot resolution for best results?",
        "answer": "Standard iOS screenshots at 1170×2532 (iPhone 13/14/15/16 Pro), 1290×2796 (Pro Max / Plus), or 1080×2340 match the 19.5:9 display proportion cleanly without cropping."
      },
      {
        "question": "Can I export a transparent background for landing pages?",
        "answer": "Yes. Select the Transparent preset. The exported PNG will contain a transparent alpha channel with full device shadows."
      }
    ]
  },
  "iphone-battery-health-forecast": {
    "heading": "iPhone Battery Health Forecast",
    "subheading": "Calculate your estimated battery capacity degradation, cycle count aging curve, and time remaining until the 80% Apple service threshold. Includes accurate 500-cycle vs 1,000-cycle chemistry models.",
    "faqs": [
      {
        "question": "Where can I find the exact cycle count on my iPhone?",
        "answer": "On iPhone 15 and iPhone 16 series running iOS 17.4 or later, go to Settings > Battery > Battery Health. On older iPhones, you can view cycles by exporting Analytics logs or using an Apple Shortcut."
      },
      {
        "question": "Why did Apple change the cycle rating from 500 to 1,000 cycles?",
        "answer": "Starting with the iPhone 15 series, Apple re-engineered the chemical composition of the battery cathode and refined the power management controller, enabling the cells to withstand 1,000 full cycles before dropping to 80%."
      },
      {
        "question": "What happens when my battery health drops below 80%?",
        "answer": "iOS will display an \"Important Battery Message\" indicating that battery health has degraded. The phone may enable performance management to avoid unexpected shutdowns during peak CPU tasks."
      },
      {
        "question": "Does fast charging with a 30W adapter damage battery health?",
        "answer": "No. Modern iPhones actively manage heat and current via USB-PD. The phone will only fast-charge when the battery is cool and throttles back automatically as the battery warms up."
      }
    ]
  },
  "iphone-storage-planner": {
    "heading": "iPhone Storage Planner & Charger",
    "subheading": "Calculate exactly how many gigabytes you need before buying your next iPhone and benchmark realistic charging curves across chargers. Features dual-tab planner and charger.",
    "faqs": [
      {
        "question": "How much space does iOS and System Data take up?",
        "answer": "The core iOS operating system takes 10GB to 12GB, while System Data (caches, Siri voices, fonts, and logs) typically uses another 8GB to 15GB, meaning a new phone already has ~20GB occupied out of the box."
      },
      {
        "question": "Is 128GB enough for most iPhone users today?",
        "answer": "128GB is sufficient only if you stream music and video, take occasional photos, or subscribe to iCloud Photos with Optimize Storage turned on. For heavy 4K video or gaming, 256GB is the recommended baseline."
      },
      {
        "question": "Can I plug an external USB-C drive into my iPhone?",
        "answer": "Yes. On iPhone 15 and iPhone 16 series, the USB-C port supports external NVMe SSDs and flash drives via the Files app, and allows direct external recording of ProRes video."
      },
      {
        "question": "Why does charging take longer between 80% and 100%?",
        "answer": "Lithium-ion cells generate high internal resistance when nearly saturated. To prevent dendrite formation and electrolyte overheating, iOS switches into trickle charging mode."
      }
    ]
  },
  "wallpaper-gradient-maker": {
    "heading": "Wallpaper Gradient Maker",
    "subheading": "Design custom 3-stop mesh and linear gradients with a live phone lock screen preview, one-click CSS copy, and instant uncompressed 1170×2532 PNG download. Tailored for OLED true-black efficiency.",
    "faqs": [
      {
        "question": "Why 1170 × 2532 resolution?",
        "answer": "1170×2532 is the native hardware resolution of modern 6.1-inch iPhones (iPhone 13, 14, 15, and 16 Pro) at 460 pixels per inch. It also scales perfectly to larger Plus and Pro Max screens without pixelation."
      },
      {
        "question": "Why do other wallpaper apps have visible color banding?",
        "answer": "Standard JPEG wallpapers suffer from 8-bit heavy quantization. SmartToolHub exports clean 32-bit lossless PNG files directly from canvas memory, ensuring buttery smooth color transitions."
      },
      {
        "question": "Does this tool upload my images anywhere?",
        "answer": "No. The entire rendering pipeline runs in your local browser using HTML5 Canvas. No server communication takes place."
      },
      {
        "question": "Can I use these gradients in commercial web design?",
        "answer": "Yes. All CSS code and generated PNG graphics are 100% royalty-free for personal and commercial projects."
      }
    ]
  },
  "apple-subscription-calculator": {
    "heading": "Apple Subscription Cost Calculator",
    "subheading": "Audit your recurring Apple services spending across iCloud, Apple Music, TV+, and Apple One. Discover hidden bundle savings and track your total annual cost.",
    "faqs": [
      {
        "question": "What is included in Apple One bundles?",
        "answer": "Apple One Individual ($19.95) includes Apple Music, Apple TV+, Apple Arcade, and 50GB iCloud. The Family plan ($25.95) includes 200GB iCloud with 5-person sharing. The Premier plan ($37.95) includes 2TB iCloud, Apple News+, and Apple Fitness+."
      },
      {
        "question": "Can I keep extra iCloud storage with Apple One?",
        "answer": "Yes. If you subscribe to Apple One and also need more storage, you can purchase an additional standalone iCloud+ plan (e.g., Apple One Premier 2TB + iCloud 2TB gives you 4TB total)."
      },
      {
        "question": "Are my subscription details saved on your servers?",
        "answer": "No. SmartToolHub stores your list locally in your browser via HTML5 localStorage. No personal data, email, or credentials are ever transmitted to any server."
      },
      {
        "question": "How do I cancel unwanted Apple subscriptions on iPhone?",
        "answer": "Open the Settings app on your iPhone, tap your name at the very top, tap Subscriptions, select the service you wish to end, and tap Cancel Subscription."
      }
    ]
  },
  "task-breaker": {
    "heading": "AI Task Breaker & Step Planner",
    "subheading": "Break down tasks and overwhelmed to-do lists into calm micro-steps with time estimates and tickable checklists. Beat task paralysis with zero guilt and zero pressure.",
    "faqs": [
      {
        "question": "Why does breaking tasks down help reduce procrastination?",
        "answer": "Procrastination is an emotional regulation problem, not a time management issue. Large goals feel threatening because the path is unclear. Converting them into concrete, small physical steps lowers the required activation energy."
      },
      {
        "question": "Are my tasks or personal notes stored on your server?",
        "answer": "No. Prompts are processed ephemerally by our AI model and immediately discarded. Your checklist checkmark states are saved strictly in your device local storage."
      },
      {
        "question": "What is the difference between Normal and Tiny steps?",
        "answer": "Normal generates 5-7 standard 10-to-25 minute steps. Tiny steps generates 8-12 granular micro-steps (2-10 minutes each), which is especially helpful for ADHD or executive dysfunction."
      },
      {
        "question": "Can I break down an individual step even further?",
        "answer": "Yes. Click \"Break down this step more\" on any step to instantly unpack it into bite-sized 2-to-5 minute sub-steps."
      }
    ]
  },
  "explain-it-simply": {
    "heading": "Explain It Simply (AI Tutor)",
    "subheading": "Master complex topics through the Feynman Technique. Get crystal-clear explanations tailored to age 10, high school, or college depth, complete with real-world analogies and self-testing quizzes.",
    "faqs": [
      {
        "question": "What is the Feynman Technique?",
        "answer": "The Feynman Technique is a 4-step mental model: 1) Pick a concept, 2) Explain it in simple language as if teaching a beginner, 3) Identify knowledge gaps where you used jargon, and 4) Simplify and refine."
      },
      {
        "question": "Can I paste long lecture notes or textbook excerpts?",
        "answer": "Yes. You can paste up to 5,000 characters of dense textbook or paper excerpts. The AI will distill the foundational thesis and explain it clearly."
      },
      {
        "question": "Does this tool support STEM subjects and math?",
        "answer": "Yes. It explains calculus, physics, chemistry, computer science algorithms, economics, and legal principles with customized conceptual breakdowns."
      },
      {
        "question": "Are quiz answers generated from my specific topic?",
        "answer": "Yes. The 3 quiz questions test the primary mechanisms and common misconceptions of your exact query."
      }
    ]
  },
  "flashcard-quiz-maker": {
    "heading": "Flashcard and Quiz Maker",
    "subheading": "Transform rough study notes, lecture slides, and textbook chapters into 10 interactive flippable flashcards and self-testing multiple-choice quizzes. Built for active recall.",
    "faqs": [
      {
        "question": "How does the flashcard flip animation work with prefers-reduced-motion?",
        "answer": "If your system has reduced-motion enabled in iOS or macOS settings, the 3D rotation is automatically disabled and replaced with an immediate, accessible opacity swap."
      },
      {
        "question": "How many flashcards are created per generation?",
        "answer": "The tool extracts the top 10 most critical high-yield concepts from your notes, ensuring focused review rather than overwhelming volume."
      },
      {
        "question": "Can I use this for foreign vocabulary and languages?",
        "answer": "Yes. It works with Spanish, French, German, Mandarin, Japanese, and other languages, creating vocabulary pairs and sentence translation cards."
      },
      {
        "question": "Are my study notes saved or trained on?",
        "answer": "No. SmartToolHub operates strictly ephemeral prompts; notes are processed in memory and never stored or used to train public models."
      }
    ]
  },
  "study-plan-maker": {
    "heading": "AI Study Plan Maker",
    "subheading": "Generate realistic, day-by-day exam prep schedules formatted as a clean scrollable table. Balances content review, active practice, and mock test milestones with zero burnout.",
    "faqs": [
      {
        "question": "Can I copy the table directly into Google Sheets or Microsoft Excel?",
        "answer": "Yes. Click the Copy Table button to copy formatted Markdown and tab-delimited text that pastes cleanly into any spreadsheet or note-taking application."
      },
      {
        "question": "What if I fall behind on my schedule by a day?",
        "answer": "Do not try to double your study time the next day. Simply regenerate your plan with the updated days remaining to redistribute the remaining topics realistically."
      },
      {
        "question": "Does the planner account for rest days?",
        "answer": "For timelines over 14 days, the AI automatically integrates light review days and buffer periods to prevent academic burnout."
      },
      {
        "question": "Is this tool free to use?",
        "answer": "Yes. SmartToolHub tools are 100% free with no sign-up or credit card required."
      }
    ]
  },
  "invoice-generator": {
    "heading": "Free Invoice Generator",
    "subheading": "Create professional client invoices in seconds with automatic tax calculations, line item math, and one-click 'Print or Save as PDF' export. 100% private, browser-based, and zero server storage.",
    "faqs": [
      {
        "question": "Are my invoices saved on SmartToolHub servers?",
        "answer": "No. SmartToolHub operates with zero server persistence for client tools. All math, line-item state, and PDF generation happen in your local browser."
      },
      {
        "question": "How do I download the invoice as a PDF?",
        "answer": "Click the \"Print or Save as PDF\" button. In your browser print window, change the printer destination to \"Save as PDF\" and click Save."
      },
      {
        "question": "Can I change the currency symbol?",
        "answer": "Yes. Use the Currency selector to toggle between USD ($), Euro (€), British Pound (£), Canadian Dollar (C$), and Australian Dollar (A$)."
      },
      {
        "question": "Is this invoice generator free for commercial use?",
        "answer": "Yes. It is 100% free with no watermark, no page limits, and no required account creation."
      }
    ]
  },
  "cover-letter-resume-bullets": {
    "heading": "Cover Letter & Resume Bullet Improver",
    "subheading": "Draft tailored 3-paragraph cover letters or transform rough experience notes into punchy, metric-driven resume bullets. Strictly honest: action verbs and supplied facts only, never invented achievements.",
    "faqs": [
      {
        "question": "Does this tool guarantee passing Applicant Tracking Systems (ATS)?",
        "answer": "No tool can guarantee ATS passage because ATS platforms simply parse text for relevant keywords. However, using clear standard formatting and industry action verbs makes your text significantly easier for ATS parsers to index."
      },
      {
        "question": "Will this tool invent accomplishments I did not achieve?",
        "answer": "No. We have strictly instructed the AI prompt to never fabricate numbers, clients, or technologies. It only restructures and clarifies facts you provide."
      },
      {
        "question": "Are my resume notes saved or shared with recruiters?",
        "answer": "No. SmartToolHub operates zero storage for prompts. Your career details are processed ephemerally and discarded immediately."
      },
      {
        "question": "Can I generate both bullets and a cover letter from the same notes?",
        "answer": "Yes. Simply toggle the mode button at the top and click generate again."
      }
    ]
  },
  "product-description-generator": {
    "heading": "Product Description Generator",
    "subheading": "Generate high-converting e-commerce copy formatted into a punchy short description, compelling overview story, and 5 benefit-driven feature bullets for Shopify, Amazon, or Etsy.",
    "faqs": [
      {
        "question": "Are the 5 bullet points formatted for Amazon seller guidelines?",
        "answer": "Yes. Amazon requires benefit-driven bullet points under 250 characters per bullet with clear feature anchors. The generated bullets comply directly with Amazon Seller Central standards."
      },
      {
        "question": "Can I generate descriptions for physical and digital products?",
        "answer": "Yes. It works equally well for physical consumer goods, digital software plugins, Notion templates, eBooks, and SaaS memberships."
      },
      {
        "question": "Is the generated copy unique and royalty-free?",
        "answer": "Yes. All generated copy is created dynamically in your browser turn and belongs 100% to you for commercial use with no attribution required."
      },
      {
        "question": "Does this tool store my unpublished product ideas?",
        "answer": "No. SmartToolHub operates zero server logging or database storage. Your confidential upcoming product launches stay completely private."
      }
    ]
  },
  "ai-translator-tone": {
    "heading": "AI Translator with Tone",
    "subheading": "Translate messages across 12 languages with culturally accurate tonal nuance. Choose between everyday casual conversation, respectful polite correspondence, or crisp executive business registers.",
    "faqs": [
      {
        "question": "How is this different from generic search translators?",
        "answer": "Standard machine translation defaults to a single rigid, often overly literal tone. This tool understands social hierarchy, honorifics, and corporate conventions across cultures, and explains its vocabulary choices in a transparent note."
      },
      {
        "question": "Are my translated messages stored or shared?",
        "answer": "No. Input text is processed strictly to generate the translation and is never stored on disk, logged, or used to build user profiles."
      },
      {
        "question": "Can I swap languages to read incoming replies?",
        "answer": "Yes! Tap the Swap button between the language dropdowns to immediately reverse your source and target settings for bidirectional conversation."
      }
    ]
  },
  "natural-rewrite": {
    "heading": "Natural Rewrite (Human Voice Editor)",
    "subheading": "Edit stiff, robotic AI-assisted drafts into natural, engaging human writing. Cleans out repetitive transitions, strips hollow clichés, and varies sentence cadence so your ideas sound genuinely yours.",
    "faqs": [
      {
        "question": "Does this tool guarantee bypassing AI detectors?",
        "answer": "No. We do not make any claims about bypassing AI detectors or beating scanning software. Detectors are statistically unreliable and fluctuate constantly. Our goal is solely to help you write clearer, more engaging English with authentic human cadence."
      },
      {
        "question": "What robotic words does this tool remove?",
        "answer": "Common dead giveaways include \"delve\", \"tapestry\", \"furthermore\", \"testament to\", \"plethora\", \"beacon\", \"game-changer\", and formulaic conclusions starting with \"In summary\"."
      },
      {
        "question": "Is my draft stored on any server?",
        "answer": "No. Your pasted draft is processed in memory solely to return your edited version and is never stored on disk, logged, or saved."
      }
    ]
  },
  "pdf-merge-split": {
    "heading": "PDF Merge & Split",
    "subheading": "Combine multiple PDF documents or extract custom page ranges into individual files. 100% private in-browser execution with zero uploads.",
    "faqs": [
      {
        "question": "Can I merge password-protected PDF files?",
        "answer": "No. For security and privacy reasons, we cannot open password-encrypted PDFs. To merge a protected file, first open it in your computer or phone PDF viewer, enter your password, and export an unencrypted copy using \"Print to PDF\"."
      },
      {
        "question": "How do I rearrange the order of pages before merging?",
        "answer": "In the Merge tab, each uploaded document card includes dedicated Up and Down arrow buttons. Click or tap the arrows to position the files in your desired sequence before clicking \"Merge PDFs\"."
      },
      {
        "question": "How does the page range syntax work for splitting?",
        "answer": "You can specify individual pages or ranges separated by commas. For example, typing \"1-3, 5, 8-10\" will extract pages 1, 2, 3, 5, 8, 9, and 10 into a brand-new consolidated PDF document in that exact order."
      },
      {
        "question": "Are my confidential documents uploaded to any remote server?",
        "answer": "Never. SmartToolHub executes 100% locally in your browser memory using WebAssembly and pdf-lib. Your financial records, tax forms, and signed agreements never travel across the internet."
      }
    ]
  },
  "pdf-merge": {
    "heading": "PDF Merge & Split",
    "subheading": "Combine multiple PDF documents or extract custom page ranges into individual files. 100% private in-browser execution with zero uploads.",
    "faqs": [
      {
        "question": "Can I merge password-protected PDF files?",
        "answer": "No. For security and privacy reasons, we cannot open password-encrypted PDFs. To merge a protected file, first open it in your computer or phone PDF viewer, enter your password, and export an unencrypted copy using \"Print to PDF\"."
      },
      {
        "question": "How do I rearrange the order of pages before merging?",
        "answer": "In the Merge tab, each uploaded document card includes dedicated Up and Down arrow buttons. Click or tap the arrows to position the files in your desired sequence before clicking \"Merge PDFs\"."
      },
      {
        "question": "How does the page range syntax work for splitting?",
        "answer": "You can specify individual pages or ranges separated by commas. For example, typing \"1-3, 5, 8-10\" will extract pages 1, 2, 3, 5, 8, 9, and 10 into a brand-new consolidated PDF document in that exact order."
      },
      {
        "question": "Are my confidential documents uploaded to any remote server?",
        "answer": "Never. SmartToolHub executes 100% locally in your browser memory using WebAssembly and pdf-lib. Your financial records, tax forms, and signed agreements never travel across the internet."
      }
    ]
  },
  "pdf-split": {
    "heading": "PDF Merge & Split",
    "subheading": "Combine multiple PDF documents or extract custom page ranges into individual files. 100% private in-browser execution with zero uploads.",
    "faqs": [
      {
        "question": "Can I merge password-protected PDF files?",
        "answer": "No. For security and privacy reasons, we cannot open password-encrypted PDFs. To merge a protected file, first open it in your computer or phone PDF viewer, enter your password, and export an unencrypted copy using \"Print to PDF\"."
      },
      {
        "question": "How do I rearrange the order of pages before merging?",
        "answer": "In the Merge tab, each uploaded document card includes dedicated Up and Down arrow buttons. Click or tap the arrows to position the files in your desired sequence before clicking \"Merge PDFs\"."
      },
      {
        "question": "How does the page range syntax work for splitting?",
        "answer": "You can specify individual pages or ranges separated by commas. For example, typing \"1-3, 5, 8-10\" will extract pages 1, 2, 3, 5, 8, 9, and 10 into a brand-new consolidated PDF document in that exact order."
      },
      {
        "question": "Are my confidential documents uploaded to any remote server?",
        "answer": "Never. SmartToolHub executes 100% locally in your browser memory using WebAssembly and pdf-lib. Your financial records, tax forms, and signed agreements never travel across the internet."
      }
    ]
  },
  "image-to-pdf": {
    "heading": "Image to PDF Converter (Private)",
    "subheading": "Convert JPG, PNG, and camera photos into clean, multi-page PDF documents. Choose page sizes (A4, US Letter, Fit-to-Image), orientations, and custom margins entirely in your browser.",
    "faqs": [
      {
        "question": "Are my private photos uploaded to a cloud server?",
        "answer": "Never. The conversion happens 100% inside your browser using client-side WebAssembly. Your photos never leave your device."
      },
      {
        "question": "What image formats can I convert?",
        "answer": "The converter accepts standard JPG, JPEG, PNG, and WebP images up to 25MB each."
      },
      {
        "question": "Does this tool compress or lower the image quality?",
        "answer": "No. The converter embeds the exact byte streams of your original images directly into the PDF container without downsampling."
      }
    ]
  },
  "image-to-text-ocr": {
    "heading": "Image to Text (Local Browser OCR)",
    "subheading": "Extract printed characters, typed receipts, book paragraphs, and slide notes directly into editable text. Runs 100% inside your browser using client-side OCR with zero cloud uploads.",
    "faqs": [
      {
        "question": "Are my scanned photos uploaded to any server?",
        "answer": "No. The OCR neural model runs locally in your browser via WebAssembly. Your photos and extracted text never leave your device."
      },
      {
        "question": "Can this tool read cursive handwriting?",
        "answer": "The engine is optimized for printed, typed, and cleanly rendered characters. Very loose or slanted handwriting will produce lower accuracy."
      },
      {
        "question": "Does this tool work offline?",
        "answer": "Once the page and language model are cached in your browser session, character recognition can execute completely without an active internet connection."
      }
    ]
  },
  "heic-to-jpg-converter": {
    "heading": "HEIC to JPG Converter",
    "subheading": "Batch convert iPhone HEIC & HEIF photos to JPG, PNG, or WebP. 100% private in-browser decoding with zero server uploads.",
    "faqs": [
      {
        "question": "Is it safe to convert sensitive or family photos with this tool?",
        "answer": "Yes, 100% safe. SmartToolHub operates client-side directly within your browser memory. Your HEIC photos never travel over the network or get saved to any cloud server or database."
      },
      {
        "question": "Why do iPhones capture photos in HEIC format instead of JPG?",
        "answer": "Apple introduced HEIC in iOS 11 because it uses advanced HEVC compression to cut file sizes roughly in half compared to traditional JPEGs without visible loss in quality. It also supports 16-bit color depth, transparency, and live photo image sequences."
      },
      {
        "question": "How do I change my iPhone camera settings so it shoots in JPG directly?",
        "answer": "Open Settings on your iPhone, tap \"Camera\", tap \"Formats\" at the top, and change the setting from \"High Efficiency\" to \"Most Compatible\". Note that exact menus can vary slightly by iOS version, but choosing \"Most Compatible\" ensures future photos are stored as standard JPGs."
      },
      {
        "question": "Does converting HEIC to JPG remove my GPS location and camera data?",
        "answer": "Yes. When photos are decoded and drawn through your browser canvas, private EXIF metadata including GPS coordinates and device serial numbers is automatically stripped. This is a significant privacy advantage when sharing photos publicly."
      }
    ]
  },
  "image-compressor-converter": {
    "heading": "Image Compressor & Converter",
    "subheading": "Batch compress and convert JPG, PNG, WebP, and AVIF images with custom quality and max-width resizing. 100% private in-browser canvas processing.",
    "faqs": [
      {
        "question": "How does image compression work without losing visible quality?",
        "answer": "Lossy algorithms (JPEG, WebP, and AVIF) use perceptual quantization: they eliminate high-frequency chrominance data that human retinas cannot perceive at standard screen viewing distances while preserving edge contrast and sharpness. Tuning quality to 80% to 85% typically reduces file size by 60% to 75% with zero perceptible softness."
      },
      {
        "question": "Why does PNG file size barely change after compression?",
        "answer": "PNG is a 100% lossless format. It does not allow lossy quality degradation, meaning all original color values remain intact. To shrink PNG files, the most effective technique is dimensional resizing (e.g. capping width to 1920px or 1280px) or converting them to modern WebP format."
      },
      {
        "question": "Are my photos or screenshots uploaded to a cloud server?",
        "answer": "No. All decompression, canvas rendering, and format encoding execute 100% locally on your device within your web browser memory. Your images never leave your computer or phone, making this tool completely safe for private documents, contracts, and confidential photos."
      },
      {
        "question": "Which format should I choose: WebP, JPEG, or AVIF?",
        "answer": "For modern web usage, WebP is the recommended default because it delivers 25% to 35% smaller file sizes than JPEG with identical quality and supports transparency. Choose JPEG for legacy compatibility with older email clients or office software, and PNG if you need transparent backgrounds without any lossy compression."
      }
    ]
  },
  "install-command-generator": {
    "heading": "Install Command Generator",
    "subheading": "Generate single-line winget (Windows) or Homebrew cask (macOS) install commands from verified package IDs. Zero telemetry, no wrappers.",
    "faqs": [
      {
        "question": "What is winget and is it pre-installed on Windows?",
        "answer": "Winget is Microsoft’s official Windows Package Manager. It is pre-installed on all modern versions of Windows 11 and Windows 10 (version 1809 and newer) via the App Installer bundle from the Microsoft Store."
      },
      {
        "question": "Do I need administrator privileges to run these install commands?",
        "answer": "Most single-user utilities install cleanly under user space. However, tools that install system drivers or shell extensions (like 7-Zip context menus or PowerToys) will trigger a standard Windows UAC prompt for elevation."
      },
      {
        "question": "How do I install Homebrew on a brand new Mac?",
        "answer": "Open the Terminal app in macOS and run the official command from brew.sh: /bin/bash -c \"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\". Once installed, your brew cask commands will work immediately."
      },
      {
        "question": "Are these installations safe from unwanted bundled software?",
        "answer": "Yes. Package manager manifests pull official binaries straight from verified GitHub releases and publisher CDNs without the adware or browser toolbars commonly found on aggregator download sites."
      }
    ]
  },
  "file-checksum-verifier": {
    "heading": "File Checksum Verifier",
    "subheading": "Verify SHA-256, SHA-512, SHA-1, and MD5 file hashes locally in your browser. Supports multi-gigabyte ISOs with chunked streaming.",
    "faqs": [
      {
        "question": "Does my file get uploaded to any server during hashing?",
        "answer": "No. The entire verification runs 100% locally on your computer inside your web browser using HTML5 File API and WebAssembly. No data is ever sent to any server."
      },
      {
        "question": "Why does hashing a multi-gigabyte ISO take several seconds?",
        "answer": "The browser must read every single byte off your local storage drive to calculate the cryptographic digest. Speeds depend on your storage drive (typically 400–1200 MB/s on modern NVMe SSDs)."
      },
      {
        "question": "What is the difference between SHA-256 and MD5?",
        "answer": "MD5 produces a 128-bit hash that is fast but cryptographically broken against malicious collisions. SHA-256 produces a 256-bit hash with zero known collisions, making it the universal standard for software security."
      },
      {
        "question": "What should I do if the hash does not match?",
        "answer": "A checksum mismatch indicates that the downloaded file is corrupted or modified. Do not execute the file or write it to bootable drives. Re-download the file directly from the vendor’s official mirror."
      }
    ]
  },
  "cidr-subnet-calculator": {
    "heading": "CIDR & Subnet Calculator",
    "subheading": "Calculate network boundaries, broadcast addresses, usable host ranges, and binary bit masks for any IPv4 or IPv6 CIDR prefix.",
    "faqs": [
      {
        "question": "What does CIDR notation mean in computer networking?",
        "answer": "CIDR stands for Classless Inter-Domain Routing. The number after the slash (e.g., /24) represents the number of leading binary 1-bits in the subnet mask, determining how many bits identify the network versus individual hosts."
      },
      {
        "question": "Why are there only 254 usable hosts in a /24 subnet?",
        "answer": "A /24 subnet contains 256 total IP addresses (2^8). However, the very first address (.0) is reserved as the network wire address and the last address (.255) is reserved as the broadcast address, leaving 254 usable hosts."
      },
      {
        "question": "What is a wildcard mask and where is it used?",
        "answer": "A wildcard mask is the inverted representation of a subnet mask where 0-bits indicate matching bits and 1-bits indicate \"don\\"
      },
      {
        "question": "How do IPv6 prefixes differ from IPv4 subnets?",
        "answer": "IPv6 uses 128-bit addresses instead of 32-bit. The standard end-user LAN prefix in IPv6 is /64, which contains 18 quintillion addresses per single subnet, eliminating the need for private address NAT."
      }
    ]
  },
  "bootable-usb-chooser": {
    "heading": "Bootable USB Chooser",
    "subheading": "A neutral decision wizard that recommends the optimal, verified bootable USB creation tool and exact step-by-step instructions for your specific OS and hardware setup.",
    "faqs": [
      {
        "question": "What is the main difference between Rufus and Ventoy?",
        "answer": "Rufus formats the entire USB drive and writes a single operating system installer directly to the partition table. Ventoy formats the drive once with a boot engine, allowing you to simply copy and paste multiple ISO files onto the drive like regular files."
      },
      {
        "question": "Can I make a bootable Windows 11 USB on a Mac?",
        "answer": "Yes, but it requires specialized tools like UTM/virtual machines or command-line wimlib-imagex split commands because the Windows 11 install.wim file exceeds the 4 GB file size limit of standard FAT32 partitions."
      },
      {
        "question": "What does \"persistence\" mean on a live Linux USB?",
        "answer": "Standard live USB sessions run entirely in RAM; all downloaded files and settings vanish when you turn off the computer. A persistent USB dedicates storage space to save changes across reboots."
      },
      {
        "question": "Will creating a bootable USB erase my flash drive?",
        "answer": "Yes. Flashing an image or initializing Ventoy/Rufus overwrites the drive partition table and deletes all files. Always back up important files from the flash drive first."
      }
    ]
  },
  "drive-speed-requirement-calculator": {
    "heading": "Drive Speed Requirement Calculator",
    "subheading": "Calculate the exact disk throughput (MB/s) and storage consumption required for smooth, drop-free playback in DaVinci Resolve, Premiere Pro, and Final Cut Pro.",
    "faqs": [
      {
        "question": "What is the difference between Mbps and MB/s?",
        "answer": "Mbps stands for Megabits per second (used by camera manufacturers to measure bitrates), while MB/s stands for Megabytes per second (used by drive makers and operating systems to measure disk speed). There are 8 bits in 1 Byte, so 800 Mbps equals 100 MB/s."
      },
      {
        "question": "Why does my drive drop frames even though its benchmark speed is higher?",
        "answer": "Synthetic benchmarks measure peak sequential bursts. Video editing involves random timeline seeking, multiple audio streams, and thermal throttling over long sessions. Maintaining 25–30% headroom prevents frame drops."
      },
      {
        "question": "Can I edit 4K ProRes directly off an external mechanical hard drive?",
        "answer": "A standard mechanical 7200 RPM external hard drive peaks around 120–140 MB/s under ideal conditions. While it can barely play a single 4K 24fps ProRes 422 stream (~63 MB/s), any scrubbing or multi-track work will cause stutter. An SSD is strongly recommended."
      },
      {
        "question": "Does H.264/H.265 require faster drives than ProRes?",
        "answer": "No. H.264 and H.265 require significantly less drive speed (often under 20 MB/s), but they place massive decompression strain on your computer CPU and GPU, causing playback stutter due to processor bottlenecks rather than drive bandwidth."
      }
    ]
  },
  "drive-health-reader": {
    "heading": "Drive Health Reader (S.M.A.R.T.)",
    "subheading": "Interpret raw S.M.A.R.T. telemetry attributes from CrystalDiskInfo, smartctl, or DriveDx. Get plain-language failure risk analysis and immediate action guidance.",
    "faqs": [
      {
        "question": "What is S.M.A.R.T. in storage drives?",
        "answer": "S.M.A.R.T. stands for Self-Monitoring, Analysis, and Reporting Technology. It is an internal diagnostic system built into almost all modern HDDs and SSDs that monitors reliability indicators like read errors, temperature, and flash memory wear."
      },
      {
        "question": "What does \"Reallocated Sector Count\" mean?",
        "answer": "When a hard drive or SSD encounters a read/write error on a physical sector, it marks that sector as damaged and maps future reads and writes to a spare reserve block. A high count means the drive is running out of spare blocks."
      },
      {
        "question": "Can a drive with 100% health still fail suddenly?",
        "answer": "Yes. S.M.A.R.T. can only predict gradual physical degradation (platter wear, bad sectors, flash cell exhaustion). Sudden failures caused by power supply spikes, physical drops, or controller chip burnout can happen without warning."
      },
      {
        "question": "What happens when an NVMe SSD reaches 100% \"Percentage Used\"?",
        "answer": "Reaching 100% does not mean the SSD will instantly lock up. It means you have written the maximum Terabytes Written (TBW) guaranteed under the manufacturer warranty. Most quality flash memory can continue writing past this rating, but failure risk increases."
      }
    ]
  },
  "mac-windows-shortcut-translator": {
    "heading": "Mac & Windows Shortcut Translator",
    "subheading": "A searchable, cross-platform reference table of 80+ essential keyboard shortcuts mapping macOS to Windows and Windows to macOS. Filter by everyday workflows, browser tabs, text editing, and file operations.",
    "faqs": [
      {
        "question": "Why does Ctrl+C not copy on a Mac?",
        "answer": "On macOS, the Command key (⌘) handles graphical desktop actions (⌘+C copies, ⌘+V pastes, ⌘+S saves). The Control key (⌃) is retained for terminal signals (like ⌃+C to cancel a running shell command)."
      },
      {
        "question": "Can I swap the Command and Control keys on Mac to feel like Windows?",
        "answer": "Yes. In macOS System Settings > Keyboard > Keyboard Shortcuts > Modifier Keys, you can remap the Control key to act as Command, or remap a standard Windows keyboard plugged into a Mac."
      },
      {
        "question": "How do I take a partial screenshot on Windows like Mac’s Shift+Cmd+4?",
        "answer": "On Windows 10 and 11, press Windows + Shift + S. This opens the Snipping Tool overlay, allowing you to drag a box and copy the image directly to your clipboard."
      },
      {
        "question": "What is the Windows equivalent of Mac’s Quick Look (Spacebar preview)?",
        "answer": "Windows does not include native Spacebar file preview, but Microsoft’s free open-source PowerToys suite includes \"Peek\", which activates instant file previews with Ctrl + Space."
      }
    ]
  },
  "batch-qr-code-generator": {
    "heading": "Free QR Code Generator (No Sign-Up or Expiry)",
    "subheading": "Create static QR codes that never expire and work offline in your browser. Download crisp PNGs or vector SVGs with custom colors, Wi-Fi login presets, vCard contacts, or up to 50 links at once.",
    "extraHtml": `<section style="margin-bottom: 2.5rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
      <div style="background: #0a1424; border: 1px solid rgba(143,163,192,0.18); border-radius: 0.75rem; padding: 1.25rem;">
        <h2 style="font-size: 1.1rem; font-weight: 700; color: #f2f7ff; margin: 0 0 0.5rem;">Static vs. Dynamic QR Codes</h2>
        <p style="color: #8fa3c0; font-size: 0.9rem; line-height: 1.6; margin: 0 0 0.5rem;"><strong style="color: #f2f7ff;">Static QR codes</strong> (what this tool creates) store your real link, Wi-Fi login, or contact card directly inside the black-and-white squares. Because there is no middleman server, static codes <strong style="color: #f2f7ff;">never expire</strong> and keep working forever as long as your webpage exists.</p>
        <p style="color: #8fa3c0; font-size: 0.9rem; line-height: 1.6; margin: 0;"><strong style="color: #f2f7ff;">Dynamic QR codes</strong> point to a short redirect link owned by a third-party service. That lets you change the destination URL later or count scans, but if you stop paying that company’s monthly fee, the redirect stops working and your printed QR codes break.</p>
      </div>
      <div style="background: #0a1424; border: 1px solid rgba(143,163,192,0.18); border-radius: 0.75rem; padding: 1.25rem;">
        <h2 style="font-size: 1.1rem; font-weight: 700; color: #f2f7ff; margin: 0 0 0.5rem;">Error Correction Levels (L, M, Q, H)</h2>
        <p style="color: #8fa3c0; font-size: 0.9rem; line-height: 1.6; margin: 0 0 0.5rem;">Error correction adds backup data to the pattern so a phone camera can still read the code if part of it gets scratched, dirty, or smudged:</p>
        <ul style="color: #8fa3c0; font-size: 0.88rem; line-height: 1.5; margin: 0; padding-left: 1.1rem;">
          <li><strong style="color: #f2f7ff;">Level L (~7% backup):</strong> Smallest, least dense grid. Good for long URLs on clean digital screens.</li>
          <li><strong style="color: #f2f7ff;">Level M (~15% backup):</strong> Best everyday choice for business cards, flyers, and general use.</li>
          <li><strong style="color: #f2f7ff;">Level Q (~25% backup):</strong> Great for restaurant menus, product labels, and outdoor stickers.</li>
          <li><strong style="color: #f2f7ff;">Level H (~30% backup):</strong> Maximum durability for industrial tags or surfaces that get scuffed.</li>
        </ul>
      </div>
      <div style="background: #0a1424; border: 1px solid rgba(143,163,192,0.18); border-radius: 0.75rem; padding: 1.25rem;">
        <h2 style="font-size: 1.1rem; font-weight: 700; color: #f2f7ff; margin: 0 0 0.5rem;">Best Size for Printing QR Codes</h2>
        <p style="color: #8fa3c0; font-size: 0.9rem; line-height: 1.6; margin: 0 0 0.5rem;">For close-up items like business cards, product boxes, and table tents, print your QR code at least <strong style="color: #f2f7ff;">2 cm × 2 cm (0.8 in × 0.8 in)</strong>. Anything smaller can be hard for older phone cameras to focus on.</p>
        <p style="color: #8fa3c0; font-size: 0.9rem; line-height: 1.6; margin: 0;">For posters and signs scanned from further away, follow the <strong style="color: #f2f7ff;">10:1 distance rule</strong>: divide the scanning distance by 10. If people stand 2 meters (80 inches) away, make the printed code at least 20 cm (8 inches) wide. Use the <strong style="color: #f2f7ff;">SVG download</strong> or <strong style="color: #f2f7ff;">1024 px PNG</strong> so edges stay crisp in print.</p>
      </div>
      <div style="background: #0a1424; border: 1px solid rgba(143,163,192,0.18); border-radius: 0.75rem; padding: 1.25rem;">
        <h2 style="font-size: 1.1rem; font-weight: 700; color: #f2f7ff; margin: 0 0 0.5rem;">How to Check That a QR Code Is Safe</h2>
        <ul style="color: #8fa3c0; font-size: 0.88rem; line-height: 1.5; margin: 0; padding-left: 1.1rem;">
          <li><strong style="color: #f2f7ff;">Read the preview URL before tapping:</strong> Modern iPhone and Android cameras show the domain name on screen before opening the browser. Check for misspelled domains or strange URL shorteners.</li>
          <li><strong style="color: #f2f7ff;">Check physical stickers in public:</strong> On parking meters or cafe tables, run your finger over the code to make sure someone has not pasted a fake sticker over the original sign.</li>
          <li><strong style="color: #f2f7ff;">Never enter login passwords after an unexpected scan:</strong> If a public QR code asks for your email password or banking login, close the tab immediately.</li>
        </ul>
      </div>
    </section>`,
    "faqs": [
      {
        "question": "Do these QR codes ever expire or have scan limits?",
        "answer": "No. This tool creates static QR codes that encode your text or URL directly into the image pattern. There are no redirect servers, no scan limits, and the codes never expire."
      },
      {
        "question": "Does this QR code generator work offline in the browser?",
        "answer": "Yes. All QR code generation happens locally inside your web browser using JavaScript. Once the page is open, you can disconnect from the internet and generate PNG, SVG, Wi-Fi, or vCard codes privately."
      },
      {
        "question": "Should I download PNG or SVG for printing?",
        "answer": "Choose SVG if you are placing the QR code into design software or printing large signs, because vector SVG files scale to any size without losing sharpness. Choose 1024 px PNG if you are dropping the image into Word, Google Docs, or email."
      },
      {
        "question": "How do I make sure a custom-colored QR code still scans reliably?",
        "answer": "Always keep the foreground dots noticeably darker than the background color, leave the outer margin (quiet zone) clear, and choose Error Correction Level M or Q for printed materials."
      }
    ]
  },
  "android-automation-generator": {
    "heading": "Android Automation Recipe Generator",
    "subheading": "Generate clear, numbered automation recipes for MacroDroid and Tasker. Includes exact triggers, sequential actions, logic constraints, and required Android system permissions.",
    "faqs": [
      {
        "question": "What is the difference between MacroDroid and Tasker?",
        "answer": "MacroDroid uses a simple, user-friendly 3-column architecture (Trigger, Action, Constraint) with pre-built templates. Tasker separates triggers into \"Profiles\" and actions into \"Tasks\", offering deep variable arrays and JavaScript execution for advanced power users."
      },
      {
        "question": "Do these automations require rooting my phone?",
        "answer": "No. The overwhelming majority of modern automations (volume, Wi-Fi triggers, Bluetooth, notifications, app launching) run purely using standard Android accessibility and notification listener permissions without root."
      },
      {
        "question": "Why does my automation not trigger when the screen is locked?",
        "answer": "Android battery management (Doze Mode) puts inactive apps to sleep. Ensure your automation app is set to \"Unrestricted\" under Battery usage and exempt from background power saving."
      },
      {
        "question": "Can I automate sending WhatsApp or SMS messages?",
        "answer": "Yes, but sending messages without manual user confirmation requires Accessibility permissions or notification interaction plugins depending on your Android version."
      }
    ]
  },
  "autohotkey-script-generator": {
    "heading": "AutoHotkey Script Generator (v2)",
    "subheading": "Generate modern AutoHotkey v2 (.ahk) automation scripts for hotkeys, text expansion, and system shortcuts with line-by-line technical explanations and setup instructions.",
    "faqs": [
      {
        "question": "What is the difference between AutoHotkey v1 and v2?",
        "answer": "AutoHotkey v1 used legacy command syntax with inconsistent quoting and percent-sign rules. AutoHotkey v2 is a complete rewrite featuring a modern, fully expression-based syntax with proper functions, objects, and clear error messages."
      },
      {
        "question": "Can AutoHotkey damage my computer or steal data?",
        "answer": "Standard hotkeys and text expansion scripts are completely benign. However, because scripts can simulate keystrokes, you should always review code before executing it. Our generator strictly refuses keylogger or surveillance requests."
      },
      {
        "question": "How do I make my AHK script start automatically with Windows?",
        "answer": "Press Windows + R, type \"shell:startup\", and press Enter. Paste a shortcut to your `.ahk` file into this Startup folder. Windows will automatically launch it every time you log in."
      },
      {
        "question": "Will anti-cheat software in PC games flag AutoHotkey?",
        "answer": "Some competitive games with kernel-level anti-cheat (such as Riot Vanguard or Easy Anti-Cheat) block or monitor active AutoHotkey processes to prevent automated recoil scripts. Suspend or close AHK before launching competitive games."
      }
    ]
  },
  "adb-fastboot-command-builder": {
    "heading": "ADB & Fastboot Command Builder",
    "subheading": "Generate exact Android Debug Bridge (ADB) and Fastboot terminal sequences for app management, wireless pairing, screenshots, and device diagnostics with verified risk classifications.",
    "faqs": [
      {
        "question": "Where do I download official ADB and Fastboot binaries?",
        "answer": "Download the official Android SDK Platform-Tools package directly from Google at developer.android.com/tools/releases/platform-tools. Avoid third-party installer repackages."
      },
      {
        "question": "Why does \"adb devices\" say \"unauthorized\"?",
        "answer": "Your phone has not yet accepted your computer’s cryptographic RSA key fingerprint. Unlock your phone screen, look for the \"Allow USB debugging?\" pop-up dialog, check \"Always allow\", and tap Allow."
      },
      {
        "question": "Does uninstalling an app via ADB void my phone warranty?",
        "answer": "No. Using \"pm uninstall --user 0\" only disables and uninstalls the app for the primary user. It does not unlock the bootloader, trip Knox/SafetyNet, or modify the read-only system partition."
      },
      {
        "question": "Can these commands bypass carrier locks or FRP Google locks?",
        "answer": "No. This tool strictly adheres to standard developer and administration workflows. We do not provide or support factory reset protection (FRP) bypasses, bootloader unlock bypasses, or carrier lock circumvention."
      }
    ]
  },
  "command-explainer": {
    "heading": "Command Explainer",
    "subheading": "Paste any bash, zsh, terminal, or PowerShell command to see what it does in plain words, a breakdown of every flag and parameter, its risk rating, and a safer alternative.",
    "faqs": [
      {
        "question": "Does this tool ever run my command on a server?",
        "answer": "No. This tool strictly analyzes the text string using natural language parsing and syntax tokenization. It has no terminal access, shell environment, or container runner. It is completely impossible for any pasted command to execute."
      },
      {
        "question": "What makes a command rated \"Dangerous\"?",
        "answer": "Commands receive a Dangerous rating when they perform irreversible actions such as formatting partitions (mkfs, format), deleting root or system directories (rm -rf /), wiping raw block devices (dd), altering partition tables, or executing arbitrary unverified scripts directly from the internet."
      },
      {
        "question": "Can this tool explain multi-line or piped commands?",
        "answer": "Yes. You can paste piped commands (using |, &&, or ||), redirects (>, >>), and sub-shells up to 1,000 characters. Each component and pipe stage is identified in the part-by-part breakdown."
      },
      {
        "question": "Why do flags have different meanings across Linux and macOS?",
        "answer": "macOS uses BSD utilities by default, whereas most Linux distributions use GNU coreutils. Flags like `sed -i` or `date` have different syntax rules between BSD and GNU. Select macOS or Linux in the environment selector for environment-specific guidance."
      }
    ]
  },
  "battery-wear-calculator": {
    "heading": "Battery Wear Calculator",
    "subheading": "Calculate battery degradation, remaining health percentage, and lost capacity for laptops and phones from your system’s reported design and full-charge values.",
    "faqs": [
      {
        "question": "What is the difference between design capacity and full-charge capacity?",
        "answer": "Design capacity is the theoretical maximum energy storage specified by the manufacturer when the battery was produced. Full-charge capacity is the actual amount of energy the chemically aged cells can store today when charged to 100%."
      },
      {
        "question": "At what battery health percentage should I replace my battery?",
        "answer": "Most laptop and phone manufacturers (including Apple, Dell, and HP) consider 80% remaining capacity the threshold for battery replacement or warranty service. Below 80%, battery life is noticeably shortened and internal resistance increases."
      },
      {
        "question": "Why do mWh values differ from Wh and mAh?",
        "answer": "Wh (Watt-hours) measures total energy. 1 Wh equals 1,000 mWh. mAh (Milliamp-hours) measures electric charge over time. To convert mAh to Wh, multiply mAh by nominal battery voltage (typically 3.7V–3.85V for phones or 11.4V–15.4V for laptops) and divide by 1,000."
      },
      {
        "question": "Why does my full-charge capacity fluctuate between days?",
        "answer": "Battery fuel gauges measure voltage and coulomb counts, which shift with temperature and recent charging patterns. A cold room or a shallow charge session can temporarily lower the reported full-charge capacity by a few percent."
      }
    ]
  },
  "cron-expression-generator": {
    "heading": "Cron Expression Generator &amp; Explainer",
    "subheading": "",
    "faqs": [
      {
        "question": "What is the standard order of fields in a Linux crontab?",
        "answer": "A standard POSIX crontab uses 5 fields separated by spaces: Minute (0-59), Hour (0-23), Day of Month (1-31), Month (1-12), and Day of Week (0-7, where both 0 and 7 represent Sunday)."
      },
      {
        "question": "How does step syntax like */15 work in cron?",
        "answer": "A slash denotes step values. For example, */15 in the minute field runs at minutes 0, 15, 30, and 45. In the hour field, */3 triggers every 3 hours starting from midnight."
      },
      {
        "question": "Does this cron generator run on the server or in my browser?",
        "answer": "This utility runs 100% locally in your web browser. No schedules, server commands, or credentials ever leave your physical device."
      },
      {
        "question": "How do I add this generated expression to my server?",
        "answer": "Open your terminal and type `crontab -e`. Paste the expression followed by your command path (e.g. `0 9 * * 1-5 /usr/bin/python3 /scripts/backup.py >> /var/log/backup.log 2>&1`), then save and exit."
      }
    ]
  },
  "regex-tester-explainer": {
    "heading": "Regex Pattern Tester &amp; Explainer",
    "subheading": "",
    "faqs": [
      {
        "question": "What do the regex flags g, i, and m mean?",
        "answer": "The `g` flag (global) matches all occurrences rather than stopping after the first match. The `i` flag (ignore case) matches letters regardless of uppercase or lowercase. The `m` flag (multiline) causes `^` and `$` to match the start and end of every individual line instead of only the full document."
      },
      {
        "question": "Does this regular expression tester send my text to any server?",
        "answer": "No. All evaluation runs inside your local browser JavaScript engine using the standard native RegExp object. Zero bytes leave your machine."
      },
      {
        "question": "Why did my regex match zero results?",
        "answer": "Check for unescaped special characters like `.` (matches any character unless escaped as `\\\\.`), `/`, `(`, or `[`. Also check whether letter casing matters if the `i` flag is omitted."
      }
    ]
  },
  "markdown-to-html-converter": {
    "heading": "$1",
    "subheading": "",
    "faqs": [
      {
        "question": "Does this converter preserve clean semantic HTML tags?",
        "answer": "Yes. It produces pure, standard HTML5 markup (`<h1>`, `<h2>`, `<p>`, `<code>`, `<pre>`, `<ul>`, `<li>`, `<blockquote>`) with zero proprietary inline styling or vendor bloat."
      },
      {
        "question": "Can I paste this HTML directly into WordPress, Webflow, or Notion?",
        "answer": "Yes. The output is clean, standard HTML code ready to be pasted into CMS code blocks, email templates, or static web pages."
      },
      {
        "question": "Is my Markdown document stored on any server?",
        "answer": "No. The conversion is calculated 100% on-device in your browser using JavaScript string transformations."
      }
    ]
  },
  "css-box-shadow-generator": {
    "heading": "CSS Box Shadow &amp; Glow Generator",
    "subheading": "",
    "faqs": [
      {
        "question": "What is the difference between blur and spread in CSS box-shadow?",
        "answer": "The blur radius (3rd value) determines the softness and distance of the Gaussian blur edge. The spread radius (4th value) expands or contracts the physical surface area of the shadow before blur is applied; negative spread pulls the shadow inward."
      },
      {
        "question": "How do I create a modern obsidian dark mode glow?",
        "answer": "Set offsetX and offsetY to 0, use a bright accent color like neon green (`#39ff88`) or electric blue (`#0a84ff`), set blur to 25px–40px, and keep opacity around 0.25–0.35."
      },
      {
        "question": "Does box-shadow trigger layout recalculations in modern browsers?",
        "answer": "No. Box shadow changes only trigger paint and composite passes on GPU layers, making CSS shadows smooth when paired with CSS transitions."
      }
    ]
  },
  "json-yaml-converter": {
    "heading": "JSON to YAML &amp; YAML to JSON Converter",
    "subheading": "",
    "faqs": [
      {
        "question": "Why convert between JSON and YAML?",
        "answer": "JSON is the standard format for web APIs and application data. YAML (YAML Ain\\"
      },
      {
        "question": "Does this converter validate syntax errors?",
        "answer": "Yes. If your JSON contains trailing commas or unquoted keys, the parser catches and reports the exact parse exception immediately."
      },
      {
        "question": "Are any server calls made with my data?",
        "answer": "Zero. All serialization and formatting run entirely in your local browser sandbox."
      }
    ]
  },
  "base64-file-converter": {
    "heading": "Base64 Encoder &amp; Decoder (Text &amp; Files)",
    "subheading": "",
    "faqs": [
      {
        "question": "What is Base64 encoding used for?",
        "answer": "Base64 represents binary data (such as images, icons, or encryption keys) using an ASCII character set of 64 printable characters. It is commonly used for inline CSS images, data URIs, and email attachments."
      },
      {
        "question": "Does Base64 provide encryption or security?",
        "answer": "No. Base64 is an encoding format, not an encryption algorithm. Anyone can instantly decode Base64 back into plaintext or raw binary."
      },
      {
        "question": "Are uploaded files sent to your server?",
        "answer": "No. The file reader executes strictly inside your browser through the HTML5 FileReader API. Your files remain entirely on your local machine."
      }
    ]
  },
  "url-encoder-decoder": {
    "heading": "URL Encoder &amp; Decoder",
    "subheading": "",
    "faqs": [
      {
        "question": "What is the difference between encodeURI and encodeURIComponent?",
        "answer": "`encodeURI` is intended for complete URLs and preserves protocol separators like `://`, `?`, and `&`. `encodeURIComponent` encodes all special characters including `/`, `?`, and `&`, making it safe to embed arbitrary values inside URL query strings."
      },
      {
        "question": "Why are spaces sometimes encoded as %20 and other times as +?",
        "answer": "Both represent spaces. `%20` is the standard percent-encoding defined in RFC 3986. The `+` symbol is a historical legacy format used specifically in application/x-www-form-urlencoded form post submissions."
      },
      {
        "question": "Does this tool transmit my links or query tokens anywhere?",
        "answer": "No. All URL parsing and encoding operations happen in memory on your local machine using standard JavaScript URL APIs."
      }
    ]
  },
  "lorem-ipsum-generator": {
    "heading": "Realistic Placeholder Text Generator",
    "subheading": "",
    "faqs": [
      {
        "question": "Why use realistic placeholder text instead of standard Latin Lorem Ipsum?",
        "answer": "Latin text often gives an inaccurate impression of line wraps, character densities, and visual rhythm because English has different word lengths and capitalization patterns. Realistic tech and product text provides high-fidelity UI mockups for stakeholders."
      },
      {
        "question": "Can I generate custom word counts for design mockups?",
        "answer": "Yes. Switch the generation unit to \"words\" or \"sentences\" to fit tight UI boundaries like button labels, card descriptions, or hero taglines."
      },
      {
        "question": "Is this tool free of copyright restrictions?",
        "answer": "Yes. All generated copy is open for free personal and commercial use in UI mockups, client wireframes, and prototypes."
      }
    ]
  },
  "password-entropy-generator": {
    "heading": "Cryptographic Password &amp; Entropy Generator",
    "subheading": "",
    "faqs": [
      {
        "question": "How does window.crypto.getRandomValues ensure security?",
        "answer": "Unlike Math.random() which uses pseudo-random algorithms, `crypto.getRandomValues()` accesses the operating system cryptographically secure pseudorandom number generator (CSPRNG), which draws from hardware entropy like thermal noise and interrupt timings."
      },
      {
        "question": "What is a good Shannon entropy score for passwords?",
        "answer": "A minimum of 60 bits of entropy is recommended for standard user accounts. For master passwords and cryptocurrency keys, 80 to 128 bits of entropy is the international cryptographic gold standard."
      },
      {
        "question": "Is my password sent over the network to any server?",
        "answer": "Never. The entire key is generated locally in your web browser RAM and is discarded when you leave the page."
      }
    ]
  },
  "mac-address-formatter": {
    "heading": "MAC Address Formatter &amp; Vendor Lookup",
    "subheading": "",
    "faqs": [
      {
        "question": "Why are there multiple different MAC address formats?",
        "answer": "Different operating systems and network hardware vendors standardize on different delimiters. Windows primarily displays hyphens (`00-1A-2B-3C-4D-5E`), Linux and macOS use colons (`00:1A:2B:3C:4D:5E`), and Cisco switches require three groups of four dots (`001a.2b3c.4d5e`)."
      },
      {
        "question": "What is an OUI (Organizationally Unique Identifier)?",
        "answer": "The first 3 octets (24 bits) of a MAC address form the OUI, assigned to hardware manufacturers by the IEEE to ensure network adapter addresses are globally unique across manufacturers."
      },
      {
        "question": "What does a Locally Administered Address (LAA) mean?",
        "answer": "If bit 1 of the first octet is set, the MAC address has been randomized or manually configured (common in modern iOS and Android \"Private Wi-Fi Address\" security features)."
      }
    ]
  }
};
