import { ArrowRight, Plug, Database, GitBranch, Workflow, Code2, Lock, Cloud, Briefcase } from 'lucide-react';
import { integrations, integrationHighlights } from '@/data/content';
import { catalogCounts } from '@/data/integrations';
import { safeIntegrationHref } from '@/data/integrationDetail';
import IntegrationLogo from '@/components/IntegrationLogo';

/** Our own API has no vendor logo — everything else renders the real brand mark. */
function IntegrationIcon({ name, logo }: { name: string; logo: string }) {
  if (logo === 'api') {
    return (
      <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl border border-ink-700/60 bg-ink-850 text-ink-200">
        <Code2 className="h-5 w-5" />
      </div>
    );
  }
  return <IntegrationLogo name={name} />;
}

/** Split the featured connectors into two rails that scroll in opposite directions. */
const rails = [
  integrations.filter((_, i) => i % 2 === 0),
  integrations.filter((_, i) => i % 2 === 1),
];

export default function Integrations() {
  return (
    <section id="integrations" className="section relative overflow-hidden bg-ink-950">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-0 right-0 h-80 w-80 rounded-full bg-sky-500/8 blur-[120px]" />

      <div className="section-container relative">
        <div className="section-intro">
          <div className="eyebrow bg-brand-500/15 text-brand-300">
            <Plug className="h-3.5 w-3.5" />
            Integrations
          </div>
          <h2 className="section-title text-white">
            Instant integration with the whole stack
          </h2>
          <p className="section-lead text-ink-200">
            {catalogCounts.total} managed connectors, {catalogCounts.ready + catalogCounts.connected} ready
            to connect today. Out-of-the-box OAuth and flexible APIs make setup a breeze.
          </p>
          <a
            href="#/integrations"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-ink-700/60 bg-ink-850 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-ink-600 hover:bg-ink-800"
          >
            Browse all {catalogCounts.total} integrations
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {/* Two counter-scrolling rails — the catalog moves past you instead of sitting still. */}
        <div className="mb-12 space-y-3">
          {rails.map((rail, r) => (
            <div key={r} className="mask-fade-r group overflow-hidden">
              <div
                className={`flex w-max gap-3 ${
                  r % 2 ? 'animate-marquee-reverse' : 'animate-marquee'
                } group-hover:[animation-play-state:paused]`}
              >
                {[...rail, ...rail].map((integration, i) => (
                  <a
                    key={`${integration.name}-${i}`}
                    href={integration.logo === 'api' ? '#/integrations' : safeIntegrationHref(integration.name)}
                    aria-hidden={i >= rail.length}
                    className="flex w-64 flex-none items-center gap-3 rounded-xl border border-ink-700/60 bg-ink-850 p-4 transition-all duration-200 hover:border-ink-600 hover:bg-ink-800"
                  >
                    <IntegrationIcon name={integration.name} logo={integration.logo} />
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold leading-tight text-white">
                        {integration.name}
                      </div>
                      <div className="text-[11px] text-ink-400">{integration.category}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrationHighlights.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-ink-700/60 bg-ink-850 p-6 transition-all duration-200 hover:border-ink-600"
            >
              <div className="flex items-start gap-3 mb-3">
                {item.title.includes('cloud') ? (
                  <Cloud className="h-5 w-5 text-brand-400 flex-none mt-0.5" />
                ) : item.title.includes('warehouse') || item.title.includes('oAuth') ? (
                  <Database className="h-5 w-5 text-brand-400 flex-none mt-0.5" />
                ) : item.title.includes('Git') ? (
                  <GitBranch className="h-5 w-5 text-brand-400 flex-none mt-0.5" />
                ) : item.title.includes('Orchestration') ? (
                  <Workflow className="h-5 w-5 text-brand-400 flex-none mt-0.5" />
                ) : item.title.includes('CRM') ? (
                  <Briefcase className="h-5 w-5 text-brand-400 flex-none mt-0.5" />
                ) : item.title.includes('API') ? (
                  <Code2 className="h-5 w-5 text-brand-400 flex-none mt-0.5" />
                ) : (
                  <Lock className="h-5 w-5 text-brand-400 flex-none mt-0.5" />
                )}
                <h3 className="text-base font-semibold text-white">{item.title}</h3>
              </div>
              <p className="text-sm text-ink-300 leading-relaxed mb-4">{item.desc}</p>
              <div className="flex flex-wrap gap-2">
                {item.badges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-md border border-ink-700/60 bg-ink-800 px-2.5 py-1 text-[11px] font-medium text-ink-200"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
