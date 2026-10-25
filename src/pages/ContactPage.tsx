import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, ChevronRight, MessageSquare, Shield, Copy, Check, Clock, HelpCircle } from 'lucide-react';
import { Link } from '../hooks/useRouter.tsx';

interface ContactPageProps {
  navigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ navigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Feedback / Tool Suggestion');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) return;
    setIsSubmitted(true);
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('contact@smarttoolhub.net');
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      // Handled
    }
  };

  return (
    <article className="py-6 sm:py-12 max-w-2xl mx-auto space-y-8">
      {/* Breadcrumbs Landmark */}
      <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-[#8fa3c0]">
        <Link href="/" navigate={navigate} className="hover:text-[#34e0a1] transition-colors focus-ring rounded">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#8fa3c0]/60" />
        <span className="text-[#f2f7ff]">Contact</span>
      </nav>

      {/* Header Landmark */}
      <header className="space-y-3">
        <div className="text-xs font-mono uppercase tracking-wider text-[#34e0a1]">
          Get in Touch
        </div>
        <h1 className="h1-fluid font-display text-[#f2f7ff]">
          Contact &amp; Feedback<span className="text-[#34e0a1]">.</span>
        </h1>
        <p className="body-fluid text-[#8fa3c0] leading-relaxed">
          Have an idea for a new everyday AI tool? Spotted a typo or software bug? Dhrumil Aslaliya reads and personally responds to every genuine message.
        </p>
      </header>

      {/* Direct Email Card */}
      <div className="glass-surface p-5 sm:p-6 rounded-2xl border border-[rgba(143,163,192,0.16)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0] font-semibold flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-[#34e0a1]" />
            <span>Direct Email Address</span>
          </div>
          <div className="text-sm sm:text-base font-semibold text-[#f2f7ff] font-mono">
            contact@smarttoolhub.net
          </div>
          <div className="text-xs text-[#8fa3c0] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#7db8ff]" />
            <span>Typical response time: 24 to 48 hours</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleCopyEmail}
          className="btn-glass text-xs inline-flex items-center gap-1.5 self-start sm:self-center"
        >
          {copiedEmail ? <Check className="w-3.5 h-3.5 text-[#34e0a1]" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedEmail ? 'Copied Email' : 'Copy Email'}</span>
        </button>
      </div>

      {/* Contact Form Card */}
      <div className="glass-surface p-6 sm:p-8 rounded-3xl border border-[rgba(143,163,192,0.16)] shadow-xl">
        {isSubmitted ? (
          <div className="py-10 text-center space-y-4" role="status">
            <div className="w-12 h-12 rounded-2xl bg-[#0a1424] border border-[rgba(52,224,161,0.3)] flex items-center justify-center text-[#34e0a1] mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold font-display text-[#f2f7ff]">
              Message Received!
            </h2>
            <p className="text-sm text-[#8fa3c0] max-w-md mx-auto leading-relaxed">
              Thank you for reaching out. Dhrumil will review your note regarding <strong className="text-[#f2f7ff]">{topic}</strong> and reply to <span className="text-[#f2f7ff] font-medium">{email}</span> within 24 to 48 hours.
            </p>
            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false);
                setMessage('');
              }}
              className="btn-glass text-xs mt-2"
            >
              Send Another Note
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-name" className="block text-xs font-mono uppercase text-[#f2f7ff] mb-1.5 font-semibold">
                  Your Name (Optional)
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex"
                  className="w-full bg-[#0a1424] border border-[rgba(143,163,192,0.18)] rounded-xl p-3 text-sm text-[#f2f7ff] placeholder-[#8fa3c0] focus-ring"
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-xs font-mono uppercase text-[#f2f7ff] mb-1.5 font-semibold">
                  Your Email <span className="text-[#34e0a1]">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full bg-[#0a1424] border border-[rgba(143,163,192,0.18)] rounded-xl p-3 text-sm text-[#f2f7ff] placeholder-[#8fa3c0] focus-ring"
                />
              </div>
            </div>

            <div>
              <label htmlFor="contact-topic" className="block text-xs font-mono uppercase text-[#f2f7ff] mb-1.5 font-semibold">
                Topic
              </label>
              <select
                id="contact-topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-[#0a1424] border border-[rgba(143,163,192,0.18)] rounded-xl p-3 text-sm text-[#f2f7ff] focus-ring"
              >
                <option value="Feedback / Tool Suggestion">Feedback / Tool Suggestion</option>
                <option value="Bug Report">Bug Report</option>
                <option value="Software Directory Suggestion">Software Directory Suggestion</option>
                <option value="Editorial Correction">Editorial Correction</option>
                <option value="Privacy / Legal Inquiry">Privacy / Legal Inquiry</option>
                <option value="General Question">General Question</option>
              </select>
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-xs font-mono uppercase text-[#f2f7ff] mb-1.5 font-semibold">
                Message <span className="text-[#34e0a1]">*</span>
              </label>
              <textarea
                id="contact-message"
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What tool would you like to see next, or what issue did you encounter?..."
                className="w-full bg-[#0a1424] border border-[rgba(143,163,192,0.18)] rounded-xl p-3 text-sm text-[#f2f7ff] placeholder-[#8fa3c0] focus-ring resize-y min-h-[110px]"
              />
            </div>

            <button
              type="submit"
              className="w-full btn-primary text-sm inline-flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(52,224,161,0.25)]"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>

            <p className="text-[11px] text-[#8fa3c0]/80 text-center pt-1">
              Your email will only be used to reply to your inquiry. We do not add you to marketing lists or sell your email.
            </p>
          </form>
        )}
      </div>

      {/* Frequently Asked Inquiries */}
      <section className="space-y-4 pt-4 border-t border-[rgba(143,163,192,0.12)]">
        <h2 className="text-xl font-bold font-display text-[#f2f7ff] flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#34e0a1]" />
          <span>Frequently Asked Questions</span>
        </h2>
        <div className="space-y-3">
          <div className="glass-surface p-4 rounded-2xl border border-[rgba(143,163,192,0.12)] space-y-1.5">
            <div className="text-sm font-semibold text-[#f2f7ff]">Can I suggest an everyday tool to build?</div>
            <p className="text-xs text-[#8fa3c0] leading-relaxed">
              Yes, absolutely! The best tools on SmartToolHub come directly from user suggestions. If you find yourself repeatedly doing a routine task on your phone or PC, send it over and we may build a dedicated free tool for it.
            </p>
          </div>
          <div className="glass-surface p-4 rounded-2xl border border-[rgba(143,163,192,0.12)] space-y-1.5">
            <div className="text-sm font-semibold text-[#f2f7ff]">Do you accept paid or sponsored software reviews?</div>
            <p className="text-xs text-[#8fa3c0] leading-relaxed">
              No. We strictly refuse sponsored rankings, paid software recommendations, and compensated reviews. All directory entries are independently evaluated with honest pros, cons, and drawbacks.
            </p>
          </div>
          <div className="glass-surface p-4 rounded-2xl border border-[rgba(143,163,192,0.12)] space-y-1.5">
            <div className="text-sm font-semibold text-[#f2f7ff]">How do I report a security vulnerability or bug?</div>
            <p className="text-xs text-[#8fa3c0] leading-relaxed">
              Select &ldquo;Bug Report&rdquo; in the form above or email <span className="font-mono text-[#7db8ff]">contact@smarttoolhub.net</span> with steps to reproduce the issue. We investigate and deploy fixes promptly.
            </p>
          </div>
        </div>
      </section>
    </article>
  );
};
