import { useMemo, useState } from 'react';
import {
  ArrowRight, Check, ChevronDown, FileCheck2, Lock, MessageSquare, Plug, Search, ShieldCheck, Sparkles,
} from 'lucide-react';
import IntegrationLogo from '@/components/IntegrationLogo';
import { buildDetail, findIntegration, integrationHref } from '@/data/integrationDetail';
import { alphaKey, CATALOG_LABEL, type Integration } from '@/data/integrations';
import AlphaBrowser from '@/components/AlphaBrowser';

function StatusPill({ status }: { status: Integration['status'] }) {
  if (status === 'coming-soon') {
    return (
      <span className="rounded-full border border-ink-200 bg-ink-50 px-3 py-1 text-xs font-semibold text-ink-500">
        Available on request
      </span>
    );
  }
  return (
    <span className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
      {status === 'connected' ? 'Connected' : 'Ready to connect'}
    </span>
  );
}

function RelatedCard({ item }: { item: Integration }) {
  return (
    <a
      href={integrationHref(item.name)}
      className="group flex items-center gap-3 rounded-xl border border-ink-100 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md hover:shadow-ink-950/5"
    >
      <IntegrationLogo name={item.name} size="sm" />
      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink-900" title={item.name}>
        {item.name}
      </span>
      <ArrowRight className="h-4 w-4 flex-none text-ink-300 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-600" />
    </a>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-ink-100 last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        aria-expanded={open}
      >
        <span className="text-base font-semibold text-ink-950">{q}</span>
        <ChevronDown
          className={`h-5 w-5 flex-none text-ink-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <p className="-mt-1 pb-5 pr-8 text-sm leading-relaxed text-ink-500">{a}</p>}
    </div>
  );
}

export default function IntegrationDetailPage({ slug }: { slug: string }) {
  const integration = useMemo(() => findIntegration(slug), [slug]);
  const detail = useMemo(() => (integration ? buildDetail(integration) : null), [integration]);

  if (!integration || !detail) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-5 pt-24 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink-50">
          <Search className="h-5 w-5 text-ink-400" />
        </div>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-ink-950">We don’t have that connector</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-500">
          Nothing in the directory matches “{slug}”. Browse all {CATALOG_LABEL} connectors, or tell us
          what you need and we’ll enable it.
        </p>
        <a href="#/integrations" className="btn-primary mt-8">
          Browse all integrations
        </a>
      </div>
    );
  }

  const { brand, summary, actions, prompts, related, worksWith, faqs } = detail;

  const facts = [
    { label: 'Tool', value: brand },
    { label: 'Category', value: integration.category },
    { label: 'Connection', value: integration.status === 'coming-soon' ? 'Managed connector' : integration.auth },
    { label: 'Actions', value: String(actions.length) },
    { label: 'Works in', value: 'Slack · Receipt workspace' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden pt-28">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50 via-sky-50/50 to-white" />
        <div className="absolute -top-24 left-1/2 -z-10 h-[26rem] w-[48rem] -translate-x-1/2 rounded-full bg-brand-200/25 blur-[120px]" />

        <div className="mx-auto max-w-4xl px-5 py-14 text-center lg:px-8 lg:py-20">
          <nav className="flex items-center justify-center gap-2 text-sm text-ink-400" aria-label="Breadcrumb">
            <a href="#/integrations" className="transition-colors hover:text-ink-950">
              Integrations
            </a>
            <span aria-hidden>/</span>
            <span className="font-medium text-ink-700">{brand}</span>
          </nav>

          <div className="mt-10 flex justify-center">
            <IntegrationLogo name={integration.name} size="xl" className="shadow-lg shadow-ink-950/5" />
          </div>

          <h1 className="mt-8 text-4xl font-bold leading-[1.05] tracking-tight text-ink-950 text-balance lg:text-6xl">
            {brand} AI coworker
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink-500">{summary}</p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
            <span className="rounded-full border border-ink-200 bg-white px-3 py-1 text-xs font-semibold text-ink-600">
              {integration.category}
            </span>
            <span className="rounded-full border border-ink-200 bg-white px-3 py-1 text-xs font-semibold text-ink-600">
              {actions.length} actions
            </span>
            <StatusPill status={integration.status} />
          </div>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a href="https://beetle.run/auth/sign-up" className="btn-primary btn-lg">
              Get started for free
            </a>
            <a href="#/integrations" className="btn-secondary btn-lg">
              Browse all integrations
            </a>
          </div>

          <p className="mt-7 text-xs text-ink-400">
            Free to start · No credit card · Every action leaves an auditable receipt
          </p>
        </div>
      </section>

      {/* ---------- Fact strip ---------- */}
      <section className="border-y border-ink-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-ink-100 px-5 lg:grid-cols-5 lg:divide-x lg:px-8">
          {facts.map((fact) => (
            <div key={fact.label} className="px-1 py-5 lg:px-6">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">{fact.label}</div>
              <div className="mt-1 truncate text-sm font-semibold text-ink-950" title={fact.value}>
                {fact.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Example asks ---------- */}
      <section className="bg-ink-50/50">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <div className="section-intro">
            <div className="eyebrow bg-brand-500/10 text-brand-700">
              <Sparkles className="h-3.5 w-3.5" />
              Try asking Receipt
            </div>
            <h2 className="section-title text-ink-950">What can you ask Receipt to do in {brand}?</h2>
            <p className="section-lead text-ink-500">
              Plain language, from Slack or the Receipt workspace. No workflow to build first.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {prompts.map((prompt) => (
              <div
                key={prompt}
                className="flex items-start gap-3 rounded-2xl border border-ink-100 bg-white p-5 transition-colors hover:border-brand-200"
              >
                <MessageSquare className="mt-0.5 h-4 w-4 flex-none text-brand-500" />
                <p className="text-[15px] leading-relaxed text-ink-800">“{prompt}”</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Actions ---------- */}
      <section className="border-t border-ink-100">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <div className="section-intro">
            <h2 className="section-title text-ink-950">
              What can Receipt do in {brand}? ({actions.length} actions)
            </h2>
            <p className="section-lead text-ink-500">
              Reads run immediately. Anything that changes state in {brand} waits for your approval.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {actions.map((action) => (
              <div key={action.name} className="rounded-2xl border border-ink-100 bg-white p-5">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 flex-none text-brand-500" />
                  <h3 className="text-sm font-semibold text-ink-950">{action.name}</h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{action.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section className="border-t border-ink-100 bg-ink-50/50">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <h2 className="section-title mb-12 text-center text-ink-950">How does Receipt work with {brand}?</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                title: `Connect ${brand}.`,
                desc: `Authorize ${brand} once from your Receipt workspace. Credentials stay with the connector layer — Receipt holds an encrypted reference, never your secrets.`,
              },
              {
                title: 'Ask in plain language.',
                desc: `Say what you need from Slack or the Receipt workspace. Receipt works out that it needs ${brand} — and whatever else the job touches — and plans the run.`,
              },
              {
                title: 'Review the receipt.',
                desc: `Every call against ${brand} is written to an immutable, cryptographically chained receipt with the raw response attached. Audit it, replay it, prove it.`,
              },
            ].map((step, i) => (
              <div key={step.title}>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-950 text-sm font-bold text-white">
                  {i + 1}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-ink-950">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- What is a X AI agent ---------- */}
      <section className="border-t border-ink-100">
        <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8 lg:py-20">
          <h2 className="text-3xl font-bold tracking-tight text-ink-950">What is a {brand} AI agent?</h2>
          <div className="mt-6 space-y-5 text-base leading-relaxed text-ink-500">
            <p>
              A workflow builder makes you draw the job before it runs: pick a trigger in {brand}, map every
              field, handle every branch, then maintain it forever. A {brand} AI agent skips that. You state
              the outcome, and it decides which {brand} calls to make, in what order, and what to do when the
              data comes back looking different than expected.
            </p>
            <p>
              Receipt is that agent, with the part most agents are missing: proof. It runs in an isolated
              sandbox with no ambient access, holds every state-changing {brand} call behind an org-level
              policy gate, and writes each step to an append-only receipt chain. If it says it updated
              something in {brand}, you can replay the receipt and verify it independently.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Security ---------- */}
      <section className="border-t border-ink-100 bg-ink-50/50">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <div className="section-intro">
            <div className="eyebrow bg-brand-500/10 text-brand-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              Security &amp; permissions
            </div>
            <h2 className="section-title text-ink-950">You decide what it can touch in {brand}</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Lock,
                title: 'Native connection',
                desc: `Receipt authenticates to ${brand} through the official flow (${
                  integration.auth === 'Coming soon' ? 'managed connector' : integration.auth
                }) — no scraping, no shared passwords.`,
              },
              {
                icon: ShieldCheck,
                title: 'Review before write',
                desc: `Reads run straight away. Anything that changes ${brand} data passes an org-level policy gate and waits for a human.`,
              },
              {
                icon: Plug,
                title: 'Isolated compute',
                desc: 'Each run executes in a private sandbox with zero ambient access to your other systems.',
              },
              {
                icon: FileCheck2,
                title: 'Provable audit trail',
                desc: `Every ${brand} call is an immutable receipt with the raw API response and a tamper-evident hash.`,
              },
            ].map((point) => (
              <div key={point.title} className="rounded-2xl border border-ink-100 bg-white p-6">
                <point.icon className="h-5 w-5 text-brand-500" />
                <h3 className="mt-4 text-base font-semibold text-ink-950">{point.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{point.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="border-t border-ink-100">
        <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8 lg:py-20">
          <h2 className="section-title mb-6 text-center text-ink-950">{brand} integration FAQ</h2>
          <div>
            {faqs.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Works with / related ---------- */}
      <section className="border-t border-ink-100 bg-ink-50/50">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <h2 className="text-2xl font-bold tracking-tight text-ink-950">Receipt uses {brand} together with</h2>
          <p className="mt-2 text-sm text-ink-500">
            One run can span several systems — and one receipt chain covers the whole job.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {worksWith.map((item) => (
              <RelatedCard key={item.name} item={item} />
            ))}
          </div>

          {related.length > 0 && (
            <>
              <h2 className="mt-14 text-2xl font-bold tracking-tight text-ink-950">
                More {integration.category} integrations
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((item) => (
                  <RelatedCard key={item.name} item={item} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ---------- Browse the rest of the directory ---------- */}
      <section className="border-t border-ink-100">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <AlphaBrowser initial={alphaKey(integration.name)} />
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="border-t border-ink-100 bg-ink-50/50">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center lg:px-8 lg:py-24">
          <h2 className="section-title text-ink-950">Put Receipt to work in {brand}</h2>
          <p className="section-lead text-ink-500">
            Start free, connect {brand} in a minute, and keep the receipt for everything it does.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="https://beetle.run/auth/sign-up" className="btn-primary btn-lg">
              Get started for free
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#/pricing" className="btn-secondary btn-lg">
              See pricing
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
