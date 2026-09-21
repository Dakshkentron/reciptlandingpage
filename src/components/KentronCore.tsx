import { Check, LayoutDashboard, MessageSquare, RefreshCw, Sparkles, Tags } from 'lucide-react';
import { products } from '@/data/content';

const product = products.find((p) => p.id === 'kentron-core')!;

const pipeline = [
  { label: 'Production conversations', icon: MessageSquare },
  { label: 'Auto-labeled training data', icon: Tags },
  { label: 'Model retraining', icon: Sparkles },
];

export default function KentronCore() {
  return (
    <section id="kentron-core" className="section bg-ink-50">
      <div className="section-container">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <div>
            <div className="eyebrow bg-brand-50 text-brand-700 px-5 py-2 text-base font-bold">
              <LayoutDashboard className="h-5 w-5" />
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

          <div className="flex aspect-[4/3] flex-col items-center justify-center gap-6 rounded-[1.75rem] border border-ink-200 bg-white px-8 py-10">
            {pipeline.map(({ label, icon: Icon }, i) => (
              <div key={label} className="flex w-full flex-col items-center gap-6">
                <div className="flex w-full max-w-xs items-center gap-3 rounded-xl border border-ink-200 bg-ink-50 px-4 py-3 text-ink-700">
                  <Icon className="h-5 w-5 flex-none text-brand-600" />
                  <span className="text-sm font-semibold">{label}</span>
                </div>
                {i < pipeline.length - 1 && <div className="h-6 w-px bg-ink-200" />}
              </div>
            ))}

            <div className="flex items-center gap-2 rounded-2xl bg-ink-950 px-5 py-3 text-white shadow-lg">
              <RefreshCw className="h-4 w-4 text-brand-400" />
              <span className="text-xs font-bold">Continuous feedback loop</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
