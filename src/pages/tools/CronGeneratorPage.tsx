import React, { useState, useMemo } from 'react';
import { Clock, Copy, Check, Sparkles, HelpCircle, ArrowRight, Play, RefreshCw, Terminal } from 'lucide-react';
import { SchemaScript } from '../../components/seo/SchemaScript.tsx';

interface CronGeneratorPageProps {
  navigate: (path: string) => void;
}

export const CronGeneratorPage: React.FC<CronGeneratorPageProps> = ({ navigate }) => {
  const [minute, setMinute] = useState('0');
  const [hour, setHour] = useState('9');
  const [dayOfMonth, setDayOfMonth] = useState('*');
  const [month, setMonth] = useState('*');
  const [dayOfWeek, setDayOfWeek] = useState('1-5');
  const [copied, setCopied] = useState(false);

  // Quick preset templates
  const applyPreset = (m: string, h: string, dom: string, mon: string, dow: string) => {
    setMinute(m);
    setHour(h);
    setDayOfMonth(dom);
    setMonth(mon);
    setDayOfWeek(dow);
  };

  const cronExpression = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;

  // Human description generator
  const humanDescription = useMemo(() => {
    try {
      let desc = 'Runs ';

      // Minute & Hour
      if (minute === '*' && hour === '*') {
        desc += 'every minute';
      } else if (minute.startsWith('*/') && hour === '*') {
        desc += `every ${minute.replace('*/', '')} minutes`;
      } else if (minute === '0' && hour === '*') {
        desc += 'at minute 0 of every hour';
      } else if (hour.startsWith('*/')) {
        desc += `every ${hour.replace('*/', '')} hours at minute ${minute}`;
      } else {
        const hNum = parseInt(hour, 10);
        const ampm = !isNaN(hNum) ? (hNum >= 12 ? (hNum === 12 ? '12:00 PM' : `${hNum - 12}:00 PM`) : (hNum === 0 ? '12:00 AM' : `${hNum}:00 AM`)) : `${hour}:00`;
        const minStr = minute.padStart(2, '0');
        const formattedTime = !isNaN(hNum) ? `${hNum % 12 || 12}:${minStr} ${hNum >= 12 ? 'PM' : 'AM'}` : `${hour}:${minStr}`;
        desc += `at ${formattedTime}`;
      }

      // Day of Week
      if (dayOfWeek === '1-5') {
        desc += ', Monday through Friday';
      } else if (dayOfWeek === '0,6' || dayOfWeek === '6,0') {
        desc += ', on Saturday and Sunday';
      } else if (dayOfWeek !== '*') {
        const daysMap: Record<string, string> = { '0': 'Sun', '1': 'Mon', '2': 'Tue', '3': 'Wed', '4': 'Thu', '5': 'Fri', '6': 'Sat', '7': 'Sun' };
        const mapped = dayOfWeek.split(',').map(d => daysMap[d] || d).join(', ');
        desc += `, on ${mapped}`;
      }

      // Day of Month & Month
      if (dayOfMonth !== '*' && month !== '*') {
        desc += `, on day ${dayOfMonth} of month ${month}`;
      } else if (dayOfMonth !== '*') {
        desc += `, on day ${dayOfMonth} of the month`;
      } else if (month !== '*') {
        desc += `, only in month ${month}`;
      }

      return desc + '.';
    } catch {
      return 'Valid cron expression.';
    }
  }, [minute, hour, dayOfMonth, month, dayOfWeek]);

  // Next 5 scheduled sample runs
  const nextRuns = useMemo(() => {
    const list = [];
    const now = new Date();
    for (let i = 1; i <= 5; i++) {
      const d = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
      const hNum = parseInt(hour, 10);
      const mNum = parseInt(minute, 10);
      if (!isNaN(hNum)) d.setHours(hNum);
      if (!isNaN(mNum)) d.setMinutes(mNum);
      d.setSeconds(0);
      list.push(d.toUTCString().replace(':00 GMT', ' UTC'));
    }
    return list;
  }, [minute, hour]);

  const handleCopy = () => {
    navigator.clipboard.writeText(cronExpression);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const faqs = [
    {
      q: 'What is the standard order of fields in a Linux crontab?',
      a: 'A standard POSIX crontab uses 5 fields separated by spaces: Minute (0-59), Hour (0-23), Day of Month (1-31), Month (1-12), and Day of Week (0-7, where both 0 and 7 represent Sunday).',
    },
    {
      q: 'How does step syntax like */15 work in cron?',
      a: 'A slash denotes step values. For example, */15 in the minute field runs at minutes 0, 15, 30, and 45. In the hour field, */3 triggers every 3 hours starting from midnight.',
    },
    {
      q: 'Does this cron generator run on the server or in my browser?',
      a: 'This utility runs 100% locally in your web browser. No schedules, server commands, or credentials ever leave your physical device.',
    },
    {
      q: 'How do I add this generated expression to my server?',
      a: 'Open your terminal and type `crontab -e`. Paste the expression followed by your command path (e.g. `0 9 * * 1-5 /usr/bin/python3 /scripts/backup.py >> /var/log/backup.log 2>&1`), then save and exit.',
    },
  ];

  const schemaJson = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'Cron Expression Generator & Human Explainer',
    'applicationCategory': 'DeveloperApplication',
    'operatingSystem': 'All',
    'description': 'Generate, test, and translate 5-part Linux crontab expressions into plain English with next scheduled runs.',
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
        <span className="text-[#39ff88]">Cron Expression Generator</span>
      </nav>

      {/* Header */}
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#0a1424] border border-[#39ff88]/30 text-[#39ff88] text-xs font-mono">
          <Clock className="w-3.5 h-3.5" />
          <span>DEVELOPER &amp; LINUX AUTOMATION</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#f2f7ff] tracking-tight">
          Cron Expression Generator &amp; Explainer
        </h1>
        <p className="text-base sm:text-lg text-[#8fa3c0] max-w-2xl leading-relaxed">
          Build, translate, and verify 5-part Linux crontab schedules in plain English. No memorizing syntax, zero server calls, instant clipboard copy.
        </p>
      </header>

      {/* Quick Preset Buttons */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0]">Common Presets</label>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => applyPreset('*', '*', '*', '*', '*')} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#0a1424] hover:bg-[#101c33] border border-[#8fa3c0]/20 text-[#f2f7ff] transition-colors">
            Every minute
          </button>
          <button onClick={() => applyPreset('*/15', '*', '*', '*', '*')} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#0a1424] hover:bg-[#101c33] border border-[#8fa3c0]/20 text-[#f2f7ff] transition-colors">
            Every 15 mins
          </button>
          <button onClick={() => applyPreset('0', '*', '*', '*', '*')} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#0a1424] hover:bg-[#101c33] border border-[#8fa3c0]/20 text-[#f2f7ff] transition-colors">
            Hourly (at minute 0)
          </button>
          <button onClick={() => applyPreset('0', '0', '*', '*', '*')} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#0a1424] hover:bg-[#101c33] border border-[#8fa3c0]/20 text-[#f2f7ff] transition-colors">
            Midnight every day
          </button>
          <button onClick={() => applyPreset('0', '9', '*', '*', '1-5')} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#0a1424] hover:bg-[#101c33] border border-[#8fa3c0]/20 text-[#f2f7ff] transition-colors">
            Weekdays at 9:00 AM
          </button>
          <button onClick={() => applyPreset('0', '2', '*', '*', '0')} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#0a1424] hover:bg-[#101c33] border border-[#8fa3c0]/20 text-[#f2f7ff] transition-colors">
            Sundays at 2:00 AM
          </button>
          <button onClick={() => applyPreset('0', '0', '1', '*', '*')} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#0a1424] hover:bg-[#101c33] border border-[#8fa3c0]/20 text-[#f2f7ff] transition-colors">
            1st of every month
          </button>
        </div>
      </div>

      {/* Interactive Builder */}
      <div className="bg-[#0a1424] border border-[#8fa3c0]/20 rounded-xl p-5 sm:p-6 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[#8fa3c0]">Minute (0-59)</label>
            <input
              type="text"
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
              className="w-full bg-[#050a14] border border-[#8fa3c0]/30 rounded-lg px-3 py-2 text-sm text-[#f2f7ff] font-mono focus:outline-none focus:border-[#39ff88]"
              placeholder="*"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[#8fa3c0]">Hour (0-23)</label>
            <input
              type="text"
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              className="w-full bg-[#050a14] border border-[#8fa3c0]/30 rounded-lg px-3 py-2 text-sm text-[#f2f7ff] font-mono focus:outline-none focus:border-[#39ff88]"
              placeholder="*"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[#8fa3c0]">Day of Month (1-31)</label>
            <input
              type="text"
              value={dayOfMonth}
              onChange={(e) => setDayOfMonth(e.target.value)}
              className="w-full bg-[#050a14] border border-[#8fa3c0]/30 rounded-lg px-3 py-2 text-sm text-[#f2f7ff] font-mono focus:outline-none focus:border-[#39ff88]"
              placeholder="*"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[#8fa3c0]">Month (1-12)</label>
            <input
              type="text"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full bg-[#050a14] border border-[#8fa3c0]/30 rounded-lg px-3 py-2 text-sm text-[#f2f7ff] font-mono focus:outline-none focus:border-[#39ff88]"
              placeholder="*"
            />
          </div>
          <div className="space-y-1.5 col-span-2 sm:col-span-1">
            <label className="text-xs font-mono text-[#8fa3c0]">Day of Week (0-7)</label>
            <input
              type="text"
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
              className="w-full bg-[#050a14] border border-[#8fa3c0]/30 rounded-lg px-3 py-2 text-sm text-[#f2f7ff] font-mono focus:outline-none focus:border-[#39ff88]"
              placeholder="*"
            />
          </div>
        </div>

        {/* Output Banner */}
        <div className="bg-[#050a14] border border-[#39ff88]/30 rounded-lg p-4 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-mono text-[#8fa3c0] uppercase">Generated Cron Expression</div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-[#39ff88] tracking-widest mt-1">
                {cronExpression}
              </div>
            </div>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#39ff88] hover:bg-[#1fbf62] text-[#050a14] font-semibold text-sm transition-all"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Expression'}</span>
            </button>
          </div>

          <div className="pt-2 border-t border-[#8fa3c0]/15 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-[#39ff88] shrink-0 mt-0.5" />
            <div className="text-sm text-[#f2f7ff]">
              <strong>Human Meaning:</strong> {humanDescription}
            </div>
          </div>
        </div>

        {/* Next Scheduled Runs Preview */}
        <div className="space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0] flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-[#39ff88]" />
            <span>Next Estimated Trigger Timestamps</span>
          </div>
          <div className="bg-[#050a14] border border-[#8fa3c0]/20 rounded-lg p-3 font-mono text-xs text-[#8fa3c0] space-y-1">
            {nextRuns.map((r, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[#39ff88]">{i + 1}.</span>
                <span className="text-[#f2f7ff]">{r}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step by Step Guide */}
      <section className="bg-[#0a1424] border border-[#8fa3c0]/15 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-[#f2f7ff]">Step-by-Step Instructions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <div className="text-xs font-mono text-[#39ff88] font-bold">STEP 01</div>
            <h3 className="text-sm font-semibold text-[#f2f7ff]">Select Presets or Custom Values</h3>
            <p className="text-xs text-[#8fa3c0] leading-relaxed">
              Tap a quick preset button or customize the minute, hour, day, and month inputs using standard numeric ranges or step intervals.
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="text-xs font-mono text-[#39ff88] font-bold">STEP 02</div>
            <h3 className="text-sm font-semibold text-[#f2f7ff]">Review Plain English Meaning</h3>
            <p className="text-xs text-[#8fa3c0] leading-relaxed">
              Read the automatically generated plain-language translation and inspect the next 5 estimated execution timestamps to verify timing.
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="text-xs font-mono text-[#39ff88] font-bold">STEP 03</div>
            <h3 className="text-sm font-semibold text-[#f2f7ff]">Copy into Your Crontab</h3>
            <p className="text-xs text-[#8fa3c0] leading-relaxed">
              Tap Copy Expression and paste directly into your terminal crontab or cloud scheduler (e.g. AWS EventBridge, GCP Cloud Scheduler, GitHub Actions).
            </p>
          </div>
        </div>
      </section>

      {/* Practical Worked Examples */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-[#f2f7ff]">Practical Worked Examples</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#0a1424] border border-[#8fa3c0]/15 rounded-lg p-4 space-y-2">
            <div className="text-xs font-mono text-[#7db8ff]">Scenario A: Nightly Database Backup</div>
            <div className="font-mono text-sm text-[#39ff88] bg-[#050a14] p-2 rounded border border-[#8fa3c0]/20">
              0 2 * * * /opt/backup.sh
            </div>
            <p className="text-xs text-[#8fa3c0] leading-relaxed">
              Triggers every day at 2:00 AM server time when system traffic is at its lowest, ensuring minimal impact on production database connections.
            </p>
          </div>
          <div className="bg-[#0a1424] border border-[#8fa3c0]/15 rounded-lg p-4 space-y-2">
            <div className="text-xs font-mono text-[#7db8ff]">Scenario B: Weekday Business Hours Sync</div>
            <div className="font-mono text-sm text-[#39ff88] bg-[#050a14] p-2 rounded border border-[#8fa3c0]/20">
              */30 9-17 * * 1-5 /usr/bin/sync-crm
            </div>
            <p className="text-xs text-[#8fa3c0] leading-relaxed">
              Executes every 30 minutes between 9:00 AM and 5:59 PM, Monday through Friday, skipping weekends and off-work overnight hours.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
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
