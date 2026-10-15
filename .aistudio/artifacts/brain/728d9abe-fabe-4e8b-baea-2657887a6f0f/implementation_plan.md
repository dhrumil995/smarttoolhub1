# SmartToolHub (smarttoolhub.net)

SmartToolHub is a fast, dark-first, mobile-first hub of free everyday AI tools providing instant utility with zero sign-up and rapid sub-30-second results. Built strictly in phased increments, starting with Phase 1: design tokens, global layout, top navigation, bottom tab bar, and footer.

> [!IMPORTANT]
> **User Review & Confirmed Architectural Decisions**
> - **Execution Mode**: Proceed step-by-step starting strictly with Phase 1 (Setup, Design Tokens, Global Layout, Navigation & Bottom Tab Bar, and Footer). Stop after Phase 1 and wait for user's "next".
> - **AI Engine**: Backend generation endpoints configured in `server.ts` utilizing Gemini API (`gemini-2.5-pro` with resilient fallback) with keys secured server-side.
> - **Routing**: Lightweight browser history router matching exact clean URLs (`/`, `/tools`, `/tools/[tool-slug]`, `/guides`, `/about`, etc.) without heavy routing dependencies.
> - **Visual Discipline**: Laser Green (`#39ff88`) accent on Navy Black (`#050a14`), Plus Jakarta Sans 800 display, Geist Mono labels, zero-pill metadata, 15% sticky cap, and mobile thumb-zone layout.

---

### 1. Overview & Core Concept
- **Product Promise**: *"Free AI tools that just work. No sign-up. Results in seconds."*
- **Audience & Context**: Mobile-first users arriving directly from Google searches or home-screen shortcuts to accomplish specific tasks (Apple Shortcut creation, prompt enhancement, formulas, email drafting, summarizing) in under 30 seconds.
- **Copy & Tone**: Friendly, clear, confident. 7th-grade reading level, short sentences, addressing the user directly as "you/your", with zero hype or synthetic ratings.

---

### 2. User Experience & Visual Design
- **Color Tokens**:
  - `--bg`: `#050a14` (Page canvas)
  - `--bg-2`: `#0a1424` (Raised surfaces)
  - `--bg-3`: `#101c33` (Cards and modals)
  - `--laser`: `#39ff88` (Primary brand accent, key numbers, active tab indicator)
  - `--laser-dim`: `#1fbf62` (Hover state)
  - `--laser-glow`: `rgba(57, 255, 136, 0.35)`
  - `--ink`: `#f2f7ff` (Primary text, WCAG AA compliant)
  - `--mute`: `#8fa3c0` (Secondary text and metadata)
  - `--line`: `rgba(143, 163, 192, 0.16)` (Hairline dividers and borders)
  - Status tokens: `--info: #5aa9ff`, `--warn: #ffb840`, `--error: #ff5c7a`
- **Typography & Font Pairing**:
  - **Display / Headers**: *Plus Jakarta Sans* 800 (tight `-0.045em` tracking, fluid `clamp()` sizing, balance wrapping to avoid orphan words).
  - **Body**: *Plus Jakarta Sans* 400–600 (minimum 16px to prevent iOS auto-zoom).
  - **Monospace Metadata**: *Geist Mono* 12–13px uppercase for step numbers, tags, units, and timestamps.
- **Surface Elevation & Glassmorphism**:
  - Translucent navy backgrounds with `backdrop-blur: 18px`, 1px subtle hairline border, `20px` to `28px` corner radius, inner top highlight, and soft elevation shadow.
  - Hover lift and subtle tilt restricted to desktop `@media (hover: hover)` devices only; clean flat tactile press (`scale(0.97)`) on touch devices.
- **Top Bar Contract**:
  - Strict 3-zone layout: Single-line brand mark `SmartToolHub` $\leftrightarrow$ 4–5 single-line nav links (`Tools`, `Guides`, `About`, `Pricing`) $\leftrightarrow$ 1 primary action button (`Pro`).
  - Mobile header features compact brand mark, instant search trigger, and full-height glass sheet menu trigger.
- **Bottom Tab Bar (Mobile)**:
  - 56px fixed tab bar above device safe-area (`env(safe-area-inset-bottom)`) with 5 thumb-friendly items: `Home`, `Tools`, `Search`, `Saved`, and `More`.
  - Minimum 44px tap targets; active tab highlighted with Laser Green accent dot and color.
  - Total sticky surface strictly adheres to the $\le 15\%$ viewport cap.
- **Footer**:
  - Semantic footer with sitemap links, privacy/terms anchors, and required independent disclosure: *"SmartToolHub is independent and not affiliated with Apple or Google."*

---

### 3. Key Product Decisions & Trade-Offs
- **Step-by-Step Phased Execution**:
  - *Chosen Approach*: Deliver strictly Phase 1 first (Tokens, Typography, Global Shell, Top Bar, Bottom Bar, Search Drawer, Mobile Sheet, and Footer). Stop immediately after compilation and await user's "next".
  - *Why*: Direct compliance with user constraint ("Build it step by step in the phases below. After each phase, stop, list the files created, and wait for me to say 'next'").
- **Lightweight Browser History Router**:
  - *Chosen Approach*: Lightweight pushState/popstate router with custom hook (`useLocation`, `navigate`) supporting exact paths (`/`, `/tools`, `/tools/:slug`, `/saved`, etc.).
  - *Why*: Eliminates bundle bloat, ensures lightning-fast LCP (< 2.0s), and guarantees 100% pre-rendering and clean URL compatibility.
- **Server-Side AI API Proxy**:
  - *Chosen Approach*: Dedicated Express backend (`server.ts`) consuming `@google/genai` with `process.env.GEMINI_API_KEY`, input length capping, IP rate limiting, and client-safe error messages.
  - *Why*: Never leaks credentials to the browser and maintains high reliability.

---

### 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                       Client Viewport                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Top Bar: Brand Wordmark | Nav Links | Search | Pro    │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Scroll Progress Bar (Laser Green Hairline)            │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Page Content Outlet (<main id="main-content">)        │  │
│  │ - Phase 1: Preview Showcase & Token Verification      │  │
│  │ - Phase 2+: Home, Tools Hub, Tool Views, Guides       │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Mobile Bottom Tab Bar (Home | Tools | Search | Saved) │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Footer with Independent Apple / Google Disclaimer     │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────────────┬──────────────────────────────┘
                               │ Fetch /api/*
                               ▼
┌─────────────────────────────────────────────────────────────┐
│              Express Server (server.ts)                     │
│  - Rate Limiting & Input Validation                         │
│  - @google/genai (gemini-2.5-pro / gemini-3.8-flash)        │
│  - Error Sanitization ("That didn't work. Try again...")    │
└─────────────────────────────────────────────────────────────┘
```

- **Phase 1 Component Breakdown**:
  - `src/types/navigation.ts`: Route definitions and tab bar state types.
  - `src/styles/theme.css` / `src/index.css`: Tailwind v4 configuration with CSS variables, fluid type clamps, and glassmorphic card classes.
  - `src/hooks/useRouter.ts`: Custom lightweight browser navigation hook for clean history and pushState.
  - `src/components/layout/Navbar.tsx`: Strict 3-zone top navigation with desktop links and mobile sheet toggle.
  - `src/components/layout/BottomTabBar.tsx`: Mobile 56px bottom dock with active states and safe-area padding.
  - `src/components/layout/SearchModal.tsx`: Instant quick-search overlay for finding tools and guides.
  - `src/components/layout/MobileMenuDrawer.tsx`: Full-height glass sheet navigation for mobile devices.
  - `src/components/layout/Footer.tsx`: Semantic footer with copyright and independent disclaimer.
  - `src/components/layout/ScrollProgress.tsx`: Thin Laser Green top reading indicator.
  - `src/App.tsx`: Layout shell assembling Navbar, Progress, Content container with skip link, BottomTabBar, and Footer.
