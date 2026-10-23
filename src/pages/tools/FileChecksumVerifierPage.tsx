import React, { useState, useRef } from 'react';
import { ShieldCheck, ShieldAlert, Check, Copy, Upload, FileCode, AlertTriangle, RefreshCw, XCircle } from 'lucide-react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';

type HashAlgorithm = 'SHA-256' | 'SHA-512' | 'SHA-1' | 'MD5';

interface FileChecksumVerifierPageProps {
  navigate: (path: string) => void;
}

export const FileChecksumVerifierPage: React.FC<FileChecksumVerifierPageProps> = ({ navigate }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>('SHA-256');
  const [computedHash, setComputedHash] = useState<string>('');
  const [expectedHash, setExpectedHash] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [isHashing, setIsHashing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [hashingSpeed, setHashingSpeed] = useState<string>('');
  const abortRef = useRef<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'file-checksum-verifier') || {
    id: 'file-checksum-verifier',
    name: 'File Checksum Verifier',
    slug: 'file-checksum-verifier',
    description: 'Calculate and verify SHA-256, SHA-512, SHA-1, and MD5 file hashes locally in your browser with zero upload.',
    category: 'Files',
    icon: 'ShieldCheck',
    type: 'client',
    keywords: ['sha256 checksum online', 'verify iso hash', 'file integrity check', 'md5 hash verifier'],
    relatedToolSlugs: ['install-command-generator', 'pdf-merge'],
    isFlagship: true,
  };

  const relatedTools = LAUNCH_TOOLS.filter(
    (t) => t.slug === 'install-command-generator' || t.slug === 'pdf-merge' || t.slug === 'quick-calculators'
  );
  const relatedGuide = POPULAR_GUIDES[0];

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const computeFileHash = async (file: File, algo: HashAlgorithm) => {
    setIsHashing(true);
    setProgress(0);
    setComputedHash('');
    setHashingSpeed('');
    abortRef.current = false;

    const startTime = performance.now();

    try {
      // Dynamically import hash-wasm for chunked WASM hashing
      const hashWasm = await import('hash-wasm');
      let hasher: any;

      switch (algo) {
        case 'SHA-256':
          hasher = await hashWasm.createSHA256();
          break;
        case 'SHA-512':
          hasher = await hashWasm.createSHA512();
          break;
        case 'SHA-1':
          hasher = await hashWasm.createSHA1();
          break;
        case 'MD5':
          hasher = await hashWasm.createMD5();
          break;
      }

      hasher.init();

      // Read file in 2MB chunks to maintain smooth UI and low memory footprint
      const chunkSize = 2 * 1024 * 1024;
      const totalChunks = Math.ceil(file.size / chunkSize);
      let offset = 0;
      let chunkIdx = 0;

      while (offset < file.size) {
        if (abortRef.current) {
          setIsHashing(false);
          setProgress(0);
          return;
        }

        const chunkSlice = file.slice(offset, offset + chunkSize);
        const arrayBuffer = await chunkSlice.arrayBuffer();
        hasher.update(new Uint8Array(arrayBuffer));

        offset += chunkSize;
        chunkIdx++;

        const currentPct = Math.min(100, Math.round((offset / file.size) * 100));
        setProgress(currentPct);

        // Calculate approximate hashing speed
        const elapsedSec = (performance.now() - startTime) / 1000;
        if (elapsedSec > 0.5) {
          const mbProcessed = offset / (1024 * 1024);
          const mbPerSec = (mbProcessed / elapsedSec).toFixed(1);
          setHashingSpeed(`${mbPerSec} MB/s`);
        }

        // Give breathing room to browser UI thread every 4 chunks
        if (chunkIdx % 4 === 0) {
          await new Promise((r) => setTimeout(r, 0));
        }
      }

      const finalHash = hasher.digest();
      setComputedHash(finalHash);
      setProgress(100);
    } catch (err: any) {
      console.error('Hashing error:', err);
    } finally {
      setIsHashing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      computeFileHash(file, algorithm);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      computeFileHash(file, algorithm);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleAlgorithmChange = (newAlgo: HashAlgorithm) => {
    setAlgorithm(newAlgo);
    if (selectedFile) {
      computeFileHash(selectedFile, newAlgo);
    }
  };

  const handleCancelHashing = () => {
    abortRef.current = true;
    setIsHashing(false);
  };

  const cleanExpected = expectedHash.trim().toLowerCase();
  const cleanComputed = computedHash.trim().toLowerCase();
  const hasExpected = cleanExpected.length > 0;
  const isMatch = hasExpected && cleanComputed === cleanExpected;
  const isDifferent = hasExpected && cleanComputed.length > 0 && cleanComputed !== cleanExpected;

  const handleCopyHash = async () => {
    if (!computedHash) return;
    try {
      await navigator.clipboard.writeText(computedHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Handled
    }
  };

  const exampleChips = [
    'Verify Ubuntu 24.04 LTS Desktop ISO',
    'Windows 11 Media Creation Hash Match',
    'Verify Raspberry Pi OS Image Integrity',
  ];

  return (
    <ToolPageTemplate
      tool={tool}
      heading="File Checksum Verifier"
      subheading="Verify SHA-256, SHA-512, SHA-1, and MD5 file hashes locally in your browser. Supports multi-gigabyte ISOs with chunked streaming."
      inputLabel="Paste Expected Checksum (Optional)"
      inputPlaceholder="e.g. 7192385c3c0605de55bb9476ce1d90748190ecb32a8eed7f5207b30cf6a1fe89"
      examplePrompt="Verify Ubuntu ISO checksum against official release sha256"
      exampleChips={exampleChips}
      lastUpdated="October 2026"
      navigate={navigate}
      onClientCompute={() => ({
        result: !computedHash
          ? 'Please select a file to compute its checksum.'
          : `Algorithm: ${algorithm}\nFile: ${selectedFile?.name} (${formatFileSize(selectedFile?.size || 0)})\nComputed Hash: ${computedHash}\nStatus: ${
              hasExpected ? (isMatch ? 'VERIFIED MATCH' : 'DIFFERENT / MISMATCH') : 'Calculated'
            }`,
      })}
      extraControls={
        <div className="space-y-6 pt-2">
          {/* Privacy Banner */}
          <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-[#0a1424] border border-[rgba(74,222,128,0.25)] text-xs text-[#4ade80]">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span className="font-medium">
              Your file never leaves your device. All checksum computations execute locally inside WebAssembly memory without network transmission.
            </span>
          </div>

          {/* Algorithm Selector */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-[#9aaccb]">
              Hashing Algorithm
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['SHA-256', 'SHA-512', 'SHA-1', 'MD5'] as HashAlgorithm[]).map((algo) => (
                <button
                  key={algo}
                  type="button"
                  disabled={isHashing}
                  onClick={() => handleAlgorithmChange(algo)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all focus-ring ${
                    algorithm === algo
                      ? 'bg-[#4ade80] text-[#050a14] border-[#4ade80] font-bold shadow-sm'
                      : 'bg-[#0a1424] text-[#9aaccb] border-[rgba(143,163,192,0.16)] hover:text-[#f2f7ff]'
                  }`}
                >
                  {algo}
                </button>
              ))}
            </div>
          </div>

          {/* File Picker / Drag & Drop Dropzone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
            className="p-8 border-2 border-dashed border-[rgba(143,163,192,0.25)] hover:border-[rgba(74,222,128,0.6)] bg-[#0a1424] hover:bg-[#101c33] transition-all rounded-3xl cursor-pointer text-center group space-y-3"
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#101c33] group-hover:bg-[#050a14] border border-[rgba(143,163,192,0.2)] group-hover:border-[rgba(74,222,128,0.5)] flex items-center justify-center text-[#9aaccb] group-hover:text-[#4ade80] transition-colors">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#f2f7ff]">
                {selectedFile ? selectedFile.name : 'Choose a file or drag & drop here'}
              </div>
              <p className="text-xs text-[#9aaccb] mt-1">
                {selectedFile
                  ? `${formatFileSize(selectedFile.size)} · Click to choose a different file`
                  : 'Multi-gigabyte ISOs, disk images, installers, archives, or documents'}
              </p>
            </div>
          </div>

          {/* Hashing Progress Bar */}
          {isHashing && (
            <div className="p-4 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[#9aaccb] flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#4ade80]" />
                  <span>Hashing in progress... {progress}%</span>
                </span>
                <div className="flex items-center gap-3">
                  {hashingSpeed && (
                    <span className="font-mono text-[#4ade80] text-[11px]">{hashingSpeed}</span>
                  )}
                  <button
                    type="button"
                    onClick={handleCancelHashing}
                    className="text-xs text-[#ff5c7a] hover:underline flex items-center gap-1 focus-ring rounded"
                  >
                    <XCircle className="w-3 h-3" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>

              <div className="h-2 w-full bg-[#101c33] rounded-full overflow-hidden">
                <div
                  style={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-[#0b6bf0] to-[#4ade80] transition-all duration-200"
                />
              </div>
            </div>
          )}

          {/* Computed Hash Result Box */}
          {computedHash && (
            <div className="space-y-4 p-5 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#4ade80] font-bold flex items-center gap-1.5">
                  <FileCode className="w-4 h-4" />
                  <span>Calculated {algorithm} Checksum</span>
                </span>
                <button
                  type="button"
                  onClick={handleCopyHash}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#101c33] border border-[rgba(143,163,192,0.2)] text-xs font-semibold text-[#f2f7ff] hover:border-[#4ade80] transition-colors focus-ring"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#34e0a1]" />
                      <span className="text-[#34e0a1]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3 rounded-xl bg-[#050a14] border border-[rgba(143,163,192,0.14)] font-mono text-xs text-[#f2f7ff] break-all leading-relaxed select-all">
                {computedHash}
              </div>

              {/* Expected Hash Input Field */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-mono uppercase tracking-wider text-[#9aaccb]">
                  Compare with Expected Hash
                </label>
                <input
                  type="text"
                  value={expectedHash}
                  onChange={(e) => setExpectedHash(e.target.value)}
                  placeholder="Paste publisher checksum from website..."
                  className="w-full bg-[#101c33] border border-[rgba(143,163,192,0.2)] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[#f2f7ff] placeholder-[#9aaccb] focus-ring"
                />
              </div>

              {/* Verdict Indicator */}
              {isMatch && (
                <div className="p-4 rounded-xl bg-[rgba(52,224,161,0.12)] border border-[#34e0a1] flex items-center gap-3 text-[#34e0a1]">
                  <Check className="w-5 h-5 shrink-0" />
                  <div>
                    <div className="text-sm font-bold uppercase tracking-wider font-mono">
                      MATCH · Checksum Verified
                    </div>
                    <div className="text-xs text-[#f2f7ff] mt-0.5">
                      The computed hash exactly matches the publisher value. The file has not been altered, truncated, or tampered with.
                    </div>
                  </div>
                </div>
              )}

              {isDifferent && (
                <div className="p-4 rounded-xl bg-[rgba(255,92,122,0.12)] border border-[#ff5c7a] flex items-center gap-3 text-[#ff5c7a]">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <div>
                    <div className="text-sm font-bold uppercase tracking-wider font-mono">
                      DIFFERENT · Checksum Mismatch
                    </div>
                    <div className="text-xs text-[#f2f7ff] mt-0.5">
                      The file hash does not match your expected value. The download may be incomplete, corrupted, or from an untrusted source. Do not flash to a USB or execute.
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Guide Box: Why verify before bootable USB */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-2.5">
            <div className="text-xs font-mono uppercase tracking-wider text-[#4ade80] font-bold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#4ade80]" />
              <span>Why verify ISO checksums before flashing bootable media?</span>
            </div>
            <p className="text-xs text-[#9aaccb] leading-relaxed">
              When downloading multi-gigabyte operating system ISOs (such as Windows 11, Ubuntu, Debian, or Proxmox), minor network hiccups can corrupt random binary blocks without triggering a browser download failure. Flashing a corrupted ISO to a USB flash drive often results in cryptic installer errors, missing kernel drivers, or failed partition writes mid-installation. Verifying the SHA-256 hash takes less than thirty seconds and guarantees that the image is identical byte-for-byte to the official vendor release.
            </p>
          </div>
        </div>
      }
      whatItDoesContent={
        <>
          <p>
            The File Checksum Verifier computes cryptographic message digests (SHA-256, SHA-512, SHA-1, and MD5) for any local file right inside your web browser. Built on top of compiled WebAssembly hashing engines, it processes files in incremental slices so that even multi-gigabyte files (such as 8 GB operating system installer ISOs or large video archives) can be verified without freezing your browser tab or exhausting device RAM.
          </p>
          <p>
            Cryptographic hashes act as digital fingerprints: changing even a single byte anywhere in a 10 GB file completely scrambles the resulting checksum. By comparing your computed hash against the publisher’s published checksum, you can confirm download integrity and detect transmission corruption before opening installers or flashing USB media.
          </p>
        </>
      }
      howToUseSteps={[
        {
          step: 'Choose your hashing algorithm',
          text: 'Select SHA-256 (the modern standard for software releases), SHA-512, SHA-1, or MD5.',
        },
        {
          step: 'Select or drop your file',
          text: 'Drag your file into the dropzone or click to browse. The WebAssembly engine begins chunked hashing immediately.',
        },
        {
          step: 'Paste the publisher hash for verification',
          text: 'Paste the expected checksum from the release page to get an immediate visual MATCH or MISMATCH verdict.',
        },
      ]}
      workedExample={{
        title: 'Example: Verifying an Ubuntu Desktop ISO',
        scenario: 'A user downloaded ubuntu-24.04-desktop-amd64.iso (5.8 GB) and needs to confirm integrity before flashing.',
        output: `File: ubuntu-24.04-desktop-amd64.iso (5.8 GB)
Algorithm: SHA-256

Computed Hash:
81fae63c1e2a9e2c0e18a804da62abfa096df35b4435b80a5f8e56ecadca7a5a

Expected Hash:
81fae63c1e2a9e2c0e18a804da62abfa096df35b4435b80a5f8e56ecadca7a5a

Status: MATCH · Exact Bitwise Verification Succeeded`,
      }}
      tips={[
        'Prefer SHA-256 or SHA-512 over MD5: MD5 and SHA-1 have known collision vulnerabilities and should only be used when verifying legacy file archives.',
        'No file size limit: The streaming chunk reader handles 50+ GB disk images cleanly without browser memory spikes.',
        'Case-insensitive comparison: Checksum matching automatically ignores letter casing (uppercase vs lowercase) and trailing whitespace.',
        'Never flash a mismatched image: If the checksum differs, delete the download and redownload over a stable wired connection.',
      ]}
      faq={[
        {
          question: 'Does my file get uploaded to any server during hashing?',
          answer: 'No. The entire verification runs 100% locally on your computer inside your web browser using HTML5 File API and WebAssembly. No data is ever sent to any server.',
        },
        {
          question: 'Why does hashing a multi-gigabyte ISO take several seconds?',
          answer: 'The browser must read every single byte off your local storage drive to calculate the cryptographic digest. Speeds depend on your storage drive (typically 400–1200 MB/s on modern NVMe SSDs).',
        },
        {
          question: 'What is the difference between SHA-256 and MD5?',
          answer: 'MD5 produces a 128-bit hash that is fast but cryptographically broken against malicious collisions. SHA-256 produces a 256-bit hash with zero known collisions, making it the universal standard for software security.',
        },
        {
          question: 'What should I do if the hash does not match?',
          answer: 'A checksum mismatch indicates that the downloaded file is corrupted or modified. Do not execute the file or write it to bootable drives. Re-download the file directly from the vendor’s official mirror.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
