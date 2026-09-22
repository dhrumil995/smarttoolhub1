import React, { useState } from 'react';
import { PageId } from '../types';
import { Mail, Send, CheckCircle2, MessageSquare, AlertCircle, HelpCircle } from 'lucide-react';

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
          <Mail className="w-3.5 h-3.5" />
          <span>Feedback & Workflow Contributions</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Get in Touch with SmartToolHub
        </h1>
        <p className="text-sm text-[#888888]">
          Have a clever Apple Continuity shortcut, an unlisted device edge-case, or a suggestion? We review all submissions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Contact Form */}
        <div className="lg:col-span-7">
          {submitted ? (
            <div className="glass-card p-8 rounded-2xl border border-emerald-500/30 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Thank You for Your Submission!</h3>
              <p className="text-xs text-[#A3A3A3] max-w-sm mx-auto leading-relaxed">
                Your message has been safely received. Our Apple workflow curation team reviews community proposals and compatibility updates weekly.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', category: 'workflow-suggestion', devices: '', message: '' });
                }}
                className="px-4 py-2 rounded-xl bg-[#1A1A1A] hover:bg-[#252525] border border-white/10 text-xs text-white transition-colors cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 rounded-2xl border border-white/15 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white uppercase tracking-wider">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Tim Cook"
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white placeholder-[#666666] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="tim@apple.com"
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white placeholder-[#666666] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white uppercase tracking-wider">Inquiry Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white focus:outline-none"
                >
                  <option value="workflow-suggestion" className="bg-[#12141A] text-white">Suggest a New Workflow / Shortcut</option>
                  <option value="compatibility-correction" className="bg-[#12141A] text-white">Report Hardware Compatibility Discrepancy</option>
                  <option value="troubleshoot-request" className="bg-[#12141A] text-white">Request a New Troubleshooting Diagnostic</option>
                  <option value="press-inquiry" className="bg-[#12141A] text-white">Press or Editorial Inquiry</option>
                  <option value="other" className="bg-[#12141A] text-white">Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white uppercase tracking-wider">Your Apple Devices (Optional)</label>
                <input
                  type="text"
                  value={formData.devices}
                  onChange={(e) => setFormData({ ...formData, devices: e.target.value })}
                  placeholder="e.g. M3 Pro MacBook Pro, iPhone 16 Pro, iPad Pro M4"
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white placeholder-[#666666] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white uppercase tracking-wider">Message / Details</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your workflow or issue in detail..."
                  className="w-full p-3.5 rounded-xl glass-input text-xs text-white placeholder-[#666666] focus:outline-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl glass-button-primary text-xs font-semibold text-white transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit to SmartToolHub Curators</span>
              </button>
            </form>
          )}
        </div>

        {/* Sidebar Info & FAQ */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card p-6 rounded-2xl border border-white/15 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              <span>Community Guidelines</span>
            </h3>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              When suggesting a workflow, please include:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-[#888888]">
              <li>Minimum macOS & iOS version needed</li>
              <li>Whether third-party apps are mandatory or optional</li>
              <li>Any potential iCloud or Bluetooth pitfalls</li>
            </ul>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/15 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-purple-400" />
              <span>Direct Support & Queries</span>
            </h3>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              Have questions, feedback, partnership proposals, or bug reports? Reach out directly to our lead developer:
            </p>
            <a 
              href="mailto:aslaliyamohit9@gmail.com?subject=SmartToolHub%20Inquiry"
              className="p-3 rounded-xl glass-panel font-mono text-xs text-blue-400 hover:text-blue-300 hover:border-blue-400/50 flex items-center justify-between group transition-all"
            >
              <span className="select-all font-semibold">aslaliyamohit9@gmail.com</span>
              <span className="text-[11px] text-blue-400/80 group-hover:translate-x-0.5 transition-transform">Send Email →</span>
            </a>
            <p className="text-[11px] text-[#888888]">
              Response time is typically within 12–24 business hours.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
