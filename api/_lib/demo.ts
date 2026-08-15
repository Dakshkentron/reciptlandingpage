/* ------------------------------------------------------------------------- *
 *  TEMPORARY DEMO ACCESS — for looking at the console, not for using it
 *
 *  Lets one named person sign in and see invented data, so the page can be
 *  reviewed internally before real numbers are flowing through it.
 *
 *  This replaces an earlier version that hardcoded an email and password in
 *  the repository. That one was genuinely dangerous: the password was readable
 *  by anyone with access to the source, and it was on by default, so the
 *  console was open to anyone who happened to look. This one is different in
 *  three ways that matter:
 *
 *    1. It is OFF unless ADMIN_DEMO_EMAIL and ADMIN_DEMO_PASSWORD are both set
 *       in the environment. A checkout of this repo grants nobody anything.
 *    2. The credentials live in Vercel's environment settings, not in git.
 *    3. Turning it off is deleting an environment variable — no code change, no
 *       deploy, no PR. That is what makes "just for a few days" actually end
 *       after a few days.
 *
 *  It still shows invented data only. It never reads the production database,
 *  and every response it produces is badged in the UI as demo data. When it is
 *  no longer wanted: unset the two variables, then delete this file and the
 *  two blocks that reference it in api/admin/session.ts and api/admin/stats.ts.
 * ------------------------------------------------------------------------- */

import type { AdminOverview } from '../../src/lib/adminTypes';

/**
 * Prefix on the demo session cookie. The rest is derived from the configured
 * password, so the cookie cannot simply be typed in.
 *
 * A fixed value like `demo-mode` would have meant anyone could set that cookie
 * by hand and skip the password entirely. Only invented data sits behind it, so
 * the stakes are low — but "guess the cookie" should not be a way past a
 * password check, however small the prize.
 */
const DEMO_COOKIE_PREFIX = 'demo.';

function configured(): { email: string; password: string } | null {
  const email = process.env.ADMIN_DEMO_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_DEMO_PASSWORD;
  // Both, or nothing. A half-configured demo that accepts an empty password
  // would be the same hole this file exists to close.
  if (!email || !password) return null;
  return { email, password };
}

export function isDemoEnabled(): boolean {
  return configured() !== null;
}

/**
 * Constant-time-ish comparison on the password.
 *
 * Not because a timing attack on a demo account is a realistic threat, but
 * because `===` on a secret is a habit worth not forming.
 */
function matches(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function isDemoLogin(email: string, password: string): boolean {
  const demo = configured();
  if (!demo) return false;
  return email.trim().toLowerCase() === demo.email && matches(password, demo.password);
}

/**
 * The cookie value for the configured demo account.
 *
 * Derived from the password rather than being a constant, so it changes if the
 * password does — rotating `ADMIN_DEMO_PASSWORD` invalidates cookies handed out
 * under the old one, with no extra step.
 */
export async function demoCookieValue(): Promise<string | null> {
  const demo = configured();
  if (!demo) return null;

  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(`${demo.email}:${demo.password}`),
  );
  const hex = Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
  return `${DEMO_COOKIE_PREFIX}${hex}`;
}

export async function isDemoSession(cookie: string | null): Promise<boolean> {
  // Re-derives rather than comparing to a stored value, so removing or changing
  // the environment variables ends existing demo sessions immediately instead
  // of leaving whoever already signed in with a cookie that still works.
  if (!cookie || !cookie.startsWith(DEMO_COOKIE_PREFIX)) return false;
  const expected = await demoCookieValue();
  return expected !== null && matches(cookie, expected);
}

/**
 * Invented companies, shaped like the real thing.
 *
 * These read as ordinary customers on purpose: the point is to show what the
 * console looks like once real companies are in it, and rows that announce
 * themselves as fake in every cell cannot show that. The honesty lives in one
 * place instead — the "Demo data" badge in the header.
 *
 * Still chosen to exercise the layout rather than to flatter it: a very long
 * name, a company with no integrations at all, one with lapsed connections, one
 * that has never signed in, one that has never sent a prompt, and a spread of
 * counts so the columns, badges, and sorting can all be judged.
 */
export function demoOverview(): AdminOverview {
  const now = Date.now();
  const daysAgo = (days: number) => new Date(now - days * 86_400_000).toISOString();
  const minutesAgo = (mins: number) => new Date(now - mins * 60_000).toISOString();

  const companies = [
    {
      organizationId: 'demo-1',
      name: 'Northwind Trading',
      slug: 'northwind-trading',
      createdAt: daysAgo(3),
      members: 14,
      integrationsTotal: 5,
      integrationsValid: 5,
      providers: ['slack', 'github', 'aws', 'jira', 'notion'],
      lastLoginAt: daysAgo(0),
      activeSessions: 6,
      prompts: 1284,
      promptsLast7Days: 96,
      lastPromptAt: minutesAgo(4),
    },
    {
      organizationId: 'demo-2',
      name: 'Meridian Manufacturing Group Holdings',
      slug: 'meridian-manufacturing',
      createdAt: daysAgo(28),
      members: 42,
      integrationsTotal: 7,
      integrationsValid: 4,
      providers: ['slack', 'salesforce', 'google-drive', 'zendesk', 'hubspot', 'confluence', 'okta'],
      lastLoginAt: daysAgo(1),
      activeSessions: 11,
      prompts: 5310,
      promptsLast7Days: 412,
      lastPromptAt: minutesAgo(38),
    },
    {
      organizationId: 'demo-3',
      name: 'Lumen Labs',
      slug: 'lumen-labs',
      createdAt: daysAgo(64),
      members: 3,
      integrationsTotal: 2,
      integrationsValid: 1,
      providers: ['github', 'linear'],
      lastLoginAt: daysAgo(9),
      activeSessions: 0,
      prompts: 74,
      promptsLast7Days: 0,
      lastPromptAt: daysAgo(12),
    },
    {
      organizationId: 'demo-4',
      name: 'Atlas Freight',
      slug: 'atlas-freight',
      createdAt: daysAgo(91),
      members: 8,
      integrationsTotal: 0,
      integrationsValid: 0,
      providers: [],
      lastLoginAt: null,
      activeSessions: 0,
      prompts: 0,
      promptsLast7Days: 0,
      lastPromptAt: null,
    },
    {
      organizationId: 'demo-5',
      name: 'Bayside Health',
      slug: 'bayside-health',
      createdAt: daysAgo(120),
      members: 23,
      integrationsTotal: 4,
      integrationsValid: 4,
      providers: ['aws', 'datadog', 'pagerduty', 'slack'],
      lastLoginAt: daysAgo(2),
      activeSessions: 3,
      prompts: 2190,
      promptsLast7Days: 137,
      lastPromptAt: minutesAgo(210),
    },
  ];

  const recentPrompts = [
    {
      messageId: 'demo-p1',
      organizationId: 'demo-1',
      organizationName: 'Northwind Trading',
      text: 'Reconcile the March vendor invoices against the purchase orders and flag anything over 5% variance.',
      truncated: false,
      createdAt: minutesAgo(4),
      model: 'claude-opus-5',
    },
    {
      messageId: 'demo-p2',
      organizationId: 'demo-2',
      organizationName: 'Meridian Manufacturing Group Holdings',
      text: 'Which suppliers missed their delivery SLA last quarter, and what did it cost us in downtime? Break it down by plant and include the penalty clauses that were actually enforceable under the amended contracts',
      truncated: true,
      createdAt: minutesAgo(38),
      model: 'gpt-5',
    },
    {
      messageId: 'demo-p3',
      organizationId: 'demo-5',
      organizationName: 'Bayside Health',
      text: 'Draft the quarterly compliance summary from the incident log and highlight anything that needs board sign-off.',
      truncated: false,
      createdAt: minutesAgo(210),
      model: 'claude-opus-5',
    },
    {
      messageId: 'demo-p4',
      organizationId: 'demo-1',
      organizationName: 'Northwind Trading',
      text: 'Summarise last quarter revenue by region.',
      truncated: false,
      createdAt: daysAgo(1),
      model: 'claude-opus-5',
    },
    {
      messageId: 'demo-p5',
      organizationId: 'demo-2',
      organizationName: 'Meridian Manufacturing Group Holdings',
      text: 'Pull the headline numbers out of the consolidated financials and put them in a table I can paste into Slack.',
      truncated: false,
      createdAt: daysAgo(2),
      model: 'gpt-5',
    },
    {
      messageId: 'demo-p6',
      organizationId: 'demo-3',
      organizationName: 'Lumen Labs',
      text: 'Why did the nightly sync job fail on Tuesday?',
      truncated: false,
      createdAt: daysAgo(12),
      model: 'claude-opus-5',
    },
  ];

  const sum = (key: 'members' | 'integrationsTotal' | 'activeSessions' | 'prompts' | 'promptsLast7Days') =>
    companies.reduce((total, row) => total + row[key], 0);

  return {
    generatedAt: new Date(now).toISOString(),
    demo: true,
    totals: {
      companies: companies.length,
      members: sum('members'),
      integrations: sum('integrationsTotal'),
      activeSessions: sum('activeSessions'),
      prompts: sum('prompts'),
      promptsLast7Days: sum('promptsLast7Days'),
    },
    companies,
    recentPrompts,
    viewer: {
      id: 'demo',
      email: process.env.ADMIN_DEMO_EMAIL?.trim() ?? 'demo@kentron.ai',
      name: 'Demo',
    },
  };
}
