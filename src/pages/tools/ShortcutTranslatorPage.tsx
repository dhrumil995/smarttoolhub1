import React, { useState, useMemo } from 'react';
import { Keyboard, Search, Check, Copy, Laptop, Monitor, Filter, Info, Sparkles } from 'lucide-react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';
import { SHORTCUTS_DATA, KeyboardShortcut } from '../../data/shortcuts.ts';

interface ShortcutTranslatorPageProps {
  navigate: (path: string) => void;
}

export const ShortcutTranslatorPage: React.FC<ShortcutTranslatorPageProps> = ({ navigate }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [primaryOsView, setPrimaryOsView] = useState<'both' | 'mac-first' | 'win-first'>('both');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'mac-windows-shortcut-translator') || {
    id: 'mac-windows-shortcut-translator',
    name: 'Mac & Windows Shortcut Translator',
    slug: 'mac-windows-shortcut-translator',
    description: 'Search and translate over 80 essential keyboard shortcuts between macOS and Windows across browsers, text editing, file management, and system navigation.',
    category: 'Productivity',
    icon: 'Keyboard',
    type: 'client',
    keywords: ['mac windows shortcut translator', 'keyboard shortcuts mac to pc', 'convert mac shortcuts to windows', 'command key vs control key'],
    relatedToolSlugs: ['install-command-generator', 'bootable-usb-chooser'],
    isFlagship: false,
  };

  const relatedTools = LAUNCH_TOOLS.filter(
    (t) => t.slug === 'install-command-generator' || t.slug === 'bootable-usb-chooser' || t.slug === 'quick-calculators'
  );
  const relatedGuide = POPULAR_GUIDES[0];

  const categoryChips = ['All', 'Everyday', 'Browser', 'Text', 'Windows', 'Files'];

  // Filter shortcuts based on category and search query
  const filteredShortcuts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return SHORTCUTS_DATA.filter((item) => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      if (!matchesCategory) return false;
      if (!q) return true;

      return (
        item.action.toLowerCase().includes(q) ||
        item.mac.toLowerCase().includes(q) ||
        item.windows.toLowerCase().includes(q) ||
        (item.appSpecific && item.appSpecific.toLowerCase().includes(q)) ||
        (item.notes && item.notes.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, activeCategory]);

  const handleCopyShortcut = async (item: KeyboardShortcut) => {
    const copyText = `${item.action} — macOS: ${item.mac} | Windows: ${item.windows}`;
    try {
      await navigator.clipboard.writeText(copyText);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Handled
    }
  };

  const exampleChips = [
    'Take a screenshot / screen clipping',
    'Delete word backward and forward',
    'Cycle application windows',
  ];

  return (
    <ToolPageTemplate
      tool={tool}
      heading="Mac & Windows Shortcut Translator"
      subheading="A searchable, cross-platform reference table of 80+ essential keyboard shortcuts mapping macOS to Windows and Windows to macOS. Filter by everyday workflows, browser tabs, text editing, and file operations."
      inputLabel="Quick Search Action or Key"
      inputPlaceholder="e.g. screenshot, delete word, new tab, task manager, emoji..."
      examplePrompt="How do I take a partial screenshot on Windows compared to Mac?"
      exampleChips={exampleChips}
      lastUpdated="October 2026"
      navigate={navigate}
      onClientCompute={() => ({
        result: `Filtered Shortcuts (${filteredShortcuts.length} results):
${filteredShortcuts
  .slice(0, 15)
  .map((s) => `• ${s.action}\n   macOS: ${s.mac}\n   Windows: ${s.windows}`)
  .join('\n\n')}`,
      })}
      extraControls={
        <div className="space-y-6 pt-2">
          {/* Top Controls: Search Bar + OS Focus View */}
          <div className="p-4 sm:p-5 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search input with search icon */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#9aaccb] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 80+ shortcuts by action or keys (e.g., screenshot, find, rename)..."
                  className="w-full bg-[#050a14] border border-[rgba(143,163,192,0.18)] rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#f2f7ff] placeholder-[#9aaccb] focus-ring"
                />
              </div>

              {/* View layout switcher */}
              <div className="flex items-center gap-1.5 self-end sm:self-auto text-xs rounded-xl bg-[#050a14] p-1 border border-[rgba(143,163,192,0.16)]">
                <button
                  type="button"
                  onClick={() => setPrimaryOsView('both')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all focus-ring ${
                    primaryOsView === 'both'
                      ? 'bg-[#ffb840] text-[#050a14] font-bold shadow-sm'
                      : 'text-[#9aaccb] hover:text-[#f2f7ff]'
                  }`}
                >
                  Side by Side
                </button>
                <button
                  type="button"
                  onClick={() => setPrimaryOsView('mac-first')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all focus-ring ${
                    primaryOsView === 'mac-first'
                      ? 'bg-[#ffb840] text-[#050a14] font-bold shadow-sm'
                      : 'text-[#9aaccb] hover:text-[#f2f7ff]'
                  }`}
                >
                  Mac First
                </button>
                <button
                  type="button"
                  onClick={() => setPrimaryOsView('win-first')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all focus-ring ${
                    primaryOsView === 'win-first'
                      ? 'bg-[#ffb840] text-[#050a14] font-bold shadow-sm'
                      : 'text-[#9aaccb] hover:text-[#f2f7ff]'
                  }`}
                >
                  Win First
                </button>
              </div>
            </div>

            {/* Filter Category Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-[11px] font-mono uppercase text-[#9aaccb] font-semibold flex items-center gap-1 shrink-0 mr-1">
                <Filter className="w-3 h-3 text-[#ffb840]" />
                <span>Category:</span>
              </span>
              {categoryChips.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border focus-ring ${
                    activeCategory === cat
                      ? 'bg-[#ffb840] text-[#050a14] border-[#ffb840] font-bold shadow-sm'
                      : 'bg-[#050a14] text-[#9aaccb] border-[rgba(143,163,192,0.14)] hover:text-[#f2f7ff]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Modifier Key Cheat Sheet Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-3 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.14)]">
              <div className="font-mono text-[#ffb840] font-bold">⌘ Command &harr; Ctrl</div>
              <div className="text-[11px] text-[#9aaccb] mt-0.5">Primary action modifier for 90% of shortcuts</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.14)]">
              <div className="font-mono text-[#ffb840] font-bold">⌥ Option &harr; Alt</div>
              <div className="text-[11px] text-[#9aaccb] mt-0.5">Word jumping, special symbols, alternate menus</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.14)]">
              <div className="font-mono text-[#ffb840] font-bold">Delete &harr; Backspace</div>
              <div className="text-[11px] text-[#9aaccb] mt-0.5">Mac Delete removes backwards; Fn+Del forward</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.14)]">
              <div className="font-mono text-[#ffb840] font-bold">Return &harr; Enter / F2</div>
              <div className="text-[11px] text-[#9aaccb] mt-0.5">Return renames on Mac; Enter executes on PC</div>
            </div>
          </div>

          {/* Search Results Summary */}
          <div className="flex items-center justify-between text-xs px-1">
            <span className="font-mono text-[#9aaccb]">
              Showing {filteredShortcuts.length} of {SHORTCUTS_DATA.length} shortcuts
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[#ffb840] hover:underline focus-ring rounded"
              >
                Clear search filter
              </button>
            )}
          </div>

          {/* Shortcuts Table */}
          <div className="overflow-x-auto rounded-3xl border border-[rgba(143,163,192,0.16)] shadow-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#101c33] text-[#9aaccb] border-b border-[rgba(143,163,192,0.14)]">
                <tr>
                  <th className="p-3.5 sm:p-4 font-mono uppercase tracking-wider">Action / Command</th>
                  {(primaryOsView === 'both' || primaryOsView === 'mac-first') && (
                    <th className="p-3.5 sm:p-4 font-mono uppercase tracking-wider text-[#f2f7ff]">
                      <span className="inline-flex items-center gap-1.5">
                        <Laptop className="w-3.5 h-3.5 text-[#ffb840]" />
                        <span>macOS</span>
                      </span>
                    </th>
                  )}
                  {(primaryOsView === 'both' || primaryOsView === 'win-first') && (
                    <th className="p-3.5 sm:p-4 font-mono uppercase tracking-wider text-[#f2f7ff]">
                      <span className="inline-flex items-center gap-1.5">
                        <Monitor className="w-3.5 h-3.5 text-[#5aa9ff]" />
                        <span>Windows</span>
                      </span>
                    </th>
                  )}
                  <th className="p-3.5 sm:p-4 font-mono uppercase tracking-wider text-right">Copy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(143,163,192,0.08)] bg-[#0a1424]">
                {filteredShortcuts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-[#9aaccb]">
                      No shortcuts matching "{searchQuery}". Try searching for generic terms like "copy", "tab", "screenshot", or "close".
                    </td>
                  </tr>
                ) : (
                  filteredShortcuts.map((item) => (
                    <tr key={item.id} className="hover:bg-[#101c33]/60 transition-colors group">
                      {/* Action & Context Column */}
                      <td className="p-3.5 sm:p-4 align-top">
                        <div className="font-semibold text-[#f2f7ff] text-xs sm:text-sm">
                          {item.action}
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#050a14] text-[#9aaccb] border border-[rgba(143,163,192,0.12)]">
                            {item.category}
                          </span>
                          {item.appSpecific && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101c33] text-[#ffb840] border border-[rgba(255,184,64,0.2)]">
                              {item.appSpecific}
                            </span>
                          )}
                          {item.notes && (
                            <span className="text-[11px] text-[#9aaccb] hidden md:inline ml-1">
                              · {item.notes}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* macOS Column */}
                      {(primaryOsView === 'both' || primaryOsView === 'mac-first') && (
                        <td className="p-3.5 sm:p-4 align-top font-mono">
                          <kbd className="inline-block px-2.5 py-1 rounded-lg bg-[#050a14] border border-[rgba(255,184,64,0.35)] text-[#ffb840] font-bold text-xs shadow-sm">
                            {item.mac}
                          </kbd>
                        </td>
                      )}

                      {/* Windows Column */}
                      {(primaryOsView === 'both' || primaryOsView === 'win-first') && (
                        <td className="p-3.5 sm:p-4 align-top font-mono">
                          <kbd className="inline-block px-2.5 py-1 rounded-lg bg-[#050a14] border border-[rgba(10,132,255,0.35)] text-[#5aa9ff] font-bold text-xs shadow-sm">
                            {item.windows}
                          </kbd>
                        </td>
                      )}

                      {/* Copy Action Column */}
                      <td className="p-3.5 sm:p-4 align-top text-right">
                        <button
                          type="button"
                          onClick={() => handleCopyShortcut(item)}
                          title="Copy shortcut details"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#101c33] border border-[rgba(143,163,192,0.16)] text-[#9aaccb] hover:text-[#ffb840] hover:border-[#ffb840] transition-colors focus-ring"
                        >
                          {copiedId === item.id ? (
                            <Check className="w-3.5 h-3.5 text-[#34e0a1]" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      }
      whatItDoesContent={
        <>
          <p>
            Switching between macOS and Windows is notoriously frustrating because physical modifier keys perform different roles across both operating systems. On Mac, the Command key (<code>⌘</code>) handles almost all primary application actions (such as copying, saving, closing tabs, and opening preferences), while the Control key (<code>Ctrl</code>) is reserved for terminal control codes and legacy Unix shortcuts. On Windows, <code>Ctrl</code> is the universal workhorse, and the Windows key (<code>Win</code>) manages operating system shell functions like window snapping, task switching, and global search.
          </p>
          <p>
            This interactive translator provides an authoritative reference mapping over 80 verified keyboard combinations between macOS and Windows. Every shortcut is verified against official Apple Developer Human Interface Guidelines and Microsoft Windows Support documentation.
          </p>
        </>
      }
      howToUseSteps={[
        {
          step: 'Type what you want to do',
          text: 'Use the instant search box to type any action (such as "screenshot", "lock", "new folder", or "history").',
        },
        {
          step: 'Filter by daily workflow',
          text: 'Click category chips (Everyday, Browser, Text, Windows, or Files) to narrow your view to specific tasks.',
        },
        {
          step: 'Switch layout perspective',
          text: 'Toggle between "Side by Side", "Mac First", or "Win First" depending on which operating system you are migrating from.',
        },
      ]}
      workedExample={{
        title: 'Example: Text Editing and Word Navigation Differences',
        scenario: 'A user moving from Windows to Mac needs to know how to navigate and delete words without touching the mouse.',
        output: `Task: Move cursor word by word
- macOS: Option + Left/Right Arrow (⌥ + ← / →)
- Windows: Ctrl + Left/Right Arrow (Ctrl + ← / →)

Task: Delete entire word to the left
- macOS: Option + Delete (⌥ + Delete)
- Windows: Ctrl + Backspace

Task: Jump to beginning / end of line
- macOS: Command + Left/Right Arrow (⌘ + ← / →)
- Windows: Home / End keys`,
      }}
      tips={[
        'Remember the physical thumb position: On Apple keyboards, the Command key is physically adjacent to the spacebar, making ⌘+C and ⌘+V natural thumb-and-finger chords.',
        'Renaming files: Pressing Enter on Windows opens a file; pressing Return on Mac renames it. To open a file on Mac with the keyboard, press ⌘ + O or ⌘ + Down Arrow.',
        'Forward delete on Mac laptops: Mac notebook keyboards do not have a dedicated Delete key. Press Fn + Delete to forward-delete characters to the right of the cursor.',
        'App Preferences are universal on Mac: Pressing ⌘ + , (comma) opens Settings in 99% of Mac software, including Chrome, Spotify, Final Cut, and Slack.',
      ]}
      faq={[
        {
          question: 'Why does Ctrl+C not copy on a Mac?',
          answer: 'On macOS, the Command key (⌘) handles graphical desktop actions (⌘+C copies, ⌘+V pastes, ⌘+S saves). The Control key (⌃) is retained for terminal signals (like ⌃+C to cancel a running shell command).',
        },
        {
          question: 'Can I swap the Command and Control keys on Mac to feel like Windows?',
          answer: 'Yes. In macOS System Settings > Keyboard > Keyboard Shortcuts > Modifier Keys, you can remap the Control key to act as Command, or remap a standard Windows keyboard plugged into a Mac.',
        },
        {
          question: 'How do I take a partial screenshot on Windows like Mac’s Shift+Cmd+4?',
          answer: 'On Windows 10 and 11, press Windows + Shift + S. This opens the Snipping Tool overlay, allowing you to drag a box and copy the image directly to your clipboard.',
        },
        {
          question: 'What is the Windows equivalent of Mac’s Quick Look (Spacebar preview)?',
          answer: 'Windows does not include native Spacebar file preview, but Microsoft’s free open-source PowerToys suite includes "Peek", which activates instant file previews with Ctrl + Space.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
