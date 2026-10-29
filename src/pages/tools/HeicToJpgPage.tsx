import React, { useState, useRef, useEffect } from 'react';
import {
  FileImage,
  Upload,
  Download,
  Trash2,
  RefreshCw,
  Check,
  AlertCircle,
  ShieldCheck,
  Sliders,
  Archive,
  Image as ImageIcon,
  Eye,
  Info,
} from 'lucide-react';
import { ToolPageTemplate, ToolFaqItem } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';
import { Button } from '../../components/ui/Button.tsx';
import { useToast } from '../../components/ui/Toast.tsx';

interface HeicToJpgPageProps {
  navigate: (path: string) => void;
}

type OutputFormat = 'image/jpeg' | 'image/png' | 'image/webp';

interface FileConversionItem {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  status: 'idle' | 'converting' | 'done' | 'error';
  errorMessage?: string;
  convertedBlobUrl?: string;
  convertedBlob?: Blob;
  convertedSize?: number;
  previewUrl?: string;
}

export const HeicToJpgPage: React.FC<HeicToJpgPageProps> = ({ navigate }) => {
  const [items, setItems] = useState<FileConversionItem[]>([]);
  const [format, setFormat] = useState<OutputFormat>('image/jpeg');
  const [quality, setQuality] = useState<number>(90); // 1-100
  const [isProcessing, setIsProcessing] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'heic-to-jpg-converter') || LAUNCH_TOOLS[0];
  const relatedTools = LAUNCH_TOOLS.filter((t) => t.slug === 'image-to-pdf' || t.slug === 'wallpaper-gradient-maker');
  const relatedGuide = POPULAR_GUIDES.find((g) => g.slug === 'convert-heic-to-jpg-iphone-mac-windows') || POPULAR_GUIDES[0];

  const exampleChips = [
    'Convert iPhone vacation photos to standard JPEG for Windows',
    'Export HEIC portrait photos to lossless PNG with location removed',
    'Compress HEIF photo burst to lightweight WebP for web upload',
  ];

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getExtensionForFormat = (fmt: OutputFormat): string => {
    switch (fmt) {
      case 'image/png':
        return 'png';
      case 'image/webp':
        return 'webp';
      case 'image/jpeg':
      default:
        return 'jpg';
    }
  };

  const getTargetFileName = (originalName: string, fmt: OutputFormat): string => {
    const ext = getExtensionForFormat(fmt);
    const lastDot = originalName.lastIndexOf('.');
    const base = lastDot !== -1 ? originalName.slice(0, lastDot) : originalName;
    return `${base}.${ext}`;
  };

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      items.forEach((item) => {
        if (item.convertedBlobUrl) URL.revokeObjectURL(item.convertedBlobUrl);
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      });
    };
  }, []);

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    const MAX_FILES = 20;
    const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

    const totalAllowed = MAX_FILES - items.length;
    if (totalAllowed <= 0) {
      showToast('Maximum 20 files allowed at one time. Please convert or reset current queue.');
      return;
    }

    const newItems: FileConversionItem[] = [];
    const filesToConsider = Array.from(selectedFiles).slice(0, totalAllowed);

    if (selectedFiles.length > totalAllowed) {
      showToast(`Added only ${totalAllowed} files to stay within the 20-file limit.`);
    }

    for (const file of filesToConsider) {
      const lower = file.name.toLowerCase();
      const isHeic = lower.endsWith('.heic') || lower.endsWith('.heif') || file.type.includes('heic') || file.type.includes('heif');

      if (!isHeic) {
        showToast(`Skipped "${file.name}": Please select .heic or .heif photo files.`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        showToast(`Skipped "${file.name}": File size exceeds the 25 MB limit.`);
        continue;
      }

      newItems.push({
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        file,
        name: file.name,
        originalSize: file.size,
        status: 'idle',
      });
    }

    if (newItems.length > 0) {
      setItems((prev) => [...prev, ...newItems]);
      showToast(`Added ${newItems.length} photo${newItems.length > 1 ? 's' : ''} to convert.`);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item?.convertedBlobUrl) URL.revokeObjectURL(item.convertedBlobUrl);
      if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  const handleReset = () => {
    items.forEach((item) => {
      if (item.convertedBlobUrl) URL.revokeObjectURL(item.convertedBlobUrl);
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    });
    setItems([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
    showToast('Queue reset and memory cleared.');
  };

  // Convert a single HEIC file safely with native decoding fallback to heic2any
  const convertSingleFile = async (
    item: FileConversionItem,
    targetFormat: OutputFormat,
    targetQuality: number
  ): Promise<{ blob: Blob; url: string; size: number }> => {
    const file = item.file;

    // Method A: Attempt native browser decoding via createImageBitmap (supported natively on Safari and modern Apple platforms)
    try {
      if (typeof createImageBitmap === 'function') {
        const bitmap = await createImageBitmap(file);
        const canvas = document.createElement('canvas');
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(bitmap, 0, 0);
          bitmap.close(); // Immediate memory cleanup

          const blobPromise = new Promise<Blob | null>((resolve) => {
            canvas.toBlob((b) => resolve(b), targetFormat, targetQuality / 100);
          });
          const resultBlob = await blobPromise;
          if (resultBlob && resultBlob.size > 0) {
            const url = URL.createObjectURL(resultBlob);
            return { blob: resultBlob, url, size: resultBlob.size };
          }
        }
      }
    } catch {
      // Native decoder not supported for this file or on this browser (Chrome/Firefox on Windows/Linux/Android)
      // Fall through to lazy-loaded heic2any
    }

    // Method B: Lazy-load heic2any library dynamically only when needed
    try {
      const heic2anyModule = await import('heic2any');
      const heic2any = heic2anyModule.default;

      const converted = await heic2any({
        blob: file,
        toType: targetFormat,
        quality: targetQuality / 100,
      });

      const outputBlob: Blob = Array.isArray(converted) ? converted[0] : converted;
      const url = URL.createObjectURL(outputBlob);
      return { blob: outputBlob, url, size: outputBlob.size };
    } catch (err: any) {
      throw new Error(err?.message || 'Could not decode HEIC image. The file may be corrupt or encrypted.');
    }
  };

  // Process all files sequentially (one-by-one to preserve mobile phone memory)
  const handleConvertAll = async () => {
    if (items.length === 0 || isProcessing) return;

    setIsProcessing(true);

    for (let i = 0; i < items.length; i++) {
      const current = items[i];
      if (current.status === 'done') continue; // Skip already converted

      // Update state to converting
      setItems((prev) =>
        prev.map((it, idx) => (idx === i ? { ...it, status: 'converting', errorMessage: undefined } : it))
      );

      try {
        const { blob, url, size } = await convertSingleFile(current, format, quality);

        // Update with success result
        setItems((prev) =>
          prev.map((it, idx) =>
            idx === i
              ? {
                  ...it,
                  status: 'done',
                  convertedBlob: blob,
                  convertedBlobUrl: url,
                  convertedSize: size,
                  previewUrl: url,
                }
              : it
          )
        );
      } catch (err: any) {
        // Individual error does NOT stop the rest of the batch
        setItems((prev) =>
          prev.map((it, idx) =>
            idx === i
              ? {
                  ...it,
                  status: 'error',
                  errorMessage: err?.message || 'Failed to decode HEIC file.',
                }
              : it
          )
        );
      }

      // Small tick between files to allow browser GC to breathe
      await new Promise((r) => setTimeout(r, 40));
    }

    setIsProcessing(false);
    showToast('Batch conversion finished!');
  };

  const handleDownloadSingle = (item: FileConversionItem) => {
    if (!item.convertedBlobUrl) return;
    const link = document.createElement('a');
    link.href = item.convertedBlobUrl;
    link.download = getTargetFileName(item.name, format);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloaded ${link.download}`);
  };

  const handleDownloadZip = async () => {
    const doneItems = items.filter((it) => it.status === 'done' && it.convertedBlob);
    if (doneItems.length === 0 || isZipping) return;

    setIsZipping(true);
    try {
      const jszipModule = await import('jszip');
      const JSZip = jszipModule.default;
      const zip = new JSZip();

      doneItems.forEach((item) => {
        if (item.convertedBlob) {
          const fileName = getTargetFileName(item.name, format);
          zip.file(fileName, item.convertedBlob);
        }
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const zipUrl = URL.createObjectURL(zipBlob);

      const link = document.createElement('a');
      link.href = zipUrl;
      link.download = `smarttoolhub-converted-photos-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(zipUrl);

      showToast(`Downloaded ${doneItems.length} photos in ZIP archive!`);
    } catch {
      showToast('Error creating ZIP archive. You can download images individually.');
    } finally {
      setIsZipping(false);
    }
  };

  const completedCount = items.filter((i) => i.status === 'done').length;
  const hasCompleted = completedCount > 0;

  const faqItems: ToolFaqItem[] = [
    {
      question: 'Is it safe to convert sensitive or family photos with this tool?',
      answer:
        'Yes, 100% safe. SmartToolHub operates client-side directly within your browser memory. Your HEIC photos never travel over the network or get saved to any cloud server or database.',
    },
    {
      question: 'Why do iPhones capture photos in HEIC format instead of JPG?',
      answer:
        'Apple introduced HEIC in iOS 11 because it uses advanced HEVC compression to cut file sizes roughly in half compared to traditional JPEGs without visible loss in quality. It also supports 16-bit color depth, transparency, and live photo image sequences.',
    },
    {
      question: 'How do I change my iPhone camera settings so it shoots in JPG directly?',
      answer:
        'Open Settings on your iPhone, tap "Camera", tap "Formats" at the top, and change the setting from "High Efficiency" to "Most Compatible". Note that exact menus can vary slightly by iOS version, but choosing "Most Compatible" ensures future photos are stored as standard JPGs.',
    },
    {
      question: 'Does converting HEIC to JPG remove my GPS location and camera data?',
      answer:
        'Yes. When photos are decoded and drawn through your browser canvas, private EXIF metadata including GPS coordinates and device serial numbers is automatically stripped. This is a significant privacy advantage when sharing photos publicly.',
    },
  ];

  return (
    <>
      <ToolPageTemplate
        tool={tool}
        heading="HEIC to JPG Converter"
        subheading="Batch convert iPhone HEIC & HEIF photos to JPG, PNG, or WebP. 100% private in-browser decoding with zero server uploads."
        inputLabel="Select or drop HEIC photos"
        inputPlaceholder=""
        examplePrompt=""
        exampleChips={exampleChips}
        relatedTools={relatedTools}
        relatedGuide={relatedGuide}
        lastUpdated="October 2026"
        navigate={navigate}
        faq={faqItems}
        tips={[
          'Quality setting 90 offers the ideal balance: visually indistinguishable from original with great file size reduction.',
          'Selecting PNG produces lossless output, perfect for high-contrast graphics or text screenshots.',
          'Convert up to 20 photos per batch. For huge camera rolls, process photos in batches of 10 to 15 for fastest performance.',
          'GPS location data is automatically removed from the output images for your safety.',
        ]}
        workedExample={{
          title: 'Converting iPhone 15 Pro Portrait Photos for Windows PC',
          scenario:
            'A user transferred 8 family photos (.HEIC, ~2.8 MB each) from an iPhone to a Windows 11 laptop, but the Windows Photos viewer failed to display thumbnails.',
          output:
            'Batch converted all 8 HEIC files to standard JPGs at 90% quality in under 4 seconds in the browser. Average size: 1.6 MB per photo. Downloaded as a single convenient ZIP with camera GPS data stripped.',
        }}
        howToUseSteps={[
          {
            step: 'Select or drop your HEIC/HEIF photos',
            text: 'Drop up to 20 HEIC files (up to 25 MB each) into the dropzone or tap Choose Files. Processing happens 100% in your browser.',
          },
          {
            step: 'Choose target format and compression quality',
            text: 'Pick JPG, PNG, or WebP. Use the quality slider (default 90) to fine-tune image file size.',
          },
          {
            step: 'Convert and save your photos',
            text: 'Tap Convert All. Download photos individually or grab all converted pictures together in a single ZIP file.',
          },
        ]}
        whatItDoesContent={
          <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
            <p>
              <strong>HEIC</strong> (High Efficiency Image Container) is the default image format adopted by Apple since iOS 11. Built on the modern HEVC video compression algorithm, HEIC allows your iPhone to capture high-resolution photos that consume up to 50% less storage space than legacy JPEG files while maintaining wide color fidelity.
            </p>
            <p>
              However, compatibility outside the Apple ecosystem remains patchy. Windows PCs without specialized codecs, Android phones, older smart TVs, and many employer document portals cannot open or render HEIC files.
            </p>
            <p>
              The <strong>SmartToolHub HEIC to JPG Converter</strong> solves this problem instantly and safely. Unlike common online file converters that require you to upload private family pictures to remote servers, our tool runs <strong>100% client-side</strong> using your browser’s built-in decoding capabilities and WebAssembly.
            </p>
            <div className="p-4 rounded-xl bg-purple-50/80 border border-purple-200/80 text-purple-900 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-purple-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Privacy &amp; Metadata Guarantee</span>
              </div>
              <p className="text-xs">
                Your files never leave your device. Furthermore, <strong>location and camera info is removed</strong> during the canvas conversion process, providing an important privacy safeguard before sharing photos on social platforms or classified sites.
              </p>
            </div>
          </div>
        }
        extraControls={
          <div className="space-y-6">
            {/* Top Dropzone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFileSelect(e.dataTransfer.files);
              }}
              className="border-2 border-dashed border-gray-300 hover:border-purple-600 rounded-2xl p-6 sm:p-8 text-center bg-gray-50/50 hover:bg-purple-50/30 transition-all cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".heic,.heif,.HEIC,.HEIF"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
                aria-label="Upload HEIC photos"
              />

              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
                <Upload className="w-6 h-6" />
              </div>

              <h3 className="text-base font-bold text-gray-900 mb-1">
                Drop your HEIC or HEIF photos here
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mb-3">
                Select up to 20 photos (max 25 MB per file). All conversions happen locally in your browser.
              </p>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-gray-200 text-[11px] font-medium text-gray-600 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Your files never leave your device</span>
              </div>
            </div>

            {/* Controls Bar: Format + Quality + Privacy Notice */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Format selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-800 uppercase tracking-wider font-mono">
                    Output Format
                  </label>
                  <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-xl max-w-xs">
                    {(
                      [
                        { id: 'image/jpeg', label: 'JPG' },
                        { id: 'image/png', label: 'PNG' },
                        { id: 'image/webp', label: 'WebP' },
                      ] as Array<{ id: OutputFormat; label: string }>
                    ).map((fmt) => (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => setFormat(fmt.id)}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                          format === fmt.id
                            ? 'bg-white text-purple-800 shadow-xs'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {fmt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quality slider (for JPG and WebP) */}
                {format !== 'image/png' && (
                  <div className="space-y-1.5 flex-1 max-w-xs">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-gray-800 uppercase tracking-wider font-mono">
                        Quality
                      </span>
                      <span className="font-mono font-bold text-purple-700">{quality}%</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={100}
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className="w-full accent-purple-700 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                      <span>Smaller file</span>
                      <span>Maximum clarity</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Honest Metadata Notice */}
              <div className="flex items-center gap-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                <Info className="w-4 h-4 text-purple-600 shrink-0" />
                <span>
                  <strong>Privacy Benefit:</strong> Location and camera info is removed during conversion.
                </span>
              </div>
            </div>

            {/* File Queue List */}
            {items.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-gray-800 uppercase tracking-wider font-mono">
                    Queue ({items.length} of 20)
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="text-xs text-gray-500 hover:text-red-600 font-medium transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {items.map((item) => {
                    const savedPct =
                      item.convertedSize && item.convertedSize < item.originalSize
                        ? Math.round(((item.originalSize - item.convertedSize) / item.originalSize) * 100)
                        : null;

                    return (
                      <div
                        key={item.id}
                        className="p-3 sm:p-3.5 rounded-xl bg-white border border-gray-200 flex items-center justify-between gap-3 shadow-xs"
                      >
                        {/* Thumbnail / Status icon */}
                        <div className="w-11 h-11 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center shrink-0 border border-gray-200">
                          {item.previewUrl ? (
                            <img
                              src={item.previewUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : item.status === 'converting' ? (
                            <RefreshCw className="w-5 h-5 text-purple-600 animate-spin" />
                          ) : (
                            <FileImage className="w-5 h-5 text-gray-400" />
                          )}
                        </div>

                        {/* File Details */}
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-gray-900 truncate">
                            {item.name}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                            <span>{formatFileSize(item.originalSize)}</span>
                            {item.convertedSize && (
                              <>
                                <span>&rarr;</span>
                                <span className="text-gray-700 font-semibold">
                                  {formatFileSize(item.convertedSize)}
                                </span>
                                {savedPct && savedPct > 0 && (
                                  <span className="text-emerald-600 font-semibold">
                                    (-{savedPct}%)
                                  </span>
                                )}
                              </>
                            )}
                          </div>

                          {item.status === 'error' && (
                            <div className="text-[11px] text-red-600 flex items-center gap-1 mt-0.5 font-medium">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">{item.errorMessage}</span>
                            </div>
                          )}
                        </div>

                        {/* Item Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          {item.status === 'done' ? (
                            <button
                              type="button"
                              onClick={() => handleDownloadSingle(item)}
                              className="px-2.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                              aria-label={`Download ${item.name}`}
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Download</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-gray-100 transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Primary Action Button */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleConvertAll}
                    disabled={isProcessing || items.every((i) => i.status === 'done')}
                    className="w-full sm:flex-1 font-bold gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Converting Photo by Photo...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Convert {items.length} HEIC Photos</span>
                      </>
                    )}
                  </Button>

                  {hasCompleted && (
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={handleDownloadZip}
                      disabled={isZipping}
                      className="w-full sm:w-auto font-semibold gap-2 border-purple-200 text-purple-800 hover:bg-purple-50"
                    >
                      <Archive className="w-4 h-4" />
                      <span>{isZipping ? 'Zipping...' : `Download All (${completedCount} ZIP)`}</span>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        }
      />
    </>
  );
};
