import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, FileCheck2, Lock, Plug, Search, ShieldCheck, X } from 'lucide-react';
import {
  categories, categoryCounts, CATALOG_LABEL, integrationCatalog, popularIntegrations,
  type Category, type Integration,
} from '@/data/integrations';
import { integrationHref } from '@/data/integrationDetail';
import IntegrationLogo from '@/components/IntegrationLogo';
import AlphaBrowser from '@/components/AlphaBrowser';
import ReceiptMark from '@/components/ReceiptMark';
import { getIcon } from '@/components/icons';
import { teams, useCaseCount, teamUseCaseHref } from '@/data/useCases';

const PAGE_SIZE = 24;

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function LogoChip({ name }: { name: string }) {
  return (
    <a
      href={integrationHref(name)}
      className="flex items-center gap-2 rounded-lg border border-ink-100 bg-white px-3 py-2 transition-colors hover:border-brand-200 hover:bg-brand-50/40"
    >
      <IntegrationLogo name={name} size="sm" plain />
      <span className="truncate text-xs font-semibold text-ink-700" title={name}>
        {name}
      </span>
    </a>
  );
}

/** Directory card — logo tile + name, linking through to the connector's own page. */
function DirectoryCard({ item }: { item: Integration }) {
  const live = item.status !== 'coming-soon';
  return (
    <a
      href={integrationHref(item.name)}
      className="group flex items-center gap-4 rounded-2xl border border-ink-100 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg hover:shadow-ink-950/5"
    >
      <IntegrationLogo name={item.name} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] font-semibold text-ink-950" title={item.name}>
          {item.name}
        </div>
        <div className="mt-0.5 truncate text-xs text-ink-400">{item.category}</div>
      </div>
      {live && (
        <span
          className={`flex-none rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
            item.status === 'connected'
              ? 'border-brand-200 bg-brand-50 text-brand-700'
              : 'border-sky-200 bg-sky-50 text-sky-700'
          }`}
        >
          {item.status === 'connected' ? 'Connected' : 'Ready'}
        </span>
      )}
    </a>
  );
}

const steps = [
  {
    title: 'Authorize the connector.',
    desc: 'One-click OAuth for most tools, an API key for the rest. No webhook plumbing, no middleware to maintain, no CSV exports.',
  },
  {
    title: 'Describe the outcome.',
    desc: 'Ask in plain language. Receipt works out which connected systems it needs and runs the job in an isolated sandbox.',
  },
  {
    title: 'Read the receipt.',
    desc: 'Every call against every tool is written to an immutable receipt — so you can audit, replay, and prove exactly what happened.',
  },
];

const securityPoints = [
  {
    icon: Lock,
    title: 'OAuth, not passwords.',
    desc: 'Receipt authenticates through official OAuth flows. Credentials stay with the connector layer — Receipt only stores an encrypted reference, never your secrets.',
  },
  {
    icon: ShieldCheck,
    title: 'Approval before action.',
    desc: 'Every state-changing operation passes an org-level policy gate first. Sandbox by default; sensitive writes wait for your explicit approval.',
  },
  {
    icon: FileCheck2,
    title: 'Every call leaves a receipt.',
    desc: 'Each action against each tool is logged as an immutable, cryptographically chained receipt. Audit it, replay it, prove it.',
  },
  {
    icon: Plug,
    title: 'Per-tool permissions.',
    desc: 'Connect only what you need and decide which teams reach which systems. Revoke at the provider any time and Receipt loses access instantly.',
  },
];

export default function IntegrationsPage({ onBack }: { onBack: () => void }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category | 'All'>('All');
  const [visible, setVisible] = useState(PAGE_SIZE);

  // A new search or category starts the list over from the first page.
  useEffect(() => setVisible(PAGE_SIZE), [query, category]);

  const liveIntegrations = useMemo(
    () => integrationCatalog.filter((i) => i.status !== 'coming-soon').map((i) => i.name),
    []
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return integrationCatalog.filter((item) => {
      if (q && !item.name.toLowerCase().includes(q) && !item.category.toLowerCase().includes(q)) return false;
      if (category !== 'All' && item.category !== category) return false;
      return true;
    });
  }, [query, category]);

  const shown = results.slice(0, visible);

  return (
    <div className="min-h-screen bg-white">
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden pt-28">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50 via-sky-50/60 to-white" />
        <div className="absolute -top-20 left-1/2 -z-10 h-[28rem] w-[52rem] -translate-x-1/2 rounded-full bg-brand-200/25 blur-[120px]" />
        <div className="absolute -top-10 right-1/4 -z-10 h-72 w-72 rounded-full bg-sky-200/30 blur-[100px]" />

        <div className="mx-auto max-w-5xl px-5 py-16 text-center lg:px-8 lg:py-24">
          <button
            onClick={onBack}
            className="mb-10 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition-colors hover:text-ink-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </button>

          <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-ink-950 text-balance lg:text-7xl">
            One AI coworker.
            <br />
            Your entire tool stack.
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-xl font-medium text-ink-700 lg:text-2xl">
            Receipt connects to <span className="gradient-text font-bold">{CATALOG_LABEL}</span> tools
            and uses them the way you do.
          </p>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink-400">
            Reconciles AWS spend against the Terraform plan, moves the Linear issue when the Sentry error
            clears, finds the bug and opens the PR in GitHub. One Slack message. No tab switching. No CSV
            exports.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a href="https://app.kentron.ai/auth/sign-up" className="btn-primary btn-lg">
              Get Started for Free
            </a>
            <button onClick={() => scrollToId('directory')} className="btn-secondary btn-lg">
              See All Integrations
            </button>
          </div>

          {/* Hub-and-spoke: the stack streams past, Receipt sits underneath it */}
          <div className="mt-20">
            <div className="mask-fade-r group overflow-hidden">
              <div className="flex w-max animate-marquee gap-3 group-hover:[animation-play-state:paused]">
                {[...popularIntegrations, ...popularIntegrations].map((name, i) => (
                  <a
                    key={`${name}-${i}`}
                    href={integrationHref(name)}
                    title={name}
                    aria-hidden={i >= popularIntegrations.length}
                    className="transition-transform duration-200 hover:-translate-y-1"
                  >
                    <IntegrationLogo name={name} size="lg" className="bg-white/90 backdrop-blur" />
                  </a>
                ))}
              </div>
            </div>
            <div className="mx-auto mt-0 h-14 w-px bg-gradient-to-b from-transparent via-brand-300 to-brand-500" />
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.4rem] bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-glow">
              <ReceiptMark className="h-11 w-11" paperClassName="text-brand-600" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Integration Directory ---------- */}
      <section id="directory" className="scroll-mt-20 border-t border-ink-100 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <h2 className="text-center text-4xl font-bold tracking-tight text-ink-950 lg:text-5xl">
            Integration Directory
          </h2>

          {/* Search */}
          <div className="relative mx-auto mt-10 max-w-4xl">
            <Search className="pointer-events-none absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${CATALOG_LABEL} integrations...`}
              aria-label="Search integrations"
              className="w-full rounded-full border border-ink-100 bg-white py-5 pl-16 pr-14 text-base text-ink-900 shadow-lg shadow-ink-950/5 outline-none transition-shadow placeholder:text-ink-400 focus:shadow-xl focus:shadow-brand-500/10 focus:ring-2 focus:ring-brand-500/20"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-6 top-1/2 -translate-y-1/2 text-ink-400 transition-colors hover:text-ink-700"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Category pills */}
          <div className="mx-auto mt-8 flex max-w-5xl flex-wrap justify-center gap-3">
            <button
              onClick={() => setCategory('All')}
              className={`rounded-full px-6 py-3 text-sm font-semibold transition-all ${
                category === 'All'
                  ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-md shadow-brand-500/25'
                  : 'border border-ink-100 bg-white text-ink-700 hover:border-ink-200 hover:bg-ink-50'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`rounded-full px-6 py-3 text-sm font-semibold transition-all ${
                  category === cat
                    ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-md shadow-brand-500/25'
                    : 'border border-ink-100 bg-white text-ink-700 hover:border-ink-200 hover:bg-ink-50'
                }`}
              >
                {cat}
                <span className={`ml-2 text-xs font-medium ${category === cat ? 'text-white/70' : 'text-ink-400'}`}>
                  {categoryCounts[cat]}
                </span>
              </button>
            ))}
          </div>

          {/* Grid */}
          {results.length === 0 ? (
            <div className="mx-auto mt-14 max-w-lg rounded-2xl border border-dashed border-ink-200 bg-ink-50/50 p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                <Search className="h-5 w-5 text-ink-400" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-ink-800">Nothing matches that search</h3>
              <p className="mt-2 text-sm text-ink-400">
                We add connectors every week — tell us what you need, or point Receipt at your API docs
                and let it build the integration itself.
              </p>
              <button
                onClick={() => {
                  setQuery('');
                  setCategory('All');
                }}
                className="btn-secondary mt-6"
              >
                Clear search
              </button>
            </div>
          ) : (
            <>
              <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {shown.map((item) => (
                  <DirectoryCard key={item.name} item={item} />
                ))}
              </div>

              <div className="mt-12 text-center">
                {visible < results.length ? (
                  <>
                    <button
                      onClick={() => setVisible((v) => v + PAGE_SIZE)}
                      className="btn-secondary px-8 py-3.5"
                    >
                      Show more
                    </button>
                    <p className="mt-4 text-xs text-ink-400">
                      Showing {shown.length} of{' '}
                      {category === 'All' && !query
                        ? `${CATALOG_LABEL} integrations`
                        : `${results.length} matching integrations`}
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-ink-400">
                    Showing all{' '}
                    {category === 'All' && !query
                      ? `${CATALOG_LABEL} integrations`
                      : `${results.length} matching integrations`}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ---------- A–Z ---------- */}
      <section className="border-t border-ink-100 bg-ink-50/50">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <AlphaBrowser />
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section className="border-t border-ink-100 bg-ink-50/50">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
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

      {/* ---------- Three tiers ---------- */}
      <section className="border-t border-ink-100">
        <div className="mx-auto max-w-7xl space-y-6 px-5 py-16 lg:px-8 lg:py-20">
          <div className="rounded-2xl border border-ink-100 bg-white p-6 lg:p-8">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 className="text-xl font-bold tracking-tight text-ink-950">
                Deep integrations
              </h2>
              <span className="rounded-full border border-brand-200 bg-brand-50 px-2.5 py-0.5 text-[11px] font-semibold text-brand-700">
                Connect today
              </span>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-500">
              Configured connections with full read and write access for the systems your team lives in.
              One-click OAuth or an API key, and Receipt is operating inside them the same day.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
              {liveIntegrations.slice(0, 12).map((name) => (
                <LogoChip key={name} name={name} />
              ))}
            </div>
            <button
              onClick={() => scrollToId('directory')}
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-800"
            >
              See the rest in the directory
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="rounded-2xl border border-ink-100 bg-white p-6 lg:p-8">
            <h2 className="text-xl font-bold tracking-tight text-ink-950">
              {CATALOG_LABEL} via managed connectors
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-500">
              The full managed-connector catalog across {categories.length} categories — CRM, project
              management, finance, communication, analytics, HR, and support. Enable one and it reaches
              your workspace without waiting on a Receipt release.
            </p>
          </div>

          <div className="rounded-2xl border border-ink-100 bg-white p-6 lg:p-8">
            <h2 className="text-xl font-bold tracking-tight text-ink-950">Receipt builds its own</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-500">
              Tool not in the directory? Point Receipt at the API docs and it writes the integration
              itself, or drive an internal endpoint straight from the sandbox — under the same policy
              gates and the same audit trail as everything else.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Use cases live on their own pages ---------- */}
      <section className="border-t border-ink-100 bg-ink-50/50">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <div className="section-intro">
            <h2 className="section-title text-ink-950">What that looks like in practice</h2>
            <p className="section-lead text-ink-500">
              {useCaseCount} worked examples across {teams.length} teams — the prompt, the systems each run
              touches, and the receipt it leaves behind.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {teams.map((team) => {
              const TeamIcon = getIcon(team.icon);
              return (
                <a
                  key={team.slug}
                  href={teamUseCaseHref(team.slug)}
                  className="group flex flex-col gap-3 rounded-2xl border border-ink-100 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-md"
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${team.accent} text-white`}
                  >
                    <TeamIcon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-semibold leading-snug text-ink-800">{team.label}</span>
                  <span className="text-[11px] text-ink-400">{team.cases.length} use cases</span>
                </a>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <a href="#/use-cases" className="btn-secondary">
              Browse every use case
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ---------- Multiple accounts ---------- */}
      <section className="border-t border-ink-100">
        <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-16">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold tracking-tight text-ink-950">
                Multiple accounts? Connect them all.
              </h2>
              <p className="mt-3 text-base leading-relaxed text-ink-500">
                Two GitHub orgs, three AWS accounts, a sandbox and a production Stripe. Receipt keeps each
                connection separate with its own scopes and its own receipts — no crossed wires, and no
                guessing which environment an action ran against.
              </p>
            </div>
            <div className="flex flex-none flex-wrap gap-2">
              {popularIntegrations.slice(0, 6).map((name) => (
                <LogoChip key={name} name={name} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Security ---------- */}
      <section className="border-t border-ink-100 bg-ink-50/50">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <div className="section-intro">
            <div className="eyebrow bg-brand-500/10 text-brand-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              Access &amp; control
            </div>
            <h2 className="section-title text-ink-950">You decide what it can touch</h2>
            <p className="section-lead text-ink-500">
              Scoped, revocable access on every connection — governed by org-level policy and recorded in
              full.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {securityPoints.map((point) => (
              <div key={point.title} className="rounded-2xl border border-ink-100 bg-white p-6">
                <point.icon className="h-5 w-5 text-brand-500" />
                <h3 className="mt-4 text-base font-semibold text-ink-950">{point.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{point.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Final CTA ---------- */}
      <section className="border-t border-ink-100">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center lg:px-8 lg:py-24">
          <h2 className="section-title text-ink-950">Start free. Connect what you actually use.</h2>
          <p className="section-lead text-ink-500">
            Every feature, every connector in the directory. Don’t see your tool? Tell us and we’ll enable
            it — or let Receipt build it against your API.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="https://app.kentron.ai/auth/sign-up" className="btn-primary btn-lg">
              Get Started for Free
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href="mailto:hello@kentron.ai" className="btn-secondary btn-lg">
              Request an integration
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
