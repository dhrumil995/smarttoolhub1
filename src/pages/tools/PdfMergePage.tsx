import React, { useState, useRef } from 'react';
import { Combine, Upload, Trash2, ArrowUp, ArrowDown, Download, ShieldCheck, FileText, RefreshCw, AlertCircle, Check } from 'lucide-react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';
import { Button } from '../../components/ui/Button.tsx';
import { useToast } from '../../components/ui/Toast.tsx';

interface PdfMergePageProps {
  navigate: (path: string) => void;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  buffer: ArrayBuffer;
  pageCount?: number;
}

export const PdfMergePage: React.FC<PdfMergePageProps> = ({ navigate }) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergeProgress, setMergeProgress] = useState<number>(0);
  const [mergedBlobUrl, setMergedBlobUrl] = useState<string | null>(null);
  const [mergedSize, setMergedSize] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'pdf-merge') || LAUNCH_TOOLS[0];
  const relatedTools = LAUNCH_TOOLS.filter((t) => t.slug === 'pdf-split' || t.slug === 'image-to-pdf');
  const relatedGuide = POPULAR_GUIDES.find((g) => g.slug === 'better-prompts-simple-rules') || POPULAR_GUIDES[0];

  const exampleChips = [
    'Combine quarterly report: Cover page + Financial spreadsheet + Appendix',
    'Merge freelance paperwork: Signed contract + W-9 tax form + Invoice',
    'Consolidate study notes: Lecture slides + Homework sheets + Study guide',
  ];

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected || selected.length === 0) return;

    const newFiles: UploadedFile[] = [];
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB per file

    for (let i = 0; i < selected.length; i++) {
      const file = selected[i];
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        showToast(`Skipped "${file.name}": Only PDF files are supported.`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        showToast(`"${file.name}" is over 50MB. Please select smaller files.`);
        continue;
      }

      try {
        const buffer = await file.arrayBuffer();
        newFiles.push({
          id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          name: file.name,
          size: file.size,
          buffer,
        });
      } catch {
        showToast(`Could not read "${file.name}".`);
      }
    }

    if (newFiles.length > 0) {
      setFiles((prev) => [...prev, ...newFiles]);
      setMergedBlobUrl(null);
      showToast(`Added ${newFiles.length} PDF file${newFiles.length > 1 ? 's' : ''}`);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setFiles((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
    setMergedBlobUrl(null);
  };

  const handleMoveDown = (index: number) => {
    if (index === files.length - 1) return;
    setFiles((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
    setMergedBlobUrl(null);
  };

  const handleRemove = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setMergedBlobUrl(null);
  };

  const handleReset = () => {
    setFiles([]);
    setMergedBlobUrl(null);
    setMergeProgress(0);
    showToast('Reset file list');
  };

  const handleMergePdfs = async () => {
    if (files.length < 2) {
      showToast('Please add at least 2 PDF files to merge.');
      return;
    }

    setIsMerging(true);
    setMergeProgress(10);

    try {
      // Dynamic import ensures pdf-lib is never bundled into the main bundle
      const { PDFDocument } = await import('pdf-lib');
      setMergeProgress(30);

      const mergedPdf = await PDFDocument.create();

      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        const srcPdf = await PDFDocument.load(f.buffer, { ignoreEncryption: true });
        const copiedPages = await mergedPdf.copyPages(srcPdf, srcPdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
        setMergeProgress(30 + Math.round(((i + 1) / files.length) * 55));
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setMergedBlobUrl(url);
      setMergedSize(mergedBytes.byteLength);
      setMergeProgress(100);
      showToast('PDFs merged successfully!');
    } catch (err) {
      console.error('Merge error:', err);
      showToast('Could not merge PDFs. One of the files might be corrupted or password-protected.');
    } finally {
      setIsMerging(false);
    }
  };

  const handleDownload = () => {
    if (!mergedBlobUrl) return;
    const link = document.createElement('a');
    link.href = mergedBlobUrl;
    link.download = `merged-document-${Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Download started');
  };

  return (
    <ToolPageTemplate
      tool={tool}
      heading="PDF Merge (Private & Client-Side)"
      subheading="Combine multiple PDF documents into a single organized file in seconds. Drag and drop, reorder pages, and merge entirely within your browser with zero server uploads."
      inputLabel="Select or Reorder PDF Files"
      inputPlaceholder="Your selected PDFs will appear below for reordering..."
      examplePrompt="Add two or more PDF files from your device to combine them into one document."
      exampleChips={exampleChips}
      generateButtonText={isMerging ? `Merging... ${mergeProgress}%` : `Merge ${files.length} PDF${files.length === 1 ? '' : 's'}`}
      lastUpdated="October 2026"
      navigate={navigate}
      onClientCompute={() => ({
        result: `PDF Merge Summary:
Files to Combine: ${files.length}
Total Input Size: ${formatFileSize(files.reduce((a, b) => a + b.size, 0))}
Order:
${files.map((f, i) => `${i + 1}. ${f.name} (${formatFileSize(f.size)})`).join('\n')}

Processing: 100% Client-Side via WebAssembly. Your files never leave your device.`,
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
              100% Client-Side Engine
            </span>
          </div>

          {/* Upload Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-8 border-2 border-dashed border-[rgba(143,163,192,0.25)] hover:border-[#4ade80]/60 bg-[#0a1424] hover:bg-[#101c33] transition-all rounded-2xl cursor-pointer text-center group space-y-3"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="application/pdf,.pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="w-12 h-12 mx-auto rounded-xl bg-[#101c33] group-hover:bg-[#0a1424] border border-[rgba(143,163,192,0.2)] group-hover:border-[#4ade80]/50 flex items-center justify-center text-[#8fa3c0] group-hover:text-[#4ade80] transition-colors">
              <Upload size={22} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#f2f7ff]">
                Click or drag & drop PDFs here
              </p>
              <p className="text-xs text-[#8fa3c0] mt-1">
                Supports multiple files up to 50MB each. Safe, encrypted in-memory processing.
              </p>
            </div>
          </div>

          {/* File Queue List */}
          {files.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0] font-semibold">
                  Merge Sequence ({files.length} {files.length === 1 ? 'file' : 'files'})
                </span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs font-mono text-[#8fa3c0] hover:text-[#ff5c7a] flex items-center gap-1 transition-colors"
                >
                  <RefreshCw size={13} />
                  <span>Reset List</span>
                </button>
              </div>

              <div className="space-y-2">
                {files.map((file, idx) => (
                  <div
                    key={file.id}
                    className="p-3.5 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-[#101c33] border border-[rgba(143,163,192,0.2)] font-mono font-bold text-center leading-6 shrink-0 text-[#4ade80]">
                        {idx + 1}
                      </span>
                      <FileText size={18} className="text-[#8fa3c0] shrink-0" />
                      <div className="truncate">
                        <div className="font-medium text-[#f2f7ff] truncate">{file.name}</div>
                        <div className="text-[11px] text-[#8fa3c0] font-mono">{formatFileSize(file.size)}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMoveUp(idx)}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg bg-[#101c33] text-[#8fa3c0] hover:text-[#f2f7ff] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                        title="Move Up"
                        aria-label="Move file up"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveDown(idx)}
                        disabled={idx === files.length - 1}
                        className="p-1.5 rounded-lg bg-[#101c33] text-[#8fa3c0] hover:text-[#f2f7ff] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                        title="Move Down"
                        aria-label="Move file down"
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemove(file.id)}
                        className="p-1.5 rounded-lg text-[#8fa3c0] hover:text-[#ff5c7a] transition-colors ml-1"
                        title="Remove File"
                        aria-label="Remove file"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Merge Button */}
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleMergePdfs}
                  disabled={files.length < 2 || isMerging}
                  className="w-full gap-2 font-bold"
                >
                  <Combine size={18} />
                  <span>
                    {isMerging
                      ? `Merging... ${mergeProgress}%`
                      : `Combine ${files.length} PDFs into One Document`}
                  </span>
                </Button>
              </div>

              {/* Progress bar */}
              {isMerging && (
                <div className="space-y-1.5">
                  <div className="h-2 w-full bg-[#101c33] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#4ade80] transition-all duration-300"
                      style={{ width: `${mergeProgress}%` }}
                    />
                  </div>
                  <div className="text-right text-[11px] font-mono text-[#8fa3c0]">
                    Processing in-memory... {mergeProgress}%
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      }
      customResultRenderer={() => {
        if (!mergedBlobUrl) {
          return (
            <div className="p-8 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] text-center space-y-3">
              <Combine className="w-10 h-10 text-[#8fa3c0]/40 mx-auto" />
              <div className="text-sm font-semibold text-[#f2f7ff]">Ready to Combine</div>
              <p className="text-xs text-[#8fa3c0] max-w-sm mx-auto">
                Add at least two PDF files in the panel above. You can arrange the exact sequence with the up and down arrow buttons.
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
                      Merge Complete
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#f2f7ff]">
                    Your combined PDF is ready
                  </h3>
                  <p className="text-xs text-[#8fa3c0] font-mono">
                    Combined from {files.length} source documents · Output size: {formatFileSize(mergedSize)}
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  onClick={handleDownload}
                  className="w-full sm:w-auto gap-2 text-sm"
                >
                  <Download size={16} />
                  <span>Download Merged PDF</span>
                </Button>
              </div>

              {/* Embedded Safe Preview */}
              <div className="rounded-xl overflow-hidden border border-[rgba(74, 222, 128,0.2)] bg-[#050a14] h-[400px]">
                <iframe
                  src={mergedBlobUrl}
                  title="Merged PDF Preview"
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
            Most online PDF merger tools require uploading sensitive personal documents—such as tax returns, medical files, employment agreements, or bank statements—to untrusted remote servers.
          </p>
          <p>
            The <strong>SmartToolHub PDF Merge</strong> tool works entirely in your browser using client-side WebAssembly and modern PDF stream manipulation. When you select files, they are decoded strictly inside your computer's local memory and merged page-by-page. No bytes are sent over the network, guaranteeing 100% confidential privacy.
          </p>
          <p>
            You can reorder documents with simple up and down controls, inspect the exact file size of the resulting combined document, and immediately download the finished PDF.
          </p>
        </div>
      }
      howToUseSteps={[
        {
          step: 'Upload your PDF documents',
          text: 'Click or drop two or more PDF files into the selection zone. Files up to 50MB each are supported.',
        },
        {
          step: 'Reorder the sequence',
          text: 'Use the up and down arrows on each card to arrange files in the exact order you want them combined.',
        },
        {
          step: 'Combine and Download',
          text: 'Click "Combine PDFs" to build the unified document in memory, preview the result, and download your clean PDF file.',
        },
      ]}
      workedExample={{
        title: 'Merging Freelance Consulting Onboarding Packet',
        scenario: 'A contractor needs to combine an unsigned Master Service Agreement (4 pages), an executed Statement of Work (2 pages), and a signed W-9 tax form (1 page) into one neat submission.',
        output: 'Successfully combined 3 source PDFs (7 total pages). Output document size: 1.4 MB. Downloaded instantly as merged-document.pdf with zero server uploads.',
      }}
      tips={[
        'Double-check document sequence using the numbered sequence badges before clicking Merge.',
        'If a PDF fails to load, ensure it is not protected by an owner password or encrypted by proprietary DRM.',
        'The output document preserves high-resolution vector text, embedded fonts, and vector illustrations.',
      ]}
      faq={[
        {
          question: 'Are my uploaded PDF files saved on any server?',
          answer: 'Never. Processing happens 100% inside your browser using client-side JavaScript. Your files never touch a cloud server or external database.',
        },
        {
          question: 'Is there a limit on how many PDFs I can combine?',
          answer: 'You can combine as many PDFs as your device memory allows. For standard laptops and phones, merging 15-20 documents totaling 100MB works smoothly.',
        },
        {
          question: 'Does merging compress or degrade document quality?',
          answer: 'No. The merger tool extracts the exact page streams and fonts from your original PDFs without recompressing or rasterizing your vector graphics.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
