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

import { useCallback, useEffect, useRef, useState } from 'react';
import AdminDashboard from '@/components/admin/AdminDashboard';
import ReceiptMark from '@/components/ReceiptMark';
import SignInDialog from '@/components/admin/SignInDialog';
import WelcomePage from '@/components/admin/WelcomePage';
import { fetchOverview, signIn, signOut } from '@/lib/adminApi';
import type { AdminOverview } from '@/lib/adminTypes';

type Status = 'loading' | 'signed-out' | 'signed-in' | 'failed';

export type Theme = 'dark' | 'light';

/** Remembered per browser, so the choice survives a reload. */
const THEME_STORAGE_KEY = 'kentron.console.theme';

/** The page background for each theme, kept in step with `.console.light` in index.css. */
const THEME_BACKGROUND: Record<Theme, string> = {
  dark: '#0a0a0b',
  light: '#f7f7f8',
};

/**
 * The theme this viewer last chose, or the one their OS asks for.
 *
 * Read lazily inside `useState` so the very first paint is already the right
 * theme -- setting it in an effect instead makes a light-mode user watch the
 * console flash dark on every load.
 *
 * Every access is wrapped: Safari throws on `localStorage` outright in private
 * mode rather than returning null, and a console that cannot render because a
 * storage read threw would be a bad trade for remembering a preference.
 */
function initialTheme(): Theme {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
  } catch {
    // Storage unavailable; fall through to the OS preference.
  }
  try {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

/**
 * Stands in for the console's own `index.css`, which it no longer has.
 *
 * Two things it used to get from being a separate site: a document painted to
 * match, so the overscroll area and the form controls are not the marketing
 * site's white; and its own motion and grid, which are shorter and fainter than
 * this site's. The `console` class is what the scoped block in `src/index.css`
 * hangs off -- see the comment there for why they cannot simply be the same
 * values, and for how `console light` repaints the whole surface.
 *
 * All of it is undone on the way out, so leaving `#/admin` returns a light site.
 */
function useConsoleDocument(theme: Theme) {
  useEffect(() => {
    const root = document.documentElement;
    const previous = {
      background: root.style.backgroundColor,
      scheme: root.style.colorScheme,
      bodyBackground: document.body.style.backgroundColor,
    };

    root.classList.add('console');
    root.classList.toggle('light', theme === 'light');
    // `color-scheme` is what makes the browser's own furniture follow -- the
    // scrollbars, the search input's clear button, and form control defaults.
    root.style.colorScheme = theme;
    root.style.backgroundColor = THEME_BACKGROUND[theme];
    document.body.style.backgroundColor = THEME_BACKGROUND[theme];

    return () => {
      root.classList.remove('console', 'light');
      root.style.backgroundColor = previous.background;
      root.style.colorScheme = previous.scheme;
      document.body.style.backgroundColor = previous.bodyBackground;
    };
  }, [theme]);
}

/**
 * How often the page re-asks Receipt for the numbers.
 *
 * Fifteen seconds: close enough to live that a workspace created in another tab
 * shows up while you are still looking for it, and still slow enough that a
 * console left open on a wall display is not hammering a production query all
 * day. Polling only runs while the tab is actually visible, and the header
 * counts down to the next one so the page is visibly current rather than
 * asking to be trusted.
 */
const REFRESH_INTERVAL_MS = 15_000;

export default function AdminConsole() {
  const [status, setStatus] = useState<Status>('loading');
  const [data, setData] = useState<AdminOverview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  /** Set while a background refresh is in flight, to drive the "live" dot. */
  const [refreshing, setRefreshing] = useState(false);
  const [theme, setTheme] = useState<Theme>(initialTheme);
  /**
   * When the figures on screen were last successfully fetched.
   *
   * Distinct from `generatedAt`, which is when Receipt ran the query. This is
   * the browser's own clock, and is what the countdown to the next poll is
   * measured from -- the two can differ by the round trip and by any clock skew
   * between here and production.
   */
  const [lastUpdated, setLastUpdated] = useState<number>(() => Date.now());

  useConsoleDocument(theme);

  const toggleTheme = useCallback(() => {
    setTheme((previous) => {
      const next = previous === 'dark' ? 'light' : 'dark';
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        // Private mode; the choice simply will not survive a reload.
      }
      return next;
    });
  }, []);

  // Read inside the interval callback so it never closes over a stale value and
  // starts polling while signed out.
  const statusRef = useRef(status);
  statusRef.current = status;

  /**
   * `silent` is what separates a background poll from a click.
   *
   * A poll must not blank the table, spin the button, or throw the page into
   * its error state: the numbers on screen are still the last good ones, and a
   * single failed request in the background is not worth replacing them with an
   * error card. It records the failure quietly and tries again on the next tick.
   * An expired session is the one exception — that has to surface, or the page
   * would keep showing figures the viewer is no longer entitled to.
   */
  const load = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true);
    else setBusy(true);

    try {
      const overview = await fetchOverview();
      if (overview) {
        setData(overview);
        setLastUpdated(Date.now());
        setStatus('signed-in');
        setDialogOpen(false);
      } else {
        setData(null);
        setStatus('signed-out');
      }
      setError(null);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Something went wrong.';
      if (silent) {
        // Keep the last good numbers on screen; the header shows how old they are.
        setError(message);
      } else {
        setError(message);
        setStatus('failed');
      }
    } finally {
      if (silent) setRefreshing(false);
      else setBusy(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  /**
   * Background refresh, paused while the tab is hidden.
   *
   * A backgrounded tab that keeps polling costs a production query every thirty
   * seconds for nobody's benefit, and browsers throttle the timer unevenly
   * anyway. Coming back to the tab refreshes immediately rather than waiting out
   * the remainder of an interval, so the first thing a returning viewer sees is
   * current.
   */
  useEffect(() => {
    if (status !== 'signed-in') return;

    let timer: number | undefined;

    const stop = () => {
      if (timer !== undefined) {
        window.clearInterval(timer);
        timer = undefined;
      }
    };

    const start = () => {
      stop();
      timer = window.setInterval(() => {
        if (statusRef.current === 'signed-in') void load(true);
      }, REFRESH_INTERVAL_MS);
    };

    const onVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        void load(true);
        start();
      }
    };

    if (!document.hidden) start();
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [status, load]);

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
          <h1 className="mt-5 text-base font-semibold text-ink-50">The console could not load</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-400">{error}</p>
          <button
            type="button"
            onClick={() => void load()}
            className="mt-6 rounded-xl border border-ink-700 bg-ink-850 px-4 py-2.5 text-sm font-medium text-ink-200 transition-colors hover:border-ink-600 hover:text-ink-50"
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
        refreshing={refreshing}
        theme={theme}
        onToggleTheme={toggleTheme}
        lastUpdated={lastUpdated}
        refreshIntervalMs={REFRESH_INTERVAL_MS}
        // A background failure, if there is one. The table keeps showing the
        // last good numbers underneath it.
        staleError={error}
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
