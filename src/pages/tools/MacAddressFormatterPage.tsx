import React, { useState, useMemo } from 'react';
import { Cpu, Copy, Check, Network, ShieldCheck, RefreshCw } from 'lucide-react';
import { SchemaScript } from '../../components/seo/SchemaScript.tsx';

interface MacAddressFormatterPageProps {
  navigate: (path: string) => void;
}

export const MacAddressFormatterPage: React.FC<MacAddressFormatterPageProps> = ({ navigate }) => {
  const [inputMac, setInputMac] = useState('00:1A:2B:3C:4D:5E');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  // Common OUI Vendor lookup prefix map
  const vendorMap: Record<string, string> = {
    '001A2B': 'Ayecom Technology Co., Ltd.',
    '005056': 'VMware, Inc.',
    '000C29': 'VMware, Inc.',
    'F01898': 'Apple, Inc.',
    '3C0630': 'Apple, Inc.',
    'BC6EE0': 'Apple, Inc.',
    '00155D': 'Microsoft Corporation (Hyper-V)',
    '001A11': 'Google, Inc.',
    '00090F': 'Fortinet Technologies Inc.',
    '001018': 'Broadcom Corporation',
    '002590': 'Super Micro Computer, Inc.',
    '001E67': 'Intel Corporate',
  };

  const parsed = useMemo(() => {
    // Strip all non-hexadecimal characters
    const cleanHex = inputMac.replace(/[^a-fA-F0-9]/g, '').toUpperCase();
    if (cleanHex.length < 12) {
      return {
        isValid: false,
        error: `Incomplete address: contains ${cleanHex.length} hex digits (12 required).`,
      };
    }

    const hex12 = cleanHex.slice(0, 12);
    const pairs = hex12.match(/.{1,2}/g) || [];

    const colonUpper = pairs.join(':');
    const colonLower = colonUpper.toLowerCase();
    const hyphenUpper = pairs.join('-');
    const hyphenLower = hyphenUpper.toLowerCase();
    const ciscoDotUpper = `${hex12.slice(0, 4)}.${hex12.slice(4, 8)}.${hex12.slice(8, 12)}`;
    const ciscoDotLower = ciscoDotUpper.toLowerCase();
    const rawUpper = hex12;
    const rawLower = hex12.toLowerCase();

    // Decode IEEE 802 bits from first octet
    const firstOctetInt = parseInt(hex12.slice(0, 2), 16);
    const isMulticast = (firstOctetInt & 1) === 1;
    const isLocalAdmin = (firstOctetInt & 2) === 2;

    // OUI 6-character lookup
    const ouiPrefix = hex12.slice(0, 6);
    const vendor = vendorMap[ouiPrefix] || 'Public IEEE Assigned OUI / Unlisted';

    return {
      isValid: true,
      error: null,
      formats: [
        { label: 'Colon (Standard Linux / macOS)', value: colonUpper },
        { label: 'Colon Lowercase', value: colonLower },
        { label: 'Hyphen (Standard Windows / IEEE)', value: hyphenUpper },
        { label: 'Hyphen Lowercase', value: hyphenLower },
        { label: 'Cisco Dot Notation (IOS / Switches)', value: ciscoDotLower },
        { label: 'Cisco Dot Uppercase', value: ciscoDotUpper },
        { label: 'Raw Unformatted Uppercase', value: rawUpper },
        { label: 'Raw Unformatted Lowercase', value: rawLower },
      ],
      isMulticast,
      isLocalAdmin,
      vendor,
      ouiPrefix,
    };
  }, [inputMac]);

  const handleCopy = (val: string, label: string) => {
    navigator.clipboard.writeText(val);
    setCopiedFormat(label);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const faqs = [
    {
      q: 'Why are there multiple different MAC address formats?',
      a: 'Different operating systems and network hardware vendors standardize on different delimiters. Windows primarily displays hyphens (`00-1A-2B-3C-4D-5E`), Linux and macOS use colons (`00:1A:2B:3C:4D:5E`), and Cisco switches require three groups of four dots (`001a.2b3c.4d5e`).',
    },
    {
      q: 'What is an OUI (Organizationally Unique Identifier)?',
      a: 'The first 3 octets (24 bits) of a MAC address form the OUI, assigned to hardware manufacturers by the IEEE to ensure network adapter addresses are globally unique across manufacturers.',
    },
    {
      q: 'What does a Locally Administered Address (LAA) mean?',
      a: 'If bit 1 of the first octet is set, the MAC address has been randomized or manually configured (common in modern iOS and Android "Private Wi-Fi Address" security features).',
    },
  ];

  const schemaJson = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'MAC Address Formatter & OUI Vendor Lookup',
    'applicationCategory': 'DeveloperApplication',
    'operatingSystem': 'All',
    'description': 'Convert MAC addresses between colon, hyphen, Cisco dot, and raw formats with OUI manufacturer lookup and IEEE bit decoding.',
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
        <span className="text-[#39ff88]">MAC Address Formatter</span>
      </nav>

      {/* Header */}
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#0a1424] border border-[#39ff88]/30 text-[#39ff88] text-xs font-mono">
          <Cpu className="w-3.5 h-3.5" />
          <span>NETWORK DIAGNOSTICS &amp; HARDWARE</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#f2f7ff] tracking-tight">
          MAC Address Formatter &amp; Vendor Lookup
        </h1>
        <p className="text-base sm:text-lg text-[#8fa3c0] max-w-2xl leading-relaxed">
          Convert network hardware MAC addresses between Windows, Linux, and Cisco formats. Inspect OUI vendor prefixes and IEEE unicast/local bits.
        </p>
      </header>

      {/* Workspace */}
      <div className="bg-[#0a1424] border border-[#8fa3c0]/20 rounded-xl p-5 sm:p-6 space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-mono text-[#8fa3c0] uppercase tracking-wider">
            Enter Any MAC Address Format
          </label>
          <input
            type="text"
            value={inputMac}
            onChange={(e) => setInputMac(e.target.value)}
            className="w-full bg-[#050a14] border border-[#8fa3c0]/30 rounded-lg p-3 text-base text-[#39ff88] font-mono tracking-wider focus:outline-none focus:border-[#39ff88]"
            placeholder="e.g. 00:1A:2B:3C:4D:5E or 001a.2b3c.4d5e"
          />
        </div>

        {/* Validation / Diagnostic Info */}
        {parsed.isValid ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#050a14] border border-[#8fa3c0]/20 rounded-lg p-3 text-xs font-mono">
            <div>
              <span className="text-[#8fa3c0]">OUI Prefix:</span>{' '}
              <span className="text-[#39ff88] font-bold">{parsed.ouiPrefix}</span>
            </div>
            <div>
              <span className="text-[#8fa3c0]">Address Type:</span>{' '}
              <span className="text-[#f2f7ff]">{parsed.isMulticast ? 'Multicast' : 'Unicast'}</span>
            </div>
            <div>
              <span className="text-[#8fa3c0]">Administration:</span>{' '}
              <span className="text-[#7db8ff]">{parsed.isLocalAdmin ? 'Locally Administered' : 'Globally Unique (UAA)'}</span>
            </div>
          </div>
        ) : (
          <div className="text-xs font-mono text-[#ffb840]">{parsed.error}</div>
        )}

        {/* Formatted Variations Table */}
        {parsed.isValid && (
          <div className="space-y-2">
            <div className="text-xs font-mono text-[#8fa3c0] uppercase">Converted Format Options</div>
            <div className="space-y-2">
              {parsed.formats?.map((f, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 bg-[#050a14] border border-[#8fa3c0]/20 rounded-lg p-3 hover:border-[#39ff88]/40 transition-colors"
                >
                  <div className="space-y-0.5 truncate">
                    <div className="text-[11px] font-mono text-[#8fa3c0]">{f.label}</div>
                    <div className="text-sm font-mono text-[#f2f7ff] font-semibold">{f.value}</div>
                  </div>
                  <button
                    onClick={() => handleCopy(f.value, f.label)}
                    className="px-3 py-1.5 rounded bg-[#0a1424] hover:bg-[#39ff88] hover:text-[#050a14] border border-[#8fa3c0]/30 text-[#f2f7ff] text-xs font-mono font-medium transition-colors shrink-0 flex items-center gap-1.5"
                  >
                    {copiedFormat === f.label ? <Check className="w-3.5 h-3.5 text-[#39ff88]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedFormat === f.label ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Step by Step Guide */}
      <section className="bg-[#0a1424] border border-[#8fa3c0]/15 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-[#f2f7ff]">Step-by-Step Instructions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <div className="text-xs font-mono text-[#39ff88] font-bold">STEP 01</div>
            <h3 className="text-sm font-semibold text-[#f2f7ff]">Paste Address String</h3>
            <p className="text-xs text-[#8fa3c0] leading-relaxed">
              Paste your raw MAC address from terminal commands like `ipconfig /all`, `ifconfig`, or router DHCP client tables.
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="text-xs font-mono text-[#39ff88] font-bold">STEP 02</div>
            <h3 className="text-sm font-semibold text-[#f2f7ff]">Inspect IEEE Diagnostics</h3>
            <p className="text-xs text-[#8fa3c0] leading-relaxed">
              Verify the OUI prefix, check whether the adapter uses unicast or multicast, and confirm whether it is hardware-assigned or randomized.
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="text-xs font-mono text-[#39ff88] font-bold">STEP 03</div>
            <h3 className="text-sm font-semibold text-[#f2f7ff]">Copy Target Format</h3>
            <p className="text-xs text-[#8fa3c0] leading-relaxed">
              Tap Copy next to your desired convention (Cisco dot, Windows hyphen, Linux colon, or raw database string).
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
