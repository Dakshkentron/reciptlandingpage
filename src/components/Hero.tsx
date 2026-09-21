export default function Hero() {
  return (
    <section className="relative flex items-center overflow-hidden bg-ink-950 pb-20 pt-40">
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
        </div>
      </div>
    </section>
  );
}
