import { useState } from 'react';
import {
  Check, FileCheck2, Hash, Play, ScrollText, ShieldCheck, Terminal, UserCheck,
} from 'lucide-react';

/**
 * The receipt chain for the run shown in the Slack thread above.
 *
 * Every entry is one typed, immutable event — the same stream families the runtime
 * writes: objectives, jobs, agent actions, checks, reviews, and runtime control.
 * Hashes are illustrative, but the shape of the record is the product.
 */
const entries = [
  {
    event: 'objective.accepted',
    icon: ScrollText,
    at: '11:57:02.114',
    summary: 'Objective accepted from Slack',
    detail: [
      ['source', '#platform · thread 1732…c41'],
      ['objective', 'get me a list of running EC2 instances'],
      ['requested_by', 'satish'],
    ],
    note: 'The objective is the first receipt in the chain. Everything after it links back to this entry.',
  },
  {
    event: 'worker.leased',
    icon: ShieldCheck,
    at: '11:57:02.389',
    summary: 'Worker leased to the run',
    detail: [
      ['lane', 'computer + connected tools'],
      ['lease_ttl', '900s · heartbeat every 30s'],
      ['policy', 'read actions auto · writes gated'],
    ],
    note: 'The lease is itself a receipt. Control decisions are events, not side effects.',
  },
  {
    event: 'action.executed',
    icon: Terminal,
    at: '11:57:03.902',
    summary: 'aws.ec2.describe_instances',
    detail: [
      ['connector', 'AWS · scoped action'],
      ['request', 'region=us-east-1 · filter=state:running'],
      ['response', '3 instances · raw payload attached'],
      ['exit_code', '0'],
    ],
    note: 'Scoped actions are the unit policy authorizes. The raw response is attached as evidence, not summarized away.',
  },
  {
    event: 'check.passed',
    icon: Check,
    at: '11:57:04.271',
    summary: 'instance.state == running',
    detail: [
      ['assertion', 'all returned instances report state running'],
      ['result', 'passed · 3/3'],
    ],
    note: 'A failing check ends the run at the check receipt instead of letting it drift into more tool calls.',
  },
  {
    event: 'review.recorded',
    icon: UserCheck,
    at: '11:57:04.418',
    summary: 'Read-only run · no approval required',
    detail: [
      ['classification', 'read'],
      ['state_changed', 'none'],
      ['gate', 'not required for read actions'],
    ],
    note: 'Anything that would change state in a connected system stops here for a human instead.',
  },
  {
    event: 'receipt.issued',
    icon: FileCheck2,
    at: '11:57:04.503',
    summary: 'Chain sealed and posted back to the thread',
    detail: [
      ['receipt', 'rcp_8c41…a72f'],
      ['entries', '6 · previous-hash linked'],
      ['replayable', 'true'],
    ],
    note: 'The sealed chain is what "Done" means. Replay it any time to reconstruct the run.',
  },
];

/** Illustrative hash pair for the selected entry, stable per index. */
function hashes(i: number) {
  const stamp = (n: number) => (n * 2654435761 % 0xfffffff).toString(16).padStart(7, '0');
  return { prev: i === 0 ? '0'.repeat(7) : stamp(i), self: stamp(i + 1) };
}

export default function ReceiptChain() {
  const [active, setActive] = useState(2);
  const entry = entries[active];
  const { prev, self } = hashes(active);

  return (
    <section className="section bg-ink-50" id="receipt-chain">
      <div className="section-container">
        <div className="section-intro">
          <div className="eyebrow bg-brand-50 text-brand-700">
            <Hash className="h-3.5 w-3.5" />
            The receipt chain
          </div>
          <h2 className="section-title text-ink-950">
            The same run, as the record it leaves behind
          </h2>
          <p className="section-lead text-ink-500">
            Not a log describing the work — the work itself, written down before the run advanced. Pick any
            step to read what it carries.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-2xl shadow-ink-950/5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 bg-ink-50 px-5 py-3">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-ink-200" />
                <div className="h-2.5 w-2.5 rounded-full bg-ink-200" />
                <div className="h-2.5 w-2.5 rounded-full bg-ink-200" />
              </div>
              <span className="font-mono text-sm font-semibold text-ink-900">rcp_8c41…a72f</span>
              <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-semibold text-brand-700">
                Sealed
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden text-xs text-ink-400 sm:block">6 entries · 2.4s</span>
              <span className="flex items-center gap-1.5 rounded-lg bg-ink-950 px-3 py-1.5 text-xs font-semibold text-white">
                <Play className="h-3.5 w-3.5" />
                Replay
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,22rem)_1fr]">
            {/* the chain */}
            <ol className="border-b border-ink-100 p-4 lg:border-b-0 lg:border-r">
              {entries.map((item, i) => {
                const isActive = i === active;
                return (
                  <li key={item.event} className="relative">
                    {i < entries.length - 1 && (
                      <span
                        aria-hidden
                        className="absolute left-[27px] top-9 h-[calc(100%-1.25rem)] w-px bg-ink-100"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      aria-current={isActive ? 'step' : undefined}
                      className={`relative flex w-full items-start gap-3 rounded-xl p-3 text-left transition-colors ${
                        isActive ? 'bg-brand-50/70' : 'hover:bg-ink-50'
                      }`}
                    >
                      <span
                        className={`flex h-7 w-7 flex-none items-center justify-center rounded-lg transition-colors ${
                          isActive ? 'bg-brand-500 text-white' : 'bg-ink-100 text-ink-500'
                        }`}
                      >
                        <item.icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block truncate font-mono text-[12.5px] font-semibold ${
                            isActive ? 'text-brand-700' : 'text-ink-800'
                          }`}
                        >
                          {item.event}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-ink-400">{item.summary}</span>
                      </span>
                      <span className="flex-none font-mono text-[10px] text-ink-300">{item.at.slice(0, 8)}</span>
                    </button>
                  </li>
                );
              })}
            </ol>

            {/* the entry */}
            <div className="p-5 lg:p-7">
              <div className="flex flex-wrap items-center gap-2">
                <code className="font-mono text-sm font-bold text-ink-950">{entry.event}</code>
                <span className="rounded-full border border-ink-100 bg-ink-50 px-2 py-0.5 font-mono text-[10px] text-ink-500">
                  entry {active + 1} of {entries.length}
                </span>
                <span className="ml-auto font-mono text-[11px] text-ink-400">{entry.at}</span>
              </div>

              <p className="mt-1 text-sm text-ink-500">{entry.summary}</p>

              <dl className="mt-5 divide-y divide-ink-100 rounded-xl border border-ink-100 bg-ink-50/50">
                {entry.detail.map(([key, value]) => (
                  <div key={key} className="flex flex-col gap-1 p-3.5 sm:flex-row sm:items-baseline sm:gap-4">
                    <dt className="w-40 flex-none font-mono text-[11.5px] text-ink-400">{key}</dt>
                    <dd className="min-w-0 break-words font-mono text-[12.5px] text-ink-800">{value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-ink-100 p-3.5">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                    Previous hash
                  </div>
                  <div className="mt-1 truncate font-mono text-[12px] text-ink-600">{prev}</div>
                </div>
                <div className="rounded-xl border border-brand-100 bg-brand-50/50 p-3.5">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-brand-700">
                    This entry
                  </div>
                  <div className="mt-1 truncate font-mono text-[12px] text-brand-800">{self}</div>
                </div>
              </div>

              <p className="mt-5 border-t border-ink-100 pt-4 text-sm leading-relaxed text-ink-500">
                {entry.note}
              </p>
            </div>
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-ink-400">
          Illustrative chain for the run above. Hashes are shortened for display — in a real workspace every
          entry carries the full hash of the entry before it, so altering one breaks every entry after it.
        </p>
      </div>
    </section>
  );
}
