/**
 * Sign-in for the admin console.
 *
 * Sign-in only — there is deliberately no way to create an account here.
 * Accounts come from Receipt, so access is granted by whoever already has one,
 * and this page cannot widen who that is.
 *
 * It also does not name the rule it enforces. Telling a stranger which domain
 * is accepted tells them what to try next; the checks live in our serverless
 * function and inside Receipt, where they cannot be read off a page.
 */

import { useState } from 'react';
import { Building2, Link2, ShieldCheck, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import ReceiptMark from '@/components/ReceiptMark';

interface Props {
  onSignIn: (email: string, password: string) => void;
  error: string | null;
  busy: boolean;
}

const fieldClass =
  'rounded-xl border border-ink-800 bg-ink-950 px-3.5 py-2.5 text-sm text-ink-100 placeholder:text-ink-500 transition-colors focus:border-brand-500/50 focus:outline-none focus:ring-1 focus:ring-brand-500/30';

/**
 * What is behind the door, stated before anyone knocks.
 *
 * Deliberately about shape, not substance: it says the console shows counts of
 * companies, people, and connections, which is no more than the name of the
 * tool already implies. No customer name appears before sign-in.
 */
const HIGHLIGHTS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Building2,
    title: 'Every company on Receipt',
    body: 'When they signed up, how many people they have brought along, and how recently anyone signed in.',
  },
  {
    icon: Link2,
    title: 'The connections they run',
    body: 'Which integrations each company has live, and which have quietly lapsed and need reconnecting.',
  },
  {
    icon: Users,
    title: 'Read straight from production',
    body: 'Aggregate counts only, queried at the moment the page loads. No message content, ever.',
  },
];

export default function AdminLogin({ onSignIn, error, busy }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-950">
      <div className="pointer-events-none absolute inset-0 bg-grid mask-fade-b" aria-hidden="true" />
      {/* A single warm point of light behind the card, so the page has a centre
          of gravity instead of reading as a flat black rectangle. */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[32rem] w-[52rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-brand-500/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-5 py-14 lg:px-8">
        <header className="flex items-center gap-2.5">
          <ReceiptMark className="h-7 w-7 text-brand-500" paperClassName="text-ink-950" />
          <span className="text-lg font-bold text-white">Receipt</span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-ink-700 bg-ink-850 px-2.5 py-0.5 text-[11px] font-medium text-ink-300">
            <ShieldCheck className="h-3 w-3 text-brand-400" />
            Internal
          </span>
        </header>

        <div className="mt-10 grid items-start gap-12 lg:mt-14 lg:grid-cols-[1fr_22rem] lg:gap-16">
          <div className="animate-fade-up">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              See how customers are using Receipt
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-ink-300">
              The internal console for the Receipt team — one live view of every company on the
              platform, what they have connected, and how much of it they are actually using.
            </p>

            <ul className="mt-9 flex flex-col gap-6">
              {HIGHLIGHTS.map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-3.5">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-ink-800 bg-ink-900 text-brand-400">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-ink-100">{title}</div>
                    <p className="mt-1 max-w-md text-sm leading-relaxed text-ink-300/90">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full max-w-sm animate-fade-up lg:sticky lg:top-14">
            <div className="rounded-2xl border border-ink-800 bg-ink-900 p-7 shadow-2xl shadow-black/40">
              <h2 className="text-lg font-bold text-white">Welcome back</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-300">
                Sign in with your Receipt account.
              </p>

              <form
                className="mt-6 flex flex-col gap-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  onSignIn(email.trim(), password);
                }}
              >
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="admin-email" className="text-xs font-medium text-ink-300">
                    Email
                  </label>
                  <input
                    id="admin-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className={fieldClass}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="admin-password" className="text-xs font-medium text-ink-300">
                    Password
                  </label>
                  <input
                    id="admin-password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className={fieldClass}
                  />
                </div>

                {error && (
                  <p
                    role="alert"
                    className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="mt-1 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {busy ? 'Signing in…' : 'Sign in'}
                </button>
              </form>

              <p className="mt-6 border-t border-ink-800 pt-5 text-xs leading-relaxed text-ink-400">
                Access follows your Receipt account — there is nothing to create here, and no
                separate password to keep.
              </p>
            </div>

            <p className="mt-5 text-center text-xs text-ink-500">Every view of this page is logged.</p>
          </div>
        </div>

        <footer className="mt-14 border-t border-ink-800/80 pt-6 text-xs text-ink-500">
          Receipt is a product of Kentron Inc. Internal use only.
        </footer>
      </div>
    </div>
  );
}
