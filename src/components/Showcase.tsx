import { MessagesSquare } from 'lucide-react';
import { heroStats } from '@/data/content';

export default function Showcase() {
  return (
    <section id="showcase" className="section relative overflow-hidden bg-ink-950">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute left-0 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-brand-500/8 blur-[120px]" />

      <div className="section-container relative">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,440px)_1fr] lg:gap-16">
          <div>
            <div className="eyebrow bg-brand-500/15 text-brand-300">
              <MessagesSquare className="h-3.5 w-3.5" />
              Works where you work
            </div>

            <h2 className="section-title text-white">
              Ask in Slack. Get proof back.
            </h2>

            <p className="section-lead text-ink-200">
              Receipt runs tasks across your SaaS apps and servers, then backs every result with a
              verifiable receipt — so you know exactly what happened, why it happened, and can
              replay it anytime.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-ink-800 pt-8">
              {heroStats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-white lg:text-3xl">{stat.value}</div>
                  <div className="mt-1 text-xs leading-snug text-ink-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="glow-ring rounded-2xl bg-ink-900 p-3">
            <div className="mb-2 flex items-center gap-2 px-2 py-1.5">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-ink-600" />
                <div className="h-2.5 w-2.5 rounded-full bg-ink-600" />
                <div className="h-2.5 w-2.5 rounded-full bg-ink-600" />
              </div>
              <div className="flex-1 text-center">
                <span className="font-mono text-xs text-ink-300">Running EC2 Instances</span>
              </div>
              <div className="flex items-center gap-1 rounded-md bg-brand-500/15 px-2 py-0.5 text-[10px] font-semibold text-brand-300">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
                Slack
              </div>
            </div>

            <img
              src="/hero-ec2-instances.png"
              alt="Receipt agent reporting running EC2 instances in a Slack thread"
              className="max-h-[620px] w-full rounded-xl border border-ink-700/60 object-cover object-top shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
