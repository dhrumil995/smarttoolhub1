import React, { useState } from 'react';
import { FileSpreadsheet, Plus, Trash2, Printer, Download, DollarSign, ShieldCheck, Check } from 'lucide-react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';
import { Button } from '../../components/ui/Button.tsx';
import { useToast } from '../../components/ui/Toast.tsx';

interface InvoiceGeneratorPageProps {
  navigate: (path: string) => void;
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export const InvoiceGeneratorPage: React.FC<InvoiceGeneratorPageProps> = ({ navigate }) => {
  const [businessName, setBusinessName] = useState<string>('Studio Apex Design');
  const [businessEmail, setBusinessEmail] = useState<string>('billing@studioapex.com');
  const [businessAddress, setBusinessAddress] = useState<string>('San Francisco, CA');

  const [clientName, setClientName] = useState<string>('Acme Corp');
  const [clientEmail, setClientEmail] = useState<string>('accounts@acmecorp.com');
  const [clientAddress, setClientAddress] = useState<string>('New York, NY');

  const [invoiceNumber, setInvoiceNumber] = useState<string>('INV-2026-0042');
  const [invoiceDate, setInvoiceDate] = useState<string>('2026-10-18');
  const [dueDate, setDueDate] = useState<string>('2026-11-17');
  const [currency, setCurrency] = useState<string>('$');
  const [taxRate, setTaxRate] = useState<number>(8.5);
  const [notes, setNotes] = useState<string>('Payment terms: Net 30 days. Please remit payment via ACH or wire transfer.');

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: 'Design Sprint: UX Research & Interactive Prototypes', quantity: 35, unitPrice: 85 },
    { id: '2', description: 'Responsive Web Design & Tailwind Component Library', quantity: 1, unitPrice: 1200 },
  ]);

  const { showToast } = useToast();

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'invoice-generator') || LAUNCH_TOOLS[20];
  const relatedTools = LAUNCH_TOOLS.filter((t) => t.slug === 'product-description-generator' || t.slug === 'apple-subscription-calculator');
  const relatedGuide = POPULAR_GUIDES.find((g) => g.slug === 'better-prompts-simple-rules') || POPULAR_GUIDES[0];

  const exampleChips = [
    'Freelance web design: 40 hrs @ $85/hr + 8.5% sales tax',
    'SEO & Content retainer: Monthly service $1,500 + zero tax',
    'Software consulting: Architecture review + code audit milestone',
  ];

  const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const grandTotal = subtotal + taxAmount;

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      { id: `item-${Date.now()}`, description: 'New Service or Product line', quantity: 1, unitPrice: 100 },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) {
      showToast('Invoice must have at least one line item');
      return;
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleUpdateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const handleChipClick = (chip: string) => {
    if (chip.includes('Freelance web design')) {
      setBusinessName('Freelance Creative Studio');
      setClientName('Venture Partners LLC');
      setItems([
        { id: '1', description: 'Mobile UI/UX Design (40 Hours)', quantity: 40, unitPrice: 85 },
      ]);
      setTaxRate(8.5);
    } else if (chip.includes('SEO & Content')) {
      setBusinessName('Growth Marketing Lab');
      setClientName('Northwind Traders');
      setItems([
        { id: '1', description: 'Monthly Organic Growth Retainer & SEO Audits', quantity: 1, unitPrice: 1500 },
      ]);
      setTaxRate(0);
    } else {
      setBusinessName('Cloud Architecture Systems');
      setClientName('Enterprise Cloud Corp');
      setItems([
        { id: '1', description: 'Cloud Architecture Well-Architected Review', quantity: 1, unitPrice: 2400 },
        { id: '2', description: 'Security Hardening & Terraform Infrastructure Audit', quantity: 1, unitPrice: 1800 },
      ]);
      setTaxRate(5);
    }
  };

  const handleCompute = (text: string) => {
    return {
      result: `Invoice ${invoiceNumber}
Issuer: ${businessName} (${businessEmail})
Client: ${clientName} (${clientEmail})
Date: ${invoiceDate} | Due: ${dueDate}

Line Items:
${items.map(i => `- ${i.description}: ${i.quantity} x ${currency}${i.unitPrice.toFixed(2)} = ${currency}${(i.quantity * i.unitPrice).toFixed(2)}`).join('\n')}

Subtotal: ${currency}${subtotal.toFixed(2)}
Tax (${taxRate}%): ${currency}${taxAmount.toFixed(2)}
Total Due: ${currency}${grandTotal.toFixed(2)}

Notes: ${notes}`,
      rawData: { invoiceNumber, grandTotal, subtotal },
    };
  };

  return (
    <ToolPageTemplate
      tool={tool}
      heading="Free Invoice Generator"
      subheading="Create professional client invoices in seconds with automatic tax calculations, line item math, and one-click 'Print or Save as PDF' export. 100% private, browser-based, and zero server storage."
      inputLabel="Invoice Details & Financial Summary"
      inputPlaceholder="Configure your business details, client info, and billable services..."
      examplePrompt={exampleChips[0]}
      exampleChips={exampleChips}
      generateButtonText="Update Invoice Preview"
      lastUpdated="October 2026"
      navigate={navigate}
      onClientCompute={handleCompute}
      extraControls={
        <div className="space-y-6 pt-2">
          {/* Privacy Guarantee */}
          <div className="flex items-center gap-2 text-xs font-mono text-[#f472d0] bg-[#0a1424] px-3.5 py-2 rounded-xl border border-[rgba(244, 114, 208,0.25)]">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>100% Private. Your business information, client names, and financial data are never stored on any server.</span>
          </div>

          {/* Business & Client Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* From: Business Info */}
            <div className="p-4 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[#f472d0] font-bold block">
                From: Your Business
              </span>
              <input
                type="text"
                placeholder="Business Name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full bg-[#101c33] border border-[rgba(143,163,192,0.2)] rounded-lg px-3 py-2 text-xs text-[#f2f7ff] focus-ring"
              />
              <input
                type="email"
                placeholder="Billing Email"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                className="w-full bg-[#101c33] border border-[rgba(143,163,192,0.2)] rounded-lg px-3 py-2 text-xs text-[#f2f7ff] focus-ring"
              />
              <input
                type="text"
                placeholder="Address / Location"
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                className="w-full bg-[#101c33] border border-[rgba(143,163,192,0.2)] rounded-lg px-3 py-2 text-xs text-[#f2f7ff] focus-ring"
              />
            </div>

            {/* To: Client Info */}
            <div className="p-4 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[#5aa9ff] font-bold block">
                Bill To: Client
              </span>
              <input
                type="text"
                placeholder="Client / Company Name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-[#101c33] border border-[rgba(143,163,192,0.2)] rounded-lg px-3 py-2 text-xs text-[#f2f7ff] focus-ring"
              />
              <input
                type="email"
                placeholder="Client Email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full bg-[#101c33] border border-[rgba(143,163,192,0.2)] rounded-lg px-3 py-2 text-xs text-[#f2f7ff] focus-ring"
              />
              <input
                type="text"
                placeholder="Client Address"
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
                className="w-full bg-[#101c33] border border-[rgba(143,163,192,0.2)] rounded-lg px-3 py-2 text-xs text-[#f2f7ff] focus-ring"
              />
            </div>
          </div>

          {/* Invoice Meta Row: Number, Dates, Currency, Tax */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div className="space-y-1">
              <label className="font-mono text-[#8fa3c0] uppercase">Invoice #</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full bg-[#0a1424] border border-[rgba(143,163,192,0.2)] rounded-lg px-2.5 py-1.5 text-xs text-[#f2f7ff] focus-ring font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="font-mono text-[#8fa3c0] uppercase">Issue Date</label>
              <input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="w-full bg-[#0a1424] border border-[rgba(143,163,192,0.2)] rounded-lg px-2.5 py-1.5 text-xs text-[#f2f7ff] focus-ring font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="font-mono text-[#8fa3c0] uppercase">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-[#0a1424] border border-[rgba(143,163,192,0.2)] rounded-lg px-2.5 py-1.5 text-xs text-[#f2f7ff] focus-ring font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="font-mono text-[#8fa3c0] uppercase">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-[#0a1424] border border-[rgba(143,163,192,0.2)] rounded-lg px-2.5 py-1.5 text-xs text-[#f2f7ff] focus-ring font-mono"
              >
                <option value="$">USD ($)</option>
                <option value="€">EUR (€)</option>
                <option value="£">GBP (£)</option>
                <option value="C$">CAD (C$)</option>
                <option value="A$">AUD (A$)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-mono text-[#8fa3c0] uppercase">Tax Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-full bg-[#0a1424] border border-[rgba(143,163,192,0.2)] rounded-lg px-2.5 py-1.5 text-xs text-[#f2f7ff] focus-ring font-mono"
              />
            </div>
          </div>

          {/* Line Items Editor */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0]">
                Line Items
              </label>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleAddItem}
                className="text-xs gap-1 py-1"
              >
                <Plus size={14} />
                <span>Add Item</span>
              </Button>
            </div>

            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] flex flex-col sm:flex-row items-start sm:items-center gap-2.5"
                >
                  <input
                    type="text"
                    placeholder="Item description"
                    value={item.description}
                    onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                    className="flex-1 w-full sm:w-auto bg-[#101c33] border border-[rgba(143,163,192,0.2)] rounded-lg px-3 py-1.5 text-xs text-[#f2f7ff] focus-ring"
                  />
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] font-mono text-[#8fa3c0]">Qty:</span>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItem(item.id, 'quantity', Number(e.target.value))}
                        className="w-16 bg-[#101c33] border border-[rgba(143,163,192,0.2)] rounded-lg px-2 py-1.5 text-xs font-mono text-[#f2f7ff] focus-ring text-center"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] font-mono text-[#8fa3c0]">Rate:</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => handleUpdateItem(item.id, 'unitPrice', Number(e.target.value))}
                        className="w-24 bg-[#101c33] border border-[rgba(143,163,192,0.2)] rounded-lg px-2 py-1.5 text-xs font-mono text-[#f2f7ff] focus-ring text-right"
                      />
                    </div>
                    <span className="text-xs font-mono font-bold text-[#f472d0] w-20 text-right">
                      {currency}{(item.quantity * item.unitPrice).toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1.5 text-[#8fa3c0] hover:text-[#ff5c7a] rounded-lg transition-colors focus-ring"
                      aria-label="Remove item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
      customResultRenderer={() => (
        <div className="space-y-6">
          {/* Action Bar: Print or Save as PDF */}
          <div className="p-4 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-[#f2f7ff]">
                Invoice Preview Ready
              </div>
              <div className="text-xs text-[#8fa3c0] font-mono mt-0.5">
                Total Due: {currency}{grandTotal.toFixed(2)} · Print stylesheet ready
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={handlePrint}
              className="w-full sm:w-auto gap-2"
            >
              <Printer size={16} />
              <span>Print or Save as PDF</span>
            </Button>
          </div>

          {/* Printable Invoice Container */}
          <div
            id="invoice-printable"
            className="p-6 sm:p-10 rounded-2xl bg-white text-slate-900 shadow-2xl border border-slate-200 space-y-8 select-text"
          >
            {/* Invoice Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-200 pb-6">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900 font-display">
                  {businessName || 'Your Business'}
                </h2>
                <div className="text-xs text-slate-600 mt-1">
                  <div>{businessEmail}</div>
                  <div>{businessAddress}</div>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <div className="text-xl font-black uppercase tracking-widest text-emerald-600 font-mono">
                  INVOICE
                </div>
                <div className="text-xs text-slate-600 mt-1 font-mono">
                  <div><strong>Invoice #:</strong> {invoiceNumber}</div>
                  <div><strong>Date:</strong> {invoiceDate}</div>
                  <div><strong>Due Date:</strong> {dueDate}</div>
                </div>
              </div>
            </div>

            {/* Bill To Party */}
            <div className="border-b border-slate-200 pb-6">
              <span className="text-[11px] font-mono uppercase text-slate-500 block mb-1">
                BILL TO:
              </span>
              <div className="text-base font-bold text-slate-900">{clientName || 'Client Name'}</div>
              <div className="text-xs text-slate-600">{clientEmail}</div>
              <div className="text-xs text-slate-600">{clientAddress}</div>
            </div>

            {/* Printable Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-300 text-slate-600 font-mono uppercase">
                    <th className="py-2.5">Description</th>
                    <th className="py-2.5 w-16 text-center">Qty</th>
                    <th className="py-2.5 w-24 text-right">Rate</th>
                    <th className="py-2.5 w-28 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((i) => (
                    <tr key={i.id}>
                      <td className="py-3 font-medium text-slate-800">{i.description}</td>
                      <td className="py-3 text-center text-slate-600 font-mono">{i.quantity}</td>
                      <td className="py-3 text-right text-slate-600 font-mono">{currency}{i.unitPrice.toFixed(2)}</td>
                      <td className="py-3 text-right font-bold text-slate-900 font-mono">
                        {currency}{(i.quantity * i.unitPrice).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Summary */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-4 border-t border-slate-200">
              <div className="max-w-xs text-xs text-slate-600 space-y-1">
                <span className="font-mono uppercase text-slate-500 font-bold block">Payment Terms & Notes:</span>
                <p className="whitespace-pre-wrap">{notes}</p>
              </div>

              <div className="w-full sm:w-60 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span>{currency}{subtotal.toFixed(2)}</span>
                </div>
                {taxRate > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Tax ({taxRate}%):</span>
                    <span>{currency}{taxAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-slate-900 border-t-2 border-slate-900 pt-2">
                  <span>Total Due:</span>
                  <span className="text-emerald-700">{currency}{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Clean print stylesheet injection */}
          <style>{`
            @media print {
              body * {
                visibility: hidden;
              }
              #invoice-printable, #invoice-printable * {
                visibility: visible;
              }
              #invoice-printable {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                margin: 0;
                padding: 20px;
                box-shadow: none;
                border: none;
              }
            }
          `}</style>
        </div>
      )}
      whatItDoesContent={
        <div className="space-y-3">
          <p>
            The Free Invoice Generator lets freelancers, consultants, contractors, and small business owners issue crisp, professional invoices without monthly subscription software or login barriers. It calculates line item totals, applies customizable sales tax rates, and formats everything for instant printing or PDF saving.
          </p>
          <p>
            Your client information, project descriptions, and billing totals never touch a database or remote server. The invoice renders directly in your browser and uses standard CSS print rules so that clicking "Print or Save as PDF" opens your native browser print dialog, stripping out website headers and footers to produce an immaculate document.
          </p>
        </div>
      }
      howToUseSteps={[
        {
          step: 'Fill in your business and client details',
          text: 'Enter your studio or personal business name, email, address, and client billing contact.',
        },
        {
          step: 'Add your billable services and products',
          text: 'Specify line item descriptions, hours or quantities, and hourly or fixed unit rates.',
        },
        {
          step: 'Set tax rate and payment terms',
          text: 'Add your local sales tax or VAT percentage and specify Net 15, Net 30, or wire transfer instructions.',
        },
        {
          step: 'Print or export to PDF',
          text: 'Click Print or Save as PDF to generate an ink-friendly, ready-to-send PDF through your browser print dialog.',
        },
      ]}
      workedExample={{
        title: 'Example: Freelance UI/UX Design Sprint Invoice',
        scenario: 'A designer billing an agency for 35 hours of prototyping and a custom design system milestone.',
        output: `### Invoice INV-2026-0042 Summary:
- Business: Studio Apex Design
- Client: Acme Corp
- Items:
  1. UX Research & Interactive Prototypes (35 hrs @ $85/hr): $2,975.00
  2. Responsive Design System & Tailwind Kit (Fixed Milestone): $1,200.00
- Subtotal: $4,175.00
- Sales Tax (8.5%): $354.88
- Grand Total: $4,529.88
- Payment Terms: Net 30 days via ACH / Wire Transfer.`,
      }}
      tips={[
        'Always include an explicit payment due date: Net 30 invoices with clear due dates get paid 40% faster than invoices with vague "upon receipt" instructions.',
        'Save as PDF directly in Chrome or Safari: In the print dialog, select Destination: "Save as PDF" to generate a lightweight vector PDF document.',
        'Itemize milestones clearly: Breaking large projects into specific phases reduces payment friction and prevents scope disputes.',
        'Zero data leaks: Bookmark this page to generate invoices whenever needed; your client data stays strictly on your local computer.',
      ]}
      faq={[
        {
          question: 'Are my invoices saved on SmartToolHub servers?',
          answer: 'No. SmartToolHub operates with zero server persistence for client tools. All math, line-item state, and PDF generation happen in your local browser.',
        },
        {
          question: 'How do I download the invoice as a PDF?',
          answer: 'Click the "Print or Save as PDF" button. In your browser print window, change the printer destination to "Save as PDF" and click Save.',
        },
        {
          question: 'Can I change the currency symbol?',
          answer: 'Yes. Use the Currency selector to toggle between USD ($), Euro (€), British Pound (£), Canadian Dollar (C$), and Australian Dollar (A$).',
        },
        {
          question: 'Is this invoice generator free for commercial use?',
          answer: 'Yes. It is 100% free with no watermark, no page limits, and no required account creation.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
