import React, { useState, useEffect, useMemo } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Archive, Check, Copy, AlertCircle, Sparkles, Sliders, ExternalLink, RefreshCw } from 'lucide-react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';

interface QrItem {
  id: number;
  text: string;
  dataUrl: string;
  filename: string;
}

interface BatchQrCodeGeneratorPageProps {
  navigate: (path: string) => void;
}

export const BatchQrCodeGeneratorPage: React.FC<BatchQrCodeGeneratorPageProps> = ({ navigate }) => {
  const [rawText, setRawText] = useState<string>(
    'https://smarttoolhub.net\nhttps://smarttoolhub.net/tools\nhttps://smarttoolhub.net/guides\nWIFI:T:WPA;S:OfficeGuest;P:Welcome2026;;'
  );
  const [qrSize, setQrSize] = useState<number>(512);
  const [errorCorrection, setErrorCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [qrList, setQrList] = useState<QrItem[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'batch-qr-code-generator') || {
    id: 'batch-qr-code-generator',
    name: 'Batch QR Code Generator',
    slug: 'batch-qr-code-generator',
    description: 'Generate up to 50 custom QR codes in bulk from links or text. Preview in high resolution and download as individual PNGs or a single ZIP archive.',
    category: 'Productivity',
    icon: 'QrCode',
    type: 'client',
    keywords: ['batch qr code generator', 'bulk qr code creator', 'multiple qr codes download zip', 'free bulk qr generator'],
    relatedToolSlugs: ['install-command-generator', 'file-checksum-verifier'],
    isFlagship: false,
  };

  const relatedTools = LAUNCH_TOOLS.filter(
    (t) => t.slug === 'install-command-generator' || t.slug === 'file-checksum-verifier' || t.slug === 'quick-calculators'
  );
  const relatedGuide = POPULAR_GUIDES[0];

  // Parse lines with a maximum limit of 50
  const lines = useMemo(() => {
    return rawText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
      .slice(0, 50);
  }, [rawText]);

  // Clean filename generator
  const sanitizeFilename = (text: string, index: number): string => {
    try {
      if (text.startsWith('http://') || text.startsWith('https://')) {
        const url = new URL(text);
        const hostSlug = url.hostname.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-');
        const pathSlug = url.pathname.replace(/[^a-zA-Z0-9]/g, '-').slice(0, 20);
        return `qr-${String(index + 1).padStart(2, '0')}-${hostSlug}${pathSlug ? `-${pathSlug}` : ''}.png`;
      }
    } catch {
      // Fallback to text slug
    }
    const clean = text.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').slice(0, 24);
    return `qr-${String(index + 1).padStart(2, '0')}-${clean || 'item'}.png`;
  };

  // Generate QR codes
  useEffect(() => {
    let isCancelled = false;

    const generateAll = async () => {
      if (lines.length === 0) {
        setQrList([]);
        return;
      }

      setIsGenerating(true);
      const items: QrItem[] = [];

      for (let i = 0; i < lines.length; i++) {
        if (isCancelled) return;
        const text = lines[i];
        try {
          const url = await QRCode.toDataURL(text, {
            width: qrSize,
            margin: 2,
            errorCorrectionLevel: errorCorrection,
            color: {
              dark: '#050a14',
              light: '#ffffff',
            },
          });
          items.push({
            id: i,
            text,
            dataUrl: url,
            filename: sanitizeFilename(text, i),
          });
        } catch (err) {
          console.error(`Failed to generate QR for line ${i + 1}:`, err);
        }
      }

      if (!isCancelled) {
        setQrList(items);
        setIsGenerating(false);
      }
    };

    generateAll();

    return () => {
      isCancelled = true;
    };
  }, [lines, qrSize, errorCorrection]);

  // Individual PNG Download
  const handleDownloadSingle = (item: QrItem) => {
    const a = document.createElement('a');
    a.href = item.dataUrl;
    a.download = item.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Bulk ZIP Download using dynamically imported jszip
  const handleDownloadZip = async () => {
    if (qrList.length === 0 || isZipping) return;

    try {
      setIsZipping(true);
      // Dynamically import jszip to keep main bundle lightweight
      const JSZipModule = await import('jszip');
      const JSZip = JSZipModule.default;
      const zip = new JSZip();
      const folder = zip.folder('qr-codes');

      qrList.forEach((item) => {
        // Strip data:image/png;base64, header
        const base64Data = item.dataUrl.split(',')[1];
        if (base64Data && folder) {
          folder.file(item.filename, base64Data, { base64: true });
        }
      });

      // Add a manifest text file
      folder?.file(
        'manifest.txt',
        `SmartToolHub Batch QR Code Generation\nGenerated: ${new Date().toISOString()}\nTotal Codes: ${qrList.length}\nResolution: ${qrSize}x${qrSize}px\nError Correction: Level ${errorCorrection}\n\nContents:\n${qrList.map((q, idx) => `${idx + 1}. ${q.filename} -> ${q.text}`).join('\n')}\n`
      );

      const content = await zip.generateAsync({ type: 'blob' });
      const blobUrl = URL.createObjectURL(content);

      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `smarttoolhub-qr-codes-${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);

      setDownloadSuccess('ZIP archive downloaded successfully!');
      setTimeout(() => setDownloadSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to create ZIP:', err);
    } finally {
      setIsZipping(false);
    }
  };

  const exampleChips = [
    'Retail Product URL QR Codes',
    'Event Ticket Check-In Codes',
    'Wi-Fi Credentials & Contact Links',
  ];

  return (
    <ToolPageTemplate
      tool={tool}
      heading="Batch QR Code Generator"
      subheading="Generate up to 50 high-resolution, camera-scannable QR codes in parallel from any list of URLs or text. Download as crisp individual PNGs or a single ZIP archive."
      inputLabel="Input URLs or Text Items (One Per Line, Max 50)"
      inputPlaceholder="https://example.com/page1&#10;https://example.com/page2&#10;WIFI:S:MyNetwork;P:MyPassword;;"
      examplePrompt="Generate batch QR codes for product landing pages"
      exampleChips={exampleChips}
      lastUpdated="October 2026"
      navigate={navigate}
      onClientCompute={() => ({
        result: `Generated ${qrList.length} QR Code(s) successfully.
Resolution: ${qrSize} &times; ${qrSize} px
Error Correction: Level ${errorCorrection} (Standard Reed-Solomon)

Items:
${qrList.map((item, idx) => `${idx + 1}. ${item.filename} [${item.text}]`).join('\n')}`,
      })}
      extraControls={
        <div className="space-y-6 pt-2">
          {/* Main Controls Panel */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-[#ffb840] font-bold flex items-center gap-1.5">
                <Sliders className="w-4 h-4" />
                <span>Batch Input &amp; Customization</span>
              </span>
              <span className="text-xs font-mono text-[#9aaccb]">
                {lines.length} / 50 lines
              </span>
            </div>

            {/* Multiline Input Textarea */}
            <div className="space-y-1.5">
              <textarea
                rows={6}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste up to 50 URLs or text strings (one per line)..."
                className="w-full bg-[#050a14] border border-[rgba(143,163,192,0.18)] rounded-2xl p-4 text-xs sm:text-sm font-mono text-[#f2f7ff] placeholder-[#9aaccb] focus-ring resize-y leading-relaxed"
              />
              <div className="flex justify-between items-center text-[11px] text-[#9aaccb]">
                <span>Empty lines are automatically skipped. Max 50 items per batch.</span>
                {lines.length >= 50 && (
                  <span className="text-[#ffb840] font-bold">50 item batch limit reached</span>
                )}
              </div>
            </div>

            {/* Quality and Size Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[rgba(143,163,192,0.12)]">
              {/* Size Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-[#9aaccb]">
                  Image Resolution
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: '256 px', size: 256 },
                    { label: '512 px', size: 512 },
                    { label: '1024 px', size: 1024 },
                  ].map((s) => (
                    <button
                      key={s.size}
                      type="button"
                      onClick={() => setQrSize(s.size)}
                      className={`py-1.5 px-3 rounded-xl text-xs font-semibold border transition-all focus-ring ${
                        qrSize === s.size
                          ? 'bg-[#ffb840] text-[#050a14] border-[#ffb840] font-bold shadow-sm'
                          : 'bg-[#050a14] text-[#9aaccb] border-[rgba(143,163,192,0.14)] hover:text-[#f2f7ff]'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Correction Level */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-[#9aaccb]">
                  Error Correction Level
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { level: 'L', label: 'L ~7%' },
                    { level: 'M', label: 'M ~15%' },
                    { level: 'Q', label: 'Q ~25%' },
                    { level: 'H', label: 'H ~30%' },
                  ].map((ec) => (
                    <button
                      key={ec.level}
                      type="button"
                      onClick={() => setErrorCorrection(ec.level as any)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-semibold border text-center transition-all focus-ring ${
                        errorCorrection === ec.level
                          ? 'bg-[#ffb840] text-[#050a14] border-[#ffb840] font-bold shadow-sm'
                          : 'bg-[#050a14] text-[#9aaccb] border-[rgba(143,163,192,0.14)] hover:text-[#f2f7ff]'
                      }`}
                      title={`Reed-Solomon recovery capability: ${ec.label}`}
                    >
                      {ec.level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar: Download ZIP & Stats */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)]">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-mono text-[#f2f7ff] font-bold">
                {qrList.length} QR Code{qrList.length === 1 ? '' : 's'} Ready
              </span>
              <span className="text-[#9aaccb]/60">·</span>
              <span className="text-[#9aaccb] font-mono">
                {qrSize}&times;{qrSize}px PNG
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={qrList.length === 0 || isZipping || isGenerating}
                onClick={handleDownloadZip}
                className="btn-primary text-xs w-full sm:w-auto px-5 disabled:opacity-50"
              >
                {isZipping ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Creating ZIP...</span>
                  </>
                ) : (
                  <>
                    <Archive className="w-4 h-4" />
                    <span>Download All as ZIP ({qrList.length})</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {downloadSuccess && (
            <div className="p-3.5 rounded-xl bg-[rgba(52,224,161,0.12)] border border-[#34e0a1] flex items-center gap-2 text-xs text-[#34e0a1]">
              <Check className="w-4 h-4 shrink-0" />
              <span>{downloadSuccess}</span>
            </div>
          )}

          {/* Grid of Generated QR Code Previews */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#9aaccb] font-bold">
              Preview Grid ({qrList.length})
            </h4>

            {isGenerating ? (
              <div className="p-12 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] text-center space-y-3">
                <RefreshCw className="w-6 h-6 animate-spin text-[#ffb840] mx-auto" />
                <div className="text-sm text-[#f2f7ff] font-semibold">Generating QR code vector matrices...</div>
              </div>
            ) : qrList.length === 0 ? (
              <div className="p-12 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] text-center text-xs text-[#9aaccb]">
                Enter text or URLs above to generate QR codes.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {qrList.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.14)] hover:border-[rgba(255,184,64,0.4)] flex flex-col justify-between space-y-3 transition-all group"
                  >
                    {/* QR Preview Box with white container for reliable camera recognition */}
                    <div className="aspect-square w-full rounded-2xl bg-white p-3 flex items-center justify-center shadow-inner">
                      <img
                        src={item.dataUrl}
                        alt={`QR Code ${item.id + 1}`}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    </div>

                    {/* Metadata & Target text */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#9aaccb]">
                        <span>#{item.id + 1}</span>
                        <span>{qrSize}&times;{qrSize}</span>
                      </div>
                      <p
                        className="text-xs font-mono text-[#f2f7ff] truncate"
                        title={item.text}
                      >
                        {item.text}
                      </p>
                    </div>

                    {/* Single Download Button */}
                    <button
                      type="button"
                      onClick={() => handleDownloadSingle(item)}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-[#050a14] border border-[rgba(143,163,192,0.16)] group-hover:border-[#ffb840] text-xs font-semibold text-[#f2f7ff] group-hover:text-[#ffb840] transition-colors focus-ring"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PNG</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      }
      whatItDoesContent={
        <>
          <p>
            The Batch QR Code Generator produces sharp, publication-ready Quick Response (QR) matrices in parallel for up to 50 items simultaneously. Designed for retail packaging, conference badges, restaurant table ordering, Wi-Fi onboarding cards, and marketing campaigns, it eliminates the tedious process of generating and saving QR codes one by one.
          </p>
          <p>
            All vector calculations and pixel renders occur 100% locally in your browser memory. Your links and text are never transmitted to third-party tracking servers or link shorteners. The resulting PNG assets are packaged into a tidy ZIP archive complete with a structured text manifest mapping each filename back to its source URL.
          </p>
        </>
      }
      howToUseSteps={[
        {
          step: 'Paste your list of URLs or text items',
          text: 'Paste up to 50 links or strings (one per line) into the editor box above.',
        },
        {
          step: 'Configure resolution and error correction',
          text: 'Choose image dimensions (256px, 512px, or high-res 1024px for print) and Reed-Solomon error correction level.',
        },
        {
          step: 'Download individual PNGs or batch ZIP',
          text: 'Download individual QR codes directly or click "Download All as ZIP" to get all images in a compressed archive.',
        },
      ]}
      workedExample={{
        title: 'Example: Restaurant Table Ordering QR Batch',
        scenario: 'A cafe owner needs 10 table ordering codes pointing to specific web ordering URLs.',
        output: `Input:
https://cafe.example.com/order?table=1
https://cafe.example.com/order?table=2
...
https://cafe.example.com/order?table=10

Generated ZIP Archive:
- qr-01-cafe-example-com.png (512x512)
- qr-02-cafe-example-com.png (512x512)
...
- qr-10-cafe-example-com.png (512x512)
- manifest.txt (Mapping of files to table URLs)`,
      }}
      tips={[
        'Use Level M or Q for printed collateral: Error Correction Level Q (25%) allows physical QR codes to be scanned reliably even if paper is lightly smudged or creased.',
        'Always test scan before high-volume printing: Print a single test page on your office printer and verify scanning from 2–3 different smartphone camera models.',
        'Wi-Fi QR Format: To connect phones directly to Wi-Fi, format as: WIFI:S:NetworkName;T:WPA;P:YourPassword;;',
        'Zero tracking redirects: Our generated codes contain your raw destination URL directly without intermediate redirect servers that could expire.',
      ]}
      faq={[
        {
          question: 'Are there any usage limits or expiration dates on these QR codes?',
          answer: 'No. These are standard static QR codes. They encode your raw URL directly into the pixel grid. They never expire and will work forever as long as your destination website remains online.',
        },
        {
          question: 'What resolution should I select for physical print brochures?',
          answer: 'For small stickers and business cards, 512px is sufficient. For large posters, banners, and retail signage, select 1024px to ensure razor-sharp edges at 300 DPI.',
        },
        {
          question: 'Can I generate QR codes for offline text or contact information?',
          answer: 'Yes. Any arbitrary text (including plain messages, vCard contact cards, cryptocurrency addresses, and Wi-Fi credentials) can be encoded.',
        },
        {
          question: 'Why does the ZIP download happen so fast?',
          answer: 'The ZIP archive is compiled directly inside your browser using client-side JavaScript (JSZip). No files are uploaded to or downloaded from a remote cloud server.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
