import React, { useState, useRef } from 'react';
import { ScanText, Upload, Copy, Check, ShieldCheck, RefreshCw, AlertCircle, FileText, Sparkles, Image as ImageIcon } from 'lucide-react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';
import { Button } from '../../components/ui/Button.tsx';
import { useToast } from '../../components/ui/Toast.tsx';

interface ImageToTextOcrPageProps {
  navigate: (path: string) => void;
}

export const ImageToTextOcrPage: React.FC<ImageToTextOcrPageProps> = ({ navigate }) => {
  const [selectedImage, setSelectedImage] = useState<{ name: string; size: number; dataUrl: string } | null>(null);
  const [language, setLanguage] = useState<string>('eng');
  const [isRecognizing, setIsRecognizing] = useState<boolean>(false);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [extractedText, setExtractedText] = useState<string>('');
  const [confidence, setConfidence] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'image-to-text-ocr') || LAUNCH_TOOLS[0];
  const relatedTools = LAUNCH_TOOLS.filter((t) => t.slug === 'pdf-merge' || t.slug === 'image-to-pdf');
  const relatedGuide = POPULAR_GUIDES.find((g) => g.slug === 'better-prompts-simple-rules') || POPULAR_GUIDES[0];

  const exampleChips = [
    'Scan printed book excerpt or textbook paragraph',
    'Extract text from business card or paper invoice receipt',
    'Read whiteboard brainstorming notes or slide photo',
  ];

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, or WebP).');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      showToast('Image is over 20MB. Please select a smaller photo for optimal OCR performance.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage({
        name: file.name,
        size: file.size,
        dataUrl: reader.result as string,
      });
      setExtractedText('');
      setConfidence(null);
      setProgressPercent(0);
      setProgressStatus('');
      showToast(`Selected "${file.name}"`);
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRunOcr = async () => {
    if (!selectedImage) {
      showToast('Please choose an image to scan first.');
      return;
    }

    setIsRecognizing(true);
    setProgressPercent(10);
    setProgressStatus('Initializing OCR engine in browser...');

    try {
      // Dynamic import ensures tesseract.js is never loaded on other pages
      const { createWorker } = await import('tesseract.js');
      setProgressPercent(25);
      setProgressStatus('Loading recognition dictionary...');

      const worker = await createWorker(language, 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            const p = Math.round((m.progress || 0) * 100);
            setProgressPercent(30 + Math.round(p * 0.65));
            setProgressStatus(`Recognizing characters (${p}%)...`);
          } else if (m.status) {
            setProgressStatus(`${m.status}...`);
          }
        },
      });

      const ret = await worker.recognize(selectedImage.dataUrl);
      const text = ret.data.text.trim();
      const conf = Math.round(ret.data.confidence);

      await worker.terminate();

      setExtractedText(text || '(No legible text detected in this image. Ensure high contrast and sharp focus.)');
      setConfidence(conf);
      setProgressPercent(100);
      setProgressStatus('Recognition complete');
      showToast('Text extracted successfully!');
    } catch (err) {
      console.error('OCR Error:', err);
      showToast('Could not process image. Please try a clearer or higher-contrast photo.');
    } finally {
      setIsRecognizing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setExtractedText('');
    setConfidence(null);
    setProgressPercent(0);
    setProgressStatus('');
    showToast('Reset scanner');
  };

  return (
    <ToolPageTemplate
      tool={tool}
      heading="Image to Text (Local Browser OCR)"
      subheading="Extract printed characters, typed receipts, book paragraphs, and slide notes directly into editable text. Runs 100% inside your browser using client-side OCR with zero cloud uploads."
      inputLabel="Select Image to Recognize"
      inputPlaceholder="Extracted text will appear here ready to copy..."
      examplePrompt="Upload a photo or screenshot with printed or typed text to transcribe."
      exampleChips={exampleChips}
      generateButtonText={isRecognizing ? `Recognizing... ${progressPercent}%` : 'Extract Text from Image'}
      lastUpdated="October 2026"
      navigate={navigate}
      onClientCompute={() => ({
        result: extractedText || `OCR Configuration:
Image: ${selectedImage?.name || 'None'} (${formatFileSize(selectedImage?.size || 0)})
Language: ${language}
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
              100% Client-Side Engine
            </span>
          </div>

          {/* Quality Warning Notice */}
          <div className="p-3 rounded-xl bg-[#101c33]/70 border border-[rgba(143,163,192,0.14)] text-xs text-[#8fa3c0] flex items-start gap-2.5">
            <AlertCircle size={16} className="text-[#ffb840] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Quality Note:</strong> OCR accuracy depends directly on image clarity, lighting, and contrast. For best results, use well-lit, upright photos with sharp, printed typography. Handwritten notes may yield lower accuracy.
            </p>
          </div>

          {/* Upload Area */}
          {!selectedImage ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-8 border-2 border-dashed border-[rgba(143,163,192,0.25)] hover:border-[#4ade80]/60 bg-[#0a1424] hover:bg-[#101c33] transition-all rounded-2xl cursor-pointer text-center group space-y-3"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <div className="w-12 h-12 mx-auto rounded-xl bg-[#101c33] group-hover:bg-[#0a1424] border border-[rgba(143,163,192,0.2)] group-hover:border-[#4ade80]/50 flex items-center justify-center text-[#8fa3c0] group-hover:text-[#4ade80] transition-colors">
                <Upload size={22} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#f2f7ff]">
                  Click or drag & drop a photo to scan
                </p>
                <p className="text-xs text-[#8fa3c0] mt-1">
                  Supports PNG, JPG, and WebP up to 20MB. In-browser optical character recognition.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedImage.dataUrl}
                    alt={`Preview of document image to scan: ${selectedImage.name}`}
                    width={48}
                    height={48}
                    loading="lazy"
                    className="w-12 h-12 rounded-xl object-cover bg-black/50 border border-[rgba(143,163,192,0.2)] shrink-0"
                  />
                  <div>
                    <div className="text-sm font-semibold text-[#f2f7ff] truncate max-w-xs sm:max-w-md">
                      {selectedImage.name}
                    </div>
                    <div className="text-xs text-[#8fa3c0] font-mono">
                      {formatFileSize(selectedImage.size)} · Ready to scan
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="p-2 rounded-xl text-[#8fa3c0] hover:text-[#ff5c7a] bg-[#101c33] hover:bg-[#101c33]/80 transition-colors"
                  title="Remove image"
                  aria-label="Remove image"
                >
                  <RefreshCw size={15} />
                </button>
              </div>

              {/* Language Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-[#8fa3c0] font-semibold">
                  Text Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full sm:w-60 bg-[#101c33] border border-[rgba(143,163,192,0.2)] rounded-lg px-2.5 py-1.5 text-xs text-[#f2f7ff] focus-ring font-mono"
                >
                  <option value="eng">English (eng)</option>
                  <option value="spa">Spanish (spa)</option>
                  <option value="fra">French (fra)</option>
                  <option value="deu">German (deu)</option>
                  <option value="ita">Italian (ita)</option>
                  <option value="por">Portuguese (por)</option>
                </select>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleRunOcr}
                  disabled={isRecognizing}
                  className="w-full gap-2 font-bold"
                >
                  <ScanText size={18} />
                  <span>
                    {isRecognizing
                      ? `Scanning... ${progressPercent}%`
                      : 'Recognize & Extract Text'}
                  </span>
                </Button>
              </div>

              {/* Progress bar */}
              {isRecognizing && (
                <div className="space-y-1.5">
                  <div className="h-2 w-full bg-[#101c33] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#4ade80] transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-[#8fa3c0]">
                    <span>{progressStatus}</span>
                    <span>{progressPercent}%</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      }
      customResultRenderer={({ onCopy, copied }) => {
        if (!extractedText) {
          return (
            <div className="p-8 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] text-center space-y-3">
              <ScanText className="w-10 h-10 text-[#8fa3c0]/40 mx-auto" />
              <div className="text-sm font-semibold text-[#f2f7ff]">Ready to Extract</div>
              <p className="text-xs text-[#8fa3c0] max-w-sm mx-auto">
                Select an image above and click "Extract Text". The optical character recognition runs locally on your device.
              </p>
            </div>
          );
        }

        return (
          <div className="space-y-5">
            <div className="p-6 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono uppercase text-[#4ade80] font-bold">
                    Extracted Text
                  </span>
                  {confidence !== null && (
                    <div className="text-xs text-[#8fa3c0] font-mono mt-0.5">
                      Estimated confidence: {confidence}%
                    </div>
                  )}
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onCopy(extractedText)}
                  className="text-xs gap-1.5"
                >
                  <Copy size={14} />
                  <span>{copied ? 'Copied' : 'Copy Text'}</span>
                </Button>
              </div>

              <div className="p-4 rounded-xl bg-[#101c33] border border-[rgba(143,163,192,0.14)] text-sm text-[#f2f7ff] leading-relaxed whitespace-pre-wrap select-all font-mono">
                {extractedText}
              </div>
            </div>
          </div>
        );
      }}
      whatItDoesContent={
        <div className="space-y-3">
          <p>
            Retyping long passages from printed manuals, business cards, books, or billing statements is tedious and error-prone. Standard OCR web tools often require sending your sensitive documents to remote servers.
          </p>
          <p>
            The <strong>Image to Text (OCR)</strong> tool executes an optical character recognition engine compiled to WebAssembly directly inside your browser. When you select an image, the neural text detection model analyzes glyph contours, baseline spacing, and character shapes completely in local memory.
          </p>
          <p>
            You can copy the extracted text with a single click, paste it into any editor or document, and know with certainty that your photos never left your machine.
          </p>
        </div>
      }
      howToUseSteps={[
        {
          step: 'Upload your image',
          text: 'Select a photo, screenshot, or scanned document containing printed or typed text.',
        },
        {
          step: 'Choose your document language',
          text: 'Select English, Spanish, French, German, Italian, or Portuguese for optimal vocabulary dictionary matching.',
        },
        {
          step: 'Run OCR and Copy',
          text: 'Click Extract Text to initiate in-browser recognition and copy the finished transcript with one tap.',
        },
      ]}
      workedExample={{
        title: 'Scanning a Printed Book Paragraph for Research Notes',
        scenario: 'A researcher photographs page 142 of a design textbook and needs the quote in their digital notes.',
        output: 'Recognized 85 words with 94% confidence in 2.3 seconds directly in the browser: "Typography is the craft of endowing human language with a durable visual form..."',
      }}
      tips={[
        'Rotate skewed photos so text lines are horizontally level before scanning.',
        'High resolution (at least 300 DPI or clear smartphone focus) drastically improves character accuracy.',
        'Ensure good contrast between text and background—avoid heavy shadows or dark reflective glare.',
      ]}
      faq={[
        {
          question: 'Are my scanned photos uploaded to any server?',
          answer: 'No. The OCR neural model runs locally in your browser via WebAssembly. Your photos and extracted text never leave your device.',
        },
        {
          question: 'Can this tool read cursive handwriting?',
          answer: 'The engine is optimized for printed, typed, and cleanly rendered characters. Very loose or slanted handwriting will produce lower accuracy.',
        },
        {
          question: 'Does this tool work offline?',
          answer: 'Once the page and language model are cached in your browser session, character recognition can execute completely without an active internet connection.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
