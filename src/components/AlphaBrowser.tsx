import { useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { alphabet, alphaKey, catalogCounts, integrationCatalog } from '@/data/integrations';
import { integrationHref } from '@/data/integrationDetail';
import IntegrationLogo from '@/components/IntegrationLogo';

/** name -> letter bucket, built once for the whole catalog. */
const byLetter = integrationCatalog.reduce<Record<string, typeof integrationCatalog>>((acc, item) => {
  const key = alphaKey(item.name);
  (acc[key] ||= []).push(item);
  return acc;
}, {});

/**
 * Browse the connector directory A–Z. Every connector in the catalog is
 * reachable from any page that renders this, which is what makes the
 * directory feel like a directory rather than a search box.
 */
export default function AlphaBrowser({
  title = 'Browse integrations A–Z',
  initial = 'A',
}: {
  title?: string;
  initial?: string;
}) {
  const [letter, setLetter] = useState(initial);
  const items = useMemo(() => byLetter[letter] ?? [], [letter]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-ink-950">{title}</h2>
          <p className="mt-1.5 text-sm text-ink-500">
            All {catalogCounts.total} connectors, by first letter — {items.length} under &ldquo;{letter}
            &rdquo;.
          </p>
        </div>
        <a
          href="#/integrations"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-800"
        >
          Open the full directory
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>

      {/* letter rail */}
      <div className="mt-6 flex flex-wrap gap-1.5">
        {alphabet.map((l) => {
          const count = byLetter[l]?.length ?? 0;
          const active = l === letter;
          return (
            <button
              key={l}
              disabled={!count}
              onClick={() => setLetter(l)}
              aria-pressed={active}
              className={`h-9 w-9 rounded-lg text-sm font-semibold transition-all duration-150 ${
                active
                  ? 'bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-md shadow-brand-500/25'
                  : count
                    ? 'border border-ink-100 bg-white text-ink-700 hover:-translate-y-0.5 hover:border-brand-200 hover:text-brand-700'
                    : 'cursor-not-allowed border border-ink-50 bg-ink-50/60 text-ink-200'
              }`}
            >
              {l}
            </button>
          );
        })}
      </div>

      {/* the letter's connectors */}
      <div
        key={letter}
        className="mt-6 grid animate-fade-in grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {items.map((item) => (
          <a
            key={item.name}
            href={integrationHref(item.name)}
            className="group flex items-center gap-2.5 rounded-xl border border-ink-100 bg-white px-3 py-2.5 transition-all duration-150 hover:border-brand-200 hover:bg-brand-50/30"
          >
            <IntegrationLogo name={item.name} size="sm" plain />
            <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-ink-700" title={item.name}>
              {item.name}
            </span>
            {item.status !== 'coming-soon' && (
              <span className="h-1.5 w-1.5 flex-none rounded-full bg-brand-500" title="Live connector" />
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
