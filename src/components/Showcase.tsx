import { MessagesSquare } from 'lucide-react';
import { heroStats } from '@/data/content';
import SlackThreadDemo from '@/components/SlackThreadDemo';

export default function Showcase() {
  return (
    <section id="showcase" className="section relative overflow-hidden bg-ink-950">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute left-1/2 top-40 h-[30rem] w-[52rem] -translate-x-1/2 rounded-full bg-brand-500/10 blur-[140px]" />

      <div className="section-container relative">
        <div className="section-intro">
          <div className="eyebrow bg-brand-500/15 text-brand-300">
            <MessagesSquare className="h-3.5 w-3.5" />
            Works where you work
          </div>

          <h2 className="section-title text-white">Ask in Slack. Get proof back.</h2>

          <p className="section-lead text-ink-200">
            One sentence in a thread. Receipt runs the task across your SaaS apps and servers, answers in
            seconds, and backs the result with a receipt you can replay.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <SlackThreadDemo />
        </div>

        <div className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-8 border-t border-ink-800 pt-10 sm:grid-cols-3">
          {heroStats.map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className="mt-1.5 text-sm leading-snug text-ink-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
