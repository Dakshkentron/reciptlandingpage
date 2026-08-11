import { Sparkles, Layers, ArrowRight, Filter } from 'lucide-react';

export function NotebookMockup() {
  return (
    <div className="glow-ring overflow-hidden rounded-2xl bg-ink-900 p-3">
      <div className="flex items-center gap-2 px-2 py-1.5 mb-2">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-ink-600" />
          <div className="h-2.5 w-2.5 rounded-full bg-ink-600" />
          <div className="h-2.5 w-2.5 rounded-full bg-ink-600" />
        </div>
        <div className="flex-1 text-center">
          <span className="text-xs text-ink-300 font-mono">Google Analytics Summary</span>
        </div>
        <div className="flex items-center gap-1 rounded-md bg-brand-500/15 px-2 py-0.5 text-[10px] font-semibold text-brand-300">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
          Slack
        </div>
      </div>
      <img
        src="/notebook-screenshot.png"
        alt="Receipt answering a data question in a Slack thread"
        className="rounded-lg border border-ink-700/60"
      />
    </div>
  );
}

export function ThreadsMockup() {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-4 shadow-xl shadow-ink-950/5">
      <div className="space-y-3">
        <div className="flex justify-end">
          <div className="max-w-[80%] rounded-xl rounded-br-sm bg-sky-500 px-3.5 py-2.5 text-sm text-white">
            What was our churn rate last month by plan tier?
          </div>
        </div>
        <div className="flex justify-start">
          <div className="max-w-[85%] rounded-xl rounded-bl-sm bg-ink-50 border border-ink-100 px-3.5 py-2.5 text-sm text-ink-800">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Sparkles className="h-3 w-3 text-brand-500" />
              <span className="text-xs font-semibold text-ink-500">Based on 2 governed queries</span>
            </div>
            Here's churn by plan tier for last month:
            <div className="mt-2.5 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-ink-600">Enterprise</span>
                <span className="font-semibold text-ink-900">1.2%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-ink-600">Pro</span>
                <span className="font-semibold text-ink-900">3.8%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-ink-600">Starter</span>
                <span className="font-semibold text-ink-900">7.1%</span>
              </div>
            </div>
            <span className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-brand-600">
              Open in notebook <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="max-w-[70%] rounded-xl rounded-br-sm bg-sky-500 px-3.5 py-2.5 text-sm text-white">
            Drill into the Starter tier — which segment is churning most?
          </div>
        </div>
      </div>
    </div>
  );
}

export function ContextStudioMockup() {
  const metrics = [
    { name: 'revenue', def: 'sum(order_total) where status = paid', status: 'verified' },
    { name: 'churn_rate', def: 'lost_accounts / total_accounts', status: 'verified' },
    { name: 'arr', def: 'mrr * 12 + prepaid_addons', status: 'draft' },
  ];

  return (
    <div className="glow-ring rounded-2xl bg-ink-900 p-3">
      <div className="flex items-center gap-2 px-2 py-1.5 mb-2">
        <Layers className="h-3.5 w-3.5 text-brand-400" />
        <span className="text-xs text-ink-300 font-mono">context.yaml</span>
      </div>
      <div className="space-y-2">
        {metrics.map((m) => (
          <div key={m.name} className="rounded-lg border border-ink-700/60 bg-ink-850 p-3">
            <div className="flex items-center justify-between mb-1">
              <code className="text-xs font-semibold text-brand-300 font-mono">{m.name}</code>
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                m.status === 'verified'
                  ? 'bg-brand-500/15 text-brand-300'
                  : 'bg-accent-500/15 text-accent-300'
              }`}>
                {m.status}
              </span>
            </div>
            <code className="text-[11px] text-ink-200 font-mono">{m.def}</code>
          </div>
        ))}
        <div className="rounded-lg border border-dashed border-ink-600 bg-ink-850/50 p-3 text-center">
          <span className="text-xs text-ink-400">+ Add metric definition</span>
        </div>
      </div>
    </div>
  );
}

export function DataAppMockup() {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-4 shadow-xl shadow-ink-950/5">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex gap-1">
          <div className="h-2 w-2 rounded-full bg-ink-200" />
          <div className="h-2 w-2 rounded-full bg-ink-200" />
          <div className="h-2 w-2 rounded-full bg-ink-200" />
        </div>
        <span className="text-xs font-medium text-ink-500">NexaCorp Revenue Overview</span>
        <div className="ml-auto flex gap-1.5">
          <span className="text-[10px] font-semibold text-ink-400 px-2 py-1 rounded-md border border-ink-100">Edit</span>
          <span className="text-[10px] font-semibold text-white px-2 py-1 rounded-md bg-ink-900">Share</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[['$175.7M', 'Total Q3'], ['Mid-Rim', 'Top region'], ['Commercial', 'Top sector']].map(([v, l]) => (
          <div key={l} className="rounded-lg border border-ink-100 bg-ink-50 p-2.5">
            <div className="text-[10px] text-ink-400">{l}</div>
            <div className="text-sm font-bold text-ink-900">{v}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mb-3">
        {['Product Line', 'Region', 'Quarter'].map((f) => (
          <div key={f} className="flex items-center gap-1 rounded-md border border-ink-100 bg-white px-2 py-1 text-[10px] text-ink-500">
            <Filter className="h-2.5 w-2.5" />
            {f}
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-ink-100 p-3">
        <div className="text-[10px] text-ink-400 mb-2">Revenue by Product Line Over Time</div>
        <div className="flex items-end gap-2 h-20">
          {[
            [20, 25, 30],
            [15, 18, 22],
            [12, 14, 16],
            [10, 12, 14],
            [8, 10, 12],
            [6, 8, 10],
          ].map((group, i) => (
            <div key={i} className="flex h-full flex-1 items-end gap-0.5">
              {group.map((h, j) => (
                <div
                  key={j}
                  className="flex-1 rounded-t origin-bottom animate-grow-bar"
                  style={{
                    height: `${h * 2.5}%`,
                    animationDelay: `${(i * 3 + j) * 50}ms`,
                    background: j === 0 ? '#38c082' : j === 1 ? '#1d63f0' : '#f57e16',
                  }}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-1.5 text-[9px] text-ink-300">
          <span>Q1</span><span>Q2</span><span>Q3</span>
        </div>
      </div>
    </div>
  );
}
