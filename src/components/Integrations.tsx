import { Plug, Database, GitBranch, Workflow, MessageSquare, Code2, Lock, Cloud, Briefcase } from 'lucide-react';
import { integrations, integrationHighlights } from '@/data/content';

function IntegrationIcon({ name }: { name: string }) {
  const iconMap: Record<string, React.ReactNode> = {
    aws: <Cloud className="h-5 w-5" />,
    azure: <Cloud className="h-5 w-5" />,
    gcp: <Cloud className="h-5 w-5" />,
    snowflake: <Database className="h-5 w-5" />,
    bigquery: <Database className="h-5 w-5" />,
    dbt: <Workflow className="h-5 w-5" />,
    github: <GitBranch className="h-5 w-5" />,
    gitlab: <GitBranch className="h-5 w-5" />,
    airflow: <Workflow className="h-5 w-5" />,
    slack: <MessageSquare className="h-5 w-5" />,
    notion: <MessageSquare className="h-5 w-5" />,
    jira: <Briefcase className="h-5 w-5" />,
    hubspot: <Briefcase className="h-5 w-5" />,
    salesforce: <Briefcase className="h-5 w-5" />,
    api: <Code2 className="h-5 w-5" />,
  };

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-850 text-ink-200 border border-ink-700/60">
      {iconMap[name] ?? <Plug className="h-5 w-5" />}
    </div>
  );
}

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
            Out-of-the-box connections and flexible APIs make setup a breeze.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-12">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className="group flex items-center gap-3 rounded-xl border border-ink-700/60 bg-ink-850 p-4 transition-all duration-200 hover:border-ink-600 hover:bg-ink-800"
            >
              <IntegrationIcon name={integration.logo} />
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white leading-tight">{integration.name}</div>
                <div className="text-[11px] text-ink-400">{integration.category}</div>
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
