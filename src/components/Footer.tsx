import { Linkedin } from 'lucide-react';
import { footerLinks } from '@/data/content';
import ReceiptMark from '@/components/ReceiptMark';

const LINKEDIN_URL = 'https://www.linkedin.com/company/kentronai/posts/?feedView=all';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink-950 text-ink-300">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <ReceiptMark className="h-7 w-7 text-brand-500" paperClassName="text-ink-950" />
              <span className="text-lg font-bold text-white">Receipt</span>
            </div>
            <p className="text-sm text-ink-400 leading-relaxed max-w-xs mb-6">
              Your AI coworker that proves every result with a receipt.
            </p>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Receipt on LinkedIn"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-ink-800 bg-ink-900 text-ink-300 transition-colors hover:border-brand-500/40 hover:bg-ink-850 hover:text-white"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-200 mb-4">{category}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                      className="text-sm text-ink-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-ink-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs text-ink-400">
            <span>© 2026 Kentron Inc.</span>
          </div>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium text-ink-400 transition-colors hover:text-white"
          >
            Follow Kentron on LinkedIn
          </a>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none select-none text-center text-[18vw] font-black leading-none tracking-tight text-white/[0.03] -mb-[3vw] lg:-mb-[2vw]"
      >
        Receipt
      </div>
    </footer>
  );
}
