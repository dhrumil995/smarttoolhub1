import React, { useState, useMemo } from 'react';
import { KeyRound, Copy, Check, RefreshCw, ShieldCheck, ShieldAlert, Sparkles } from 'lucide-react';
import { SchemaScript } from '../../components/seo/SchemaScript.tsx';

interface PasswordEntropyPageProps {
  navigate: (path: string) => void;
}

export const PasswordEntropyPage: React.FC<PasswordEntropyPageProps> = ({ navigate }) => {
  const [length, setLength] = useState(20);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [mode, setMode] = useState<'password' | 'passphrase'>('password');
  const [wordCount, setWordCount] = useState(4);
  const [copied, setCopied] = useState(false);
  const [seed, setSeed] = useState(0);

  // Common high-frequency Diceware wordlist sample
  const wordlist = [
    'anchor', 'battery', 'cipher', 'dolphin', 'echo', 'falcon', 'galaxy', 'harbor',
    'island', 'jungle', 'kestrel', 'lagoon', 'meteor', 'nebula', 'orbit', 'pebble',
    'quartz', 'radar', 'safari', 'timber', 'upgrade', 'vector', 'walnut', 'zenith',
    'beacon', 'canyon', 'dragon', 'ember', 'forest', 'glacier', 'horizon', 'indigo',
    'jasper', 'kinetic', 'lunar', 'magnet', 'nexus', 'oasis', 'polar', 'quasar',
    'ripple', 'silver', 'tundra', 'umbra', 'vortex', 'willow', 'summit', 'titan',
  ];

  // Cryptographically secure password generation
  const generatedSecret = useMemo(() => {
    // Reference seed to force re-evaluation on generate click
    void seed;

    if (mode === 'passphrase') {
      const chosenWords = [];
      const array = new Uint32Array(wordCount);
      crypto.getRandomValues(array);
      for (let i = 0; i < wordCount; i++) {
        chosenWords.push(wordlist[array[i] % wordlist.length]);
      }
      return chosenWords.join('-');
    }

    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!charset) return '';

    const randomValues = new Uint32Array(length);
    crypto.getRandomValues(randomValues);

    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset[randomValues[i] % charset.length];
    }
    return result;
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, mode, wordCount, seed]);

  // Shannon Entropy Calculation: E = L * log2(R)
  const entropyBits = useMemo(() => {
    if (!generatedSecret) return 0;

    if (mode === 'passphrase') {
      // log2(wordlist.length) per word
      const poolSize = wordlist.length;
      return Math.round(wordCount * Math.log2(poolSize));
    }

    let pool = 0;
    if (includeUppercase) pool += 26;
    if (includeLowercase) pool += 26;
    if (includeNumbers) pool += 10;
    if (includeSymbols) pool += 28;

    if (pool === 0) return 0;
    return Math.round(length * Math.log2(pool));
  }, [generatedSecret, mode, wordCount, length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  // Estimated crack time
  const crackTimeEstimate = useMemo(() => {
    if (entropyBits < 40) return 'Few seconds (Vulnerable)';
    if (entropyBits < 60) return 'Few hours to days (Moderate)';
    if (entropyBits < 80) return 'Decades to centuries (Strong)';
    if (entropyBits < 100) return 'Millions of years (Very Strong)';
    return 'Trillions of years (Cryptographically Unbreakable)';
  }, [entropyBits]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedSecret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const regenerate = () => {
    setSeed(s => s + 1);
  };

  const faqs = [
    {
      q: 'How does window.crypto.getRandomValues ensure security?',
      a: 'Unlike Math.random() which uses pseudo-random algorithms, `crypto.getRandomValues()` accesses the operating system cryptographically secure pseudorandom number generator (CSPRNG), which draws from hardware entropy like thermal noise and interrupt timings.',
    },
    {
      q: 'What is a good Shannon entropy score for passwords?',
      a: 'A minimum of 60 bits of entropy is recommended for standard user accounts. For master passwords and cryptocurrency keys, 80 to 128 bits of entropy is the international cryptographic gold standard.',
    },
    {
      q: 'Is my password sent over the network to any server?',
      a: 'Never. The entire key is generated locally in your web browser RAM and is discarded when you leave the page.',
    },
  ];

  const schemaJson = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'Cryptographic Password & Passphrase Generator',
    'applicationCategory': 'SecurityApplication',
    'operatingSystem': 'All',
    'description': 'Generate secure passwords and passphrases with Shannon entropy bits calculation, crack time estimation, and offline client execution.',
    'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    'creator': { '@type': 'Person', 'name': 'Dhrumil Aslaliya' },
  };

  return (
    <div className="py-6 sm:py-10 max-w-[960px] mx-auto space-y-8">
      <SchemaScript schema={schemaJson} />

      {/* Breadcrumbs */}
      <nav className="text-xs font-mono text-[#8fa3c0] flex items-center gap-2">
        <button onClick={() => navigate('/')} className="hover:text-[#39ff88] transition-colors">Home</button>
        <span>/</span>
        <button onClick={() => navigate('/tools')} className="hover:text-[#39ff88] transition-colors">Tools</button>
        <span>/</span>
        <span className="text-[#39ff88]">Password Entropy Generator</span>
      </nav>

      {/* Header */}
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#0a1424] border border-[#39ff88]/30 text-[#39ff88] text-xs font-mono">
          <KeyRound className="w-3.5 h-3.5" />
          <span>SECURITY &amp; CRYPTOGRAPHY</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#f2f7ff] tracking-tight">
          Cryptographic Password &amp; Entropy Generator
        </h1>
        <p className="text-base sm:text-lg text-[#8fa3c0] max-w-2xl leading-relaxed">
          Generate high-entropy credentials with hardware-level CSPRNG randomness. Real-time Shannon entropy bits and crack-time metrics.
        </p>
      </header>

      {/* Main Generator Card */}
      <div className="bg-[#0a1424] border border-[#8fa3c0]/20 rounded-xl p-5 sm:p-6 space-y-5">
        {/* Output Banner */}
        <div className="bg-[#050a14] border border-[#39ff88]/30 rounded-lg p-4 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="w-full truncate">
              <div className="text-xs font-mono text-[#8fa3c0] uppercase">Generated Credential</div>
              <div className="text-lg sm:text-2xl font-mono font-bold text-[#39ff88] tracking-wider mt-1 truncate">
                {generatedSecret}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={regenerate}
                className="p-2.5 rounded-lg bg-[#0a1424] hover:bg-[#101c33] border border-[#8fa3c0]/30 text-[#f2f7ff] transition-colors"
                title="Regenerate"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={handleCopy}
                className="px-4 py-2.5 rounded-lg bg-[#39ff88] hover:bg-[#1fbf62] text-[#050a14] font-semibold text-sm transition-all flex items-center gap-1.5"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Entropy Metrics */}
          <div className="pt-3 border-t border-[#8fa3c0]/15 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#39ff88]" />
              <span className="text-[#8fa3c0]">Entropy:</span>
              <span className="text-[#39ff88] font-bold">{entropyBits} bits</span>
            </div>
            <div className="text-[#8fa3c0] sm:text-right">
              Est. Crack Time: <span className="text-[#f2f7ff] font-medium">{crackTimeEstimate}</span>
            </div>
          </div>
        </div>

        {/* Configuration Controls */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMode('password')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                mode === 'password' ? 'bg-[#39ff88] text-[#050a14]' : 'bg-[#050a14] text-[#8fa3c0]'
              }`}
            >
              Character Password
            </button>
            <button
              onClick={() => setMode('passphrase')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                mode === 'passphrase' ? 'bg-[#39ff88] text-[#050a14]' : 'bg-[#050a14] text-[#8fa3c0]'
              }`}
            >
              Diceware Passphrase
            </button>
          </div>

          {mode === 'password' ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-[#8fa3c0]">
                  <span>Password Length</span>
                  <span className="text-[#f2f7ff]">{length} characters</span>
                </div>
                <input
                  type="range"
                  min={8}
                  max={64}
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value, 10))}
                  className="w-full accent-[#39ff88]"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <label className="flex items-center gap-2 text-xs font-mono text-[#f2f7ff] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeUppercase}
                    onChange={(e) => setIncludeUppercase(e.target.checked)}
                    className="accent-[#39ff88]"
                  />
                  <span>Uppercase (A-Z)</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-mono text-[#f2f7ff] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeLowercase}
                    onChange={(e) => setIncludeLowercase(e.target.checked)}
                    className="accent-[#39ff88]"
                  />
                  <span>Lowercase (a-z)</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-mono text-[#f2f7ff] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                    className="accent-[#39ff88]"
                  />
                  <span>Numbers (0-9)</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-mono text-[#f2f7ff] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                    className="accent-[#39ff88]"
                  />
                  <span>Symbols (!@#)</span>
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono text-[#8fa3c0]">
                <span>Word Count</span>
                <span className="text-[#f2f7ff]">{wordCount} words</span>
              </div>
              <input
                type="range"
                min={3}
                max={8}
                value={wordCount}
                onChange={(e) => setWordCount(parseInt(e.target.value, 10))}
                className="w-full accent-[#39ff88]"
              />
            </div>
          )}
        </div>
      </div>

      {/* Step by Step Guide */}
      <section className="bg-[#0a1424] border border-[#8fa3c0]/15 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-[#f2f7ff]">Step-by-Step Instructions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <div className="text-xs font-mono text-[#39ff88] font-bold">STEP 01</div>
            <h3 className="text-sm font-semibold text-[#f2f7ff]">Select Password or Passphrase</h3>
            <p className="text-xs text-[#8fa3c0] leading-relaxed">
              Pick character mode for random alphanumeric combinations or Diceware passphrase mode for memorable hyphen-separated words.
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="text-xs font-mono text-[#39ff88] font-bold">STEP 02</div>
            <h3 className="text-sm font-semibold text-[#f2f7ff]">Verify Shannon Entropy Bits</h3>
            <p className="text-xs text-[#8fa3c0] leading-relaxed">
              Aim for at least 65 to 80 bits of entropy. Higher bits make offline brute-force cracking mathematically infeasible.
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="text-xs font-mono text-[#39ff88] font-bold">STEP 03</div>
            <h3 className="text-sm font-semibold text-[#f2f7ff]">Copy to Password Manager</h3>
            <p className="text-xs text-[#8fa3c0] leading-relaxed">
              Click Copy and save the credential directly inside Bitwarden, 1Password, Apple Keychain, or KeePass.
            </p>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-[#f2f7ff]">Frequently Asked Questions</h2>
        <div className="space-y-2">
          {faqs.map((f, i) => (
            <details key={i} className="bg-[#0a1424] border border-[#8fa3c0]/15 rounded-lg p-4 group">
              <summary className="font-semibold text-sm text-[#f2f7ff] cursor-pointer list-none flex items-center justify-between">
                <span>{f.q}</span>
                <span className="text-[#39ff88] font-mono text-xs">+</span>
              </summary>
              <p className="text-xs text-[#8fa3c0] mt-2.5 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
};
