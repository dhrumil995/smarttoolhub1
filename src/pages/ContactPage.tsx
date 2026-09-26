import React, { useState } from 'react';
import { PageId } from '../types';
import { Mail, Send, CheckCircle2, MessageSquare, HelpCircle } from 'lucide-react';
import { IOSInput } from '../components/ios/IOSInput';
import { IOSButton } from '../components/ios/IOSButton';
import { haptics } from '../utils/haptics';

interface ContactPageProps {
  onNavigate: (page: PageId) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'workflow-suggestion',
    devices: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    haptics.playTap();
    // Simulate saving message / feedback
    try {
      const messages = JSON.parse(localStorage.getItem('smarttoolhub_contact_submissions') || '[]');
      messages.push({ ...formData, submittedAt: new Date().toISOString() });
      localStorage.setItem('smarttoolhub_contact_submissions', JSON.stringify(messages));
    } catch {
      // guard
    }

    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-200/70 dark:bg-white/[0.08] border border-black/[0.04] dark:border-white/[0.08] text-xs font-medium text-neutral-800 dark:text-[#F5F5F7]">
          <Mail className="w-3.5 h-3.5 text-[#0A84FF]" />
          <span>Feedback & Workflow Contributions</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-[#F5F5F7] tracking-tight">
          Get in Touch with SmartToolHub
        </h1>
        <p className="text-sm text-[#86868B] leading-relaxed">
          Have a clever Apple Continuity shortcut, an unlisted device edge-case, or a suggestion? We review all submissions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Contact Form with Apple iOS Design & Large Touch-Friendly Inputs */}
        <div className="lg:col-span-7">
          {submitted ? (
            <div className="ios-card-static p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#0A84FF]/10 text-[#0A84FF] border border-[#0A84FF]/20 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Thank You for Your Submission!</h3>
              <p className="text-xs sm:text-sm text-[#86868B] max-w-sm mx-auto leading-relaxed">
                Your message has been safely received. Our Apple workflow curation team reviews community proposals and compatibility updates weekly.
              </p>
              <div className="pt-2">
                <IOSButton
                  variant="secondary"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', category: 'workflow-suggestion', devices: '', message: '' });
                  }}
                >
                  Send Another Message
                </IOSButton>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="ios-card-static p-6 sm:p-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <IOSInput
                  label="Your Name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Tim Cook"
                />

                <IOSInput
                  label="Email Address"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="tim@apple.com"
                />
              </div>

              {/* Inquiry Category Select */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-[#86868B] uppercase tracking-wider block px-1">
                  Inquiry Category
                </label>
                <div className="relative min-h-[48px] rounded-2xl bg-white/70 dark:bg-[#1C1C1E]/80 border border-black/[0.08] dark:border-white/[0.10] flex items-center px-4 backdrop-blur-md">
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-transparent text-sm text-neutral-900 dark:text-[#F5F5F7] focus:outline-none cursor-pointer"
                    style={{ fontSize: '16px' }}
                  >
                    <option value="workflow-suggestion" className="bg-[#F5F5F7] dark:bg-[#1C1C1E] text-neutral-900 dark:text-white">
                      Suggest a New Workflow / Shortcut
                    </option>
                    <option value="compatibility-correction" className="bg-[#F5F5F7] dark:bg-[#1C1C1E] text-neutral-900 dark:text-white">
                      Report Hardware Compatibility Discrepancy
                    </option>
                    <option value="troubleshoot-request" className="bg-[#F5F5F7] dark:bg-[#1C1C1E] text-neutral-900 dark:text-white">
                      Request a New Troubleshooting Diagnostic
                    </option>
                    <option value="press-inquiry" className="bg-[#F5F5F7] dark:bg-[#1C1C1E] text-neutral-900 dark:text-white">
                      Press or Editorial Inquiry
                    </option>
                    <option value="other" className="bg-[#F5F5F7] dark:bg-[#1C1C1E] text-neutral-900 dark:text-white">
                      Other
                    </option>
                  </select>
                </div>
              </div>

              <IOSInput
                label="Your Apple Devices (Optional)"
                value={formData.devices}
                onChange={(e) => setFormData({ ...formData, devices: e.target.value })}
                placeholder="e.g. M3 Pro MacBook Pro, iPhone 16 Pro, iPad Pro M4"
              />

              {/* Message Details */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-[#86868B] uppercase tracking-wider block px-1">
                  Message Details
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your workflow or issue in detail..."
                  className="w-full p-4 rounded-2xl bg-white/70 dark:bg-[#1C1C1E]/80 border border-black/[0.08] dark:border-white/[0.10] focus:border-[#0A84FF] text-sm text-neutral-900 dark:text-[#F5F5F7] placeholder-[#86868B]/60 focus:outline-none leading-relaxed transition-all duration-200"
                  style={{ fontSize: '16px' }}
                />
              </div>

              <div className="pt-2">
                <IOSButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  icon={<Send className="w-4 h-4" />}
                >
                  Submit to SmartToolHub Curators
                </IOSButton>
              </div>
            </form>
          )}
        </div>

        {/* Sidebar Info & Guidelines */}
        <div className="lg:col-span-5 space-y-4">
          <div className="ios-card-static p-6 space-y-3">
            <h3 className="text-xs font-semibold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#0A84FF]" />
              <span>Community Guidelines</span>
            </h3>
            <p className="text-xs text-[#86868B] leading-relaxed">
              When suggesting a workflow, please include:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs text-[#86868B]">
              <li>Minimum macOS & iOS version needed</li>
              <li>Whether third-party apps are mandatory or optional</li>
              <li>Any potential iCloud or Bluetooth pitfalls</li>
            </ul>
          </div>

          <div className="ios-card-static p-6 space-y-3">
            <h3 className="text-xs font-semibold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#0A84FF]" />
              <span>Direct Support & Queries</span>
            </h3>
            <p className="text-xs text-[#86868B] leading-relaxed">
              Have questions, feedback, partnership proposals, or bug reports? Reach out directly to our lead developer:
            </p>
            <a 
              href="mailto:aslaliyamohit9@gmail.com?subject=SmartToolHub%20Inquiry"
              className="p-3 rounded-2xl bg-neutral-100 dark:bg-white/[0.06] border border-black/[0.04] dark:border-white/[0.08] text-xs text-[#0A84FF] hover:underline flex items-center justify-between group transition-all"
            >
              <span className="select-all font-mono font-medium">aslaliyamohit9@gmail.com</span>
              <span className="text-[11px] group-hover:translate-x-0.5 transition-transform">Send Email →</span>
            </a>
            <p className="text-[11px] text-[#86868B]">
              Response time is typically within 12–24 business hours.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
