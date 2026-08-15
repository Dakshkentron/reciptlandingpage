/**
 * Sign in, over the welcome page.
 *
 * A dialog rather than a page of its own: the welcome page is what explains the
 * console, and someone who came to sign in should not have to lose that context
 * to do it.
 *
 * Sign-in only — there is deliberately no way to create an account here.
 * Accounts come from Receipt, so access is granted by whoever already has one,
 * and this page cannot widen who that is. It also does not name the rule it
 * enforces: telling a stranger which domain is accepted tells them what to try
 * next, and the checks live in our serverless function and inside Receipt, where
 * they cannot be read off a page.
 */

import { useEffect, useId, useRef, useState } from 'react';
import { AlertCircle, ArrowRight, Lock, X } from 'lucide-react';
import ReceiptMark from '@/components/ReceiptMark';

interface Props {
  onClose: () => void;
  onSignIn: (email: string, password: string) => void;
  error: string | null;
  busy: boolean;
}

const fieldClass =
  'w-full rounded-xl border border-ink-800 bg-ink-950 px-3.5 py-2.5 text-sm text-ink-100 placeholder:text-ink-600 transition-colors focus:border-brand-500/50 focus:outline-none focus:ring-1 focus:ring-brand-500/30';

const labelClass = 'text-xs font-medium text-ink-300';

export default function SignInDialog({ onClose, onSignIn, error, busy }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const titleId = useId();
  const emailRef = useRef<HTMLInputElement>(null);

  // Escape closes, and the page behind stops scrolling while it is open. Both
  // are what a dialog is expected to do; neither comes for free.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  // Land in the email field, so the dialog can be completed without reaching
  // for the mouse first.
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="fixed inset-0 h-full w-full cursor-default bg-ink-950/80 backdrop-blur-sm"
        tabIndex={-1}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative my-auto w-full max-w-md animate-fade-up rounded-2xl border border-ink-800 bg-ink-900 p-6 shadow-2xl shadow-black/60 sm:p-7"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-lg p-1.5 text-ink-500 transition-colors hover:bg-ink-850 hover:text-ink-200"
        >
          <X className="h-4 w-4" />
        </button>

        <ReceiptMark className="h-7 w-7 text-brand-500" paperClassName="text-ink-900" />

        <h2 id={titleId} className="mt-4 text-lg font-bold text-white">
          Welcome back
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-300">
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
            <label htmlFor="signin-email" className={labelClass}>
              Email
            </label>
            <input
              ref={emailRef}
              id="signin-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={fieldClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="signin-password" className={labelClass}>
              Password
            </label>
            <input
              id="signin-password"
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
              className="flex gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-3 text-sm leading-relaxed text-red-200"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="group mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? 'Signing in…' : 'Sign in'}
            {!busy && (
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            )}
          </button>
        </form>

        <p className="mt-5 flex gap-2 border-t border-ink-800 pt-4 text-xs leading-relaxed text-ink-400">
          <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-500" />
          Access follows your Receipt account — there is nothing to create here, and no separate
          password to keep.
        </p>
      </div>
    </div>
  );
}
