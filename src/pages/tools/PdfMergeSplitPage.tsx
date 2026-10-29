import React, { useState, useRef, useEffect } from 'react';
import {
  Combine,
  Scissors,
  Upload,
  Download,
  Trash2,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  ShieldCheck,
  FileText,
  AlertCircle,
  Archive,
  Info,
  Check,
  GripVertical,
  Layers,
} from 'lucide-react';
import { ToolPageTemplate, ToolFaqItem } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';
import { Button } from '../../components/ui/Button.tsx';
import { useToast } from '../../components/ui/Toast.tsx';

interface PdfMergeSplitPageProps {
  navigate: (path: string) => void;
  defaultTab?: 'merge' | 'split';
}

interface MergeFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  buffer: ArrayBuffer;
  pageCount?: number;
  status: 'idle' | 'reading' | 'ready' | 'error';
  errorMessage?: string;
}

interface SplitFileItem {
  file: File;
  name: string;
  size: number;
  buffer: ArrayBuffer;
  pageCount: number;
}

export const PdfMergeSplitPage: React.FC<PdfMergeSplitPageProps> = ({ navigate, defaultTab = 'merge' }) => {
  const [activeTab, setActiveTab] = useState<'merge' | 'split'>(defaultTab);

  // Merge state
  const [mergeFiles, setMergeFiles] = useState<MergeFileItem[]>([]);
  const [isMerging, setIsMerging] = useState<boolean>(false);
  const [mergedBlobUrl, setMergedBlobUrl] = useState<string | null>(null);
  const [mergedSize, setMergedSize] = useState<number>(0);
  const mergeInputRef = useRef<HTMLInputElement>(null);

  // Split state
  const [splitFile, setSplitFile] = useState<SplitFileItem | null>(null);
  const [splitMode, setSplitMode] = useState<'range' | 'all'>('range');
  const [pageRangeInput, setPageRangeInput] = useState<string>('1-3');
  const [isSplitting, setIsSplitting] = useState<boolean>(false);
  const [splitBlobUrl, setSplitBlobUrl] = useState<string | null>(null);
  const [splitResultName, setSplitResultName] = useState<string>('');
  const [splitResultSize, setSplitResultSize] = useState<number>(0);
  const splitInputRef = useRef<HTMLInputElement>(null);

  const { showToast } = useToast();

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'pdf-merge-split') || LAUNCH_TOOLS[0];
  const relatedTools = LAUNCH_TOOLS.filter((t) => t.slug === 'heic-to-jpg-converter' || t.slug === 'image-to-pdf');
  const relatedGuide = POPULAR_GUIDES.find((g) => g.slug === 'how-to-merge-pdf-files-on-phone') || POPULAR_GUIDES[0];

  const exampleChips = [
    'Merge: Signed Contract + W-9 Form + Invoice',
    'Split: Extract Pages 1-3 from Multi-Page Report',
    'Split: Unpack All Pages into Individual PDFs (ZIP)',
  ];

  // Track recent tool in localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('smarttoolhub_recent_tools');
      const recent = stored ? JSON.parse(stored) : [];
      const filtered = recent.filter((id: string) => id !== 'pdf-merge-split');
      localStorage.setItem('smarttoolhub_recent_tools', JSON.stringify(['pdf-merge-split', ...filtered].slice(0, 8)));
    } catch {
      // Ignore storage block
    }
  }, []);

  // Revoke object URLs on cleanup
  useEffect(() => {
    return () => {
      if (mergedBlobUrl) URL.revokeObjectURL(mergedBlobUrl);
      if (splitBlobUrl) URL.revokeObjectURL(splitBlobUrl);
    };
  }, [mergedBlobUrl, splitBlobUrl]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // ================= MERGE TAB HANDLERS =================
  const handleMergeFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const list = Array.from(files);
    const maxFiles = 20;
    const maxBytes = 25 * 1024 * 1024; // 25 MB

    if (mergeFiles.length + list.length > maxFiles) {
      showToast(`Batch limit reached: you can merge up to ${maxFiles} PDFs at a time.`, 'error');
    }

    const { PDFDocument } = await import('pdf-lib');
    const newItems: MergeFileItem[] = [];

    for (const f of list) {
      if (mergeFiles.length + newItems.length >= maxFiles) break;

      if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) {
        showToast(`Skipped "${f.name}": only PDF files are supported.`, 'error');
        continue;
      }

      if (f.size > maxBytes) {
        showToast(`Skipped "${f.name}": exceeds 25 MB mobile limit.`, 'error');
        continue;
      }

      try {
        const buffer = await f.arrayBuffer();
        let pageCount: number | undefined;

        try {
          const doc = await PDFDocument.load(buffer, { ignoreEncryption: false });
          pageCount = doc.getPageCount();
        } catch (err: any) {
          const msg = err?.message?.toLowerCase() || '';
          if (msg.includes('encrypt') || msg.includes('password')) {
            newItems.push({
              id: `${f.name}-${Date.now()}-${Math.random()}`,
              file: f,
              name: f.name,
              size: f.size,
              buffer,
              status: 'error',
              errorMessage: 'This PDF is password-protected. For security and privacy, we cannot open password-encrypted PDFs.',
            });
            continue;
          } else {
            throw err;
          }
        }

        newItems.push({
          id: `${f.name}-${Date.now()}-${Math.random()}`,
          file: f,
          name: f.name,
          size: f.size,
          buffer,
          pageCount,
          status: 'ready',
        });
      } catch {
        newItems.push({
          id: `${f.name}-${Date.now()}-${Math.random()}`,
          file: f,
          name: f.name,
          size: f.size,
          buffer: new ArrayBuffer(0),
          status: 'error',
          errorMessage: 'Could not read PDF. File may be corrupted or damaged.',
        });
      }
    }

    if (newItems.length > 0) {
      setMergeFiles((prev) => [...prev, ...newItems]);
      showToast(`Added ${newItems.length} PDF${newItems.length > 1 ? 's' : ''}.`, 'success');
    }

    if (mergeInputRef.current) {
      mergeInputRef.current.value = '';
    }
  };

  const handleMoveFile = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= mergeFiles.length) return;

    setMergeFiles((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const handleRemoveMergeFile = (id: string) => {
    setMergeFiles((prev) => prev.filter((item) => item.id !== id));
  };

  const handleResetMerge = () => {
    if (mergedBlobUrl) URL.revokeObjectURL(mergedBlobUrl);
    setMergeFiles([]);
    setMergedBlobUrl(null);
    setMergedSize(0);
    if (mergeInputRef.current) mergeInputRef.current.value = '';
    showToast('Merge queue cleared.', 'info');
  };

  const handleExecuteMerge = async () => {
    const validFiles = mergeFiles.filter((f) => f.status === 'ready' && f.buffer.byteLength > 0);
    if (validFiles.length < 2) {
      showToast('Please add at least 2 valid PDF documents to merge.', 'error');
      return;
    }

    setIsMerging(true);
    showToast('Merging PDF files in browser memory...', 'info');

    try {
      const { PDFDocument } = await import('pdf-lib');
      const mergedPdf = await PDFDocument.create();

      for (let i = 0; i < validFiles.length; i++) {
        const item = validFiles[i];
        const srcPdf = await PDFDocument.load(item.buffer);
        const copiedPages = await mergedPdf.copyPages(srcPdf, srcPdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes as unknown as BlobPart], { type: 'application/pdf' });

      if (mergedBlobUrl) URL.revokeObjectURL(mergedBlobUrl);
      const url = URL.createObjectURL(blob);

      setMergedBlobUrl(url);
      setMergedSize(blob.size);
      showToast('Merged successfully! Ready to download.', 'success');
    } catch {
      showToast('Merge failed. One or more files could not be processed.', 'error');
    } finally {
      setIsMerging(false);
    }
  };

  // ================= SPLIT TAB HANDLERS =================
  const handleSplitFileSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0];

    if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) {
      showToast('Please select a valid PDF file.', 'error');
      return;
    }

    if (f.size > 25 * 1024 * 1024) {
      showToast('File exceeds 25 MB mobile limit.', 'error');
      return;
    }

    try {
      const buffer = await f.arrayBuffer();
      const { PDFDocument } = await import('pdf-lib');

      try {
        const doc = await PDFDocument.load(buffer, { ignoreEncryption: false });
        const count = doc.getPageCount();

        setSplitFile({
          file: f,
          name: f.name,
          size: f.size,
          buffer,
          pageCount: count,
        });

        // Set sensible initial page range
        setPageRangeInput(count > 1 ? `1-${Math.min(count, 3)}` : '1');
        if (splitBlobUrl) URL.revokeObjectURL(splitBlobUrl);
        setSplitBlobUrl(null);
        showToast(`Loaded "${f.name}" (${count} pages).`, 'success');
      } catch (err: any) {
        const msg = err?.message?.toLowerCase() || '';
        if (msg.includes('encrypt') || msg.includes('password')) {
          showToast('This PDF is password-protected. For security and privacy, we cannot open password-encrypted PDFs.', 'error');
        } else {
          showToast('Could not read PDF. File may be corrupted.', 'error');
        }
      }
    } catch {
      showToast('Failed to read file from disk.', 'error');
    }

    if (splitInputRef.current) {
      splitInputRef.current.value = '';
    }
  };

  const handleResetSplit = () => {
    if (splitBlobUrl) URL.revokeObjectURL(splitBlobUrl);
    setSplitFile(null);
    setSplitBlobUrl(null);
    setSplitResultName('');
    setSplitResultSize(0);
    if (splitInputRef.current) splitInputRef.current.value = '';
    showToast('Split selection cleared.', 'info');
  };

  // Parse comma-separated page ranges: e.g. "1-3, 5, 8-10"
  const parsePageRanges = (input: string, maxPages: number): number[] => {
    const indices: Set<number> = new Set();
    const parts = input.split(',').map((p) => p.trim()).filter(Boolean);

    for (const part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-').map((s) => s.trim());
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);

        if (!isNaN(start) && !isNaN(end)) {
          const s = Math.max(1, Math.min(start, end));
          const e = Math.min(maxPages, Math.max(start, end));
          for (let p = s; p <= e; p++) {
            indices.add(p - 1); // 0-indexed for pdf-lib
          }
        }
      } else {
        const pageNum = parseInt(part, 10);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= maxPages) {
          indices.add(pageNum - 1);
        }
      }
    }

    return Array.from(indices).sort((a, b) => a - b);
  };

  const handleExecuteSplit = async () => {
    if (!splitFile) return;

    setIsSplitting(true);
    showToast('Splitting PDF in browser RAM...', 'info');

    try {
      const { PDFDocument } = await import('pdf-lib');
      const baseName = splitFile.name.substring(0, splitFile.name.lastIndexOf('.')) || splitFile.name;

      if (splitMode === 'range') {
        const targetIndices = parsePageRanges(pageRangeInput, splitFile.pageCount);

        if (targetIndices.length === 0) {
          showToast(`Invalid page range. Please choose pages between 1 and ${splitFile.pageCount}.`, 'error');
          setIsSplitting(false);
          return;
        }

        const srcDoc = await PDFDocument.load(splitFile.buffer);
        const newDoc = await PDFDocument.create();
        const copied = await newDoc.copyPages(srcDoc, targetIndices);
        copied.forEach((p) => newDoc.addPage(p));

        const bytes = await newDoc.save();
        const blob = new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' });

        if (splitBlobUrl) URL.revokeObjectURL(splitBlobUrl);
        const url = URL.createObjectURL(blob);

        const outName = `${baseName}-extracted-pages.pdf`;
        setSplitBlobUrl(url);
        setSplitResultName(outName);
        setSplitResultSize(blob.size);
        showToast(`Extracted ${targetIndices.length} page(s) successfully!`, 'success');
      } else {
        // Mode: Every page as its own file (ZIP)
        const { default: JSZip } = await import('jszip');
        const zip = new JSZip();
        const srcDoc = await PDFDocument.load(splitFile.buffer);

        for (let i = 0; i < splitFile.pageCount; i++) {
          const singleDoc = await PDFDocument.create();
          const [copiedPage] = await singleDoc.copyPages(srcDoc, [i]);
          singleDoc.addPage(copiedPage);
          const singleBytes = await singleDoc.save();
          zip.file(`${baseName}-page-${i + 1}.pdf`, singleBytes);
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        if (splitBlobUrl) URL.revokeObjectURL(splitBlobUrl);
        const url = URL.createObjectURL(zipBlob);

        const outName = `${baseName}-all-pages.zip`;
        setSplitBlobUrl(url);
        setSplitResultName(outName);
        setSplitResultSize(zipBlob.size);
        showToast(`Unpacked all ${splitFile.pageCount} pages into ZIP archive!`, 'success');
      }
    } catch {
      showToast('Failed to split PDF. File may be corrupted.', 'error');
    } finally {
      setIsSplitting(false);
    }
  };

  const handleDownloadMerged = () => {
    if (!mergedBlobUrl) return;
    const link = document.createElement('a');
    link.href = mergedBlobUrl;
    link.download = `smarttoolhub-merged-${Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Downloaded merged PDF', 'success');
  };

  const handleDownloadSplit = () => {
    if (!splitBlobUrl) return;
    const link = document.createElement('a');
    link.href = splitBlobUrl;
    link.download = splitResultName || 'smarttoolhub-split-document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloaded ${splitResultName}`, 'success');
  };

  const totalMergePages = mergeFiles
    .filter((f) => f.status === 'ready' && f.pageCount)
    .reduce((sum, f) => sum + (f.pageCount || 0), 0);

  const faqs: ToolFaqItem[] = [
    {
      question: 'Can I merge password-protected PDF files?',
      answer:
        'No. For security and privacy reasons, we cannot open password-encrypted PDFs. To merge a protected file, first open it in your computer or phone PDF viewer, enter your password, and export an unencrypted copy using "Print to PDF".',
    },
    {
      question: 'How do I rearrange the order of pages before merging?',
      answer:
        'In the Merge tab, each uploaded document card includes dedicated Up and Down arrow buttons. Click or tap the arrows to position the files in your desired sequence before clicking "Merge PDFs".',
    },
    {
      question: 'How does the page range syntax work for splitting?',
      answer:
        'You can specify individual pages or ranges separated by commas. For example, typing "1-3, 5, 8-10" will extract pages 1, 2, 3, 5, 8, 9, and 10 into a brand-new consolidated PDF document in that exact order.',
    },
    {
      question: 'Are my confidential documents uploaded to any remote server?',
      answer:
        'Never. SmartToolHub executes 100% locally in your browser memory using WebAssembly and pdf-lib. Your financial records, tax forms, and signed agreements never travel across the internet.',
    },
  ];

  const schemaJson = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        'name': 'PDF Merge & Split',
        'applicationCategory': 'UtilitiesApplication',
        'operatingSystem': 'All',
        'url': 'https://smarttoolhub.net/tools/pdf-merge-split',
        'description':
          'Combine multiple PDF documents or split pages and custom ranges into individual files. 100% private in-browser execution with zero uploads.',
        'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
        'creator': { '@type': 'Person', 'name': 'Dhrumil Aslaliya' },
      },
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://smarttoolhub.net' },
          { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': 'https://smarttoolhub.net/tools' },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'PDF Merge & Split',
            'item': 'https://smarttoolhub.net/tools/pdf-merge-split',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        'mainEntity': faqs.map((f) => ({
          '@type': 'Question',
          'name': f.question,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': f.answer,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />

      <ToolPageTemplate
        tool={tool}
        heading="PDF Merge & Split"
        subheading="Combine multiple PDF documents or extract custom page ranges into individual files. 100% private in-browser execution with zero uploads."
        inputLabel="Select or drop PDF documents"
        inputPlaceholder=""
        examplePrompt=""
        exampleChips={exampleChips}
        relatedTools={relatedTools}
        relatedGuide={relatedGuide}
        lastUpdated="October 2026"
        navigate={navigate}
        faq={faqs}
        tips={[
          'Reorder documents before merging using the up/down arrows to ensure title sheets and appendices stay in order.',
          'Use comma-separated ranges like 1-3, 5, 8-10 to extract specific chapters from thick documents in one step.',
          'Selecting "Every page as its own file" is the quickest way to unpack scanned multi-page receipts into individual files.',
          'Password-encrypted PDFs must be decrypted prior to uploading: open the file and choose Print to PDF first.',
        ]}
        workedExample={{
          title: 'Assembling a Freelance Proposal & Tax Package on Mobile',
          scenario:
            'A designer needed to submit a 3-part PDF packet (signed agreement, W-9 tax form, and invoice) from their smartphone, but only had separate downloads.',
          output:
            'Using SmartToolHub Merge tab, they uploaded all 3 PDFs (totalling 7 pages), ordered them with the arrow buttons, and merged them into a unified 1.8 MB document in 1.2 seconds without installing third-party apps.',
        }}
        howToUseSteps={[
          {
            step: 'Choose your mode: Merge or Split',
            text: 'Switch between the Merge tab to combine multiple documents or the Split tab to extract custom page numbers.',
          },
          {
            step: 'Select files and configure pages',
            text: 'Drop your PDFs into the browser. Review page counts per file, reorder documents, or input comma-separated page ranges.',
          },
          {
            step: 'Process and save locally',
            text: 'Click Merge or Split. Download your combined PDF or ZIP package immediately with zero cloud tracking.',
          },
        ]}
        whatItDoesContent={
          <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
            <p>
              SmartToolHub <strong>PDF Merge &amp; Split</strong> is a dual-function document utility engineered to handle everyday PDF assembly and extraction tasks entirely inside your web browser. Conventional online PDF editors upload your sensitive records to remote cloud servers for processing, exposing private financial details, medical forms, and client contracts to external logging.
            </p>
            <p>
              By leveraging WebAssembly and the <code>pdf-lib</code> engine, this utility runs 100% client-side inside your computer or smartphone RAM. Documents are parsed, page trees are merged or split, and new binary files are encoded on-device.
            </p>
            <div className="p-4 rounded-xl bg-purple-50/80 border border-purple-200/80 text-purple-900 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-purple-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero Server Uploads &amp; Password Safety</span>
              </div>
              <p className="text-xs">
                Your files never leave your device. For security, password-protected PDFs are refused upfront with a friendly notification rather than sending authentication hashes across a network.
              </p>
            </div>
          </div>
        }
        extraControls={
          <div className="space-y-6">
            {/* Privacy Guarantee Banner */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center justify-between gap-3 text-emerald-800">
              <div className="flex items-center gap-2.5 text-sm font-medium">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Your files never leave your device. All PDF operations run locally in browser memory.</span>
              </div>
              <span className="hidden sm:inline-block text-xs bg-emerald-500/20 px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider text-emerald-800">
                100% Offline
              </span>
            </div>

            {/* Presets Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <span className="text-xs font-semibold text-gray-500 shrink-0">Presets:</span>
              {exampleChips.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (idx === 0) {
                      setActiveTab('merge');
                    } else if (idx === 1) {
                      setActiveTab('split');
                      setSplitMode('range');
                      setPageRangeInput('1-3');
                    } else {
                      setActiveTab('split');
                      setSplitMode('all');
                    }
                    showToast(`Switched to: ${chip.split(':')[0]}`, 'info');
                  }}
                  className="text-xs bg-white border border-gray-200 hover:border-purple-300 hover:text-purple-700 text-gray-700 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors shadow-2xs cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Two Tabs Header */}
            <div className="flex items-center bg-gray-100 p-1.5 rounded-2xl border border-gray-200 max-w-md mx-auto">
              <button
                type="button"
                onClick={() => setActiveTab('merge')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'merge'
                    ? 'bg-white text-purple-900 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Combine className="w-4 h-4 text-purple-600" />
                <span>Merge PDFs</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('split')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'split'
                    ? 'bg-white text-purple-900 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Scissors className="w-4 h-4 text-purple-600" />
                <span>Split PDF</span>
              </button>
            </div>

            {/* TAB 1: MERGE CONTENT */}
            {activeTab === 'merge' && (
              <div className="space-y-5">
                {/* Dropzone */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleMergeFilesSelected(e.dataTransfer.files);
                  }}
                  className="border-2 border-dashed border-gray-300 hover:border-purple-400 bg-white rounded-3xl p-8 text-center transition-all cursor-pointer group shadow-xs"
                  onClick={() => mergeInputRef.current?.click()}
                >
                  <input
                    ref={mergeInputRef}
                    type="file"
                    multiple
                    accept="application/pdf,.pdf"
                    onChange={(e) => handleMergeFilesSelected(e.target.files)}
                    className="hidden"
                  />
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Combine className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    Drop PDF files to merge or <span className="text-purple-600 underline">browse files</span>
                  </h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto mb-3">
                    Add multiple PDF files (up to 20 files, max 25 MB each). Reorder with drag handles or arrow buttons.
                  </p>
                  <div className="inline-flex items-center gap-2 text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full font-medium">
                    <FileText className="w-3.5 h-3.5 text-gray-500" />
                    <span>Page counts detected instantly in browser</span>
                  </div>
                </div>

                {/* Queue & Controls */}
                {mergeFiles.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-gray-200 rounded-2xl p-4">
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">
                          Merge Queue ({mergeFiles.length} file{mergeFiles.length > 1 ? 's' : ''})
                        </h4>
                        <p className="text-xs text-gray-500">
                          Total: {totalMergePages} page{totalMergePages !== 1 ? 's' : ''} across all documents
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleResetMerge}
                          className="text-gray-600 hover:text-red-600 gap-1.5"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Reset</span>
                        </Button>

                        <Button
                          variant="primary"
                          size="sm"
                          onClick={handleExecuteMerge}
                          disabled={isMerging || mergeFiles.filter((f) => f.status === 'ready').length < 2}
                          isLoading={isMerging}
                          loadingLabel="Merging..."
                          className="gap-1.5"
                        >
                          <Combine className="w-3.5 h-3.5" />
                          <span>Merge {mergeFiles.length} PDFs</span>
                        </Button>

                        {mergedBlobUrl && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleDownloadMerged}
                            className="gap-1.5"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download ({formatFileSize(mergedSize)})</span>
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* File List */}
                    <div className="space-y-2">
                      {mergeFiles.map((item, idx) => (
                        <div
                          key={item.id}
                          className="bg-white border border-gray-200 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-2xs hover:border-purple-200 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="w-6 h-6 rounded-lg bg-gray-100 text-gray-600 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate" title={item.name}>
                                {item.name}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>{formatFileSize(item.size)}</span>
                                {item.pageCount !== undefined && (
                                  <>
                                    <span>&bull;</span>
                                    <span className="font-semibold text-purple-700">
                                      {item.pageCount} page{item.pageCount !== 1 ? 's' : ''}
                                    </span>
                                  </>
                                )}
                              </div>
                              {item.status === 'error' && (
                                <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-0.5">
                                  <AlertCircle className="w-3 h-3 shrink-0" />
                                  <span>{item.errorMessage}</span>
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Reorder and Delete Controls */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleMoveFile(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1.5 rounded-lg text-gray-500 hover:text-purple-600 hover:bg-purple-50 disabled:opacity-30 transition-colors cursor-pointer"
                              title="Move up"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveFile(idx, 'down')}
                              disabled={idx === mergeFiles.length - 1}
                              className="p-1.5 rounded-lg text-gray-500 hover:text-purple-600 hover:bg-purple-50 disabled:opacity-30 transition-colors cursor-pointer"
                              title="Move down"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveMergeFile(item.id)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Remove file"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: SPLIT CONTENT */}
            {activeTab === 'split' && (
              <div className="space-y-5">
                {!splitFile ? (
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleSplitFileSelected(e.dataTransfer.files);
                    }}
                    className="border-2 border-dashed border-gray-300 hover:border-purple-400 bg-white rounded-3xl p-8 text-center transition-all cursor-pointer group shadow-xs"
                    onClick={() => splitInputRef.current?.click()}
                  >
                    <input
                      ref={splitInputRef}
                      type="file"
                      accept="application/pdf,.pdf"
                      onChange={(e) => handleSplitFileSelected(e.target.files)}
                      className="hidden"
                    />
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Scissors className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      Drop a PDF file to split or <span className="text-purple-600 underline">browse file</span>
                    </h3>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto mb-3">
                      Select 1 PDF file (up to 25 MB). Extract custom page ranges or separate every page.
                    </p>
                    <div className="inline-flex items-center gap-2 text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full font-medium">
                      <Info className="w-3.5 h-3.5 text-gray-500" />
                      <span>Friendly handling of encrypted files</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-6">
                    {/* Selected File Card */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate" title={splitFile.name}>
                            {splitFile.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(splitFile.size)} &bull;{' '}
                            <span className="font-semibold text-purple-700">
                              {splitFile.pageCount} total pages
                            </span>
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleResetSplit}
                        className="text-gray-500 hover:text-red-600"
                      >
                        Change File
                      </Button>
                    </div>

                    {/* Split Modes */}
                    <div className="space-y-4">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Choose Split Method
                      </label>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setSplitMode('range')}
                          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                            splitMode === 'range'
                              ? 'border-purple-600 bg-purple-50 text-purple-900 shadow-2xs'
                              : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-bold">Custom Page Range</span>
                            {splitMode === 'range' && <Check className="w-4 h-4 text-purple-600" />}
                          </div>
                          <p className="text-xs text-gray-500">
                            Extract specific pages or ranges (e.g. 1-3, 5, 8-10) into a single PDF.
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSplitMode('all')}
                          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                            splitMode === 'all'
                              ? 'border-purple-600 bg-purple-50 text-purple-900 shadow-2xs'
                              : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-bold">Every Page as Own File</span>
                            {splitMode === 'all' && <Check className="w-4 h-4 text-purple-600" />}
                          </div>
                          <p className="text-xs text-gray-500">
                            Extract every page individually and package them into a single ZIP archive.
                          </p>
                        </button>
                      </div>

                      {splitMode === 'range' && (
                        <div className="space-y-2 pt-2">
                          <label className="block text-xs font-semibold text-gray-700">
                            Page Numbers or Ranges (1 to {splitFile.pageCount}):
                          </label>
                          <input
                            type="text"
                            value={pageRangeInput}
                            onChange={(e) => setPageRangeInput(e.target.value)}
                            placeholder="e.g. 1-3, 5, 8-10"
                            className="w-full text-sm font-mono p-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-hidden focus:border-purple-600 focus:bg-white transition-all"
                          />
                          <p className="text-[11px] text-gray-500">
                            Example: &ldquo;1-3, 5&rdquo; creates a 4-page PDF containing pages 1, 2, 3, and 5.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-gray-100">
                      <Button
                        variant="primary"
                        size="md"
                        onClick={handleExecuteSplit}
                        disabled={isSplitting}
                        isLoading={isSplitting}
                        loadingLabel="Splitting..."
                        className="w-full sm:w-auto gap-2"
                      >
                        <Scissors className="w-4 h-4" />
                        <span>
                          {splitMode === 'range' ? 'Extract Pages to PDF' : `Unpack All ${splitFile.pageCount} Pages (ZIP)`}
                        </span>
                      </Button>

                      {splitBlobUrl && (
                        <Button
                          variant="secondary"
                          size="md"
                          onClick={handleDownloadSplit}
                          className="w-full sm:w-auto gap-2 text-purple-900 border-purple-200 bg-purple-50 hover:bg-purple-100"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download {splitResultName} ({formatFileSize(splitResultSize)})</span>
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        }
      />

      {/* Mobile Sticky Action Bar */}
      {((activeTab === 'merge' && mergeFiles.length > 0) || (activeTab === 'split' && splitFile)) && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 sm:hidden shadow-lg flex items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="text-xs font-bold text-gray-900 block truncate">
              {activeTab === 'merge'
                ? `${mergeFiles.length} PDF${mergeFiles.length > 1 ? 's' : ''} queued`
                : `${splitFile?.pageCount} total pages`}
            </span>
            <span className="text-[11px] text-gray-500">
              {activeTab === 'merge'
                ? mergedBlobUrl ? 'Ready to download' : 'Ready to merge'
                : splitBlobUrl ? 'Extracted' : 'Ready to split'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {activeTab === 'merge' ? (
              mergedBlobUrl ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleDownloadMerged}
                  className="gap-1 px-3"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleExecuteMerge}
                  disabled={isMerging || mergeFiles.filter((f) => f.status === 'ready').length < 2}
                  isLoading={isMerging}
                  className="gap-1 px-3"
                >
                  <Combine className="w-3.5 h-3.5" />
                  <span>Merge</span>
                </Button>
              )
            ) : splitBlobUrl ? (
              <Button
                variant="primary"
                size="sm"
                onClick={handleDownloadSplit}
                className="gap-1 px-3"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={handleExecuteSplit}
                disabled={isSplitting}
                isLoading={isSplitting}
                className="gap-1 px-3"
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>Split</span>
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
};
