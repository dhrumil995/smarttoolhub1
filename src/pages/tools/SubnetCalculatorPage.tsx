import React, { useState, useMemo } from 'react';
import { Network, Check, Copy, AlertCircle, Info, Binary, Table } from 'lucide-react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';

interface SubnetCalculatorPageProps {
  navigate: (path: string) => void;
}

interface IPv4SubnetResult {
  ip: string;
  prefix: number;
  networkAddress: string;
  broadcastAddress: string;
  firstUsableHost: string;
  lastUsableHost: string;
  usableHosts: number;
  totalAddresses: number;
  subnetMask: string;
  wildcardMask: string;
  ipClass: string;
  ipType: 'Private (RFC 1918)' | 'Public' | 'Loopback' | 'Link-Local' | 'Multicast' | 'Reserved';
  binaryIp: string[];
  binaryMask: string[];
}

export const SubnetCalculatorPage: React.FC<SubnetCalculatorPageProps> = ({ navigate }) => {
  const [cidrInput, setCidrInput] = useState<string>('192.168.1.100/24');
  const [activeTab, setActiveTab] = useState<'ipv4' | 'ipv6' | 'cheatsheet'>('ipv4');
  const [ipv6Input, setIpv6Input] = useState<string>('2001:db8:abcd::/48');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'cidr-subnet-calculator') || {
    id: 'cidr-subnet-calculator',
    name: 'CIDR & Subnet Calculator',
    slug: 'cidr-subnet-calculator',
    description: 'Calculate network ranges, usable IP addresses, subnet masks, and binary layouts for any IPv4 or IPv6 CIDR prefix.',
    category: 'Developer',
    icon: 'Network',
    type: 'client',
    keywords: ['cidr calculator', 'subnet mask calculator', 'ipv4 network range', 'ip address host count'],
    relatedToolSlugs: ['install-command-generator', 'quick-calculators'],
    isFlagship: false,
  };

  const relatedTools = LAUNCH_TOOLS.filter(
    (t) => t.slug === 'install-command-generator' || t.slug === 'file-checksum-verifier' || t.slug === 'quick-calculators'
  );
  const relatedGuide = POPULAR_GUIDES[0];

  // Helper conversions
  const intToIp = (int: number): string => {
    return [
      (int >>> 24) & 255,
      (int >>> 16) & 255,
      (int >>> 8) & 255,
      int & 255,
    ].join('.');
  };

  const ipToInt = (ip: string): number => {
    return ip
      .split('.')
      .reduce((acc, octet) => ((acc << 8) + parseInt(octet, 10)) >>> 0, 0);
  };

  const toBinaryOctet = (num: number): string => {
    return (num >>> 0).toString(2).padStart(8, '0');
  };

  // IPv4 calculation
  const parsedIpv4Result = useMemo((): { result?: IPv4SubnetResult; error?: string } => {
    const raw = cidrInput.trim();
    if (!raw) return { error: 'Please enter an IPv4 address and CIDR prefix (e.g., 192.168.1.0/24).' };

    const parts = raw.split('/');
    if (parts.length !== 2) {
      return { error: 'Invalid format. Use IP/Prefix notation (e.g. 10.0.0.1/16 or 192.168.1.50/24).' };
    }

    const ipStr = parts[0].trim();
    const prefixStr = parts[1].trim();

    const prefix = parseInt(prefixStr, 10);
    if (isNaN(prefix) || prefix < 0 || prefix > 32) {
      return { error: 'Prefix length must be an integer between 0 and 32.' };
    }

    const octets = ipStr.split('.');
    if (octets.length !== 4) {
      return { error: 'IPv4 address must contain 4 octets separated by dots (e.g., 172.16.0.1).' };
    }

    for (const oct of octets) {
      const n = parseInt(oct, 10);
      if (isNaN(n) || n < 0 || n > 255 || oct !== n.toString()) {
        return { error: `Invalid octet "${oct}". Each octet must be a number from 0 to 255 without leading zeros.` };
      }
    }

    const ipNum = ipToInt(ipStr);
    const maskNum = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
    const wildcardNum = (~maskNum) >>> 0;
    const networkNum = (ipNum & maskNum) >>> 0;
    const broadcastNum = (ipNum | wildcardNum) >>> 0;

    const totalAddresses = Math.pow(2, 32 - prefix);
    let usableHosts = 0;
    let firstUsableHost = '';
    let lastUsableHost = '';

    if (prefix === 31) {
      usableHosts = 2; // RFC 3021 point-to-point links
      firstUsableHost = intToIp(networkNum);
      lastUsableHost = intToIp(broadcastNum);
    } else if (prefix === 32) {
      usableHosts = 1; // Single host
      firstUsableHost = intToIp(networkNum);
      lastUsableHost = intToIp(networkNum);
    } else {
      usableHosts = Math.max(0, totalAddresses - 2);
      firstUsableHost = intToIp(networkNum + 1);
      lastUsableHost = intToIp(broadcastNum - 1);
    }

    // Determine IP Class
    const firstOctet = parseInt(octets[0], 10);
    let ipClass = 'Class A';
    if (firstOctet >= 128 && firstOctet <= 191) ipClass = 'Class B';
    else if (firstOctet >= 192 && firstOctet <= 223) ipClass = 'Class C';
    else if (firstOctet >= 224 && firstOctet <= 239) ipClass = 'Class D (Multicast)';
    else if (firstOctet >= 240) ipClass = 'Class E (Experimental)';

    // Determine IP Type
    let ipType: IPv4SubnetResult['ipType'] = 'Public';
    if (
      (firstOctet === 10) ||
      (firstOctet === 172 && parseInt(octets[1], 10) >= 16 && parseInt(octets[1], 10) <= 31) ||
      (firstOctet === 192 && parseInt(octets[1], 10) === 168)
    ) {
      ipType = 'Private (RFC 1918)';
    } else if (firstOctet === 127) {
      ipType = 'Loopback';
    } else if (firstOctet === 169 && parseInt(octets[1], 10) === 254) {
      ipType = 'Link-Local';
    } else if (firstOctet >= 224 && firstOctet <= 239) {
      ipType = 'Multicast';
    }

    return {
      result: {
        ip: ipStr,
        prefix,
        networkAddress: intToIp(networkNum),
        broadcastAddress: intToIp(broadcastNum),
        firstUsableHost,
        lastUsableHost,
        usableHosts,
        totalAddresses,
        subnetMask: intToIp(maskNum),
        wildcardMask: intToIp(wildcardNum),
        ipClass,
        ipType,
        binaryIp: octets.map((o) => toBinaryOctet(parseInt(o, 10))),
        binaryMask: intToIp(maskNum).split('.').map((o) => toBinaryOctet(parseInt(o, 10))),
      },
    };
  }, [cidrInput]);

  // IPv6 Calculation
  const parsedIpv6Result = useMemo(() => {
    const raw = ipv6Input.trim();
    if (!raw.includes('/')) return null;
    const [ipPart, prefixPart] = raw.split('/');
    const prefix = parseInt(prefixPart, 10);
    if (isNaN(prefix) || prefix < 0 || prefix > 128) return null;

    let subnets64 = 'N/A';
    if (prefix <= 64) {
      const diff = 64 - prefix;
      subnets64 = Math.pow(2, diff).toLocaleString();
    }

    let type = 'Global Unicast';
    const lower = ipPart.toLowerCase();
    if (lower.startsWith('fe80:')) type = 'Link-Local';
    else if (lower.startsWith('fc00:') || lower.startsWith('fd00:')) type = 'Unique Local (Private)';
    else if (lower === '::1') type = 'Loopback';
    else if (lower.startsWith('ff')) type = 'Multicast';

    return {
      ip: ipPart,
      prefix,
      subnets64,
      hostBits: 128 - prefix,
      type,
    };
  }, [ipv6Input]);

  const handleCopyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(label);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // Handled
    }
  };

  const commonPrefixes = [
    { prefix: '/8', mask: '255.0.0.0', hosts: '16,777,214', notes: 'Large Enterprise / Carrier' },
    { prefix: '/16', mask: '255.255.0.0', hosts: '65,534', notes: 'Corporate Campus / Cloud VPC' },
    { prefix: '/24', mask: '255.255.255.0', hosts: '254', notes: 'Standard Home & Office LAN' },
    { prefix: '/25', mask: '255.255.255.128', hosts: '126', notes: 'Subdivided Branch Network' },
    { prefix: '/26', mask: '255.255.255.192', hosts: '62', notes: 'Departmental VLAN' },
    { prefix: '/27', mask: '255.255.255.224', hosts: '30', notes: 'Server Cluster / Management' },
    { prefix: '/28', mask: '255.255.255.240', hosts: '14', notes: 'Small DMZ / IoT Group' },
    { prefix: '/29', mask: '255.255.255.248', hosts: '6', notes: 'Routed ISP Static Pool' },
    { prefix: '/30', mask: '255.255.255.252', hosts: '2', notes: 'Point-to-Point Router Link' },
    { prefix: '/31', mask: '255.255.255.254', hosts: '2', notes: 'RFC 3021 Router Links' },
    { prefix: '/32', mask: '255.255.255.255', hosts: '1', notes: 'Single Host / Loopback' },
  ];

  const exampleChips = [
    '192.168.1.0/24 (Standard Office LAN)',
    '10.0.0.0/16 (AWS VPC / Cloud Subnet)',
    '172.16.10.0/28 (Small Server Subnet)',
  ];

  const { result: ipv4, error } = parsedIpv4Result;

  return (
    <ToolPageTemplate
      tool={tool}
      heading="CIDR & Subnet Calculator"
      subheading="Calculate network boundaries, broadcast addresses, usable host ranges, and binary bit masks for any IPv4 or IPv6 CIDR prefix."
      inputLabel="IPv4 CIDR Address"
      inputPlaceholder="e.g. 192.168.1.0/24 or 10.50.0.1/20"
      examplePrompt="Calculate subnet mask and host range for 192.168.1.0/24"
      exampleChips={exampleChips}
      lastUpdated="October 2026"
      navigate={navigate}
      onClientCompute={() => ({
        result: !ipv4
          ? 'Invalid IPv4 CIDR notation.'
          : `CIDR: ${ipv4.ip}/${ipv4.prefix}
Network Address: ${ipv4.networkAddress}
Broadcast Address: ${ipv4.broadcastAddress}
Usable Host Range: ${ipv4.firstUsableHost} - ${ipv4.lastUsableHost}
Usable Hosts: ${ipv4.usableHosts.toLocaleString()} (${ipv4.totalAddresses.toLocaleString()} total)
Subnet Mask: ${ipv4.subnetMask}
Wildcard Mask: ${ipv4.wildcardMask}
IP Type: ${ipv4.ipType} (${ipv4.ipClass})
Binary Mask: ${ipv4.binaryMask.join('.')}`,
      })}
      extraControls={
        <div className="space-y-6 pt-2">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-[rgba(143,163,192,0.12)] pb-3">
            <button
              type="button"
              onClick={() => setActiveTab('ipv4')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all focus-ring ${
                activeTab === 'ipv4'
                  ? 'bg-[#6c7dff] text-white shadow-sm font-bold'
                  : 'text-[#9aaccb] hover:text-[#f2f7ff]'
              }`}
            >
              IPv4 Subnet Calculator
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ipv6')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all focus-ring ${
                activeTab === 'ipv6'
                  ? 'bg-[#6c7dff] text-white shadow-sm font-bold'
                  : 'text-[#9aaccb] hover:text-[#f2f7ff]'
              }`}
            >
              IPv6 Prefix Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('cheatsheet')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all focus-ring ${
                activeTab === 'cheatsheet'
                  ? 'bg-[#6c7dff] text-white shadow-sm font-bold'
                  : 'text-[#9aaccb] hover:text-[#f2f7ff]'
              }`}
            >
              CIDR Cheat Sheet
            </button>
          </div>

          {/* TAB 1: IPv4 CALCULATOR */}
          {activeTab === 'ipv4' && (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#9aaccb]">
                  IPv4 Address with CIDR Prefix
                </label>
                <input
                  type="text"
                  value={cidrInput}
                  onChange={(e) => setCidrInput(e.target.value)}
                  placeholder="e.g. 192.168.1.100/24"
                  className="w-full bg-[#0a1424] border border-[rgba(143,163,192,0.2)] rounded-2xl px-4 py-3 text-sm font-mono text-[#f2f7ff] placeholder-[#9aaccb] focus-ring"
                />
              </div>

              {/* Error banner if invalid */}
              {error && (
                <div className="p-3.5 rounded-xl bg-[rgba(255,92,122,0.12)] border border-[#ff5c7a] flex items-center gap-2.5 text-xs text-[#ff5c7a]">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Success Result View */}
              {ipv4 && (
                <div className="space-y-5">
                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.14)] space-y-1">
                      <div className="text-[11px] font-mono text-[#9aaccb] uppercase">Usable Hosts</div>
                      <div className="text-xl sm:text-2xl font-bold font-mono text-[#6c7dff]">
                        {ipv4.usableHosts.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-[#9aaccb]">/{ipv4.prefix} Prefix</div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.14)] space-y-1">
                      <div className="text-[11px] font-mono text-[#9aaccb] uppercase">Network Address</div>
                      <div className="text-sm font-bold font-mono text-[#f2f7ff] truncate" title={ipv4.networkAddress}>
                        {ipv4.networkAddress}
                      </div>
                      <div className="text-[10px] text-[#9aaccb]">First address</div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.14)] space-y-1">
                      <div className="text-[11px] font-mono text-[#9aaccb] uppercase">Broadcast</div>
                      <div className="text-sm font-bold font-mono text-[#f2f7ff] truncate" title={ipv4.broadcastAddress}>
                        {ipv4.broadcastAddress}
                      </div>
                      <div className="text-[10px] text-[#9aaccb]">Last address</div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.14)] space-y-1">
                      <div className="text-[11px] font-mono text-[#9aaccb] uppercase">Scope Type</div>
                      <div className="text-xs font-bold text-[#34e0a1] truncate">
                        {ipv4.ipType}
                      </div>
                      <div className="text-[10px] text-[#9aaccb]">{ipv4.ipClass}</div>
                    </div>
                  </div>

                  {/* Detailed Table */}
                  <div className="p-5 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-3">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-[#6c7dff] font-bold">
                      Subnet Addressing Breakdown
                    </h4>

                    <div className="divide-y divide-[rgba(143,163,192,0.1)] text-xs">
                      <div className="py-2.5 flex items-center justify-between gap-2">
                        <span className="text-[#9aaccb]">Subnet Mask</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#f2f7ff]">{ipv4.subnetMask}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyText(ipv4.subnetMask, 'mask')}
                            className="text-[#9aaccb] hover:text-[#6c7dff] focus-ring rounded p-1"
                          >
                            {copiedField === 'mask' ? <Check className="w-3 h-3 text-[#34e0a1]" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>

                      <div className="py-2.5 flex items-center justify-between gap-2">
                        <span className="text-[#9aaccb]">Wildcard Mask</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#f2f7ff]">{ipv4.wildcardMask}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyText(ipv4.wildcardMask, 'wildcard')}
                            className="text-[#9aaccb] hover:text-[#6c7dff] focus-ring rounded p-1"
                          >
                            {copiedField === 'wildcard' ? <Check className="w-3 h-3 text-[#34e0a1]" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>

                      <div className="py-2.5 flex items-center justify-between gap-2">
                        <span className="text-[#9aaccb]">First Usable Host IP</span>
                        <span className="font-mono font-bold text-[#34e0a1]">{ipv4.firstUsableHost}</span>
                      </div>

                      <div className="py-2.5 flex items-center justify-between gap-2">
                        <span className="text-[#9aaccb]">Last Usable Host IP</span>
                        <span className="font-mono font-bold text-[#34e0a1]">{ipv4.lastUsableHost}</span>
                      </div>

                      <div className="py-2.5 flex items-center justify-between gap-2">
                        <span className="text-[#9aaccb]">Total IP Addresses in Block</span>
                        <span className="font-mono font-bold text-[#f2f7ff]">{ipv4.totalAddresses.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Binary View Box */}
                  <div className="p-5 rounded-3xl bg-[#050a14] border border-[rgba(143,163,192,0.18)] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase text-[#6c7dff] font-bold flex items-center gap-1.5">
                        <Binary className="w-4 h-4" />
                        <span>Binary Bit Representation (32-Bit)</span>
                      </span>
                    </div>

                    <div className="space-y-2 font-mono text-xs overflow-x-auto">
                      <div>
                        <div className="text-[#9aaccb] text-[10px] uppercase">IP Address Bits:</div>
                        <div className="text-[#f2f7ff] tracking-widest mt-0.5">
                          {ipv4.binaryIp.join(' . ')}
                        </div>
                      </div>

                      <div>
                        <div className="text-[#9aaccb] text-[10px] uppercase">Subnet Mask Bits:</div>
                        <div className="text-[#6c7dff] tracking-widest mt-0.5">
                          {ipv4.binaryMask.join(' . ')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: IPv6 PREFIX OVERVIEW */}
          {activeTab === 'ipv6' && (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#9aaccb]">
                  IPv6 Address / Prefix Length
                </label>
                <input
                  type="text"
                  value={ipv6Input}
                  onChange={(e) => setIpv6Input(e.target.value)}
                  placeholder="e.g. 2001:db8:1234::/48"
                  className="w-full bg-[#0a1424] border border-[rgba(143,163,192,0.2)] rounded-2xl px-4 py-3 text-sm font-mono text-[#f2f7ff] placeholder-[#9aaccb] focus-ring"
                />
              </div>

              {parsedIpv6Result ? (
                <div className="p-5 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-4">
                  <h4 className="text-xs font-mono uppercase text-[#6c7dff] font-bold">
                    IPv6 Prefix Structure
                  </h4>

                  <div className="divide-y divide-[rgba(143,163,192,0.1)] text-xs">
                    <div className="py-2.5 flex items-center justify-between">
                      <span className="text-[#9aaccb]">Allocated Prefix</span>
                      <span className="font-mono font-bold text-[#f2f7ff]">/{parsedIpv6Result.prefix}</span>
                    </div>

                    <div className="py-2.5 flex items-center justify-between">
                      <span className="text-[#9aaccb]">Address Scope</span>
                      <span className="font-mono font-bold text-[#34e0a1]">{parsedIpv6Result.type}</span>
                    </div>

                    <div className="py-2.5 flex items-center justify-between">
                      <span className="text-[#9aaccb]">Total Standard /64 Subnets</span>
                      <span className="font-mono font-bold text-[#6c7dff]">{parsedIpv6Result.subnets64}</span>
                    </div>

                    <div className="py-2.5 flex items-center justify-between">
                      <span className="text-[#9aaccb]">Available Host Bits</span>
                      <span className="font-mono font-bold text-[#f2f7ff]">{parsedIpv6Result.hostBits} bits</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#101c33] text-xs text-[#9aaccb] leading-relaxed">
                    <span className="text-[#6c7dff] font-bold">IPv6 Note: </span>
                    Under RFC 4291, all end-user LAN subnets should use a <code>/64</code> prefix length to enable SLAAC (Stateless Address Autoconfiguration). ISPs typically delegate a <code>/48</code> or <code>/56</code> prefix to residential and enterprise customers.
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#0a1424] text-xs text-[#9aaccb]">
                  Please enter a valid IPv6 CIDR prefix (e.g. <code>2001:db8::/48</code>).
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CHEAT SHEET TABLE */}
          {activeTab === 'cheatsheet' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs text-[#9aaccb]">
                <Table className="w-4 h-4 text-[#6c7dff]" />
                <span>Common IPv4 Subnet Mask &amp; Host Capacity Reference</span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-[rgba(143,163,192,0.16)]">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#101c33] text-[#9aaccb] border-b border-[rgba(143,163,192,0.12)]">
                    <tr>
                      <th className="p-3">Prefix</th>
                      <th className="p-3">Subnet Mask</th>
                      <th className="p-3">Usable Hosts</th>
                      <th className="p-3">Common Usage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(143,163,192,0.08)] bg-[#0a1424]">
                    {commonPrefixes.map((p) => (
                      <tr key={p.prefix} className="hover:bg-[#101c33]/50 transition-colors">
                        <td className="p-3 font-bold text-[#6c7dff]">{p.prefix}</td>
                        <td className="p-3 text-[#f2f7ff]">{p.mask}</td>
                        <td className="p-3 text-[#34e0a1] font-bold">{p.hosts}</td>
                        <td className="p-3 text-[#9aaccb] font-sans">{p.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      }
      whatItDoesContent={
        <>
          <p>
            The CIDR &amp; Subnet Calculator is an essential engineering tool for network administrators, cloud architects, and system engineers designing local area networks (LANs), virtual private clouds (VPCs), and container subnets. It transforms any Classless Inter-Domain Routing (CIDR) notation into complete, unambiguous subnet bounds.
          </p>
          <p>
            The calculator instantly computes the exact network wire address, broadcast address, first and last usable host IPs, dotted-decimal subnet mask, Cisco-style wildcard mask, and binary 32-bit layout. It supports edge configurations including RFC 3021 <code>/31</code> point-to-point router connections and <code>/32</code> single-host loopbacks with complete standard compliance.
          </p>
        </>
      }
      howToUseSteps={[
        {
          step: 'Enter your IPv4 address and prefix',
          text: 'Type any IP address with its CIDR slash notation (such as 192.168.1.100/24 or 10.0.0.1/16).',
        },
        {
          step: 'Inspect the address boundaries',
          text: 'Review the network address, broadcast address, and first/last usable IP for router and DHCP reservation setups.',
        },
        {
          step: 'Check binary bits or reference the cheat sheet',
          text: 'Switch tabs to view binary bit masking or consult the common prefix cheat sheet for network planning.',
        },
      ]}
      workedExample={{
        title: 'Example: Subnetting a /27 Departmental VLAN',
        scenario: 'A network engineer needs to allocate a /27 subnet starting at 172.16.50.0 for an engineering lab.',
        output: `CIDR: 172.16.50.0/27
Subnet Mask: 255.255.255.224
Wildcard Mask: 0.0.0.31

Network Address: 172.16.50.0
Broadcast Address: 172.16.50.31
Usable Host Range: 172.16.50.1 to 172.16.50.30
Total Usable Hosts: 30 devices

Binary Mask: 11111111.11111111.11111111.11100000`,
      }}
      tips={[
        'Remember the 2-host deduction: For subnets between /1 and /30, 2 addresses are reserved for the network identifier and the broadcast address.',
        'RFC 3021 /31 subnets save address space: Point-to-point router links can use /31 without dedicated broadcast addresses.',
        'Wildcard masks for Cisco ACLs: The wildcard mask is the exact bitwise inverse of the subnet mask (255.255.255.255 minus the subnet mask).',
        'Private IP ranges (RFC 1918): Class A (10.0.0.0/8), Class B (172.16.0.0/12), and Class C (192.168.0.0/16) are not routable on the public internet.',
      ]}
      faq={[
        {
          question: 'What does CIDR notation mean in computer networking?',
          answer: 'CIDR stands for Classless Inter-Domain Routing. The number after the slash (e.g., /24) represents the number of leading binary 1-bits in the subnet mask, determining how many bits identify the network versus individual hosts.',
        },
        {
          question: 'Why are there only 254 usable hosts in a /24 subnet?',
          answer: 'A /24 subnet contains 256 total IP addresses (2^8). However, the very first address (.0) is reserved as the network wire address and the last address (.255) is reserved as the broadcast address, leaving 254 usable hosts.',
        },
        {
          question: 'What is a wildcard mask and where is it used?',
          answer: 'A wildcard mask is the inverted representation of a subnet mask where 0-bits indicate matching bits and 1-bits indicate "don\'t care" bits. They are used in Cisco IOS Access Control Lists (ACLs) and OSPF router configurations.',
        },
        {
          question: 'How do IPv6 prefixes differ from IPv4 subnets?',
          answer: 'IPv6 uses 128-bit addresses instead of 32-bit. The standard end-user LAN prefix in IPv6 is /64, which contains 18 quintillion addresses per single subnet, eliminating the need for private address NAT.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
