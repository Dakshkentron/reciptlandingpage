import { useEffect, useRef, useState } from 'react';
import { Check, CheckCircle2, Cpu, Globe, RotateCcw } from 'lucide-react';
import IntegrationLogo from '@/components/IntegrationLogo';
import ReceiptMark from '@/components/ReceiptMark';

const PROMPT = '@Kentron AI - Get me list of running EC2 instances';

/**
 * Demo values only. The account is AWS's documentation account, and the public IPs
 * come from the RFC 5737 documentation range — nothing here points at a real box.
 */
const query = { at: '2026-08-03 UTC', account: '123456789012' };

const instances = [
  {
    name: 'receipt-factory-lite-single-host',
    id: 'i-0a1b2c3d4e5f60718',
    type: 't3a.xlarge',
    region: 'us-east-1',
    privateIp: '10.0.3.109',
    publicIp: '203.0.113.24',
    launched: '2026-08-02 17:41:29 UTC',
  },
  {
    name: 'receipt-production',
    id: 'i-0b2c3d4e5f6071829',
    type: 't3.xlarge',
    region: 'us-east-1',
    privateIp: '172.31.45.96',
    publicIp: '203.0.113.91',
    launched: '2026-08-03 18:24:51 UTC',
  },
  {
    name: 'receipt-factory-opensandbox',
    id: 'i-0c3d4e5f60718293a',
    type: 't3a.large',
    region: 'us-east-1',
    privateIp: '10.0.2.131',
    publicIp: '203.0.113.47',
    launched: '2026-08-03 05:30:07 UTC',
  },
];

/**
 * Steps the thread moves through, as offsets from the moment the question is posted.
 * The last one lands at 2.4s — the run has to finish on screen in the time it would
 * finish in Slack, not crawl.
 */
const BEATS = [
  { step: 2, at: 800 }, // Kentron AI answers, result card opens
  { step: 3, at: 1120 }, // instance 1
  { step: 4, at: 1440 }, // instance 2
  { step: 5, at: 1760 }, // instance 3
  { step: 6, at: 2080 }, // state summary
  { step: 7, at: 2400 }, // receipt link
];

const TYPE_MS = 24;
const FINAL_STEP = 7;
/** Wall-clock length of the run, in seconds — the timer stops here and never past it. */
const RUN_SECONDS = BEATS[BEATS.length - 1].at / 1000;

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="text-[11px] font-medium text-ink-400">{label}</div>
      <div className="mt-0.5 truncate font-mono text-[12.5px] text-ink-800">{value}</div>
    </div>
  );
}

function InstanceCard({ instance }: { instance: (typeof instances)[number] }) {
  return (
    <div className="animate-fade-up rounded-xl border border-ink-100 bg-white p-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex w-full flex-none flex-col items-center justify-center gap-1.5 rounded-lg border border-brand-100 bg-brand-50/60 px-4 py-3 sm:w-28">
          <Cpu className="h-6 w-6 text-brand-600" />
          <span className="font-mono text-[11px] font-semibold text-brand-700">{instance.type}</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="truncate text-[15px] font-bold text-ink-950">{instance.name}</div>
              <div className="mt-0.5 truncate font-mono text-[12.5px] text-ink-500">{instance.id}</div>
            </div>
            <span className="inline-flex flex-none items-center gap-1 rounded-md bg-sky-50 px-2 py-1 text-[11px] font-semibold text-sky-700">
              <Globe className="h-3 w-3" />
              {instance.region}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-ink-100 pt-3 sm:grid-cols-3">
            <Row label="Private IP" value={instance.privateIp} />
            <Row label="Public IP" value={instance.publicIp} />
            <Row label="Launch time" value={instance.launched} />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * The Slack thread, played rather than screenshotted: the question types itself in,
 * Kentron AI answers, and the result card fills in row by row with a live timer on it.
 * It runs once when it scrolls into view — a loop next to body copy is a distraction —
 * and can be replayed from the button in the thread header.
 */
export default function SlackThreadDemo() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [step, setStep] = useState(-1); // -1 = waiting to be seen
  const [typed, setTyped] = useState('');
  const [elapsed, setElapsed] = useState(0);
  // Bumping this restarts the run. The whole timeline hangs off it rather than off
  // `step`, so advancing a step can never cancel the timers for the steps after it.
  const [runId, setRunId] = useState(0);

  const start = () => {
    setTyped('');
    setElapsed(0);
    setStep(0);
    setRunId((id) => id + 1);
  };

  // Play once it is actually on screen, so nobody scrolls past a finished animation.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStep(FINAL_STEP);
      setTyped(PROMPT);
      setElapsed(RUN_SECONDS);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start();
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // One timeline per run: the question types itself in, then every later beat fires
  // on its own offset from the moment it is posted.
  useEffect(() => {
    if (runId === 0) return;

    // The clock starts when the question is posted, not when typing begins.
    const postedAt = performance.now() + PROMPT.length * TYPE_MS;
    let typedCount = 0;
    const typer = window.setInterval(() => {
      typedCount += 1;
      setTyped(PROMPT.slice(0, typedCount));
      if (typedCount >= PROMPT.length) {
        window.clearInterval(typer);
        setStep(1);
      }
    }, TYPE_MS);

    const typingEnds = PROMPT.length * TYPE_MS;
    const timers = BEATS.map((beat) =>
      window.setTimeout(() => setStep(beat.step), typingEnds + beat.at)
    );

    // Count from a timestamp instead of accumulating, so a throttled background tab
    // can't drift, and clamp at the run length so the counter can never run away.
    const ticker = window.setInterval(() => {
      const since = (performance.now() - postedAt) / 1000;
      setElapsed(Math.min(Math.max(since, 0), RUN_SECONDS));
    }, 80);

    const stop = window.setTimeout(() => {
      window.clearInterval(ticker);
      setElapsed(RUN_SECONDS);
    }, typingEnds + BEATS[BEATS.length - 1].at);

    return () => {
      window.clearInterval(typer);
      window.clearInterval(ticker);
      window.clearTimeout(stop);
      timers.forEach(window.clearTimeout);
    };
  }, [runId]);

  const done = step >= FINAL_STEP;

  return (
    <div ref={rootRef} className="rounded-[1.75rem] bg-white p-4 shadow-2xl shadow-ink-950/40 sm:p-6 lg:p-8">
      {/* thread header */}
      <div className="flex items-center justify-between gap-3 border-b border-ink-100 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="text-lg font-bold tracking-tight text-ink-950">Thread</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-100 px-2.5 py-1 text-[11px] font-semibold text-ink-600">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            Slack
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold tabular-nums ${
              done ? 'bg-brand-50 text-brand-700' : 'bg-ink-100 text-ink-500'
            }`}
          >
            {done ? `answered in ${elapsed.toFixed(1)}s` : `${elapsed.toFixed(1)}s`}
          </span>
          <button
            type="button"
            onClick={start}
            aria-label="Replay this thread"
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* the question */}
      <div className="flex gap-3 pt-5">
        <div className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-ink-800 text-[12px] font-bold text-white">
          SA
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-[14px] font-bold text-ink-950">Satish</span>
            <span className="text-[11px] text-ink-400">Monday at 11:57 AM</span>
          </div>
          <p className="mt-1 text-[15px] leading-relaxed text-ink-800">
            <span className="rounded bg-sky-50 px-1 font-semibold text-sky-700">@Kentron AI</span>
            {typed.slice('@Kentron AI'.length)}
            {step === 0 && <span className="ml-0.5 inline-block h-4 w-0.5 animate-blink bg-ink-800 align-middle" />}
          </p>
          {step >= 1 && (
            <div className="mt-2 flex animate-fade-in gap-1.5">
              <span className="rounded-full border border-ink-100 bg-ink-50 px-2 py-0.5 text-[11px] font-medium text-ink-600">
                👀 1
              </span>
            </div>
          )}
        </div>
      </div>

      {step >= 1 && (
        <div className="mt-5 flex animate-fade-in items-center gap-3">
          <span className="flex-none text-[12px] font-semibold text-ink-400">1 reply</span>
          <span className="h-px flex-1 bg-ink-100" />
        </div>
      )}

      {/* the answer */}
      {step >= 1 && (
        <div className="flex animate-fade-up gap-3 pt-5">
          <div className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-ink-950 text-white">
            <ReceiptMark className="h-5 w-5" paperClassName="text-ink-950" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-[14px] font-bold text-ink-950">Kentron AI</span>
              <span className="rounded bg-ink-100 px-1 py-px text-[9px] font-bold uppercase tracking-wide text-ink-500">
                App
              </span>
              <span className="text-[11px] text-ink-400">Monday at 11:57 AM</span>
            </div>

            {step === 1 ? (
              <div className="mt-2 flex items-center gap-2 text-[14px] text-ink-400">
                <span className="flex gap-1">
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-ink-300"
                      style={{ animationDelay: `${d * 160}ms` }}
                    />
                  ))}
                </span>
                Querying AWS in a sandbox…
              </div>
            ) : (
              <p className="mt-1 flex items-center gap-2 text-[15px] font-medium text-ink-800">
                <CheckCircle2 className="h-4 w-4 text-brand-600" />
                <span className="rounded bg-accent-50 px-1 font-semibold text-accent-700">@Satish</span>
                Done
              </p>
            )}

            {/* the result card */}
            {step >= 2 && (
              <div className="mt-4 animate-fade-up overflow-hidden rounded-2xl border border-ink-100 border-l-4 border-l-brand-500 bg-ink-50/40">
                <div className="flex items-start justify-between gap-4 p-4 sm:p-5">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 flex-none rounded-full bg-brand-500" />
                      <h3 className="text-[17px] font-bold tracking-tight text-ink-950">
                        Running EC2 Instances
                      </h3>
                    </div>
                    <p className="mt-1 text-[12.5px] text-ink-400">
                      Queried {query.at} &middot; Account: {query.account}
                    </p>
                  </div>
                  <IntegrationLogo name="AWS" size="md" />
                </div>

                <div className="space-y-3 px-4 pb-4 sm:px-5 sm:pb-5">
                  {instances.map((instance, i) =>
                    step >= 3 + i ? <InstanceCard key={instance.id} instance={instance} /> : null
                  )}

                  {step >= 6 && (
                    <div className="flex animate-fade-up items-center gap-2 rounded-xl border border-brand-100 bg-brand-50/70 px-4 py-3">
                      <Check className="h-4 w-4 flex-none text-brand-600" strokeWidth={3} />
                      <span className="text-[13px] text-ink-700">
                        All three instances reported state{' '}
                        <span className="rounded bg-white px-1.5 py-0.5 font-mono text-[12px] font-semibold text-brand-700">
                          running
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {step >= FINAL_STEP && (
              <div className="mt-3 flex animate-fade-in flex-wrap items-center gap-3">
                <a
                  href="#/security"
                  className="text-[14px] font-semibold text-sky-700 underline decoration-sky-300 underline-offset-4 hover:text-sky-800"
                >
                  View Kentron AI
                </a>
                <span className="rounded-full border border-ink-100 bg-ink-50 px-2 py-0.5 text-[11px] font-medium text-ink-600">
                  ✅ 1
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
