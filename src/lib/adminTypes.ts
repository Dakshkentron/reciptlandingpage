/**
 * Shape of the company metrics returned by Receipt.
 *
 * Mirrors `lib/shared/admin/admin-overview.ts` in the Receipt repo field for
 * field, so drift between the two surfaces here as a type error rather than a
 * blank column.
 *
 * The upstream query stays aggregate for everything except the prompt feed: no
 * email addresses, no assistant replies, no connection secrets, no tokens. Do
 * not widen these types to carry any of that.
 *
 * `AdminPromptRow` is the deliberate exception — it carries the text people type
 * into Receipt, truncated upstream. It exists because the console is meant to
 * answer "what are customers actually asking for", which counts alone cannot.
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
  /** User-typed prompts, all time. Assistant replies are not counted. */
  prompts: number;
  /** The same count over the last seven days, which is what "still active" means. */
  promptsLast7Days: number;
  lastPromptAt: string | null;
}

/** One prompt somebody typed. Carries no user id and no email, by design. */
export interface AdminPromptRow {
  messageId: string;
  organizationId: string;
  organizationName: string;
  /** Already truncated by Receipt; `truncated` says whether that happened. */
  text: string;
  truncated: boolean;
  createdAt: string | null;
  model: string | null;
}

export interface AdminTotals {
  companies: number;
  members: number;
  integrations: number;
  activeSessions: number;
  prompts: number;
  promptsLast7Days: number;
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
  recentPrompts: AdminPromptRow[];
  viewer: AdminViewer;
}
