import { AlertTriangle, Bot, Check, CheckCircle2, ShieldCheck, XCircle } from 'lucide-react';
import { products } from '@/data/content';

const product = products.find((p) => p.id === 'kentron-guard')!;

const outcomes = [
  { label: 'Send invoice email', status: 'Allowed', icon: CheckCircle2, tone: 'text-emerald-600' },
  { label: 'Export customer PII', status: 'Blocked', icon: XCircle, tone: 'text-rose-600' },
  { label: 'Delete production record', status: 'Flagged', icon: AlertTriangle, tone: 'text-amber-600' },
];

export default function KentronGuard() {
  return (
    <section id="kentron-guard" className="section bg-white">
      <div className="section-container">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <div>
            <div className="eyebrow bg-brand-50 text-brand-700 px-5 py-2 text-base font-bold">
              <ShieldCheck className="h-5 w-5" />
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

          <div className="flex aspect-[4/3] flex-col items-center justify-center gap-8 rounded-[1.75rem] border border-ink-200 bg-ink-50 px-8 py-10">
            <div className="flex items-center gap-2 rounded-xl border border-ink-200 bg-white px-4 py-3 text-ink-700">
              <Bot className="h-5 w-5 text-brand-600" />
              <span className="text-sm font-semibold">AI agent action</span>
            </div>

            <div className="h-8 w-px bg-ink-200" />

            <div className="flex items-center gap-3 rounded-2xl bg-ink-950 px-6 py-4 text-white shadow-lg">
              <ShieldCheck className="h-6 w-6 text-brand-400" />
              <span className="text-sm font-bold">Kentron Guard checkpoint</span>
            </div>

            <div className="h-8 w-px bg-ink-200" />

            <div className="flex w-full flex-col gap-2">
              {outcomes.map(({ label, status, icon: Icon, tone }) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-xl border border-ink-200 bg-white px-4 py-2.5"
                >
                  <span className="text-sm text-ink-700">{label}</span>
                  <span className={`flex items-center gap-1.5 text-xs font-semibold ${tone}`}>
                    <Icon className="h-4 w-4" />
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
