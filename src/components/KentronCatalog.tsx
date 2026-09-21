import { Boxes, Check, CheckCircle2, Clock, ShieldQuestion } from 'lucide-react';
import { CATALOG_LABEL } from '@/data/integrations';
import { products } from '@/data/content';

const product = products.find((p) => p.id === 'kentron-catalog')!;

const entries = [
  { name: 'Salesforce connector', status: 'Approved', icon: CheckCircle2, tone: 'text-emerald-600' },
  { name: 'Snowflake plugin', status: 'Approved', icon: CheckCircle2, tone: 'text-emerald-600' },
  { name: 'Custom Slack skill', status: 'In review', icon: Clock, tone: 'text-amber-600' },
  { name: 'Unverified scraper', status: 'Flagged', icon: ShieldQuestion, tone: 'text-rose-600' },
];

export default function KentronCatalog() {
  return (
    <section id="kentron-catalog" className="section bg-ink-50">
      <div className="section-container">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <div>
            <div className="eyebrow bg-brand-50 text-brand-700 px-5 py-2 text-base font-bold">
              <Boxes className="h-5 w-5" />
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

          <div className="flex aspect-[4/3] flex-col justify-center gap-3 rounded-[1.75rem] border border-ink-200 bg-white p-8">
            <div className="flex items-center gap-2 pb-1 text-xs font-semibold uppercase tracking-wide text-ink-400">
              <Boxes className="h-4 w-4" />
              {CATALOG_LABEL} registry
            </div>
            {entries.map(({ name, status, icon: Icon, tone }) => (
              <div
                key={name}
                className="flex items-center justify-between rounded-xl border border-ink-200 bg-ink-50 px-4 py-3"
              >
                <span className="text-sm font-medium text-ink-700">{name}</span>
                <span className={`flex items-center gap-1.5 text-xs font-semibold ${tone}`}>
                  <Icon className="h-4 w-4" />
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
