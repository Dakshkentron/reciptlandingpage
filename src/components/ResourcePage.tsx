import { ArrowRight } from 'lucide-react';
import { resourceNavChildren, resourcePages, type ResourceKind } from '@/data/resources';
import { getIcon } from '@/components/icons';

export default function ResourcePage({ kind }: { kind: ResourceKind }) {
  const page = resourcePages[kind];
  const Icon = getIcon(page.icon);
  const others = resourceNavChildren.filter((r) => !r.href.endsWith(`/${kind}`));

  return (
    <div className="min-h-screen bg-white">
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden pt-28">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-50 to-white" />
        <div className="absolute -top-28 left-1/2 -z-10 h-[24rem] w-[44rem] -translate-x-1/2 rounded-full bg-brand-200/25 blur-[120px]" />

        <div className="mx-auto max-w-4xl px-5 py-14 lg:px-8 lg:py-20">
          <div className="eyebrow bg-brand-500/10 text-brand-700">
            <Icon className="h-3.5 w-3.5" />
            {page.eyebrow}
          </div>
          <h1 className="text-4xl font-bold leading-[1.06] tracking-tight text-ink-950 text-balance lg:text-6xl">
            {page.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-500">{page.lead}</p>
        </div>
      </section>

      {/* ---------- Sections ---------- */}
      {page.sections.map((section, si) => (
        <section
          key={section.heading}
          className={`border-t border-ink-100 ${si % 2 ? 'bg-ink-50/50' : 'bg-white'}`}
        >
          <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8 lg:py-16">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-400">
              {section.heading}
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              {section.items.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  className="group flex flex-col rounded-2xl border border-ink-100 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg hover:shadow-ink-950/5"
                >
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-brand-200 bg-brand-50 px-2.5 py-0.5 text-[11px] font-semibold text-brand-700">
                      {item.tag}
                    </span>
                    <span className="text-[11px] font-medium text-ink-400">{item.meta}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold leading-snug text-ink-950 text-balance">
                    {item.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">{item.desc}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                    Read
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* ---------- Other resources ---------- */}
      <section className="border-t border-ink-100">
        <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8 lg:py-16">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-400">More resources</h2>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {others.map((r) => {
              const OtherIcon = getIcon(r.icon);
              return (
                <a
                  key={r.href}
                  href={r.href}
                  className="group flex items-start gap-3 rounded-2xl border border-ink-100 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-md"
                >
                  <OtherIcon className="mt-0.5 h-5 w-5 flex-none text-brand-500" />
                  <div>
                    <div className="text-sm font-semibold text-ink-950">{r.label}</div>
                    <div className="mt-1 text-xs leading-relaxed text-ink-400">{r.desc}</div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="border-t border-ink-100 bg-ink-50/50">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center lg:px-8 lg:py-20">
          <h2 className="section-title text-ink-950">{page.cta.title}</h2>
          <p className="section-lead text-ink-500">{page.cta.desc}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="mailto:hello@beetle.run" className="btn-primary btn-lg">
              Get in touch
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#/use-cases" className="btn-secondary btn-lg">
              See the use cases
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
