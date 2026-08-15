/**
 * The first thing anyone sees.
 *
 * This is a welcome page, not a login screen with decoration around it. Someone
 * arriving here may be a new colleague who has never used the console, so the
 * page answers three questions before asking for anything: what this shows, how
 * you get in, and what it will never expose. Sign in and sign up sit in the
 * header, where they are reachable from any point on the page.
 *
 * Everything here is written to be true with nobody signed in. There are no
 * customer names, no real figures, and nothing fetched — the preview below the
 * hero is a drawing of the layout, labelled as one. The page cannot leak what it
 * never receives.
 */

import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Building2,
  Clock3,
  Database,
  EyeOff,
  FileLock2,
  Link2,
  LogIn,
  Radio,
  ShieldCheck,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import ReceiptMark from '@/components/ReceiptMark';

interface Props {
  onSignIn: () => void;
}

const NAV = [
  { href: '#what-you-see', label: 'What you see' },
  { href: '#access', label: 'Access' },
  { href: '#limits', label: 'Limits' },
];

/**
 * Deliberately about shape, not substance: counts of companies, people, and
 * connections, which is no more than the name of the tool already implies.
 */
const CAPABILITIES: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Building2,
    title: 'Every company on Receipt',
    body: 'When each one signed up, how many people they have brought along since, and how recently anyone signed in.',
  },
  {
    icon: Link2,
    title: 'The connections they run',
    body: 'Which integrations a company has live, and which have quietly lapsed and are waiting on someone to reconnect them.',
  },
  {
    icon: Database,
    title: 'Read straight from production',
    body: 'Aggregate counts, queried the moment the page loads. Nothing is cached, copied, or kept on this side.',
  },
];

const STEPS: { title: string; body: string }[] = [
  {
    title: 'Use your Receipt account',
    body: 'The console has no accounts of its own, and no way to create one. You sign in with the same credentials you use for Receipt; if you do not have those yet, they are made in Receipt, not here.',
  },
  {
    title: 'Receipt decides, every time',
    body: 'Signing in proves who you are; it does not prove you may be here. Receipt is asked separately whether your account may read customer data, on every request.',
  },
  {
    title: 'Access ends when your account does',
    body: 'There is no second account to remember and no separate list to prune. Removing someone from Receipt removes them from here, with no extra step.',
  },
];

const LIMITS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: EyeOff,
    title: 'No message content',
    body: 'Not threads, not chats, not what any agent was asked to do. The query behind this page cannot return it.',
  },
  {
    icon: FileLock2,
    title: 'No secrets or tokens',
    body: 'Connection credentials never leave Receipt. This console sees that an integration exists, not what it holds.',
  },
  {
    icon: Clock3,
    title: 'Read-only, always',
    body: 'The console asks Receipt for counts and nothing else. There is no button here that changes a customer record, because there is no code here that could.',
  },
  {
    icon: ShieldCheck,
    title: 'Never indexed, never framed',
    body: 'Refused to crawlers, blocked from embedding, and served only over HTTPS on its own origin, apart from anything public.',
  },
];

/** A drawing of the real layout. Invented names, invented numbers, said plainly. */
const PREVIEW_ROWS = [
  { name: 'Northwind Trading', members: 24, live: 6, total: 7 },
  { name: 'Lumen Labs', members: 11, live: 3, total: 3 },
  { name: 'Atlas Freight', members: 8, live: 2, total: 5 },
];

const PREVIEW_TOTALS: { icon: LucideIcon; label: string; value: string }[] = [
  { icon: Building2, label: 'Companies', value: '128' },
  { icon: Users, label: 'Members', value: '1,204' },
  { icon: Link2, label: 'Integrations', value: '512' },
  { icon: Radio, label: 'Sessions', value: '87' },
];

function ConsolePreview() {
  return (
    <div className="relative">
      <div className="rounded-2xl border border-ink-800 bg-ink-900/70 p-1.5 shadow-2xl shadow-black/50 backdrop-blur">
        {/* Window chrome, so the panel reads as the application rather than as
            another card of copy. */}
        <div className="flex items-center gap-2 px-3 py-2">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-ink-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-ink-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-ink-700" />
          </span>
          <span className="mx-auto rounded-md bg-ink-950 px-3 py-1 font-mono text-[11px] text-ink-500">
            receipt · internal console
          </span>
        </div>

        <div className="rounded-xl border border-ink-800/80 bg-ink-950 p-4 sm:p-5">
          {/* Two across, not four. At `lg` this panel sits in the narrow column of
              the hero, where a quarter of it is about 66px of usable width — less
              than "Integrations" needs at this tracking, so the label ran out past
              its own card. `min-w-0` lets the label shrink inside the grid cell
              rather than forcing it wider, and `truncate` is the backstop. */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
            {PREVIEW_TOTALS.map(({ icon: Icon, label, value }) => (
              <div key={label} className="min-w-0 rounded-xl border border-ink-800 bg-ink-900 p-3">
                <div className="flex min-w-0 items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-ink-500">
                  <Icon className="h-3 w-3 shrink-0 text-brand-400/70" />
                  <span className="truncate">{label}</span>
                </div>
                <div className="mt-1.5 font-mono text-2xl font-bold leading-none text-ink-400">
                  {value}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-ink-800">
            <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-ink-800 bg-ink-900 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-ink-500">
              <span>Company</span>
              <span className="text-right">Members</span>
              <span className="text-right">Live</span>
            </div>
            {PREVIEW_ROWS.map((row) => (
              <div
                key={row.name}
                className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-ink-800/60 px-4 py-3 text-sm last:border-b-0"
              >
                <span className="min-w-0 truncate text-ink-300">{row.name}</span>
                <span className="text-right font-mono tabular-nums text-ink-400">
                  {row.members}
                </span>
                <span className="text-right font-mono tabular-nums">
                  <span className="text-brand-400">{row.live}</span>
                  <span className="text-ink-600">/{row.total}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-ink-500">
        Sample layout with invented names and figures — no customer data appears before sign-in.
      </p>
    </div>
  );
}

export default function WelcomePage({ onSignIn }: Props) {
  const [scrolled, setScrolled] = useState(false);

  // The header only earns its border and backdrop once there is content behind
  // it; at the top of a page it would just be a line under the logo.
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ink-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[42rem] bg-grid mask-fade-b" aria-hidden="true" />
      {/* One warm point of light, so the page has a centre of gravity instead of
          reading as a flat black rectangle. */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[34rem] w-[64rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-brand-500/10 blur-3xl"
        aria-hidden="true"
      />

      <header
        className={`sticky top-0 z-40 transition-colors ${
          scrolled ? 'border-b border-ink-800/80 bg-ink-950/85 backdrop-blur-md' : ''
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-5 lg:px-8">
          <a href="#top" className="flex items-center gap-2.5">
            <ReceiptMark className="h-7 w-7 text-brand-500" paperClassName="text-ink-950" />
            <span className="text-lg font-bold text-white">Receipt</span>
          </a>
          <span className="hidden items-center gap-1.5 rounded-full border border-ink-700 bg-ink-850 px-2.5 py-0.5 text-[11px] font-medium text-ink-300 sm:inline-flex">
            <ShieldCheck className="h-3 w-3 text-brand-400" />
            Internal
          </span>

          <nav className="ml-6 hidden gap-6 md:flex">
            {NAV.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="text-sm text-ink-400 transition-colors hover:text-ink-100"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* One action, because there is only one. Accounts come from Receipt,
              and this console cannot widen who has one. */}
          <div className="ml-auto flex items-center gap-4">
            <span className="hidden text-xs text-ink-500 lg:inline">
              Accounts come from Receipt
            </span>
            <button
              type="button"
              onClick={onSignIn}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-400"
            >
              <LogIn className="h-3.5 w-3.5" />
              Sign in
            </button>
          </div>
        </div>
      </header>

      <main id="top" className="relative mx-auto max-w-6xl px-5 lg:px-8">
        <section className="pb-16 pt-14 sm:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
            <div>
              <span
                className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-ink-800 bg-ink-900 px-3 py-1 text-xs font-medium text-ink-300"
                style={{ animationDelay: '0ms' }}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-500" />
                </span>
                Live from production · Kentron staff only
              </span>

              <h1
                className="mt-6 animate-fade-up text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-[2.75rem]"
                style={{ animationDelay: '60ms' }}
              >
                Every company on Receipt,
                <br className="hidden sm:block" />{' '}
                <span className="text-brand-400">on one page.</span>
              </h1>

              <p
                className="mt-5 max-w-xl animate-fade-up text-lg leading-relaxed text-ink-300"
                style={{ animationDelay: '120ms' }}
              >
                The internal console for the Receipt team. One live view of who is on the platform,
                what they have connected, and how much of it they are actually using — read straight
                from production, and never a word of what anyone said.
              </p>

              <div
                className="mt-8 flex animate-fade-up flex-col gap-3 sm:flex-row"
                style={{ animationDelay: '180ms' }}
              >
                <button
                  type="button"
                  onClick={onSignIn}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-400"
                >
                  Sign in to the console
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
                <a
                  href="#access"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-ink-700 bg-ink-900 px-5 py-3 text-sm font-medium text-ink-200 transition-colors hover:border-ink-600 hover:text-white"
                >
                  How access works
                </a>
              </div>

              <p
                className="mt-5 animate-fade-up text-xs text-ink-500"
                style={{ animationDelay: '240ms' }}
              >
                Aggregate counts only. Every view of this page is logged.
              </p>
            </div>

            <div className="animate-fade-up" style={{ animationDelay: '260ms' }}>
              <ConsolePreview />
            </div>
          </div>
        </section>

        <section id="what-you-see" className="scroll-mt-20 border-t border-ink-800/70 py-16">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            What you see once you are in
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-300">
            One screen. No navigation to learn, because a console for a handful of people has no
            pages to navigate between.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {CAPABILITIES.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="group rounded-2xl border border-ink-800 bg-ink-900 p-6 transition-colors hover:border-ink-700"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-ink-800 bg-ink-950 text-brand-400 transition-colors group-hover:border-brand-500/30">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-base font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-300/90">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="access" className="scroll-mt-20 border-t border-ink-800/70 py-16">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            How access works
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-300">
            Three things have to be true before a single figure loads, and none of them are decided
            by this page.
          </p>

          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            {STEPS.map(({ title, body }, index) => (
              <li
                key={title}
                className="relative rounded-2xl border border-ink-800 bg-ink-900 p-6 transition-colors hover:border-ink-700"
              >
                <span className="font-mono text-xs font-semibold text-brand-400">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-3 text-base font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-300/90">{body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="limits" className="scroll-mt-20 border-t border-ink-800/70 py-16">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            What it will never show you
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-300">
            Customers trust Receipt with the work their agents do. Being staff is not a reason to
            read it, so these are not settings — they are what the console is built out of.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {LIMITS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex gap-4 rounded-2xl border border-ink-800 bg-ink-900 p-6">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-ink-800 bg-ink-950 text-brand-400">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-white">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-300/90">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-ink-800/70 py-16">
          <div className="relative overflow-hidden rounded-3xl border border-ink-800 bg-ink-900 px-6 py-12 text-center sm:px-12">
            <div
              className="pointer-events-none absolute left-1/2 top-0 h-64 w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/10 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative">
              <ReceiptMark
                className="mx-auto h-8 w-8 text-brand-500"
                paperClassName="text-ink-900"
              />
              <h2 className="mt-5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Ready when you are
              </h2>
              <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-ink-300">
                Sign in with your Receipt account. There is nothing to create here and no separate
                password to keep.
              </p>
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={onSignIn}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-400"
                >
                  Sign in
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
              <p className="mt-5 text-xs text-ink-500">
                No Receipt account yet? Whoever set up your access can create one for you.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative border-t border-ink-800/70">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex items-center gap-2">
            <ReceiptMark className="h-4 w-4 text-ink-600" paperClassName="text-ink-950" />
            Receipt is a product of Kentron Inc. Internal use only.
          </div>
          <span>Not indexed, not public, and logged on every view.</span>
        </div>
      </footer>
    </div>
  );
}
