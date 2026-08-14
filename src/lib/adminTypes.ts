/**
 * Shape of the company metrics returned by Receipt.
 *
 * Mirrors `lib/shared/admin/admin-overview.ts` in the Receipt repo field for
 * field, so drift between the two surfaces here as a type error rather than a
 * blank column.
 *
 * The upstream query is aggregate-only by design: no email addresses, no
 * message or chat content, no connection secrets, no tokens. Do not widen these
 * types to carry any of that.
 */

export interface AdminCompanyRow {
  organizationId: string;
  name: string;
  slug: string;
  createdAt: string | null;
  members: number;
  integrationsTotal: number;
  integrationsValid: number;
  providers: string[];
  lastLoginAt: string | null;
  /** Sessions that have not expired — not a count of who is online right now. */
  activeSessions: number;
}

export interface AdminTotals {
  companies: number;
  members: number;
  integrations: number;
  activeSessions: number;
}

export interface AdminViewer {
  id: string;
  email: string;
  name: string;
}

export interface AdminOverview {
  /** When Receipt ran the query, not when this page rendered it. */
  generatedAt: string;
  totals: AdminTotals;
  companies: AdminCompanyRow[];
  viewer: AdminViewer;
  /**
   * Set only by the temporary preview account. The page shows a banner when it
   * is true, so invented figures can never be read as real customers. Real
   * responses from Receipt never carry it.
   */
  preview?: boolean;
}
