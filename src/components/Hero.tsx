import { ArrowRight, Check } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-ink-950 pt-16">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950 via-ink-950/90 to-ink-900" />
      <div className="absolute -top-40 left-1/2 h-96 w-[800px] -translate-x-1/2 rounded-full bg-brand-500/10 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-sky-500/8 blur-[100px]" />

      <div className="section-container relative w-full">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-ink-700/60 bg-ink-850 px-3 py-1 text-xs font-medium text-ink-200">
            <span className="flex h-2 w-2 rounded-full bg-brand-400 animate-pulse-soft" />
            Your Trusted AI Coworker
          </div>

          <h1
            className="mt-7 animate-fade-up text-balance text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl"
            style={{ animationDelay: '100ms' }}
          >
            Receipt: <span className="gradient-text">AI Coworker Built for Zero-Trust Enterprise.</span>
          </h1>

          <p
            className="mx-auto mt-7 max-w-2xl animate-fade-up text-lg leading-relaxed text-ink-200"
            style={{ animationDelay: '200ms' }}
          >
            Your AI coworker that proves what it did. Receipt runs tasks across your SaaS apps and
            servers, then backs every result with a verifiable receipt.
          </p>

          <div className="mt-10 flex animate-fade-up justify-center" style={{ animationDelay: '300ms' }}>
            <a
              href="https://app.kentron.ai/auth/sign-up"
              className="btn-primary btn-lg group bg-white text-ink-950 shadow-lg shadow-ink-950/20 hover:bg-white hover:shadow-glow"
            >
              Get started for free
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          </div>

          <div
            className="mt-6 flex animate-fade-up flex-wrap items-center justify-center gap-x-6 gap-y-2"
            style={{ animationDelay: '350ms' }}
          >
            {['No credit card required', 'Cancel anytime'].map((item) => (
              <div key={item} className="flex items-center gap-1.5 text-sm text-ink-300">
                <Check className="h-4 w-4 text-brand-400" strokeWidth={3} />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
