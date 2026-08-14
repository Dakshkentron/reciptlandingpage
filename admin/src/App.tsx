/**
 * Root of the internal admin console.
 *
 * This is a site of its own — separate app, separate deploy, separate domain —
 * so nothing internal is bundled with, or reachable from, the marketing site.
 * There is one screen behind sign-in and no router: a console for a handful of
 * staff has no pages to navigate between.
 *
 * It holds the sign-in state and nothing else. A 401 from the server is what
 * tells it to show the login screen — it never decides for itself whether the
 * visitor is allowed in, because a check written here would ship inside a
 * bundle anyone can download and would protect nothing.
 */

import { useCallback, useEffect, useState } from 'react';
import AdminDashboard from '@/components/AdminDashboard';
import AdminLogin from '@/components/AdminLogin';
import ReceiptMark from '@/components/ReceiptMark';
import { fetchOverview, signIn, signOut } from '@/lib/adminApi';
import type { AdminOverview } from '@/lib/adminTypes';

type Status = 'loading' | 'signed-out' | 'signed-in' | 'failed';

export default function App() {
  const [status, setStatus] = useState<Status>('loading');
  const [data, setData] = useState<AdminOverview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setBusy(true);
    try {
      const overview = await fetchOverview();
      if (overview) {
        setData(overview);
        setStatus('signed-in');
      } else {
        setData(null);
        setStatus('signed-out');
      }
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Something went wrong.');
      setStatus('failed');
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSignIn = useCallback(
    async (email: string, password: string) => {
      setBusy(true);
      setError(null);
      try {
        await signIn(email, password);
        await load();
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : 'Sign-in failed.');
        setStatus('signed-out');
        setBusy(false);
      }
    },
    [load],
  );

  const handleSignOut = useCallback(async () => {
    await signOut();
    setData(null);
    setError(null);
    setStatus('signed-out');
  }, []);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink-950">
        <ReceiptMark className="h-8 w-8 animate-pulse text-brand-500" paperClassName="text-ink-950" />
        <p className="text-sm text-ink-400">Checking your session…</p>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-950 px-5">
        <div className="w-full max-w-md rounded-2xl border border-ink-800 bg-ink-900 p-8 text-center">
          <ReceiptMark
            className="mx-auto h-7 w-7 text-brand-500"
            paperClassName="text-ink-900"
          />
          <h1 className="mt-5 text-base font-semibold text-white">
            The console could not load
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-400">{error}</p>
          <button
            type="button"
            onClick={() => void load()}
            className="mt-6 rounded-xl border border-ink-700 bg-ink-850 px-4 py-2.5 text-sm font-medium text-ink-200 transition-colors hover:border-ink-600 hover:text-white"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (status === 'signed-in' && data) {
    return (
      <AdminDashboard
        data={data}
        onSignOut={() => void handleSignOut()}
        onReload={() => void load()}
        busy={busy}
      />
    );
  }

  return (
    <AdminLogin
      onSignIn={(email, password) => void handleSignIn(email, password)}
      error={error}
      busy={busy}
    />
  );
}
