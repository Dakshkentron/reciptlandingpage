import { Check, FileClock, Gauge, ShieldCheck, Sparkles, Workflow } from 'lucide-react';
import { products } from '@/data/content';

const product = products.find((p) => p.id === 'llm-gateway')!;

const models = ['OpenAI', 'Anthropic', 'Gemini', 'Llama'];

const checks = [
  { label: 'Policy', icon: ShieldCheck },
  { label: 'Rate limits', icon: Gauge },
  { label: 'Audit log', icon: FileClock },
];

export default function LLMGateway() {
  return (
    <section id="llm-gateway" className="section bg-white">
      <div className="section-container">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <div>
            <div className="eyebrow bg-brand-50 text-brand-700 px-5 py-2 text-base font-bold">
              <Workflow className="h-5 w-5" />
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
            <div className="grid grid-cols-4 gap-3">
              {models.map((label) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-2 rounded-xl border border-ink-200 bg-white px-3 py-3 text-ink-700"
                >
                  <Sparkles className="h-5 w-5 text-brand-600" />
                  <span className="text-xs font-semibold">{label}</span>
                </div>
              ))}
            </div>

            <div className="h-8 w-px bg-ink-200" />

            <div className="flex items-center gap-3 rounded-2xl bg-ink-950 px-6 py-4 text-white shadow-lg">
              <Workflow className="h-6 w-6 text-brand-400" />
              <span className="text-sm font-bold">Kentron LLM Gateway</span>
            </div>

            <div className="h-8 w-px bg-ink-200" />

            <div className="flex gap-3">
              {checks.map(({ label, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-xl border border-ink-200 bg-white px-4 py-3 text-ink-700"
                >
                  <Icon className="h-4 w-4 text-brand-600" />
                  <span className="text-xs font-semibold">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
