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

import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Building2,
  ChevronRight,
  Link2,
  LogOut,
  Check,
  Copy,
  MessageSquareText,
  Moon,
  Radio,
  RefreshCw,
  Search,
  ShieldCheck,
  Info,
  Sun,
  Users,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import ReceiptMark from '@/components/ReceiptMark';
import type { Theme } from '@/components/admin/AdminConsole';
import type {
  AdminCompanyRow,
  AdminOverview,
  AdminPromptRow,
  AdminRunDetail,
  AdminRunStep,
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

/**
 * A date as a number, for sorting. `null` and unparseable dates sink to the
 * bottom in either direction rather than floating to the top.
 *
 * The sentinel is `Number.NEGATIVE_INFINITY` conceptually but must not be used
 * as one in arithmetic: two missing dates gave `-Infinity - -Infinity`, which
 * is `NaN`, and a comparator that returns NaN leaves the order undefined. With
 * more than ten rows V8 uses an insertion sort whose result then depends on the
 * order the rows arrived in -- which is exactly the reported symptom of a
 * newly created workspace sitting below a sixteen-day-old one. `compareTime`
 * below is the only thing that should read this.
 */
const NO_DATE = Number.NEGATIVE_INFINITY;

function timeValue(value: string | null): number {
  if (!value) return NO_DATE;
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? NO_DATE : parsed;
}

/**
 * Compares two dates without ever producing NaN, and keeps missing dates last.
 *
 * Returned as a "bigger is later" number that the caller multiplies by the sort
 * direction, so missing dates are pulled out first -- otherwise flipping to
 * ascending would float every "Never" to the top of the table.
 */
function compareTime(a: string | null, b: string | null, direction: number): number {
  const left = timeValue(a);
  const right = timeValue(b);
  if (left === NO_DATE && right === NO_DATE) return 0;
  // Missing dates are last whichever way the column is pointing, so the
  // direction is deliberately not applied to these two branches.
  if (left === NO_DATE) return 1;
  if (right === NO_DATE) return -1;
  return (left - right) * direction;
}

/**
 * An identifier you can read and take away with you.
 *
 * Ids are the thing people paste into tickets, and selecting monospace text out
 * of a table row by hand is fiddly and easy to get subtly wrong -- a missing
 * leading character in a copied id is a bug report that goes nowhere. The
 * button copies the whole value and says so.
 *
 * `navigator.clipboard` is unavailable over plain HTTP and can be refused by
 * permissions policy, so the failure is caught and the label simply does not
 * change to "Copied" -- the id itself stays selectable either way.
 */
function CopyableId({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timer);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        void navigator.clipboard
          ?.writeText(value)
          .then(() => setCopied(true))
          .catch(() => {
            // Clipboard refused; the value is still on screen to select.
          });
      }}
      title={`Copy ${label}`}
      className="group/id inline-flex max-w-full items-center gap-1.5 rounded-md border border-ink-800 bg-ink-950 px-2 py-0.5 font-mono text-[11px] text-ink-400 transition-colors hover:border-ink-600 hover:text-ink-200"
    >
      <span className="truncate">{value}</span>
      {copied ? (
        <Check className="h-3 w-3 shrink-0 text-brand-400" aria-hidden="true" />
      ) : (
        <Copy
          className="h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover/id:opacity-100"
          aria-hidden="true"
        />
      )}
      <span className="sr-only">{copied ? `${label} copied` : `Copy ${label}`}</span>
    </button>
  );
}

/** One label/value line in the prompt inspector. */
function MetaRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-2">
      <dt className="w-32 shrink-0 text-[11px] font-medium uppercase tracking-wider text-ink-500">
        {label}
      </dt>
      <dd className="min-w-0 flex-1 text-sm text-ink-200">{children}</dd>
    </div>
  );
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
      <div className="mt-4 font-mono text-3xl font-bold tabular-nums leading-none text-ink-50">
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
  | 'prompts'
  | 'lastLoginAt'
  | 'lastPromptAt'
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
  prompts: { key: 'prompts', label: 'Prompts · all time', numeric: true },
  lastPromptAt: { key: 'lastPromptAt', label: 'Last prompt' },
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

function CompanyRow({
  company,
  onOpen,
}: {
  company: AdminCompanyRow;
  onOpen: (company: AdminCompanyRow) => void;
}) {
  const expired = Math.max(0, company.integrationsTotal - company.integrationsValid);
  const shown = company.providers.slice(0, VISIBLE_PROVIDERS);
  const hidden = company.providers.length - shown.length;

  return (
    <tr
      onClick={() => onOpen(company)}
      className="cursor-pointer border-t border-ink-800 transition-colors hover:bg-ink-900/60"
    >
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <span
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-ink-800 bg-ink-900 font-mono text-[11px] font-semibold text-brand-400"
            aria-hidden="true"
          >
            {initials(company.name)}
          </span>
          <div className="min-w-0">
            {/* A real button, so the report is reachable by keyboard and
                announced as actionable. The row click is a convenience on top
                of it, not the only way in. */}
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onOpen(company);
              }}
              className="block max-w-full truncate text-left font-medium text-ink-100 transition-colors hover:text-ink-50 focus:outline-none focus-visible:underline"
            >
              {company.name}
            </button>
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

      <td className="whitespace-nowrap px-5 py-4">
        <div className={company.lastPromptAt ? 'text-ink-300' : 'text-ink-500'}>
          {relativeDays(company.lastPromptAt)}
        </div>
        {company.lastPromptAt && (
          <div className="text-[11px] text-ink-500">{formatDate(company.lastPromptAt)}</div>
        )}
      </td>

      <td className="px-5 py-4 text-right">
        <div className="flex items-center justify-end gap-3">
          {company.activeSessions > 0 ? (
            <span className="inline-flex items-center gap-1.5 font-mono tabular-nums text-ink-200">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" aria-hidden="true" />
              {numberFormat.format(company.activeSessions)}
            </span>
          ) : (
            <span className="font-mono tabular-nums text-ink-600">0</span>
          )}
          <ChevronRight className="h-4 w-4 shrink-0 text-ink-600" aria-hidden="true" />
        </div>
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
function PromptFeed({
  prompts,
  filtered,
  onOpen,
}: {
  prompts: AdminPromptRow[];
  filtered: boolean;
  onOpen: (prompt: AdminPromptRow) => void;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="text-base font-semibold text-ink-50">Recent prompts</h2>
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
            <li key={prompt.messageId}>
              {/* A button, so the whole card is one keyboard-reachable target
                  that opens the full record rather than a div that only
                  responds to a mouse. */}
              <button
                type="button"
                onClick={() => onOpen(prompt)}
                className="w-full rounded-2xl border border-ink-800 bg-ink-900/60 p-4 text-left transition-colors hover:border-ink-700 hover:bg-ink-900 focus:outline-none focus-visible:border-brand-500/50"
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
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/** The exact moment, spelled out, for when "38m ago" is not precise enough. */
const exactFormat = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  second: '2-digit',
  timeZoneName: 'short',
});

function formatExact(value: string | null): string {
  if (!value) return 'Unknown';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? 'Unknown' : exactFormat.format(parsed);
}

/** The exact moment, spelled out — same reasoning as `formatExact` above it. */
function formatExactOrDash(value: string | null): string {
  if (!value) return '—';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? '—' : exactFormat.format(parsed);
}

const usdFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});

/** One row in the objective's step timeline. */
function StepRow({ step }: { step: AdminRunStep }) {
  return (
    <li className="flex items-baseline gap-3 border-t border-ink-800 py-2 first:border-t-0">
      <span className="w-16 shrink-0 font-mono text-[11px] text-ink-500">#{step.seq}</span>
      <span className="min-w-0 flex-1 truncate font-mono text-xs text-ink-200">
        {step.eventType}
      </span>
      <span className="shrink-0 text-[11px] text-ink-500">{formatExactOrDash(step.ts)}</span>
    </li>
  );
}

/**
 * The execution trace, loaded on demand.
 *
 * `/api/admin-run` resolves the run behind this prompt from real columns —
 * `receipt_session_messages`, `receipt_job_projection`,
 * `receipt_objective_projection`, and `receipt_receipts` — rather than
 * guessing at an endpoint. Most chat prompts are answered inline and never
 * touch an objective at all, which is the ordinary case here, not a failure:
 * `objective` is simply null and the panel says so. It never shows message
 * text from either side; see `admin-run-sql.ts` in Receipt for why that line
 * is drawn the same place `AdminPromptRow` draws it.
 */
function ExecutionTrace({ messageId }: { messageId: string }) {
  const [state, setState] = useState<
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'error'; message: string }
    | { status: 'loaded'; detail: AdminRunDetail }
  >({ status: 'idle' });

  const load = async () => {
    setState({ status: 'loading' });
    try {
      const api = await import('@/lib/adminApi');
      const detail = await api.fetchRunDetail(messageId);
      setState({ status: 'loaded', detail });
    } catch (err) {
      setState({
        status: 'error',
        message: err instanceof Error ? err.message : 'Could not load the run detail.',
      });
    }
  };

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-medium uppercase tracking-wider text-ink-500">
          Execution trace
        </h3>
        {state.status !== 'loading' && (
          <button
            type="button"
            onClick={() => void load()}
            className="rounded-md border border-ink-700 bg-ink-850 px-3 py-1 text-xs font-medium text-ink-200 transition-colors hover:border-ink-600 hover:text-ink-50"
          >
            {state.status === 'loaded' ? 'Reload trace' : 'Load trace'}
          </button>
        )}
      </div>

      {state.status === 'idle' && (
        <div className="flex items-start gap-2.5 rounded-xl border border-ink-800 bg-ink-950/60 px-4 py-3.5">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-500" aria-hidden="true" />
          <p className="text-xs leading-relaxed text-ink-400">
            Timing, status, cost, and — for prompts a background objective carried out — that
            objective's id and step timeline. Not message text, from either side.
          </p>
        </div>
      )}

      {state.status === 'loading' && (
        <div className="rounded-xl border border-ink-800 bg-ink-950/40 px-5 py-6 text-center text-xs text-ink-400">
          Loading trace…
        </div>
      )}

      {state.status === 'error' && (
        <div className="rounded-xl border border-ink-800 bg-ink-950/40 px-5 py-6 text-center text-xs text-accent-200">
          {state.message}
        </div>
      )}

      {state.status === 'loaded' && (
        <div className="flex flex-col gap-3 rounded-xl border border-ink-800 bg-ink-900 p-4">
          <dl className="divide-y divide-ink-800">
            <MetaRow label="Run status">
              <span className="font-mono text-xs text-ink-200">{state.detail.status ?? '—'}</span>
            </MetaRow>
            <MetaRow label="Started">
              <span>{formatExactOrDash(state.detail.startedAt)}</span>
            </MetaRow>
            <MetaRow label="Completed">
              <span>{formatExactOrDash(state.detail.completedAt)}</span>
            </MetaRow>
            <MetaRow label="Tokens">
              {state.detail.inputTokens != null || state.detail.outputTokens != null ? (
                <span className="font-mono text-xs text-ink-200">
                  {numberFormat.format(state.detail.inputTokens ?? 0)} in ·{' '}
                  {numberFormat.format(state.detail.outputTokens ?? 0)} out
                </span>
              ) : (
                <span className="text-ink-500">Not recorded</span>
              )}
            </MetaRow>
            <MetaRow label="Cost">
              {state.detail.estimatedCost != null ? (
                <span className="font-mono text-xs text-ink-200">
                  {usdFormat.format(state.detail.estimatedCost)}
                </span>
              ) : (
                <span className="text-ink-500">Not recorded</span>
              )}
            </MetaRow>
            {state.detail.serverError && (
              <MetaRow label="Error">
                <span className="text-xs text-accent-200">{state.detail.serverError}</span>
              </MetaRow>
            )}
          </dl>

          {state.detail.objective ? (
            <div className="flex flex-col gap-2 rounded-lg border border-ink-800 bg-ink-950 p-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-medium uppercase tracking-wider text-ink-500">
                  Objective
                </span>
                <span className="rounded-full border border-ink-700 bg-ink-850 px-2 py-0.5 text-[11px] text-ink-300">
                  {state.detail.objective.status}
                </span>
              </div>
              <p className="text-sm text-ink-100">{state.detail.objective.title}</p>
              {state.detail.objective.latestSummary && (
                <p className="text-xs leading-relaxed text-ink-400">
                  {state.detail.objective.latestSummary}
                </p>
              )}
              <CopyableId value={state.detail.objective.objectiveId} label="objective ID" />

              {state.detail.steps.length > 0 && (
                <div className="mt-1">
                  <h4 className="text-[11px] font-medium uppercase tracking-wider text-ink-500">
                    Steps · {numberFormat.format(state.detail.steps.length)}
                  </h4>
                  <ul className="mt-1 max-h-64 overflow-y-auto">
                    {state.detail.steps.map((step) => (
                      <StepRow key={step.seq} step={step} />
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="flex items-start gap-2 text-xs leading-relaxed text-ink-500">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>
                This prompt was answered inline in chat rather than by a background objective, so
                there is no objective id or step log for it — that is the ordinary case.
              </span>
            </p>
          )}
        </div>
      )}
    </section>
  );
}

/**
 * One prompt, opened.
 *
 * The feed is built for scanning, which means it truncates and it drops the
 * ids. This is the other half: the full text as it was received, the message
 * and organization ids in a form you can copy, the model that answered, and the
 * exact timestamp rather than a relative one — plus, on request, the real
 * execution trace behind it (see `ExecutionTrace` above).
 *
 * What this still does not show is the assistant's reply. Receipt's
 * `/api/admin-metrics` returns a prompt as text plus ids, and `/api/admin-run`
 * returns run metadata, but neither carries message content from the model's
 * side -- that boundary is deliberate, not a gap in what was wired up.
 */
function PromptInspector({
  prompt,
  onClose,
}: {
  prompt: AdminPromptRow;
  onClose: () => void;
}) {
  // Escape closes it, which is what a panel over the page is expected to do.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-30 flex justify-end">
      <div
        className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Prompt detail"
        className="relative flex h-full w-full max-w-full sm:max-w-xl flex-col overflow-y-auto border-l border-ink-800 bg-ink-900 shadow-2xl"
      >
        <header className="sticky top-0 flex items-center justify-between gap-3 border-b border-ink-800 bg-ink-900/95 px-5 py-4 backdrop-blur">
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-ink-50">Prompt detail</h2>
            <p className="truncate text-xs text-ink-500">{prompt.organizationName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-ink-700 bg-ink-850 px-3 py-1.5 text-xs font-medium text-ink-200 transition-colors hover:border-ink-600 hover:text-ink-50"
          >
            <X className="h-3.5 w-3.5" />
            Close
          </button>
        </header>

        <div className="flex flex-col gap-5 px-5 py-5">
          <dl className="divide-y divide-ink-800">
            <MetaRow label="Message ID">
              <CopyableId value={prompt.messageId} label="message ID" />
            </MetaRow>
            <MetaRow label="Organization">
              <div className="flex flex-col gap-1.5">
                <span className="text-ink-100">{prompt.organizationName}</span>
                <CopyableId value={prompt.organizationId} label="organization ID" />
              </div>
            </MetaRow>
            <MetaRow label="Model">
              {prompt.model ? (
                <span className="font-mono text-xs text-ink-200">{prompt.model}</span>
              ) : (
                <span className="text-ink-500">Not recorded</span>
              )}
            </MetaRow>
            <MetaRow label="Sent">
              <div className="flex flex-col gap-0.5">
                <span>{formatExact(prompt.createdAt)}</span>
                <span className="text-xs text-ink-500">{relativeTime(prompt.createdAt)}</span>
              </div>
            </MetaRow>
          </dl>

          <section className="flex flex-col gap-2">
            <h3 className="text-[11px] font-medium uppercase tracking-wider text-ink-500">
              Prompt text
            </h3>
            <div className="rounded-xl border border-ink-800 bg-ink-950 p-4">
              <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-ink-200">
                {prompt.text}
              </p>
              {prompt.truncated && (
                <p className="mt-3 border-t border-ink-800 pt-3 text-xs text-ink-500">
                  Receipt truncated this before sending it, so the end of the prompt is not
                  available here.
                </p>
              )}
            </div>
          </section>

          <ExecutionTrace messageId={prompt.messageId} />
        </div>
      </aside>
    </div>
  );
}

/** One labelled figure in the company report. */
function DetailStat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-ink-800 bg-ink-900 p-4">
      <div className="text-[11px] font-medium uppercase tracking-wider text-ink-400">{label}</div>
      <div className="mt-2 font-mono text-2xl font-bold tabular-nums leading-none text-ink-50">
        {value}
      </div>
      {hint && <div className="mt-1.5 text-[11px] text-ink-500">{hint}</div>}
    </div>
  );
}

/**
 * Everything known about one company, on its own screen.
 *
 * The table answers "who are our customers and which need attention"; this
 * answers "tell me about this one". Splitting them is what keeps the table
 * readable as the customer list grows — the alternative is a row that has to
 * carry every fact, which stops fitting on a screen at about eight columns.
 *
 * The integrations list matters most here. The table shows the first four and
 * counts the rest, which is fine for scanning but means a company's actual
 * stack is never fully visible anywhere. Here every provider is listed, and
 * lapsed connections are called out rather than folded into a total.
 */
function CompanyDetail({
  company,
  prompts,
  onBack,
  onOpenPrompt,
}: {
  company: AdminCompanyRow;
  prompts: AdminPromptRow[];
  onBack: () => void;
  onOpenPrompt: (prompt: AdminPromptRow) => void;
}) {
  const expired = Math.max(0, company.integrationsTotal - company.integrationsValid);

  return (
    <div className="flex animate-fade-up flex-col gap-6">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-ink-700 bg-ink-850 px-3 py-1.5 text-xs font-medium text-ink-200 transition-colors hover:border-ink-600 hover:text-ink-50"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All companies
      </button>

      <div className="flex flex-wrap items-center gap-4">
        <span
          className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-ink-800 bg-ink-900 font-mono text-sm font-semibold text-brand-400"
          aria-hidden="true"
        >
          {initials(company.name)}
        </span>
        <div className="min-w-0">
          <h2 className="text-2xl font-bold tracking-tight text-ink-50">{company.name}</h2>
          <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-ink-500">
            {company.slug && <span className="font-mono">{company.slug}</span>}
            <span aria-hidden="true">·</span>
            <span>Joined {formatDate(company.createdAt)}</span>
          </div>
          <div className="mt-2">
            <CopyableId value={company.organizationId} label="organization ID" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DetailStat
          label="Members"
          value={numberFormat.format(company.members)}
          hint="People in this company"
        />
        <DetailStat
          label="Integrations"
          value={numberFormat.format(company.integrationsTotal)}
          hint={
            company.integrationsTotal === 0
              ? 'None connected'
              : `${numberFormat.format(company.integrationsValid)} working${
                  expired > 0 ? `, ${numberFormat.format(expired)} lapsed` : ''
                }`
          }
        />
        <DetailStat
          label="Prompts · 7 days"
          value={numberFormat.format(company.promptsLast7Days)}
          hint={`${numberFormat.format(company.prompts)} all time`}
        />
        <DetailStat
          label="Active sessions"
          value={numberFormat.format(company.activeSessions)}
          hint="Sessions not yet expired"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-ink-800 bg-ink-900 p-4">
          <div className="text-[11px] font-medium uppercase tracking-wider text-ink-400">
            Last login
          </div>
          <div className="mt-2 text-sm text-ink-200">{relativeDays(company.lastLoginAt)}</div>
          {company.lastLoginAt && (
            <div className="mt-1 text-[11px] text-ink-500">{formatDate(company.lastLoginAt)}</div>
          )}
        </div>
        <div className="rounded-xl border border-ink-800 bg-ink-900 p-4">
          <div className="text-[11px] font-medium uppercase tracking-wider text-ink-400">
            Last prompt
          </div>
          <div className="mt-2 text-sm text-ink-200">{relativeDays(company.lastPromptAt)}</div>
          {company.lastPromptAt && (
            <div className="mt-1 text-[11px] text-ink-500">{formatDate(company.lastPromptAt)}</div>
          )}
        </div>
      </div>

      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-base font-semibold text-ink-50">Integrations</h3>
          <p className="text-xs text-ink-500">
            {company.integrationsTotal === 0
              ? 'None connected'
              : `${numberFormat.format(company.providers.length)} ${
                  company.providers.length === 1 ? 'provider' : 'providers'
                } across ${numberFormat.format(company.integrationsTotal)} ${
                  company.integrationsTotal === 1 ? 'connection' : 'connections'
                }`}
          </p>
        </div>

        {expired > 0 && (
          <span className="flex w-fit items-center gap-1.5 rounded-full border border-accent-500/30 bg-accent-500/10 px-3 py-1 text-xs text-accent-200">
            <AlertTriangle className="h-3.5 w-3.5" />
            {numberFormat.format(expired)}{' '}
            {expired === 1 ? 'connection needs' : 'connections need'} reconnecting
          </span>
        )}

        {company.providers.length === 0 ? (
          <div className="rounded-xl border border-ink-800 bg-ink-950/40 px-5 py-10 text-center">
            <Link2 className="mx-auto h-5 w-5 text-ink-700" aria-hidden="true" />
            <p className="mt-2.5 text-sm text-ink-400">
              This company has not connected anything yet.
            </p>
          </div>
        ) : (
          // Every provider, not the first four — this is the one place the full
          // stack is visible.
          <div className="flex flex-wrap gap-2">
            {company.providers.map((provider) => (
              <span
                key={provider}
                className="inline-flex items-center gap-2 rounded-lg border border-ink-700 bg-ink-850 px-3 py-1.5 text-sm text-ink-200"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-brand-500" aria-hidden="true" />
                {provider}
              </span>
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-base font-semibold text-ink-50">Prompts from this company</h3>
          <p className="text-xs text-ink-500">
            {prompts.length === 0
              ? 'None in the recent sample'
              : `${numberFormat.format(prompts.length)} of ${numberFormat.format(
                  company.prompts,
                )} shown`}
          </p>
        </div>

        {/* The feed is a global cap across every company, not a per-company
            list, so a busy customer legitimately shows only a handful of its
            thousands here. Without this line that reads as lost data. */}
        {prompts.length > 0 && company.prompts > prompts.length && (
          <p className="flex items-start gap-2 text-xs leading-relaxed text-ink-500">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>
              These are the prompts from this company that fall inside the console's most recent
              sample across all companies — not its full history of{' '}
              {numberFormat.format(company.prompts)}.
            </span>
          </p>
        )}

        {prompts.length === 0 ? (
          <div className="rounded-xl border border-ink-800 bg-ink-950/40 px-5 py-10 text-center">
            <MessageSquareText className="mx-auto h-5 w-5 text-ink-700" aria-hidden="true" />
            <p className="mt-2.5 text-sm text-ink-400">
              {company.prompts > 0
                ? `This company has sent ${numberFormat.format(company.prompts)} prompts, but none are in the most recent sample.`
                : 'This company has not sent any prompts yet.'}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {prompts.map((prompt) => (
              <li key={prompt.messageId}>
                <button
                  type="button"
                  onClick={() => onOpenPrompt(prompt)}
                  className="w-full rounded-xl border border-ink-800 bg-ink-900/60 p-4 text-left transition-colors hover:border-ink-700 hover:bg-ink-900 focus:outline-none focus-visible:border-brand-500/50"
                >
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                    <span className="text-xs text-ink-500">{relativeTime(prompt.createdAt)}</span>
                    {prompt.model && (
                      <span className="ml-auto rounded-full border border-ink-800 bg-ink-950 px-2 py-0.5 font-mono text-[10px] text-ink-400">
                        {prompt.model}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-ink-300">
                    {prompt.text}
                    {prompt.truncated && <span className="text-ink-600">… </span>}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
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
  theme: Theme;
  onToggleTheme: () => void;
  /** Browser-clock time of the last successful fetch, for the countdown. */
  lastUpdated: number;
  refreshIntervalMs: number;
  /** Optional debug: configured Receipt origin */
  receiptOrigin?: string | null;
}

export default function AdminDashboard({
  data,
  onSignOut,
  onReload,
  busy,
  refreshing,
  staleError,
  theme,
  onToggleTheme,
  lastUpdated,
  refreshIntervalMs,
  receiptOrigin,
}: Props) {
  const [query, setQuery] = useState('');
  // Newest company first: the default question this page gets asked is "who
  // signed up recently".
  const [sort, setSort] = useState<SortState>({ key: 'createdAt', ascending: false });
  /**
   * Which company's report is open, held as an id rather than the row itself.
   *
   * The row object is replaced wholesale every thirty seconds by the background
   * refresh. Holding the old one would freeze the report on figures from
   * whenever it was opened; looking it up by id each render means an open
   * report keeps updating like everything else.
   */
  const [selectedId, setSelectedId] = useState<string | null>(null);
  /**
   * The open prompt, held by id for the same reason the company is: the row
   * objects are replaced wholesale by every background refresh.
   */
  const [openPromptId, setOpenPromptId] = useState<string | null>(null);

  /**
   * Re-renders once a second purely to move the countdown and the relative
   * timestamps along. It holds a tick counter rather than a formatted string so
   * that every "4m ago" on the page ages, not just the header.
   */
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setTick((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const secondsToRefresh = Math.max(
    0,
    Math.ceil((lastUpdated + refreshIntervalMs - Date.now()) / 1000),
  );

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
            // The organization id is searchable because it is the one value
            // that is stable, unambiguous, and quotable in a ticket or a Slack
            // thread. Pasting an id someone sent you and getting nothing back
            // was the single most confusing thing about this box.
            company.organizationId.toLowerCase().includes(needle) ||
            company.providers.some((provider) => provider.toLowerCase().includes(needle)),
        )
      : data.companies;

    const direction = sort.ascending ? 1 : -1;

    /**
     * Breaks ties by name so the order is total.
     *
     * Rows that compare equal -- two companies with no `createdAt`, or the same
     * member count -- otherwise keep whatever order the server happened to send,
     * which can differ between two refreshes of the same data and makes rows
     * appear to swap places on their own every few seconds.
     */
    const byName = (a: AdminCompanyRow, b: AdminCompanyRow) =>
      a.name.localeCompare(b.name);
    // Copied before sorting: `filtered` may be `data.companies` itself, and
    // sorting in place would quietly reorder the prop.
    return [...filtered].sort((a, b) => {
      switch (sort.key) {
        case 'name':
          return a.name.localeCompare(b.name) * direction;
        case 'createdAt':
          return compareTime(a.createdAt, b.createdAt, direction) || byName(a, b);
        case 'lastLoginAt':
          return compareTime(a.lastLoginAt, b.lastLoginAt, direction) || byName(a, b);
        case 'lastPromptAt':
          return compareTime(a.lastPromptAt, b.lastPromptAt, direction) || byName(a, b);
        case 'prompts':
          return (a.prompts - b.prompts) * direction || byName(a, b);
        case 'members':
          return (a.members - b.members) * direction || byName(a, b);
        case 'promptsLast7Days':
          return (a.promptsLast7Days - b.promptsLast7Days) * direction || byName(a, b);
        case 'activeSessions':
          return (a.activeSessions - b.activeSessions) * direction || byName(a, b);
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
        prompt.text.toLowerCase().includes(needle) ||
        // Both ids match, so a message id from a bug report and an organization
        // id from the table both find their way here.
        prompt.messageId.toLowerCase().includes(needle) ||
        prompt.organizationId.toLowerCase().includes(needle) ||
        (prompt.model?.toLowerCase().includes(needle) ?? false),
    );
  }, [data.recentPrompts, query]);

  /**
   * Resolved fresh from the latest data each render. Falls back to null if the
   * company disappeared between refreshes, which sends the page back to the
   * list rather than rendering a report about nothing.
   */
  const selected = useMemo(
    () => data.companies.find((company) => company.organizationId === selectedId) ?? null,
    [data.companies, selectedId],
  );

  /**
   * Resolved from the current data, so an open panel follows the refresh. If the
   * prompt falls out of the sample it closes rather than showing a frozen copy.
   */
  const openPrompt = useMemo(
    () => data.recentPrompts.find((prompt) => prompt.messageId === openPromptId) ?? null,
    [data.recentPrompts, openPromptId],
  );

  const selectedPrompts = useMemo(
    () =>
      selected
        ? data.recentPrompts.filter((prompt) => prompt.organizationId === selected.organizationId)
        : [],
    [data.recentPrompts, selected],
  );

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
            <span className="font-bold text-ink-50">Receipt</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-ink-700 bg-ink-850 px-2.5 py-0.5 text-[11px] font-medium text-ink-300">
              <ShieldCheck className="h-3 w-3 text-brand-400" />
              Internal
            </span>
            {/* TEMPORARY — the one place the demo announces itself, so the rest
                of the page can show what real data will look like. Present for
                exactly as long as api/_lib/demo.ts is. */}
            {data.demo && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-500/40 bg-accent-500/10 px-2.5 py-0.5 text-[11px] font-medium text-accent-200">
                <AlertTriangle className="h-3 w-3" />
                Demo data
              </span>
            )}
          </div>

          <div className="ml-auto flex items-center gap-2.5">
            <span className="hidden max-w-[16rem] truncate text-xs text-ink-400 sm:inline">
              {data.viewer.email}
            </span>
            {receiptOrigin && (
              <span className="hidden truncate rounded-full border border-ink-700 bg-ink-850 px-2.5 py-0.5 text-xs text-ink-300 sm:inline">
                Receipt: {receiptOrigin}
              </span>
            )}
            {/* Sits next to Refresh rather than behind a settings menu: it is a
                one-click preference, and a menu holding a single item is a
                worse trade than the width this costs. */}
            <button
              type="button"
              onClick={onToggleTheme}
              aria-pressed={theme === 'light'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="inline-flex items-center gap-1.5 rounded-lg border border-ink-700 bg-ink-850 px-3 py-1.5 text-xs font-medium text-ink-200 transition-colors hover:border-ink-600 hover:text-ink-50"
            >
              {theme === 'dark' ? (
                <Sun className="h-3.5 w-3.5" />
              ) : (
                <Moon className="h-3.5 w-3.5" />
              )}
              <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
              <span className="sr-only">
                {theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              </span>
            </button>
            <button
              type="button"
              onClick={onReload}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-ink-700 bg-ink-850 px-3 py-1.5 text-xs font-medium text-ink-200 transition-colors hover:border-ink-600 hover:text-ink-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${busy ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              type="button"
              onClick={onSignOut}
              className="inline-flex items-center gap-1.5 rounded-lg border border-ink-700 bg-ink-850 px-3 py-1.5 text-xs font-medium text-ink-200 transition-colors hover:border-ink-600 hover:text-ink-50"
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
            {/* Saying "live from production" over invented figures is exactly
                the confusion the demo badge exists to prevent, so the pill
                changes too rather than relying on the badge alone. */}
            {data.demo ? 'Sample data · not production' : 'Live from production'} · as of{' '}
            {formatTime(data.generatedAt)}
            {/* The countdown is what makes "live" checkable rather than a
                claim: a stalled poll shows as a timer stuck at zero. */}
            <span className="text-ink-500">
              ·{' '}
              {refreshing
                ? 'refreshing…'
                : secondsToRefresh > 0
                  ? `next in ${secondsToRefresh}s`
                  : 'refreshing…'}
            </span>
          </span>

          <p className="mt-6 text-sm font-medium text-brand-400">
            Hi {firstName(data.viewer)}, welcome back
          </p>
          <h1 className="mt-1.5 text-3xl font-bold tracking-tight text-ink-50 sm:text-[2rem]">
            Track your customers and users, live
          </h1>
          <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-ink-400">
            {data.demo
              ? 'Invented companies, shown so the console can be reviewed before real numbers flow through it. Nothing on this screen is a real customer.'
              : 'Every organization on Receipt, the integrations they run, how recently they signed in, and what they are asking Receipt to do — read straight from production and refreshed every fifteen seconds.'}
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

        {selected ? (
          <div className="mt-9">
            <CompanyDetail
              company={selected}
              prompts={selectedPrompts}
              onBack={() => setSelectedId(null)}
              onOpenPrompt={(prompt) => setOpenPromptId(prompt.messageId)}
            />
          </div>
        ) : (
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
                  {/* "Last prompt" is the truer activity signal of the two: a
                      login says someone opened the tab, this says they used
                      it. */}
                  <SortableHeader column={COLUMNS.lastPromptAt} sort={sort} onSort={onSort} />
                  <SortableHeader column={COLUMNS.activeSessions} sort={sort} onSort={onSort} />
                </tr>
              </thead>
              <tbody>
                {visible.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-16 text-center">
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
                          className="mt-4 rounded-lg border border-ink-700 bg-ink-850 px-3 py-1.5 text-xs font-medium text-ink-200 transition-colors hover:border-ink-600 hover:text-ink-50"
                        >
                          Clear filter
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  visible.map((company) => (
                    <CompanyRow
                      key={company.organizationId}
                      company={company}
                      onOpen={(row) => setSelectedId(row.organizationId)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          <PromptFeed
            prompts={visiblePrompts}
            filtered={Boolean(query.trim())}
            onOpen={(prompt) => setOpenPromptId(prompt.messageId)}
          />

          <p className="text-xs leading-relaxed text-ink-500">
            “Active sessions” counts sessions that have not expired, which can outlast someone
            actually being at their desk — it is not a measure of who is online now. Prompt counts
            cover what people typed into Receipt chat; background agent runs are excluded, and the
            feed shows the most recent prompts only, truncated, without the replies.
          </p>
        </div>
        )}
      </main>

      {/* Rendered last so it layers over the page, and driven by the resolved
          prompt rather than the id, so a prompt that ages out of the sample
          closes the panel instead of freezing it. */}
      {openPrompt && (
        <PromptInspector prompt={openPrompt} onClose={() => setOpenPromptId(null)} />
      )}

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
