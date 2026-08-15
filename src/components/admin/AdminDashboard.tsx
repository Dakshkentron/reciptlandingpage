/**
 * The company table.
 *
 * Every figure is live from Receipt's database at the moment the page loaded —
 * `generatedAt` records when, and is shown so a stale tab is never mistaken for
 * current numbers.
 *
 * Sorting and filtering happen here, in the browser, over the rows already
 * fetched. That is deliberate: the response is aggregate counts for every
 * company at once, so re-asking the server for a different order would cost a
 * production query to rearrange data the page is already holding.
 *
 * It is dressed like the welcome page on purpose — same grid, same one point of
 * warm light, same card and chip shapes. An internal tool is still a tool
 * people look at every day, and the signed-in half looking unfinished next to
 * the signed-out half made the whole thing read as a prototype.
 */

import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Building2,
  Link2,
  LogOut,
  MessageSquareText,
  Radio,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import ReceiptMark from '@/components/ReceiptMark';
import type {
  AdminCompanyRow,
  AdminOverview,
  AdminPromptRow,
  AdminTotals,
} from '@/lib/adminTypes';

const numberFormat = new Intl.NumberFormat('en-US');
const dateFormat = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

function formatDate(value: string | null): string {
  if (!value) return 'Never';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? 'Never' : dateFormat.format(parsed);
}

/**
 * "4 days ago" answers the question this column is actually asked — how stale is
 * this — without the reader having to subtract dates in their head. The exact
 * date stays underneath it, because for anything older than a month that is the
 * more useful of the two.
 */
function relativeDays(value: string | null): string {
  if (!value) return 'Never';
  const parsed = new Date(value).getTime();
  if (Number.isNaN(parsed)) return 'Never';

  const days = Math.floor((Date.now() - parsed) / 86_400_000);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;
  if (days < 365) {
    const months = Math.floor(days / 30);
    return months === 1 ? '1 month ago' : `${months} months ago`;
  }
  const years = Math.floor(days / 365);
  return years === 1 ? '1 year ago' : `${years} years ago`;
}

/**
 * Like `relativeDays`, but resolving to minutes and hours near the present.
 *
 * The prompt feed is the one place on this page where "4 minutes ago" and "9
 * hours ago" are different answers — for everything else, day precision is
 * enough and reads more calmly.
 */
function relativeTime(value: string | null): string {
  if (!value) return 'unknown';
  const parsed = new Date(value).getTime();
  if (Number.isNaN(parsed)) return 'unknown';

  const seconds = Math.floor((Date.now() - parsed) / 1000);
  if (seconds < 60) return 'just now';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  return relativeDays(value).toLowerCase();
}

/** A first name reads as a greeting; a full name or an email reads as a label. */
function firstName(viewer: { name: string; email: string }): string {
  const source = viewer.name?.trim() || viewer.email;
  return source.split(/[\s@.]/)[0] || 'there';
}

/** Stands in for a logo the console does not have, and anchors the row visually. */
function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function formatTime(value: string): string {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? 'unknown'
    : parsed.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

/** Sorts newest-first, with "never" always last rather than at the top. */
function timeValue(value: string | null): number {
  if (!value) return -Infinity;
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? -Infinity : parsed;
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  delay,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  hint: string;
  delay: number;
}) {
  return (
    <div
      className="group animate-fade-up rounded-2xl border border-ink-800 bg-ink-900 p-5 transition-colors hover:border-ink-700"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-ink-800 bg-ink-950 text-brand-400 transition-colors group-hover:border-brand-500/30">
          <Icon className="h-4 w-4" />
        </span>
        <span className="min-w-0 truncate text-xs font-medium uppercase tracking-wider text-ink-400">
          {label}
        </span>
      </div>
      <div className="mt-4 font-mono text-3xl font-bold tabular-nums leading-none text-white">
        {numberFormat.format(value)}
      </div>
      <div className="mt-2 text-xs text-ink-500">{hint}</div>
    </div>
  );
}

function SummaryCards({ totals }: { totals: AdminTotals }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <StatCard
        icon={Building2}
        label="Companies"
        value={totals.companies}
        hint="Organizations on Receipt"
        delay={0}
      />
      <StatCard
        icon={Users}
        label="Members"
        value={totals.members}
        hint="People across all companies"
        delay={60}
      />
      <StatCard
        icon={Link2}
        label="Integrations"
        value={totals.integrations}
        hint="Connections created"
        delay={120}
      />
      {/* The seven-day figure leads because it answers "is Receipt being used",
          which the all-time total cannot — a large lifetime count and a dead
          week look the same in one number. */}
      <StatCard
        icon={MessageSquareText}
        label="Prompts · 7 days"
        value={totals.promptsLast7Days}
        hint={`${numberFormat.format(totals.prompts)} all time`}
        delay={180}
      />
      <StatCard
        icon={Radio}
        label="Active sessions"
        value={totals.activeSessions}
        hint="Sessions not yet expired"
        delay={240}
      />
    </div>
  );
}

type SortKey =
  | 'name'
  | 'createdAt'
  | 'members'
  | 'promptsLast7Days'
  | 'lastLoginAt'
  | 'activeSessions';

interface Column {
  key: SortKey;
  label: string;
  numeric?: boolean;
  /** Which way a first click should sort: names read A–Z, everything else biggest or newest first. */
  ascendingFirst?: boolean;
}

const COLUMNS: Record<SortKey, Column> = {
  name: { key: 'name', label: 'Company', ascendingFirst: true },
  createdAt: { key: 'createdAt', label: 'Created' },
  members: { key: 'members', label: 'Members', numeric: true },
  promptsLast7Days: { key: 'promptsLast7Days', label: 'Prompts · 7d', numeric: true },
  lastLoginAt: { key: 'lastLoginAt', label: 'Last login' },
  activeSessions: { key: 'activeSessions', label: 'Active sessions', numeric: true },
};

interface SortState {
  key: SortKey;
  ascending: boolean;
}

function SortableHeader({
  column,
  sort,
  onSort,
}: {
  column: Column;
  sort: SortState;
  onSort: (key: SortKey) => void;
}) {
  const active = sort.key === column.key;
  const Arrow = active && sort.ascending ? ArrowUp : ArrowDown;

  return (
    <th
      scope="col"
      aria-sort={active ? (sort.ascending ? 'ascending' : 'descending') : 'none'}
      className={`whitespace-nowrap px-5 py-3.5 font-medium ${column.numeric ? 'text-right' : ''}`}
    >
      <button
        type="button"
        onClick={() => onSort(column.key)}
        className={`inline-flex items-center gap-1 uppercase tracking-wider transition-colors hover:text-ink-100 ${
          active ? 'text-ink-100' : ''
        } ${column.numeric ? 'flex-row-reverse' : ''}`}
      >
        {column.label}
        {/* The arrow keeps its space when inactive, so a column does not shift
            sideways the moment it is sorted. */}
        <Arrow
          className={`h-3 w-3 transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`}
          aria-hidden="true"
        />
      </button>
    </th>
  );
}

/** Beyond this the chips wrap into a block that dwarfs every other cell. */
const VISIBLE_PROVIDERS = 4;

function CompanyRow({ company }: { company: AdminCompanyRow }) {
  const expired = Math.max(0, company.integrationsTotal - company.integrationsValid);
  const shown = company.providers.slice(0, VISIBLE_PROVIDERS);
  const hidden = company.providers.length - shown.length;

  return (
    <tr className="border-t border-ink-800 transition-colors hover:bg-ink-900/60">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <span
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-ink-800 bg-ink-900 font-mono text-[11px] font-semibold text-brand-400"
            aria-hidden="true"
          >
            {initials(company.name)}
          </span>
          <div className="min-w-0">
            <div className="truncate font-medium text-ink-100">{company.name}</div>
            {company.slug && (
              <div className="truncate font-mono text-[11px] text-ink-500">{company.slug}</div>
            )}
          </div>
        </div>
      </td>

      <td className="whitespace-nowrap px-5 py-4">
        <div className="text-ink-300">{relativeDays(company.createdAt)}</div>
        <div className="text-[11px] text-ink-500">{formatDate(company.createdAt)}</div>
      </td>

      <td className="px-5 py-4 text-right font-mono tabular-nums text-ink-200">
        {numberFormat.format(company.members)}
      </td>

      {/* The recent count is the headline and the lifetime total sits under it:
          a company that sent five thousand prompts last year and none this week
          is a different situation from one that just started. */}
      <td className="whitespace-nowrap px-5 py-4 text-right">
        <div
          className={`font-mono tabular-nums ${
            company.promptsLast7Days > 0 ? 'text-ink-100' : 'text-ink-600'
          }`}
        >
          {numberFormat.format(company.promptsLast7Days)}
        </div>
        <div className="text-[11px] text-ink-500">
          {company.prompts > 0
            ? `${numberFormat.format(company.prompts)} all time`
            : 'Never used'}
        </div>
      </td>

      <td className="px-5 py-4">
        {company.providers.length === 0 ? (
          <span className="text-ink-500">None connected</span>
        ) : (
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-1">
              {shown.map((provider) => (
                <span
                  key={provider}
                  className="rounded-full border border-ink-700 bg-ink-850 px-2.5 py-0.5 text-xs text-ink-200"
                >
                  {provider}
                </span>
              ))}
              {hidden > 0 && (
                <span className="text-[11px] text-ink-500">+{hidden} more</span>
              )}
            </div>
            {/* Expired connections are the actionable signal: a company whose
                connections have lapsed has quietly stopped working. */}
            {expired > 0 ? (
              <span className="flex w-fit items-center gap-1.5 rounded-full border border-accent-500/30 bg-accent-500/10 px-2.5 py-0.5 text-xs text-accent-200">
                <AlertTriangle className="h-3 w-3" />
                {expired} need{expired === 1 ? 's' : ''} reconnecting
              </span>
            ) : (
              <span className="flex w-fit items-center gap-1.5 text-[11px] text-ink-500">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-500" aria-hidden="true" />
                All {company.integrationsValid} connected
              </span>
            )}
          </div>
        )}
      </td>

      <td className="whitespace-nowrap px-5 py-4">
        <div className={company.lastLoginAt ? 'text-ink-300' : 'text-ink-500'}>
          {relativeDays(company.lastLoginAt)}
        </div>
        {company.lastLoginAt && (
          <div className="text-[11px] text-ink-500">{formatDate(company.lastLoginAt)}</div>
        )}
      </td>

      <td className="px-5 py-4 text-right">
        {company.activeSessions > 0 ? (
          <span className="inline-flex items-center gap-1.5 font-mono tabular-nums text-ink-200">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" aria-hidden="true" />
            {numberFormat.format(company.activeSessions)}
          </span>
        ) : (
          <span className="font-mono tabular-nums text-ink-600">0</span>
        )}
      </td>
    </tr>
  );
}

/**
 * The newest prompts across every company.
 *
 * This is the one part of the console showing something a person wrote rather
 * than a number counted, which is why it is set apart rather than folded into
 * the table. Receipt sends at most a hundred, already truncated, and never the
 * assistant's reply — so this is a sample of what customers are asking for, not
 * a transcript, and the footnote says so rather than leaving it to be assumed.
 */
function PromptFeed({ prompts, filtered }: { prompts: AdminPromptRow[]; filtered: boolean }) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="text-base font-semibold text-white">Recent prompts</h2>
        <p className="text-xs text-ink-500">
          {prompts.length === 0
            ? 'Nothing to show'
            : `Showing the ${numberFormat.format(prompts.length)} most recent`}
        </p>
      </div>

      {prompts.length === 0 ? (
        <div className="rounded-2xl border border-ink-800 bg-ink-950/40 px-5 py-16 text-center">
          <MessageSquareText className="mx-auto h-6 w-6 text-ink-700" aria-hidden="true" />
          <p className="mt-3 text-sm text-ink-400">
            {filtered
              ? 'No prompts match that filter.'
              : 'No prompts yet. They will appear here as customers use Receipt.'}
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {prompts.map((prompt) => (
            <li
              key={prompt.messageId}
              className="rounded-2xl border border-ink-800 bg-ink-900/60 p-4 transition-colors hover:border-ink-700"
            >
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                <span
                  className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-ink-800 bg-ink-950 font-mono text-[10px] font-semibold text-brand-400"
                  aria-hidden="true"
                >
                  {initials(prompt.organizationName)}
                </span>
                <span className="min-w-0 truncate text-sm font-medium text-ink-200">
                  {prompt.organizationName}
                </span>
                <span className="text-ink-700" aria-hidden="true">
                  ·
                </span>
                <span className="whitespace-nowrap text-xs text-ink-500">
                  {relativeTime(prompt.createdAt)}
                </span>
                {prompt.model && (
                  <span className="ml-auto whitespace-nowrap rounded-full border border-ink-800 bg-ink-950 px-2 py-0.5 font-mono text-[10px] text-ink-400">
                    {prompt.model}
                  </span>
                )}
              </div>

              {/* `break-words` matters here: a pasted URL or stack trace has no
                  spaces to wrap on and would otherwise widen the whole page. */}
              <p className="mt-2.5 whitespace-pre-wrap break-words text-sm leading-relaxed text-ink-300">
                {prompt.text}
                {prompt.truncated && <span className="text-ink-600">… </span>}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

interface Props {
  data: AdminOverview;
  onSignOut: () => void;
  onReload: () => void;
  busy: boolean;
  /** A background poll is in flight — distinct from a click on Refresh. */
  refreshing: boolean;
  /** A failed background poll. The figures on screen are the last good ones. */
  staleError: string | null;
}

export default function AdminDashboard({
  data,
  onSignOut,
  onReload,
  busy,
  refreshing,
  staleError,
}: Props) {
  const [query, setQuery] = useState('');
  // Newest company first: the default question this page gets asked is "who
  // signed up recently".
  const [sort, setSort] = useState<SortState>({ key: 'createdAt', ascending: false });

  const onSort = (key: SortKey) => {
    setSort((prev) =>
      prev.key === key
        ? { key, ascending: !prev.ascending }
        : { key, ascending: Boolean(COLUMNS[key].ascendingFirst) },
    );
  };

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = needle
      ? data.companies.filter(
          (company) =>
            company.name.toLowerCase().includes(needle) ||
            company.slug.toLowerCase().includes(needle) ||
            company.providers.some((provider) => provider.toLowerCase().includes(needle)),
        )
      : data.companies;

    const direction = sort.ascending ? 1 : -1;
    // Copied before sorting: `filtered` may be `data.companies` itself, and
    // sorting in place would quietly reorder the prop.
    return [...filtered].sort((a, b) => {
      switch (sort.key) {
        case 'name':
          return a.name.localeCompare(b.name) * direction;
        case 'createdAt':
          return (timeValue(a.createdAt) - timeValue(b.createdAt)) * direction;
        case 'lastLoginAt':
          return (timeValue(a.lastLoginAt) - timeValue(b.lastLoginAt)) * direction;
        case 'members':
          return (a.members - b.members) * direction;
        case 'promptsLast7Days':
          return (a.promptsLast7Days - b.promptsLast7Days) * direction;
        case 'activeSessions':
          return (a.activeSessions - b.activeSessions) * direction;
      }
    });
  }, [data.companies, query, sort]);

  /**
   * The same search box narrows the feed, matching either the company or the
   * words in the prompt. Typing a customer's name and getting their table row
   * without their prompts would read as a bug.
   */
  const visiblePrompts = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return data.recentPrompts;
    return data.recentPrompts.filter(
      (prompt) =>
        prompt.organizationName.toLowerCase().includes(needle) ||
        prompt.text.toLowerCase().includes(needle),
    );
  }, [data.recentPrompts, query]);

  /** Companies with a lapsed connection — the one number worth acting on today. */
  const needAttention = useMemo(
    () =>
      data.companies.filter((company) => company.integrationsTotal > company.integrationsValid)
        .length,
    [data.companies],
  );

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ink-950 text-ink-200">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-grid mask-fade-b"
        aria-hidden="true"
      />
      {/* The same single point of warm light the welcome page opens with, so
          signing in does not feel like arriving at a different product. */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[26rem] w-[56rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/10 blur-3xl"
        aria-hidden="true"
      />

      <header className="sticky top-0 z-10 border-b border-ink-800/80 bg-ink-950/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-3 gap-y-2 px-5 py-3.5 lg:px-8">
          <div className="flex items-center gap-2.5">
            <ReceiptMark className="h-6 w-6 text-brand-500" paperClassName="text-ink-950" />
            <span className="font-bold text-white">Receipt</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-ink-700 bg-ink-850 px-2.5 py-0.5 text-[11px] font-medium text-ink-300">
              <ShieldCheck className="h-3 w-3 text-brand-400" />
              Internal
            </span>
          </div>

          <div className="ml-auto flex items-center gap-2.5">
            <span className="hidden max-w-[16rem] truncate text-xs text-ink-400 sm:inline">
              {data.viewer.email}
            </span>
            <button
              type="button"
              onClick={onReload}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-ink-700 bg-ink-850 px-3 py-1.5 text-xs font-medium text-ink-200 transition-colors hover:border-ink-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${busy ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              type="button"
              onClick={onSignOut}
              className="inline-flex items-center gap-1.5 rounded-lg border border-ink-700 bg-ink-850 px-3 py-1.5 text-xs font-medium text-ink-200 transition-colors hover:border-ink-600 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-ink-800 bg-ink-900 px-3 py-1 text-xs font-medium text-ink-300">
            <span className="relative flex h-1.5 w-1.5">
              <span
                className={`absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-60 ${
                  refreshing ? 'animate-ping' : ''
                }`}
              />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-500" />
            </span>
            Live from production · as of {formatTime(data.generatedAt)}
          </span>

          <p className="mt-6 text-sm font-medium text-brand-400">
            Hi {firstName(data.viewer)}, welcome back
          </p>
          <h1 className="mt-1.5 text-3xl font-bold tracking-tight text-white sm:text-[2rem]">
            Track your customers and users, live
          </h1>
          <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-ink-400">
            Every organization on Receipt, the integrations they run, how recently they signed in,
            and what they are asking Receipt to do — read straight from production and refreshed
            every half minute.
          </p>
        </div>

        {/* A background refresh that failed. The page keeps the last good
            numbers rather than replacing them with an error, so this line is
            what stops them being read as current. */}
        {staleError && (
          <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-accent-500/30 bg-accent-500/10 px-4 py-3 text-xs leading-relaxed text-accent-200">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>
              These figures are from {formatTime(data.generatedAt)} and may be out of date — the
              last refresh failed: {staleError}
            </span>
          </div>
        )}

        <div className="mt-9 flex flex-col gap-6">
          <SummaryCards totals={data.totals} />

          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <div className="relative w-full max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Filter by company or integration"
                aria-label="Filter companies"
                className="w-full rounded-xl border border-ink-800 bg-ink-900 py-2.5 pl-9 pr-3 text-sm text-ink-100 placeholder:text-ink-500 transition-colors focus:border-brand-500/50 focus:outline-none focus:ring-1 focus:ring-brand-500/30"
              />
            </div>

            <p className="text-xs text-ink-500" aria-live="polite">
              {query
                ? `${numberFormat.format(visible.length)} of ${numberFormat.format(data.companies.length)} companies`
                : `${numberFormat.format(data.companies.length)} companies`}
            </p>

            {needAttention > 0 && (
              <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-accent-500/30 bg-accent-500/10 px-3 py-1 text-xs text-accent-200">
                <AlertTriangle className="h-3.5 w-3.5" />
                {numberFormat.format(needAttention)}{' '}
                {needAttention === 1 ? 'company has' : 'companies have'} a lapsed connection
              </span>
            )}
          </div>

          {/* Wide content scrolls inside its own container so the page never does. */}
          <div className="overflow-x-auto rounded-2xl border border-ink-800 bg-ink-950/40">
            <table className="w-full min-w-[64rem] text-left text-sm">
              <thead className="bg-ink-900 text-xs uppercase tracking-wider text-ink-400">
                <tr>
                  <SortableHeader column={COLUMNS.name} sort={sort} onSort={onSort} />
                  <SortableHeader column={COLUMNS.createdAt} sort={sort} onSort={onSort} />
                  <SortableHeader column={COLUMNS.members} sort={sort} onSort={onSort} />
                  <SortableHeader column={COLUMNS.promptsLast7Days} sort={sort} onSort={onSort} />
                  {/* Not sortable: a company's integrations are a set of names,
                      with no single value to order the table by. */}
                  <th scope="col" className="whitespace-nowrap px-5 py-3.5 font-medium">
                    Integrations
                  </th>
                  <SortableHeader column={COLUMNS.lastLoginAt} sort={sort} onSort={onSort} />
                  <SortableHeader column={COLUMNS.activeSessions} sort={sort} onSort={onSort} />
                </tr>
              </thead>
              <tbody>
                {visible.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-16 text-center">
                      <Building2
                        className="mx-auto h-6 w-6 text-ink-700"
                        aria-hidden="true"
                      />
                      <p className="mt-3 text-sm text-ink-400">
                        {query ? 'No companies match that filter.' : 'No companies yet.'}
                      </p>
                      {query && (
                        <button
                          type="button"
                          onClick={() => setQuery('')}
                          className="mt-4 rounded-lg border border-ink-700 bg-ink-850 px-3 py-1.5 text-xs font-medium text-ink-200 transition-colors hover:border-ink-600 hover:text-white"
                        >
                          Clear filter
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  visible.map((company) => (
                    <CompanyRow key={company.organizationId} company={company} />
                  ))
                )}
              </tbody>
            </table>
          </div>

          <PromptFeed prompts={visiblePrompts} filtered={Boolean(query.trim())} />

          <p className="text-xs leading-relaxed text-ink-500">
            “Active sessions” counts sessions that have not expired, which can outlast someone
            actually being at their desk — it is not a measure of who is online now. Prompt counts
            cover what people typed into Receipt chat; background agent runs are excluded, and the
            feed shows the most recent prompts only, truncated, without the replies.
          </p>
        </div>
      </main>

      <footer className="relative border-t border-ink-800/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex items-center gap-2">
            <ReceiptMark className="h-4 w-4 text-ink-600" paperClassName="text-ink-950" />
            Receipt is a product of Kentron Inc. Internal use only.
          </div>
          <span>Aggregate counts only · logged on every view</span>
        </div>
      </footer>
    </div>
  );
}
