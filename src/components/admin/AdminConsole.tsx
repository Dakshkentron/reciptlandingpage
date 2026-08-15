/**
 * Root of the internal admin console, reached at `#/admin`.
 *
 * It lives inside the marketing site but is not part of it: App renders this on
 * its own, with no Header and no Footer. There is no router below this point —
 * signed out you get the welcome page, signed in you get the one screen the
 * console has.
 *
 * It holds the sign-in state and nothing else. A 401 from the server is what
 * tells it to show the welcome page — it never decides for itself whether the
 * visitor is allowed in, because a check written here would ship inside a bundle
 * anyone can download and would protect nothing.
 *
 * Everything below this file is a verbatim copy of the standalone console, so a
 * change made there can be brought across without being re-read line by line.
 * The adaptation is all here: the two imports, and `useConsoleDocument`.
 */

import { useCallback, useEffect, useState } from 'react';
import AdminDashboard from '@/components/admin/AdminDashboard';
import ReceiptMark from '@/components/ReceiptMark';
import SignInDialog from '@/components/admin/SignInDialog';
import WelcomePage from '@/components/admin/WelcomePage';
import { fetchOverview, signIn, signOut } from '@/lib/adminApi';
import type { AdminOverview } from '@/lib/adminTypes';

type Status = 'loading' | 'signed-out' | 'signed-in' | 'failed';

/**
 * Stands in for the console's own `index.css`, which it no longer has.
 *
 * Two things it used to get from being a separate site: a dark document, so the
 * overscroll area and the form controls are not the marketing site's white; and
 * its own motion and grid, which are shorter and fainter than this site's. The
 * `console` class is what the scoped block in `src/index.css` hangs off — see
 * the comment there for why they cannot simply be the same values.
 *
 * All of it is undone on the way out, so leaving `#/admin` returns a light site.
 */
function useConsoleDocument() {
  useEffect(() => {
    const root = document.documentElement;
    const previous = {
      background: root.style.backgroundColor,
      scheme: root.style.colorScheme,
      bodyBackground: document.body.style.backgroundColor,
    };

    root.classList.add('console');
    root.style.backgroundColor = '#0a0a0b';
    root.style.colorScheme = 'dark';
    document.body.style.backgroundColor = '#0a0a0b';

    return () => {
      root.classList.remove('console');
      root.style.backgroundColor = previous.background;
      root.style.colorScheme = previous.scheme;
      document.body.style.backgroundColor = previous.bodyBackground;
    };
  }, []);
}

export default function AdminConsole() {
  const [status, setStatus] = useState<Status>('loading');
  const [data, setData] = useState<AdminOverview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useConsoleDocument();

  const load = useCallback(async () => {
    setBusy(true);
    try {
      const overview = await fetchOverview();
      if (overview) {
        setData(overview);
        setStatus('signed-in');
        setDialogOpen(false);
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

  const openDialog = useCallback(() => {
    setError(null);
    setDialogOpen(true);
  }, []);

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
          <ReceiptMark className="mx-auto h-7 w-7 text-brand-500" paperClassName="text-ink-900" />
          <h1 className="mt-5 text-base font-semibold text-white">The console could not load</h1>
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
    <>
      <WelcomePage onSignIn={openDialog} />
      {dialogOpen && (
        <SignInDialog
          onClose={() => {
            setDialogOpen(false);
            setError(null);
          }}
          onSignIn={(email, password) => void handleSignIn(email, password)}
          error={error}
          busy={busy}
        />
      )}
    </>
  );
}
