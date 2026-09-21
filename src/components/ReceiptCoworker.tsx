import { Check, CheckCircle2, Rocket } from 'lucide-react';
import { products } from '@/data/content';
import IntegrationLogo from '@/components/IntegrationLogo';
import ReceiptMark from '@/components/ReceiptMark';


/** Static preview of a finished run — the receipt chain is the real, interactive version below. */
function RunPreview() {
  return (
    <div className="rounded-[1.75rem] bg-white p-4 shadow-2xl shadow-ink-950/40 sm:p-6">
      <div className="flex items-center justify-between gap-3 border-b border-ink-100 pb-4">
        <span className="text-lg font-bold tracking-tight text-ink-950">Thread</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-100 px-2.5 py-1 text-[11px] font-semibold text-ink-600">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
          Slack
        </span>
      </div>

      <div className="flex gap-3 pt-5">
        <div className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-ink-800 text-[12px] font-bold text-white">
          SA
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-[14px] font-bold text-ink-950">Satish</span>
            <span className="text-[11px] text-ink-400">42 minutes ago</span>
          </div>
          <p className="mt-1 text-[15px] leading-relaxed text-ink-800">
            <span className="rounded bg-sky-50 px-1 font-semibold text-sky-700">@Kentron AI</span>
            {' '}reconcile last week&rsquo;s AWS spend against budget
          </p>
        </div>
      </div>

      <div className="flex gap-3 pt-5">
        <div className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-ink-950 text-white">
          <ReceiptMark className="h-5 w-5" paperClassName="text-ink-950" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-[14px] font-bold text-ink-950">Kentron AI</span>
            <span className="rounded bg-ink-100 px-1 py-px text-[9px] font-bold uppercase tracking-wide text-ink-500">
              App
            </span>
            <span className="text-[11px] text-ink-400">42 minutes ago</span>
          </div>
          <p className="mt-1 flex items-center gap-2 text-[15px] font-medium text-ink-800">
            <CheckCircle2 className="h-4 w-4 text-brand-600" />
            <span className="rounded bg-accent-50 px-1 font-semibold text-accent-700">@Satish</span>
            Done
          </p>

          <div className="mt-4 overflow-hidden rounded-2xl border border-ink-100 border-l-4 border-l-brand-500 bg-ink-50/40">
            <div className="flex items-start justify-between gap-4 p-4 sm:p-5">
              <div className="min-w-0">
                <h3 className="text-[17px] font-bold tracking-tight text-ink-950">AWS Spend Reconciliation</h3>
                <p className="mt-1 text-[12.5px] text-ink-400">Last week &middot; us-east-1</p>
              </div>
              <IntegrationLogo name="AWS" size="md" />
            </div>

            <div className="grid grid-cols-2 gap-3 px-4 pb-4 sm:px-5 sm:pb-5">
              <div className="rounded-xl border border-ink-100 bg-white p-3.5">
                <div className="text-[11px] font-medium text-ink-400">Resources reviewed</div>
                <div className="mt-0.5 font-mono text-lg font-bold text-ink-900">42</div>
              </div>
              <div className="rounded-xl border border-ink-100 bg-white p-3.5">
                <div className="text-[11px] font-medium text-ink-400">Anomalies found</div>
                <div className="mt-0.5 font-mono text-lg font-bold text-ink-900">2</div>
              </div>
            </div>

            <div className="mx-4 mb-4 flex items-center gap-2 rounded-xl border border-brand-100 bg-brand-50/70 px-4 py-3 sm:mx-5 sm:mb-5">
              <Check className="h-4 w-4 flex-none text-brand-600" strokeWidth={3} />
              <span className="text-[13px] text-ink-700">Two instances are tagged but unbilled — flagged for review</span>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <a
              href="#receipt-chain"
              className="text-[14px] font-semibold text-sky-700 underline decoration-sky-300 underline-offset-4 hover:text-sky-800"
            >
              View Kentron AI
            </a>
            <span className="rounded-full border border-ink-100 bg-ink-50 px-2 py-0.5 text-[11px] font-medium text-ink-600">
              ✅ 1
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const product = products.find((p) => p.id === 'receipt-ai-coworker')!;

export default function ReceiptCoworker() {
  return (
    <section id="receipt-ai-coworker" className="section bg-white">
      <div className="section-container">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <div>
            <div className="eyebrow bg-brand-50 text-brand-700 px-5 py-2 text-base font-bold">
              <Rocket className="h-5 w-5" />
              {product.eyebrow}
            </div>
            <h2 className="mt-5 text-4xl font-bold tracking-tight text-ink-950 text-balance xl:text-5xl">
              {product.title}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-500">
              {product.description}
            </p>

            <ul className="mt-8 space-y-3">
              {product.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-[15px] text-ink-700">
                  <Check className="mt-0.5 h-4 w-4 flex-none text-brand-600" strokeWidth={3} />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <RunPreview />
        </div>
      </div>
    </section>
  );
}
