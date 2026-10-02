import { ArrowRight, CheckCircle2, Play } from 'lucide-react';

const DEMO_URL = 'https://meetings-na2.hubspot.com/snagpal';

function RunPreview() {
  return (
    <div className="relative mx-auto mt-16 max-w-5xl animate-fade-up" style={{ animationDelay: '450ms' }}>
      <div className="absolute -inset-8 rounded-[3rem] bg-brand-500/10 blur-3xl" />
      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-ink-900/90 text-left shadow-2xl shadow-black/30 backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-7">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500 text-xs font-bold text-white">K</span>
            <span className="text-sm font-semibold text-white">Live agent run</span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-400/20 bg-brand-400/10 px-2.5 py-1 text-[11px] font-semibold text-brand-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400" />
            Audited
          </span>
        </div>

        <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1.05fr_.95fr] lg:gap-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-ink-400">
              <span className="rounded bg-white/10 px-2 py-1 text-ink-300">Slack</span>
              <span>·</span>
              <span>42 minutes ago</span>
            </div>
            <p className="mt-4 max-w-lg text-lg font-medium leading-relaxed text-white sm:text-xl">
              Reconcile last week&rsquo;s AWS spend against budget and flag anything unusual.
            </p>
            <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
              <CheckCircle2 className="h-5 w-5 text-brand-400" />
              <span className="text-sm text-ink-300">Completed with a replayable receipt chain</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 self-center">
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
              <div className="text-xs text-ink-400">Resources reviewed</div>
              <div className="mt-2 font-mono text-2xl font-bold text-white">42</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
              <div className="text-xs text-ink-400">Anomalies found</div>
              <div className="mt-2 font-mono text-2xl font-bold text-brand-300">2</div>
            </div>
            <div className="col-span-2 rounded-2xl border border-sky-400/20 bg-sky-400/10 p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-sky-300">Receipt ID</div>
              <div className="mt-2 truncate font-mono text-sm text-white">rcp_8c41…a72f · 14 calls · sealed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink-950 pb-24 pt-40 sm:pb-28">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950 via-ink-950/90 to-ink-900" />
      <div className="absolute -top-40 left-1/2 h-96 w-[800px] -translate-x-1/2 rounded-full bg-brand-500/10 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-sky-500/8 blur-[100px]" />

      <div className="section-container relative w-full">
        <div className="mx-auto max-w-4xl text-center">
          <h1
            className="animate-fade-up text-balance text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl"
            style={{ animationDelay: '100ms' }}
          >
            <span className="gradient-text">
              One Platform. Every AI Tool.
              <br />
              Zero Accountability Gaps.
            </span>
          </h1>

          <p
            className="mx-auto mt-7 max-w-2xl animate-fade-up text-lg leading-relaxed text-ink-200"
            style={{ animationDelay: '200ms' }}
          >
            Deploy agentic AI at scale with complete confidence.
            One platform. Unified governance. Real-time compliance. Proof of every decision.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3 animate-fade-up" style={{ animationDelay: '260ms' }}>
            <a href="#get-started" className="btn-primary btn-lg bg-white text-ink-950 hover:bg-ink-100">
              See how it works
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href={DEMO_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/10"
            >
              <Play className="h-4 w-4 fill-current" />
              Book a demo
            </a>
          </div>

          <div
            className="mx-auto mt-10 grid max-w-5xl animate-fade-up grid-cols-2 gap-3 sm:grid-cols-4"
            style={{ animationDelay: '300ms' }}
          >
            {[
              { label: 'LLM Gateway', desc: 'Model routing layer' },
              { label: 'MCP Gateway', desc: 'Context & tool fabric' },
              { label: 'Agent Harness', desc: 'Execution control plane' },
              { label: 'Agent Governance', desc: 'Policy & audit layer' },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-ink-800 bg-ink-900/60 px-4 py-3 text-left"
              >
                <div className="text-xs font-bold uppercase tracking-wider text-brand-400">
                  {item.label}
                </div>
                <div className="mt-1 text-sm font-semibold text-white">{item.desc}</div>
              </div>
            ))}
          </div>

          <RunPreview />
        </div>
      </div>
    </section>
  );
}
