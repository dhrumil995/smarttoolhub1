import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, ChevronRight, MessageSquare, Shield } from 'lucide-react';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) return;
    setIsSubmitted(true);
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
          Contact Us<span className="text-[#34e0a1]">.</span>
        </h1>
        <p className="body-fluid text-[#8fa3c0] leading-relaxed">
          Have an idea for a new everyday AI tool? Found a bug? Send us a note. Dhrumil reads and replies to every message.
        </p>
      </header>

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
              Thank you for reaching out. We will review your message and reply to <span className="text-[#f2f7ff] font-medium">{email}</span> within 24 to 48 hours.
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
                <option value="Pro Plan Question">Pro Plan Question</option>
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
                placeholder="How can we help or what tool would you like to see next?..."
                className="w-full bg-[#0a1424] border border-[rgba(143,163,192,0.18)] rounded-xl p-3 text-sm text-[#f2f7ff] placeholder-[#8fa3c0] focus-ring resize-y min-h-[100px]"
              />
            </div>

            <button
              type="submit"
              className="w-full btn-primary text-sm inline-flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(52,224,161,0.25)]"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        )}
      </div>

      {/* Direct Email Card */}
      <div className="p-5 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.14)] flex items-center justify-between text-xs text-[#8fa3c0]">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-[#34e0a1]" />
          <span>Prefer direct email? Reach out at:</span>
        </div>
        <a
          href="mailto:contact@smarttoolhub.net"
          className="text-[#34e0a1] font-mono hover:underline focus-ring rounded"
        >
          contact@smarttoolhub.net
        </a>
      </div>
    </article>
  );
};
