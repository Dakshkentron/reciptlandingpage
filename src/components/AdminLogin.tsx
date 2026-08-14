/**
 * Sign-in for the admin console.
 *
 * These are ordinary Receipt credentials — there is no separate admin account
 * to create. The page only collects them; Receipt decides whether they belong
 * to verified Kentron staff.
 */

import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import ReceiptMark from '@/components/ReceiptMark';

interface Props {
  onSubmit: (email: string, password: string) => void;
  error: string | null;
  busy: boolean;
}

export default function AdminLogin({ onSubmit, error, busy }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <ReceiptMark className="h-7 w-7 text-brand-500" paperClassName="text-ink-950" />
          <span className="text-lg font-bold text-white">Receipt</span>
        </div>

        <div className="rounded-2xl border border-ink-800 bg-ink-900 p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-ink-700 bg-ink-850 px-3 py-1 text-xs font-medium text-ink-300 mb-5">
            <ShieldCheck className="h-3.5 w-3.5 text-brand-400" />
            Internal
          </div>

          <h1 className="text-xl font-bold text-white mb-2">Admin console</h1>
          <p className="text-sm text-ink-400 leading-relaxed mb-7">
            Sign in with your Receipt account. Restricted to Kentron staff.
          </p>

          <form
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              onSubmit(email.trim(), password);
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
                className="rounded-xl border border-ink-800 bg-ink-950 px-3.5 py-2.5 text-sm text-ink-100 placeholder:text-ink-500 focus:border-brand-500/50 focus:outline-none"
                placeholder="you@kentron.ai"
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
                className="rounded-xl border border-ink-800 bg-ink-950 px-3.5 py-2.5 text-sm text-ink-100 focus:border-brand-500/50 focus:outline-none"
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
        </div>

        <p className="mt-6 text-center text-xs text-ink-500">Every view of this page is logged.</p>
      </div>
    </div>
  );
}
