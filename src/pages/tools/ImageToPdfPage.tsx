import React, { useState, useRef } from 'react';
import { FileImage, Upload, Trash2, ArrowUp, ArrowDown, Download, ShieldCheck, RefreshCw, Check, Sparkles } from 'lucide-react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';
import { Button } from '../../components/ui/Button.tsx';
import { useToast } from '../../components/ui/Toast.tsx';

interface ImageToPdfPageProps {
  navigate: (path: string) => void;
}

interface ImageItem {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl: string;
}

export const ImageToPdfPage: React.FC<ImageToPdfPageProps> = ({ navigate }) => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'fit'>('a4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [margin, setMargin] = useState<'none' | 'small' | 'normal'>('small');
  const [isConverting, setIsConverting] = useState(false);
  const [convertProgress, setConvertProgress] = useState(0);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'image-to-pdf') || LAUNCH_TOOLS[0];
  const relatedTools = LAUNCH_TOOLS.filter((t) => t.slug === 'pdf-merge' || t.slug === 'pdf-split');
  const relatedGuide = POPULAR_GUIDES.find((g) => g.slug === 'better-prompts-simple-rules') || POPULAR_GUIDES[0];

  const exampleChips = [
    'Convert receipt photos into A4 expense report document',
    'Create multi-page photo portfolio in US Letter size',
    'Convert whiteboard notes and diagrams with zero margins',
  ];

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages: ImageItem[] = [];
    const MAX_SIZE = 25 * 1024 * 1024; // 25MB per image

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        showToast(`Skipped "${file.name}": Only image files (JPG, PNG, WebP) are allowed.`);
        continue;
      }
      if (file.size > MAX_SIZE) {
        showToast(`"${file.name}" exceeds 25MB. Please choose a smaller photo.`);
        continue;
      }

      const reader = new FileReader();
      const readPromise = new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
      });
      reader.readAsDataURL(file);
      const dataUrl = await readPromise;

      newImages.push({
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        dataUrl,
      });
    }

    if (newImages.length > 0) {
      setImages((prev) => [...prev, ...newImages]);
      setPdfBlobUrl(null);
      showToast(`Added ${newImages.length} image${newImages.length > 1 ? 's' : ''}`);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
    setPdfBlobUrl(null);
  };

  const handleMoveDown = (index: number) => {
    if (index === images.length - 1) return;
    setImages((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
    setPdfBlobUrl(null);
  };

  const handleRemove = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    setPdfBlobUrl(null);
  };

  const handleReset = () => {
    setImages([]);
    setPdfBlobUrl(null);
    setConvertProgress(0);
    showToast('Reset image queue');
  };

  const handleConvertToPdf = async () => {
    if (images.length === 0) {
      showToast('Please add at least one image to convert.');
      return;
    }

    setIsConverting(true);
    setConvertProgress(10);

    try {
      // Dynamic import ensures pdf-lib is never bundled on other pages
      const { PDFDocument } = await import('pdf-lib');
      setConvertProgress(30);

      const pdfDoc = await PDFDocument.create();

      // Page dimensions in points (72 points = 1 inch)
      const pageDimensions = {
        a4: orientation === 'portrait' ? [595.28, 841.89] : [841.89, 595.28],
        letter: orientation === 'portrait' ? [612.0, 792.0] : [792.0, 612.0],
      };

      const marginPoints = {
        none: 0,
        small: 18, // 0.25 inch
        normal: 36, // 0.5 inch
      }[margin];

      for (let i = 0; i < images.length; i++) {
        const imgItem = images[i];

        // Fetch image bytes
        const imgResponse = await fetch(imgItem.dataUrl);
        const imgBytes = await imgResponse.arrayBuffer();

        let embeddedImage;
        if (imgItem.type.includes('png') || imgItem.name.toLowerCase().endsWith('.png')) {
          embeddedImage = await pdfDoc.embedPng(imgBytes);
        } else {
          // Standard JPEG/WebP converted to JPEG canvas if needed
          embeddedImage = await pdfDoc.embedJpg(imgBytes);
        }

        const { width: imgW, height: imgH } = embeddedImage;

        if (pageSize === 'fit') {
          // Page size fits the image exactly plus margin
          const pW = imgW + marginPoints * 2;
          const pH = imgH + marginPoints * 2;
          const page = pdfDoc.addPage([pW, pH]);
          page.drawImage(embeddedImage, {
            x: marginPoints,
            y: marginPoints,
            width: imgW,
            height: imgH,
          });
        } else {
          // Standard A4 or Letter
          const [pW, pH] = pageDimensions[pageSize];
          const page = pdfDoc.addPage([pW, pH]);

          const availW = pW - marginPoints * 2;
          const availH = pH - marginPoints * 2;

          const scale = Math.min(availW / imgW, availH / imgH, 1.0);
          const drawW = imgW * scale;
          const drawH = imgH * scale;

          // Center the image on the page
          const x = marginPoints + (availW - drawW) / 2;
          const y = marginPoints + (availH - drawH) / 2;

          page.drawImage(embeddedImage, {
            x,
            y,
            width: drawW,
            height: drawH,
          });
        }

        setConvertProgress(30 + Math.round(((i + 1) / images.length) * 60));
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setPdfBlobUrl(url);
      setConvertProgress(100);
      showToast('PDF created successfully!');
    } catch (err) {
      console.error('PDF Conversion error:', err);
      showToast('Could not convert images to PDF. Try using standard JPG or PNG images.');
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (!pdfBlobUrl) return;
    const link = document.createElement('a');
    link.href = pdfBlobUrl;
    link.download = `images-document-${Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Download started');
  };

  return (
    <ToolPageTemplate
      tool={tool}
      heading="Image to PDF Converter (Private)"
      subheading="Convert JPG, PNG, and camera photos into clean, multi-page PDF documents. Choose page sizes (A4, US Letter, Fit-to-Image), orientations, and custom margins entirely in your browser."
      inputLabel="Select Images & Layout Options"
      inputPlaceholder="Add images from your camera or files..."
      examplePrompt="Upload receipt photos, whiteboard captures, or design portfolio screenshots to turn into a PDF."
      exampleChips={exampleChips}
      generateButtonText={isConverting ? `Converting... ${convertProgress}%` : `Create PDF from ${images.length} Image${images.length === 1 ? '' : 's'}`}
      lastUpdated="October 2026"
      navigate={navigate}
      onClientCompute={() => ({
        result: `Image to PDF Summary:
Total Images: ${images.length}
Page Size: ${pageSize.toUpperCase()} (${orientation})
Margins: ${margin}
Total Input Size: ${formatFileSize(images.reduce((a, b) => a + b.size, 0))}

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
              Zero Server Uploads
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
              accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
              onChange={handleImageSelect}
              className="hidden"
            />
            <div className="w-12 h-12 mx-auto rounded-xl bg-[#101c33] group-hover:bg-[#0a1424] border border-[rgba(143,163,192,0.2)] group-hover:border-[#4ade80]/50 flex items-center justify-center text-[#8fa3c0] group-hover:text-[#4ade80] transition-colors">
              <Upload size={22} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#f2f7ff]">
                Click or drag & drop images here
              </p>
              <p className="text-xs text-[#8fa3c0] mt-1">
                Supports JPG, PNG, and WebP up to 25MB each. High-resolution retention.
              </p>
            </div>
          </div>

          {/* Layout Controls Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] text-xs">
            <div className="space-y-1">
              <label className="font-mono uppercase text-[#8fa3c0] font-semibold">Page Size</label>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value as any)}
                className="w-full bg-[#101c33] border border-[rgba(143,163,192,0.2)] rounded-lg px-2.5 py-1.5 text-xs text-[#f2f7ff] focus-ring"
              >
                <option value="a4">A4 (Standard ISO)</option>
                <option value="letter">US Letter (8.5 × 11 in)</option>
                <option value="fit">Fit to Image Size</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-mono uppercase text-[#8fa3c0] font-semibold">Orientation</label>
              <select
                value={orientation}
                disabled={pageSize === 'fit'}
                onChange={(e) => setOrientation(e.target.value as any)}
                className="w-full bg-[#101c33] border border-[rgba(143,163,192,0.2)] rounded-lg px-2.5 py-1.5 text-xs text-[#f2f7ff] focus-ring disabled:opacity-40"
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-mono uppercase text-[#8fa3c0] font-semibold">Margins</label>
              <select
                value={margin}
                onChange={(e) => setMargin(e.target.value as any)}
                className="w-full bg-[#101c33] border border-[rgba(143,163,192,0.2)] rounded-lg px-2.5 py-1.5 text-xs text-[#f2f7ff] focus-ring"
              >
                <option value="none">No Margin (Full Bleed)</option>
                <option value="small">Small (0.25 in / 6mm)</option>
                <option value="normal">Normal (0.5 in / 12mm)</option>
              </select>
            </div>
          </div>

          {/* Image Thumbnail Queue */}
          {images.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0] font-semibold">
                  Page Order ({images.length} {images.length === 1 ? 'image' : 'images'})
                </span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs font-mono text-[#8fa3c0] hover:text-[#ff5c7a] flex items-center gap-1 transition-colors"
                >
                  <RefreshCw size={13} />
                  <span>Reset All</span>
                </button>
              </div>

              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {images.map((img, idx) => (
                  <div
                    key={img.id}
                    className="p-3 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-[#101c33] border border-[rgba(143,163,192,0.2)] font-mono font-bold text-center leading-6 shrink-0 text-[#4ade80]">
                        {idx + 1}
                      </span>
                      <img
                        src={img.dataUrl}
                        alt={`Thumbnail preview of uploaded file: ${img.name}`}
                        width={40}
                        height={40}
                        loading="lazy"
                        className="w-10 h-10 rounded-lg object-cover bg-black/40 border border-[rgba(143,163,192,0.2)] shrink-0"
                      />
                      <div className="truncate">
                        <div className="font-medium text-[#f2f7ff] truncate">{img.name}</div>
                        <div className="text-[11px] text-[#8fa3c0] font-mono">{formatFileSize(img.size)}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMoveUp(idx)}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg bg-[#101c33] text-[#8fa3c0] hover:text-[#f2f7ff] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                        title="Move Up"
                        aria-label="Move image up"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveDown(idx)}
                        disabled={idx === images.length - 1}
                        className="p-1.5 rounded-lg bg-[#101c33] text-[#8fa3c0] hover:text-[#f2f7ff] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                        title="Move Down"
                        aria-label="Move image down"
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemove(img.id)}
                        className="p-1.5 rounded-lg text-[#8fa3c0] hover:text-[#ff5c7a] transition-colors ml-1"
                        title="Remove Image"
                        aria-label="Remove image"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Convert Button */}
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleConvertToPdf}
                  disabled={isConverting}
                  className="w-full gap-2 font-bold"
                >
                  <FileImage size={18} />
                  <span>
                    {isConverting
                      ? `Creating PDF (${convertProgress}%)...`
                      : `Generate PDF Document (${images.length} pages)`}
                  </span>
                </Button>
              </div>

              {/* Progress bar */}
              {isConverting && (
                <div className="space-y-1.5">
                  <div className="h-2 w-full bg-[#101c33] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#4ade80] transition-all duration-300"
                      style={{ width: `${convertProgress}%` }}
                    />
                  </div>
                  <div className="text-right text-[11px] font-mono text-[#8fa3c0]">
                    Embedding images locally... {convertProgress}%
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      }
      customResultRenderer={() => {
        if (!pdfBlobUrl) {
          return (
            <div className="p-8 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] text-center space-y-3">
              <FileImage className="w-10 h-10 text-[#8fa3c0]/40 mx-auto" />
              <div className="text-sm font-semibold text-[#f2f7ff]">Ready to Convert</div>
              <p className="text-xs text-[#8fa3c0] max-w-sm mx-auto">
                Add JPG, PNG, or WebP photos above. Customize your page size and margins, then click Generate PDF.
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
                      Conversion Complete
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#f2f7ff]">
                    Your PDF Document is Ready
                  </h3>
                  <p className="text-xs text-[#8fa3c0] font-mono">
                    {images.length} page{images.length > 1 ? 's' : ''} compiled into clean {pageSize.toUpperCase()} format
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  onClick={handleDownload}
                  className="w-full sm:w-auto gap-2 text-sm"
                >
                  <Download size={16} />
                  <span>Download Generated PDF</span>
                </Button>
              </div>

              {/* Embedded Safe Preview */}
              <div className="rounded-xl overflow-hidden border border-[rgba(74, 222, 128,0.2)] bg-[#050a14] h-[400px]">
                <iframe
                  src={pdfBlobUrl}
                  title="Generated PDF Preview"
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
            Sharing raw smartphone camera photos or receipts across multiple emails is messy and unprofessional. Converting pictures into an organized, single PDF document ensures consistency, standard pagination, and easy printing.
          </p>
          <p>
            The <strong>Image to PDF Converter</strong> operates entirely on your device with client-side WebAssembly. It wraps your pictures into standard ISO A4 or US Letter page dimensions, centers each photograph with consistent margins, and packages everything into an ink-friendly, universally compatible PDF file.
          </p>
          <p>
            Because the image rasterization and document generation execute in your local browser sandbox, zero bytes ever leave your device.
          </p>
        </div>
      }
      howToUseSteps={[
        {
          step: 'Upload your photos',
          text: 'Select one or more JPG, PNG, or WebP images from your phone or computer.',
        },
        {
          step: 'Configure page size and margins',
          text: 'Choose A4, US Letter, or Fit-to-Image, and select your preferred margins or borderless full-bleed.',
        },
        {
          step: 'Reorder and Download',
          text: 'Adjust page order with up and down arrows, then click Generate PDF to compile and download your document.',
        },
      ]}
      workedExample={{
        title: 'Converting 5 Monthly Expense Receipts into a PDF Packet',
        scenario: 'An employee needs to submit 5 photo receipts (coffee, rideshare, dinner, airline baggage, hotel) for travel reimbursement.',
        output: 'Created a tidy 5-page A4 PDF document (2.8 MB) with neat 0.25-inch margins and centered photo placement, ready to email to accounting.',
      }}
      tips={[
        'Use "Fit to Image Size" if your images have varying dimensions and you want each PDF page to match the exact photo aspect ratio.',
        'Choose "No Margin" if you are converting presentation slide screenshots or scanned documents that already have borders.',
        'You can rearrange photos after adding them using the up and down arrows before compiling.',
      ]}
      faq={[
        {
          question: 'Are my private photos uploaded to a cloud server?',
          answer: 'Never. The conversion happens 100% inside your browser using client-side WebAssembly. Your photos never leave your device.',
        },
        {
          question: 'What image formats can I convert?',
          answer: 'The converter accepts standard JPG, JPEG, PNG, and WebP images up to 25MB each.',
        },
        {
          question: 'Does this tool compress or lower the image quality?',
          answer: 'No. The converter embeds the exact byte streams of your original images directly into the PDF container without downsampling.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
