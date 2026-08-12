import { ArrowRight, Sparkles } from 'lucide-react';
import { teams, useCaseCount } from '@/data/useCases';
import TeamPicker from '@/components/TeamPicker';

/** Home-page slice of the use-case hub — the same picker, with a way through to the full set. */
export default function UseCasesTeaser() {
  return (
    <section id="use-cases" className="section bg-white">
      <div className="section-container">
        <div className="section-intro">
          <div className="eyebrow bg-brand-500/10 text-brand-700">
            <Sparkles className="h-3.5 w-3.5" />
            Use cases
          </div>
          <h2 className="section-title text-ink-950">Pick the team, see the run</h2>
          <p className="section-lead text-ink-500">
            {useCaseCount} worked examples across {teams.length} teams — each with the sentence you type, the
            systems it touches, and the proof it leaves behind.
          </p>
        </div>

        <TeamPicker headline="Start with the work that eats your week." />

        <div className="mt-10 text-center">
          <a href="#/use-cases" className="btn-secondary btn-lg">
            Explore all {useCaseCount} use cases
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
