import React from 'react';
import { PageId } from '../types';
import { FileText, ShieldAlert } from 'lucide-react';

interface TermsPageProps {
  onNavigate: (page: PageId) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
          <FileText className="w-3.5 h-3.5" />
          <span>Legal Framework</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs text-[#888888]">
          Last Revised: September 20, 2026
        </p>
      </div>

      <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/15 space-y-6 text-xs text-[#CCCCCC] leading-relaxed">
        
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing and utilizing SmartToolHub ("the Service"), you agree to be bound by these Terms of Service. 
            If you do not agree with any part of these terms, please discontinue use of the site immediately.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            2. Trademark & Non-Affiliation Disclaimer
          </h2>
          <p>
            SmartToolHub is an independent technical guide and workflow catalog. 
            Apple, the Apple logo, Mac, MacBook Pro, MacBook Air, Mac mini, Mac Studio, iMac, iPhone, iPad, iPad Pro, iPad Air, Apple Pencil, Apple Watch, macOS, iOS, iPadOS, AirDrop, Sidecar, Continuity, Universal Control, and Apple Intelligence are trademarks of Apple Inc., registered in the U.S. and other countries and regions.
          </p>
          <p className="text-[#888888]">
            SmartToolHub is NOT affiliated with, sponsored by, authorized by, or endorsed by Apple Inc.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            3. Accuracy of Workflows & Technical Advice
          </h2>
          <p>
            All workflows, hardware compatibility matrices, and diagnostic steps on SmartToolHub are compiled through rigorous empirical testing and official Apple Developer documentation. 
            However, operating system updates from Apple may alter feature behavior, UI locations, or hardware limitations. 
            SmartToolHub provides all materials "AS IS" without warranties of any kind.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            4. Command Execution Responsibility
          </h2>
          <p>
            While all diagnostic terminal commands on SmartToolHub are inspected for safety, users execute commands in their terminal application at their own discretion. 
            Users must verify that they are running verified terminal commands and possess administrator privileges on their personal machine.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            5. Intellectual Property
          </h2>
          <p>
            The original organizational schemas, diagnostic trees, written descriptions, and synthesis algorithms on SmartToolHub are protected under international copyright laws. 
            You may not scrape or replicate our entire workflow repository for commercial resale without prior written consent.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            6. Changes to Terms
          </h2>
          <p>
            We reserve the right to update these terms at any time. Continued use of SmartToolHub after any modifications constitutes acceptance of the new terms.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            7. Contact & Legal Notices
          </h2>
          <p>
            For inquiries regarding these Terms of Service, please contact us at{' '}
            <a 
              href="mailto:aslaliyamohit9@gmail.com?subject=SmartToolHub%20Terms%20Inquiry"
              className="text-blue-400 hover:underline font-mono font-semibold"
            >
              aslaliyamohit9@gmail.com
            </a>.
          </p>
        </section>

      </div>
    </div>
  );
};
