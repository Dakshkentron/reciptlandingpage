import { Check, Clock, FileCheck2, Link2, Play, Repeat, ShieldCheck, Terminal } from 'lucide-react';
import ReceiptMark from '@/components/ReceiptMark';

/** Chrome shared by the dark panels, so the four steps read as one product. */
function Panel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="glow-ring overflow-hidden rounded-2xl bg-ink-900 p-3">
      <div className="mb-2 flex items-center gap-2 px-2 py-1.5">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-ink-600" />
          <div className="h-2.5 w-2.5 rounded-full bg-ink-600" />
          <div className="h-2.5 w-2.5 rounded-full bg-ink-600" />
        </div>
        <div className="flex-1 text-center">
          <span className="font-mono text-xs text-ink-300">{label}</span>
        </div>
      </div>
      {children}
    </div>
  );
}

/** Step 1 — the objective, posted where the work already happens. */
export function ObjectiveMockup() {
  return (
    <Panel label="#platform · thread">
      <div className="space-y-2 rounded-lg border border-ink-700/60 bg-ink-850 p-4">
        <div className="rounded-xl bg-white p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink-800 text-[11px] font-bold text-white">
              SA
            </div>
            <span className="text-[13px] font-bold text-ink-950">Satish</span>
            <span className="text-[11px] text-ink-400">11:57 AM</span>
          </div>
          <p className="mt-2 text-[13.5px] leading-relaxed text-ink-800">
            <span className="rounded bg-sky-50 px-1 font-semibold text-sky-700">@Receipt</span> get me a
            list of running EC2 instances
          </p>
        </div>

        <div className="rounded-xl bg-white p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink-950 text-white">
              <ReceiptMark className="h-4 w-4" paperClassName="text-ink-950" />
            </div>
            <span className="text-[13px] font-bold text-ink-950">Receipt</span>
            <span className="rounded bg-ink-100 px-1 py-px text-[9px] font-bold uppercase tracking-wide text-ink-500">
              App
            </span>
          </div>
          <p className="mt-2 text-[13.5px] leading-relaxed text-ink-700">
            Accepted. Starting a background run.
          </p>
          <div className="mt-3 flex items-center gap-2 border-t border-ink-100 pt-3 text-[11px] text-ink-400">
            <Clock className="h-3.5 w-3.5" />
            You can close the tab — the run keeps going.
          </div>
        </div>
      </div>
    </Panel>
  );
}

/** Step 2 — a real run against a connected system, exactly as it came back. */
export function OperateMockup() {
  return (
    <Panel label="Google Analytics · scoped action">
      <img
        src="/notebook-screenshot.png"
        alt="Receipt returning a Google Analytics summary in a Slack thread, with sessions and page views for the previous week"
        className="rounded-lg border border-ink-700/60"
      />
    </Panel>
  );
}

const chain = [
  { event: 'objective.accepted', detail: 'get me a list of running EC2 instances', icon: Check },
  { event: 'worker.leased', detail: 'lane: computer + connected tools', icon: ShieldCheck },
  { event: 'action.executed', detail: 'aws.ec2.describe_instances → 3 rows', icon: Terminal },
  { event: 'check.passed', detail: 'all instances reported state running', icon: Check },
  { event: 'receipt.issued', detail: 'chain sealed · posted to #platform', icon: FileCheck2 },
];

/** Step 3 — the chain itself, one typed event per material step. */
export function ReceiptChainMockup() {
  return (
    <Panel label="receipt chain">
      <div className="space-y-1.5">
        {chain.map((entry, i) => (
          <div key={entry.event} className="relative rounded-lg border border-ink-700/60 bg-ink-850 p-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 flex-none items-center justify-center rounded-md bg-brand-500/15 text-brand-300">
                <entry.icon className="h-3.5 w-3.5" />
              </span>
              <code className="font-mono text-xs font-semibold text-brand-300">{entry.event}</code>
              <span className="ml-auto font-mono text-[10px] text-ink-400">#{i + 1}</span>
            </div>
            <p className="mt-1.5 pl-8.5 font-mono text-[11px] leading-relaxed text-ink-200">
              {entry.detail}
            </p>
            {i < chain.length - 1 && (
              <span className="absolute -bottom-1.5 left-6 z-10 flex items-center gap-1 text-[9px] text-ink-500">
                <Link2 className="h-2.5 w-2.5" />
              </span>
            )}
          </div>
        ))}
        <div className="rounded-lg border border-dashed border-ink-600 bg-ink-850/50 p-2.5 text-center">
          <span className="font-mono text-[10px] text-ink-400">
            each entry carries the hash of the one before it
          </span>
        </div>
      </div>
    </Panel>
  );
}

/** Step 4 — replay, and what the run leaves behind for the next one. */
export function ReplayMockup() {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-xl shadow-ink-950/5">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-ink-950">Run rcp_8c41 · replay</div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700">
          <Play className="h-3 w-3" />
          Verified
        </span>
      </div>

      <div className="mt-4 space-y-2.5">
        {[
          { label: 'Model interaction', value: 'reconstructed' },
          { label: 'Action selection', value: 'reconstructed' },
          { label: 'Policy decision', value: 'lane allowed · action in scope' },
          { label: 'Queue movement', value: 'lease → heartbeat → seal' },
        ].map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 border-b border-ink-100 pb-2.5 last:border-0">
            <span className="text-xs text-ink-500">{row.label}</span>
            <span className="font-mono text-[11px] font-semibold text-ink-800">{row.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-brand-100 bg-brand-50/60 p-3.5">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-brand-700">
          <Repeat className="h-3.5 w-3.5" />
          Promoted into memory
        </div>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-700">
          Check <code className="font-mono text-[11.5px]">instance.state == running</code> added to the
          runbook — the next run starts with it in place.
        </p>
      </div>
    </div>
  );
}
