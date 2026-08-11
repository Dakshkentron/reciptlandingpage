import { ArrowRight, Check } from 'lucide-react';

export default function CTA() {
  return (
    <section className="section relative overflow-hidden bg-white">
      <div className="section-container">
        <div className="relative overflow-hidden rounded-2xl bg-ink-950 px-8 py-16 lg:px-16 lg:py-20">
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-60 w-[500px] rounded-full bg-brand-500/15 blur-[100px]" />
          <div className="absolute -bottom-20 right-10 h-60 w-60 rounded-full bg-sky-500/10 blur-[80px]" />

          <div className="relative text-center max-w-2xl mx-auto">
            <h2 className="section-title text-white">
              Getting started is easy
            </h2>
            <p className="section-lead text-ink-200">
              Connect Receipt to your data warehouse and do more with it immediately.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://beetle.run/auth/sign-up"
                className="btn-primary btn-lg group bg-white text-ink-950 shadow-lg shadow-ink-950/20 hover:bg-white hover:shadow-glow"
              >
                Get started for free
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink-300">
              {['No credit card required', 'Cancel anytime'].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-brand-400" strokeWidth={3} />
                  {item}
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
