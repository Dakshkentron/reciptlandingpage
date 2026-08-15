import { ArrowRight, Ban, Check, FileCheck2, MessageSquare, Search } from 'lucide-react';
import { teamBySlug, teams, teamUseCaseHref, type UseCase } from '@/data/useCases';
import { safeIntegrationHref } from '@/data/integrationDetail';
import { CATALOG_LABEL } from '@/data/integrations';
import IntegrationLogo from '@/components/IntegrationLogo';
import ReceiptMark from '@/components/ReceiptMark';
import { getIcon } from '@/components/icons';

/** One worked example: what you type, what it does, what it leaves behind. */
function UseCaseCard({ item, index, accent }: { item: UseCase; index: number; accent: string }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-ink-100 bg-white transition-shadow duration-200 hover:shadow-xl hover:shadow-ink-950/5">
      <div className={`h-1 bg-gradient-to-r ${accent}`} />

      <div className="p-6 lg:p-8">
        <div className="flex items-start gap-4">
          <div className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-ink-950 text-sm font-bold text-white">
            {String(index + 1).padStart(2, '0')}
          </div>
          <h3 className="text-xl font-semibold leading-snug text-ink-950 text-balance lg:text-2xl">
            {item.title}
          </h3>
        </div>

        {/* what you type */}
        <div className="mt-6 rounded-2xl border border-ink-100 bg-ink-50/70 p-4">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-ink-400">
            <MessageSquare className="h-3.5 w-3.5" />
            You type
          </div>
          <p className="mt-2 font-mono text-[13.5px] leading-relaxed text-ink-800">
            <span className="text-brand-600">@Receipt</span> {item.prompt}
          </p>
        </div>

        {/* what it does */}
        <div className="mt-6">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">
            What Receipt does
          </div>
          <ol className="mt-3 space-y-2.5">
            {item.steps.map((step) => (
              <li key={step} className="flex gap-3">
                <Check className="mt-0.5 h-4 w-4 flex-none text-brand-500" strokeWidth={2.5} />
                <span className="text-sm leading-relaxed text-ink-600">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* the systems it touches */}
        <div className="mt-6 flex flex-wrap gap-2">
          {item.tools.map((tool) => (
            <a
              key={tool}
              href={safeIntegrationHref(tool)}
              className="flex items-center gap-2 rounded-lg border border-ink-100 bg-white px-2.5 py-1.5 transition-colors hover:border-brand-200 hover:bg-brand-50/40"
            >
              <IntegrationLogo name={tool} size="sm" plain />
              <span className="text-xs font-semibold text-ink-700">{tool}</span>
            </a>
          ))}
        </div>
      </div>

      {/* the proof */}
      <div className="flex gap-3 border-t border-ink-100 bg-brand-50/40 px-6 py-5 lg:px-8">
        <FileCheck2 className="mt-0.5 h-4 w-4 flex-none text-brand-600" />
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-700">
            What it leaves behind
          </div>
          <p className="mt-1 text-sm leading-relaxed text-ink-600">{item.proof}</p>
        </div>
      </div>
    </article>
  );
}

export default function UseCaseDetailPage({ slug }: { slug: string }) {
  const team = teamBySlug.get(slug);

  if (!team) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-5 pt-24 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink-50">
          <Search className="h-5 w-5 text-ink-400" />
        </div>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-ink-950">No use cases for that team</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-500">
          Nothing matches &ldquo;{slug}&rdquo;. Browse every team instead.
        </p>
        <a href="#/use-cases" className="btn-primary mt-8">
          All use cases
        </a>
      </div>
    );
  }

  const Icon = getIcon(team.icon);
  const others = teams.filter((t) => t.slug !== team.slug);

  return (
    <div className="min-h-screen bg-white">
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden pt-28">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-50 to-white" />
        <div
          className={`absolute -top-32 left-1/2 -z-10 h-[26rem] w-[46rem] -translate-x-1/2 rounded-full bg-gradient-to-br ${team.accent} opacity-[0.18] blur-[120px]`}
        />

        <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8 lg:py-20">
          <nav className="flex items-center gap-2 text-sm text-ink-400" aria-label="Breadcrumb">
            <a href="#/use-cases" className="transition-colors hover:text-ink-950">
              Use cases
            </a>
            <span aria-hidden>/</span>
            <span className="font-medium text-ink-700">{team.label}</span>
          </nav>

          <div className="mt-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
            {/* the run, as it appears in Slack */}
            <div
              className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${team.accent} p-6 shadow-2xl shadow-ink-950/15 lg:p-9`}
            >
              <div className="absolute inset-0 bg-grid opacity-20" />

              <div className="relative">
                <div className="text-sm font-semibold text-white/80">#{team.slug}-alerts</div>
                <div className="text-[15px] font-semibold text-white">{team.thread.title}</div>

                <div className="mt-6 space-y-3">
                  {team.thread.messages.map((msg, i) => {
                    const isAgent = msg.from === 'receipt';
                    return (
                      <div key={i} className="rounded-2xl bg-white p-4 shadow-lg lg:p-5">
                        <div className="flex items-center gap-2">
                          {isAgent ? (
                            <div className="flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-brand-500 text-white">
                              <ReceiptMark className="h-4 w-4" paperClassName="text-brand-500" />
                            </div>
                          ) : (
                            <div className="flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-ink-200 text-[11px] font-bold text-ink-700">
                              {msg.name.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <span className="text-[13px] font-bold text-ink-950">{msg.name}</span>
                          {isAgent && (
                            <span className="rounded bg-ink-100 px-1 py-px text-[9px] font-bold uppercase tracking-wide text-ink-500">
                              App
                            </span>
                          )}
                          <span className="text-[11px] text-ink-400">{msg.time}</span>
                        </div>

                        <p className="mt-2 text-[13.5px] leading-relaxed text-ink-700">{msg.text}</p>

                        {msg.reactions && (
                          <div className="mt-3 flex gap-1.5">
                            {msg.reactions.map((r) => (
                              <span
                                key={r}
                                className="rounded-full border border-ink-100 bg-ink-50 px-2 py-0.5 text-[11px] font-medium text-ink-600"
                              >
                                {r}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${team.accent} text-white shadow-lg`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-ink-100 px-3 py-1 text-xs font-semibold text-ink-700">
                  {team.label}
                </span>
              </div>

              <h1 className="mt-6 text-4xl font-bold leading-[1.06] tracking-tight text-ink-950 text-balance lg:text-5xl">
                {team.headline}
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-ink-500">{team.intro}</p>

              {/* the systems this run touches, up front */}
              <div className="mt-7 flex flex-wrap items-center gap-3">
                {team.stack.slice(0, 6).map((name) => (
                  <a
                    key={name}
                    href={safeIntegrationHref(name)}
                    title={name}
                    className="transition-transform duration-200 hover:-translate-y-1"
                  >
                    <IntegrationLogo name={name} />
                  </a>
                ))}
              </div>

              <div className="mt-7 flex items-start gap-3 rounded-2xl border border-ink-100 bg-white p-4">
                <Ban className="mt-0.5 h-4 w-4 flex-none text-accent-500" />
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">
                    What this replaces
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-ink-700">{team.killed}</p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href="https://beetle.run/auth/sign-up" className="btn-primary btn-lg">
                  Get started for free
                </a>
                <a href="#/use-cases" className="btn-secondary btn-lg">
                  All teams
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 border-t border-ink-100 pt-8 sm:grid-cols-3">
            {team.metrics.map((m) => (
              <div key={m.label}>
                <div className="text-3xl font-bold tracking-tight text-ink-950">{m.value}</div>
                <div className="mt-1 text-sm leading-snug text-ink-400">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- The use cases ---------- */}
      <section className="border-t border-ink-100 bg-ink-50/50">
        <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-20">
          <h2 className="section-title text-ink-950">
            {team.cases.length} things {team.label} stops doing by hand
          </h2>
          <p className="mt-3 max-w-2xl text-base text-ink-500">
            Each one is a single run across several connected systems — with a policy gate before anything
            changes and a receipt for every call.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
            {team.cases.map((item, i) => (
              <UseCaseCard key={item.title} item={item} index={i} accent={team.accent} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Stack ---------- */}
      <section className="border-t border-ink-100">
        <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8 lg:py-16">
          <h2 className="text-2xl font-bold tracking-tight text-ink-950">
            The stack {team.label} usually connects
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-ink-500">
            Any connector in the {CATALOG_LABEL} catalog works here — these are the ones this team
            reaches for first.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {team.stack.map((name) => (
              <a
                key={name}
                href={safeIntegrationHref(name)}
                title={name}
                className="flex flex-col items-center gap-2 rounded-2xl border border-ink-100 bg-white p-4 text-center transition-all duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-md"
              >
                <IntegrationLogo name={name} />
                <span className="w-full truncate text-[11px] font-semibold text-ink-600">{name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Other teams ---------- */}
      <section className="border-t border-ink-100 bg-ink-50/50">
        <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8 lg:py-16">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-400">
            Use cases for other teams
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {others.map((t) => {
              const OtherIcon = getIcon(t.icon);
              return (
                <a
                  key={t.slug}
                  href={teamUseCaseHref(t.slug)}
                  className="group flex flex-col gap-3 rounded-2xl border border-ink-100 bg-white p-4 transition-all duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-md"
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${t.accent} text-white`}
                  >
                    <OtherIcon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-semibold text-ink-800">{t.label}</span>
                  <span className="text-[11px] text-ink-400">{t.cases.length} use cases</span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="border-t border-ink-100">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center lg:px-8 lg:py-24">
          <h2 className="section-title text-ink-950">Put Receipt on the {team.label} backlog.</h2>
          <p className="section-lead text-ink-500">
            Start free, connect one system, and read the receipts it writes before you connect the next.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="https://beetle.run/auth/sign-up" className="btn-primary btn-lg">
              Get started for free
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#/security" className="btn-secondary btn-lg">
              How the proof works
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
