import React, { useState, useRef, useEffect } from 'react';
import {
  Minimize2,
  Upload,
  Download,
  Trash2,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  Sliders,
  Archive,
  Image as ImageIcon,
  Eye,
  Info,
  X,
  ArrowRight,
} from 'lucide-react';
import { ToolPageTemplate, ToolFaqItem } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';
import { Button } from '../../components/ui/Button.tsx';
import { useToast } from '../../components/ui/Toast.tsx';

interface ImageCompressorConverterPageProps {
  navigate: (path: string) => void;
}

type OutputFormat = 'image/jpeg' | 'image/webp' | 'image/png' | 'image/avif';

interface ImageItem {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  originalWidth?: number;
  originalHeight?: number;
  originalPreviewUrl: string;
  status: 'idle' | 'compressing' | 'done' | 'error';
  errorMessage?: string;
  convertedBlobUrl?: string;
  convertedBlob?: Blob;
  convertedSize?: number;
  convertedWidth?: number;
  convertedHeight?: number;
}

export const ImageCompressorConverterPage: React.FC<ImageCompressorConverterPageProps> = ({ navigate }) => {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [format, setFormat] = useState<OutputFormat>('image/webp');
  const [quality, setQuality] = useState<number>(80); // 1-100
  const [enableResize, setEnableResize] = useState<boolean>(false);
  const [maxWidth, setMaxWidth] = useState<number>(1920);
  const [isAvifSupported, setIsAvifSupported] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [comparisonItem, setComparisonItem] = useState<ImageItem | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'image-compressor-converter') || LAUNCH_TOOLS[0];
  const relatedTools = LAUNCH_TOOLS.filter((t) => t.slug === 'heic-to-jpg-converter' || t.slug === 'image-to-pdf');
  const relatedGuide = POPULAR_GUIDES.find((g) => g.slug === 'how-to-compress-images-without-losing-quality') || POPULAR_GUIDES[0];

  const exampleChips = [
    'Web Banner: 1920px WebP at 80% quality',
    'Email Attachment: Downscale to 1280px JPG at 75%',
    'Lossless PNG: Strip overhead with 100% pixel fidelity',
  ];

  // Test AVIF encoding support in user's browser canvas
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      canvas.toBlob((blob) => {
        if (blob && blob.type === 'image/avif') {
          setIsAvifSupported(true);
        }
      }, 'image/avif');
    } catch {
      setIsAvifSupported(false);
    }
  }, []);

  // Track recent tool in localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('smarttoolhub_recent_tools');
      const recent = stored ? JSON.parse(stored) : [];
      const filtered = recent.filter((id: string) => id !== 'image-compressor-converter');
      localStorage.setItem('smarttoolhub_recent_tools', JSON.stringify(['image-compressor-converter', ...filtered].slice(0, 8)));
    } catch {
      // Ignore private browsing localStorage block
    }
  }, []);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      items.forEach((item) => {
        if (item.originalPreviewUrl) URL.revokeObjectURL(item.originalPreviewUrl);
        if (item.convertedBlobUrl) URL.revokeObjectURL(item.convertedBlobUrl);
      });
    };
  }, [items]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getExtensionForFormat = (fmt: OutputFormat): string => {
    switch (fmt) {
      case 'image/jpeg':
        return 'jpg';
      case 'image/png':
        return 'png';
      case 'image/webp':
        return 'webp';
      case 'image/avif':
        return 'avif';
      default:
        return 'jpg';
    }
  };

  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    const validFiles: File[] = [];
    const maxFiles = 20;
    const maxBytes = 25 * 1024 * 1024; // 25 MB

    if (items.length + fileList.length > maxFiles) {
      showToast(`Batch limit reached: you can process up to ${maxFiles} images at a time.`, 'error');
    }

    for (const f of fileList) {
      if (items.length + validFiles.length >= maxFiles) break;

      if (!f.type.startsWith('image/') && !f.name.match(/\.(jpe?g|png|webp|avif|bmp|gif)$/i)) {
        showToast(`Skipped "${f.name}": unsupported image format.`, 'error');
        continue;
      }

      if (f.size > maxBytes) {
        showToast(`Skipped "${f.name}": file exceeds 25 MB limit for mobile memory safety.`, 'error');
        continue;
      }

      validFiles.push(f);
    }

    if (validFiles.length === 0) return;

    const newItems: ImageItem[] = validFiles.map((file) => {
      const previewUrl = URL.createObjectURL(file);
      return {
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
        file,
        name: file.name,
        originalSize: file.size,
        originalPreviewUrl: previewUrl,
        status: 'idle',
      };
    });

    setItems((prev) => [...prev, ...newItems]);
    showToast(`Added ${newItems.length} image${newItems.length > 1 ? 's' : ''} to queue.`, 'success');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) {
        if (target.originalPreviewUrl) URL.revokeObjectURL(target.originalPreviewUrl);
        if (target.convertedBlobUrl) URL.revokeObjectURL(target.convertedBlobUrl);
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const handleReset = () => {
    items.forEach((item) => {
      if (item.originalPreviewUrl) URL.revokeObjectURL(item.originalPreviewUrl);
      if (item.convertedBlobUrl) URL.revokeObjectURL(item.convertedBlobUrl);
    });
    setItems([]);
    setComparisonItem(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    showToast('Reset completed. Memory freed.', 'info');
  };

  // Process a single image via Canvas
  const processSingleImage = async (
    item: ImageItem,
    targetFormat: OutputFormat,
    targetQuality: number,
    resizeActive: boolean,
    targetMaxWidth: number
  ): Promise<{ blob: Blob; width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          const origWidth = img.naturalWidth || img.width;
          const origHeight = img.naturalHeight || img.height;

          let finalWidth = origWidth;
          let finalHeight = origHeight;

          if (resizeActive && targetMaxWidth > 0 && origWidth > targetMaxWidth) {
            const ratio = targetMaxWidth / origWidth;
            finalWidth = Math.round(targetMaxWidth);
            finalHeight = Math.round(origHeight * ratio);
          }

          const canvas = document.createElement('canvas');
          canvas.width = finalWidth;
          canvas.height = finalHeight;
          const ctx = canvas.getContext('2d', { alpha: true });

          if (!ctx) {
            reject(new Error('Canvas 2D context unavailable'));
            return;
          }

          if (targetFormat === 'image/jpeg') {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, finalWidth, finalHeight);
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, finalWidth, finalHeight);

          const qualityParam = targetFormat === 'image/png' ? undefined : targetQuality / 100;

          canvas.toBlob(
            (blob) => {
              canvas.width = 0;
              canvas.height = 0;

              if (blob) {
                resolve({ blob, width: finalWidth, height: finalHeight });
              } else {
                reject(new Error('Failed to encode image to selected format'));
              }
            },
            targetFormat,
            qualityParam
          );
        } catch (err: any) {
          reject(err);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image file into browser decoder'));
      };

      img.src = item.originalPreviewUrl;
    });
  };

  const handleStartProcessing = async () => {
    if (items.length === 0 || isProcessing) return;

    setIsProcessing(true);
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < items.length; i++) {
      const current = items[i];

      setItems((prev) =>
        prev.map((it, idx) => (idx === i ? { ...it, status: 'compressing', errorMessage: undefined } : it))
      );

      try {
        const { blob, width, height } = await processSingleImage(
          current,
          format,
          quality,
          enableResize,
          maxWidth
        );

        const convertedUrl = URL.createObjectURL(blob);

        setItems((prev) =>
          prev.map((it, idx) => {
            if (idx === i) {
              if (it.convertedBlobUrl) URL.revokeObjectURL(it.convertedBlobUrl);
              return {
                ...it,
                status: 'done',
                convertedBlob: blob,
                convertedBlobUrl: convertedUrl,
                convertedSize: blob.size,
                convertedWidth: width,
                convertedHeight: height,
              };
            }
            return it;
          })
        );
        successCount++;
      } catch (err: any) {
        failCount++;
        setItems((prev) =>
          prev.map((it, idx) =>
            idx === i
              ? {
                  ...it,
                  status: 'error',
                  errorMessage: err?.message || 'Compression failed. File may be corrupted.',
                }
              : it
          )
        );
      }

      await new Promise((r) => setTimeout(r, 50));
    }

    setIsProcessing(false);
    if (successCount > 0) {
      showToast(`Processed ${successCount} image${successCount > 1 ? 's' : ''} successfully!`, 'success');
    }
    if (failCount > 0) {
      showToast(`${failCount} image${failCount > 1 ? 's' : ''} could not be processed.`, 'error');
    }
  };

  const handleDownloadSingle = (item: ImageItem) => {
    if (!item.convertedBlobUrl) return;

    const baseName = item.name.substring(0, item.name.lastIndexOf('.')) || item.name;
    const ext = getExtensionForFormat(format);
    const downloadName = `${baseName}-compressed.${ext}`;

    const link = document.createElement('a');
    link.href = item.convertedBlobUrl;
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloaded ${downloadName}`, 'success');
  };

  const handleDownloadZip = async () => {
    const completedItems = items.filter((it) => it.status === 'done' && it.convertedBlob);
    if (completedItems.length === 0) {
      showToast('No completed images available to download.', 'error');
      return;
    }

    setIsZipping(true);
    showToast('Packing images into ZIP archive...', 'info');

    try {
      const { default: JSZip } = await import('jszip');
      const zip = new JSZip();
      const ext = getExtensionForFormat(format);

      completedItems.forEach((it) => {
        const baseName = it.name.substring(0, it.name.lastIndexOf('.')) || it.name;
        const filename = `${baseName}-compressed.${ext}`;
        if (it.convertedBlob) {
          zip.file(filename, it.convertedBlob);
        }
      });

      const content = await zip.generateAsync({ type: 'blob' });
      const zipUrl = URL.createObjectURL(content);

      const link = document.createElement('a');
      link.href = zipUrl;
      link.download = `smarttoolhub-compressed-images-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(zipUrl), 2000);
      showToast('ZIP archive downloaded successfully!', 'success');
    } catch {
      showToast('Could not generate ZIP archive. You can download files individually.', 'error');
    } finally {
      setIsZipping(false);
    }
  };

  const completedCount = items.filter((i) => i.status === 'done').length;
  const hasCompleted = completedCount > 0;

  const totalOriginalBytes = items
    .filter((i) => i.status === 'done' && i.convertedSize)
    .reduce((acc, curr) => acc + curr.originalSize, 0);

  const totalNewBytes = items
    .filter((i) => i.status === 'done' && i.convertedSize)
    .reduce((acc, curr) => acc + (curr.convertedSize || 0), 0);

  const totalSavedBytes = totalOriginalBytes - totalNewBytes;
  const totalSavedPercent =
    totalOriginalBytes > 0 && totalSavedBytes > 0
      ? Math.round((totalSavedBytes / totalOriginalBytes) * 100)
      : 0;

  const faqs: ToolFaqItem[] = [
    {
      question: 'How does image compression work without losing visible quality?',
      answer:
        'Lossy algorithms (JPEG, WebP, and AVIF) use perceptual quantization: they eliminate high-frequency chrominance data that human retinas cannot perceive at standard screen viewing distances while preserving edge contrast and sharpness. Tuning quality to 80% to 85% typically reduces file size by 60% to 75% with zero perceptible softness.',
    },
    {
      question: 'Why does PNG file size barely change after compression?',
      answer:
        'PNG is a 100% lossless format. It does not allow lossy quality degradation, meaning all original color values remain intact. To shrink PNG files, the most effective technique is dimensional resizing (e.g. capping width to 1920px or 1280px) or converting them to modern WebP format.',
    },
    {
      question: 'Are my photos or screenshots uploaded to a cloud server?',
      answer:
        'No. All decompression, canvas rendering, and format encoding execute 100% locally on your device within your web browser memory. Your images never leave your computer or phone, making this tool completely safe for private documents, contracts, and confidential photos.',
    },
    {
      question: 'Which format should I choose: WebP, JPEG, or AVIF?',
      answer:
        'For modern web usage, WebP is the recommended default because it delivers 25% to 35% smaller file sizes than JPEG with identical quality and supports transparency. Choose JPEG for legacy compatibility with older email clients or office software, and PNG if you need transparent backgrounds without any lossy compression.',
    },
  ];

  const schemaJson = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        'name': 'Image Compressor & Converter',
        'applicationCategory': 'UtilitiesApplication',
        'operatingSystem': 'All',
        'url': 'https://smarttoolhub.net/tools/image-compressor-converter',
        'description':
          'Free in-browser image compressor and converter. Batch compress JPG, PNG, WebP, and AVIF with custom quality and dimensional downscaling.',
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
            'name': 'Image Compressor & Converter',
            'item': 'https://smarttoolhub.net/tools/image-compressor-converter',
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
        heading="Image Compressor & Converter"
        subheading="Batch compress and convert JPG, PNG, WebP, and AVIF images with custom quality and max-width resizing. 100% private in-browser canvas processing."
        inputLabel="Select or drop images"
        inputPlaceholder=""
        examplePrompt=""
        exampleChips={exampleChips}
        relatedTools={relatedTools}
        relatedGuide={relatedGuide}
        lastUpdated="October 2026"
        navigate={navigate}
        faq={faqs}
        tips={[
          'Quality setting 80 offers the sweet spot: dramatic 60% to 75% size reductions with zero discernible softness.',
          'Resize oversized camera resolutions: downscaling from 8000px to 1920px cuts 95% of raw pixel data before compression even begins.',
          'PNG is lossless so savings are small; to reduce transparent images drastically, convert to WebP which supports full alpha transparency.',
          'Your images are processed sequentially 1-by-1 in RAM to protect mobile devices from running out of memory.',
        ]}
        workedExample={{
          title: 'Compressing a 12MP Smartphone Camera Photo for Web Publishing',
          scenario:
            'A content creator took a 4032 x 3024 px photo on an iPhone (6.2 MB JPG) that was too heavy for email attachments and bogged down mobile page loading speeds.',
          output:
            'Using SmartToolHub with WebP format, 80% quality, and 1920px max-width resize, the file compressed from 6.2 MB down to 340 KB (a 94.5% reduction) in 0.8 seconds locally on their device with razor-sharp fidelity.',
        }}
        howToUseSteps={[
          {
            step: 'Select or drop your images',
            text: 'Drop up to 20 JPG, PNG, WebP, or AVIF files (up to 25 MB each) into the dropzone. Processing executes 100% locally in your browser memory.',
          },
          {
            step: 'Configure format, quality, and max width',
            text: 'Choose WebP, JPG, PNG, or AVIF. Adjust the quality slider and optionally enable Max Width downscaling for oversized DSLR or smartphone shots.',
          },
          {
            step: 'Compress and download your files',
            text: 'Click Compress All. Compare before/after results with interactive side-by-side previews, and download individual files or a single ZIP archive.',
          },
        ]}
        whatItDoesContent={
          <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
            <p>
              SmartToolHub <strong>Image Compressor &amp; Converter</strong> gives you full control over digital image optimization directly in your browser. Whether preparing high-resolution photography for blog headers, shrinking screenshots for email attachments, or modernizing an asset library to lightweight WebP format, this tool executes the entire pipeline with zero server uploads.
            </p>
            <p>
              By leveraging HTML5 Canvas and native browser decoding APIs, images are resampled and compressed inside your computer or phone RAM. High-frequency chrominance data is tuned using perceptual quantization to maximize compression ratios without visible artifacts.
            </p>
            <div className="p-4 rounded-xl bg-purple-50/80 border border-purple-200/80 text-purple-900 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-purple-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>On-Device Privacy &amp; Memory Safety</span>
              </div>
              <p className="text-xs">
                Your files never leave your device. All files are processed sequentially one by one, keeping memory consumption safe on phones and low-spec laptops. Once you click Reset, all cached blobs and canvas instances are destroyed immediately.
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
                <span>Your files never leave your device. All compression runs client-side in your browser RAM.</span>
              </div>
              <span className="hidden sm:inline-block text-xs bg-emerald-500/20 px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider text-emerald-800">
                100% Offline
              </span>
            </div>

            {/* Quick Example Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <span className="text-xs font-semibold text-gray-500 shrink-0">Presets:</span>
              {exampleChips.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (idx === 0) {
                      setFormat('image/webp');
                      setQuality(80);
                      setEnableResize(true);
                      setMaxWidth(1920);
                    } else if (idx === 1) {
                      setFormat('image/jpeg');
                      setQuality(75);
                      setEnableResize(true);
                      setMaxWidth(1280);
                    } else {
                      setFormat('image/png');
                      setEnableResize(false);
                    }
                    showToast(`Applied preset: ${chip.split(':')[0]}`, 'info');
                  }}
                  className="text-xs bg-white border border-gray-200 hover:border-purple-300 hover:text-purple-700 text-gray-700 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors shadow-2xs cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Settings Card */}
            <div className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2 text-gray-900 font-bold">
                  <Sliders className="w-5 h-5 text-purple-600" />
                  <span>Compression &amp; Format Options</span>
                </div>
                <span className="text-xs text-gray-500 font-medium">Sequential processing</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Format Selection */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                    Output Format
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'image/webp', label: 'WebP', note: 'Recommended' },
                      { id: 'image/jpeg', label: 'JPG', note: 'Universal' },
                      { id: 'image/png', label: 'PNG', note: 'Lossless' },
                      ...(isAvifSupported ? [{ id: 'image/avif', label: 'AVIF', note: 'Next-Gen' }] : []),
                    ].map((fmt) => (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => setFormat(fmt.id as OutputFormat)}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                          format === fmt.id
                            ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold shadow-2xs'
                            : 'border-gray-200 bg-gray-50/50 hover:bg-gray-100 text-gray-700 font-medium'
                        }`}
                      >
                        <span className="text-sm">{fmt.label}</span>
                        <span className="text-[10px] opacity-75 font-normal">{fmt.note}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quality Slider (Lossy) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Quality Level: <span className="text-purple-600 font-bold text-sm">{quality}%</span>
                    </label>
                    <span className="text-xs text-gray-500">
                      {quality >= 85 ? 'High Fidelity' : quality >= 70 ? 'Balanced (Best)' : 'Aggressive'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    disabled={format === 'image/png'}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full accent-purple-600 cursor-pointer disabled:opacity-40"
                  />
                  {format === 'image/png' ? (
                    <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-2.5 mt-2 flex items-start gap-1.5">
                      <Info className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>PNG is a lossless format, so quality compression applies only when converting to JPG/WebP/AVIF. PNG savings come primarily from dimensional downscaling or metadata stripping.</span>
                    </p>
                  ) : (
                    <div className="flex justify-between text-[11px] text-gray-500 mt-1">
                      <span>10% (Smallest)</span>
                      <span>80% (Sweet Spot)</span>
                      <span>100% (Crispest)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Optional Dimensional Resizing */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={enableResize}
                      onChange={(e) => setEnableResize(e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                    />
                    <div>
                      <span className="text-sm font-semibold text-gray-900">Resize by Max Width</span>
                      <span className="text-xs text-gray-500 block">
                        Scale down oversized smartphone and DSLR resolutions proportionally
                      </span>
                    </div>
                  </label>

                  {enableResize && (
                    <div className="flex items-center gap-2">
                      {[
                        { label: '800px', val: 800 },
                        { label: '1280px', val: 1280 },
                        { label: '1920px (FHD)', val: 1920 },
                      ].map((preset) => (
                        <button
                          key={preset.val}
                          type="button"
                          onClick={() => setMaxWidth(preset.val)}
                          className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                            maxWidth === preset.val
                              ? 'bg-purple-600 text-white border-purple-600 font-semibold'
                              : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                      <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1">
                        <input
                          type="number"
                          min="200"
                          max="8000"
                          value={maxWidth}
                          onChange={(e) => setMaxWidth(Math.max(100, Number(e.target.value)))}
                          className="w-16 text-xs text-gray-800 bg-transparent text-right font-medium focus:outline-hidden"
                        />
                        <span className="text-[11px] text-gray-500">px</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Upload Dropzone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFilesSelected(e.dataTransfer.files);
              }}
              className="border-2 border-dashed border-gray-300 hover:border-purple-400 bg-white rounded-3xl p-8 text-center transition-all cursor-pointer group shadow-xs"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/avif,image/bmp,image/gif"
                onChange={(e) => handleFilesSelected(e.target.files)}
                className="hidden"
              />
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Upload className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Drop images here or <span className="text-purple-600 underline">browse files</span>
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mb-3">
                Supports JPG, PNG, WebP, AVIF, BMP. Up to 20 files, max 25 MB per file.
              </p>
              <div className="inline-flex items-center gap-2 text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full font-medium">
                <ImageIcon className="w-3.5 h-3.5 text-gray-500" />
                <span>Processed 1-by-1 in RAM to protect phone memory</span>
              </div>
            </div>

            {/* Queue & Results List */}
            {items.length > 0 && (
              <div className="space-y-4">
                {/* Queue Controls & Savings Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-gray-200 rounded-2xl p-4">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">
                      Selected Queue ({items.length} / 20)
                    </h4>
                    {hasCompleted && (
                      <p className="text-xs text-emerald-800 font-semibold mt-0.5">
                        Total saved: {formatFileSize(totalSavedBytes)} ({totalSavedPercent}% reduction)
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleReset}
                      className="text-gray-600 hover:text-red-600 gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </Button>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleStartProcessing}
                      disabled={isProcessing}
                      isLoading={isProcessing}
                      loadingLabel="Compressing..."
                      className="gap-1.5"
                    >
                      <Minimize2 className="w-3.5 h-3.5" />
                      <span>Compress All</span>
                    </Button>

                    {hasCompleted && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleDownloadZip}
                        disabled={isZipping}
                        className="gap-1.5"
                      >
                        <Archive className="w-3.5 h-3.5" />
                        <span>{isZipping ? 'Zipping...' : `ZIP (${completedCount})`}</span>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Individual Image Cards */}
                <div className="grid grid-cols-1 gap-3">
                  {items.map((item) => {
                    const savedBytes = item.convertedSize ? item.originalSize - item.convertedSize : 0;
                    const savedPct =
                      item.convertedSize && savedBytes > 0
                        ? Math.round((savedBytes / item.originalSize) * 100)
                        : 0;

                    return (
                      <div
                        key={item.id}
                        className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs hover:border-purple-200 transition-colors"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          {/* Thumbnail Preview */}
                          <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200 relative group">
                            <img
                              src={item.convertedBlobUrl || item.originalPreviewUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                            {item.status === 'done' && (
                              <button
                                type="button"
                                onClick={() => setComparisonItem(item)}
                                title="Compare Before & After"
                                className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          {/* File Details */}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-gray-900 truncate" title={item.name}>
                              {item.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                              <span>{formatFileSize(item.originalSize)}</span>
                              {item.status === 'done' && item.convertedSize && (
                                <>
                                  <ArrowRight className="w-3 h-3 text-gray-400" />
                                  <span className="font-semibold text-gray-900">
                                    {formatFileSize(item.convertedSize)}
                                  </span>
                                  <span className="text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-sm">
                                    -{savedPct}%
                                  </span>
                                </>
                              )}
                            </div>

                            {/* Error Notice */}
                            {item.status === 'error' && (
                              <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-1">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                <span>{item.errorMessage || 'Compression failed'}</span>
                              </p>
                            )}

                            {/* Progress state */}
                            {item.status === 'compressing' && (
                              <div className="flex items-center gap-2 mt-1.5">
                                <div className="h-1.5 w-32 bg-gray-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-purple-600 rounded-full animate-pulse w-3/4" />
                                </div>
                                <span className="text-[11px] text-purple-700 font-semibold">Processing...</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Card Action Buttons */}
                        <div className="flex items-center justify-end gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0">
                          {item.status === 'done' && (
                            <>
                              <button
                                type="button"
                                onClick={() => setComparisonItem(item)}
                                className="p-2 rounded-xl text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
                                title="Compare Before & After"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleDownloadSingle(item)}
                                className="gap-1.5"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Save</span>
                              </Button>
                            </>
                          )}

                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        }
      />

      {/* Interactive Side-by-Side Comparison Modal */}
      {comparisonItem && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="min-w-0">
                <h3 className="font-bold text-gray-900 truncate">{comparisonItem.name}</h3>
                <p className="text-xs text-gray-500">
                  Original: {formatFileSize(comparisonItem.originalSize)} &bull; Compressed:{' '}
                  {formatFileSize(comparisonItem.convertedSize || 0)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setComparisonItem(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50">
              {/* Before */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
                  <span>BEFORE (Original)</span>
                  <span>{formatFileSize(comparisonItem.originalSize)}</span>
                </div>
                <div className="aspect-4/3 bg-white rounded-2xl border border-gray-200 overflow-hidden flex items-center justify-center">
                  <img
                    src={comparisonItem.originalPreviewUrl}
                    alt="Original"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* After */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-purple-700">
                  <span>AFTER ({getExtensionForFormat(format).toUpperCase()})</span>
                  <span className="font-bold">
                    {formatFileSize(comparisonItem.convertedSize || 0)}
                  </span>
                </div>
                <div className="aspect-4/3 bg-white rounded-2xl border border-purple-200 overflow-hidden flex items-center justify-center">
                  <img
                    src={comparisonItem.convertedBlobUrl}
                    alt="Compressed"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-white flex justify-end gap-2">
              <Button variant="ghost" size="md" onClick={() => setComparisonItem(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  handleDownloadSingle(comparisonItem);
                  setComparisonItem(null);
                }}
                className="gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Download Compressed Image</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sticky Action Bar */}
      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 sm:hidden shadow-lg flex items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="text-xs font-bold text-gray-900 block truncate">
              {items.length} file{items.length > 1 ? 's' : ''} queued
            </span>
            <span className="text-[11px] text-gray-500">
              {hasCompleted ? `${completedCount} completed` : 'Ready to compress'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              variant="primary"
              size="sm"
              onClick={handleStartProcessing}
              disabled={isProcessing}
              isLoading={isProcessing}
              className="gap-1 px-3"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Compress</span>
            </Button>

            {hasCompleted && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDownloadZip}
                disabled={isZipping}
                className="gap-1 px-3"
              >
                <Archive className="w-3.5 h-3.5" />
                <span>ZIP</span>
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
};
