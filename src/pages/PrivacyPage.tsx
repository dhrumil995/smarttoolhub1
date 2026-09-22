import React from 'react';
import { PageId } from '../types';
import { ShieldCheck, Lock, EyeOff, Server, HardDrive, CheckCircle2 } from 'lucide-react';

interface PrivacyPageProps {
  onNavigate: (page: PageId) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Zero-Credentials & Zero-Tracking Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Privacy Policy & Security Charter
        </h1>
        <p className="text-xs text-[#888888]">
          Effective Date: September 20, 2026 • Version 2.4
        </p>
      </div>

      {/* Core Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl glass-panel space-y-2">
          <Lock className="w-5 h-5 text-emerald-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">No Credentials</h3>
          <p className="text-xs text-[#A3A3A3] leading-relaxed">
            We never request or store your Apple ID, iCloud password, Wi-Fi keys, or device passcodes.
          </p>
        </div>
        <div className="p-4 rounded-xl glass-panel space-y-2">
          <EyeOff className="w-5 h-5 text-emerald-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">No Tracking</h3>
          <p className="text-xs text-[#A3A3A3] leading-relaxed">
            Zero third-party advertising trackers, cross-site trackers, or fingerprinting scripts.
          </p>
        </div>
        <div className="p-4 rounded-xl glass-panel space-y-2">
          <HardDrive className="w-5 h-5 text-emerald-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Local Persistence</h3>
          <p className="text-xs text-[#A3A3A3] leading-relaxed">
            Your saved workflows and checklist progress reside purely inside your local browser storage.
          </p>
        </div>
      </div>

      {/* Detailed Sections */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/15 space-y-6 text-xs text-[#CCCCCC] leading-relaxed">
        
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            1. The Zero-Credentials Guarantee
          </h2>
          <p>
            SmartToolHub operates exclusively as an educational knowledge base and diagnostic assistant. 
            Under no circumstances will SmartToolHub prompt you for your Apple ID, iCloud password, macOS Keychain access, two-factor authentication codes, or hardware passcodes. 
            All Apple ecosystem features explained on this site (such as Continuity, AirDrop, Universal Clipboard, and Sidecar) operate strictly over Apple's native, peer-to-peer, encrypted Wi-Fi and Bluetooth links between your own physical hardware.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            2. AI Workflow Generator Data Handling
          </h2>
          <p>
            When you submit a query to the Workflow Generator (such as device models and desired tasks), the request is transmitted over an encrypted TLS connection to our secure server. 
            The server evaluates your query with state-of-the-art AI inference to generate technical steps. 
            We do not store your device inventory or queries in a persistent database, and we do not sell your task history to third parties.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            3. Local Storage Usage
          </h2>
          <p>
            SmartToolHub uses standard browser <code>localStorage</code> solely for:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-[#A3A3A3]">
            <li>Saving your bookmarked workflows locally on your machine</li>
            <li>Remembering completed steps in the interactive checklists</li>
            <li>Caching your selected device preferences for quicker subsequent checks</li>
          </ul>
          <p className="pt-1">
            You can purge this data at any moment by clearing your browser's site cookies and local storage.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            4. Diagnostic Command Safety
          </h2>
          <p>
            The Troubleshooting Wizard provides terminal commands for macOS power users. 
            Every command presented is strictly non-destructive (e.g., restarting the Bluetooth userland daemon or flushing local DNS cache). 
            No commands modify system integrity protection (SIP), alter user permissions, or delete personal files.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            5. Contact for Privacy Inquiries
          </h2>
          <p>
            If you have questions or requests regarding this Privacy Policy or your data, please email us directly at{' '}
            <a 
              href="mailto:aslaliyamohit9@gmail.com?subject=SmartToolHub%20Privacy%20Inquiry"
              className="text-blue-400 hover:underline font-mono font-semibold"
            >
              aslaliyamohit9@gmail.com
            </a>{' '}
            or submit a note on our{' '}
            <button 
              onClick={() => onNavigate('contact')}
              className="text-blue-400 hover:underline font-semibold cursor-pointer"
            >
              Contact Page
            </button>.
          </p>
        </section>

      </div>
    </div>
  );
};
