import { ArrowRight, FileCheck2, MessageSquare, Sparkles, Terminal } from 'lucide-react';
import { teams, useCaseCount, teamUseCaseHref } from '@/data/useCases';
import { catalogCounts } from '@/data/integrations';
import { getIcon } from '@/components/icons';
import TeamPicker from '@/components/TeamPicker';

const flow = [
  {
    icon: MessageSquare,
    title: 'You describe the outcome.',
    desc: 'In Slack or the Receipt workspace, in the words you would use with a colleague. There is no workflow to draw first and no trigger to configure.',
  },
  {
    icon: Terminal,
    title: 'Receipt does the work.',
    desc: `It decides which of your ${catalogCounts.total} connected systems it needs, runs the job in an isolated sandbox, and stops at a policy gate before anything changes state.`,
  },
  {
    icon: FileCheck2,
    title: 'You get proof, not a summary.',
    desc: 'Every call it made is written to an immutable, hash-chained receipt with the raw response attached. Replay it, audit it, hand it to a reviewer.',
  },
];

export default function UseCasesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden pt-28">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50 via-sky-50/50 to-white" />
        <div className="absolute -top-24 left-1/2 -z-10 h-[26rem] w-[48rem] -translate-x-1/2 rounded-full bg-brand-200/25 blur-[120px]" />

        <div className="mx-auto max-w-4xl px-5 py-14 text-center lg:px-8 lg:py-20">
          <div className="eyebrow bg-brand-500/10 text-brand-700">
            <Sparkles className="h-3.5 w-3.5" />
            Use cases
          </div>
          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-ink-950 text-balance lg:text-6xl">
            {useCaseCount} jobs your team stops doing by hand.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-500">
            Not demos. The recurring, cross-system work that eats a day a week — root-causing the alert,
            reconciling the month, chasing the review, briefing the call. Pick the team that owns the problem.
          </p>
        </div>
      </section>

      {/* ---------- The picker ---------- */}
      <section className="mx-auto max-w-7xl px-5 pb-16 lg:px-8 lg:pb-24">
        <TeamPicker />
      </section>

      {/* ---------- Every team ---------- */}
      <section className="border-t border-ink-100 bg-ink-50/50">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <div className="section-intro">
            <h2 className="section-title text-ink-950">Every team, with its own page</h2>
            <p className="section-lead text-ink-500">
              {teams.length} teams, {useCaseCount} worked examples — each with the prompt, the systems it
              touches, and the proof it leaves behind.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => {
              const Icon = getIcon(team.icon);
              return (
                <a
                  key={team.slug}
                  href={teamUseCaseHref(team.slug)}
                  className="group relative overflow-hidden rounded-2xl border border-ink-100 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-ink-950/5"
                >
                  <div
                    className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${team.accent} opacity-0 transition-opacity duration-200 group-hover:opacity-100`}
                  />
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${team.accent} text-white shadow-sm`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-ink-950">{team.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">{team.tagline}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-xs font-medium text-ink-400">{team.cases.length} use cases</span>
                    <ArrowRight className="h-4 w-4 text-ink-300 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-600" />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- How a run works ---------- */}
      <section className="border-t border-ink-100">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <div className="section-intro">
            <h2 className="section-title text-ink-950">Every use case runs the same way</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {flow.map((step, i) => (
              <div key={step.title} className="rounded-2xl border border-ink-100 bg-white p-6 lg:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-950 text-sm font-bold text-white">
                    {i + 1}
                  </div>
                  <step.icon className="h-5 w-5 text-brand-500" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-ink-950">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="border-t border-ink-100 bg-ink-50/50">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center lg:px-8 lg:py-24">
          <h2 className="section-title text-ink-950">Your use case is probably one of these.</h2>
          <p className="section-lead text-ink-500">
            And if it isn&rsquo;t, describe it in plain language and Receipt works out the rest. Start free,
            connect one system, read the receipts before you connect the next.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="https://beetle.run/auth/sign-up" className="btn-primary btn-lg">
              Get started for free
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#/integrations" className="btn-secondary btn-lg">
              Browse {catalogCounts.total} integrations
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
