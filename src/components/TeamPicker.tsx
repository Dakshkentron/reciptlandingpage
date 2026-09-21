import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { teams, teamUseCaseHref, type Team } from '@/data/useCases';
import { getIcon } from '@/components/icons';
import ReceiptMark from '@/components/ReceiptMark';

const ROTATE_MS = 7000;

function StatusBadge({ status }: { status: Team['status'] }) {
  const label = status === 'live' ? 'Live' : status === 'beta' ? 'Beta' : 'Soon';
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
        status === 'live' ? 'bg-white/25 text-white' : 'bg-white/10 text-white/60'
      }`}
    >
      {label}
    </span>
  );
}

/** Slack-style transcript — the right half of the panel. */
function ThreadCard({ team }: { team: Team }) {
  return (
    <div
      key={team.slug}
      className="animate-fade-in rounded-[1.75rem] bg-white p-6 shadow-2xl shadow-ink-950/20 lg:p-8"
    >
      <div className="text-[15px] font-semibold text-ink-950">{team.thread.title}</div>

      <div className="mt-7 space-y-5">
        {team.thread.messages.map((msg, i) => {
          const isAgent = msg.from === 'receipt';
          return (
            <div
              key={i}
              className={`flex gap-3 rounded-2xl p-3 ${isAgent ? 'bg-brand-50/70' : ''}`}
              style={{ animation: `fadeUp 0.5s ease-out ${i * 0.12}s both` }}
            >
              {isAgent ? (
                <div className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-brand-500 text-white">
                  <ReceiptMark className="h-5 w-5" paperClassName="text-brand-500" />
                </div>
              ) : (
                <div className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-ink-200 text-[11px] font-bold text-ink-700">
                  {msg.name.slice(0, 2).toUpperCase()}
                </div>
              )}

              <div className="min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-[13px] font-semibold text-ink-950">{msg.name}</span>
                  {isAgent && (
                    <span className="rounded bg-brand-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-brand-700">
                      App
                    </span>
                  )}
                  <span className="text-[11px] text-ink-400">{msg.time}</span>
                </div>
                <p className="mt-1 text-[13.5px] leading-relaxed text-ink-700">
                  {isAgent ? (
                    msg.text
                  ) : (
                    <>
                      <span className="rounded bg-sky-100 px-1 font-medium text-sky-700">@Kentron AI</span>
                      {msg.text.replace('@Kentron AI', '')}
                    </>
                  )}
                </p>
                {msg.reactions && (
                  <div className="mt-2 flex gap-1.5">
                    {msg.reactions.map((r) => (
                      <span
                        key={r}
                        className="rounded-full border border-ink-100 bg-ink-50 px-2 py-0.5 text-[11px] font-medium text-ink-600"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * The interactive team switcher. Cycles on its own until someone picks a team,
 * which is what makes it read as a live product rather than a static list.
 */
export default function TeamPicker({
  eyebrow = 'Choose a starting point',
  headline = 'Start with the work that eats your week.',
}: {
  eyebrow?: string;
  headline?: string;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setActive((i) => (i + 1) % teams.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [paused]);

  const team = teams[active];

  return (
    <div
      className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-400 via-sky-500 to-indigo-600 p-6 sm:p-10 lg:p-14"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-white/25 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-indigo-900/40 blur-[110px]" />

      <div className="relative grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-14">
        {/* ---- left: the picker ---- */}
        <div>
          <div className="text-sm font-medium text-white/70">{eyebrow}</div>
          <h2 className="mt-3 text-4xl font-bold leading-[1.05] tracking-tight text-white text-balance lg:text-5xl">
            {headline}
          </h2>

          <div ref={listRef} className="mt-9 space-y-1.5">
            {teams.map((t, i) => {
              const Icon = getIcon(t.icon);
              const isActive = i === active;
              return (
                <div key={t.slug}>
                  <button
                    onClick={() => setActive(i)}
                    aria-expanded={isActive}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all duration-300 ${
                      isActive
                        ? 'bg-white/20 shadow-lg shadow-indigo-900/10 ring-1 ring-white/30 backdrop-blur'
                        : 'hover:bg-white/10'
                    }`}
                  >
                    <Icon className={`h-5 w-5 flex-none ${isActive ? 'text-white' : 'text-white/60'}`} />
                    <span
                      className={`flex-1 text-lg font-semibold ${isActive ? 'text-white' : 'text-white/70'}`}
                    >
                      {t.label}
                    </span>
                    <StatusBadge status={t.status} />
                    <span
                      className={`h-2.5 w-2.5 flex-none rounded-full border-2 transition-colors ${
                        isActive ? 'border-white bg-white' : 'border-white/40'
                      }`}
                    />
                  </button>

                  {isActive && (
                    <div className="animate-fade-in px-4 pb-3 pt-1">
                      <p className="text-sm leading-relaxed text-white/80">{t.tagline}</p>
                      <a
                        href={teamUseCaseHref(t.slug)}
                        className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/30 transition-colors hover:bg-white/30"
                      >
                        See how it works
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <a
            href="https://app.kentron.ai/auth/sign-up"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-ink-950 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
          >
            Get started for free
          </a>
        </div>

        {/* ---- right: the run ---- */}
        <div className="lg:sticky lg:top-24">
          <ThreadCard team={team} />
        </div>
      </div>
    </div>
  );
}
