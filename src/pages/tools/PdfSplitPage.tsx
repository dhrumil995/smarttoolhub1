import React, { useState, useRef } from 'react';
import { Scissors, Upload, Download, ShieldCheck, FileText, RefreshCw, Check, AlertCircle } from 'lucide-react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';
import { Button } from '../../components/ui/Button.tsx';
import { useToast } from '../../components/ui/Toast.tsx';

interface PdfSplitPageProps {
  navigate: (path: string) => void;
}

export const PdfSplitPage: React.FC<PdfSplitPageProps> = ({ navigate }) => {
  const [file, setFile] = useState<{ name: string; size: number; buffer: ArrayBuffer } | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [rangeMode, setRangeMode] = useState<'all' | 'custom' | 'single'>('custom');
  const [customRange, setCustomRange] = useState<string>('1-3');
  const [singlePage, setSinglePage] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [extractedBlobUrl, setExtractedBlobUrl] = useState<string | null>(null);
  const [extractedPageCount, setExtractedPageCount] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'pdf-split') || LAUNCH_TOOLS[0];
  const relatedTools = LAUNCH_TOOLS.filter((t) => t.slug === 'pdf-merge' || t.slug === 'image-to-pdf');
  const relatedGuide = POPULAR_GUIDES.find((g) => g.slug === 'better-prompts-simple-rules') || POPULAR_GUIDES[0];

  const exampleChips = [
    'Extract pages 1-3 from 10-page quarterly report',
    'Extract single cover page (page 1) as standalone document',
    'Extract specific pages: 2, 4, 7-9 for audit review',
  ];

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.type !== 'application/pdf' && !selected.name.toLowerCase().endsWith('.pdf')) {
      showToast('Please select a valid PDF file.');
      return;
    }

    if (selected.size > 80 * 1024 * 1024) {
      showToast('File size is over 80MB. Please select a smaller PDF.');
      return;
    }

    try {
      const buffer = await selected.arrayBuffer();
      // Load dynamically with pdf-lib to count pages
      const { PDFDocument } = await import('pdf-lib');
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = pdfDoc.getPageCount();

      setFile({ name: selected.name, size: selected.size, buffer });
      setTotalPages(count);
      setCustomRange(count >= 3 ? '1-3' : `1-${count}`);
      setSinglePage(1);
      setExtractedBlobUrl(null);
      showToast(`Loaded "${selected.name}" (${count} pages)`);
    } catch (err) {
      console.error(err);
      showToast('Could not parse PDF. It might be password-protected or damaged.');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const parsePageIndices = (rangeStr: string, maxPages: number): number[] => {
    const indices = new Set<number>();
    const parts = rangeStr.split(',').map((p) => p.trim());

    for (const part of parts) {
      if (!part) continue;
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-').map((s) => s.trim());
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          const from = Math.max(1, Math.min(start, end));
          const to = Math.min(maxPages, Math.max(start, end));
          for (let p = from; p <= to; p++) {
            indices.add(p - 1);
          }
        }
      } else {
        const page = parseInt(part, 10);
        if (!isNaN(page) && page >= 1 && page <= maxPages) {
          indices.add(page - 1);
        }
      }
    }

    return Array.from(indices).sort((a, b) => a - b);
  };

  const handleExtractPages = async () => {
    if (!file || totalPages === 0) {
      showToast('Please select a PDF file first.');
      return;
    }

    let targetIndices: number[] = [];
    if (rangeMode === 'all') {
      targetIndices = Array.from({ length: totalPages }, (_, i) => i);
    } else if (rangeMode === 'single') {
      targetIndices = [singlePage - 1];
    } else {
      targetIndices = parsePageIndices(customRange, totalPages);
    }

    if (targetIndices.length === 0) {
      showToast('Please enter a valid page range (e.g. 1-3 or 2, 4, 7).');
      return;
    }

    setIsProcessing(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const srcPdf = await PDFDocument.load(file.buffer, { ignoreEncryption: true });
      const newPdf = await PDFDocument.create();

      const copiedPages = await newPdf.copyPages(srcPdf, targetIndices);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const newBytes = await newPdf.save();
      const blob = new Blob([newBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setExtractedBlobUrl(url);
      setExtractedPageCount(targetIndices.length);
      showToast(`Extracted ${targetIndices.length} page${targetIndices.length > 1 ? 's' : ''}!`);
    } catch (err) {
      console.error('Extract error:', err);
      showToast('Error extracting pages. Please check your range values.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setTotalPages(0);
    setExtractedBlobUrl(null);
    showToast('Reset file selection');
  };

  const handleDownload = () => {
    if (!extractedBlobUrl) return;
    const link = document.createElement('a');
    link.href = extractedBlobUrl;
    link.download = `extracted-pages-${Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Download started');
  };

  return (
    <ToolPageTemplate
      tool={tool}
      heading="PDF Split & Extract Pages (Private)"
      subheading="Extract specific pages, page ranges, or single sections from any PDF document. 100% private and processed locally in your browser with zero server uploads."
      inputLabel="Select PDF File and Page Range"
      inputPlaceholder="Configure your target page range or single page..."
      examplePrompt="Upload a PDF and extract specific pages (e.g. 1-3 or 5, 8, 12)."
      exampleChips={exampleChips}
      generateButtonText={isProcessing ? 'Extracting Pages...' : 'Extract Selected Pages'}
      lastUpdated="October 2026"
      navigate={navigate}
      onClientCompute={() => ({
        result: `PDF Split Configuration:
File: ${file?.name || 'None'} (${formatFileSize(file?.size || 0)})
Total Pages: ${totalPages}
Range Mode: ${rangeMode}
Pages to Extract: ${rangeMode === 'single' ? singlePage : rangeMode === 'custom' ? customRange : 'All Pages'}
Privacy: 100% Client-Side. Your files never leave your device.`,
      })}
      extraControls={
        <div className="space-y-5 pt-1">
          {/* Privacy Guarantee Badge */}
          <div className="p-3.5 rounded-xl bg-[#0a1424] border border-[rgba(74, 222, 128,0.3)] flex items-center justify-between text-xs text-[#4ade80]">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="shrink-0" />
              <span className="font-semibold text-[#f2f7ff]">
                Your files never leave your device.
              </span>
            </div>
            <span className="hidden sm:inline font-mono text-[11px] text-[#4ade80]/80">
              100% In-Browser Memory
            </span>
          </div>

          {/* Upload Area */}
          {!file ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-8 border-2 border-dashed border-[rgba(143,163,192,0.25)] hover:border-[#4ade80]/60 bg-[#0a1424] hover:bg-[#101c33] transition-all rounded-2xl cursor-pointer text-center group space-y-3"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="w-12 h-12 mx-auto rounded-xl bg-[#101c33] group-hover:bg-[#0a1424] border border-[rgba(143,163,192,0.2)] group-hover:border-[#4ade80]/50 flex items-center justify-center text-[#8fa3c0] group-hover:text-[#4ade80] transition-colors">
                <Upload size={22} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#f2f7ff]">
                  Click or drag & drop a PDF to split
                </p>
                <p className="text-xs text-[#8fa3c0] mt-1">
                  Supports files up to 80MB. Clean in-memory extraction with zero external network traffic.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#101c33] border border-[rgba(143,163,192,0.2)] flex items-center justify-center text-[#4ade80]">
                    <FileText size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#f2f7ff] truncate max-w-xs sm:max-w-md">
                      {file.name}
                    </div>
                    <div className="text-xs text-[#8fa3c0] font-mono">
                      {totalPages} pages · {formatFileSize(file.size)}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="p-2 rounded-xl text-[#8fa3c0] hover:text-[#ff5c7a] bg-[#101c33] hover:bg-[#101c33]/80 transition-colors"
                  title="Remove file"
                  aria-label="Remove file"
                >
                  <RefreshCw size={15} />
                </button>
              </div>

              {/* Extraction Mode Switcher */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-mono uppercase text-[#8fa3c0] font-semibold">
                  Extraction Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRangeMode('custom')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all focus-ring ${
                      rangeMode === 'custom'
                        ? 'bg-[#101c33] border-[rgba(74, 222, 128,0.4)] text-[#4ade80] shadow-sm'
                        : 'bg-[#0a1424] border-[rgba(143,163,192,0.16)] text-[#8fa3c0]'
                    }`}
                  >
                    Custom Page Range (e.g. 1-3, 5)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRangeMode('single')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all focus-ring ${
                      rangeMode === 'single'
                        ? 'bg-[#101c33] border-[rgba(74, 222, 128,0.4)] text-[#4ade80] shadow-sm'
                        : 'bg-[#0a1424] border-[rgba(143,163,192,0.16)] text-[#8fa3c0]'
                    }`}
                  >
                    Single Specific Page
                  </button>
                </div>

                {/* Input according to mode */}
                {rangeMode === 'custom' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-[#8fa3c0]">
                      Page Range (Total document has {totalPages} pages)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1-3, 5, 8-10"
                      value={customRange}
                      onChange={(e) => setCustomRange(e.target.value)}
                      className="w-full bg-[#101c33] border border-[rgba(143,163,192,0.2)] rounded-xl px-3 py-2 text-xs text-[#f2f7ff] focus-ring font-mono"
                    />
                    <p className="text-[11px] text-[#8fa3c0]">
                      Use hyphens for ranges (e.g. <code>2-5</code>) and commas for individual pages (e.g. <code>1, 4, 7</code>).
                    </p>
                  </div>
                )}

                {rangeMode === 'single' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-[#8fa3c0]">
                      Page Number (1 to {totalPages})
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={totalPages}
                      value={singlePage}
                      onChange={(e) => setSinglePage(Math.max(1, Math.min(totalPages, Number(e.target.value))))}
                      className="w-32 bg-[#101c33] border border-[rgba(143,163,192,0.2)] rounded-xl px-3 py-2 text-xs text-[#f2f7ff] focus-ring font-mono text-center"
                    />
                  </div>
                )}

                <div className="pt-2">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleExtractPages}
                    disabled={isProcessing}
                    className="w-full gap-2 font-bold"
                  >
                    <Scissors size={18} />
                    <span>{isProcessing ? 'Extracting in memory...' : 'Extract & Download New PDF'}</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      }
      customResultRenderer={() => {
        if (!extractedBlobUrl) {
          return (
            <div className="p-8 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] text-center space-y-3">
              <Scissors className="w-10 h-10 text-[#8fa3c0]/40 mx-auto" />
              <div className="text-sm font-semibold text-[#f2f7ff]">Ready to Extract</div>
              <p className="text-xs text-[#8fa3c0] max-w-sm mx-auto">
                Upload your PDF file above and define your target page range. Extraction is handled 100% locally in your browser.
              </p>
            </div>
          );
        }

        return (
          <div className="space-y-5">
            <div className="p-6 rounded-2xl bg-[#0a1424] border border-[rgba(74, 222, 128,0.35)] space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#4ade80] animate-pulse" />
                    <span className="text-xs font-mono uppercase text-[#4ade80] font-bold">
                      Extraction Complete
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#f2f7ff]">
                    {extractedPageCount} page{extractedPageCount > 1 ? 's' : ''} extracted
                  </h3>
                  <p className="text-xs text-[#8fa3c0] font-mono">
                    Extracted from "{file?.name}" · Clean vector reproduction
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  onClick={handleDownload}
                  className="w-full sm:w-auto gap-2 text-sm"
                >
                  <Download size={16} />
                  <span>Download Extracted PDF</span>
                </Button>
              </div>

              {/* Embedded Safe Preview */}
              <div className="rounded-xl overflow-hidden border border-[rgba(74, 222, 128,0.2)] bg-[#050a14] h-[400px]">
                <iframe
                  src={extractedBlobUrl}
                  title="Extracted PDF Preview"
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          </div>
        );
      }}
      whatItDoesContent={
        <div className="space-y-3">
          <p>
            Many PDF documents contain dozens of pages when you only need a single chapter, an executive summary, or a specific signed signature page. Sharing the entire file wastes bandwidth, exposes irrelevant private data, and creates confusion.
          </p>
          <p>
            The <strong>PDF Split & Page Extractor</strong> provides surgical control over your documents without exposing confidential records to cloud servers. Using client-side WebAssembly, it parses the PDF structure locally, clones only the pages you request, and builds a brand-new, lightweight PDF document in your browser.
          </p>
          <p>
            You can specify complex ranges like <code>1-3, 7, 10-12</code>, pick a single page with a simple number input, or extract individual exhibits for contracts and legal filing.
          </p>
        </div>
      }
      howToUseSteps={[
        {
          step: 'Select your PDF document',
          text: 'Upload any PDF up to 80MB. The tool immediately detects and displays the total page count.',
        },
        {
          step: 'Define your desired page range',
          text: 'Choose custom ranges with hyphens and commas (e.g. 1-4, 7) or specify an exact single page number.',
        },
        {
          step: 'Extract and Save',
          text: 'Click Extract to build the newly trimmed PDF instantly and preview or download the file to your device.',
        },
      ]}
      workedExample={{
        title: 'Extracting Signature Page from 45-Page Commercial Lease',
        scenario: 'A tenant only needs to email page 42 (the signed notary and tenant signature block) to their property insurer.',
        output: 'Selected single page: 42. Generated a standalone 1-page PDF document (112 KB) ready to email in 1.2 seconds with zero network uploads.',
      }}
      tips={[
        'Comma-separated ranges allow pulling non-consecutive pages into a single new document (e.g. 1, 5, 12).',
        'Page numbering starts from 1 according to standard document reading order.',
        'Extracted pages retain all clickable hyperlinks, vector fonts, and original image resolutions.',
      ]}
      faq={[
        {
          question: 'Are extracted documents lower quality than the original?',
          answer: 'No. The tool performs a lossless stream copy of the selected pages, preserving exact font definitions, vectors, and embedded images.',
        },
        {
          question: 'Are my files uploaded to any third party?',
          answer: 'Never. The entire operation runs strictly on your machine using your browser engine. Your documents never leave your device.',
        },
        {
          question: 'What happens if I enter an invalid page number?',
          answer: 'The extractor automatically clamps page numbers to the document boundary (1 to total pages) and alerts you if an invalid range is entered.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
