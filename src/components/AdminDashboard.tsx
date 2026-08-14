/**
 * The company table.
 *
 * Every figure is live from Receipt's database at the moment the page loaded —
 * `generatedAt` records when, and is shown so a stale tab is never mistaken for
 * current numbers.
 */

import { useMemo, useState } from 'react';
import { Building2, Link2, LogOut, Radio, RefreshCw, Search, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import ReceiptMark from '@/components/ReceiptMark';
import type { AdminCompanyRow, AdminOverview, AdminTotals } from '@/lib/adminTypes';

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

function formatTime(value: string): string {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? 'unknown'
    : parsed.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-ink-800 bg-ink-900 p-5">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-ink-400">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="mt-2 font-mono text-3xl font-bold tabular-nums leading-none text-white">
        {numberFormat.format(value)}
      </div>
      <div className="mt-1.5 text-xs text-ink-500">{hint}</div>
    </div>
  );
}

function SummaryCards({ totals }: { totals: AdminTotals }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard icon={Building2} label="Companies" value={totals.companies} hint="Organizations on Receipt" />
      <StatCard icon={Users} label="Members" value={totals.members} hint="People across all companies" />
      <StatCard icon={Link2} label="Integrations" value={totals.integrations} hint="Connections created" />
      <StatCard
        icon={Radio}
        label="Active sessions"
        value={totals.activeSessions}
        hint="Sessions not yet expired"
      />
    </div>
  );
}

function CompanyRow({ company }: { company: AdminCompanyRow }) {
  const expired = Math.max(0, company.integrationsTotal - company.integrationsValid);

  return (
    <tr className="border-t border-ink-800 hover:bg-ink-900/60">
      <td className="px-5 py-4">
        <div className="font-medium text-ink-100">{company.name}</div>
        {company.slug && <div className="font-mono text-[11px] text-ink-500">{company.slug}</div>}
      </td>
      <td className="whitespace-nowrap px-5 py-4 text-ink-400">{formatDate(company.createdAt)}</td>
      <td className="px-5 py-4 text-right font-mono tabular-nums text-ink-200">
        {numberFormat.format(company.members)}
      </td>
      <td className="px-5 py-4">
        {company.providers.length === 0 ? (
          <span className="text-ink-500">None connected</span>
        ) : (
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap gap-1">
              {company.providers.map((provider) => (
                <span
                  key={provider}
                  className="rounded-full border border-ink-700 bg-ink-850 px-2.5 py-0.5 text-xs text-ink-200"
                >
                  {provider}
                </span>
              ))}
            </div>
            {/* Expired connections are the actionable signal: a company whose
                connections have lapsed has quietly stopped working. */}
            {expired > 0 && (
              <span className="w-fit rounded-full border border-accent-500/30 bg-accent-500/10 px-2.5 py-0.5 text-xs text-accent-200">
                {expired} need{expired === 1 ? 's' : ''} reconnecting
              </span>
            )}
          </div>
        )}
      </td>
      <td className="whitespace-nowrap px-5 py-4 text-ink-400">{formatDate(company.lastLoginAt)}</td>
      <td className="px-5 py-4 text-right font-mono tabular-nums text-ink-200">
        {numberFormat.format(company.activeSessions)}
      </td>
    </tr>
  );
}

interface Props {
  data: AdminOverview;
  onSignOut: () => void;
  onReload: () => void;
  busy: boolean;
}

export default function AdminDashboard({ data, onSignOut, onReload, busy }: Props) {
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return data.companies;
    return data.companies.filter(
      (company) =>
        company.name.toLowerCase().includes(needle) ||
        company.slug.toLowerCase().includes(needle) ||
        company.providers.some((provider) => provider.toLowerCase().includes(needle)),
    );
  }, [data.companies, query]);

  return (
    <div className="min-h-screen bg-ink-950 text-ink-200">
      <header className="border-b border-ink-800 bg-ink-900/60 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-5 py-4 lg:px-8">
          <div className="flex items-center gap-2">
            <ReceiptMark className="h-6 w-6 text-brand-500" paperClassName="text-ink-950" />
            <span className="font-bold text-white">Receipt</span>
            <span className="ml-1 rounded-full border border-ink-700 bg-ink-850 px-2 py-0.5 text-[11px] font-medium text-ink-300">
              Internal
            </span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-xs text-ink-400 sm:inline">{data.viewer.email}</span>
            <button
              type="button"
              onClick={onReload}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-ink-700 bg-ink-850 px-3 py-1.5 text-xs font-medium text-ink-200 transition-colors hover:border-ink-600 hover:text-white disabled:opacity-50"
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

      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <h1 className="text-2xl font-bold text-white">Companies</h1>
        <p className="mt-2 text-sm text-ink-400">
          Every organization on Receipt, the integrations they run, and how recently they signed
          in. Live as of {formatTime(data.generatedAt)}.
        </p>

        <div className="mt-8 flex flex-col gap-6">
          <SummaryCards totals={data.totals} />

          <div className="relative max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filter by company or integration"
              aria-label="Filter companies"
              className="w-full rounded-xl border border-ink-800 bg-ink-900 py-2 pl-9 pr-3 text-sm text-ink-100 placeholder:text-ink-500 focus:border-brand-500/50 focus:outline-none"
            />
          </div>

          {/* Wide content scrolls inside its own container so the page never does. */}
          <div className="overflow-x-auto rounded-2xl border border-ink-800">
            <table className="w-full min-w-[56rem] text-left text-sm">
              <thead className="bg-ink-900 text-xs uppercase tracking-wider text-ink-400">
                <tr>
                  <th className="px-5 py-3 font-medium">Company</th>
                  <th className="px-5 py-3 font-medium">Created</th>
                  <th className="px-5 py-3 text-right font-medium">Members</th>
                  <th className="px-5 py-3 font-medium">Integrations</th>
                  <th className="px-5 py-3 font-medium">Last login</th>
                  <th className="px-5 py-3 text-right font-medium">Active sessions</th>
                </tr>
              </thead>
              <tbody className="bg-ink-950/40">
                {visible.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-ink-500">
                      {query ? 'No companies match that filter.' : 'No companies yet.'}
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

          <p className="text-xs text-ink-500">
            “Active sessions” counts sessions that have not expired, which can outlast someone
            actually being at their desk — it is not a measure of who is online now.
          </p>
        </div>
      </main>
    </div>
  );
}
