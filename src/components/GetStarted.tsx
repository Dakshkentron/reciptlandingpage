import { Check, FileCheck2, Rocket } from 'lucide-react';
import { catalogCounts, popularIntegrations } from '@/data/integrations';
import IntegrationLogo from '@/components/IntegrationLogo';
import ReceiptMark from '@/components/ReceiptMark';

/** The nine connectors shown in the stack tile — enough to be recognisable, not a wall. */
const stackTiles = popularIntegrations.slice(0, 9);

/** Receipt speaking in a thread: the logomark, the name, and the APP tag. */
function AgentLine({ time }: { time: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-brand-500 text-white">
        <ReceiptMark className="h-4 w-4" paperClassName="text-brand-500" />
      </div>
      <span className="text-[13px] font-bold text-ink-950">Receipt</span>
      <span className="rounded bg-ink-100 px-1 py-px text-[9px] font-bold uppercase tracking-wide text-ink-500">
        App
      </span>
      <span className="text-[11px] text-ink-400">{time}</span>
    </div>
  );
}

function ConnectVisual() {
  return (
    <div className="relative">
      <div className="grid grid-cols-3 gap-3">
        {stackTiles.map((name) => (
          <div
            key={name}
            className="flex aspect-square items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm"
          >
            <IntegrationLogo name={name} size="md" plain className="!h-9 !w-9 !rounded-lg bg-white" />
          </div>
        ))}
      </div>

      <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center">
        <span className="rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-ink-900 shadow-xl">
          {catalogCounts.live} live now · {catalogCounts.total.toLocaleString()} in the catalog
        </span>
      </div>
    </div>
  );
}

function AskVisual() {
  return (
    <div className="space-y-3">
      <div className="rounded-2xl bg-white p-4 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-ink-200 text-[11px] font-bold text-ink-700">
            MP
          </div>
          <span className="text-[13px] font-bold text-ink-950">Maya Patel</span>
          <span className="text-[11px] text-ink-400">11:32 AM</span>
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-700">
          <span className="rounded bg-brand-50 px-1 font-semibold text-brand-700">@Receipt</span> check
          this week&rsquo;s Stripe revenue against HubSpot and flag anything off before the board call.
        </p>
        <div className="mt-3 flex gap-1.5">
          <span className="rounded-full border border-ink-100 bg-ink-50 px-2 py-0.5 text-[11px] font-medium text-ink-600">
            ⏳ 1
          </span>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-lg">
        <AgentLine time="11:33 AM" />
        <p className="mt-2 text-[13px] leading-relaxed text-ink-700">
          On it. Cross-checking Stripe against HubSpot and flagging anything that doesn&rsquo;t line up
          before your board call.
        </p>
        <div className="mt-3 flex gap-1.5">
          <span className="rounded-full border border-ink-100 bg-ink-50 px-2 py-0.5 text-[11px] font-medium text-ink-600">
            ✅ 2
          </span>
          <span className="rounded-full border border-ink-100 bg-ink-50 px-2 py-0.5 text-[11px] font-medium text-ink-600">
            🚀 1
          </span>
        </div>
      </div>
    </div>
  );
}

function ReviewVisual() {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-lg">
      <AgentLine time="9:12 AM" />
      <p className="mt-2 text-[13px] font-semibold text-ink-950">Revenue check</p>
      <p className="mt-1 text-[13px] leading-relaxed text-ink-700">
        $84,210 (+6.4% WoW). 3 deals didn&rsquo;t match HubSpot — fixed 2, one needs your call.
      </p>

      <div className="mt-3 flex items-center gap-3 rounded-xl border border-ink-100 bg-ink-50/70 p-3">
        <div className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-brand-500 text-white">
          <FileCheck2 className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="truncate font-mono text-[12px] font-semibold text-ink-900">rcp_8c41…a72f</div>
          <div className="text-[11px] text-ink-400">14 calls · chained · replayable</div>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          className="rounded-lg bg-brand-600 px-3 py-1.5 text-[12px] font-semibold text-white"
        >
          Approve
        </button>
        <button
          type="button"
          className="rounded-lg border border-ink-200 px-3 py-1.5 text-[12px] font-semibold text-ink-700"
        >
          Reject
        </button>
      </div>
    </div>
  );
}

const steps = [
  {
    title: 'Authorize what it may touch',
    body: `${catalogCounts.live} connectors are live today, with ${catalogCounts.total.toLocaleString()} in the catalog behind them. Each one arrives with an explicit list of actions, and you decide which of them Receipt is allowed to use. Nothing to host, nothing to keep patched.`,
    visual: <ConnectVisual />,
  },
  {
    title: 'Say what you want done',
    body: 'Post the objective in a Slack thread, in ordinary sentences. There is no builder to open, no trigger to wire up, and no prompt format to learn — the sentence you would send a colleague is the input.',
    visual: <AskVisual />,
  },
  {
    title: 'Read the result and its record',
    body: 'The job runs in an isolated sandbox and comes back with what changed and the sealed chain behind it. What lands on you is a finished piece of work and the evidence for it, rather than the work itself.',
    visual: <ReviewVisual />,
  },
];

/** Three cards, three steps — the shortest honest version of what using Receipt looks like. */
export default function GetStarted() {
  return (
    <section id="get-started" className="section bg-ink-50/60">
      <div className="section-container">
        <div className="section-intro">
          <div className="eyebrow bg-brand-50 text-brand-700">
            <Rocket className="h-3.5 w-3.5" />
            In three steps
          </div>
          <h2 className="section-title text-ink-950">
            Connect it once. Then just ask.
          </h2>
          <p className="section-lead text-ink-500">
            No implementation project, no workflow builder, no automation consultant. Receipt is working
            the same afternoon you connect it.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="flex flex-col overflow-hidden rounded-3xl border border-ink-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink-950/5"
            >
              <div className="relative overflow-hidden bg-gradient-to-br from-ink-900 via-ink-950 to-brand-900 p-6">
                <div className="absolute inset-0 bg-grid opacity-20" />
                <div className="relative">
                  <span className="mb-5 inline-flex h-8 items-center rounded-full bg-white/15 px-3 font-mono text-xs font-semibold text-white backdrop-blur-sm">
                    0{i + 1}
                  </span>
                  <div className="min-h-[15rem]">{step.visual}</div>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6 lg:p-7">
                <h3 className="text-xl font-bold tracking-tight text-ink-950">{step.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-500">{step.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {['Sandbox first, audit everything', 'Credentials never stored in Receipt', 'Every call replayable'].map(
            (item) => (
              <div key={item} className="flex items-center gap-2 text-sm font-medium text-ink-600">
                <Check className="h-4 w-4 text-brand-500" strokeWidth={3} />
                {item}
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
