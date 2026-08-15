/* ------------------------------------------------------------------------- *
 *  TEMPORARY PREVIEW ACCESS — DELETE BEFORE THIS CONSOLE IS USED FOR REAL
 *
 *  Exists only so the admin console can be looked at before Receipt's
 *  /api/admin-metrics endpoint is deployed. It bypasses every authentication
 *  check for one hardcoded account and answers with invented data.
 *
 *  To remove it: delete this file, then the two blocks marked TEMPORARY in
 *  api/admin/session.ts and api/admin/stats.ts. Nothing else depends on it.
 *
 *  While this file exists, anyone who knows the password below can open the
 *  console. That is tolerable only because it shows no real data — every
 *  company here is invented and labelled as such. It must not survive the
 *  moment real customer numbers start flowing.
 * ------------------------------------------------------------------------- */

import type { AdminOverview } from '../../src/lib/adminTypes';

const PREVIEW_EMAIL = 'djain@kentron.ai';
const PREVIEW_PASSWORD = 'dakshkentron';

/** Marks the session cookie as a preview one, so stats knows to invent data. */
export const PREVIEW_COOKIE_VALUE = 'preview-mode';

export function isPreviewLogin(email: string, password: string): boolean {
  return email.trim().toLowerCase() === PREVIEW_EMAIL && password === PREVIEW_PASSWORD;
}

export function isPreviewSession(cookie: string | null): boolean {
  return cookie === PREVIEW_COOKIE_VALUE;
}

/**
 * Invented companies, shaped like the real thing.
 *
 * These read as ordinary customers on purpose: the point of the preview is to
 * show what the console looks like once real companies are in it, and rows that
 * announce themselves as fake in every cell cannot show that. The honesty lives
 * in one place instead — the "Demo data" badge in the header, which is present
 * for exactly as long as this file is.
 *
 * Still chosen to exercise the layout rather than to flatter it: a very long
 * name, a company with no integrations at all, one with lapsed connections, one
 * that has never signed in, and a spread of counts so the columns, badges, and
 * sorting can all be judged.
 */
export function previewOverview(): AdminOverview {
  const now = Date.now();
  const daysAgo = (days: number) => new Date(now - days * 86_400_000).toISOString();

  const companies = [
    {
      organizationId: 'sample-1',
      name: 'Northwind Trading',
      slug: 'northwind-trading',
      createdAt: daysAgo(3),
      members: 14,
      integrationsTotal: 5,
      integrationsValid: 5,
      providers: ['slack', 'github', 'aws', 'jira', 'notion'],
      lastLoginAt: daysAgo(0),
      activeSessions: 6,
    },
    {
      organizationId: 'sample-2',
      name: 'Meridian Manufacturing Group Holdings',
      slug: 'meridian-manufacturing',
      createdAt: daysAgo(28),
      members: 42,
      integrationsTotal: 7,
      integrationsValid: 4,
      providers: ['slack', 'salesforce', 'google-drive', 'zendesk'],
      lastLoginAt: daysAgo(1),
      activeSessions: 11,
    },
    {
      organizationId: 'sample-3',
      name: 'Lumen Labs',
      slug: 'lumen-labs',
      createdAt: daysAgo(64),
      members: 3,
      integrationsTotal: 2,
      integrationsValid: 1,
      providers: ['github', 'linear'],
      lastLoginAt: daysAgo(9),
      activeSessions: 0,
    },
    {
      organizationId: 'sample-4',
      name: 'Atlas Freight',
      slug: 'atlas-freight',
      createdAt: daysAgo(91),
      members: 8,
      integrationsTotal: 0,
      integrationsValid: 0,
      providers: [],
      lastLoginAt: null,
      activeSessions: 0,
    },
    {
      organizationId: 'sample-5',
      name: 'Bayside Health',
      slug: 'bayside-health',
      createdAt: daysAgo(120),
      members: 23,
      integrationsTotal: 4,
      integrationsValid: 4,
      providers: ['aws', 'datadog', 'pagerduty', 'slack'],
      lastLoginAt: daysAgo(2),
      activeSessions: 3,
    },
  ];

  return {
    generatedAt: new Date(now).toISOString(),
    preview: true,
    totals: {
      companies: companies.length,
      members: companies.reduce((sum, row) => sum + row.members, 0),
      integrations: companies.reduce((sum, row) => sum + row.integrationsTotal, 0),
      activeSessions: companies.reduce((sum, row) => sum + row.activeSessions, 0),
    },
    companies,
    viewer: { id: 'preview', email: PREVIEW_EMAIL, name: 'Daksh' },
  };
}
