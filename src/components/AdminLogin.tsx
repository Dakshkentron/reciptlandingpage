/**
 * Sign-in and account creation for the admin console.
 *
 * These are ordinary Receipt accounts — the console has no user store of its
 * own. The form checks the email domain before submitting so a wrong address is
 * caught immediately, but that is courtesy, not protection: the checks that
 * count run in our serverless function and again inside Receipt.
 */

import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import ReceiptMark from '@/components/ReceiptMark';
import { ADMIN_EMAIL_DOMAIN, isKentronEmail } from '@/lib/adminApi';

type Mode = 'sign-in' | 'register';

interface Props {
  onSignIn: (email: string, password: string) => void;
  onRegister: (name: string, email: string, password: string) => void;
  error: string | null;
  notice: string | null;
  busy: boolean;
}

const fieldClass =
  'rounded-xl border border-ink-800 bg-ink-950 px-3.5 py-2.5 text-sm text-ink-100 placeholder:text-ink-500 focus:border-brand-500/50 focus:outline-none';

export default function AdminLogin({ onSignIn, onRegister, error, notice, busy }: Props) {
  const [mode, setMode] = useState<Mode>('sign-in');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const shown = error ?? localError;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = email.trim();

    if (!isKentronEmail(trimmed)) {
      setLocalError(`Use your @${ADMIN_EMAIL_DOMAIN} address.`);
      return;
    }
    setLocalError(null);

    if (mode === 'register') {
      onRegister(name.trim(), trimmed, password);
    } else {
      onSignIn(trimmed, password);
    }
  }

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

          <h1 className="text-xl font-bold text-white mb-2">
            {mode === 'register' ? 'Create your account' : 'Admin console'}
          </h1>
          <p className="text-sm text-ink-400 leading-relaxed mb-7">
            Restricted to Kentron staff. Only{' '}
            <span className="font-medium text-ink-200">@{ADMIN_EMAIL_DOMAIN}</span> addresses can
            sign in or create an account.
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="admin-name" className="text-xs font-medium text-ink-300">
                  Name
                </label>
                <input
                  id="admin-name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className={fieldClass}
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="admin-email" className="text-xs font-medium text-ink-300">
                Work email
              </label>
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={fieldClass}
                placeholder={`you@${ADMIN_EMAIL_DOMAIN}`}
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
                minLength={mode === 'register' ? 8 : undefined}
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={fieldClass}
              />
              {mode === 'register' && (
                <p className="text-xs text-ink-500">At least 8 characters.</p>
              )}
            </div>

            {shown && (
              <p
                role="alert"
                className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
              >
                {shown}
              </p>
            )}

            {notice && (
              <p className="rounded-xl border border-brand-500/30 bg-brand-500/10 px-4 py-3 text-sm text-brand-200">
                {notice}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="mt-1 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy
                ? 'Working…'
                : mode === 'register'
                  ? 'Create account'
                  : 'Sign in'}
            </button>
          </form>
        </div>

        <button
          type="button"
          className="mt-6 w-full text-center text-xs text-ink-500 underline transition-colors hover:text-ink-300"
          onClick={() => {
            setMode(mode === 'register' ? 'sign-in' : 'register');
            setLocalError(null);
          }}
        >
          {mode === 'register'
            ? 'Already have an account? Sign in'
            : 'First time here? Create an account'}
        </button>
      </div>
    </div>
  );
}
